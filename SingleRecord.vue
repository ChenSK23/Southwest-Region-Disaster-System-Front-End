<template>
  <div class="main-container">
    <!-- 头部 -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <img src="../../public/民族院校.png" alt="Logo" class="logo-image" />
          <span class="logo-text">灾害文化数据库</span>
        </div>
        <el-button-group class="action-buttons">
          <el-button 
            type="primary" 
            :icon="House"
            @click="backhome"
          >首页</el-button>
          <el-button 
            type="success" 
            :icon="Document"
            @click="downloadData1"
          >下载概要</el-button>
          <el-button 
            type="warning" 
            :icon="Download"
            @click="downloadData2"
          >下载详细</el-button>
          <el-button 
            type="info" 
            :icon="MapLocation"
            @click="showgis"
          >地图检索</el-button>
        </el-button-group>
      </div>
      <div class="header-center">
        <h1 class="page-title">记录库数据</h1>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button 
            type="info" 
            :icon="Plus"
            @click="drawer = true"
          >添加记录</el-button>
          <el-button 
            type="danger" 
            :icon="SwitchButton"
            @click="logout"
          >注销</el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧表格部分 -->
      <div class="table-section">
        <div class="table-container">
          <!-- 表格标题和功能区 -->
          <div class="table-header">
            <div class="table-title">资料库数据</div>
            <div class="table-actions">
              <el-switch
                v-model="value5"
                class="ml-2"
                inline-prompt
                :active-action-icon="View"
                :inactive-action-icon="Hide"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="收起搜索框"
                inactive-text="展示搜索框"
                @click="toggleSidebar"
              />
            </div>
          </div>

          <!-- 表格主体 -->
          <div class="table-wrapper">
            <el-table
              v-loading="loading"
              :data="tableData"
              style="width: 100%"
              border
              :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
              height="calc(100vh - 280px)"
            >
              <el-table-column type="selection" width="55" align="center" fixed="left" />
              <el-table-column prop="tm" label="志书名称" min-width="200" show-overflow-tooltip />
              <el-table-column prop="nrty" label="内容" min-width="300" show-overflow-tooltip />
              <el-table-column prop="lssj" label="历史时间" min-width="120" show-overflow-tooltip />
              <el-table-column prop="gysj" label="公元时间" min-width="120" show-overflow-tooltip />
              <el-table-column prop="yjbld" label="一级辖区" min-width="150" show-overflow-tooltip />
              <el-table-column prop="ejzq" label="二级辖区" min-width="150" show-overflow-tooltip />
              <el-table-column prop="sjzq" label="三级辖区" min-width="150" show-overflow-tooltip />
              <el-table-column prop="zhlx" label="灾害类型" min-width="120" show-overflow-tooltip />
              <el-table-column prop="zz" label="作者" min-width="150" show-overflow-tooltip />
              <el-table-column fixed="right" label="操作" width="240">
                <template #default="scope">
                  <el-button-group>
                    <el-button type="primary" size="small" @click="handleDetail(scope.row)">详细信息</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      :disabled="!hasImage(row)"
                      @click="handleMedia(row, 'image')">
                      图片
                    </el-button>

                    <el-button
                      type="success"
                      size="small"
                      :disabled="!hasVideo(row)"
                      @click="handleMedia(row, 'video')">
                      视频
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页器 -->
          <div class="pagination-container">
            <div class="pagination-left">
              <el-button type="primary" plain @click="toggleSelection(selectedRows)">清除选择</el-button>
            </div>
            <div class="pagination-right">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[20, 30, 40, 50]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧搜索部分 -->
      <div v-if="showSidebar" class="search-section">
        <el-scrollbar>
          <div class="search-form">
            <el-form :model="searchForm" label-width="100px">
              <el-form-item label="志书名称">
                <el-input v-model="searchForm.tm" placeholder="请输入志书名称" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="作者">
                <el-input v-model="searchForm.zz" placeholder="请输入作者" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="内容提要">
                <el-input v-model="searchForm.nrty" placeholder="请输入内容提要" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="历史时间">
                <el-input v-model="searchForm.lssj" placeholder="请输入历史时间" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="公元时间">
                <el-input v-model="searchForm.gysj" placeholder="请输入公元时间" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="一级辖区">
                <el-input v-model="searchForm.yjzq" placeholder="请输入一级辖区" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="二级辖区">
                <el-input v-model="searchForm.ejzq" placeholder="请输入二级辖区" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="三级辖区">
                <el-input v-model="searchForm.sjzq" placeholder="请输入三级辖区" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="灾害类型">
                <el-input v-model="searchForm.zhlx" placeholder="请输入灾害类型" clearable @input="handleSearch" />
              </el-form-item>
              <el-form-item label="民族">
                <el-input v-model="searchForm.mz" placeholder="请输入民族" clearable @input="handleSearch" />
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <div class="footer_content">
        <div class="footer_text">
          <p>中央民族大学历史文化学院</p>
          <p>中国西南少数民族灾害文化数据库</p>
          <p>zhouqiong1108@126.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { View, Hide, Plus, House, RefreshLeft, MapLocation, Document } from '@element-plus/icons-vue';
import Original_Pre_Search from './OR_Components/Original_Pre_Search.vue';

// 基础状态变量
const loading = ref(false);
const showSidebar = ref(true);
const value5 = ref(true);
const selectedRows = ref([]);
const isDark = ref(false);
const multipleTableRef = ref(null);
const router = useRouter();
const drawer = ref(false);
const backgroundImage = ref('');

// 表格数据相关
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);  // 添加total变量
const originalData = ref(inject('OriginalData2', []));

// 搜索表单数据
const searchForm = ref({
  tm: '',
  zz: '',
  nrty: '',
  lssj: '',
  gysj: '',
  yjzq: '',
  ejzq: '',
  sjzq: '',
  zhlx: '',
  mz: ''
})

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// 处理表格选择
const handleSelectionChange = (val) => {
  selectedRows.value = val;
};

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach(row => {
      multipleTableRef.value?.toggleRowSelection(row);
    });
  } else {
    multipleTableRef.value?.clearSelection();
  }
};

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true;
  try {
    const timestamp = Date.now();
    const url = `https://sjs.muc.edu.cn/sjs/zhsj/zhsj/list?_t=${timestamp}&column=createTime&order=desc&field=id,,,tm,zz,nrty,mz,sq,lssj,gysj,zlxcsj,zlfbsj,kzbz,zrr,sffj,ylzd&pageNo=${currentPage.value}&pageSize=${pageSize.value}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.result) {
      tableData.value = data.result.records;
      total.value = data.result.total || data.result.records.length;
    } else {
      throw new Error("Data fetch failed or data format is incorrect");
    }
  } catch (error) {
    console.error("Fetching data failed:", error);
    ElMessage.error('获取数据失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};


// 分页处理函数
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchTableData();
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
  fetchTableData();
};

// 操作按钮处理函数
const handleDetail = (row) => {
  window.open(`/detail?id=${row.id}`, '_blank');
};

// 判断当前行是否有图片附件
const hasImage = (row) => {
  return row.attachments?.some(attach => 
    attach.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
  );
};

// 处理图片按钮点击事件
const handleImage = (row) => {
  const imageUrl = getAttachmentUrl(row, '.jpg');  // 获取图片附件的URL
  if (imageUrl) {
    router.push({ name: 'imageview', query: { url: imageUrl } });
  }
};

// 判断当前行是否有视频附件
const hasVideo = (row) => {
  return row.attachments?.some(attach => 
    attach.name.toLowerCase().match(/\.(mp4|avi|mov|wmv)$/)
  );
};

// 处理视频按钮点击事件
const handleVideo = (row) => {
  const videoUrl = getAttachmentUrl(row, '.mp4');  // 获取视频附件的URL
  if (videoUrl) {
    router.push({ name: 'VideoView', query: { url: videoUrl } });
  }
};

// 获取附件URL方法优化
const getAttachmentUrl = (row, type) => {
  const patterns = {
    image: /\.(jpg|jpeg|png|gif)$/i,
    video: /\.(mp4|avi|mov|wmv)$/i
  };
  
  const attachment = row.attachments?.find(attach => 
    attach.name.toLowerCase().match(patterns[type])
  );
  
  return attachment ? 
    `http://sjs.muc.edu.cn:8080${attachment.url}` : // 拼接完整URL
    null;
};

// 按钮处理逻辑
const handleMedia = (row, type) => {
  const mediaUrl = getAttachmentUrl(row, type);
  if (!mediaUrl) return;

  const routeName = type === 'image' ? 'imageview' : 'VideoView';
  router.push({
    name: routeName,
    query: { 
      url: encodeURIComponent(mediaUrl),
      name: row.attachments.find(a => a.url === mediaUrl).name 
    }
  });
};


// 实时搜索处理
const handleSearch = () => {
  // 检查是否所有搜索字段都为空
  const isAllEmpty = Object.values(searchForm.value).every(value => !value.trim())
  
  if (isAllEmpty) {
    // 如果所有字段都为空，恢复原始数据
    tableData.value = originalData.value
    total.value = originalData.value.length
    return
  }

  const filteredData = originalData.value.filter(item => {
    return Object.keys(searchForm.value).some(key => {
      const searchValue = searchForm.value[key].trim().toLowerCase()
      if (!searchValue) return false // 跳过空的搜索条件
      
      const itemValue = String(item[key] || '').toLowerCase()
      // 使用模糊匹配，只要包含任意搜索词就匹配
      const searchTerms = searchValue.split(/\s+/)
      return searchTerms.some(term => itemValue.includes(term))
    })
  })
  
  total.value = filteredData.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
}

// 跳转到地图页面
const showgis = () => {
  router.push('/periods/qing')
}

// 组件挂载时获取第一页数据
onMounted(() => {
  fetchTableData();
});

const logout = () => {
  localStorage.setItem('isAuthenticated', false)
  router.push({
    path: "/login",
  });
}

const backhome = () => {
  router.push({
    path: "/home",
  });
};

const downloadData1 = () => {
  const filePath = '中国西南少数民族灾害文化数据库内容概要0825.pdf';
  const url = process.env.BASE_URL + filePath;
  window.open(url, '_blank');
};

const downloadData2 = () => {
  const filePath = '中国西南少数民族灾害文化数据库用户操作指南.pdf';
  const url = process.env.BASE_URL + filePath;
  window.open(url, '_blank');
};
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.header {
  height: 64px;
  padding: 0 24px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 24px;
  border-right: 1px solid #dcdfe6;
}

.logo-image {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.action-buttons {
  margin-left: 24px;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.el-button-group {
  display: flex;
  gap: 8px;
}

.el-button-group .el-button {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  border-radius: 4px;
}

.el-button-group .el-button [class*="el-icon"] + span {
  margin-left: 6px;
}

:deep(.el-button--primary) {
  --el-button-bg-color: #409eff;
  --el-button-border-color: #409eff;
  --el-button-hover-bg-color: #79bbff;
  --el-button-hover-border-color: #79bbff;
}

:deep(.el-button--success) {
  --el-button-bg-color: #67c23a;
  --el-button-border-color: #67c23a;
  --el-button-hover-bg-color: #95d475;
  --el-button-hover-border-color: #95d475;
}

:deep(.el-button--warning) {
  --el-button-bg-color: #e6a23c;
  --el-button-border-color: #e6a23c;
  --el-button-hover-bg-color: #eebe77;
  --el-button-hover-border-color: #eebe77;
}

:deep(.el-button--danger) {
  --el-button-bg-color: #f56c6c;
  --el-button-border-color: #f56c6c;
  --el-button-hover-bg-color: #f89898;
  --el-button-hover-border-color: #f89898;
}

:deep(.el-button--info) {
  --el-button-bg-color: #909399;
  --el-button-border-color: #909399;
  --el-button-hover-bg-color: #b1b3b8;
  --el-button-hover-border-color: #b1b3b8;
}

.content-wrapper {
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
  min-height: 0; /* 重要：防止flex子元素溢出 */
  overflow: hidden;
}

.table-section {
  flex: 1;
  min-width: 0; /* 重要：防止表格溢出 */
  display: flex;
  flex-direction: column;
}

.search-section {
  width: 300px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.table-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.table-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
}

.pagination-container {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #dcdfe6;
  background-color: #fff;
}

.footer {
  height: 60px;
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
  padding: 10px 0;
  text-align: center;
}

.footer_content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer_text {
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

.footer_text p {
  margin: 0;
}

:deep(.el-table__header) {
  background-color: #f5f7fa;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

.el-button-group {
  display: flex;
  gap: 8px;
}

.el-button-group .el-button {
  margin: 0;
}

:deep(.el-table) {
  width: 100% !important;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  bottom: 0 !important;
}

:deep(.el-table__fixed-right-patch) {
  background: #f5f7fa;
}

:deep(.el-table .el-table__cell) {
  padding: 8px 0;
}

:deep(.el-table .el-button-group) {
  display: flex;
  gap: 4px;
}

:deep(.el-table .el-button) {
  padding: 4px 8px;
}

.search-form {
  padding: 20px;
}

.search-form .el-form-item {
  margin-bottom: 16px;
}

.search-form .el-input {
  width: 100%;
}
</style>
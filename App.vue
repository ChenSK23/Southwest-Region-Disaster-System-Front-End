<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';

// 表格相关数据
const OriginalData2 = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20); // 每页20条数据
const loading = ref(false);

// 获取表格数据
const fetchData = async () => {
  try {
    loading.value = true;
    const timestamp = Date.now();
    const url = `https://sjs.muc.edu.cn/sjs/zhsj/zhsj/list?_t=${timestamp}&column=createTime&order=desc&field=id,,,tm,zz,nrty,mz,sq,lssj,gysj,zlxcsj,zlfbsj,kzbz,zrr,sffj,ylzd&pageNo=${currentPage.value}&pageSize=${pageSize.value}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const data = await response.json();

    if (data.result && Array.isArray(data.result.records)) {
      OriginalData2.value = data.result.records;
      total.value = data.result.total;

      // 获取附件数据
      await fetchAttachments(); // 在获取表格数据后，获取附件数据
    } else {
      console.error('Unexpected data format:', data);
      OriginalData2.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('There was an error fetching the data:', error);
    OriginalData2.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 获取附件数据
const fetchAttachments = async () => {
  for (const row of OriginalData2.value) {
    try {
      const ccid = row.ccid;
      const attachmentUrl = `http://sjs.muc.edu.cn:8080/zhsj/zhsj/getAllFj?ccid=${ccid}`;
      const response = await fetch(attachmentUrl);

      if (!response.ok) throw new Error(`Network error (${response.status})`);

      const attachmentData = await response.json();

      if (attachmentData.success && Array.isArray(attachmentData.result)) {
        row.attachments = attachmentData.result.map(attachment => ({
          name: attachment.nam,  // 使用返回的nam字段
          // 转换本地路径为服务器访问路径（示例路径需根据实际服务调整）
          url: attachment.path
            .replace('H:\\西南民族地区重大自然灾害\\', '/attachments/')
            .replace(/\\/g, '/')
            .replace('/周琼重大项目田野资料-压缩/Success/', '')
        }));
      } else {
        row.attachments = [];
      }
    } catch (error) {
      console.error('附件获取失败:', error);
      row.attachments = [];
    }
  }
};

// 获取第一页数据
onMounted(() => {
  fetchData();  // 初始化时加载数据
});

// 分页处理函数
const nextPage = () => {
  currentPage.value++;  // 下一页
  fetchData();  // 重新获取数据
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();  // 重新加载数据
  }
};

// 提供数据给子组件
provide('OriginalData2', OriginalData2);
provide('total', total);
provide('currentPage', currentPage);
provide('pageSize', pageSize);
provide('nextPage', nextPage);
provide('previousPage', previousPage);

</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>

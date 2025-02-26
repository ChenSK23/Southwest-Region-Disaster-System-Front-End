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

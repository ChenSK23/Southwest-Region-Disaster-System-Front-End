const express = require('express');
const app = express();
const path = require('path');

// 假设文件存储在 D:/西南民族地区重大自然灾害 文件夹中
app.use('/attachments', express.static(path.resolve('D:/西南民族地区重大自然灾害')));

// 监听端口
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

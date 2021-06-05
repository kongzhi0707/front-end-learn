
const fs = require('fs');
const archiver = require('archiver');

// 创建文件输出流
const output = fs.createWriteStream(__dirname + '/dist.zip');
const arch = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

// 监听 文件输出流结束
output.on('close', function() {
  console.log(`总共 ${arch.pointer()} 字节`);
  console.log('arch完成文件的归档，文件输出流描述符已关闭');
});

// 监听 数据源是否耗尽
output.on('end', function() {
  console.log('数据源已耗尽');
});

// 监听 存档警告
arch.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('stat故障或其他非阻塞错误');
  } else {
    throw err;
  }
});

// 监听 存档出错
arch.on('error', function(err) {
  throw err;
});

// 通过管道方法将输出流存档到文件 
arch.pipe(output);

// 从流中追加文件 
const index = __dirname + '/index.html';
arch.append(fs.createReadStream(index), {name: 'index.html'});

// 从子目录追加文件并将其命名为 新 子目录 在存档中
arch.directory('static/', 'static');

// 完成归档
arch.finalize();
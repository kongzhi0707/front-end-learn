### nodejs使用archive文件压缩

  archive 是一个在nodeJS中能跨平台实现打包功能的模块，可以将文件压缩为zip或rar格式。

  官方文档请看这里 <a href="https://github.com/archiverjs/node-archiver">archive官网</a>

#### 1. 安装包
```
npm install archiver --save
```
  使用方法我们按照官网来做即可：假如我们的目录是如下这样的：
```
｜--- file1.txt
｜--- index.js
｜--- package.json
```
  file1.txt 文件内容如下：
```
this is file1
```
  index.js 代码如下：
```
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
const file1 = __dirname + '/file1.txt';
arch.append(fs.createReadStream(file1), {name: 'file1.txt'});

// 从字符串中追加文件 会生成 file2.txt文件，内容为：string xxx
arch.append('string xxx', { name: 'file2.txt' });

// 从缓冲区中追加文件 会生成 file3.txt文件，内容为：buff xxx
const buffer3 = Buffer.from('buff xxx');
arch.append(buffer3, {name: 'file3.txt'});

// 再复制一个文件 名字为 file4.txt，内容和 file1.txt 一样 
arch.file('file1.txt', { name: 'file4.txt' });

// 完成归档
arch.finalize();
```
  执行 node index.js 后 打印如下信息：
```
总共 510 字节
arch完成文件的归档，文件输出流描述符已关闭
```
  然后在目录下会生成 dist.zip 文件，解压该压缩包，可以看到有 file1.txt, file2.txt, file3.txt 及 file4.txt 文件。

#### 2. 压缩文件和目录

  比如我们现在项目的目录结构如下：
```
｜--- index.html
｜--- index.js
｜--- package.json
｜--- static
｜ ｜--- css
｜ ｜ ｜--- index.css
｜ ｜--- img 
｜ ｜ ｜--- 1.jpg
｜ ｜--- js
｜ ｜ ｜--- index.js
```
  代码如下：
```
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
```
  执行 node index.js 命令后，在项目根目录会生成 dist.zip 文件，我们将其进行解压，可以看到有 index.html 文件 及 static目录，该目录下有 css，js，img 文件夹。会有对应的文件。也就是说，archive 可以对文件或目录进行压缩，压缩后生成 dist.zip 文件。
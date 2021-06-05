### Node实现前端自动化部署(一)

### 前言---前端项目部署

  前端项目部署时，一般在nginx配置完成后，我们需要将打包后的文件上传到指定的服务器目录下即可。

  传统的有如下方式完成：
  1. xshell 等命令工具完成。<a href="https://www.cnblogs.com/tugenhua0707/p/8278772.html">请看我之前的文章</a> <br />
  2. ftp等可视化工具上传。<br />
  3. jenkins等自动化部署服务。<a href="https://www.cnblogs.com/tugenhua0707/p/11949644.html">请看我之前的文章</a> <br />

  使用xshell和ftp部署项目比较繁琐，并且xshell一直需要使用命令来操作。而jenkins等自动化部署服务需要安装环境，并且需要熟悉配置流程，相对来说比较麻烦。因此我们希望使用node服务实现对前端打包后的文件进行本地压缩，上传工作。我们只需要配置一下config.js文件，我们进入项目的根目录下，执行一个命令行，比如 npm run deploy 这个命令就可以把我们本地打包后的文件进行上传到服务器上了。

  <a href="https://github.com/tugenhua0707/fe-deploy-cli-template/tree/master/my-auto-deploy">github 项目代码查看</a>
  
  使用node实现自动化部署，一般要经过如下几个流程：
```
  1. 读取配置文件(config.js) 
  2. 本地压缩文件(compressFileZip.js)
  3. ssh服务器链接(connectServer.js)
  4. 上传文件(uploadFile.js) 
  5. 远端解压文件(unzipFile.js)
  6. 修改发布目录 
  7. 删除本地压缩文件zip(deleteLocalZip.js)
```
  因此自动化部署项目目录结构基本如下：
```
｜--- my-auto-deploy(项目)
｜ ｜--- utils
｜ ｜ ｜--- config.js(配置文件)
｜ ｜ ｜--- compressFileZip.js(本地项目dist文件压缩成zip文件)
｜ ｜ ｜--- connectServer.js (ssh服务器链接操作)
｜ ｜ ｜--- uploadFile.js (上传文件, 把本地zip文件上传到远程服务器目录下)
｜ ｜ ｜--- unzipFile.js (远程服务器下zip文件进行解压)
｜ ｜ ｜--- deleteLocalZip.js (删除本地zip文件包)
｜ ｜ ｜--- logger.js (使用chalk包封装一些成功，失败使用不同颜色提示信息)
｜ ｜ ｜--- runCommand.js (调用ssh.execCommand执行linux命令)
｜ ｜ ｜--- helper.js (使用inquirer.js进行命令行交互操作)
｜ ｜--- app.js (入口文件，分别执行node自动部署的相关js)
｜ ｜--- config.js (配置文件，配置开发环境或线上环境的一些配置项)
｜ ｜--- package.json
｜ ｜--- .gitignore
｜ ｜--- node_modules
```
  我们首先看 utils/config.js, 该文件是项目的配置文件，项目打包到服务器中依赖这个配置文件。基本配置代码如下：
```
const config = [
  {
    name: '项目A-dev',
    ssh: {
      host: '39.97.218.178', // 测试服务器地址 也就是阿里云服务器公网的ip地址
      post: 22, // ssh port 默认22
      username: 'root', // 登录服务器用户名
      password: '', // 登录服务器密码
      privateKey: '', // 本地私钥地址，比如 xxx/.ssh/id_rsa  非必填，有私钥 就配置
      passphrase: '', // 本地私钥密码, 非必填，有私钥 就配置
    },
    // 项目通过webpack打包后生成的dist文件目录（可使用相对地址）
    targetDir: '/Users/tugenhua/work/learn/react-collection/webpack+react+demo/dist',  
    targetFile: 'dist.zip', // 目标文件
    openBackUp: true, // 是否开启远端备份
    deployDir: '/usr/local/nginx/html' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  },
  {
    name: '项目A-线上',
    ssh: {
      host: '39.97.218.178', // 线上服务器地址 也就是阿里云服务器公网的ip地址
      post: 22, // ssh port 默认22
      username: 'root', // 登录服务器用户名
      password: '', // 登录服务器密码
      privateKey: '', // 本地私钥地址，比如 xxx/.ssh/id_rsa  非必填，有私钥 就配置
      passphrase: '', // 本地私钥密码, 非必填，有私钥 就配置
    },
    // 项目通过webpack打包后生成的dist文件目录（可使用相对地址）
    targetDir: '/Users/tugenhua/work/learn/react-collection/webpack+react+demo/dist',  
    targetFile: 'dist.zip', // 目标文件
    openBackUp: true, // 是否开启远端备份
    deployDir: '/usr/local/nginx/html' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  }
];
module.exports = config;
```
#### 1. 压缩文件（utils/compressFileZip.js）

  我们首先通过config.js 指定配置项 targetDir，该配置项就是我们本地项目打包后生成的dist文件的目录。比如我们本地有个项目名叫 webpack+react+demo, 通过打包后在项目的根目录生成dist文件夹，它的全路径为：'/Users/tugenhua/work/learn/react-collection/webpack+react+demo/dist'; 因此 targetDir = '/Users/tugenhua/work/learn/react-collection/webpack+react+demo/dist'; 配置即可。 
  然后我们首先会找到该目录文件进行本地压缩; nodejs使用archive文件压缩, <a href="https://github.com/tugenhua0707/react-collection/blob/master/autoDeployment/archive.md">了解archive文件压缩</a> 。

  utils/compressFileZip.js 代码如下：
```
const archiver = require('archiver');
const fs = require('fs');
const { startLog, successLog, errorLog } = require('./logger');

// 开始压缩
function compressFileZip(targetDir, localFile) {
  return new Promise((resolve, reject) => {
    startLog('1-正在压缩文件...');
    const output = fs.createWriteStream(localFile); // 创建文件输出流
    const arch = archiver('zip', {
      zlib: { level: 9 },
    });
    output.on('close', () => {
      successLog(`2-压缩完成！共计 ${arch.pointer()} 字节`);
      resolve();
    }).on('error', (err) => {
      errorLog(console.error('压缩失败', err));
      reject();
    })
    arch.pipe(output); // 管道存档数据到文件
    arch.directory(targetDir, 'dist'); // 存储目标文件并重命名
    arch.finalize(); // 完成文件归档
  });
}
module.exports = compressFileZip;
```
  如上参数：targetDir = '/Users/tugenhua/work/learn/react-collection/webpack+react+demo/dist'; 
  localFile = __dirname + '/' + SELECT_CONFIG.targetFile = __dirname + '/' + 'dist.zip'; localFile 是待上传本地文件目录。
  因此如上compressFileZip函数的含义是：通过找到 '/Users/tugenhua/work/learn/react-collection/webpack+react+demo/dist' 目录下的文件进行压缩，压缩完成后的文件目录为 __dirname + '/' + 'dist.zip'; 也就是当前项目my-auto-deploy上传文件包的根目录下会有一个 dist.zip文件。
  压缩完成后，我们需要链接ssh服务器。ssh服务器链接完成后，我们需要使用ssh进行文件上传。因此我们先来看ssh链接服务器代码。

#### 2. 链接ssh服务器 (utils/connectServer.js)

  链接ssh服务器，使用到的包是：node-ssh. 可以去npm包中 <a href="https://www.npmjs.com/package/node-ssh">了解node-ssh</a>

  代码如下：
```
// 链接远端ssh服务器
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const { successLog, errorLog } = require('./logger');

function connectServer(sshInfo) {
  return new Promise((resolve, reject) => {
    ssh.connect({...sshInfo}).then(() => {
      successLog('3-' + sshInfo.host + ' 连接成功')
      resolve();
    }).catch(err => {
      errorLog('3-'+sshInfo.host + '连接失败', err)
      reject();
      process.exit(0);
    });
  });
}

module.exports = {
  ssh,
  connectServer
};
```
  其中 sshInfo 参数就是我们config.js配置中的ssh配置值如下：
```
{
  host: '39.97.218.178', // 测试服务器地址 也就是阿里云服务器公网的ip地址
  post: 22, // ssh port 默认22
  username: 'root', // 登录服务器用户名
  password: '', // 登录服务器密码
  privateKey: '', // 本地私钥地址，比如 xxx/.ssh/id_rsa  非必填，有私钥 就配置
  passphrase: '', // 本地私钥密码, 非必填，有私钥 就配置
}
```
#### 3. 上传文件(utils/uploadFile.js)

  我们在上面第一步压缩文件会把 dist.zip 文件压缩到我们的 my-auto-deploy 项目的根目录下 dist.zip 文件。因此我们需要找到该dist.zip文件然后进行
上传到我们服务器下指定的目录下。因此会使用 ssh.putFile 这个方法，把本地文件上传到指定目录下文件去，该方法接受2个参数，第一个为本地文件 dist.zip
目录所在位置，第二个就是远程服务器文件指定的位置。基本代码如下所示：
```
const runCommand = require('./runCommand');
const getCurrentTime = require('./handleTime');
const { startLog, successLog, errorLog } = require('./logger');

// 上传文件
async function uploadFile(ssh, config, localFile) {
  return new Promise((resolve, reject) => {
    startLog('zip包文件开始上传..., 请稍等...');
    // 是否在服务器下备份文件
    if (config.openBackUp) {
      handleSourceFile(ssh, config);
    }
    ssh.putFile(localFile, config.deployDir + config.targetFile).then(async () => {
      successLog(' zip包上传成功');
      startLog(' (5) 解压zip包');
      resolve();
    }).catch(err => {
      errorLog(' 文件传输异常', err);
      reject();
      process.exit(0);
    })
  });
}

// 处理源文件(ssh对象, 配置信息)
async function handleSourceFile(ssh, config) {
  startLog('已开启远端备份!');
  await runCommand(
    ssh,
    `
    if [ -d ${config.releaseDir} ];
    then mv ${config.releaseDir} ${config.releaseDir}_${getCurrentTime()}
    fi
    `,
    config.deployDir
  )
}
module.exports = uploadFile;
```
  如上 ssh.putFile 方法中的参数：

  localFile: 本地文件dist.zip所在的目录。localFile = __dirname + '/' + 'dist.zip';  即：my-auto-deploy 项目的根目录下 dist.zip 文件。

  config.deployDir + config.targetFile: 就是远程服务器下的文件目录了。即：'/usr/local/nginx/html' + '/' + 'dist.zip'; 因此远程目录
  文件地址为: '/usr/local/nginx/html/dist.zip'; 因此会把dist.zip文件上传到远程目录 '/usr/local/nginx/html/' 下了。

  在上传文件之前，会判断远程是否需要备份目标文件，会执行 handleSourceFile 函数。使用了一些shell命令，如果想要了解的话，可以具体看下shell命令的基本含义。

#### 4. 解压文件 (unzipFile.js)

  基本代码如下：
```
const { successLog, underlineLog, errorLog } = require('./logger');
const runCommand = require('./runCommand');

// 开始执行远程命令，解压zip包
async function unzipFile(ssh, deployDir) {
  return new Promise((resolve, reject) => {
    console.log(deployDir);
    const commands = [`cd ${deployDir}`, 'pwd', 'unzip -o dist.zip && rm -rf dist.zip'];
    const promises = [];
    for (let i = 0; i < commands.length; i+=1) {
      promises.push(runCommand(ssh, commands[i], deployDir));
    }
    Promise.all(promises).then(() => {
      successLog(' 解压成功');
      underlineLog(' (6) 开始删除本地dist.zip')
      resolve();
    }).catch(err => {
      errorLog(' 文件解压失败', err);
      reject();
      process.exit(0);
    });
  });
}

module.exports = unzipFile;
```
  unzipFile 函数的作用是：首先我们需要进入远程目录文件下，然后在该目录下对dist.zip文件进行解压到当前目录下。因此该函数接受deployDir参数当作远程目录。即：deployDir = '/usr/local/nginx/html/'; 进入该目录下，进行dist.zip进行解压操作，并且解压完成后，需要删除远程中的dist.zip压缩文件。因此命令：const commands = [`cd ${deployDir}`, 'pwd', 'unzip -o dist.zip && rm -rf dist.zip']; 因此会调用 runCommand 来执行该命令。我们再来看下 utils/runCommand.js 代码。

#### 5. 运行shell命令 (utils/runCommand.js)

  基本代码如下：
```
const { successLog, errorLog } = require('./logger');
// 执行linux命令
function runCommand(ssh, command, path) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, { cwd: path }).then(result => {
      if (result.stderr) {
        errorLog('命令执行发生错误:' + result.stderr);
        reject();
        process.exit(1);
      } else {
        successLog(command + ' 执行完成');
        resolve();
      }
    })
  })
}
module.exports = runCommand;
```
#### 6. 修改发布目录文件名称

  修改发布目录名称，我们使用 await runCommand(sshServer.ssh, 'mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir);
方法来调用 runCommand函数。

  Linux mv 命令请看 <a href="https://www.runoob.com/linux/linux-comm-mv.html">这遍文章</a>

  'mv dist ' + SELECT_CONFIG.releaseDir 这句命令代码即: mv dist web; 将文件 dist 更改为 web。从第四步解压文件，我们知道会解压到 目录为: /usr/local/nginx/html/dist 文件夹下，现在我们把 dist 改成 web。 因此目录就变成了 /usr/local/nginx/html/web 了。 我们上传文件后可以看到如下：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/31.jpg" /> <br />

#### 7. 删除本地压缩文件dist.zip(utils/deleteLocalZip.js)

  我们在第一步压缩文件后，在项目my-auto-deploy根目录下会生成一个dist.zip压缩文件，因此当我们上传文件后，我们需要把本地的dist.zip包删除掉。因此需要在最后一步进行操作。基本代码如下：
```
// 删除本地dist.zip包
const { successLog, errorLog, underlineLog } = require('./logger');
const fs = require('fs');

async function deleteLocalZip(localFile, config) {
  const { name } = config;
  return new Promise((resolve, reject) => {
    fs.unlink(localFile, err => {
      if (err) {
        errorLog(' 本地dist.zip删除失败', err);
        reject();
      }
      successLog(' 本地dist.zip删除成功\n');
      successLog(`\n 恭喜您，${underlineLog(name)}项目部署成功了^_^\n`);
      process.exit(0);
    })
  });
}

module.exports = deleteLocalZip;
```
  如上代码使用了fs模块中的unlink方法对文件进行移步删除操作。了解fs.unlink, <a href="http://nodejs.cn/api/fs/fs_unlink_path_callback.html">请点击 </a>

  如上 localFile = __dirname + '/' + 'dist.zip'; 也就是找到当前项目根目录下的 dist.zip文件进行删除操作。

#### 8. 根目录下入口文件 (app.js) 

  根目录入口文件 app.js 代码如下：
```
const config = require('./config');
const helper = require('./utils/helper');
const compressFileZip = require('./utils/compressFileZip');
const sshServer = require('./utils/connectServer');
const uploadFile = require('./utils/uploadFile');
const unzipFile = require('./utils/unzipFile');
const deleteLocalZip = require('./utils/deleteLocalZip');
const runCommand = require ('./utils/runCommand');

async function main () {
  try {
    const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
    console.log('您选择了部署 ' + SELECT_CONFIG.name);
    const localFile = __dirname + '/' + SELECT_CONFIG.targetFile; // 待上传的本地文件
    // 本地文件压缩
    await compressFileZip(SELECT_CONFIG.targetDir, localFile);
    // 服务器连接
    await sshServer.connectServer(SELECT_CONFIG.ssh);
    // 服务器上传文件
    await uploadFile(sshServer.ssh, SELECT_CONFIG, localFile);
    // 解压文件
    await unzipFile(sshServer.ssh, SELECT_CONFIG.deployDir);
    // 修改文件名称
    await runCommand(sshServer.ssh, 'mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir);
    // 删除本地文件
    await deleteLocalZip(localFile, SELECT_CONFIG);
  } catch(err) {
    console.log('部署过程出现错误！', err); 
  } finally {
    process.exit();
  }
}
main();
```
  如上就会依次执行对应的操作。基本流程如下操作：
```
  1. 读取配置文件(config.js) 
  2. 本地压缩文件(compressFileZip.js)
  3. ssh服务器链接(connectServer.js)
  4. 上传文件(uploadFile.js) 
  5. 远端解压文件(unzipFile.js)
  6. 修改发布目录 
  7. 删除本地压缩文件zip(deleteLocalZip.js)
```
  其中 utils/helper.js 就是使用 inquirer 库一些命令式操作，想要了解 命令式交付操作，请看 <a href="https://github.com/tugenhua0707/react-collection/blob/master/autoDeployment/inquirer.md">这篇文章</a>

  utils/helper.js 代码如下：
```
const inquirer = require('inquirer')
const selectTip = 'project name'
const options = [
  {
    type: 'list',
    name: selectTip,
    message: 'Which project do you want to deploy?',
    choices: []
  }
]
// 显示选择提示窗
function showHelper (config) {
  return new Promise((resolve, reject) => {
    initHelper(config) // 初始化helper
    inquirer.prompt(options).then(answers => {
      resolve({ value: findInfoByName(config, answers[selectTip]) }) // 查找所选配置项
    }).catch((err) => {
      reject(console.error(' helper显示或选择出错！', err))
    })
  })
}

// 初始化helper
function initHelper (config) {
  for (let item of config) {
    options[0].choices.push(item.name)
  }
  console.log('正在检查全局配置信息...')
  // 检查是否存在相同name
  if (new Set(options[0].choices).size !== options[0].choices.length) {
    console.error('请检查配置信息，存在相同name！')
    process.exit()
  }
}

// 查找符合条件的配置项
function findInfoByName (config, name) {
  for (let item of config) {
    if (item.name === name) {
      return item
    }
  }
}
module.exports = showHelper;
```
  然后我们运行 node app.js 就可以执行了，为了更加规范化，因此我们需要执行一个npm命令就可以进行操作，因此我们在package.json中的scripts加入如下命令：
```
"scripts": {
  "deploy": "node app.js"
},
```
  因此我们在 my-auto-deploy 项目根目录下 执行 npm run deploy 命令就可以进行交互操作了。

  执行该命令后，第一步会有一个命令交互操作，选择是 dev环境还是prod环境，如下图所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/32.jpg" /> <br />

  因此我们选择dev环境还是线上环境，选择dev环境就是把我们的代码上传到开发环境服务器上，选择 线上环境就是把我们代码上传到线上环境服务器上。这里我们选择dev
环境，选择完成后，输出如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/33.jpg" /> <br />

  如上可以看到我们代码已经上传到服务器上了，即：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/34.jpg" /> <br />

#### 其他：为了测试该操作，我特意在阿里云租了一年的服务器。具体如何租用，可以看<a href="https://blog.csdn.net/Kevinblant/article/details/103168451">这篇文章</a>

<a href="https://github.com/tugenhua0707/fe-deploy-cli-template/tree/master/my-auto-deploy">github 项目代码查看</a>






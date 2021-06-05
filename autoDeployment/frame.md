### 搭建一个 nodejs 脚手架
#### <a href="https://github.com/kongzhi0707/front-end-staging">github源码查看</a>
#### 1. 为什么需要脚手架？
```
1）可以减少重复性的工作，可以从零创建一个项目和文件。
2）根据交互动态生成项目结构和配置文件等。
3）多人协作更为方便，不需要把文件传来传去。
```
#### 2. 搭建脚手架要依赖如下第三方工具：
```
1）commander.js 可以自动解析命令和参数，用于处理用户输入的命令。
2）download-git-repo 下载并提取git仓库，用于下载项目模版。
3）Inquirer.js 通用的命令行用户界面集合，用于和用户进行交互。
4）handlebars.js 模版引擎，将用户提交的信息动态填充到文件中。
5）ora 下载过程久的话，可以用于显示下载中的动画效果。
6）chalk 可以给终端的字体加上颜色。
7）log-symbols 可以在终端上显示出√ 或 × 等的图标。
```
#### 3. 搭建项目目录

  3.1) 新建项目文件夹，然后 npm init 初始化项目
```
$ mkdir frame-demo
$ cd frame-demo
$ npm init
```
  在项目的根目录中会生成 package.json 文件，内容如下:
```
{
  "name": "frame-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
  在项目的根目录中新建bin文件夹，该文件夹下存放 index.js 作为入口文件。基本代码如下:
```
// index.js
#!/usr/bin/env node
console.log('hello world');
```
  nodejs 内置了对命令行操作支持，node工程下对package.json中对bin字段可以定义命令名和关联的执行文件。更多关于bin的知识，<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/bin.md">请看这篇文章</a>。

  因此我们在package.json文件中添加bin字段，可以直接关联的执行文件。改成如下：
```
{
  "name": "frame-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "xx": "./bin/index.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
  我们先安装下 
```
sudo npm link; 
```
  npm link 命令的作用是：可以将一个任意位置的npm包链接到全局执行环境中，从而在任意位置使用命令都可以直接运行该npm包。

  如下：
```
B-33KDHV2H-1228 frame-demo % sudo npm link
npm WARN frame-demo@1.0.0 No description
npm WARN frame-demo@1.0.0 No repository field.

up to date in 1.439s
found 0 vulnerabilities
```
  然后在任意命令行中执行  xx; 即可打印出信息出来，也可以理解为 npm link 把当前包中的bin中的xx变成全局环境命令，执行如下:
```
@B-33KDHV2H-1228 frame-demo % xx
hello world
```
#### 4. 脚手架一些工具介绍

#### 4.1）commander.js 

  它可以自动解析命令和参数，用于处理用户输入的命令。在使用该工具之前，我们需要安装，安装命令如下：
```
npm install --save commander
```
  然后我们的 bin/index.js 代码改成如下：
```
#!/usr/bin/env node
console.log('hello world');

const program = require('commander');

// 处理 -v, --version时输出
program
  .version(require('../package').version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    console.log(name);
  });

// 解析输入参数，记得放在最后即可
program.parse(process.argv);
```
  运行结果如下：
```
B-33KDHV2H-1228 frame-demo % xx
hello world
Usage: xx [options] [command]

Options:
  -v, --version   output the version number
  -h, --help      display help for command

Commands:
  init <name>
  help [command]  display help for command
B-33KDHV2H-1228 frame-demo % xx init kongzhi
hello world
kongzhi
```
  我们还可以通过 xx -v 查看版本号，如下：
```
B-33KDHV2H-1228 frame-demo % xx -v 
hello world
1.0.0
```
  有关更多的 commander，<a href="https://github.com/tj/commander.js#git-style-sub-commands">请看官网的API介绍 </a>

#### 4.2) chalk 可以给终端的字体加上颜色。

  安装 chalk，安装如下命令：
```
npm install --save chalk
```
  代码中引入 chalk; 如下所示：
```
#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');

// 处理 -v, --version时输出
program
  .version(require('../package').version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    console.log(name);
  });

console.log(chalk.green('初始化'));

// 解析输入参数，记得放在最后即可
program.parse(process.argv);
```
  执行 xx 命令后，如下图所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/36.jpg" /> <br />

#### 4.3) 模版下载 download-git-repo 

  download-git-repo 下载并提取git仓库，用于下载项目模版。

  download() 第一个参数是仓库地址，详细请看npm库文章 <a href="https://www.npmjs.com/package/download-git-repo">查看</a>

#### 4.4) Inquirer.js 命令行交互

  命令行交互功能可以在用户执行 init 命令后，向用户提出问题，接收用户的输入并作出相应的处理。用 inquirer.js 来实现。

  安装包：npm install --save inquirer

  了解更多关于 inquirer， <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/autoDeployment/inquirer.md">请看这篇文章</a>

#### 4.5) ora 进度显示

  ora 下载过程久的话，可以用于显示下载中的动画效果。

  安装：npm install --save ora

  比如 bin/index.js 代码改成如下:
```
#!/usr/bin/env node
const ora = require('ora');

// 开始下载
const proce = ora('正在下载模版...');
proce.start();

// 下载失败调用
proce.fail();

// 下载成功调用
proce.succeed();
```
  运行结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/37.jpg" /> <br />

#### 4.6）log-symbols 在信息前面加上 √ 或 × 等的图标

  安装命令：npm install --save log-symbols

  代码如下：
```
#!/usr/bin/env node

const chalk = require('chalk');
const symbols = require('log-symbols');
console.log(symbols.success, chalk.green('SUCCESS'))
console.log(symbols.error, chalk.red('FAIL'))
```
  运行结果如下所示：
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/38.jpg" /> <br />

#### 5. 实现一个脚手架

  在实现我们自己的脚手架之前，我们可以看下vue-cli的基本实现原理，vue-cli将项目模版作为资源独立发布到git上，然后在运行的时候将模版下载下来，经过
模版引擎渲染，最后生成工程结构。它将项目模版和脚手架分离主要目的是：项目模版最主要负责项目的结构和依赖配置。脚手架负责项目构建的流程。通过分离，可以确保两者之间独立维护。比如项目结构，依赖项或配置有变动，我们只需要更新项目模版即可。

  因此有了上面的基本知识后，我们可以参照上面的思路来实现自己的脚手架。

#### 基本实现原理：我们将项目模版独立发布到git上，然后通过脚手架工具把模版下载下来，经过和脚手架的交互获取新项目的信息，并将交互的输入作为元信息来渲染项目模版，最终我们可以得到项目的基础目录和结构。

  脚手架基本目录结构如下:
```
|--- front-end-staging
| |--- bin  // 命令执行文件
| |--- lib  // 工具模块
| |--- package.json
```
  由于我们上面有搭建项目目录知识后，因此我们脚手架需要安装一些第三方工具，因此我们的package.json文件需要安装如下：
```
{
  "name": "front-end-staging",
  "version": "1.0.0",
  "description": "空智的个人前端脚手架",
  "main": "index.js",
  "bin": {
    "kz": "./bin/www"
  },
  "directories": {
    "lib": "lib"
  },
  "scripts": {
    "test": ""
  },
  "author": "kongzhi",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.0.0",
    "commander": "^5.1.0",
    "download-git-repo": "^3.0.2",
    "inquirer": "^7.1.0",
    "log-symbols": "^4.0.0",
    "ora": "^4.0.4"
  }
}
```
  1. 在 lib/index.js 中编写命令行的入口逻辑, 代码如下：
```
#!/usr/bin/env node

const program = require('commander');

// 处理 -v, --version时输出
program
  .version(require('../package').version, '-v, --version')
  .usage('<command> [项目名称]')
  .command('init', '创建新项目');

// 解析输入参数，记得放在最后即可
program.parse(process.argv);
```
  了解更多关于 commander，请看<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/commander.md">这篇文章</a>

  2. 在 lib/init.js 中定义init子命令

  我们需要通过一个命令来新建项目, 根据我们的第一步定义一个命名为 init 的子命令。因此我们的 lib/init.js 添加如下代码：
```
#!/usr/bin/env node
const program = require('commander');
program.usage('<project-name>').parse(process.argv);

// 根据输入，获取项目名称
let projectName = program.args[1];

console.log('----', projectName);

// projectName 是必填项
if (!projectName) {
  // 如果没有填写 projectName，相当于执行命令的 --help选项，显示help信息
  program.help();
  return;
}

go();

function go() {
  // 预留 处理子命令
}
```
  当我们在项目根目录运行：$ node lib/init.js init hello-cli

  后，会打印如下信息: ---- hello-cli, 可以看到输出的 项目名称为: hello-cli.

  如上代码，project-name 是必填参数，我们可以对 project-name 进行一些自动化处理。
```
1）当前目录为空，如果当前目录的名称和project-name是一样的。则直接在当前目录下创建工程，否则的话，在当前目录下创建以project-name作为名称的目录作为工程的根目录。
2）当前目录不为空，如果目录中不存在与project-name同名的目录，则创建以project-name作为名称的目录作为工程的根目录，否则提示项目已经存在，结束命令执行。
```
  因此我们可以把上面的逻辑 在 lib/init.js 中改成代码如下：
```
#!/usr/bin/env node

const program = require('commander');

const path = require('path');
const fs = require('fs');
const glob = require('glob');

program.usage('<project-name>').parse(process.argv);;

// 根据输入，获取项目名称
let projectName = program.args[1];

// project-name 是必填项
if (!projectName) { 
  // 如果没有，相当于执行命令的 --help选项。显示help信息
  program.help();
  return;
}

// 遍历当前的目录
const list = glob.sync('*');
let rootName = path.basename(process.cwd());

if (list.length) { // 如果当前目录不为空
  if (list.some(name => {
    const fileName = path.resolve(process.cwd(), name);
    const isDir = fs.statSync(fileName).isDirectory();
    return projectName === name && isDir;
  })) {
    console.log(`项目${projectName}已经存在`);
    return;
  }
  // 如果目录中不存在与project-name同名的目录，则创建以project-name作为名称的目录作为工程的根目录
  rootName = projectName;
} else if (rootName === projectName) {
  // 当前目录为空，如果当前目录的名称和project-name是一样的。则直接在当前目录下创建工程，
  rootName = '.';
} else {
  // 当前目录为空，如果当前目录的名称和project-name不是一样的，在当前目录下创建以project-name作为名称的目录作为工程的根目录。
  rootName = projectName;
}

goFunc();

function goFunc() {
  // 遗留，处理子命令
  console.log(path.resolve(process.cwd(), path.join('.', rootName)));
}
```
  然后我们执行如下命令：
```
$ node lib/init.js init hello-cli
```
  在命令行中打印信息如下:
```
/Users/tugenhua/work/learn/front-end-staging/hello-cli
```
#### 3. 使用 download-git-repo 下载模版

  下载模版的工具我们使用到node的模块为 download-git-repo. 如何使用该API，请看官网：<a href="https://www.npmjs.com/package/download-git-repo">点击我查看API</a>。

  因此我们需要在 lib目录下创建一个 download.js ，lib/download.js 代码如下:
```
const download = require('download-git-repo');
const path = require("path");
const ora = require('ora');

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp');
  return new Promise((resolve, reject) => {
    /*
     这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
     切记：我们github地址是这样的：git@github.com:kongzhi0707/store-base-template.git#webpackReactDemo
     但是下载要改成：github.com:kongzhi0707/store-base-template#webpackReactDemo
    */
    let url = 'github.com:kongzhi0707/store-base-template#webpackReactDemo';
    const spinner = ora(`正在下载项目模板，源地址：${url}`)
    spinner.start();
    download(url, target, { clone: true }, function(err) {
      if (err) {
        download(url, target, { clone: false }, function (err) {
          if (err) {
            spinner.fail();
            reject(err)
          } else {
            // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
            spinner.succeed();
            resolve(target)
          }
        })
      } else {
        // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
        spinner.succeed();
        resolve(target);
      }
    })
  });
}
```
  如上代码，就可以把我们的 webpack+react+demo 目录下载下来了，会在我们的脚手架目录下面生成 hello-cli 项目模版，如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/39.jpg" /> <br />

  如上的 .download-temp 临时下载目录中的项目模版文件需要转移到项目目录中。然后把 .download-temp 目录删除掉了，这个先晚点弄。

  如上虽然可以把GitHub中模版文件下载下来，但是我们希望项目模版中有些文件或代码可以动态处理。比如：
```
1） 新项目的名称，版本号，描述等信息，可以通过脚手架的交互进行输入，然后将输入插入到模版中。
2） 项目模版并非所有文件都会被使用到，我们可以通过脚手架提供的选项移除掉那些无用的文件或者目录。
```
#### 4. 使用 inquirer.js 处理命令行交互

  对于命令行交互的功能，我们可以使用 inquirer.js 来处理，了解更多 inquirer.js, <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/autoDeployment/inquirer.md">请看这篇文章</a>

  因此我们会对 lib/init.js 代码改成如下：
```
#!/usr/bin/env node

const program = require('commander');

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const inquirer = require('inquirer');
// 下面的模块 可以获取到node包的最新版本
const latestVersion = require('latest-version');
// const generator = require('../lib/generator')
const logSymbols = require("log-symbols");
const chalk = require('chalk');

const download = require('../lib/download');

program.usage('<project-name>').parse(process.argv);;

let next = undefined;

// 根据输入，获取项目名称
let projectName = program.args[1];

// project-name 是必填项
if (!projectName) { 
  // 如果没有，相当于执行命令的 --help选项。显示help信息
  program.help();
  return;
}

// 遍历当前的目录
const list = glob.sync('*');
let rootName = path.basename(process.cwd());

if (list.length) { // 如果当前目录不为空
  if (list.some(name => {
    const fileName = path.resolve(process.cwd(), name);
    const isDir = fs.statSync(fileName).isDirectory();
    return projectName === name && isDir;
  })) {
    console.log(`项目${projectName}已经存在`);
    return;
  }
  // 如果目录中不存在与project-name同名的目录，则创建以project-name作为名称的目录作为工程的根目录
  rootName = projectName;
  next = Promise.resolve(projectName);
} else if (rootName === projectName) {
  // 当前目录为空，如果当前目录的名称和project-name是一样的。则直接在当前目录下创建工程，
  rootName = '.';
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
      type: 'confirm',
      default: true
    }
  ]).then(answer => {
    return  Promise.resolve(answer.buildInCurrent ? '.' : projectName);
  })
} else {
  // 当前目录为空，如果当前目录的名称和project-name不是一样的，在当前目录下创建以project-name作为名称的目录作为工程的根目录。
  rootName = projectName;
  next = Promise.resolve(projectName);
}

next && goFunc();

function goFunc() {
  /*
  // 遗留，处理子命令
  console.log(path.resolve(process.cwd(), path.join('.', rootName)));
  // 下面是新增的代码
  download(rootName)
    .then(target => {console.log(target)})
    .catch(err => console.log(err));
  */
  next.then(projectRoot => {
    if (projectRoot !== '.') {
      fs.mkdirSync(projectRoot);
    }
    return download(projectRoot).then(target => {
      return {
        name: projectRoot,
        root: projectRoot,
        downloadTemp: target
      }
    });
  }).then(context => {
    console.log('-----', context);
    return inquirer.prompt([
      {
        name: 'projectName',
        message: '项目名称',
        default: context.name
      },
      {
        name: 'projectVersion',
        message: '项目版本号',
        default: '1.0.0'
      }, 
      {
        name: 'projectDescription',
        message: '项目简介',
        default: `A project named ${context.name}`
      }
    ]).then(answer => {
      return {
        ...context,
        metadata: {
          ...answer
        }
      }
    })
  })
  .then(context => {
    console.log(context);
    // 成功用绿色显示，给出积极的反馈
    console.log(logSymbols.success, chalk.green('创建成功:)'));
    console.log(chalk.green('cd ' + context.root + '\nnpm install\nnpm run dev'))
  })
  .catch(err => {
    // 失败了用红色，增强提示
    console.log(err);
    console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
  });
}
```
  当我们执行命令: $ node lib/init.js init hello-cli

  首先会打印 如下图所示: 

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/40.jpg" /> <br />

  当我们继续回答对应的信息后，打印的信息如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/41.jpg" /> <br />

#### 5. 使用metalsmith处理模版 和 handlebars 模版引擎。

  metalsmith 是一个静态网站生成器，可以使用在批量处理模版的场景。模版引擎选择 handlebars，我们可以使用handlebars的语法对模版做一些调整。比如我们可以
修改模版中的 package.json. 

#### 给项目模版添加变量占位符

  模版引擎我选择handlebars。我们也可以选择其他的，比如：ejs，jade等

  我们使用handlebars语法对模版中对package.json做一些调整。比如我对 store-base-template 库中的 webpackReactDemo 分支中的package.json 改成如下:
```
{
  "name": "{{projectName}}",
  "version": "{{projectVersion}}",
  "description": "{{projectDescription}}",
  "main": "webpack.config.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --progress --colors --devtool cheap-module-eval-source-map --hot --inline",
    "build": "cross-env NODE_ENV=production webpack --progress --colors --devtool cheap-module-source-map",
    "develop": "node app.js"
  },
  .....
}
```
  如上我们对 package.json 的name，version，description字段的内容被替换成来handlebar语法的占位符。我们也可以对其他字段进行转换都可以。完成后模版重新
提交到github上即可，我们下次下载的时候就会下载得到。

#### 实现脚手架给模版插值的功能

  首先我们在 lib/generator.js 下新建 generator.js 来封装 metalsmith。 基本代码如下：
```
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const remove = require("../lib/remove")
const fs = require("fs")
const path = require("path");
const _ = require('lodash');
/*
 context = 
 { 
  name: 'hello-cli',
  root: 'hello-cli',
  downloadTemp: 'hello-cli/.download-temp',
  metadata: { 
   projectName: 'hello-cli',
   projectVersion: '1.0.0',
   projectDescription: 'A project named hello-cli' 
  } 
 }
*/
module.exports = function (context) {
  let metadata = context.metadata;
  let src = context.downloadTemp;
  let dest = './' + context.root;
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(process.cwd())  // 返回当前的目录
      .metadata(metadata) // metadata 为用户输入的内容
      .clean(false)
      .source(src)  // 模板文件 path
      .destination(dest);  // 最终编译好的文件存放位置
    // 判断下载的项目模板中是否有templates.ignore
    const ignoreFile = path.resolve(process.cwd(), path.join(src, 'templates.ignore'));
    let package_temp_content;
    if (fs.existsSync(ignoreFile)) {
      // 定义一个用于移除模板中被忽略文件的metalsmith插件
      metalsmith.use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        // 先对ignore文件进行渲染，然后按行切割ignore文件的内容，拿到被忽略清单
        const ignores = Handlebars
          .compile(fs.readFileSync(ignoreFile).toString())(meta)
          .split('\n').map(s => s.trim().replace(/\//g, "\\")).filter(item => item.length);
        //删除被忽略的文件
        for (let ignorePattern of ignores) {
          if (files.hasOwnProperty(ignorePattern)) {
            delete files[ignorePattern];
          }
        }
        done()
      })
    }
    metalsmith.use((files, metalsmith, done) => {
      const meta = metalsmith.metadata()
      Object.keys(files).forEach(fileName => {  // 遍历替换模板
        if (!_.startsWith(fileName, 'src/font') || !_.startsWith(fileName, 'src/images')) { //判断是否为字体文件，字体或图片文件不用替换
          const t = files[fileName].contents.toString() // Handlebar compile 前需要转换为字符串
          files[fileName].contents = new Buffer(Handlebars.compile(t)(meta)); 
        }
      })
      done()
    }).build(err => {
      remove(src);  //删除下载下来的模板文件，比如项目中的 'hello-cli/.download-temp'这个路径删除掉
      err ? reject(err) : resolve(context);
    })
  });
};
```
  同时在 lib/init.js 中的goFunc函数中添加代码逻辑如下:
```
...
const generator = require('../lib/generator')
....

function goFunc() {
  next.then(projectRoot => {
    // ....
  })
  .then(context => {  // 新增的代码
    //删除临时文件夹，将文件移动到目标目录下
    return generator(context);
  })
  .then(context => {
    console.log(context);
    // 成功用绿色显示，给出积极的反馈
    console.log(logSymbols.success, chalk.green('创建成功:)'));
    console.log(chalk.green('cd ' + context.root + '\nnpm install\nnpm run dev'))
  })
  .catch(err => {
    // 失败了用红色，增强提示
    console.log(err);
    console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
  });
}
```
  在lib中新建remove.js 删除目录及文件，lib/remove.js 基本代码如下：
```
const fs =require("fs");
const path=require("path");
// 删除目录文件
function removeDir(dir) {
  let files = fs.readdirSync(dir)
  for(var i=0;i<files.length;i++){
    let newPath = path.join(dir,files[i]);
    let stat = fs.statSync(newPath)
    if(stat.isDirectory()){
      //如果是文件夹就递归下去
      removeDir(newPath);
    }else {
     //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉
}
module.exports=removeDir;
```
  因此在我们的脚手架里面会生成对应的 react项目模版文件，我们可以在该项目中进行我们自己的开发项目。在下次项目中我们把react模版更加的完善起来，我们可以把单元测试，eslint，es6，reduce，ajax请求等等这些都集成到我们的项目模版中，这样以后我们的前端脚手架就完成来一系列的功能，开发的时候我们只关注业务逻辑开发即可。

#### 脚手架使用bin目录

  在项目的根目录中新建bin文件夹，该文件夹下存放 入口文件。bin/www 文本文件的代码如下:
```
#! /usr/bin/env node
require('../lib/index.js');
```
  bin/www-init 文本文件的代码如下：
```
#! /usr/bin/env node
require('../lib/init.js');
```
  在package.json 代码中我们加入bin配置文件：
```
{
  "bin": {
    "kz": "./bin/www-init"
  },
}
```
  然后在我们项目中我们使用 sudo npm link ， 然后我们就可以在任何一个目录下都可以使用 kz 这个命令来运行代码，kz全局指向了 /use/local/bin. 如下可以看得到：
```
/usr/local/bin/kz -> /usr/local/lib/node_modules/front-end-staging/bin/www-init
```
  因此我们在项目中的任何一个目录都可以使用kz这个命令，我们可以使用 kz init kongzhi-cli 下载项目到本地来，项目名称为 kongzhi-cli.

#### 6. 将脚手架发布到npm包中

  1. 注册npm账号
  打开npmjs官网: <a href="www.npmjs.com/">www.npmjs.com/</a>, 如果还没有账号, 就先注册一个自己的账号. 如果已经有了, 就跳过这一步.

  2. 更新好项目的package.json

  name: 确保name在npmjs上没有被占用. 最好在npmjs上先所搜一下.
  version: 确保版本不会重复.
  description
  license
  keywords
  repository

  并且检查一下dependencies. 把没有用到的依赖清除.
  完善项目的README.md文件.
  把cli的使用方法和重要信息完善好.

  在命令行下执行登录命令
  ```
  npm login
  ```

  输入对应的用户名和密码。

#### 发布包
  在命令行下，执行:
```
npm publish
```
  如果上面package.json的配置没有问题, 发布稍微等一下即可成功. 发布失败的话, 根据具体的原因解决一下即可.
### 查看发布包

  打开https://www.npmjs.com， 搜索front-end-staging，就可以看到刚刚发布的包了. 如下所示：

  <img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/42.jpg" /> <br />

### 验证发布的包
  执行安装命令:
```
sudo npm i front-end-staging -g
```
  使用kz创建项目
```
kz init hello-cli
```
  我们会看到如下可以正常下载模版下来。
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/43.jpg" /> <br />

#### 注意：如上的脚手架我们默认下载一个react框架。

#### <a href="https://github.com/kongzhi0707/front-end-staging">github源码查看</a>























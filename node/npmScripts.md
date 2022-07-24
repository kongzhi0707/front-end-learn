
### npm scripts介绍

#### 1) 什么是 npm scripts

  npm script 是记录在 package.json 中的scripts字段中的一些自定义脚本，使用自定义脚本，用户可以将一些项目中常用的命令行记录在 package.json中，这样我们不需要每次都敲一遍命令。比如如下命令是来统计项目中的代码行数的：
```
find src -name "*.js" | xargs cat | wc -l
```
  命令很长很长，如果我们每次这样敲命令的话，效率会非常低下，因此我们可以将其写入到 package.json 中，如下：
```
"scripts": {
  "lines": "find src -name \"*.js\" | xargs cat | wc -l",
}
```
  以后我们只要运行 npm run lines 就可以了。可以提高我们的效率。

#### 基本原理

  npm 脚本的原理: 每当执行 npm run，就会自动新建一个shell脚本命令。因此只要shell(一般是bash)可以运行的命令，都可以写到npm中。且当我们 npm run 新建shell的时候，会将当前目录的 node_modules/.bin 子目录加入到 PATH 变量中，当执行结束后，又会将PATH变量中移除。因此在 npm scripts 中可以直接使用哪些存在 node_modules/.bin/ 中的可执行文件。

  比如我们当前的项目依赖有Mocha，比如我们安装了mocha，npm install mocha -D;

  我们只要在 scripts 中引入:
```
{
  "scripts": {
    "test": "mocha"
  }
}
```
  当然如果我们想在命令行中调用的话，我们可以使用命令：
```
./node_modules/.bin/mocha --version
```
 查看版本号。其实 npx 就是来解决这个问题的，可以让项目内部安装的模块使用起来更方便，我们也可以使用如下命令:
```
npx mocha --version
```
想要了解 npx, npm, yarn, cnpm, pnpm 的区别，可以看我这篇文章 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/npx.md">请点击</a>

#### 传入参数

  对于上面的脚本 "test": "mocha"，如果我们希望给mocha传入一些参数的话，我们像如下方式：
```
"scripts": {
  "test": "mocha --xx yy"
}
```
  在shell中传入的参数都要使用 -- 隔开，这个 -- 被视作 npm run 命令参数的结束，-- 后面的内容都会原封不动的传给运行的命令。

#### npm 脚本 #!/usr/bin/env node
```
#!
```
  该符号一般在liunx系统的第一行开头出现的，用于指明这个脚本文件的解释程序。npm脚本第一行增加这个程序 #!usr/bin/env node 为了指定使用node执行脚本文件。
```
/usr/bin/env
```
  不同用户不同系统不同脚本安装在不同的目录中，那么系统如何知道去哪里寻找解释程序呢？/usr/bin/env 就是告诉系统在 PATH 目录下查找，所以配置 #!/usr/bin/env node，就是解决不同用户node路径不同的问题。可以让系统动态的去查找node来执行我们的脚本。

#### 2）生命周期脚本/自定义脚本

  当我们使用命令 npm start 时，npm 会尝试执行 package.json 中的 scripts 中配置的start脚本命令。start-script 的默认配置为 "start": "node server.js"。 所以如果在我们的 package.json 中 scripts 没有配置 start 这个的话，只要我们的项目的根目录下有 server.js 的话，当我们执行命令 npm start 的话，也会自动运行 server.js 中的代码。

  除了 start-script，当我们使用 npm start 命令时，npm 同样会尝试在 package.json scripts 中查找是否配置了 prestart, poststart 脚本命令，
如果配置了，npm会按照以下顺序执行脚本：
```
npm run prestart
npm run start
npm run poststart
```
  npm 默认提供下面这些钩子函数：
```
prepublish, publish, postpublish // 发布模块
preinstall，install, postinstall // 安装模块
preuninstall，uninstall, postuninstall // 卸载模块
preversion，version, postversion // 在使用 npm version 修改版本号的时候执行
pretest，test, posttest // 执行 npm test 的时候 
prestop，stop, poststop // 执行 npm stop 的时候 
prestart，start, poststart // 执行 npm start 的时候
prerestart，restart, postrestart // 执行 npm restart 的时候
```
  我们自定义脚本命令也可以加上 pre 和 post 的前缀，比如 build 这个脚本命令，也有 prebuild 和 postbuild 这个钩子的。

  如上这些script会在不同的时刻自动被执行，这也是为什么 npm run start 可以简写为 npm start 的原因了，在执行 npm start 的时候会依次执行 prestart, start 和 poststart。 当然，如果没有指定 prestart 和 poststart, 会默默的跳过。


#### 3）执行顺序

  如果 npm 脚本里面需要执行多个任务，那么需要明确他们的执行顺序。

  如果是并行执行的话，可以使用 & 符号。
```
$ npm run script1.js & npm run script2.js
```
  如果是顺序执行的话，即先执行 script1.js, 再执行 script2.js 的话，我们可以使用 && 符号。如下：
```
$ npm run script1.js && npm run script2.js
```
#### 4）环境变量

  在执行 npm script的时候还可以访问的到一些特殊的环境变量，通过 process.env.npm_package_xxx 可以获得到 package.json 中的内容，比如 process.env.npm_package_name 可以获取到 package.json 中的name的值。通过 process.env.npm_package_version 就可以访问的到 1.0.0这个版本。
  上面我们是通过 环境变量 process.env对象拿到package.json的字段值，如果是Bash脚本的话，可以利用 $npm_package_name 和 $npm_package_version 拿到这两个值了。
如下：
```
{
  "name": "react-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "xxx"
  },
  "scripts": {
    "install": 'xxx.js'
  }
}
```
  通过 process.env.npm_package_repository_type 可以拿到值 “git”. 我们还可以通过 process.env.npm_config_xxx 来拿到 npm config 的值。
  比如通过 process.env.npm_config_user_email 可以拿到 user.email的值。我们还可以通过 process.env.npm_package_scripts_install 拿到变量的值等于 xxx.js. 

  npm 还提供了一个  process.env.npm_lifecycle_event 变量，返回当前正在运行的脚本名称，比如 pretest, test, posttest 等，在执行不同的 npm script 的时候这个值是不同的，比如执行 npm run build 的时候，这个值为 build，通过判断这个变量，将一个脚本使用在不同的 npm script 中。
  所以，我们可以利用这个变量，在同一个脚本文件里面，为不同的 npm scripts 命令编写代码，类似如下代码：
```
const TARGET = process.env.npm_lifecycle_event;

if (TARGET === 'test') {
  console.log(`Running the test task!`);
}

if (TARGET === 'pretest') {
  console.log(`Running the pretest task!`);
}

if (TARGET === 'posttest') {
  console.log(`Running the posttest task!`);
}
```
#### 编写node命令行工具

  在 npm script 常常用到一些模块中的可执行文件，比如eslint , webpack 这些等，那么我们要如何自己编写一个命令行工具呢？让她可以在 npm script 中被调用。

#### 1) 编写命令行脚本

  新建文件 cli.js ， 需要写入如下逻辑代码：
```
  console.log('第一个node命令行工具');
```
#### 2) 在 package.json 中的bin字段中指定命令行文件名称和路径
```
{
  "bin": {
    "cli": './cli.js'
  }
}
```
#### 3) 指定解释器

  当用户安装以后，通过 ./node_modules/.bin/cli 执行，会报错，原因是目前 shell 不知道使用什么解释器来执行这些代码，为此需要在脚本上方指定解释器。
```
#!usr/bin/env node
console.log('第一个node命令行工具');
```
  上面 这行代码是告诉 shell 使用何种解释器来执行代码。usr/bin/env 是一个程序，usr/bin/env node 会找到当前 PATH 中的 node 来解释后面的代码。

  如上有了这三步，就开发出了一个 node 的命令行工具。当用户安装这个模块的时候，npm 会在 node_modules/.bin/ 中创建文件，名为 package.json 中的 bin 指定的命令名，并链接至对应的脚本。此后就可以在 npm script 中使用它了。



















### Koa从0到1搭建脚手架

一：基础知识准备阶段

1）创建项目

在对应的目录下新建 koa-staging 文件夹，然后进入该文件夹后，初始化package.json，执行命令:

$ npm init

接着安装koa，运行如下命令: 

$ npm install koa --save

在项目的根目录下，我们新建 app.js，基本代码如下，我们就可以启动一个简单的服务器了。

const Koa = require('koa');
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求

app.use(async (ctx, next) => {
  await next();
  // todo 
});

// 在端口监听8083
app.listen(8083);

2) 添加路由

我们需要安装如下 koa-router koa-bodyparser 插件了。执行命令如下：

npm install koa-router koa-bodyparser --save

我们现在使用router把上面的代码改成如下：

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser()); // 处理post请求时，koa无法解析http请求体中的数据, 因此需要使用 koa-bodyparser

const router = require('koa-router')();

// 对于任何请求，app将调用该异步函数处理请求
router.get('/', async(ctx, next) => {
  // todo
  ctx.body = '<h1>欢迎光临</h1>';
})

app.use(router.routes());

// 在端口监听8083
app.listen(8083);
console.log('app started at port 8083');

当我们在浏览器中 运行： http://localhost:8083/ 后就可以看到 "欢迎光临" 的字样了。

koa-bodyparser 插件的使用，可以看 <a href="https://www.cnblogs.com/kongzhi0707/p/9904892.html#_labe1_0">这篇文章</a>

注意：我们还可以给路由加一个前缀，比如如下代码：

const Router = require('koa-router')

const router = new Router({
	prefix: '/api'
});

因此项目中的根目录下的 app.js 代码变成如下：

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser()); // 处理post请求时，koa无法解析http请求体中的数据, 因此需要使用 koa-bodyparser

const Router = require('koa-router');

const router = new Router({
	prefix: '/api'
})

// 对于任何请求，app将调用该异步函数处理请求
router.get('/', async(ctx, next) => {
  // todo
  ctx.body = '<h1>欢迎光临</h1>';
})

app.use(router.routes());

// 在端口监听8083
app.listen(8083);
console.log('app started at port 8083');

然后我们在浏览器访问：http://localhost:8083/api 就可以看到 欢迎光临 字样了。

3）热重启的处理

每一次我们修改都要关闭程序，然后再 运行 node app.js , 很麻烦，因此我们需要一个热重启，这时候就要使用到 nodemon, 它用于监视源中的任何更改并自动重新启动服务器。因此我们需要安装它，安装命令如下所示：

npm install nodemon --save-dev

然后修改 package.json 命令如下：

"scripts": {
  "start": "nodemon app.js"
},

运行npm start，这样就达到了热重启的效果了.

4) 支持import模块的引入

目前原生的node是不支持import引入模块的。如果我们使用import引入模块的话，会报如下的错：

import Router from 'koa-router';
       ^^^^^^
SyntaxError: Unexpected identifier

因此我们需要安装如下依赖进行配置下：

npm install babel-plugin-transform-es2015-modules-commonjs babel-register --save-dev

4.2) 然后在根目录下创建 start.js, 配置代码如下：

require('babel-register')
(
  {
    plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  }
)

module.exports = require('./app.js');

4.3）再修改下package.json 打包命令如下：

"scripts": {
  "start": "nodemon start.js"
},

现在我们直接运行 npm start, 这时候可以看到我们的项目已经支持import语法了。

二：Koa插件使用

2.1）koa-static-cache 缓存文件 和 koa-static

koa-static 是静态文件服务器，可以让客户端访问我们的图片，网页。
koa-static-cache 是静态文件缓存，是在客户端缓存文件，一般可以用来缓存js和css。目的是减少服务器的负担。

koa-static-cache 中间件使用方法：

首先在我们的项目根目录下新建 publicDir目录，在该目录下新建 1.css文件，在浏览器中请求：http://localhost:8083/1.css
那么node代码一般是如下：

const Koa = require('koa');
const path = require('path');
const staticCache = require('koa-static-cache');

const server = new Koa();
server.listen(8083);

server.use(
    staticCache(path.resolve("publicDir"), {
    maxAge: 365 * 24 * 60 * 60
  })
);

对 publicDir 目录下的文件 缓存1年。第一次请求是200，除了第一次后请求状态码都是 304.













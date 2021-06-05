
### React + Koa 实现服务器端渲染

  搭建前端开发环境，我直接使用 react脚手架中的代码拿过来的。详情看 <a href="https://github.com/tugenhua0707/react-staging-template">点击这里</a>，搭建完成后，我们就可以使用 npm run dev 就可以重启开发环境，然后访问：http://localhost:8080/ 就可以访问到页面了。<br />

    项目初始结构如下：
```
  ｜--- build
  ｜ |--- webpack.base.conf.js
  ｜ |--- webpack.dev.conf.js
  ｜ |--- webpack.dll.config.js
  ｜ |--- webpack.prod.conf.js
  ｜--- dist
  ｜--- dll
  ｜--- node_modules
  ｜--- public
  ｜ |--- index.html
  ｜--- src
  ｜ ｜--- css 
  ｜ ｜--- images
  ｜ ｜--- app.js
  ｜ ｜--- index.js
  ｜ ｜--- package.json
  ｜ ｜--- .gitignore
  |  |--- .babelrc
  |  |--- .eslintrc.js
  |  |--- postcss.config.js
```
#### 一：使用Koa搭建Node服务

  安装koa，进入项目的根目录安装koa，运行: 
```
  npm install --save koa
```
  在项目的根目录下 创建 server/app.js 代码如下：
```
  const Koa = require('koa');
  const app = new Koa();
  app.use(ctx => {
    ctx.body = '<div>Hello Koa<div/>'
  })
  app.listen(9000, () => {
    console.log(`node服务已经启动, 请访问localhost:9000`)
  });
```
  在package.json中添加一条script命令:
```
  {
    "scripts": {
      "server": "node server/app.js"
    }
  }
```
  运行npm run server并访问localhost:9000, 这时候就可以看到Hello Koa.

#### 二：理解使用 renderToString

  renderToString 方法，能将组件转成字符串。这样我们就可以实现渲染组件了！！！
  首先我们要让node支持jsx语法，先创建 server/index.js，使用@babel/register在node运行时候编译我们的jsx代码以及es6语法。

  因此我们需要在项目的根目录下新建 server/index.js。基本代码如下：
```
require('@babel/register')({
  presets: [
      '@babel/preset-react',
      '@babel/preset-env'
  ],
});
require('./app.js');
```
  因此我们需要安装 @babel/register 插件，安装命令如下:
```
npm install --save-dev @babel/register
```
  然后我们修改script命令，代码如下：
```
{
  "scripts": {
    "server": "node server/index.js"
  }
}
```
  重构 server/app.js 代码变成如下：
```
import React from 'react';
import Koa from 'koa';

import { renderToString } from 'react-dom/server';

const app = new Koa();

const App = () => <div>Hello Koa</div>

app.use(ctx => {
  ctx.body = renderToString(<App />);
});

app.listen(9000, () => {
  console.log('node服务已经启动了, 请访问localhost:9000');
});
```
  当我们访问 http://localhost:9000/ 时候也是会显示 "Hello Koa" 字样了。

#### 三：使用 React-Router

1. 理解SPA页面路由：我们从浏览器输入url，不管我们的url匹配到那个路由，后端统统给我的是index.html页面，然后加载js匹配对应的路由组件，渲染对应的路由。<br/>
2. 理解SSR中的路由：我们从浏览器输入url，node后端匹配对应的路由获取到对应的路由组件，获取到对应的数据填充路由组件，然后将组件转换成html返回给浏览器。浏览器直接渲染，当这个时候我们直接在页面中点击跳转，我们是不会刷新页面的，它是由js匹配对应的路由渲染。<br/>

因此我们需要同时配置前端路由和后端路由，我们进入一个页面的时候，由后端路由渲染页面，当我们点击页面跳转的时候，我们使用的是前端路由进行js跳转操作。

#### 安装 react-router
```
npm install --save react-router-dom
```
  在项目的根目录下 新建 src/router.js， 代码如下：
```
import React from "react";
import { Link, Switch, Route } from "react-router-dom";

const Home = () => (
  <div>
    <h1>首页</h1>
    <Link to="/list">跳转到列表页</Link>
  </div>
);

const list = [
  "列表项1",
  "列表项2",
  "列表项3"
];

const List = () => (
  <ul>
    {
      list.map((item, index) => <li key={index}>{ item }</li>)
    }
  </ul>
);

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/list" component={ List } />
  </Switch>
)
```
  修改 src/index.js 代码如下：
```
import React from "react";
import ReactDOM from "react-dom";
// import App from "./app";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";

// ReactDOM.render(<App />, document.getElementById("root"));

ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.getElementById("root")
)
```
  然后我们执行 npm run dev， 访问 http://localhost:8080. 前端路由就实现了。

#### 四：使用 koa-router

  服务端路由我们使用koa-router, 因此我们需要安装 koa-router， 安装命令如下：
```
npm install --save koa-router
```
  新建 server/router/index.js ，基本代码如下：
```
import Router from "koa-router";
import RouterConfig from "../../src/router";
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import React from "react";

const routes = new Router();

routes.get("/", (ctx, next) => {
  ctx.body = renderToString(
    <StaticRouter location={ctx.url}>
      <RouterConfig />
    </StaticRouter>
  )
  next();
});

routes.get("/list", (ctx, next) => {
  ctx.body = renderToString(
    <StaticRouter location={ctx.url}>
      <RouterConfig />
    </StaticRouter>
  )
  next();
});

export default routes;
```
  如上代码，koa-router注册了 / 和 /list 两个路由，并且使用了 renderToString 将组件转成html。StaticRouter 一般用于在服务器端渲染，静态路由的含义，它和 BrowserRouter的区别是： BrowserRouter 使用的是html5中实现的history来操作location，也就是js获取到的location，但是在node环境且获取不到，因此 react-router提供了 StaticRouter 来让我们自己设置location。

  接下来我们继续改造下我们的 server/app.js 代码如下：
```
import Koa from "koa";
import routes from "./router";

const app = new Koa();

app.use(routes.routes(), routes.allowedMethods());

app.listen(9000, () => {
  console.log('node服务已经启动了, 请访问localhost:9000');
});
```
  然后我们启动 npm run server; 访问 localhost:9000 访问页面。然后我们点击访问列表页面，可以看到跳转是刷新页面，并不是路由页面跳转。
这是因为我们返回的html里面没有携带js，所以跳转路由就直接跳转了，因此我们可以创建一个html模版。

#### 五）新建路由模版

  新建模版 template/server.html, 代码如下：
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ssr服务器端渲染</title>
</head>
<body>
  <div id="root">{{ html }}</div>
  <script src="http://localhost:8080/vendor.dll.js"></script>
  <script src="http://localhost:8080/js/app.3f6223aa.js"></script>
</body>
</html>
```
  如上看到，我们加载了 localhost:8080服务器下的 vendor.dll.js 和 app.3f6223aa.js 文件，也就是说我们先使用node把页面服务器端渲染html成字符串的值赋值给 {{ html }}; 然后当我们点击跳转的时候，它使用的 history 去跳转，因此就实现了服务器端渲染，页面首次加载的时候是服务器端渲染，跳转的时候是不发请求的，直接使用html5中的history去做路由跳转操作。

  现在我们需要做的是 使用js去解析 template/server.html 中的 {{ html }} 的值，因此我们在 server/templating.js 添加如下代码进行解析操作：

  server/templating.js 代码如下：
```
import fs from "fs";
import { renderToString } from "react-dom/server";
import { StaticRouter } from  'react-router-dom';
import RouterConfig from "../src/router";
import React from "react";
import path from "path";

// 匹配模版中的 {{}}
function templating(props) {
  const template = fs.readFileSync(path.join(__dirname, "../template/server.html"), "utf-8");
  return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[key.trim()]);
}

export default function(ctx, next) {
  try {
    ctx.render = () => {
      const html = renderToString(
        <StaticRouter location={ ctx.url }>
          <RouterConfig />
        </StaticRouter>
      );
      const body = templating({ html });
      ctx.body = body;
    }
  } catch (err) {
    ctx.body = templating({ html: err.message });
  }
  ctx.type = "text/html";
  return next();
}
```
  然后我们修改 server/app.js 代码，去加载上面我们编写的中间件，代码改成如下：
```
import Koa from 'koa';
import routes from './router';

import templating from "./templating";

const app = new Koa();

app.use(templating);
app.use(routes.routes(), routes.allowedMethods());

app.listen(9000, () => {
  console.log('node服务已经启动了, 请访问localhost:9000');
});
```
  最后我们来改造下我们的路由，server/router/index.js 代码改成如下：
```
import Router from "koa-router";

const routes = new Router();

routes.get("/", (ctx, next) => {
  ctx.render();
  next();
});

routes.get("/list", (ctx, next) => {
  ctx.render();
  next();
});

export default routes;
```
  我们现在重启 http://localhost:9000 后，看到跳转list就不会去刷新页面了。

  我们现在项目目录结构变为如下：
```
｜--- build
｜ |--- webpack.base.conf.js
｜ |--- webpack.dev.conf.js
｜ |--- webpack.dll.config.js
｜ |--- webpack.prod.conf.js
｜--- dist
｜--- dll
｜--- node_modules
｜--- public
｜ |--- index.html
｜--- src
｜ ｜--- css 
｜ ｜--- images
｜ ｜--- app.js
｜ ｜--- index.js
｜ ｜--- package.json
｜ ｜--- .gitignore
|  |--- .babelrc
|  |--- .eslintrc.js
|  |--- postcss.config.js
|--- server
| |--- router
| | |--- index.js
| |--- app.js
| |--- index.js
| |--- templating.js
|--- template
| |--- server.html
```
  如上代码我们的路由页面配置完成了，但是如上是静态页面，也就是说页面是写死的，但是在实际开发中数据是渲染出来的。 比如我们通过ajax请求来渲染数据的。因此下一步我们需要了解SSR中的数据请求来。

#### 六）SSR中的数据请求

  react中操作数据有2种，分别是：state 和 props， 但是在node中只能通过props传递进去，并且数据能做到前后端同步，因此我们需要使用redux。首先我们需要安装redux。
  安装命令如下所示:
```
npm install --save redux react-redux
```
  然后新建目录，在src目录下 新建 redux目录，然后redux目录下有 reducers 和 store目录：如下所示:
```
|--- src
| |--- redux
| | |--- reducers
| | |--- store
```
#### 1) 然后在 src/redux/reducers 下新建 home.js, 代码如下：
```
const defaultState = {
  title: "Hello Redux"
};

export default function(state = defaultState, action) {
  switch (action.type) {
    default: 
      return state;
  } 
}
```
#### 2) 在 src/redux/reducers 下新建 list.js, 代码如下：
```
const defaultState = {
  list: [
    "列表项1",
    "列表项2",
    "列表项3"
  ]
};

export default function(state = defaultState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```
#### 3) 合并reducers， 在 src/redux/reducers 下新建 index.js， 代码如下：
```
import home from "./home";
import list from "./list";

import { combineReducers } from "redux";

export default combineReducers({
  home,
  list,
});
```
#### 4) 创建store，在src/redux/store 下新建 create.js 代码如下：
```
import { createStore } from "redux";
import reducers from "../reducers";

export default data => createStore(reducers, data);
```
#### 5) 将store注入到组件中

  src/index.js 代码更改成如下：
```
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import Router from "./router";

import { Provider } from "react-redux";
import createStore from "./redux/store/create";
const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
```
#### 6) 拆分代码

  在src下 新建 pages 目录，用于存放不同到页面到js文化。

  1）新建 pages/home.js ， 基本代码如下：
```
import { Link } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";

const Home = props => (
  <div>
    <h1>{ props.title }</h1>
    <Link to="/list">跳转到列表页</Link>
  </div>
)

/**
 * 通过connect将redux中到数据传递进入组件
 */

 function mapStateToPros(state) {
   return { ...state.home };
 }

 export default connect(mapStateToPros)(Home);
```
  2）在src下 新建 pages/list.js, 基本代码如下：
```
import React from "react";
import { connect } from "react-redux";

const List = props => (
  <ul>
    { props.list.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
)

/**
 * 通过connect将redux中到数据传递进入组件
 */

 function mapStateToProps(state) {
   return { ...state.list };
 }

 export default connect(mapStateToProps)(List);
```
  3）更新 src/router.js 代码如下：
```
import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/home";
import List from "./pages/list";

export default () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/list" component={ List } />
  </Switch>
)
```
  如上redux代码新增完成，我们已经将数据从组件内部提取到了redux来管理，接下来我们实现在node中填充数据。

  4）修改 server/templating.js 代码，代码改成如下：
```
import fs from "fs";
import { renderToString } from "react-dom/server";
import { StaticRouter } from  'react-router-dom';
import RouterConfig from "../src/router";
import React from "react";
import path from "path";

// 新增代码如下：
import { Provider } from "react-redux";
import createStore from "../src/redux/store/create";

// 匹配模版中的 {{}}
function templating(props) {
  const template = fs.readFileSync(path.join(__dirname, "../template/server.html"), "utf-8");
  return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[key.trim()]);
}

export default function(ctx, next) {
  try {
    ctx.render = (data = {}) => {
      const store = createStore(data);
      const html = renderToString(
        <Provider store={ store }>
          <StaticRouter location={ ctx.url }>
            <RouterConfig />
          </StaticRouter>
        </Provider>
      );
      const body = templating({ html });
      ctx.body = body;
    }
  } catch (err) {
    ctx.body = templating({ html: err.message });
  }
  ctx.type = "text/html";
  return next();
}
```
  5) 在 server/router/index.js 代码调用 ctx.render 的时候将数据当参数传入就可以了。改成如下代码：
```
import Router from "koa-router";
const routes = new Router();

routes.get("/", (ctx, next) => {
  ctx.render({
    home: {
      title: '我是从node中获取的数据'
    }
  });
  next();
});

routes.get("/list", (ctx, next) => {
  ctx.render({
    list: [
      '列表项1',
      '列表项2',
      '列表项3'
    ]
  });
  next();
});

export default routes;
```
  重启npm run server 刷新下localhost:9000看看效果; 然后从 首页进入列表页，http://localhost:9000/list 这个页面，现在我们刷新下这个页面，服务器端渲染出来的页面数据是如下，但是页面上显示的数据是不一样的，如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/67.jpg" /> <br />

  出现如上问题是：这是因为我们加载了index.js他又重新初始化store，所以会产生这样的问题。

  解决的方法是：把node用到的数据传给前端，前端基于这个数据去初始化store就可以了。

  怎么把数据传给前端？很简单，直接把store注入到window上就行。

  先修改下我们的模板 template/server.html
```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ssr服务器端渲染</title>
</head>
<body>
  <div id="root">{{ html }}</div>
  <script>
    window.__STORE__ = {{ store }}
  </script>
  <script src="http://localhost:8080/vendor.dll.js"></script>
  <script src="http://localhost:8080/js/app.8d3709a5.js"></script>
</body>
</html>
```
  修改 server/templating.js, 代码改成如下：
```
import fs from "fs";
import { renderToString } from "react-dom/server";
import { StaticRouter } from  'react-router-dom';
import RouterConfig from "../src/router";
import React from "react";
import path from "path";

// 新增代码如下：
import { Provider } from "react-redux";
import createStore from "../src/redux/store/create";

// 匹配模版中的 {{}}
function templating(props) {
  const template = fs.readFileSync(path.join(__dirname, "../template/server.html"), "utf-8");
  return template.replace(/{{([\s\S]*?)}}/g, (_, key) => props[key.trim()]);
}

export default function(ctx, next) {
  try {
    ctx.render = (data = {}) => {
      const store = createStore(data);
      const html = renderToString(
        <Provider store={ store }>
          <StaticRouter location={ ctx.url }>
            <RouterConfig />
          </StaticRouter>
        </Provider>
      );
      const body = templating({ 
        html,
        // 新增的
        store: JSON.stringify(data, null, 4),
      });
      ctx.body = body;
    }
  } catch (err) {
    ctx.body = templating({ html: err.message });
  }
  ctx.type = "text/html";
  return next();
}
```
  最后我们在 src/index.js 下 获取store。代码改成如下：
```
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter } from "react-router-dom";
import Router from "./router";

import { Provider } from "react-redux";
import createStore from "./redux/store/create";

const defaultStore = window.__STORE__ || {};
const store = createStore(defaultStore);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
```
  重启npm run server 进入 http://localhost:9000/list 刷新下就正常了。

#### 注意：页面首次进入的时候使用的是服务器端渲染，然后页面跳转的时候，会使用客户端渲染，因此会使用客户端的数据，但是当我们重新刷新页面的时候，又使用的是服务器端渲染的数据。


#### <a href="https://github.com/tugenhua0707/react-ssr">源码请看这里</a>







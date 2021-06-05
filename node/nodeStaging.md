
### node + koa2 + mongodb + GraphQl 从0到1搭建脚手架

#### 一：node基本搭建

- [x] [搭建环境] <br/>
- [x] [添加koa路由] <br/>
- [x] [添加热重启] <br/>
- [x] [支持import模块引入] <br/>
- [x] [解决跨域] <br/>

#### 二：项目框架搭建

- [x] [实现mongodb的基本数据模型] <br/>
- [x] [实现保存数据的控制器] <br/>
- [x] [实现路由，给前端提供API接口] <br/>
- [x] [编写 GraphQL Schema] <br/>

#### 三：在项目中引入React(或React脚手架)

#### 四：添加日志功能

#### 五：处理异常

#### 六：使用PM2实现一键部署项目

#### 一：node基本搭建

#### 1. 搭建环境

  新建一个项目文件夹，命令如下：
```
mkdir koa-staging
```
  然后进入该文件夹，我们初始化生成 package.json文件。命令如下：
```
npm init -y
```
  生成package.json后，安装koa包，命令如下：
```
npm install --save koa
```
#### 启动http服务

  我们在项目的根目录下新建 app.js ，添加如下代码：
```
const Koa = require('koa');
const app = new Koa();

// 对于任何请求到来，app将调用该异步函数处理请求
app.use(async (ctx, next) => {
  ctx.body = "hello world";
  await next();
  // todo
});

app.listen(3000, () => {
  console.log('app started at port 3000');
})
```
  然后我们运行 node app.js 命令:

  在浏览器打开 http://localhost:3000/ 就可以看到输出 "hello world"; 
  如上代码，我们使用 app.use 方法来调用处理异步函数，只有当 next()之后才能执行下一个 app.use()。

#### koa ctx 

  我们会注意到我们上面的demo中ctx，因此我们可以把代码改成如下，打印下 ctx是多少？
```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  ctx.body = ctx;
  await next();
})

app.listen(3000, () => {
  console.log('app started at port 3000');
});
```
  因此我们继续在浏览器访问：http://localhost:3000/ 后，会在浏览器输出如下信息：
```
{
	"request": {
		"method": "GET",
		"url": "/",
		"header": {
			"host": "localhost:3000",
			"connection": "keep-alive",
			"cache-control": "max-age=0",
			"upgrade-insecure-requests": "1",
			"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"sec-fetch-site": "none",
			"sec-fetch-mode": "navigate",
			"sec-fetch-user": "?1",
			"sec-fetch-dest": "document",
			"accept-encoding": "gzip, deflate, br",
			"accept-language": "zh-CN,zh;q=0.9"
		}
	},
	"response": {
		"status": 200,
		"message": "OK",
		"header": {
			"content-type": "application/json; charset=utf-8"
		}
	},
	"app": {
		"subdomainOffset": 2,
		"proxy": false,
		"env": "development"
	},
	"originalUrl": "/",
	"req": "<original node req>",
	"res": "<original node res>",
	"socket": "<original node socket>"
}
```
  如上我们可以看到 ctx 封装了 request 和 response信息，这里的ctx其实是koa中的Context，Koa Context将node的request和response对象封装到这个对象中。我们可以看如下信息表：
```
ctx => Koa Context // koa启动时生成的上下文
ctx.req => 等价于 原生Node的request对象
ctx.res => 等价于原生Node的response对象
ctx.request => koa的Request对象
ctx.response => koa的Response对象
```
  我们知道 ctx 封装了 request 和 response信息，在koa内部对ctx多做了一层delegate(委托)， 即 ctx.body = ctx.response.body。 同样委托还有如下这些：
```
// Request别名

ctx.header
ctx.headers
ctx.method
ctx.url
ctx.path
ctx.query
.....

// Response 别名

ctx.body
ctx.body=
ctx.status
....
```
#### 2. 添加koa路由

#### 原生路由

  我们在项目中会存在多个路由，对于页面会有get/post请求，那么我们怎么样来处理不同的路由请求呢？从上面的ctx可知，我们可以通过 ctx.request.url 拿到请求路径。
  然后switch条件来对路径不同做下区分处理下就可以来。

  因此我们会把我门对 app.js 代码改成如下：
```
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  const url = ctx.url;
  console.log(url);
  switch (url) {
    case '/':
      ctx.body = "hello world";
      break;
    case '/page':
      ctx.body = "hello world 222";
      break;
    case '/404':
      ctx.body = "404页面";
      break;
    default:
      break;
  }
  await next();
})

app.listen(3000, () => {
  console.log('app started at port 3000');
});
```
  因此浏览器访问 http://localhost:3000/, http://localhost:3000/page, http://localhost:3000/404 时候，分别打印 "hello world", "hello world 222", "404页面"。

#### koa-router 路由中间件

  当项目越来越复杂的时候，使用原生路由很麻烦，因此我们可以使用第三方中间件 koa-router来处理，并且我们还需要引入 一个叫 koa-bodyparser 中间件来处理post请求解析参数。因此我们需要安装 该插件，安装命令如下所示：
```
npm install koa-router koa-bodyparser --save
```
  然后我们继续把我们的app.js 代码改成如下：
```
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(bodyParser()); // 处理post请求时，koa无法解析http请求体中的数据

// 对于任何get请求，app将调用该异步函数处理请求
router.get('/', async(ctx, next) => {
  // todo
  ctx.body = '<h1>欢迎光临2</h1>';
})

// 处理post请求
router.post('/', async(ctx) => {
  // 当POST请求的时候，使用中间件 koa-bodyparser解析POST表单里面的数据，并且显示出来
  const postData = ctx.request.body;
  ctx.body = {
    postData
  };
});
app.use(router.routes());

// 在端口监听8081
app.listen(3000);
console.log('app started at port 3000');
```
#### 添加路由前缀

  我们也可以为路由添加前缀，如下添加代码：
```
const Router = require('koa-router')
const router = new Router({
	prefix: '/api'
});
```
  http://localhost:3000/api 我们访问的这样的路径就可以访问到页面了。

#### 3. 添加热重启

  每次修改我们都需要关闭程序，然后在再 node app.js, 为了有热重启的功能，因此我们需要使用到 nodemon. 首先我们需要安装它，安装命令如下：
```
npm install nodemon --save
```
  然后我们修改 package.json 打包配置如下：
```
"scripts": {
  "start": "nodemon app.js"
},
```
  我们再运行 npm start, 就可以达到热重启的效果。我们修改代码后，重新刷新浏览器就可以看到效果了。

#### 4. 支持import模块引入

  由于目前原生的node是不支持import引入模块的，假如你使用import引入模块的话，会报如下的错:
```
import Router from 'koa-router';
       ^^^^^^
SyntaxError: Unexpected identifier
```
  因此我们需要安装如下模块依赖：
```
npm install babel-plugin-transform-es2015-modules-commonjs babel-register --save
```
  然后 在根目录下创建start.js。添加如下代码：
```
require('babel-register')
(
  {
    plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  }
)
module.exports = require('./app.js');
```
  我们再 修改下package.json文件代码如下：
```
"scripts": {
  "start": "nodemon start.js"
},
```
  现在 我们运行 npm start, 这时候可以看到我们的项目已经支持import语法了。

#### 5. 解决跨域

  我们需要实现接口跨域，我们可以使用 koa2-cors 处理，安装命令如下所示：
```
npm install koa2-cors --save
```
  然后我们在 app.js 中添加如下代码：
```
const cors = require('koa2-cors');
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));
```
#### 二：项目框架搭建

  项目目录架构如下：
```
｜---- demo
｜ |---- controller           // 控制层
｜ |---- middleware           // 中间件
｜ |---- mongodb              // mongodb
｜ |---- router               // 路由
｜ |  |---- index.js          // 主路由
｜ |---- graphql              // 用于存放管理graphql相关的js文件
｜ ｜ ｜--- schema.js
｜ |---- app.js               // 主入口
｜ |---- config.js            // 配置文件
｜ |---- start.js             // 入口
｜ |---- ecosystem.config.js  // pm2启动文件
｜ |---- package.json
```
#### start.js

  入口文件start.js 引入了babel，使得我们项目可以使用ES6的语法，基本代码配置如下：
```
require('babel-register')
(
  {
    plugins: ['babel-plugin-transform-es2015-modules-commonjs'],
  }
)
module.exports = require('./app.js');
```
#### app.js

  app.js 添加了一些中间件和路由，并且监听了服务器端口号，基本代码配置如下：
```
// 引入模块
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import KoaStatic from 'koa-static';
import Router from 'koa-router';
import cors from 'koa2-cors';
const { ApolloServer } =  require('apollo-server-koa');

const { typeDefs, resolvers } = require('./graphql/schema');
const apollo = new ApolloServer({ typeDefs, resolvers });

// 引入数据库
import { database } from './mongodb';
database();

// 引入路由
import routerMap from './router';

const app = new Koa();
const router = new Router();

// 使用 bodyParser 和 koaStatic中间件
app.use(bodyParser()); // 处理post请求时，koa无法解析http请求体中的数据
app.use(KoaStatic(__dirname + '/public'));

/**
 * app.use(router.routes()) 将路由注册到app对象上面 这样就可以让router帮我们处理url和处理函数之间的映射
 * 处理post请求的时候，koa无法解析http请求体中的数据，因此我们需要引入 koa-bodyparser
 * app.use(router.allowedMethods()) 处理status为空或者404情况的404情况的
 */
app
  .use(router.routes())
  .use(router.allowedMethods());

// 使用路由
router.use(routerMap.routes());

// 使用 apollo
app.use(apollo.getMiddleware());

// 解决跨域
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

app.listen(3000, () => {
  console.log('graphQL server listen port: ' + 3000);
  console.log(`Server ready at http://localhost:3000${apollo.graphqlPath}`)
});
```
  因此我们需要安装如上一些第三方库插件，安装命令如下：
```
npm install --save koa koa-bodyparser koa-static koa-router koa2-cors apollo-server-koa
```
#### 实现mongodb的基本数据模型

  想要了解更多关于 mongoose类实现增删改查，<a href="https://www.cnblogs.com/kongzhi0707/p/9256605.html">请看这篇文章</a> 
```
  1) 在mongodb文件夹新建一个 index.js 和 schema文件夹，在schema文件夹下面新建 user.js 和 info.js, user.js 是用户表, info.js 是用户信息表。
  2）在 config.js 文件中添加配置代码。
```
#### config.js 代码如下
```
export default {
  dbPath: 'mongodb://localhost/graphql'
}
```
#### mongodb/index.js 主要是链接数据库的代码
```
// 引入 mongoose 模块
import mongoose from "mongoose";
import config from "../config";

// 加载用户表 和 信息表
require('./schema/info');
require('./schema/user');

// 连接mongodb

export const database = () => {
  mongoose.set('debug', true);

  mongoose.connect(config.dbPath);

  // 数据库断开的时候 重新连接数据库
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.dbPath);
  });
  mongoose.connection.on("error", err => {
    console.log('err', err);
  });
  mongoose.connection.on("open", async () => {
    console.log("Connection to MongoDB")
  })
}
```
  因此我们需要安装 mongoose， 安装命令如下：
```
npm install --save mongoose
```
  如上加载了 info.js 和 user.js, 它是用户信息的数据模型，下面我们来看看该数据模型。

#### mongodb/schema/info.js 代码如下：
```
// 引入 mongoose
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const InfoSchema = new Schema({
  love: String,
  userId: ObjectId,
  height: String,
  weight: Number
});

// 建立数据模型
mongoose.model("Info", InfoSchema);

#### mongodb/schema/user.js 代码如下：

// 引入mongoose

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  name: String,
  sex: String,
  age: Number,
  // 引用Info信息表
  info: {
    type: ObjectId,
    ref: "Info"
  },
});

// 建立数据模型
mongoose.model("userInfo", UserSchema);
```
#### 实现保存数据的控制器

  如上user和info数据模型已经完成了，我们现在需要添加一些存储数据的方法，这些方法我们都写到控制器里面。因此我们需要在 controller 文件夹下新建 user.js 和 info.js文件。该文件是数据控制器。

  controller/info.js 代码如下：
```
import mongoose from "mongoose";
const Info = mongoose.model("Info");

// 新增info信息
export const newAddInfo = async(ctx, next) => {
  // 获取请求数据
  const opts = ctx.request.body;
  const info = new Info(opts);
  const saveInfo = await info.save(); // 保存数据
  // 判断保存是否成功, 然后把数据返回给前端
  if (saveInfo) {
    ctx.body = {
      success: true,
      data: saveInfo
    };
  } else {
    ctx.body = {
      success: false,
      data: null
    };
  }
}

// 获取所有的info数据，查询操作
export const fetchInfo = async (ctx, next) => {
  const infos = await Info.find({}); // 数据查询
  // 如果有数据，就返回给前端
  if (infos.length) {
    ctx.body = {
      success: true,
      data: infos
    }
  } else {
    ctx.body = {
      success: false,
      data: null
    };
  }
}
```
  controller/user.js 代码如下：
```
import mongoose from "mongoose";
const userInfo = mongoose.model("userInfo");

// 新增用户表
export const newUser = async(ctx, next) => {
  // 获取请求数据
  const opts = ctx.request.body;
  const info = new userInfo(opts);
  // 保存数据
  const saveInfo = await info.save();
  // 判断是否保存成功，然后把数据返回给前端
  if (saveInfo) {
    ctx.body = {
      success: true,
      data: saveInfo
    };
  } else {
    ctx.body = {
      success: false,
      data: null
    };
  }
}

// 查询所有的用户数据
export const fetchUserInfo = async (ctx, next) => {
  // 数据查询
  const infos = await userInfo.find({});
  // 如果有数据，就返回给前端
  if (infos.length) {
    ctx.body = {
      success: true,
      data: infos
    };
  } else {
    ctx.body = {
      success: false,
      data: null
    };
  }
}
```
#### 实现路由，给前端提供API接口

  我们使用 koa-router 路由中间件来实现请求的接口。我们会在 app.js 之前加入如下代码的。
```
// 引入路由
import routerMap from './router';

// 使用路由
router.use(routerMap.routes());
```
  因此我们现在需要实现router相关的配置，我们在项目的根目录下的 router 文件夹下新建index.js, 该文件的作用是管理我们的路由模块的。

  然后在 router/index.js 添加如下代码来处理路由模块。代码如下所示：
```
const { newUser, fetchUserInfo } = require("../controller/user");
const { newAddInfo, fetchInfo } = require("../controller/info");

const router = require('koa-router')();

// 新增用户 post请求
router.post('/newUser', newUser);

// 查询用户 get请求
router.get('/fetchUserInfo', fetchUserInfo);

// 新增信息
router.post('/newAddInfo', newAddInfo);

// 查询信息
router.get('/fetchInfo', fetchInfo);

module.exports = router;
```
#### 编写 GraphQL Schema

  我们首先需要在项目根目录下面的 graphql文件夹下新建一个 schema.js 文件。这里我们使用到了 apollo-server-koa 模块，因此我们需要安装 apollo-server-koa 模块，该模块是koa集成的graphql服务器模块的。graphql server 是一个社区维护开源的graphql服务器。因此我们需要安装该模块，命令如下所示：
```
npm install --save apollo-server-koa
```
  graphQl的入门教程，<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/graphql.md">请看这篇文章</a>

  graphql/schema.js 代码如下：
```
const { gql } = require('apollo-server-koa');
const mongoose = require('mongoose');

const UserModel = mongoose.model('userInfo');
const InfoModel = mongoose.model("Info");

const typeDefs = gql`
  type Info {
    height: String,
    weight: String,
    love: String,
    userId: ID,
    _id: ID
  }
  type userInfo {
    name: String,
    sex: String,
    age: Int,
    _id: ID,
    info: Info
  }
  type Query {
    getUser: [userInfo],
    getUserInfo(id: ID): Info
    getInfo: [Info],
  }
  type Mutation {
    addUser(post: UserInput): userInfo
    addUserInfo(id: ID, height: String, weight: String, love: String): Info
    updateUserInfo(id: ID, height: String, weight: String, love: String): Info
  }
  input UserInput {
    name: String,
    age: Int,
    sex: String
  }
`;

const resolvers = {
  Query: {
    getUser: (parent, args, context, info) => {
      return UserModel.find({});
    },
    getUserInfo: async (parent, args, context, info) => {
      const ret = await InfoModel.find({userId: args.id});
      return ret[0];
    },
    getInfo: (parent, args, context, info) => {
      return InfoModel.find({});
    }
  },
  Mutation: {
    addUser: (parent, args, context) => {
      const { name, age, sex } = args.post;
      return UserModel.create({ name, age, sex });
    },
    addUserInfo: (parent, args, context) => {
      const {id, height, weight, love} = args;
      return InfoModel.create({ height, weight, love, userId: id });
    },
    updateUserInfo: (parent, args, context) => {
      const {id, height, weight, love} = args;
      return InfoModel.findOneAndUpdate({ userId: id }, { height, weight, love });
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
```
  如上完成后，我们重启服务器, 运行 npm start 后，访问 http://localhost:3000/graphql 就可以看到如下界面了。

  现在我们可以在左侧添加一条数据进去，执行如下命令：
```
mutation {
  addUser(post: {
    name: "张三1",
    age: 32,
    sex: "男"
  }) {
    name
    _id 
    sex
    age
  }
}
```
  执行结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/95.jpg" /> <br />

  然后我们进行查询所有用户的数据，使用如下命令即可：
```
query {
  getUser {
    name
    age
    sex
  }
}
```
  执行结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/96.jpg" /> <br />

  然后我们再新增用户的一些基本信息，执行如下命令操作：
```
mutation {
  addUserInfo (
    height: "170cm",
    weight: "65",
    love: "跑步, 唱歌",
  ) {
    weight
    height 
    love
    _id
  }
}
```
  执行结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/97.jpg" /> <br />

  然后我们进行查询用户信息，执行如下命令操作：
```
query {
  getInfo {
    height
    weight
    love
    _id
  }
}
```
  执行结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/98.jpg" /> <br />

#### 三：在项目中引入React(或React脚手架)

  如上我们可以实现一个后端接口服务了，现在我们引入我们之前的React前端脚手架到我们的项目中，具体在koa项目的根目录下引入React脚手架，可以看我npm包中的React脚手架，<a href="https://www.npmjs.com/package/front-end-staging">请点击查看React脚手架</a>。 

  比如我想让React前端脚手架叫 reactProject 这个名字的话，我们需要在 koa项目的根目录下运行 kz init reactProject 命令后执行即可在项目中引入前端
脚手架到我们的后端服务中。引入完成后，我们进入 cd reactProject 项目中，先使用 npm install 把所有依赖包下载下来，然后执行命令: npm run build:dll
下载第三方库文件打包后，再执行 npm run  dev 后就可以把我们的前端项目启动起来了。现在我们需要测试的是：在前端react项目中请求 http://localhost:3000/fetchUserInfo?id=LocalNews&ajax=json 这个接口拿到接口数据。首先我们先在前端项目中引入 axios库文件实现ajax发送请求。因此在
react项目的根目录下 下载 http-client-axios 这个库，该库是自己封装好的，如何具体使用，<a href="https://www.npmjs.com/package/http-client-axios">请查看npm库</a>。 

  然后我们会在 server/config.js 中引入请求，比如如下代码：
```
// 请求
export const getUserInfo = options => httpClient.request({
  url: `${namespace}/fetchUserInfo`,
  params: params(options),
  // method: 'post',
  // 请求拦截器回调函数
  requestCallBack(cfg) {
    console.log('xxxx--请求拦截器添加参数----');
    console.log(cfg);
    cfg.headers['Accept'] = 'application/x-www-form-urlencoded';
    cfg.headers.common['Authorization'] = 'AUTH_TOKEN';
  },
  // 响应拦截器回调函数
  responseCallBack(cfg) {
    // cfg.status = 404;
    console.log('---响应拦截器可以对返回的数据进行构造---', cfg);
    // cfg.data = {'xx': 11};
  }
});
```
  然后在我们的 src/app.js 中引入该ajax请求如下：
```
import React,  { useState, useEffect } from "react";
import { getUserInfo } from './server/config';

useEffect(() => {
  console.log(111);
  getUserInfo({
    'id': 'LocalNews',
    'ajax': 'json'
  }).then((data) => {
    console.log('data---');
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
})
```
  然后我们刷新页面就会请求接口，http://localhost:3000/fetchUserInfo?id=LocalNews&ajax=json， 在控制台中我们看到会出现跨域的情况，因此我们需要在node中允许跨域，配置代码如下：

  koa-stating/app.js 引入如下代码：
```
const cors = require('koa2-cors');
/*
 解决跨域 需要放在中间件的最前面
 app.use(cors()); // 全部允许跨域
*/
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'], // 设置允许的HTTP请求方法
  // 设置服务器支持的所有头信息字段
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}));
```
#### 注意：跨域cors要放在app.js 中的顶部，放在请求的前面即可。

  最后我们在页面中访问，可以看到接口请求成功了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/99.jpg" /> <br />

  如上我们就可以拿到数据了，然后去渲染页面即可。

#### 四：添加日志功能

  日志能够让我们能够监控应用的运行状态，问题及排查等。因此我们需要在项目中引入 log4js-node 来记录日志。

  首先我们需要安装 log4js， 安装命令如下：
```
  npm install log4js --save
```
  然后我们在项目的根目录下新建 config文件夹，在该文件夹下新建 index.js 代码如下：


  <a href="https://github.com/kongzhi0707/koa-staging">Github查看源码</a>










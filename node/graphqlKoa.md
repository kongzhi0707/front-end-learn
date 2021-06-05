### Koa + GraphQL 入门教程

#### 一：项目构建

  首先建立一个项目文件夹，比如名字叫 koa-graphql-mongodb, 然后在该项目下新建一个 server.js(node服务)， config文件夹，mongodb文件夹，router文件夹，controllers文件夹以及public文件夹(主要存放前端页面的)。因此项目结构如下：
```
|---- koa-graphql-mongodb
| |---- router 
| |---- config
| |---- mongodb
| |---- controller
| |---- public
| |---- server.js
| |---- package.json
| |---- node_modules
```
  首先我们 生成一个package.json, 执行命令 npm init -y;

  server.js 添加如下代码：
```
// 引入模块
import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

// 使用 bodyParser 和 koaStatic 中间件

app.use(bodyParser());
app.use(KoaStatic(__dirname + '/public'));

// 路由设置
router.get('/test', (ctx, next) => {
  ctx.body = "test page";
});

/**
 * app.use(router.routes()) 将路由注册到app对象上面 这样就可以让router帮我们处理url和处理函数之间的映射
 * 处理post请求的时候，koa无法解析http请求体中的数据，因此我们需要引入 koa-bodyparser
 * app.use(router.allowedMethods()) 处理status为空或者404情况的404情况的
 */
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(4000);

console.log('graphQL server listen port: ' + 4000);
```
  因此我们需要安装如下几个包，安装包命令如下：
```
npm install koa koa-static koa-router koa-bodyparser --save;
```
  然后我们再运行 node server.js，然后会报如下这样的错误：
```
import Koa from 'koa';
       ^^^
SyntaxError: Unexpected identifier
```
  原因是现在的node版本并没有支持es6的模块引入方式。 因此我们需要使用@babel/register在node运行时候编译以及es6语法：

#### 二：支持es6的模块引入方式

  下面在项目文件夹根目录下新建一个start.js，然后在里面写上以下代码：
```
require('@babel/register')({
  presets: [
    '@babel/preset-env'
  ],
});
require('./server.js');
```
  因此我们需要安装如下包，安装命令如下：
```
npm install @babel/core @babel/preset-env @babel/register --save-dev
```
  安装完毕之后，我们在命令行运行 node start.js. 因此我们就会启动我们的项目了。因此我们可以访问：http://localhost:4000/test

#### 三：实现mongodb的基本数据模型

  这里我们需要 mongodb 存储数据 及 利用 mongoose 模块操作 mongodb 数据库. 
想要了解更多关于 mongoose类实现增删改查，<a href="https://www.cnblogs.com/tugenhua0707/p/9256605.html">请看这篇文章</a>

  1）在mongodb文件夹新建一个index.js 和 schema 文件夹，在schema文件夹下面新建 info.js 和 student.js. info.js是基础信息表。 student.js
是学生表。

  2) 在config文件夹下面建立一个 index.js，该文件夹是存放配置代码的。

  config/index.js 代码如下：
```
export default {
  dbPath: 'mongodb://localhost/graphql'
}
```
  如上是数据库配置代码。

  然后我们需要在 mongodb/index.js 写上连接数据库的代码。

  mongodb/index.js 代码如下：
```
// 引入 mongoose 模块
import mongoose from "mongoose";
import config from "../config";

// 加载基本信息表 和 学生表

require('./schema/info');
require('./schema/student');

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
  如上加载了 info.js 和 student.js, 这两个分别是学生的附加信息和基本信息的数据模型。下面我们来看看如下两个数据模型。

  mongodb/schema/info.js 代码如下：
```
// 引入 mongoose

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId

const InfoSchema = new Schema({
  hobby: [String],
  height: String,
  weight: Number,
  studentId: ObjectId,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// 建立数据模型
mongoose.model("Info", InfoSchema);

mongodb/schema/student.js 数据模型代码如下：

import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const StudentSchema = new Schema({
  name: String,
  sex: String,
  age: Number,
  info: {
    type: ObjectId,
    ref: "Info"
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

// 建立数据模型
mongoose.model("Student", StudentSchema);
```
#### 四：实现保存数据的控制器

  如上数据模型已经完成了，我们现在需要添加一些存储数据的方法，这些方法都写到我们的控制器里面。因此我们需要在 controller 文件夹下新建 info.js 和
student.js 两个文件，该两个文件是数据控制器。

  controller/info.js 代码如下：
```
import mongoose from "mongoose";
const Info = mongoose.model("Info");

// 新增info信息 新增操作
export const saveInfo = async (ctx, next) => {
  // 获取请求数据
  const opts = ctx.request.body;
  const info = new Info(opts);
  const saveInfo = await info.save(); // 保存数据
  // 判断是否保存成功 然后把数据返回给前端
  if (saveInfo) {
    ctx.body = {
      success: true,
      info: saveInfo
    };
  } else {
    ctx.body = {
      success: false
    };
  }
}

// 获取所有的info数据  查询操作

export const fetchInfo = async (ctx, next) => {
  const infos = await Info.find({}); // 数据查询
  // 如果有数据，就返回给前端
  if (infos.length) {
    ctx.body = {
      success: true,
      info: infos
    };
  } else {
    ctx.body = {
      success: false
    };
  }
}
```
  如上代码，是我们前端使用post请求过来的数据，然后保存到mongodb数据库中，如果保存成功的话，就把数据返回给前端。

  同理，我们使用这个方法来实现 student数据的保存及获取。

  controller/student.js
```
import mongoose from 'mongoose';
const Student = mongoose.model('Student');

// 保存学生数据的方法
export const saveStudent = async (ctx, next) => {
  // 获取前端请求的数据
  const opts = ctx.request.body;
  const student = new Student(opts);
  // 保存数据
  const saveStudent = await student.save();
  if (saveStudent) {
    ctx.body = {
      success: true,
      student: saveStudent
    };
  } else {
    ctx.body = {
      success: false
    };
  }
}

// 查询所有学生的数据
export const fetchStudent = async (ctx, next) => {
  const students = await Student.find({});
  if (students.length) {
    ctx.body = {
      success: true,
      student: students
    };
  } else {
    ctx.body = {
      success: false
    };
  }
}

// 查询学生的数据以及附加数据  连表查询
export const fetchStudentDetail = async (ctx, next) => {
  /**
   * 利用populate来查询关联info的数据
   * 更多populate知识请查看： https://itbilu.com/nodejs/npm/HkAKMTECm.html
   */
  const students = await Student.find({}).populate({
    path: 'info',
    select: 'hobby height weight'
  }).exec()
  if (students.length) {
    ctx.body = {
      success: true,
      student: students
    };
  } else {
    ctx.body = {
      success: false
    };
  }
}
```
#### 五：实现路由，给前端提供API接口

  使用koa-router路由中间件来实现请求的接口。因此我们需要在 server.js 加入如下代码：
```
// 引入模块
import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

// 引入数据库
import { database } from './mongodb';
database();

// 引入路由
const GraphqlRouter = require('./router');

const app = new Koa();
const router = new Router();

// 使用 bodyParser 和 koaStatic 中间件

app.use(bodyParser());
app.use(KoaStatic(__dirname + '/public'));

// 路由设置
router.get('/test', (ctx, next) => {
  ctx.body = "test page";
});

/**
 * app.use(router.routes()) 将路由注册到app对象上面 这样就可以让router帮我们处理url和处理函数之间的映射
 * 处理post请求的时候，koa无法解析http请求体中的数据，因此我们需要引入 koa-bodyparser
 * app.use(router.allowedMethods()) 处理status为空或者404情况的404情况的
 */
app
  .use(router.routes())
  .use(router.allowedMethods());

// 使用路由
router.use('', GraphqlRouter.routes());

app.listen(4000);

console.log('graphQL server listen port: ' + 4000);
```
  如上代码，添加了如下代码：
```
// 引入路由
const GraphqlRouter = require('./router');

// 使用路由
router.use('', GraphqlRouter.routes());
```
  因此我们现在需要实现router相关的配置，我们在项目的根目录下的 router 文件夹下新建index.js, 该文件的作用是管理我们的路由模块的。

  然后在 router/index.js 添加如下代码来处理路由模块。代码如下所示：
```
const { saveInfo, fetchInfo } = require('../controller/info');
const { saveStudent, fetchStudent, fetchStudentDetail } = require('../controller/student');

const router = require('koa-router')();

router.post('/saveInfo', saveInfo);
router.get('/info', fetchInfo);

router.post('/saveStudent', saveStudent);
router.get('/student', fetchStudent);
router.get('/studentInfo', fetchStudentDetail);

module.exports = router;
```
#### 六 编写Graphql Schema

  首先我们需要在项目的根目录下新建一个 graphql 文件夹，该文件夹用于存放管理 graphql相关的js文件。然后在 graphql文件夹新建一个 schema.js 文件。
这里我们使用到了 apollo-server-koa 模块，因此我们需要安装 apollo-server-koa 模块，该模块是koa集成的graphql服务器模块的。graphql server 是一个社区维护开源的graphql服务器。因此我们需要安装该模块，命令如下所示：
```
npm install --save apollo-server-koa
```
  apollo-server-koa 的使用请看 npm 包的使用方式，<a href="https://www.npmjs.com/package/apollo-server-koa">点击请查看</a> 

  graphQl的入门教程，<a href="https://github.com/tugenhua0707/react-collection/blob/master/node/graphql.md">请看这篇文章</a>

  graphql/schema.js 代码如下：
```
const { gql } = require('apollo-server-koa');
const mongoose = require('mongoose');

const InfoModel = mongoose.model('Info');
const StudentModel = mongoose.model('Student');

const typeDefs = gql`
  type Info {
    height: String
    weight: String
    hobby: [String],
    studentId: ID,
    _id: ID
  }
  type Student {
    name: String,
    sex: String,
    age: Int,
    _id: ID,
    info: Info
  }
  type Query {
    getStudent: [Student]
    getStudentInfo(id: ID): Info
    getInfo: [Info]
  }
  type Mutation {
    addStudent(post: StudentInput): Student
    addStudentInfo(id: ID, height: String, weight: String, hobby: [String]): Info
    changeStudentInfo(id: ID, height: String, weight: String, hobby: [String]): Info
  }
  input StudentInput {
    name: String
    sex: String
    age: Int
  }

const resolvers = {
  Query: {
    getStudent: (parent, args, context, info) => {
      return StudentModel.find({});
    },
    getStudentInfo: async (parent, args, context, info) => {
      const ret = await InfoModel.find({studentId: args.id});
      return ret[0];
    },
    getInfo: (parent, args, context, info) => {
      return InfoModel.find({});
    }
  },
  Mutation: {
    addStudent: (parent, args, context) => {
      const { name, sex, age } = args.post;
      return StudentModel.create({ name, sex, age });
    },
    addStudentInfo: (parent, args, context) => {
      const { id, height, weight, hobby } = args;
      return InfoModel.create({ hobby, height, weight, studentId: id });
    },
    changeStudentInfo: (parent, args, context) => {
      const { id, height, weight, hobby } = args;
      return InfoModel.findOneAndUpdate({ studentId: id }, { height, weight, hobby });
    }
  }
};

module.exports = {
  resolvers,
  typeDefs
};
```
  如上完成后，我们重启服务器, 运行 npm start 后，访问 http://localhost:4000/graphql 就可以看到如下界面了，如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/89.jpg" /> <br />

  现在我们可以在左侧添加一条数据进去，执行如下命令：
```
mutation {
  addStudent(post: {
    name: "张三",
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
  执行效果如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/90.jpg" /> <br />

  然后我们进行查询所有学生的数据，使用如下命令即可：
```
query {
  getStudent {
    name
    age
    sex
  }
}
```
<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/91.jpg" /> <br />

  然后我们再新增学生的一些基本信息，执行如下命令操作：
```
mutation {
  addStudentInfo(
    weight: "200",
    height: "180",
    hobby: "xx"
  ) {
    weight
    height 
    hobby
    _id
  }
}
```
  执行结果如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/92.jpg" /> <br />

  然后我们进行查询学生信息，执行如下命令操作：
```
query {
  getStudentInfo {
    weight
    height
    hobby
    _id
  }
}
```
  执行结果如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/93.jpg" /> <br />

#### 实现前端接口调用

  在public文件夹下面新建一个 index.html, js文件夹，css文件夹，然后在js文件夹下新建一个 index.js 文件，在css文件夹下新建一个 index.css文件，代码
如下：

  public/index.html 代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GraphQL-demo</title>
  <link rel="stylesheet" href="./css/index.css">
</head>
<body>
  <h1 class="app-title">GraphQL-前端demo</h1>
  <div id="app">
    <div class="student list">
      <h3>班级学生列表</h3>
      <ul id="studentList">
        <li>暂无数据....</li>
      </ul>
    </div>
  </div>
  <div class="btnbox">
    <div class="btn" id="btn2">点击常规获取班级学生列表</div>
  </div>
  <div class="toast"></div>
  <script src="https://cdn.bootcss.com/jquery/1.10.2/jquery.js"></script>
  <script src="./js/index.js"></script>
</body>
</html>
```
  js/index.js 代码如下：
```
window.onload = function () {

  $('#btn2').click(function() {
    $.ajax({
      url: '/student',
      data: {},
      success:function (res){
        if (res.success) {
          renderStudent (res.student)
        }
      }
    })
  })

  function renderStudent (data) {
    var str = '';
    if (data && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        str += '<li>姓名：'+data[i].name+'，性别：'+data[i].sex+'，年龄：'+data[i].age+'</li>'
      }
    }
    console.log(str);
    $('#studentList').html(str)
  }
}
```
  然后当我们点击html中的按钮时候，页面显示的信息如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/94.jpg" /> <br />

#### <a href="https://github.com/tugenhua0707/koa-graphql-mongodb/tree/master/koa-graphql-mongodb">源码请点击查看</a>






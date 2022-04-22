
### 学习使用 umi3

#### 一：什么是Umi？

Umi 是可扩展的企业级前端应用框架。Umi以路由为基础的。支持配置式路由和约定式路由。它有完善的生命周期插件体系。支持各种功能的扩展和业务需求。

它主要包含如下功能点：

1）可扩展：Umi 实现了完整的生命周期，并使其插件化，Umi 内部功能也全由插件完成。此外还支持插件和插件集，以满足功能和垂直域的分层需求。
2）开箱即用：Umi 内置了路由、构建、部署、测试等，仅需一个依赖即可上手开发。并且还提供针对 React 的集成插件集，内涵丰富的功能。
3）大量自研：包含微前端、组件打包、文档工具、请求库、hooks 库、数据流等，满足日常项目的周边需求。
4）完备路由：同时支持配置式路由和约定式路由，同时保持功能的完备性，比如动态路由、嵌套路由、权限路由等等。

#### 什么时候不能使用umi？

1）需要支持 IE8 或 更低版本的浏览器。
2）需要支持 React 16.8以下的React。
3）需要跑在 Node 10 以下的环境中。
4）需要选择不同的路由方案。

#### 二：umi3 环境搭建

在对应的文件目录 新建 umi3 文件夹，创建项目，执行如下命令：

$ mkdir umi3 && cd umi3
$ yarn create @umijs/umi-app 
$ yarn
$ yarn start

然后 访问 http://localhost:8000/ 就可以访问页面了。

#### 配置 prettier, eslint, stylelint

@umijs/fabric 它是一个包含 prettier, eslint, stylelint 的配置文件合集。安装 @umijs/fabric 命令如下：

yarn add @umijs/fabric -D

然后我们需要在我们项目的根目录下 新建 .eslintrc.js, .prettierrc.js, .stylelintrc.js 

.eslintrc.js 配置代码如下：

module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  // in antd-design-pro
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  }, 
  rules: {
    // your rules
    'prefer-const': 0,
  },
};

.stylelintrc.js 配置代码如下：

const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.stylelint,
}

.prettierrc.js 代码如下：

const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  semi: false,
}

然后我们根目录新建 eslint 忽略文件 .eslintignore, 添加如下配置代码，忽略 node_modules 目录下的所有文件。

// .eslintrc.js
node_modules

在package.json 里面的 lint-staged 新增 "eslint --fix";

"lint-staged": {
  "*.{js,jsx,less,md,json}": [
    "prettier --write"
  ],
  "*.ts?(x)": [
    "prettier --parser=typescript --write",
     "eslint --fix"  // 这句是新增的
  ]
},








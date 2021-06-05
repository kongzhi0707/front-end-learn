
### 在项目中添加eslint规范

#### 一：安装Eslint
```
// 安装eslint
// 安装eslint-loader 在webpack中解析
// 安装babel-eslint  对Babel解析器的包装与ESLint兼容
// -D 安装在开发依赖环境 devDependencies 原--save-dev的简写
npm i eslint eslint-loader babel-eslint  -D
```
#### 二）了解eslint的配置
```
创建.eslintrc.js配置文件(默认是.eslintrc文件)
// .eslintrc.js
module.exports = {
  // 指定脚本的运行环境
  'env': {},

  'extends': [],

  // 脚本在执行期间访问的额外的全局变量
  'globals': {},

  // 指定解析器
  'parse': '',

  // 指定解析器选项
  'parserOptions': {},

  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  
  // 别人可以直接使用你配置好的ESLint
  'root': true,
  
  // 启用的规则及其各自的错误级别
  'rules': {}
};
```
#### 2.1）环境配置 (env)
  默认情况下，所有的环境变量为false，我们可以设置为true让它在这些环境中运行。并且我们可以设置多项，且设置多项环境并不会冲突。可以根据我们需要自由搭配。
可用的环境有如下：
```
{
  "env": {
    browser: true | false, // 浏览器全局变量。
    node: true | false, // Node.js全局变量和Node.js范围。
    commonjs: true | false, // CommonJS全局变量和CommonJS范围（使用Browserify / WebPack的浏览器代码）
    shared-node-browser: true | false, // Node.js和Browser的通用全局。
    es6: true | false, // 启用除模块外的所有ECMAScript 6功能（这会自动将ecmaVersion解析器选项设置为6）。
    amd: true | false, // 根据amd规范定义require()和define()作为全局变量。
    mocha: true | false, // 增加了所有的Mocha测试全局变量。
    ...// 
  }
}
```
  如上是一些常用的配置环境，还有很多不常用的就不列举了。

#### 2.2）共享配置（extends）

  该属性可以是 eslint命令，也可以是继承文件的路径。它是属性基础规则，"rules" 属性中配置的规则都是基于这个规则之上配置的。

  eslint:all: 表示引入当前版本eslint的所有核心规则。
  eslint:recommended: 表示引入eslint的核心功能，并且报告一些常见的共同错误。 如果值为绝对或相对路径则相当于导入路径对应的规则配置。

  如：
```
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
}
```
#### 2.3) 全局变量（globals）指定全局变量的值为true｜false，true表示变量可以被覆盖，false表示不允许被覆盖。
```
{
  "globals": {
    "document": true,
    "navigator": true,
    "window": true,
    "think": true
  }, 
}
```
#### 2.4) 解析器 (parser) 默认情况下Eslint使用的是Espree解析器的，我们可以把它改成 'babel-eslint' 解析器。babel-eslint 解析器是对babel解析器的包装使其与Eslint解析。
```
{
  "parser": "babel-eslint"
}
```
#### 2.5) 解析器选项（parserOptions）
```
{
  "parserOptions": {
    "ecmaVersion": 6, // ES的版本，默认为5

    // 默认为script。sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
    "sourceType": "module", // script | module，

    "ecmaFeatures": { // 指定要使用其他那些语言对象
      "experimentalObjectRestSpread": true,// 启用对对象的扩展
      "jsx": true, // 启用jsx语法
      "globalReturn":true, // 允许return在全局使用
      "impliedStrict":true // 启用严格校验模式
    }
  }
}
```
#### 2.6) 插件（plugins）

  该属性配置需要加载的第三方插件。这里我们需要先安装对应插件才能使用。比如如下：
```
{
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
}
```
#### 2.7）rules 属性配置检查规则

  在配置文件中可以设置一些规则，规则的错误等级有如下三种：
```
1）"off" 或者 0: 关闭规则。
2) "warn"或者1: 打开规则，并且作为一个警告。
3）"error" 或者 2: 打开规则，并且作为一个错误。
```
#### 三）忽略文件 .eslintignore

  我们的整个项目中，有一些文件是不需要eslint进行检查的，我们可以用到忽略文件。

  在我们项目的根目录下新建一个文件，命名为 ".eslintignore", Eslint 会自动识别这个文件。

  这个配置文件里面，每一行都是一个glob模式语句，具体格式如下： 
```
1）以 # 开头的行被当作注释，不影响忽略模式。
2）路径是相对于 .eslintignore 的位置或当前工作目录。这也会影响通过 --ignore-pattern传递的路径。
3）忽略模式同 .gitignore 规范是一样的。
4）以 ! 开头的行是否定模式，它将会重新包含一个之前被忽略的模式。
```
  以下是一个简单的.eslintignore文件示例：
```
node_modules/* 
**/vendor/*.js
```
  上面的含义是：Eslint会忽略node_modules和vendor目录下的所有文件，对该目录下的文件不进行检查。

#### 四）在webpack环境中使用Eslint

  在webpack配置中使用eslint加载器了。
```
// webpack.config.js
module.exports = {
  entry: '',
  output: {},
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  plugins: [],
  devServer: {}
};
```

<a href="https://github.com/kongzhi0707/eslints-rule">github 源码配置</a>














### vscode代码格式化prettier, eslint环境配置

#### 一：Eslint

  Eslint 是一个javascript代码检测工具，比如未使用的变量，未定义的引用，多了或少了一个空格 等代码质量检测。优势是：提高了团队协作代码规范的统一性。提高了代码的质量。

#### Eslint 使用

  执行如下命令，创建项目：
```
mkdir eslint-demo && cd eslint-demo    // 创建项目
npm init                               // 初始化 npm
touch index.js                         // 创建入口文件
npm install eslint -D                  // 安装 eslint 依赖
```

  如上我们创建了一个项目，并且安装了 eslint， 接着我们在 index.js 中写入代码，
```
const name = "kongzhi"
```
  在 package.json 的 scripts 选项中加入一条检测脚本，代表我们要对 目录下所有js文件进行 eslint 检测。
```
"scripts": {
  "lint": "eslint ."
}
```
  然后我们需要在我们项目的根目录下手动创建一个eslint的配置文件。命名可以是 .eslintrc.json, .eslintrc.js, .eslintrc.yaml, 我们这边使用 .eslintrc.json 配置文件，添加如下配置代码：
```
{
  "env": {  // 全局环境变量
    "browser": true, // 浏览器环境
    "node": true    // node 环境
  },
  "extends": "eslint:recommended",  // 继承 eslint 默认配置
  "parserOptions": {   // 指定 javascript 语言类型和风格
    "ecmaVersion": 2015,
    "sourceType": "module"  // 导入方式设定为模块导入
  },
  "rules": {  // 配置规则
    "no-unused-vars": 1,  // 警告不允许出现未使用的变量
    "semi": [1, "always"] // 警告强制加上句尾分号
  }
}
```
  现在我们运行 npm run lint 命令后，控制台会出现警告，告诉我们 index.js 定义了 name 变量，但是没有使用。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/1.png" /> <br />

  如上第二个警告提示，提示我们变量末尾未带分号，这个时候我们可以使用 Eslint 自带的格式化功能，它能对我们一些比较基本的语法问题进行自动格式化，我们可以在 package.json scripts中添加一条格式化脚本，可以看到 它 和 lint 命令区别就是增加了一个 --fix 参数。如下：
```
"scripts": {
  "lint": "eslint .",
  "format": "eslint . --fix"
},
```
  现在当我们运行 npm run format 命令后，然后再看我们的 index.js, 发现我们的代码后面自动帮我们加上分号了。

#### eslint-webpack-plugin

  上面 Eslint 如何与现有的项目进行融合呢？如果在实际项目中，每次我们都要手动执行一次 lint 才能看到我们的语法错误，那岂不是很麻烦？

  这个时候 我们的 eslint-webpack-plugin 出现了，eslint-webpack-plugin 是webpack插件，在项目编译期间，能对我们的js代码进行实时的检测。
我们现在来手动搭建一个webpack环境。我们先安装我们的webpack依赖。
```
npm install webpack-cli webpack webpack-dev-server html-webpack-plugin eslint-webpack-plugin -D
```
  然后在我们的 package.json scripts 中添加一条启动脚本。
```
"scripts": {
  "start": "webpack serve"
}
```
  package.json 代码如下：
```
{
  "name": "eslint-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "lint": "eslint .",
    "format": "eslint . --fix",
    "start": "webpack serve"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "eslint": "^8.16.0",
    "eslint-webpack-plugin": "^3.1.1",
    "html-webpack-plugin": "^5.5.0",
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.9.0"
  }
}
```
  然后在我们的根目录下创建 webpack.config.js 配置文件，配置代码如下：
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  devtool: 'inline-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin(),
    new EslintWebpackPlugin()
  ],
  devServer: {
    port: 9000
  }
};
```
  我们先手动修改 index.js 去掉句尾分号，然后我们运行 npm start， 观察控制台会发现出现警告，并且打开浏览器输入网址: http://localhost:9000/,我们打开控制台也一样能看到警告。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/2.png" /> <br />

  在浏览器也可以看到报错，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/3.png" /> <br />

  然后我们手动修改 index.js 加上句尾分号，运行 npm start, 控制台警告消失了，浏览器的控制台也消失了。

  当然如果我们想要支持保存自动格式化，我们只需要在 webpack 配置文件中的 EslintWebpackPlugin， 中传入 { fix: true } 选项就可以了。

  webpack.config.js 配置代码如下：
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  devtool: 'inline-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin(),
    new EslintWebpackPlugin({
      fix: true
    })
  ],
  devServer: {
    port: 9000
  }
};
```
#### 二：Prettier

  上面Eslint的作用是代码质量检测，那么 Prettier 的作用主要是代码格式化。但是Eslint只能检测或格式化 js/ts文件，Prettier 支持多种文件。
  Prettier 支持如下文件：
```
javascript/typescript
css/less/scss
html
json/yaml/GraphQl
Markdown
vue/react/Angular
```
  安装 Prettier 命令如下：
```
npm install prettier -D
```
  Prettier 规范倾向于个人/团队的代码风格统一，比如每行最大长度，单引号还是双引号，等号左右的空格，使用tab还是空格等等。和eslint一起使用会更好。

#### eslint-plugin-prettier

  eslint-plugin-prettier 是一个ESlint插件，有 Prettier 生态提供，用于报告错误给 eslint。因此我们安装该插件：
```
npm install eslint-plugin-prettier eslint-config-prettier
```
#### eslint-config-prettier 的作用是使用 Prettier 默认推荐配置，并且关闭 eslint 自身格式化功能，防止 Prettier 和 Eslint 自身格式化冲突。

  在项目的根目录下添加 Prettier 配置文件 .prettierrc
```
{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "endOfLine": "lf",
  "printWidth": 120,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

```
trailingComma: 对象的最后一个属性末尾也会添加 , ，比如 { a: 1, b: 2 } 会格式为 { a: 1, b: 2, } 。
tabWidth: 缩进大小。
semi：分号是否自动添加.
singleQuote: 是否单引号.
jsxSingleQuote: jsx 语法下是否单引号，同上。
endOfLine: 换行符，可选配置有 lf ，cr ，crlf ，会有三种的原因是因为各个操作系统之间的换行符不一致.
printWidth: 单行代码最长字符长度，超过之后会自动格式化换行。
bracketSpacing: 在对象中的括号之间打印空格， {a: 5} 格式化为 { a: 5 } 。
arrowParens: 箭头函数的参数无论有几个，都要括号包裹。
```

  现在我们来修改我们的 index.js
```
const name = "kongzhi"
console.log(name)
```
修改 .eslintrc.json 文件，配置如下：
```
{
  "env": {  // 全局环境变量
    "browser": true, // 浏览器环境
    "node": true    // node 环境
  },
  "extends":["plugin:prettier/recommended"], // 使用 prettier 推荐配置
  // "extends": "eslint:recommended",  // 继承 eslint 默认配置
  "parserOptions": {   // 指定 javascript 语言类型和风格
    "ecmaVersion": 2015,
    "sourceType": "module"  // 导入方式设定为模块导入
  },
  "rules": {  // 配置规则
    "no-unused-vars": 1,  // 警告不允许出现未使用的变量
    "semi": [1, "always"] // 警告强制加上句尾分号
  }
}
```
  我们重新运行 npm start 后，然后我们查看 index.js 代码后，双引号会自动变成单引号，并且末尾会加上分号， 如下是 index.js 代码：
```
const name = 'kongzhi';
console.log(name);
```
#### 三：VSCode 中的 Eslint/Prettier 插件

#### 1）安装 VScode Eslint 插件

  在vscode中安装 Eslint插件。安装完成后， 恢复 index.js 代码如下：
```
const name = "kongzhi"
console.log(name)
```
就可以看到效果了。

#### 2）安装 vscode Prettier插件

  在 Vscode 中安装插件 Prettier。 安装 Prettier - Code formatter 插件。

  在我们的项目的根目录下创建 .vscode 目录，在该目录下 创建 .settings.json 文件，添加以下代码：
```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",  //  默认使用 prettier 作为格式化工具
  "editor.formatOnSave": true // 保存代码时格式化
}
```
再次回到 index.js，保存，会发现代码已经被自动格式化了。






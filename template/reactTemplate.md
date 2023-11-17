### 从 0 到 1 搭建 React18+typescript4+webpack5 脚手架项目

<div id="back"></div>

- [x] [一）项目初始化](#id1)<br />
- [x] [二）基本项目目录结构](#id2) <br />
- [x] [三）引入 React](#id3) <br />
- [x] [四) 引入 TypeScript](#id4) <br />
- [x] [五）webpack 配置](#id5) <br />
- [x] [六）配置环境变量](#id6) <br />
- [x] [七）文件别名](#id7) <br />
- [x] [八）重启项目在同一个浏览器 Tab 中打开页面](#id8) <br />
- [x] [九）引入 less, sass, stylus](#id9) <br />
- [x] [十）处理其他资源文件](#id10) <br />
- [x] [十一）热更新](#id11) <br />
- [x] [十二）webpack 构建速度优化](#id12) <br />
- [x] [十三）webpack 构建产物优化](#id13) <br />
- [x] [十四）代码格式规范和语法检测工具](#id14) <br />

#### <a href="https://github.com/kongzhi0707/React18-typescript4-webpack5">github 源码查看</a>

#### <div id="id1">一）项目初始化<a href="#back"> 回到顶部</a></div>

```
// 创建文件夹，然后进入文件夹
mkdir reactTsProject && cd reactTsProject

// 初始化 package.json 文件
npm init
```

然后会在根目录生成一个 package.json 文件如下：

```
{
  "name": "reacttsproject",
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

#### <div id="id2">二）基本项目目录结构<a href="#back"> 回到顶部</a></div>

```
｜--- build
｜ |--- webpack.base.ts  # 公共配置
｜ |--- webpack.dev.ts   # 开发环境配置
｜ |--- webpack.prod.ts  # 线上环境配置
｜--- public
｜ |--- index.html  # html 模版
｜--- src
｜ |--- App.tsx
｜ |--- App.css
｜ |--- index.tsx  # react 应用入口页面
｜
｜--- package.json
```

public/index.html 内容如下：

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5-react-ts</title>
</head>
<body>
  <!-- 容器节点 -->
  <div id="root"></div>
</body>
</html>
```

#### <div id="id3">三）引入 React<a href="#back"> 回到顶部</a></div>

安装依赖文件如下：

```
pnpm add react react-dom

# 声明依赖
pnpm add @types/react @types/react-dom -D
```

接下来先将入口文件 src/index.tsx 写好：

```
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// const root = document.getElementById('root');
const root = document.querySelector('#root')

if(root) {
  createRoot(root).render(<App />)
}
```

src/App.css 内容如下：

```
h2 {
    color: red;
}
```

src/App.tsx 代码如下：

```
import React from 'react'
import './App.css'

function App() {
  return <h2>Hello East_White</h2>
}

export default App
```

#### <div id="id4">四) 引入 TypeScript<a href="#back"> 回到顶部</a></div>

我们需要在项目中安装 相关的依赖文件：

```
pnpm add typescript -D
pnpm add babel-loader ts-node @babel/core @babel/preset-react @babel/preset-typescript @babel/preset-env core-js -D
```

webpack 默认只能识别 js 文件，不能识别 jsx 语法，需要配置 loader 的预设。

```
babel-loader: 使用 babel 加载最新的 js 代码并将其转换为 ES5.
ts-node: 编译ts文件，它可以立即编译并执行指定的 TypeScript文件。
@babel/core: babel 编译的核心包
@babel/preset-react: 识别jsx的语法。
@babel/preset-typescript: 将ts语法转换为js语法。
@babel/preset-env: babel 编译的预设，可以转换目前最新的js标准语法。
core-js: 使用低版本js语法模拟高版本的库。
```

初始化 tsconfig.json

```
./node_modules/typescript/bin/tsc --init

# 如果全局安装了typescript，也可以通过下面的命令创建
tsc --init
```

#### <div id="id5">五）webpack 配置<a href="#back"> 回到顶部</a></div>

##### 5.1）安装依赖

```
pnpm add webpack webpack-cli -D
```

##### 5.2) webpack.base.ts

配置 webpack.base.ts 文件

```
import { Configuration } from 'webpack';
const path = require('path');

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结构输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: []
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins 的配置
  plugins: [],
};

export default baseConfig;
```

会报如下错，

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/1.png" /> <br/>

需要我们安装 @types/node 这个依赖：

```
pnpm add @types/node -D
```

第二步：在项目的根目录下，找到 TypeScript 的配置文件 tsconfig.json，在 tsconfig.json 中加上 "types": ["node"], 来指定类型，如果还是报错的话，注意检查 typeRoots 的内容；还需要加上: "typeRoots": ["./node_modules/@types"]

因此我们这时的 tsconfig.json 配置文件变为如下：

```
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"],
    "typeRoots": ["./node_modules/@types"]
  }
}
```

然后我们关闭 vscode，然后重启下，即可正常了， 不报错了。

@types/node 的作用是：由于 TypeScript 自身的机制，需要一份 xxx.d.ts 声明文件，来说明模块对外公开的方法和属性的类型以及内容。对于内建模块，安装一个 @types/node 模块可以整体解决模块的声明文件问题。

我们在 App.tsx 中引入了 css 文件，因此我们还需要安装相关的 loader；安装命令如下：

```
pnpm add style-loader css-loader -D
```

完善 webpack.base.ts 文件；

```
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const path = require('path');

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结构输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
        use: {
          loader: "babel-loader",
          options: {
            // 预设执行顺序由右往左，所以先处理ts，再处理jsx
            presets: [
              [
                "@babel/preset-env",
                {
                  // 设置兼容目标浏览器版本，也可以在根目录配置.browserslistrc文件,babel-loader会自动寻找上面配置好的文件.browserslistrc
                  targets: { browers: ["> 1%", "last 2 versions", "not ie <= 8"] },
                  useBuiltIns: "usage", // 根据配置的浏览器兼容, 以及代码中使用到的api进行引入polyfill按需添加
                  corejs: 3, // 配置使用core-js使用的版本
                  loose: true,
                }
              ],
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ]
          }
        }
      },
      {
        test: /.css$/, // 匹配css文件
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      // 压缩html资源
      minify: {
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
      },
    }),
  ],
};

export default baseConfig;
```

我们可以将上面的 babel-loader 相关的配置抽离出来进行管理，减轻 webpack.base.ts 文件的配置项。我们在根目录下新建 babel.config.js 文件。
配置项如下：

```
module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
        useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js使用的版本
        loose: true,
      },
    ],
    // 如果您使用的是 Babel 和 React 17，您可能需要将 "runtime": "automatic" 添加到配置中。
    // 否则可能会出现错误：Uncaught ReferenceError: React is not defined
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
```

因此我们的 webpack.base.ts 代码就变成如下了：

```
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const path = require('path');

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结构输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /.css$/, // 匹配css文件
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      // 压缩html资源
      minify: {
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
      },
    }),
  ],
};

export default baseConfig;
```

##### 5.3）webpack.dev.ts

我们需要通过 webpack-dev-server 来启动我们的项目，所以需要安装相关的依赖；

```
pnpm add webpack-dev-server html-webpack-plugin webpack-merge -D
```

然后，配置开发环境配置：webpack.dev.ts

```
import path from "path";
import { merge } from "webpack-merge";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import baseConfig from "./webpack.base";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const host = "127.0.0.1";
const port = "8082";

// 合并公共配置,并添加开发环境配置
const devConfig: Configuration = merge(baseConfig, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  devtool: "eval-cheap-module-source-map",
  devServer: {
    host,
    port,
    open: true, // 是否自动打开
    compress: false, // gzip压缩,开发环境不开启，提升热更新速度
    hot: true, // 开启热更新
    historyApiFallback: true, // 解决history路由404问题
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    static: {
      directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
});

export default devConfig;
```

然后再 package.json 中添加启动脚本

```
"scripts": {
  "dev": "webpack serve -c build/webpack.dev.ts"
},
```

我们还需要在 tsconfig.json 中加入一行 "jsx": "react-jsx" 解决如下的问题：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/2.png" /> <br/>

tsconfig.json 配置代码如下：

```
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"],
    "typeRoots": ["./node_modules/@types"],
    "jsx": "react-jsx"
  },
  "include": ["./src"]
}
```

这时候我们运行 pnpm run dev 脚本就可以启动项目了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/3.png" /> <br/>

#### 5.4）webpack.prod.ts

webpack.prod.ts 配置代码如下：

```
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
});

export default prodConfig;
```

在 package.json 中添加：

```
"scripts": {
  // ...
  "build": "webpack -c build/webpack.prod.ts"
},
```

运行 pnpm run build, 就可以打包出来了；

##### 5.5) copy 静态资源

一般在 public 文件夹下会放入一些静态资源，比如 图片/css/js 文件等。他们不需要 webpack 进行解析的。我们只需要打包的时候把 public 下的内容复制到构建出口的文件夹中，我们可以借助 copy-webpack-plugin 插件。我们需要安装依赖如下：

```
pnpm add copy-webpack-plugin -D
```

修改 webpack.base.ts 文件；

```
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const path = require('path');

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结构输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /.css$/, // 匹配css文件
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-react-ts",
      filename: "index.html",
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, "../node_modules"),
    }),
  ],
};

export default baseConfig;
```

我们的开发环境 打包 webpack.dev.ts 在 devServer 中配置了 static 的 public 文件夹。但是打包的时候我们需要处理下，所以我们需要在 webpack.prod.ts 中新增 copy 插件配置。配置代码如下：

```
import path from 'path';
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import CopyPlugin from 'copy-webpack-plugin';
import baseConfig from "./webpack.base";

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => !source.includes("index.html"), // 忽略index.html
        }
      ]
    })
  ]
});

export default prodConfig;
```

然后我们可以测试下，我们在 public 中新一个 favicon.ico 图标(从 vue 项目中复制过来测试)。在 index.html 中引入， 代码如下：

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- 绝对路径引入图标文件 -->
  <link data-n-head="ssr" rel="icon" type="image/x-icon" href="/favicon.ico">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5-react-ts</title>
</head>
<body>
  <!-- 容器节点 -->
  <div id="root"></div>
</body>
</html>
```

我们现在执行 pnpm run build 打包命令，就可以看到 public 下的 favicon.ico 图标文件复制到 dist 文件中了。

#### <div id="id6">六）配置环境变量<a href="#back"> 回到顶部</a></div>

##### 6.1）cross-env + DefinePlugin

环境变量作用有如下：

```
1）区分是开发模式还是打包构建模式。
2）区分项目业务环境，开发/测试/正式环境
```

区分开发模式还是打包构建模式使用 process.env.NODE_ENV. 区分项目接口环境可以自定义一个环境变量 process.env.BASE_ENV. 设置环境变量可以借助 cross-env 和 webpack.DefinePlugin 来设置。

```
cross-env：运行跨平台设置和使用环境变量的脚本，兼容各系统的设置环境变量的包
webpack.DefinePlugin：webpack内置的插件,可以为业务代码注入环境变量
```

安装 cross-env:

```
pnpm add cross-env -D
```

修改 package.json 的 scripts， 变成如下：

```
"scripts": {
  "dev:dev": "cross-env NODE_ENV=development BASE_ENV=development webpack serve -c build/webpack.dev.ts",
  "dev:test": "cross-env NODE_ENV=development BASE_ENV=test webpack serve -c build/webpack.dev.ts",
  "dev:pre": "cross-env NODE_ENV=development BASE_ENV=pre webpack serve -c build/webpack.dev.ts",
  "dev:prod": "cross-env NODE_ENV=development BASE_ENV=production webpack serve -c build/webpack.dev.ts",
  "build:dev": "cross-env NODE_ENV=production BASE_ENV=development webpack -c build/webpack.prod.ts",
  "build:test": "cross-env NODE_ENV=production BASE_ENV=test webpack -c build/webpack.prod.ts",
  "build:pre": "cross-env NODE_ENV=production BASE_ENV=pre webpack -c build/webpack.prod.ts",
  "build:prod": "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.prod.ts"
},
```

process.env.NODE_ENV 可以获取到环境变量的，webpack 会自动根据设置的 mode 字段来给业务代码注入对应的 development 和 production.

我们可以在 webpack.base.ts 中打印下设置的环境变量的值；

console.log("-----NODE_ENV-----", process.env.NODE_ENV);
console.log("-----BASE_ENV-----", process.env.BASE_ENV);

然后我们运行 npm run dev:dev 后，在命令行中可以看到的是 开发环境，如下代码：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/4.png" /> <br/>

当我们执行 npm run build:dev 的时候，可以看到控制台打印出如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/5.png" /> <br/>

当前是打包模式，业务环境是开发环境，这里我们需要把 process.env.BASE_ENV 注入到业务代码里面，就可以通过该环境变量设置对应环境的接口地址和其他数据。
因此我们需要借助 webpack.DefinePlugin 插件。

修改 webpack.base.ts 代码

```
const webpack = require('webpack')
module.export = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
}
```

在根目录下新建 typings/global.d.ts 文件：

```
declare module 'process' {
  global {
    namespace NodeJS {
      export interface ProcessEnv {
        BASE_ENV: 'development' | 'test' | 'pre' | 'production'
        NODE_ENV: 'development' | 'production'
      }
    }
  }
}
```

并在 tsconfig.json 中配置如下：

```
{
  "compilerOptions": {
    "target": "es2016",
    "esModuleInterop": true,
    "module": "commonjs",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "typeRoots": ["./typings/*.d.ts", "node_modules/@types"],
    "jsx": "react-jsx" // react18这里改成react-jsx，就不需要在tsx文件中手动引入React了
  },
  "include": ["./src", "./typings/*.d.ts"]
}
```

配置后会把值注入到业务代码里面去，webpack 解析代码匹配到 process.env.BASE_ENV，就会设置到对应的值。测试一下，在 src/index.tsx 打印一下两个环境变量：

```
// src/index.tsx
// ...
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
```

执行 pnpm run dev:test，可以在浏览器控制台看到打印的信息：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/6.png" /> <br/>

当前是开发模式，业务环境是测试环境。

##### 6.2）配置多环境运行配置

安装依赖：

```
pnpm add dotenv
```

我们在项目的根目录下新建一个多文件配置文件夹 env:

```
├── env
   ├── .env.development # 开发环境
   ├── .env.test # 测试环境
   ├── .env.pre # 预发布环境
   └── .env.production # 生产环境
```

然后配置如下代码：

```
// env/.env.development
REACT_APP_API_URL=https://api-dev.com

// env/.env.test
REACT_APP_API_URL=https://api-test.com

// env/.env.pre
REACT_APP_API_URL=https://api-pre.com

// env/.env.production
REACT_APP_API_URL=https://api-prod.com
```

然后再 webpack.base.ts 中引入，然后解析对应环境配置，最后通过 DefinePlugin 进行注入：

```
import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as dotenv from "dotenv";

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});

// console.log("process.env", process.env);
// console.log("NODE_ENV", process.env.BASE_ENV);
// console.log("REACT_APP_API_URL", process.env.REACT_APP_API_URL);

const baseConfig: Configuration = {
  // ...
  plugins: [
    // 注入到业务
    new DefinePlugin({
      "process.env": JSON.stringify(envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ].filter(Boolean),
};

export default baseConfig;
```

然后在我们的业务代码 src/index.tsx 打印如下：

```
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// const root = document.getElementById('root');
const root = document.querySelector('#root')

console.log('--xxx----NODE_ENV---xxxx', process.env.NODE_ENV)
console.log('---xxx--BASE_ENV---yyy', process.env.BASE_ENV)

console.log("---process.env-----", process.env);

if(root) {
  createRoot(root).render(<App />)
}
```

然后我们重启项目: pnpm run dev:dev, 就可以在控制台中看到如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/7.png" /> <br/>

我们现在还可以验证下环境配置是否正确，我们使用 build 打包下， 执行 pnpm run build:prod, 然后我们通过 serve -s dist。 启动项目。可以看到如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/8.png" /> <br/>

如上我们可以看到，多运行环境配置成功了。

#### <div id="id7">七）文件别名 <a href="#back"> 回到顶部</a></div>

在 webpack.base.ts 中配置如下：

```
resolve: {
  extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
  // 别名需要配置两个地方，这里和 tsconfig.json
  alias: {
    "@": path.join(__dirname, "../src")
  },
},
```

然后需要在 tsconfig.json 中配置：

```
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
  },
}
```

然后我们可以在项目中进行测试了，src/App.tsx 代码如下：

```
import React from 'react'
import '@/App.css'

function App() {
  return <h2>Hello East_White</h2>
}

export default App
```

#### <div id="id8">八）重启项目在同一个浏览器 Tab 中打开页面 <a href="#back"> 回到顶部</a></div>

我们发现，我们每次运行 pnpm run dev:\* 命令都会打开一个新窗口，我们能不能在原窗口打开呢。我们可以参考 Create-React-App 的处理方式：

参考 <a href="https://github.com/facebook/create-react-app/tree/main/packages/react-dev-utils">create-react-app</a> 的启动方式

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/9.png" /> <br/>

复制出这两个文件源码，将其放置在 build 下的 util 中：

```
build
   - util
     - openBrowser.js
     - openChrome.applescript
```

修改 webpack.dev.ts：

```
import path from "path";
import { merge } from "webpack-merge";
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import baseConfig from "./webpack.base";

// 运行命令的时候重启一次打开一个tab 页很烦，所以呢优化一下
// 参考：create-react-app 的启动方式
// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openChrome.applescript
// 记得关闭webpack-dev-server的配置中的自动打开 open: false 或者注释
const openBrowser = require("./util/openBrowser");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const host = "127.0.0.1";
const port = "8082";

// 合并公共配置,并添加开发环境配置
const devConfig: Configuration = merge(baseConfig, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  /**
    开发环境推荐：eval-cheap-module-source-map
    - 本地开发首次打包慢点没关系,因为 eval 缓存的原因, 热更新会很快
    - 开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 cheap
    - 我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 module
   */
  devtool: "eval-cheap-module-source-map",
});

const devServer = new WebpackDevServer(
  {
    host, // 地址
    port, // 端口
    open: false, // 是否自动打开，关闭
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  webpack(devConfig)
);

devServer.start().then(() => {
  // 启动界面
  openBrowser(`http://${host}:${port}`);
});

export default devConfig;
```

重启项目就可以了。

#### <div id="id9">九）引入 less, sass, stylus <a href="#back"> 回到顶部</a></div>

less, sass, stylus 是三个比较流行的 CSS Modules 预处理库，在 React 中，使用 CSS Modules 的好处在于避免全局样式冲突，使用 CSS Modules 可以确保样式 只应用于特定组件，避免全局样式冲突。

先安装相关的依赖包:

```
pnpm add less less-loader sass-loader node-sass stylus stylus-loader -D
```

在 webpack.base.ts 添加相关的 loader：

```
const styleLoadersArray = [
  "style-loader",
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]--[hash:5]",
      }
    }
  }
];
const baseConfig: Configuration = {
  //...
  module: {
     rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/, // 匹配css文件
        use: styleLoadersArray,
      },
      {
        test: /\.less$/,
        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true
              }
            },
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          ...styleLoadersArray,
          "sass-loader",
        ]
      },
      {
        test: /\.styl$/,
        use: [
          ...styleLoadersArray,
          "stylus-loader",
        ]
      }
    ]
  }
  // ...
}
export default baseConfig;
```

然后我们可以使用样式了。

```
// src/app.module.less

@color: red;

.lessBox {
  .box {
    color: @color;
    background-color: lightblue;
    transform: translateX(100);

    &:before {
      @arr: 'hello',
      'world';
      content: `@{arr}.join(' ').toUpperCase()`;
    }
  }
}
```

```
// src/app.module.scss
$blue: #1875e7;
$side: left;

.scssBox {
  margin: 20px 0;

  .box {
    color: $blue;
    background-color: rgb(226, 223, 223);
    border: 1px solid grey;
    margin-#{$side}: 20px;
    padding: (20px/2);
  }
}
```

```
// src/app.module.styl
.stylBox
  .box
    color: red;
    background-color: yellow;
```

在 App.tsx 中引入：

```
import React from 'react'
import '@/App.css'
import lessStyles from './app.module.less';
import scssStyles from './app.module.scss';
import stylStyles from './app.module.styl';

function App() {
  return <div>
      <h2>Hello East_White</h2>
      <div className={lessStyles['lessBox']}>
        <div className={lessStyles['box']}>lessBox</div>
      </div>
      <div className={scssStyles['scssBox']}>
        <div className={scssStyles['box']}>scssBox</div>
      </div>
      <div className={stylStyles['stylBox']}>
        <div className={stylStyles['box']}>stylBox</div>
      </div>
    </div>

}
export default App
```

我们重启项目，执行 npm run dev:dev 后，我们发现生成了带有 hash 值的 class 类名，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/10.png" /> <br/>

同时我们可以验证打包到正式环境是否成功了，我们可以运行 npm run build:dev, 然后我们通过 serve -S dist 查看。也是生效的。

如果我们不希望每次写 less 样式的时候，都在文件名上加上一个 .module 的话，我们可以在 less-loader 中添加如下配置：

webpack.base.ts 代码配置为如下：

```
import { Configuration, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as dotenv from 'dotenv';

const path = require('path');

const styleLoadersArray = [
  "style-loader",
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]--[hash:5]",
      }
    }
  }
];

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
})

console.log("-----NODE_ENV-----", process.env.NODE_ENV);
console.log("-----BASE_ENV-----", process.env.BASE_ENV);

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结构输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/, // 匹配css文件
        use: styleLoadersArray,
      },
      {
        test: /\.less$/,
        use: [
          ...styleLoadersArray,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // 可以加入modules: true，这样就不需要在less文件名加module了
                modules: true,
                // 如果要在less中写类型js的语法，需要加这一个配置
                javascriptEnabled: true
              }
            },
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          ...styleLoadersArray,
          "sass-loader",
        ]
      },
      {
        test: /\.styl$/,
        use: [
          ...styleLoadersArray,
          "stylus-loader",
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".less", ".css"],
    // 别名配置，还需要在 tsconfig.json 配置
    alias: {
      "@": path.join(__dirname, "../src")
    },
  },
  // plugins 的配置
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-react-ts",
      filename: "index.html",
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, "../node_modules"),
    }),
    // 注入到业务
    new DefinePlugin({
      "process.env": JSON.stringify(envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    	nodeEnv: false
  	}
};

export default baseConfig;
```

我们还需要 在 global.d.ts 加入样式文件的声明，就可以避免写 .module 后缀。

```
// src/typings/global.d.ts

/* CSS MODULES */
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.styl' {
  const classes: { [key: string]: string };
  export default classes;
}
```

然后就可以删掉样式文件中的 .module 后缀了。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/11.png" /> <br/>

然后我们在 src/App.tsx 中样式改为如下：

```
import React from 'react'
import '@/App.css'
import lessStyles from './app.less';
import scssStyles from './app.scss';
import stylStyles from './app.styl';

function App() {
  return <div>
      <h2>Hello East_White</h2>
      <div className={lessStyles['lessBox']}>
        <div className={lessStyles['box']}>lessBox</div>
      </div>
      <div className={scssStyles['scssBox']}>
        <div className={scssStyles['box']}>scssBox</div>
      </div>
      <div className={stylStyles['stylBox']}>
        <div className={stylStyles['box']}>stylBox</div>
      </div>
    </div>

}

export default App
```

##### 9.2）处理 css3 前缀在浏览器中的兼容

虽然 css3 在现在的浏览器支持率已经很高了，但是我们还是需要兼容一些低版本的浏览器，因此我们需要给 css3 添加前缀，我们可以借助插件来自动添加前缀。
postcss-loader 就是来给 css3 添加浏览器前缀的。我们需要安装该依赖包，命令如下:

```
pnpm add postcss-loader autoprefixer -D
```

为了避免 webpack.base.ts 文件过大，我们将一些 loader 配置提取成单独的文件来进行管理，我们在项目的根目录下 新建 postcss.config.js 文件，作为 postcss-loader 的配置文件。会自动读取该配置。

```
module.exports = {
  ident: "postcss",
  plugins: [require("autoprefixer")],
};
```

修改 webpack.base.ts 文件，在解析 css 和 less 的规则中添加配置：

```
// ...
const styleLoadersArray = [
  "style-loader",
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]--[hash:5]",
      },
    },
  },
  // 添加 postcss-loader
  'postcss-loader'
];
```

配置完成后，我们需要有一份兼容浏览器的清单，让 postcss-loader 知道要加哪些浏览器的前缀，我们在根目录下创建 .browserslistrc 文件：

```
IE 9 # 兼容IE 9
chrome 35 # 兼容chrome 35
```

如上比如兼容 ie9 和 chrome35 版本，然后我们在 app.less 中加入一些 css3 语法，重新启动项目。我们执行 npm run dev:dev 打包。可以看到 css 添加了谷歌内核的前缀。

#### <div id="id10">十）处理其他资源文件 <a href="#back"> 回到顶部</a></div>

##### 10.1）处理图片

对于图片文件，webpack4 使用 file-loader 和 url-loader 来处理的，webpack5 不使用这两个 loader 了，而是采用自带的 <a href="https://webpack.js.org/guides/asset-modules/#root">asset-module</a> 来处理的。修改 webpack.base.ts, 添加图片解析配置：

```
{
  output: {
    // 这里自定义输出文件名的方式
    assetModuleFilename: 'images/[name].[contenthash:8][ext]'
  },
  module: {
    rules: [
      //...
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 匹配图片文件
        type: "asset", // 设置资源处理的类型为assets
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64
          }
        },
        generator:{
          filename:'static/images/[name].[contenthash:8][ext]', // 文件输出目录和命名
        },
      }
    ]
  }
}
```

由于我们希望通过 ES6 的新语法 ESModule 的方式导入资源，为了使 TypeScript 可以识别图片模块，需要在 src/typings/global.d.ts 中加入声明:

```
/* IMAGES */
declare module '*.svg' {
  const ref: string;
  export default ref;
}

declare module '*.bmp' {
  const ref: string;
  export default ref;
}

declare module '*.gif' {
  const ref: string;
  export default ref;
}

declare module '*.jpg' {
  const ref: string;
  export default ref;
}

declare module '*.jpeg' {
  const ref: string;
  export default ref;
}

declare module '*.png' {
  const ref: string;
  export default ref;
}
```

然后在 App.tsx 中引入图片资源，代码如下：

```
import React from 'react'
import '@/App.css'
import lessStyles from './app.less';
import scssStyles from './app.scss';
import stylStyles from './app.styl';
import img from '@/assets/images/1.png';

function App() {
  return <div>
      <h2>Hello East_White</h2>
      <div className={lessStyles['lessBox']}>
        <div className={lessStyles['box']}>lessBox</div>
      </div>
      <div className={scssStyles['scssBox']}>
        <div className={scssStyles['box']}>scssBox</div>
      </div>
      <div className={stylStyles['stylBox']}>
        <div className={stylStyles['box']}>stylBox</div>
        <img src={img} alt="小于10kb的图片" />
        <div className={lessStyles['smallImg']}>小图片背景</div>
      </div>
    </div>
}

export default App
```

在 app.less 文件中加入背景图片：

```
.smallImg {
  width: 69px;
  height: 75px;
  background: url('@/assets/images/1.png') no-repeat;
}
```

重启项目后，我们可以看到图片被正确的展示出来了；如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/12.png" /> <br/>

如上可以看到 图片被打包进了我们指定的 static/images 文件里面了，我们可以在构建打包到正式环境里面，执行命令： npm run build:dev 后，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/13.png" /> <br/>

如上我们也可以看到，打包进 dist/static/images 目录下面了。

##### 10.2）处理字体和媒体

字体文件和媒体文件这两种资源的处理方式和处理图片是一样的。只需要把匹配的路径和打包后放置的路径修改下即可。我们继续修改 webpack.base.ts 文件如下：

```
module: {
  rules: [
    // ...
    {
      test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
      type: "asset", // type选择asset
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于10kb转base64
        }
      },
      generator:{
        filename:'static/fonts/[name].[contenthash:8][ext]', // 文件输出目录和命名
      },
    },
    {
      test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
      type: "asset", // type选择asset
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 小于10kb转base64
        }
      },
      generator:{
        filename:'static/media/[name].[contenthash:8][ext]', // 文件输出目录和命名
      },
    },
  ]
}
```

##### 10.3) 处理 json 资源

下载 json-loader; 安装命令如下：

```
pnpm install json-loader -D
```

webpack.base.ts 配置如下

```
// ...
{
  // 匹配json文件
  test: /\.json$/,
  loader: 'json-loader',
  type: "javascript/auto", // 将json文件视为文件类型
  generator: {
    // 这里专门针对json文件的处理
    filename: "static/json/[name].[contenthash:8][ext]",
  },
},
// ...
```

我们来测试下，在 src 下增加一个 json 文件 test.json，如下 json：

```
[
  {
    "name": "kongzhi",
    "age": 35
  },
  {
    "name": "tugenhua",
    "age": 36
  },
  {
    "name": "xxx",
    "age": 23
  }
]
```

然后在 App.tsx 中引入：

```
import memberList from './test.json';
console.log('---memberList---', memberList);
```

会报如下错： 找不到模块“./test.json”。请考虑使用 "--resolveJsonModule" 导入带 ".json" 扩展的模块。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/14.png" /> <br/>

我们需要在 tsconfig.json 中加入一个配置如下：

```
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true,
    // ...
  },
  // ...
}
```

然后我们执行命令重新启动下，npm run dev:dev 后，在控制台上可以看到如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/15.png" /> <br/>

##### 10.4）babel 处理 js 非标准语法

现在 react 主流开发都是函数组件 和 react-hooks，但是有时候也会有类组件，我们可以使用装饰器简化代码。

新增 src/components/Class.tsx 组件，代码如下：

```
import React, { PureComponent } from "react";

// 装饰器为,组件添加age属性
function addAge(Target: Function) {
  Target.prototype.age = 111
}

// 使用装饰器
@addAge
class Class extends PureComponent {

  age?: number

  render() {
    return (
      <h2>我是类组件---{this.age}</h2>
    )
  }
}

export default Class;
```

在 App.tsx 中引入该组件使用：

```
//...
import Class from './components/Class';

function App() {
  console.log('---memberList---', memberList);
  return <div>
    <Class />
    </div>
}

export default App
```

我们需要开启一下 ts 装饰器支持，需要修改 tsconfig.json 文件。配置项如下：

```
// tsconfig.json
{
  "compilerOptions": {
    // ...
    // 开启装饰器使用
    "experimentalDecorators": true
  }
}
```

上面 Class 组件代码中使用了装饰器目前 js 标准语法是不支持的，现在运行或者打包会报错，不识别装饰器语法，需要借助 babel-loader 插件，安装依赖：

```
pnpm add @babel/plugin-proposal-decorators -D
```

在 babel.config.js 中添加插件：

```
module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
        useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js使用的版本
        loose: true,
      },
    ],
    // 如果您使用的是 Babel 和 React 17，您可能需要将 "runtime": "automatic" 添加到配置中。
    // 否则可能会出现错误：Uncaught ReferenceError: React is not defined
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  // 这是新增的插件 支持装饰器
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ]
};
```

我们重启项目就可以看到已经支持了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/16.png" /> <br/>

#### <div id="id11">十一）热更新 <a href="#back"> 回到顶部</a></div>

在 webpack5 中，我们只要设置 devServer.hot 为 true，就可以支持热更新了，该插件已经内置了。
现在开发模式下修改 css 和 less 文件，页面样式可以在不刷新浏览器的情况下实时生效，因为样式都在 style 标签里面。style-loader 做了替换样式的热替换功能。
但是修改 App.tsx，浏览器会自动刷新后再显示修改后的内容。但是如果我们想要的不是刷新浏览器，而是在不需要刷新浏览器的前提下模块热更新。并且能够保留 react
组件的状态。

我们可以借助 <a href="https://www.npmjs.com/package/@pmmmwh/react-refresh-webpack-plugin">@pmmmwh/react-refresh-webpack-plugin</a> 插件来实现, 该插件又依赖于 <a href="https://www.npmjs.com/package/react-refresh">react-refresh</a>, 安装依赖：

```
pnpm add @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```

配置 react 热更新插件，修改 webpack.dev.ts 文件；

```
import path from "path";
import { merge } from "webpack-merge";
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import baseConfig from "./webpack.base";

// 新增的 热更新插件
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

// 运行命令的时候重启一次打开一个tab 页很烦，所以呢优化一下
// 参考：create-react-app 的启动方式
// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openChrome.applescript
// 记得关闭webpack-dev-server的配置中的自动打开 open: false 或者注释
const openBrowser = require("./util/openBrowser");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const host = "127.0.0.1";
const port = "8082";

// 合并公共配置,并添加开发环境配置
const devConfig: Configuration = merge(baseConfig, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  /**
    开发环境推荐：eval-cheap-module-source-map
    - 本地开发首次打包慢点没关系,因为 eval 缓存的原因, 热更新会很快
    - 开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 cheap
    - 我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 module
   */
  devtool: "eval-cheap-module-source-map",
  plugins: [
    new ReactRefreshWebpackPlugin(), // 添加热更新插件
  ]
});

const devServer = new WebpackDevServer(
  {
    host, // 地址
    port, // 端口
    open: false, // 是否自动打开，关闭
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  webpack(devConfig)
);

devServer.start().then(() => {
  // 启动界面
  openBrowser(`http://${host}:${port}`);
});

export default devConfig;
```

为 babel-loader 配置 react-refesh 刷新插件，修改 babel.config.js 文件

```
const isDEV = process.env.NODE_ENV === "development"; // 是否是开发模式

module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
        useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js使用的版本
        loose: true,
      },
    ],
    // 如果您使用的是 Babel 和 React 17，您可能需要将 "runtime": "automatic" 添加到配置中。
    // 否则可能会出现错误：Uncaught ReferenceError: React is not defined
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    isDEV && require.resolve("react-refresh/babel"), // 如果是开发模式,就启动react热更新插件
  ]
};
```

我们可以测试下，修改 App.tsx 代码的内容， 可以看到浏览器热更新了。

#### <div id="id12">十二）webpack 构建速度优化 <a href="#back"> 回到顶部</a></div>

##### 12.1）webpack 进度条

webpackbar 是个十分美观的进度条，使用起来也比较方便。安装依赖如下:

```
pnpm add webpackbar -D
```

我们在 webpack.base.ts 中引入配置项如下：

```
// ...
import WebpackBar from 'webpackbar';

// ...

const baseConfig: Configuration = {
  // ...

  // plugins 的配置
  plugins: [
    // ...
    new WebpackBar({
      color: "#85d",  // 默认green，进度条颜色支持HEX
      basic: false,   // 默认true，启用一个简单的日志报告器
      profile:false,  // 默认false，启用探查器。
    })
  ],
};

export default baseConfig;
```

然后我们构建下，可以看到如下进度条效果：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/17.png" /> <br/>

##### 12.2）构建耗时

我们可以使用一些插件，进行优化的时候，知道构建耗时花费在哪些步骤上，我们可以使用 <a href="https://www.npmjs.com/package/speed-measure-webpack-plugin">speed-measure-webpack-plugin</a> 来看的到，安装依赖如下：

```
pnpm add speed-measure-webpack-plugin webpack-bundle-analyzer -D
```

我们在 build 文件夹下新家一个配置文件 为 webpack.analy.ts 文件。

build/webpack.analy.ts 配置代码如下：

```
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import prodConfig from "./webpack.prod";

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// 引入webpack打包速度分析插件
const smp = new SpeedMeasurePlugin();

// 使用smp.wrap方法,把生产环境配置传进去,由于后面可能会加分析配置,所以先留出合并空位
const analyConfig: Configuration = smp.wrap(merge(prodConfig, {
  plugins: [
    new BundleAnalyzerPlugin() // 配置分析打包结果插件
  ]
}))

export default analyConfig;
```

修改 package.json 添加启动 webpack 打包分析的脚本命令，在 scripts 新增如下：

```
{
  // ...
  "scripts": {
    // ...
    "build:analy": "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.analy.ts"
  }
  // ...
}
```

执行 npm run build:analy 命令; 如下可以看到 plugin 和 loader 的耗时时间，

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/18.png" /> <br/>

如上项目的内容比较少，在真正的项目中可以通过这个来分析打包的时间花费在什么地方。然后对其优化。

##### 12.3）开启持久化存储缓存

在 webpack5 之前做缓存是使用 babel-loader 缓存 js 解析结果，cache-loader 缓存 css 等资源的解析结果。webpack5 相对于 webpack4, 新增了持久化缓存，改进缓存算法等优化，通过配置 <a href="https://webpack.docschina.org/configuration/cache/#root">webpack 持久化缓存</a>来缓存生成的 webpack 模块和 chunk，改善下一次打包的构建速度。修改 webpack.base.ts；如下：

```
// webpack.base.ts
// ...
module.exports = {
  // ...
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}
```

##### 12.4) 开启多线程 loader

运行在 Node.js 之上的 webpack 是单线程模式的。webpack 打包只能逐个文件处理，当 wenpack 需要打包大量文件时，打包的时间会比较漫长。

多进程/多实列构建有如下三种:

```
1) thread-loader
2) parallel-webpack
3) HappyPack
```

webpack 的 loader 默认在单线程执行，可以借助多核 cpu 开启多线程 loader 解析，可以极大地提升 loader 解析的速度，thread-loader 就是用来开启多进程解析 loader 的，安装依赖

```
pnpm add thread-loader -D
```

使用时,需将此 loader 放置在其他 loader 之前。放置在此 loader 之后的 loader 会在一个独立的 worker 池中运行。

修改 webpack.base.ts

```
module: {
  rules: [
    {
      test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
      use: ['thread-loader', 'babel-loader']
    }
  ]
}
```

由于 thread-loader 不支持抽离 css 插件 MiniCssExtractPlugin.loader. 所以这里只配置了多进程解析 ts。

##### 12.5) 缩小构建目标

我们可以使用 include 和 exclude 两个配置项。

include: 只解析该选项配置的模块。
exclude: 不解该选项配置的模块，优先级更高。

修改 webpack.base.ts

```
module: {
  rules: [
    {
      test: /.(ts|tsx)$/, // 匹配 ts/tsx 文件
      exclude: /node_modules/,
      use: ['thread-loader', 'babel-loader']
    }
  ]
}
```

##### 12.6) devtools 配置

开发过程中或者打包后的代码都是压缩后的代码，如果进行调试肯定希望看到的源代码，而不是编译后的代码，source map 就是用来做源码映射的。devtool 就是 webpack 提供的选择源码映射方式的配置。

开发环境推荐：eval-cheap-module-source-map

修改 webpack.dev.ts

```
// webpack.dev.ts
module.exports = {
  // ...
  devtool: 'eval-cheap-module-source-map'
}
```

生产环境不用配置任何的。

#### <div id="id13">十三）webpack 构建产物优化 <a href="#back"> 回到顶部</a></div>

##### 13.1）样式提取

在开发环境我们希望 css 嵌入在 style 标签里面，方便样式替换，但打包时我们希望把 css 单独抽离出来，方便配置缓存策略。需要使用 插件 <a href="https://github.com/webpack-contrib/mini-css-extract-plugin">mini-css-extract-plugin</a>, 我们需要安装它，如下：

```
pnpm add mini-css-extract-plugin -D
```

修改 webpack.base.ts，根据环境变量设置开发环境使用 style-loader, 打包模式抽离 css。

```
// ...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式

const styleLoadersArray = [
  isDev ? "style-loader" : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
  {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: "[path][name]__[local]--[hash:5]",
      },
    },
  },
  'postcss-loader'
];
```

再修改 webpack.prod.ts, 打包时添加抽离 css 插件：

```
// ...

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const prodConfig: Configuration = merge(baseConfig, {
  // ...
  plugins: [
    // ...
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css' // 抽离css的输出目录和名称
    }),
  ],
});

export default prodConfig;
```

配置完成后，在开发模式 css 会嵌入到 style 标签里面，方便样式热替换。打包时会把 css 抽离成单独的 css 文件。

我们执行命令 npm run dev:dev 后，在开发环境可以看到如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/19.png" /> <br/>

我们执行命令 npm run build:dev 先打包，然后我们通过 serve -s dist。 启动项目。可以看到如下:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/20.png" /> <br/>

##### 13.2) 样式压缩

如上，我们正式环境已经抽离了 css 文件了。但是我们的 css 并没有压缩。因此我们需要手动配置一下压缩 css 的插件。我们可以使用 <a href="https://www.npmjs.com/package/css-minimizer-webpack-plugin">css-minimizer-webpack-plugin</a> 插件来压缩 css，安装依赖如下：

```
pnpm add css-minimizer-webpack-plugin -D
```

修改 webpack.prod.ts 文件， 需要在优化项 optimization 下的 minimizer 属性中配置：

```
import path from 'path';
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import CopyPlugin from 'copy-webpack-plugin';
import baseConfig from "./webpack.base";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => !source.includes("index.html"), // 忽略index.html
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css' // 抽离css的输出目录和名称
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
    ],
  },
});

export default prodConfig;
```

我们再次执行 npm run build:dev 打包后，可以看到 css 已经被压缩了。

##### 13.3）js 压缩

设置 mode 为 production 时，webpack 会使用内置插件 terser-webpack-plugin 压缩 js 文件，该插件默认支持多线程压缩，但是我们上面配置了 optimization.minimizer 压缩 css 后,js 压缩就失效了,需要手动再添加一下，因此我们需要安装对应的依赖；如下安装命令：

```
pnpm i terser-webpack-plugin -D
```

修改 webpack.prod.ts 文件：

```
import path from 'path';
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import CopyPlugin from 'copy-webpack-plugin';
import baseConfig from "./webpack.base";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin'

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => !source.includes("index.html"), // 忽略index.html
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css' // 抽离css的输出目录和名称
    }),
  ],
  optimization: {
    // splitChunks: {
    //   chunks: "all",
    // },
    runtimeChunk: {
      name: 'mainifels'
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ],
  },
});

export default prodConfig;
```

如上可以看到 css 和 js 都被压缩了。

##### 13.4）hash/chunkhash/contenthash 区别使用

项目维护的时候，一般只会修改一部分代码，因此我们需要配置文件缓存，来提升前端加载页面的速度及减少服务器的压力。webpack 打包 hash 分为三种：

```
1) hash: 当每次修改任何一个文件后，所有文件打包后的hash值都是一样的，所以假如只是修改了任何一个文件，整个项目的文件缓存都将失效。
2）chunkhash: 不同的入口文件进行依赖文件解析，构建对应的chunk，生成对应的哈希值，文件本身修改或依赖文件修改，chunkhash值会变化。
3）contenthash: 每个文件自己单独的hash值，文件的改动只会影响自身的hash值。
```

hash 是在输出文件时配置的，格式是 filename: "[name].[chunkhash:8][ext]"，[xx] 格式是 webpack 提供的占位符，:8 是生成 hash 的长度。

js：我们在生产环境中会把一些公共库和程序入口文件区分开，单独打包构建，采用 chunkhash 的方式生成哈希值，只要我们不改动公共库的代码，就可以保证其哈希值不会受影响，可以继续使用浏览器缓存，所以 js 适合使用 chunkhash。

css 和 图片：该资源一般都单独存在的，可以采用 contenthash, 只有文件本身变化后生成新的 hash 值。

修改 webpack.base.ts，把 js 输出的文件名称格式加上 chunkhash，把 css 和图片媒体资源输出格式加上 contenthash：

```
// webpack.base.ts
// ...
const baseConfig: Configuration = {
  // 打包文件出口
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // // 加上[chunkhash:8]
    // ...
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // 匹配图片文件
        // ...
        generator:{
          filename:'static/images/[name].[contenthash:8][ext]' // 加上[contenthash:8]
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体文件
        // ...
        generator:{
          filename:'static/fonts/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        // ...
        generator:{
          filename:'static/media/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
    ]
  },
  // ...
}
```

再修改 webpack.prod.ts，修改抽离 css 文件名称格式：

```
// webpack.prod.ts
// ...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 加上[contenthash:8]
    }),
    // ...
  ],
  // ...
})
```

现在我们再次执行 npm run build:dev 打包，就可以看到文件后面的 hash 值了，如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/21.png" /> <br/>

##### 13.5) 代码分割

我们可以单独把 node_modules 中的代码单独打包，当第三包代码每变化时，对应 chunkhash 值也不会变化，可以有效利用浏览器的缓存。公共的模块可以提取出来，避免重复打包加大代码整体的体积。webpack 提供了代码分割功能。需要我们手动在优化项 optimization 中手动配置下代码分割 splitChunks 规则。

修改 webpack.prod.ts 文件

```
module.exports = {
  // ...
  optimization: {
    // ...
    splitChunks: { // 分隔代码
      cacheGroups: {
        vendors: { // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
        },
        commons: { // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        }
      }
    }
  }
}
```

配置完成后执行打包，我们可以看到 node_modules 里面的模块被抽离到 verdors.xxx.js 中，业务代码在 main.xxx.js 文件中。如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/22.png" /> <br/>

我们可以测试下，我们的 verdors 的 chunkhash 是 fbdf4a58，main.js 文件的 chunkhash 是 6fc35854，我们改动一下 App.tsx， 我们可以再次打包，可以看到下图的 main.js 的 chunkhash 值变化了。但是 verdors.js 的 chunkhash 还是原先的。因此对于 node_modules 的代码浏览器还是使用缓存的。只需要重新请求 main.js 就可以了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/23.png" /> <br/>

##### 13.6）tree-shaking 清理未引用的 js / 清理未使用的 css

tree-shaking 的作用是：剔除未使用的 js 代码，也就是未引用的代码。webpack 在 v2 版本之后开始支持，当模式 mode 为 production 时就会默认开启 tree-shaking 功能来标记未引入代码然后移除掉。

##### 13.7) gzip 压缩

前端代码在浏览器运行，需要从服务器把 html/css/js 资源下载执行，下载的资源体积越小，页面加载的速度会越快，一般会采用 gzip 压缩，可以有效的
减少静态资源的文件大小，压缩率在 70% 左右。

nginx 可以配置 gzip: on 来开启压缩，但是只在 nginx 层面开启，会在每次请求资源时都对资源进行压缩，压缩文件会需要时间和占用服务器 cpu 资源，更好的方式是前端在打包的时候直接生成 gzip 资源，服务器接收到请求，可以直接把对应压缩好的 gzip 文件返回给浏览器，节省时间和 cpu。

webpack 可以借助 <a href="https://www.npmjs.com/package/compression-webpack-plugin">compression-webpack-plugin</a> 插件在打包时生成 gzip 文件，安装依赖：

```
pnpm i compression-webpack-plugin -D
```

添加配置，修改 webpack.prod.ts：

```
const CompressionPlugin  = require('compression-webpack-plugin')
module.exports = {
  // ...
  plugins: [
     // ...
     new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ]
}
```

配置完成后再打包，可以看到打包后 js 的目录下多了一个 .gz 结尾的文件：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/24.png" /> <br/>

因为只有 verdors.js 的大小超过了 10k, 所以只有它生成了 gzip 压缩文件,借助 serve -s dist 启动 dist,查看 verdors.js 加载情况.

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/25.png" /> <br/>

可以看到 verdors.js 的原始大小是 153kb，使用 gzip 压缩后的文件只剩下了 113B，可以极大提升页面加载速度。

#### <div id="id14">十四）代码格式规范和语法检测工具 <a href="#back"> 回到顶部</a></div>

##### 1）代码格式规范和语法检测工具

1）EditorConfig: 是一个用于统一编辑器和 IDE 的配置文件的工具，它可以帮助团队协作中的开发人员保持一致的编码风格，无论他们使用的是那个编辑器或 IDE。EditorConfig 支持配置文件的语法规则，缩进，换行符，字符编码等。我们可以在项目中添加一个 .editorconfig 文件来使用。

2）ESLint: ESLint 是一个广泛使用的 javascript 代码检测工具，它可以帮助开发人员遵循代码风格规范，并发现代码中潜在的问题。ESLint 有很多可定制的规则，可以根据团队的代码风格和项目的要求进行配置。

3）Prettier: Prettier 是一个代码格式化工具，它可以自动化地将代码格式化为一致的风格。和 ESLint 不同的是：Prettier 不关心代码的语义或质量，只关心代码的外观。Prettier 与 ESLint 集成使用可以让代码保持一致性和规范性。

4）Stylelint: Stylelint 是一个 css 样式检查工具，它可以帮助开发人员遵循 CSS 代码风格规范，并发现代码中潜在的问题，Stylelint 有很多可定制的规则，可以根据团队的代码风格和项目的要求进行配置。

5）Markdownlint: Markdownlint 是一个用于检查 Markdown 文件中语法和格式的工具，它可以帮组我们保证 Markdown 文件的一致性和可读性。

总结下：

```
EditorConfig: 跨编辑器和 IDE 编写代码，保持一致的简单编码风格；
Prettier: 专注于代码格式化的工具，美化代码；
ESLint：专注于代码质量检测、编码风格约束等；
Stylelint：专注于样式代码语法检查和格式错误检查；
Markdownlint：专注作为 Markdown 的 linter；
```

##### 2) 代码提交规范工具

1）Commitizen: 它是一个 Git 提交信息格式化工具，可以通过命令行交互地创建符合规范的 Git 提交信息，Commitizen 支持自定义提交信息的格式，并且可以与其他规范工具 集成使用。

2）Conventional Commits: 它是一个 Git 提交信息规范标准，规定了 Git 提交信息的格式和内容，包括提交类型，作用域，描述，消息体和消息页脚等部分。Conventional Commits 规范可以帮助团队协作中的开发人员更好的理解和管理代码的变更历史。

3）Husky 和 Commitlint: Husky 和 Commitlint 是两个工具，可以结合使用来规范 Git 的提交信息。Husky 可以在 Git 提交前执行一些预定义的钩子(比如 pre-commit 和 pre-push)，而 Commitlint 可以检查 Git 提交信息是否符合规范。

4）Git Hooks: 它是 Git 自带的一个钩子系统，可以在 Git 的各个生命周期（如 pre-commit 和 post-commit）执行自定义的脚本，开发人员可以使用 Git Hooks 来规范化 Git 提交信息。比如 在 pre-commit 钩子中执行提交信息的格式检查。

##### 1）EditorConfig

在项目中引入 editorConfig 是为了在多人协作开发中保持代码的风格的一致性。不同的开发者使用不同的编辑器或 IDE，可能会有不同的缩进（比如有的人喜欢 4 个空格，有的喜欢 2 个空格）、换行符、编码格式等。甚至相同的编辑器因为开发者自定义配置的不同也会导致不同风格的代码，这会导致代码的可读性降低，增加代码冲突的可能性，降低了代码的可维护性。

##### 1.1) 安装 EditorConfig for VS Code

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/26.png" /> <br/>

##### 1.2) 新建 .editorconfig

在根目录新建 .editorconfig 文件

```
# https://editorconfig.org
root = true # 设置为true表示根目录，控制配置文件 .editorconfig 是否生效的字段

[*] # 匹配全部文件，匹配除了 `/` 路径分隔符之外的任意字符串
charset = utf-8                  # 设置字符编码，取值为 latin1，utf-8，utf-8-bom，utf-16be 和 utf-16le，当然 utf-8-bom 不推荐使用
end_of_line = lf                 # 设置使用的换行符，取值为 lf，cr 或者 crlf
indent_size = 2                  # 设置缩进的大小，即缩进的列数，当 indexstyle 取值 tab 时，indentsize 会使用 tab_width 的值
indent_style = space             # 缩进风格，可选space｜tab
insert_final_newline = true      # 设为true表示使文件以一个空白行结尾
trim_trailing_whitespace = true  # 删除一行中的前后空格

[*.md] # 匹配全部 .md 文件
trim_trailing_whitespace = false
```

上面的配置可以规范本项目中文件的缩进风格，和缩进空格数等，会覆盖 vscode 的配置，来达到不同编辑器中代码默认行为一致的作用。

##### 2) Prettier

每个人写代码的风格习惯不一样，比如代码换行，结尾是否带分号，单双引号，缩进等，而且不能只靠口头规范来约束，项目紧急的时候可能会不太注意代码格式，这时候需要有工具来帮我们自动格式化代码，而 prettier 就是帮我们做这件事的。

##### 2.1) 安装 VS Code 插件和 prettier

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/27.png" /> <br/>

安装 prettier

```
pnpm add prettier -D
```

##### 2.2) 新建 .prettier.js

在根目录下新建 .prettierrc.js 和 .prettierignore 文件：

```
// .prettierrc.js
module.exports = {
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  useTabs: false, // 是否启用tab取代空格符缩进，.editorconfig设置空格缩进，所以设置为false
  printWidth: 100, // 一行的字符数，如果超过会进行换行
  semi: false, // 行尾是否使用分号，默认为true
  singleQuote: true, // 字符串是否使用单引号
  trailingComma: 'none', // 对象或数组末尾是否添加逗号 none| es5| all
  jsxSingleQuote: true, // 在jsx里是否使用单引号，你看着办
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  arrowParens: 'avoid' // 箭头函数如果只有一个参数则省略括号
}
```

```
// .prettierignore
node_modules
dist
env
.gitignore
pnpm-lock.yaml
README.md
```

##### 2.3) 配置 .vscode/settings.json

虽然已经配置 prettier 格式化规则，但还需要让 vscode 来支持保存后触发格式化，在项目根目录新建 .vscode 文件夹，内部新建 settings.json 文件配置文件，代码如下：

```
{
  "search.exclude": {
    "/node_modules": true,
    "dist": true,
    "pnpm-lock.yaml": true
  },
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "javascript.validate.enable": false
}
```

##### 2.4) 脚本命令检查 和 修复格式

在 package.json 的 scripts 中加入以下脚本命令：

```
"scripts": {
  "lint:prettier": "prettier --write --loglevel warn \"src/**/*.{js,ts,json,tsx,css,less,scss,stylus,html,md}\""
}
```

这段代码是一个脚本命令，用于运行 Prettier 工具来格式化指定目录下的文件。具体解释如下：

```
"--write": 表示将格式化后的结果直接写回原文件中，而不是输出到控制台。
"--loglevel warn": 表示只输出警告级别的日志信息。
"src/\*_/_.{js,ts,json,tsx,css,less,scss,stylus,html,md}": 是要格式化的文件的路径，这里指定了在 src 目录下，所有扩展名为 .js、.ts、.json、.tsx、.css、.less、.scss、.stylus、.html、.md 的文件。
```

现在我们可以测试一下，将 .prettierrc.js 中的 tabWidth 值修改为 4（缩进为 4 个空格），然后运行 pnpm run lint:prettier，随便打开一个 src 下的文件，你就会发现缩进从 2 变成 4 了。

##### 3) Markdownlint

##### 3.1) 安装 markdownlint-cli

vscode 中安装该插件，如下所示

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/28.png" /> <br/>

安装依赖文件

```
pnpm add markdownlint-cli -D
```

##### 3.2) 新建 .markdownlint.js

```
module.exports = {
  default: false, // excludes all rules
  MD001: true, // enables rule MD001
  MD003: { style: 'atx_closed' }, // set parameter style of rule MD003 to atx_closed
  'first-line-heading': true, // enables alias first-line-heading
  atx_closed: true // enables tag atx-closed
}
```

名称可以是 default、 rule、 alias 或 tags：

default：特殊属性，设为  true  会启用所有规则，反之设为  false  则关闭所有规则
rule：规则名称，对应至各个规则，像是范例中的  MD001  与 MD003
alias：规则别称，对应至各个规则的别名，例如范例中的  first-line-heading  是规则  MD041  的别名
tags：作用的标签，对应至各规则的所属标签，可以将其视为规则的群组，例如范例中的  atx_closed  包括了  MD020  与  MD021  两个规则

在根目录新建  .markdownlintignore，然后加入：

```
node_modules
dist
env
.gitignore
pnpm-lock.yaml
src/assets/*
.vscode
public
.github
```

设定完成后执行 Markdownlint：

```
npx markdownlint --config .markdownlint.js --fix .
```

这个指令会依照 .markdownlint.js 所设定的规则规范项目中所有的 Markdown 文件。
最后一步，将其加入到 package.json 的 scripts 中：

```
"scripts": {
  // ...
  "lint:md": "npx markdownlint --config .markdownlint.js --fix ."
},
```

##### 3.3) 配置 .vscode/settings.json

```
{
  // ...
  "editor.codeActionsOnSave": {
    "source.fixAll.markdownlint": true
  }
}
```

这样就可以在保存 md 文件的时候，自动修复文档了。 markdownlint 了解下就可以了。

##### 4）stylelint

##### 4.1) 安装 stylelint 插件和依赖

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/29.png" /> <br/>

```
pnpm add stylelint stylelint-config-css-modules stylelint-config-prettier stylelint-config-standard stylelint-order -D
```

##### 4.2) 新建 .stylelintrc.js 和 .stylelintignore

```
// .stylelintrc.js
// @see: https://stylelint.io
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier'
  ],
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': [
      // 命名规范 -
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case'
      }
    ],
    'string-quotes': 'double', // 单引号
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': null,
    'at-rule-name-case': 'lower', // 指定@规则名的大小写
    'length-zero-no-unit': true, // 禁止零长度的单位（可自动修复）
    'shorthand-property-no-redundant-values': true, // 简写属性
    'number-leading-zero': 'always', // 小数不带0
    'declaration-block-no-duplicate-properties': true, // 禁止声明快重复属性
    'no-descending-specificity': true, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器。
    'selector-max-id': null, // 限制一个选择器中 ID 选择器的数量
    'max-nesting-depth': 10,
    'declaration-block-single-line-max-declarations': 1,
    'block-opening-brace-space-before': 'always',
    'selector-max-type': [0, { ignore: ['child', 'descendant', 'compounded'] }],
    indentation: [
      2,
      {
        // 指定缩进  warning 提醒
        severity: 'warning'
      }
    ],
    'order/order': ['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules'],
    'order/properties-order': [
      // 规则顺序
      // ...  这块太长，去我 github repo 找吧
    ]
  }
}
```

.stylelintignore 文件：

```
dist
public
env
build
.vscode
.husky
.DS_Store
.github
typings
README.md
node_modules
```

##### 4.3) 配置 .vscode/settings.json

最后在 .vscode/settings.json 中加入：

```
{
  // ...
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": [
    "css",
    "less",
    "sass",
    "stylus",
    "postcss"
  ]
}
```

##### 5) eslint

##### 5.1) 安装 eslint 插件和包

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/30.png" /> <br/>

安装 eslint

```
pnpm add eslint eslint-config-airbnb eslint-config-standard eslint-friendly-formatter eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-node eslint-plugin-promise eslint-plugin-react-hooks eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

##### 5.2) 新建 .eslintrc.js

在根目录新建一个 .eslintrc.js 文件：

```
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // eslint (http://eslint.cn/docs/rules)
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'consistent-return': 0,
    '@typescript-eslint/ban-types': 'off',
    // "import/no-extraneous-dependencies": "off",
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off', // 关闭默认使用 export default 方式导出
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    '@typescript-eslint/no-use-before-define': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
    'no-shadow': 'off',
    // "@typescript-eslint/no-var-requires": "off"
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // "no-var": "error", // 要求使用 let 或 const 而不是 var
    // "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
    // "no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
    // "prefer-const": "off", // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    // "no-irregular-whitespace": "off", // 禁止不规则的空白

    // // typeScript (https://typescript-eslint.io/rules)
    // "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
    // "@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
    // "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
    // "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
    // "@typescript-eslint/ban-ts-ignore": "off", // 禁止使用 @ts-ignore
    // "@typescript-eslint/ban-types": "off", // 禁止使用特定类型
    // "@typescript-eslint/explicit-function-return-type": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
    // "@typescript-eslint/no-var-requires": "off", // 不允许在 import 语句中使用 require 语句
    // "@typescript-eslint/no-empty-function": "off", // 禁止空函数
    // "@typescript-eslint/no-use-before-define": "off", // 禁止在变量定义之前使用它们
    // "@typescript-eslint/ban-ts-comment": "off", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
    // "@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)
    // "@typescript-eslint/explicit-module-boundary-types": "off", // 要求导出函数和类的公共类方法的显式返回和参数类型

    // // react (https://github.com/jsx-eslint/eslint-plugin-react)
    // "react-hooks/rules-of-hooks": "error",
    // "react-hooks/exhaustive-deps": "off"
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
```

##### 5.3) 新建 .eslintignore

在根目录新建一个 .eslintignore 文件：

```
node_modules
dist
env
.gitignore
pnpm-lock.yaml
README.md
src/assets/*
```

.eslintignore 用于指定 ESLint 工具在检查代码时要忽略的文件和目录。具体来说，.eslintignore 文件中列出的文件和目录将被 ESLint 忽略，不会对其进行代码检查和报告。这个文件中的每一行都是一个文件或目录的模式，支持使用通配符（\*）和正则表达式来匹配多个文件或目录。

##### 5.4) 添加 eslint 语法检测脚本

在 package.json 的 scripts 中新增：

```
"scripts": {
  "lint:eslint": "eslint --fix --ext .js,.ts,.tsx ./src"
}
```

--fix：此项指示 ESLint 尝试修复尽可能多的问题。这些修复是对实际文件本身进行的，只有剩余的未修复的问题才会被输出。

现在执行 pnpm run lint:eslint，控制台将会爆出一系列 warning：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/31.png" /> <br/>

##### 5.5) eslint 与 prettier 冲突

安装两个依赖：

```
pnpm add eslint-config-prettier eslint-plugin-prettier -D
```

在 .eslintrc.js 的 extends 中加入：

```
module.exports = {
  // ...
  extends: [
    // ...
    'plugin:prettier/recommended', // <==== 增加一行
  ],
  // ...
}
```

最后再配置一下 .vscode/settings.json：

```
{
  // ...
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
  },
}
```

##### 6) husky + lint-statged

##### 6.1) 使用 lint-staged 优化 eslint 检测速度

在上面配置的 eslint 会检测 src 文件下所有的 .ts, .tsx 文件。但是当项目文件多的时候，检测的文件也会很多，需要的时间也会越来越多。因此如果我们只是检测提交到
暂存区的文件话，比如使用 git add 添加的文件，不在暂存区的文件不用再次检测。lint-staged 就是来帮我们做这件事的。

在我们的 package.json 添加 lint-staged 配置：

```
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "pnpm run lint:eslint",
    "pnpm run lint:prettier"
  ]
},
```

因为要检测 git 暂存区代码，所以如果我们的项目还没有使用 git 来做版本控制的话，需要执行 git init 初始化下；

```
git init
```

初始化 git 完成后就可以进行测试了，我们可以先提交下没有语法问题的 App.tsx

```
git add src/App.tsx
```

把 src/App.tsx 提交到暂存区后，执行 npx lint-staged, 会顺利通过检测。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/32.png" /> <br/>

假如我们现在把 package.json 中的 "lint:eslint" 改一下，加一个 --max-warnings=0, 表示允许最多 0 个警告，就是只要出现警告就会报错。

```
"scripts": {
  "lint:eslint": "eslint --fix --ext .js,.ts,.tsx ./src --max-warnings=0"
}
```

然后我们在 App.tsx 中加入一个未使用的变量：

```
// ...
const a = 1
// ...
```

然后再执行如下命令：

```
git add src/App.tsx
npx lint-staged
```

在控制台就会出现了 warning， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/33.png" /> <br/>

这就是 lint-staged 的用法。

##### 6.2）使用 tsc 检测类型和报错

执行 tsc 命令可能会生成一个编译后的产物文件，如果想要避免这个问题的话，需要在 tsconfig.json 中加入 "noEmit": true;

```
{
  "compilerOptions": {
    "target": "es2016",
    "esModuleInterop": true,
    "module": "commonjs",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "typeRoots": ["./typings/*.d.ts", "node_modules/@types"],
    "jsx": "react-jsx", // react18这里改成react-jsx，就不需要在tsx文件中手动引入React了
    "baseUrl": ".",
    "allowJs": false, // 允许编辑js文件
    "noEmit": true, // 不生成输入文件
    "paths": {
      "@/*": ["src/*"]
    },
    "resolveJsonModule": true,
    // 开启装饰器使用
    "experimentalDecorators": true
  },
  "include": ["./src", "./typings/*.d.ts"]
}
```

更多配置如下：

```
{
  "compilerOptions": {

    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```

在我们项目中使用了 ts，但一些类型的问题，现在配置的 eslint 是检测不出来的，需要我们使用 ts 提供的 tsc 工具进行检测，比如如下代码：

在我们的 App.tsx 假如有如下代码：

```
function hello(name: string) {
  return `hello ${name}`;
}

hello(123);
```

如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/34.png" /> <br/>

在 src/App.tsx 定义了 函数 hello，参数 name 是 string 类型，当我们调用函数传递 number 类型参数时，页面已经有了明显的 ts 报错，但是此时提交的 App.tsx 文件到暂存区后执行 npx lint-staged 执行的话，且通过了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/35.png" /> <br/>

可以看到我们检测到报错，所以我们需要配置下 tsc 来检测类型，在 package.json 添加脚本命令；

```
"scripts": {
  //...
  "pre-check": "tsc && npx lint-staged"
  //...
}
```

现在我们执行 pnpm run pre-check 发现已经可以检测出类型报错了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/36.png" /> <br/>

##### 6.3）配置 husky

为了避免把不规范的代码提交到远程仓库，一般会在 git 提交代码时对代码语法进行检测，只有检测通过时才能被提交，git 提供了一系列的 githooks，我们需要其中的 pre-commit 钩子，它会在 git commit 把代码提交到本地仓库之前执行。我们可以在这个阶段检测代码，如果检测不通过就退出命令行进程停止 commit.

##### 6.3.1) 代码提交前 husky 检测语法

husky 可以监听 githooks 的工具，可以借助它来完成这件事情。

安装 husky

```
pnpm add husky -D
```

##### 6.3.2) 配置 husky 的 pre-commit 钩子

生成 .husky 配置文件夹 (如果项目中没有初始化 git, 需要先执行 git init，如果初始化过 请忽略)。

```
npx husky install
```

执行完上面的命令后，会在项目的根目录下生成 .husky 文件夹，生成文件成功后，需要让 husky 支持监听 pre-commit 钩子，监听到后执行上面定义的 pnpm run pre-check 语法检测。执行如下命令：

```
npx husky add .husky/pre-commit 'pnpm run pre-check'
```

会在 .husky 目录下生成 pre-commit 文件，在文件里面可以看到我们设置的 npm run pre-check 命令。如下所示

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/37.png" /> <br/>

然后我们提交代码进行测试。

```
git add src/App.tsx
git commit -m "feat: add code validate"
```

会发现监听 pre-commit 钩子执行了 pnpm run pre-check, 使用 eslint 检测了 git 暂存区的两个文件，并且发现了报错，退出了命令行。没有执行 git commit 把暂存区代码提交到本地仓库。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/38.png" /> <br/>

#### 七）Commit 信息的 Linter - Commitlint

Commitlint 是个 npm 包，它使用 commit conventions 规范来检查 commit 的信息是否符合我们约定好的提交规范。
通过配置 commitlint.config.js, Commitlint 可以知道要使用哪些规则规范 commit 信息，并输出 相对的提示并供使用者作为修改的依据。

使用 Commitlint 规范项目的 commit，可以让所有人的代码提交保持一致的格式。

##### 安装 Commitlint

```
pnpm add @commitlint/cli -D
```

##### 使用 Commitlint

安装完成后，需要在项目的根目录下创建 commitlint.config.js; 配置代码如下：

```
module.exports = {
  rules: {
    'header-min-length': [2, 'always', 10],
  },
};
```

配置属性 rules 可以设定规则，规则列表可以参考 <a href="https://commitlint.js.org/#/reference-rules">Commitlint 官方文档</a>。
例中设定讯息标头的最小长度要大于 10。

##### 配置规则包

为了节省配置规则的时间，Commitlint 可以使用预先配置的规则包来设定多项规则，使用前必须要安装它。安装命令如下：

```
pnpm add @commitlint/config-conventional -D
```

如上使用了 @commitlint/config-conventional 是 Commitlint 提供的规则包。安装完成后，要在配置中设定使用规则包：

```
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // ...
};
```

##### 使用 Husky 为 Commitlint 注册 Git Hooks

现在我们使用 Husky 将 Commitlint 融入 Git flow 中，让其更加的易用，使用 husky add 将指令加入到 Git hooks 中。

```
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

执行完成后，要重新注册 Git hooks；执行命令如下：

```
npx husky install
```

这会触发相关的初始化工作，完成设定后，当我们输入指令 git commit, 在完成编辑讯息后会启动 Commitlint 检查讯息。

##### 7）Commitizen

为了避免写出不规范的 commit message 而提交失败， Commitizen 使用问答的方式，让使用者在完成问答时就可以编写出符合规范的信息。

Commitizen 是个指令式的工具，使用 Commitizen 来 commit 代码时会启动设定的 adapter, 使用 adapter 提供的问题 -- 询问开发者，每个问题都会确认一部分的 commit message，到最后将所有的回答组合起来，变成一个完整并符合规范的 commit message.

##### cz-git

指定提交文字规范，一款工程性更强，高度自定义，标准输出格式的 commitizen 适配器。安装命令如下：

```
pnpm add commitizen cz-git -D
```

配置 package.json,

```
"config": {
  "commitizen": {
    "path": "node_modules/cz-git"
  }
}
```

##### 配置 commitlint.config.js 文件

```
// @see: https://cz-git.qbenben.com/zh/guide
/** @type {import('cz-git').UserConfig} */

module.exports = {
  ignores: [commit => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release'
      ]
    ]
  },
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixsSelect: 'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefixs: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?'
      // 中文版
      // type: "选择你要提交的类型 :",
      // scope: "选择一个提交范围（可选）:",
      // customScope: "请输入自定义的提交范围 :",
      // subject: "填写简短精炼的变更描述 :\n",
      // body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      // breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      // footerPrefixsSelect: "选择关联issue前缀（可选）:",
      // customFooterPrefixs: "输入自定义issue前缀 :",
      // footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      // confirmCommit: "是否提交或修改commit ?"
    },
    types: [
      {
        value: 'feat',
        name: 'feat:     🚀  A new feature',
        emoji: '🚀'
      },
      {
        value: 'fix',
        name: 'fix:      🧩  A bug fix',
        emoji: '🧩'
      },
      {
        value: 'docs',
        name: 'docs:     📚  Documentation only changes',
        emoji: '📚'
      },
      {
        value: 'style',
        name: 'style:    🎨  Changes that do not affect the meaning of the code',
        emoji: '🎨'
      },
      {
        value: 'refactor',
        name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature',
        emoji: '♻️'
      },
      {
        value: 'perf',
        name: 'perf:     ⚡️  A code change that improves performance',
        emoji: '⚡️'
      },
      {
        value: 'test',
        name: 'test:     ✅  Adding missing tests or correcting existing tests',
        emoji: '✅'
      },
      {
        value: 'build',
        name: 'build:    📦️   Changes that affect the build system or external dependencies',
        emoji: '📦️'
      },
      {
        value: 'ci',
        name: 'ci:       🎡  Changes to our CI configuration files and scripts',
        emoji: '🎡'
      },
      {
        value: 'chore',
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: '🔨'
      },
      {
        value: 'revert',
        name: 'revert:   ⏪️  Reverts a previous commit',
        emoji: '⏪️'
      }
      // 中文版
      // { value: "特性", name: "特性:   🚀  新增功能", emoji: "🚀" },
      // { value: "修复", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
      // { value: "文档", name: "文档:   📚  文档变更", emoji: "📚" },
      // { value: "格式", name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: "🎨" },
      // { value: "重构", name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: "♻️" },
      // { value: "性能", name: "性能:   ⚡️  性能优化", emoji: "⚡️" },
      // { value: "测试", name: "测试:   ✅  添加疏漏测试或已有测试改动", emoji: "✅" },
      // { value: "构建", name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）", emoji: "📦️" },
      // { value: "集成", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡" },
      // { value: "回退", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️" },
      // { value: "其他", name: "其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: "🔨" }
    ],
    useEmoji: true,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixs: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias: 'skip',
    customIssuePrefixsAlias: 'custom',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: ''
  }
}
```

然后我们测试

```
git add .
git cz
```

如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images2/39.png" /> <br/>

##### 一键提交

我们还可以通过一个 script 来集成之前所有的这些步骤：

```
"scripts": {
  // ...
  "commit": "git pull && git add -A && git-cz && git push",
}
```

现在，我们只需要执行 pnpm run commit 即可完成代码的质量检测、style format、代码提交规范等一系列流程了。

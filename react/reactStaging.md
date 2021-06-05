
### 搭建一个React脚手架
<div id="back"></div>

#### React脚手架支持如下特性
- [x] [自动编译html并引入js文件](#id1)<br />
- [x] [给生成的文件名添加hash值。目的是解决缓存问题。](#id2) <br />
- [x] [打包编译前清理dist目录](#id3)<br />
- [x] [代码分割](#id4) <br />
- [x] [自动编译打包](#id5)<br />
- [x] [独立导出css文件](#id6) <br />
- [x] [压缩打包出的css文件](#id7)<br />
- [x] [支持Less 预处理器](#id8)<br />
- [x] [支持PostCSS](#id9) <br />
- [x] [添加图片的loader](#id10)<br />
- [x] [添加字体图标loader](#id11)<br />
- [x] [配置source-map](#id12) <br />
- [x] [webpack优化](#id13) <br />
  - [x] alias对文件路径变化 <br />
  - [x] 使用 extensions <br />
  - [x] 定义环境变量，区分开发环境还是正式环境---使用DefinePlugin <br />
  - [x] DllPlugin插件打包第三方类库 <br />
  - [x] 使用 happypack 并发执行任务 <br />
- [x] [在 react 项目中加 eslint](#id14)<br />
- [x] [在框架中引入mock工具](#id15)<br />
- [x] [引入Axios对请求的封装和API接口管理](#id16)<br />
- [x] [支持typeScript](#id17) <br />
- [x] 引入本地自动化部署项目 <br />

#### 项目初始化

  1）新建文件夹 react+staging, 进入该项目文件夹根目录下，执行项目初始化：
```
$ npm init
```
#### 安装webpack

  2）安装webpack执行如下命令：
```
$ npm install --save-dev webpack
```
#### 新建webpack配置文件

  3）在根目录创建build文件夹，添加一个js文件，命名为 webpack.base.conf.js;

  基本代码如下：
```
// webpack.base.conf.js 文件

const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  }
};
```
  entry：定义了入口文件路径。<br />
  output: 定义了编译打包之后的文件名以及所在的路径。<br />
  如上打包代码的含义是：告诉webpack入口文件是src目录下的index.js文件，输出的目录文件为项目根目录下的dist文件夹的bundle.js 文件内。

#### 安装webpack-cli

  webpack4.0版本之后的webpack，已经将webpack命令工具迁移到webpack-cli模块去了，因此我们需要安装 webpack-cli. 如下命令：
```
$ npm install --save-dev webpack-cli
```

  我们在项目根目录下创建一个文件夹名为src，在src内新建一个js文件名为index.js，因此我们的目录结构基本如下：
```
|--- react+staging
| |--- build
| | |--- webpack.base.conf.js
| |--- node_modules 
| |--- src
| | |--- index.js
| |--- package.json
```
  那我们怎么打包呢？在package.json中添加如下配置属性：
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "webpack --config ./build/webpack.base.conf.js"
},
```
  在命令行中执行如下命令，即可打包了，如下命令：
```
$ npm start
```
  可以看到在我们项目的根目录下会生成dist文件夹，在该文件夹下会有bundle.js文件生成。

#### 使用webpack-merge

  我们将使用一个叫 <a href="https://github.com/survivejs/webpack-merge">webpack-merge</a>工具来组织不同的环境，比如开发环境和线上环境打包。我们先安装 webpack-merge，命令如下所示：
```
$ npm install --save-dev webpack-merge
```
  安装完成后，我们在build文件夹下新建两个文件，分别为 webpack.dev.conf.js 和 webpack.prod.conf.js. 该两个文件分别对应的是开发环境和线上环境的配置。现在项目的目录结构如下：
```
|--- react+staging
| |--- build
| | |--- webpack.base.conf.js
| | |--- webpack.dev.conf.js
| | |--- webpack.prod.conf.js
| |--- node_modules 
| |--- src
| | |--- index.js
| |--- package.json
```
  在webpack.prod.conf.js 文件添加如下代码：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
module.exports = merge(baseWebpackConfig, {
  mode: 'production'
});
```
  在项目的根目录下 src/index.js 文件添加如下代码：
```
var element = document.getElementById('root');
element.innerHTML = 'hello world!';
```
  在项目根目录下创建一个public文件夹，然后新建一个index.html文件，基本代码如下：
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1,minimum-scale=1,user-scalable=no">
    <title>搭建一个React脚手架</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="../dist/js/bundle.js"></script>
  </body>
</html>
```
  在我们打包之前，我们修改package.json文件代码如下，去掉start命令，添加build命令：
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "webpack --config ./build/webpack.prod.conf.js"
},
```
  现在我们就可以执行 如下命令来重新打包下，如下：
```
$ npm run build
```
  我们可以先把之前的dist文件夹删了，在运行下如上命令，可以看到在我们的项目的根目录下会生成dist/js/bundle.js 文件，然后我们可以使用浏览器打开 public/index.html文件，可以看到有 "hello world" 显示了。

#### 安装React

  在命令行中输入如下命令进行安装：
```
$ npm install --save react react-dom
```
  如上安装完成之后，我们就可以编写react的JSX语法。因此我们在 src/index.js中，改成如下代码：
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(<App />, document.getElementById('root'));
``` 
  在src文件夹下新建app.js， src/app.js 文件代码如下：
```
import React from 'react';

function App() {
  return (
    <div className="App">hello world</div>
  );
}

export default App;
```
#### 注意：如上import属于ES6规范的，因此我们需要转译ES2015+的语法，安装并配置babel以及相关依赖，执行安装如下命令：
```
$ npm install --save-dev babel-loader @babel/preset-react @babel/preset-env @babel/core
```
```
1）babel-loader：使用Babel和webpack来转译Javascript文件。 
2）@babel/preset-react：转译react的JSX。
3）@babel/preset-env：转译ES2015+的语法。
4）@babel/core：babel的核心模块。
```

  根目录创建 .babelrc文件，配置 presets, .babelrc代码如下：
```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          // 大于相关浏览器版本无需用到 preset-env
          "edge": 17,
          "firefox": 60,
          "chrome": 67,
          "safari": 11.1
        },
        "corejs": 2,  //解决警告:  We noticed you're using the `useBuiltIns` option without declaring a core-js version
        // 根据代码逻辑中用到的 ES6+语法进行方法的导入，而不是全部导入
        "useBuiltIns": "usage"
      }
    ],
    "@babel/preset-react"  // 转换react代码
  ]
}
```
#### 修改 build/webpack.base.conf.js 文件

```
// webpack.base.conf.js 文件

const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: "babel-loader",
        include: path.resolve(__dirname, '../src')
      }
    ]
  }
};
```
  我们可以继续运行 npm run build 命令就可以进行打包了。

  现在我们的项目目录结构变成如下：
```
|--- react+staging
| |--- build
| | |--- webpack.base.conf.js
| | |--- webpack.dev.conf.js
| | |--- webpack.prod.conf.js
| |--- node_modules
| |--- public
| | |--- index.html 
| |--- src
| | |--- app.js
| | |--- index.js
| |--- package.json
| |--- .babelrc
```
  package.json 安装包如下：
```
{
  "name": "rstaging",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config ./build/webpack.prod.conf.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.10.2",
    "@babel/preset-env": "^7.10.2",
    "@babel/preset-react": "^7.10.1",
    "babel-loader": "^8.1.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11",
    "webpack-merge": "^4.2.2"
  },
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  }
}
```
#### 添加插件

#### <div id="id1">1）自动编译html并引入js文件。<a href="#back">回到顶部</a></div>

  public下的index.html 应该自动编译到dist目录的，并且所有的js引用是自动添加进去的，因此我们可以使用 html-webpack-plugin插件来做这个优化。

  安装命令如下所示:
```
npm install --save-dev html-webpack-plugin
```
#### 在webpack.prod.conf.js中配置plugins属性

```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',   
      template: 'public/index.html', 
      inject: 'body', 
      minify: {   
        removeComments: true,  
        collapseWhitespace: true,
      }
    })
  ]
});
```
  filename: 打包之后的html文件名字. <br/>
  template: html模版文件。<br/>
  inject： 在body最底部引入js文件，如果是head，就是在head中引入js <br/>
  minify： 压缩html文件 <a href="https://github.com/jantimon/html-webpack-plugin#minification">点击详情查看更多配置</a><br/>
  removeComments：删除注释 <br/>
  collapseWhitespace：去除空格 <br/>

  现在我们删除 public/index.html中手动引入的js文件，public/index.html文件代码改成如下：
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1,minimum-scale=1,user-scalable=no">
    <title>搭建一个React脚手架</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```
  我们现在可以重新运行 npm run build 命令，然后会在dist目录下生成index.html文件，我们使用浏览器打开index.html文件就可以看到和之前一样的效果了。

#### <div id="id2">2) 给生成的文件名添加hash值。目的是解决缓存问题。<a href="#back">回到顶部</a></div> 

  那么给打包后的文件添加hash值，有三种，分别是：hash, chunkhash 和 contenthash. 那么他们之间的区别是什么呢？

  hash：给文件添加hash值后，当每次修改任何一个文件时候，所有文件打包后的hash值都是一样的，因此如果只修改了其中任何一个文件，整个项目的文件缓存都会将失效。<br/>
  chunkhash：也能给文件添加hash值，当其中一个文件发生改变的时候，当重新打包的时候，它不会把未改动的js文件中的hash值发生改变，因此未更改的js文件还是会使用缓存，<br/>
  因此chunkhash比hash更好，但是它也有一个缺点是：当js文件中因此了css文件代码，当我们改动js文件的时候，该css文件的hash值也会发生改变。css文件代码不能被缓存。<br/>
  contenthash：是最优的方案，它可以解决 hash 和 chunkhash的缺点，并且兼容chunkhash的优点，因此我们使用 contenthash 来做hash值。

  想了解更多，可以看我这篇文章，<a href="https://www.cnblogs.com/tugenhua0707/p/9615822.html">请点击查看</a>。

  因此我们需要修改 webpack.prod.conf.js文件，增加如下代码：
```
// webpack.prod.conf.js
output: {
  filename: "js/[name].[contenthash:8].js"
}
```
  因此 build/webpack.prod.conf.js 代码修改成如下：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 添加代码
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      // 压缩html文件 详情看：https://github.com/jantimon/html-webpack-plugin#minification
      minify: {   
        removeComments: true,  // 删除注释
        collapseWhitespace: true, // 去除空格
      }
    })
  ]
});
```
  我们继续使用 npm run build 代码后，就可以看到我们的文件都有hash编码了。

#### <div id="id3">3）打包编译前清理dist目录 <a href="#back">回到顶部</a></div>

  在上面的修改，因为js文件名字不同，之后我继续打包，会把之前打包之后的js文件也会留下，因此我们可以在打包生成文件之前我们可以先清除dist目录，再重新生成。

#### 安装 clean-webpack-plugin
```
$ npm install --save-dev clean-webpack-plugin
```
  修改 webpack.prod.conf.js 文件，代码如下：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 添加代码
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      // 压缩html文件 详情看：https://github.com/jantimon/html-webpack-plugin#minification
      minify: {   
        removeComments: true,  // 删除注释
        collapseWhitespace: true, // 去除空格
      }
    }),
    new CleanWebpackPlugin()
  ]
});
```
#### <div id="id4">4) 代码分割 <a href="#back">回到顶部</a></div>

  我们先看下，我们之前打包编译时候，控制台的信息：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/63.jpg" /> <br />

  可以看到，我们打包之后的app.js文件大小为128kb，如果以后业务代码越来越多，这个包就会变得越来越大，每次上线后，用户都需要重新下载这个包，下载会更慢。
因此我们需要将 公共代码 和 业务代码分离出来。比如 react 和 react-dom, 那么这部分不变的代码单独进行打包。

  修改 webpack.base.conf.js 的entry的入口属性，抽离出框架代码。
```
entry: {
  app: './src/index.js',
  framework: ['react', 'react-dom']
}
```
  接着我们需要修改 webpack.prod.conf.js ，增加以下代码，目的是分离框架代码和业务代码。
```
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        }
      }
    }
  }
}
```
  build/webpack.base.conf.js 代码如下所示：
```
// webpack.base.conf.js 文件

const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    framework: ['react', 'react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: "babel-loader",
        include: path.resolve(__dirname, '../src')
      }
    ]
  }
};
```  
  build/webpack.prod.conf.js 代码如下所示：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 添加代码
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      // 压缩html文件 详情看：https://github.com/jantimon/html-webpack-plugin#minification
      minify: {   
        removeComments: true,  // 删除注释
        collapseWhitespace: true, // 去除空格
      }
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        }
      }
    }
  }
});
```
  最后我们再执行 npm run build 打包后可以看到如下打包信息：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/64.jpg" /> <br />

  如上我们可以看到框架代码 js/framework.f7c2c022.js 大小为127kb，业务代码 js/app.bc1543a3.js大小才为1.69kb。
```
1）cacheGroups对象，定义了需要被抽离的模块。
2）其中test属性他可以是一个字符串，也可以是正则表达式，还可以是函数。如果定义的是字符串，会匹配入口模块名称，会从其他模块中把包含这个模块的抽离出来
3）name是抽离后生成的名字，和入口文件模块名称相同，这样抽离出来的新生成的framework模块会覆盖被抽离的framework模块
```
#### <div id="id5">5）自动编译打包 <a href="#back">回到顶部</a></div>

  我们每次打包代码都需要执行 npm run build 命令，很繁琐，因此我们需要在开发环境开启服务监听文件改动来实时更新最新内容，因此我们使用到了 webpack-dev-server。我们可以使用如下命令进行安装：
```
$ npm install --save-dev webpack-dev-server
```
  安装完成后，我们需要在我们的 build/webpack.dev.conf.js 文件中添加如下代码：
```
const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: { 
    filename: "js/[name].[hash:8].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      minify: {
        html5: true
      },
      hash: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: '8080',
    contentBase: path.join(__dirname, '../public'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
    open: true,
    proxy: {}
  }
});
```
  在package.json中的scripts属性添加如下内容：
```
"scripts": {
  "build": "webpack --config ./build/webpack.prod.conf.js",
  "dev": "webpack-dev-server --inline --progress --config ./build/webpack.dev.conf.js"
}
```  
  然后我们再在命令行中执行 npm run dev 命令，就可以自动打开浏览器页面了，当我们修改某个文件后，就会自动更新代码了。<br/>
  想要了解更多的 devServer 配置项，我们可以看 <a href="https://www.cnblogs.com/tugenhua0707/p/9418526.html#_labe1_10">这篇文章</a>。

#### <div id="id6">6）独立导出css文件.<a href="#back">回到顶部</a></div>

#### 6.1) 新建css文件

  在我们的 /src目录下，新建一个文件夹为 css, 然后在该文件夹内部新建 app.css， 并且输入以下代码：
```
.App {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightcoral;
}
``` 
#### 6.2) 在app.js中引入css

  打开 /src/app.js， 添加如下代码：
```
import './css/app.css';
```
#### 6.3) 配置loader

  webpack只能编译js文件，css文件是无法被识别并编译的，因此我们需要loader加载器来进行预处理。因此我们首先需要安装 style-loader 和 css-loader;
```
$ npm install --save-dev style-loader css-loader
```
  因此我们需要在 webpack.prod.config.js中添加如下配置：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 添加代码
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      // 压缩html文件 详情看：https://github.com/jantimon/html-webpack-plugin#minification
      minify: {   
        removeComments: true,  // 删除注释
        collapseWhitespace: true, // 去除空格
      }
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        }
      }
    }
  }
});
```
  现在，我们执行 npm run build，后，打开我们的dist/index.html后，发现页面被嵌入到css样式了。

#### 注意：
  1）loader中的规则编写是有顺序的，它是从右边到左执行的，当我们遇到后缀为 .css的文件时候，webpack先使用 css-loader 加载器去解析这个文件，然后再使用
style-loader生成一个内容为最终解析完的css代码的style标签，把css代码放到head标签里面。因此我们代码配置中需要把 style-loader 写到 css-loader的前面，如下所示代码配置：<br />
```
use: [
  'style-loader',
  'css-loader'
];
```
#### 打包独立的css文件

  如上虽然能引入css文件了，但是它是通过style-loader预处理的，插入到head标签内，但是我想css分离出来，通过外部引入css样式文件，那么我们需要怎么做呢？我们
可以使用插件 mini-css-extract-plugin. 

  1) 首先我们需要安装该插件，命令如下：<br/>
```
npm install --save-dev mini-css-extract-plugin
```
  2) 然后我们需要在 webpack.prod.conf.js中引入该插件：
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
```
  3) 配置plugin
```
module.exports = merge(common, {
  plugins: [
    //...
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
  ]
});
```
  4) 修改loader
```
module: {
  rules: [
    {
      test: /\.css$/,
      use: [ 
        MiniCssExtractPlugin.loader,
        'css-loader' 
      ]
    }
  ]
},
```
  因此，webpack.prod.conf.js 代码变成如下：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 添加代码
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          //'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      // 压缩html文件 详情看：https://github.com/jantimon/html-webpack-plugin#minification
      minify: {   
        removeComments: true,  // 删除注释
        collapseWhitespace: true, // 去除空格
      }
    }),
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        }
      }
    }
  }
});
```
  然后我们再运行 npm run build 打包就可以看到 在dist/index.html 文件内，css被单独引入进去了。我们在浏览器源码中也可以看得到，如下所示:

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/65.jpg" /> <br />

#### <div id="id7">7) 压缩打包出的css文件.<a href="#back">回到顶部</a></div>

  我们可以打开dist目录下打包生成的css文件，可以看到，代码未被压缩，因此我们需要使用 插件optimize-css-assets-webpack-plugin 来对css文件代码进行压缩。

#### 7.1）安装 optimize-css-assets-webpack-plugin
```
npm install --save-dev optimize-css-assets-webpack-plugin
```
#### 7.2）引入optimize-css-assets-webpack-plugin

  在webpack.prod.conf.js 中引入该插件，代码如下：
```
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
```
#### 7.3）配置minimizer参数
```
optimization: {
  minimizer: [
    new OptimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor:require("cssnano"),
      cssProcessorPluginOptions:{
        preset:['default', { discardComments: { removeAll:true } }]
      },
      canPrint:true
    })
  ],
  //...
}
```

  因此 webpack.prod.conf.js 所有代码变成如下了：
```
// webpack.prod.conf.js 文件

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

// 引入 html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  // 添加代码
  output: {
    filename: "js/[name].[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          //'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // 打包之后的html文件名字
      template: 'public/index.html', // html模版文件
      inject: 'body', // 在body最底部引入js文件，如果是head，就是在head中引入js
      // 压缩html文件 详情看：https://github.com/jantimon/html-webpack-plugin#minification
      minify: {   
        removeComments: true,  // 删除注释
        collapseWhitespace: true, // 去除空格
      }
    }),
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      minSize: 0,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        }
      }
    },
    // 压缩css代码
    minimizer: [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp:/\.css$/g,
        cssProcessor:require("cssnano"),
        cssProcessorPluginOptions:{
          preset:['default', { discardComments: { removeAll:true } }]
        },
        canPrint:true
      })
    ],
  }
});
```
  我们现在再执行 npm run build, 然后查看dist下的css文件，可以看到代码已经被压缩了。

  如上参数解析：

  assetNameRegExp: 正则表达式，用于匹配需要优化或者压缩的资源名。默认值是 /.css$/g  <br />
  cssProcessor: 用于压缩和优化CSS 的处理器，默认是 cssnano. <br />
  cssProcessorPluginOptions: 传递给cssProcessor的插件选项，默认为{}  <br />
  canPrint: 表示插件能够在console中打印信息，默认值是true. <br />

#### <div id="id8">8) 支持Less 预处理器。<a href="#back">回到顶部</a></div>

#### 8.1）安装less-loader
```
npm install --save-dev less less-loader
```
#### 8.2）配置loader

  在 webpack.prod.config.js 中的 module.rules 内增加三个对象：
```
module: {
  rules: [
    //...
    {
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader'
      ]
    },
  ]
},
```
  然后我们将src/css目录下的app.css 改成app.less, 重新进行打包也是可以的。

#### 注意：想要支持stylus样式文件的话，可以看我这篇文章配置 <a href="https://www.cnblogs.com/tugenhua0707/p/9478921.html">点击查看</a>

#### <div id="id9">9) 使用PostCSS. <a href="#back">回到顶部</a></div>

  postCss 有如下特点：

  1）使用下一代css语法 <br/>
  2）自动补全浏览器前缀 <br/>
  3）自动把px代为转换成rem <br/>
  4）css 代码压缩等等 <br/>

#### 安装postcss
```
npm install postcss postcss-loader --save-dev
```
  安装postcss某个插件，以Autoprefixer举例
```
npm install autoprefixer --save-dev
```
#### 配置postcss.config.js

  在根目录新建postcss.config.js，代码如下：
```
module.exports = {
  plugins: [
    // 兼容浏览器，添加前缀
    require('autoprefixer')({
      overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
        //'last 10 versions', // 所有主流浏览器最近10版本用
    ],grid: true})

  ]
}
```
#### 设置loader
```
module.exports = merge(common, {
  //...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  },
  //...
});
```
  执行 npm run build 后，在浏览器中打开dist目录下的index.html， 查看控制台的css文件，可以看到代码加上了浏览器的前缀代码了。

  同样，对于css文件的处理配置，我们可以复制一份到 webpack.dev.conf.js 中。以下是webpck.dev.config.js部分配置：
```
module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  },
```
  因此现在我们也可以运行 npm run dev 来启动开发环境来。一样我们也可以看到css文件默认加上了浏览器的前缀了。

#### <div id="id10">10）添加图片的loader. <a href="#back">回到顶部</a></div>

#### 1）安装url-loader, file-loader
```
npm install file-loader url-loader --save-dev 
```
#### 2) 引入url-loader

  在 webpack.base.conf.js 中的rules中添加一个新的对象，并且输入以下代码：
```
module: {
  rules: [
    //...
    {
      test: /\.(jpg|png|gif|jpeg)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
          limit: 8192,
        }
      }
    }
  ]
}
```
  上面代码的含义是：
  1. 遇到以 jpg, png, jpeg, gif 为后缀的文件，使用url-loader进行预处理。<br/>
  2. options中的[name].[ext]表示输出的文件名为 原来的文件名.后缀。<br/>
  3. outputPath是输出到dist目录下的路径，即: dist/images/xxxx; <br/>
  4. limit表示，如果我们这个图片大于8192字节的话，就使用file-loader去处理文件，把图片正常打包成一个单独的图片文件到对应的目录下，如果小于8kb的话，那就将图片打包成base64的图片格式插入到 app.js文件中。这样做的优点是，减少了http请求。<br/>

#### 3）在src目录下新建 images文件夹

  在src目录下新建 images文件夹，内部有1.jpg和2.jpg图片，1.jpg大于8kb，2.jpg小于8kb，然后我们在app.js中编写如下代码：
```
import React from 'react';

import './css/app.less';

import background from './images/1.jpg';
import background2 from './images/2.jpg';

function App() {
  return (
    <div>
      <div className="App">hello world22225677</div>
      <img className="background" src={background} alt=""/>
      <img className="background" src={background2} alt=""/>
    </div>
  );
}

export default App;
```
  然后我们执行 npm run build，我们可以看到打包后的dist目录下多了 images/1.jpg, 然后我们预览页面的时候，可以看到1.jpg图片和2.jpg图片，2.jpg是base64格式的。

#### <div id="id11">11）添加字体图标loader.<a href="#back">回到顶部</a></div>

  字体图标使用的是file-loader配置的，首先我们需要在 webpack.base.conf.js 中添加如下配置：
```
module: {
  rules: [
    //...
    {
      test: /\.(eot|ttf|svg|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name]_[hash].[ext]',
          outputPath: 'font/'
        }
      }
    }
  ]
}
```
#### <div id="id12">12) 配置source-map.<a href="#back">回到顶部</a></div>

  sourcemap的作用是什么呢？
  我们在项目进行打包后，会将开发中的多个文件代码打包到一个文件中，并且经过压缩，去掉多余的空格，且babel编译化后，最终会用于线上环境，那么这样处理后的代码和源代码会有很大的差别，当有bug的时候，我们只能定位到压缩处理后的代码位置，无法定位到开发环境中的代码，对于开发不好调式，因此sourceMap出现了，它就是为了解决不好调式代码问题的。

  想了解更多，<a href="https://www.cnblogs.com/tugenhua0707/p/9464984.html">请看这篇文章</a>

#### 最后总结：

#### 在开发环境中我们可以使用如下：
```
module.exports = {
  devtool: 'cheap-module-eval-source-map'
}
```
#### 在正式环境中我们可以使用  
```
module.exports = { 
  devtool: 'cheap-module-source-map';
}
```
  因此我们可以在 webpack.dev.conf.js 中添加：
```
module.exports = {
  devtool: 'cheap-module-eval-source-map'
}
```
  在 webpack.prod.conf.js 中添加 
```
module.exports = { 
  devtool: 'cheap-module-source-map';
}
```

#### <div id="id13">13）webpack优化 <a href="#back">回到顶部</a></div>

#### 1）alias对文件路径变化

  resolve.alias 是通过别名来将原导入路径映射成一个新的导入路径。比如如下配置：
```
module.exports = {
  //.....
  resolve: {
    alias: {
      '@components': '../src/components'
    }
  }
};
```
  如上代码配置，当我通过 import xxx from '@components/xxx'导入文件时，实际上被alias替换成了 import xxx from '../src/components/xxx'。

  因此我们可以把上面的配置项配置到 build/webpack.base.conf.js 中。

  下面是我们的项目的目录结构：
```
|--- react+staging
| |--- build
| | |--- webpack.base.conf.js
| | |--- webpack.dev.conf.js
| | |--- webpack.prod.conf.js
| |--- public
| | |--- index.html
| |--- src
| | |--- components
| | |--- css
| | |--- images
| |--- app.js
| |--- index.js
| |--- .babelrc
| |--- package.json
| |--- postcss.config.js
```
  我会把前端所有的react组件会放到 src/components 目录下，因此在页面上引用react组件的时候，我们可以通过 import xxx from '@components/xxx' 类似这样的来导入文件。

#### 2) 使用 extensions

  在使用import导入文件时，有时候没有带入文件的后缀名，webpack会自动带上后缀去访问文件是否存在，那么默认的后缀名为 ['.js', '.json']; 我们在编写react中，我们有 'jsx' 或 .vue 这样的后缀名的话，为了防止导入文件时候不需要加上后缀，我们可以使用 extensions 来进行配置。
```
module.exports = {
  //.....
  resolve: {
    alias: {
      '@components': '../src/components'
    },
    extensions: ['.js', '.jsx', '.vue', '.ts']
  }
};
```
  我们也是一样，把上面的 extensions配置项加入到我们的 build/webpack.base.conf.js 中即可。

#### 3) 定义环境变量，区分开发环境还是正式环境---使用DefinePlugin

  官网解释的是：DefinePlugin允许我们创建全局变量，可以在编译时进行设置，因此我们可以使用该属性来设置全局变量来区分开发环境和正式环境。这就是 DefinePlugin的基本功能。
  因此我们可以在 build/webpack.base.conf.js 中添加如下代码全局配置变量信息。
```
module.exports = {
  plugins: [
    // 设置环境变量信息
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    });
  ]
};
```
  然后我们在 package.json 中加上 NODE_ENV变量值，代码打包命令变成如下：
```
"scripts": {
  "build": "NODE_ENV=production webpack --config ./build/webpack.prod.conf.js",
  "dev": "NODE_ENV=development webpack-dev-server --inline --progress --config ./build/webpack.dev.conf.js"
},
```
  然后我们在我们的 src/app.js 中打印下 console.log(process.env); 信息，如果我们使用 npm run dev 进行打包的话就会打印：
```
{
  NODE_ENV: "development"
}
```
  当我们使用 npm run build 打包的话，就会打印如下：
```
{
  NODE_ENV: "production"
}
```
  因此我们可以根据这样的信息，来区分开发环境和正式环境。如果需要在不同的平台上使用该环境的话，我们可以使用 cross-env 来处理。这里不做多介绍，想了解更多的话，请看我之前 <a href="https://www.cnblogs.com/tugenhua0707/p/9780621.html">这篇文章</a>

#### 4) DllPlugin插件打包第三方类库

  项目中引入了很多第三方库，这些库在很长的一段时间内，基本不会更新，打包的时候分开打包来提升打包速度。比如对于react项目来说，react和react-dom库也是不会更改的，我们可以把该库打包到一个文件中去，下去打包的时候，就不会更新该包了。提高打包速度。后续有react-router也是可以打进来的。当然其他的第三方库也是可以打进来的。

  1）在项目的build文件夹目录下 新建webpack.dll.config.js文件。配置代码如下：
```
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  mode: 'production',
  entry: {
    // 项目中用到该依赖库文件
    vendor: ['react', 'react-dom']
  },
  // 输出文件
  output: {
    // 文件名称
    filename: '[name].dll.js', 
    // 将输出的文件放到dist目录下
    path: path.resolve(__dirname, '../dll'),
    /*
     存放相关的dll文件的全局变量名称，比如对于jquery来说的话就是 _dll_jquery, 在前面加 _dll
     是为了防止全局变量冲突。
    */
    library: '_dll_[name]'
  },
  plugins: [
    // 使用插件 DllPlugin
    new DllPlugin({
      /*
       该插件的name属性值需要和 output.library保存一致，该字段值，也就是输出的 manifest.json文件中name字段的值。
       比如在jquery.manifest文件中有 name: '_dll_jquery'
      */
      name: '_dll_[name]',

      /* 生成manifest文件输出的位置和文件名称 */
      path: path.resolve(__dirname, '../dll', '[name].manifest.json')
    })
  ]
}
```
  2) 在package.json中添加如下打包命令：
```
"scripts": {
  "build:dll": "webpack --config ./build/webpack.dll.config.js"
},
```
  接着我们运行 npm run build:dll 后，可以看到我们项目的根目录会生成 dll 文件夹，该文件夹下有 vendor.dll.js 和 vendor.manifest.json文件。

  3） 安装 add-asset-html-webpack-plugin 插件

  我们需要安装 add-asset-html-webpack-plugin 插件，安装命令如下：
```
npm i add-asset-html-webpack-plugin --save-dev
```
  它会将我们打包后的 dll.js 文件注入到我们生成的index.html文件中，我们需要在我们的 build/webpack.base.conf.js 文件中添加如下代码：
```
// 引入文件
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
module.exports = {
  plugins: [
    // ....
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '..', 'dll/vendor.dll.js') // 对应的 dll 文件路径
    }),
    // 告诉webpack使用了哪些第三方库代码
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '..', 'dll/vendor.manifest.json')
    }),
  ]
}
```
  现在我们运行 npm run build 命令就可以看到打包的速度很快的。

#### 5）使用 happypack 并发执行任务

  运行在Node 之上的Webpack是单线程模型的。也就是说Webpack需要一个一个地处理任务，不能同时处理多个任务。Happy Pack 就能让webpack实现多个任务，
它会将任务分解给多个子进程去并发执行，子进程处理完后再将结果发送给主进程。

  1）安装HappyPack插件
```
npm i -D happypack
```
  2） 配置HappyPack

  在build/webpack.base.conf.js 中添加如下配置项：
```
// 引入HappyPack插件 
const HappyPack = require('happypack');

rules: [
  {
    test: /\.(js|jsx)?$/,
    // use: "babel-loader",
    exclude: /node_modules/,
    include: path.resolve(__dirname, '../src'),
    use: [
      {
        // 一个loader对应一个id
        loader: "happypack/loader?id=jsBabel"
      }
    ]
  },
]
```
添加如下插件：
```
plugins: [
  new HappyPack({
    // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
    id:'jsBabel',
    // 如何处理.js文件，用法和Loader配置中一样
    loaders:['babel-loader'],
  }),
]
```
  更多可以看我之前 <a href="https://www.cnblogs.com/tugenhua0707/p/9562389.html">这篇文章</a>

#### <div id="id14">14) 在 react 项目中加 eslint <a href="#back">回到顶部</a></div>

  1) 需要安装的依赖如下：
```
npm install -D eslint eslint-loader eslint-friendly-formatter  eslint-plugin-babel
npm install -D babel-eslint eslint-plugin-html eslint-plugin-import eslint-plugin-promise eslint-plugin-node eslint-config-standard eslint-plugin-standard eslint-plugin-react
```
  2) 新建 .eslintrc.js

  在项目根目录新建 .eslintrc.js 文件，添加如下内容
```
module.exports = {
  root: true, // 作用的目录是根目录
  parser: 'babel-eslint',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module', // 按照模块的方式解析
    // 想使用的额外的语言特性:
    "ecmaFeatures": {
      // 允许在全局作用域下使用 return 语句
      "globalReturn": true,
      // impliedStric
      "impliedStrict": true,
      // 启用 JSX
      "jsx": true,
      "modules": true
    }
  },
  env: {
    //环境定义了预定义的全局变量。更多在官网查看
    "browser": true,
    "node": true,
    "commonjs": true,
    "amd": true,
    "es6": true,
    "mocha": true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  rules: {
    // .... 更多
  }
 }
```
  这里的rulse更多匹配规则，就补贴代码了，详情请看如下这篇文章。
 <a href="https://github.com/tugenhua0707/react-collection/blob/master/es6/eslint.md">在项目中添加eslint规范配置文档</a><br />
 <a href="https://github.com/tugenhua0707/eslints-rule/blob/master/.eslintrc.js">eslint配置代码查看</a> <br />

  3) 修改 build/webpack.dev.conf.js 文件配置项

  添加如下rule规则配置：
```
{
  test: /\.(js|jsx)?$/,
  exclude: /node_modules/, // 不检查的文件
  include: path.resolve(__dirname, '../src'), // 指定检查目录
  use: [
    {
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
      }
    }
  ],
  enforce: "pre", // 编译前检查
},
```
  当我执行 npm run dev 打包的时候，通过eslint检测 会报错如下信息：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/66.jpg" /> <br />

#### <div id="id15">15）在框架中引入mock工具 <a href="#back">回到顶部</a></div>

  有时候在本地开发完成后，开发暂时没有把接口开发完成，但是有约定的规范文档。因此我们根据约定好的数据进行本地mock数据，这样的话，只要根据约定好的数据开发，等接口开发完成后，我们就可以直接进行联调了。之前写过一个mock工具发布到npm包中去了，现在我们把它引入到我们的脚手架上来。

<a href="https://www.npmjs.com/package/json-mocker-tool">查看mock工具</a> <br />

  基本使用方法：
  1）下载安装执行命令： npm install --save-dev json-mocker-tool <br/>
  2）在build/webpack.dev.conf.js 中的devServer中的before配置下，如下：<br/>
```
// webpack.dev.conf.js
const mocker = require('json-mocker-tool');

module.exports = {
  devServer: {
    //....
    before: app => {
      mocker({
        mockDir: path.resolve('./mock')
      })(app);
    }
    //....
  }
}
```
  3) 在项目的根目录下新建mock文件夹。在mock文件夹下新建json文件，该json文件是根据接口来命名的，比如你接口为 /api/xxxx/widget.json 的话，那么在mock文件夹下新建 widget.json 即可，然后把和后端约定好的数据复制进去即可。如果有多个接口，命名方式和上面一样。

  4) 默认请求的是正式环境的地址，如果我们想要使用本地的mock数据的话，需要在地址栏上 加上 mode=dev ，刷新下页面即可请求到本地mock数据了。

<a href="https://www.npmjs.com/package/json-mocker-tool">了解更多请点击查看</a> <br />

<a href="https://github.com/tugenhua0707/react-collection/blob/master/mock/mock.md">如何开发一个简单的前端mock工具</a> <br />

#### <div id="id16">16）axios对请求的封装和API接口管理 <a href="#back">回到顶部</a></div>

  对于项目中有ajax请求，我会在项目中引入axios作为http库，因此我会引入 我之前写的一个叫 http-client-axios 封装的http库到我本地项目中来。
如何使用，请看我npm包的介绍 <a href="https://www.npmjs.com/package/http-client-axios">axios对请求的封装和API接口管理</a>

  代码如何实现的，<a href="https://github.com/tugenhua0707/react-collection/blob/master/ajax/axios.md">请看我这篇文章</a>。<br/>

#### <div id="id17">17）支持typeScript <a href="#back">回到顶部</a></div>

#### 1) 安装依赖包

  首先，我们的项目需要安装如下包，命令如下所示：
```
npm install --save @types/react @types/react-dom
```
  然后我们需要添加开发时的依赖包 awesome-typescript-loader 和 source-map-loader，基本命令如下所示:
```
npm install --save-dev typescript awesome-typescript-loader source-map-loader
```
  1. awesome-typescript-loader可以让Webpack使用TypeScript的标准配置文件tsconfig.json 编译TypeScript代码。<br/> 
  2. source-map-loader使用TypeScript输出的sourcemap文件来告诉webpack何时生成 自己的sourcemaps。 <br/>

#### 2) 添加TypeScript配置文件

  我们需要在项目的根目录下创建一个 tsconfig.json文件，它包含了输入文件列表以及编译选项。因此我们需要在根目录下新建 tsconfig.json 文件，添加配置如下：
```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["dom","es2015"],
    "jsx": "react",
    "sourceMap": true,
    "strict": true,
    "noImplicitAny": true,
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"],
    },
    "esModuleInterop": true,
    "experimentalDecorators": true,
  },
  "include": [
    "./src/**/*",
    "./images.d.ts"
  ]
}
```
  1）jsx 选择react。<br/>
  2) lib开启 dom 和 es2015 <br/>
  3) include 包含我们的 src目录 及 根目录下的 images.d.ts 文件<br/>

#### 3）在webpack.base.config.js 中配置文件改成如下：
```
// webpack.base.conf.js 文件
const path = require('path');
const webpack = require('webpack');

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 引入HappyPack插件 
const HappyPack = require('happypack');

const { CheckerPlugin } = require('awesome-typescript-loader');

const config = {
  entry: {
    app: './src/index.tsx',
    // framework: ['react', 'react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        enforce: 'pre',
        test: /\.ts[x]$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.(js|jsx)?$/,
        // use: "babel-loader",
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            // 一个loader对应一个id
            loader: "happypack/loader?id=jsBabel"
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192,
          }
        }
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@components': '../src/components',
      '@src': "../src"
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.ts']
  },
  plugins: [
    // 设置环境变量信息
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),

    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '..', 'dll/vendor.dll.js') // 对应的 dll 文件路径
    }),
    // 告诉webpack使用了哪些第三方库代码
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '..', 'dll/vendor.manifest.json')
    }),
    
    new HappyPack({
      // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
      id:'jsBabel',
      // 如何处理.js文件，用法和Loader配置中一样
      loaders:['babel-loader'],
    }),

    new CheckerPlugin(),
  ]
};

module.exports = config;
```
#### 4）解决typescript文件引入图片报错问题

  我们将项目中的入口文件 改成了 ./src/index.tsx，在项目编译的过程中，该index.tsx页面使用import进来的图片会报错，提示找不到该图片。因此我们需要在项目的根目录下新建一个ts声明文件：images.d.ts，基本配置如下：
```
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
```
  然后将images.d.ts配置到tsconfig.json中：
```
{
  "include": [
    "./src/**/*",
    "./images.d.ts"
  ]
}
```
  再在 页面中引入 import logo from './logo.svg';即可了。

  因此我们的项目目录结构变成如下：
```
|--- react+staging
| |--- build
| | |--- webpack.base.conf.js
| | |--- webpack.dev.conf.js
| | |--- webpack.dll.conf.js
| | |--- webpack.prod.conf.js
| |--- mock
| |--- node_modules
| |--- public
| | |--- index.html
| |--- src
| | |--- components
| | | |--- home.tsx
| | |--- css
| | |--- images
| | |--- app.tsx
| | |--- index.tsx
| |--- .babelrc
| |--- .eslintrc.js
| |--- images.d.ts
| |--- package.json
| |--- postcss.config.js
| |--- tsconfig.json
```
#### typeScript类组件使用

  在项目根目录下中的src/components 下新建 home.tsx 文件，基本代码如下：
```
import React from "react";

interface IProps {
  name: string;
}

interface IState {
  color: "red" | "blue"
}

export class Home extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      color: "red"
    }
  }
  public onClickColor = () => {
    const { color } = this.state;
    if (color === "red") {
      this.setState({
        color: "blue"
      });
    }
    if (color === "blue") {
      this.setState({
        color: "red"
      });
    }
  }
  public render() {
    const { name } = this.props;
    const { color } = this.state;
    return (
      <div>
        <span style={{ color }}>{ name }</span>
        <button onClick={this.onClickColor}>变颜色</button>
      </div>
    );
  }
}
```
  然后在 react+staging/src/app.tsx 文件下代码改成如下：
```
import React from "react";
import { Home } from './components/home'; // 引入tsx文件

import "./css/app.less";

import background from "./images/1.jpg";
import background2 from "./images/2.jpg";

function App() {
  console.log(process.env);
  return (
    <div>
      <div className="app">hello world22225677</div>
      <img className="background" src={background} alt=""/>
      <img className="background" src={background2} alt=""/>
      <Home name="kongzhi" />
    </div>
  );
}
export default App;
```
  入口文件 react+staging/src/index.tsx 代码还是一样的，如下：
```
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

ReactDOM.render(<App />, document.getElementById("root"));
```
  项目可以运行的，基本的源码可以点击如下：

### typeScript脚手架模版，<a href="https://github.com/tugenhua0707/react-staging-template/tree/supportTypeScript">请点击这里</a>

### typeScript基本语法使用，<a href="https://www.tslang.cn/docs/handbook/react-&-webpack.html">请点击官网API</a>

### react脚手架模版配置，<a href="https://github.com/tugenhua0707/react-staging-template/tree/master">请点击这里</a>












### webpack手写plugin

  在webpack中，专注于处理webpack在编译过程中的某个特定的任务的功能模块，可以被称为插件。它和loader有以下区别：

  1. loader 是一个转换器，将A文件进行编译成B文件。比如：将A.less转换为A.css, webpack自身只支持js和json两种格式的文件。对于其他文件需要通过loader将其转换为 commonjs 规范的文件。webpack才能解析。

  2. plugin 是一个扩展器。webpack打包的整个过程中，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛任务。

  Plugin 提供了很多比loader中更完备的功能，它使用阶段式的构建回调，webpack给我们提供了非常多的hook用来在构建的阶段让我们开发者自由的去引入自己的行为。

  编写webpack 插件有如下特征：
```
  1）是一个独立的模块。
  2）模块对外暴露一个js函数。
  3）函数的原型 上定义了一个注入的 compiler 对象的 apply方法。
```
  apply 函数中需要有通过 compiler 对象挂载的 webpack 事件钩子，钩子的回调中能拿到当前编译的 compilation 对象，如果是异步编译插件的话可以拿到回调callback。

  如下代码：
```
class DemoPlugin {

  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}

  // webpack 会调用 DemoPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数，用于特定时机处理额外的逻辑
    compiler.hooks.emit.tap('DemoPlugin', (compilation) => {
      // 在功能流程完成后可以调用 webpack 提供的回调函数
    })
    // 如果事件是异步的，会带2个参数，第二个参数为回调函数。
    compiler.plugin('emit', function(compilation, callback){
      // 处理完毕后执行 callback 以通知 webpack
      // 如果不执行callback，运行流程将会一直卡在这不往下执行
      callback();
    })
  }
}

module.exports = DemoPlugin;
```
  如上代码 在 webpack上执行的过程中如下：
```
  1） webpack 读取配置的过程中会先执行 new DemoPlugin(options) 初始化一个 DemoPlugin 获得其实例。
  2） 初始化 compiler 对象后调用 DemoPlugin.apply(compiler) 给插件实例传入 compiler 对象。
  3） 插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称，回调函数) 监听到 webpack 广播出来的事件，并且可以通过 compiler 对象去操作 webpack.
```
#### 事件流机制

  webpack是一种事件流的机制，它的工作是将各个插件串联起来。但是实现这一切的核心是 Tapable.

  详细了解 Tapable核心模块源码解析, 请看我之前的文章， <a href="https://www.cnblogs.com/tugenhua0707/p/11317557.html">请点击</a>

  编写一个简单的webpack插件，请看这篇文章 <a href="https://www.cnblogs.com/tugenhua0707/p/11332463.html">如何编写一个WebPack的插件原理及实践</a>

#### 同步与异步

  plugin 的hooks 有同步和异步区分的，在同步的情况下，我们使用 <hookName>.tap 的方式进行调用，而在异步hook内我们可以进行一些异步操作，并且在异步操作的情况下，我们使用 tapAsync 或者 tapPromise 方法来告知webpack这里的内容是异步的。

#### 1）tapAsync

  使用 tapAsync 的时候，我们需要多传入一个callback回调，并且在结束的时候一定要调用这个来告知webpack这个异步操作结束了，比如如下代码：
``` 
class HelloPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('Helloxxx', (compilation, callback) => {
      setTimeout(() => {
        console.log('----async---');
        callback();
      }, 1000)
    })
  }
}

module.exports = HelloPlugin;
```
#### 2) tapPromise

  当我们使用 tapPromise 来处理异步的时候，我们需要返回一个Promise对象并且让她在结束的时候 resolve。如下代码：
```
class HelloPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise("xxxxx", (compilation) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('---async---');
          resolve();
        }, 1000)
      })
    })
  }
}

module.exports = HelloPlugin;
```
#### 搭建环境
  我们先来搭建一个简单的环境。
```
  1）创建一个项目的目录： mkdir webpack-plugins-demo
  2) 进入该目录，使用 npm init -y 命令执行初始化操作。执行完成后，会在项目的根目录下生成一个 package.json 文件。
```
  然后我们安装webpack 和 webpack-cli 依赖包；安装命令如下：

```
npm install webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin clean-webpack-plugin -D
```
  整个目录结构如下：
```
|--- webpack-plugins-demo
| |--- src
| | |--- main.js  # 入口文件
| | |--- plugins  # 存放所有插件
| |--- index.html
| |--- package.json
| |--- webpack.config.js
```
  index.html 代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack</title>
<script defer src="index.js"></script></head>
<body>
  <div id="app"></div>
</body>
</html>
```
  webpack.config.js 配置代码如下：
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/main.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
    }),
    new CleanWebpackPlugin(),
  ]
};
```
  package.json 中 scripts 打包如下：
```
{
  "scripts": {
    "build": "webpack --config webpack.config.js"
  },
}
```
  src/main.js 入口文件代码如下：
```
console.log(999)
let div = document.getElementById('app')
div.innerHTML = 'webpack 插件原理分析'
```
  基本的环境搭建完成后，我们来编写一个插件。

#### 编写一个插件

  一个webpack插件由以下组成：
```
  1）一个javascript命名函数。
  2）一个apply方法，apply方法在webpack装载这个插件的时候被调用，并且会传入compiler对象。
  3）使用不同的hooks来指定自己需要发生的处理行为。
  4）在异步调用时最后需要调用webpack提供给我们的callback或通过promise的方式。
```
```
class HelloPlugin {
  apply(compiler) {
    compiler.hooks.<hookName>.tap(PluginName, (params) => {
      /** do some thing */
    })
  }
}
```
  下面实现一个最简单的插件

  在 src/plugins 目录下新建 plugin1.js，添加如下代码：
```
class WebpackPlugin1 { 
  constructor(options) { 
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.done.tap('firstPlugin', () => { 
      console.log(this.options);
    })
  }
}

module.exports = WebpackPlugin1;
```
  然后我们在 webpack 注册使用，我们只需要在 webpack.config.js 引入实例化就可以了， 如下 所有的 webpack.config.js 配置代码：
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackPlugin1 = require('./src/plugins/plugin1');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/main.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
    }),
    new CleanWebpackPlugin(),
    new WebpackPlugin1({ msg: 'hello world' }),
  ]
};
```
  此时，我们执行 npm run build 就可以看到效果了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/pluginImage/1.png" />

#### Compiler 对象

  Compiler 对象包含了当前运行的webpack的配置，该对象在启动webpack时被实例化了，并且是全局唯一的。Plugin 可以通过该对象获取到 Webpack 的配置信息进行处理。

  compiler 上暴露了一些常用的钩子:

|   钩子               |     类型             |       什么时候调用                                      |
|   ---               |     ---              |       ---                                             |
|   run               |     AsyncSeriesHook  |    在编译器开始读取记录前执行                              |
|  compile           |     SyncHook         |    在一个新的 compilation 创建之前执行                     |
|  compilation       |     SyncHook         |    在一次 compilation 创建后执行插件                      |
|  make              |  AsyncParalleHook    |    完成一次编译之前执行                                   |
|  emit              |  AsyncSeriesHook     |   在生成文件到output目录之前执行，回调函数：compilation      |
|  afterEmit          | AsyncSeriesHook      |  在生成文件到 output 目录之后执行                         ｜
| assetEmitted        | AsyncSeriesHook      | 生成文件到时候执行，提供访问产出文件信息的入口                ｜
| done               | AsyncSeriesHook      | 一次编译完成后执行，回调参数 stats                          |

  下面再弄个插件，在 src/plugins 目录下 新建 plugin2.js, 添加如下代码：
```
class WebpackPlugin2 { 
  constructor(options) { 
    this.options = options;
  }
  apply(compiler) { 
    // 在编译器开始读取记录前执行 
    compiler.hooks.run.tap('run', () => {
      console.log('开始编译....');
    });
    // 在一个新的 compilation 创建之前执行
    compiler.hooks.compile.tap('compile', () => {
      console.log('---compile---');
    });
    // 一次编译完成后执行
    compiler.hooks.done.tap('compilation', () => { 
      console.log('---compilation---');
    })
  }
}

module.exports = WebpackPlugin2;
```
  在webpack.config.js 添加如下配置文件：
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WebpackPlugin1 = require('./src/plugins/plugin1');
const WebpackPlugin2 = require('./src/plugins/plugin2');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/main.js'),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
    }),
    new CleanWebpackPlugin(),
    // new WebpackPlugin1({ msg: 'hello world' }),
    new WebpackPlugin2(),
  ]
};
```
  我们在执行 npm run build 命令后，执行效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/pluginImage/2.png" />

#### Compilation 对象

  Compilation 对象代表了一次资源版本构建，当运行webpack开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation, 从而生成一组新的编译资源。一个Compilation对象表现了当前的模块资源，编译生成资源，文件变化及被跟踪依赖的状态信息 换句话说是把本次打包编译的内容存到内存里。Compilation 对象也提供了插件需要自定义功能的回调，以供插件做自定义处理时选择使用。

  Compiler 代表整个Webpack从启动到关闭的生命周期，而 Compilation 只代表了一次新的编译，只要文件有改动，compilation就会被重新创建。

  Compilation 上暴露的一些常用的钩子

|   钩子               |     类型             |       什么时候调用                                      |
|   ---               |     ---              |       ---                                             |
|   buildModule       |     SyncHook         |    在模块开始编译之前触发，可以用于修改模块                  |
|   succeedModule     |     SyncHook         |    当一个模块被成功编译，会执行这个钩子                     |
|   finishModules     |     AsyncSeriesHook  |    当所有模块都编译成功后被调用                            |
|   seal              |     SyncHook         |    当一次compilation停止接收新模块时触发                   |
|   optimizeDependencies |     SyncBailHook  |    在依赖优化的开始执行                                   |
|   optimize          |     SyncHook         |    在优化阶段的开始执行                                   |
|   optimizeModules   |     SyncBailHook     |    在模块优化阶段开始执行，插件可以在这个钩子里执行对模块的优化  |
|   optimizeChunks    |     SyncBailHook     |    在代码优化阶段开始时执行，插件可以在这个钩子里执行对代码块的优化 |
|   optimizeChunkAssets |     AsyncSeriesHook  |  优化任何代码块资源，这些资源存放在 compilation.assets上   |
|   optimizeAssets    |     AsyncSeriesHook  |    优化所有存放在 compilation.assets 的所有资源            |

#### Compiler 和 Compilation 的区别

Compiler: 代表了整个webpack从启动到关闭的生命周期。
Compilation: 只是代表了一次新的编译，只要文件有改动，compilation 就会被重新创建。

#### 1）文件清单插件

这里是网上的demo， 当作提供编写插件的思路。

在每次webpack打包之后，自动产生一个一个markdown文件清单，记录打包之后的文件夹dist里所有的文件的一些信息。

思路：
```
  1. 通过 compiler.hooks.emit.tapAsync() 来触发生成资源到output目录之前的钩子。---- 监听emit事件，编译完成后，文件内容输出到硬盘上，触发该事件。
  2. 通过 Compilation.assets 获取文件数量。
  3. 定义 markdown 文件的内容，将文件信息写入到 markdown 文件内。
  4. 给dist文件夹里添加一个资源名称为 fileListName 的变量。
  5. 写入资源的内容和文件大小。
  6. 执行回调，让webpack继续执行。
```
  我们在 src/plugins/ 目录下新建 fileListPlugin.js 文件, 插件代码如下：
```
class FileListPlugin { 
  constructor(options) { 
    // 获取插件配置项
    this.filename = options && options.filename ? options.filename : 'FILELIST.md';
  }
  apply(compiler) { 
    // 监听emit事件，编译完成后，文件内容输出到硬盘上，触发该事件
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => { 

      // 通过 compilation.assets 获取文件数量
      let len = Object.keys(compilation.assets).length;

      // 添加统计信息
      let content = `# ${len} file${len > 1 ? 's' : ''} emitted by webpack \n\n`;

      // 通过 compilation.assets 获取文件名列表
      for (let filename in compilation.assets) { 
        content += `- ${filename}\n`;
      }

      // 往 compilation.assets 中添加清单文件
      compilation.assets[this.filename] = {
        // 写入写文件的内容
        source: function () { 
          return content;
        },
        // 新文件大小(给webpack输出展示使用)
        size: function () { 
          return content.length;
        }
      }
      // 执行回调，让webpack继续执行
      cb();
    })
  }
}

module.exports = FileListPlugin;
```
  然后在 webpack.config.js 中引入文件和插件，如下配置代码：
```
..... 省略更多代码

const FileListPlugin = require('./src/plugins/fileListPlugin'); // 引入插件

module.exports = {
  plugins: [
    //....
    new FileListPlugin({
      filename: '_filelist.md'
    })
  ]
}
```
  然后我们再进行打包，会在 dist 目录下 生成 _filelist.md 文件， 打开该文件有如下内容：
```
# 2 files emitted by webpack 

- index.js
- index.html
```
  我们可以截图如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/pluginImage/3.png" />

#### 2）去除注释

开发一个插件能够去除打包后的代码注释。

实现思路：

1. 通过 compiler.hooks.emit.tapAsync() 来触发生成资源到output目录之前的钩子。---- 监听emit事件，编译完成后，文件内容输出到硬盘上，触发该事件。
2. 通过 compilation.assets 拿到生成后的文件，然后去遍历各个文件。
3. 通过 .source() 获取构建产物的文本， 然后使用正则去 replace 替换注释的代码。
4. 更新构建产物对象。
5. 执行回调，让webpack继续执行。

在 src/plugins 目录下新建 removeCommentPlugin.js 文件。添加如下代码：

class RemoveCommentPlugin { 
  constructor(options) { 
    this.options = options;
  }
  apply(compiler) { 
    // 去除注释正则
    const reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)|(\/\*\*\*\*\*\*\/)/g;
    
    compiler.hooks.emit.tapAsync('RemoveComment', (compilation, cb) => { 
      // 遍历构建产物， .assets 中包含构建产物的文件名
      Object.keys(compilation.assets).forEach(item => { 
        // .source() 是获取构建产物的文本
        let content = compilation.assets[item].source();
        content = content.replace(reg, function (word) { // 去除注释后的文本
          return /^\/{2,}/.test(word) || /^\/\*!/.test(word) || /^\/\*{3,}\//.test(word) ? "" : word;
        });
        // 更新构建产物对象
        compilation.assets[item] = {
          source: () => content,
          size: () => content.length
        }
      })
      // 执行回调，让webpack继续执行
      cb();
    })
  }
}

module.exports = RemoveCommentPlugin;

然后我们在 webpack.config.js 引入如下插件

//.... 其他代码

const RemoveCommentPlugin = require('./src/plugins/removeCommentPlugin');

module.exports = {
  plugins: [
    // ... 其他插件
    new RemoveCommentPlugin(),
  ]
}














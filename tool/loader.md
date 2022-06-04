
### webpack手写loader

- [x] [Loader本质是什么](#id1) <br/>
- [x] [什么是 Normal Loader 和 Pitching Loader](#id2) <br/>
- [x] [处理参数](#id3) <br/>
- [x] [四种loader](#id4) <br/>
- [x] [其他的API](#id5) <br/>
- [x] [实现一个简单的loader](#id6) <br/>

  webpack是一个模块化打包工具，它被广泛的应用在前端领域的项目中，webpack本身只能打包js文件/json文件，但是对于图片，css，字体等其他资源文件是不能打包的，但是为了让除了js/json其他模块支持打包，因此loader就出现了。

#### <div id="id1">1）Loader本质是什么？</div>

  Loader本质上是导出函数的Javascript模块。所导出的函数，可用于实现内容的转换。该函数支持以下3个参数：
```
/**
 * @param {string | Buffer} content 源文件的内容
 * @param {object} soruceMap soruceMap数据
 * @param {any} meta meta数据，可以是任何内容
 */
 function webpackLoader(content, soruceMap, meta) {
   // webpack loader 代码
 }
 module.exports = webpackLoader;

 了解到上面的导出函数之后，我们可以定义一个简单的 simpleLoader; 如下代码：

 function simpleLoader(content, sourceMap, meta) {
   console.log('--我是SimpleLiader---');
   return content;
 }
 module.exports = simpleLoader;
```
  如上 simpleLoader 并没有对输出的content做任何处理，只是打印的一些信息。

 #### <div id="id2">2）什么是 Normal Loader 和 Pitching Loader ?</div>

 #### Normal Loader

   Loader 模块中导出的函数(ES6模块)叫做 Normal Loader。在webpack中，loader可以被分为4类：pre 前置, post 后置，normal普通 和 inline 行内。
   其中 pre 和 post loader，可以通过 rule 对象的 enforce 属性来指定。

   我们来手写一个 Normal Loader ，我们先来搭建一个环境，创建一个项目的目录；
```
 mkdir webpack-loader-demo
```
   进入该目录，使用 npm init -y 命令执行初始化操作。执行完成后，会在项目的根目录下生成一个 package.json 文件。

   然后我们安装webpack 和 webpack-cli 依赖包；安装命令如下：
```
 npm install webpack webpack-cli -D
```
  现在package.json 内容如下：
```
 {
  "name": "webpack-loader-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2"
  }
}
```
  安装完后，我们会搭建一个如下目录结构来添加对应的目录和文件：
```
|---dist # 打包输出的目录
| |--- index.html
|---loaders 
| |--- a-loader.js
| |--- b-loader.js
| |--- c-loader.js
|--- node_modules
|--- package.json
|--- src
| |--- data.txt  # 数据文件
| |--- index.js  # 入口文件
|--- webpack.config.js
```
  dist/index.html
```
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webpack Loader 示例</title>
</head>
<body>
    <h3>Webpack Loader 示例</h3>
    <p id="message"></p>
    <script src="./bundle.js"></script>
</body>
</html>
```
  src/index.js 代码如下：
```
import Data from "./data.txt"

const msgElement = document.querySelector("#message");
msgElement.innerText = Data;
```
  src/data.txt 内容如下：
```
大家好，我是空智
```
#### 注意：这里的内容就在第一行，不要换行，否则打包的时候会报错。如<a href="https://one-more-tech.gitlab.io/%E8%A7%A3%E5%86%B3-Syntax-Error--Unterminated-string-constant-%E9%94%99%E8%AF%AF/index/">解决-Syntax-Error--Unterminated-string-constant-错误</a> 

  loaders/a-loader.js 代码如下：
```
function aLoader(content, sourceMap, meta) { 
  console.log("--开始执行aLoader Normal Loader---");
  content += "aLoader]";
  return `module.exports = '${content}'`;
}

module.exports = aLoader;
```
  在aLoader函数中，我们会对 content 内容进行修改，然后我们返回 module.exports = '${content}' 字符串。为什么要把 content 赋值给 module.exports 属性呢？等执行完成代码后，我们可以来分析下；

  loaders/b-loader.js 代码如下：
```
function bLoader(content, sourceMap, meta) { 
  console.log("---开始执行bLoader Normal Loader---");
  return content + "bLoader->";
}

module.exports = bLoader;
```
  loaders/c-loader.js 代码如下：
```
function cLoader(content, sourceMap, meta) { 
  console.log('---开始执行cLoader Normal Loader---');
  return content + '[cLoader-->';
}

module.exports = cLoader;
```

  如上在loaders目录下，我们定义了3个Normal Loader, 为了让 webpack 能够识别 loaders 目录下的自定义 Loader， 我们还需要在 webpack 的配置文件中， 设置resolveLoader 属性，webpack.config.js 配置代码如下：
```
const path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: ["a-loader", "b-loader", "c-loader"],
      }
    ]
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, "loaders"),
      path.resolve(__dirname, "node_modules"),
    ]
  }
};
```
  如上配置，webpack会先去loaders文件夹下找loader，如果没有找到的话，会去node_modules查找，因此我们编写的loader尽量不要和第三方loader重名。否则会导致第三方loader被覆盖加载。
  如上配置完成后，在我们项目的根目录下运行 npx webpack 命令就可以开始打包了。那么控制台输出的结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/loaderImage/1.png" />

  观察以上的输出结果，我们知道 Normal Loader 的执行顺序是从右到左(或从后到前)，先执行 c-loader，再执行 b-loader, 最后执行 a-loader 插件。当打包完成后，
  我们 在浏览器中 打开 dist/index.html， 会在页面上输出以下信息：
```
Webpack Loader 示例
大家好，我是空智[cLoader-->bLoader->aLoader]
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/loaderImage/2.png" />

  如上图可知：Loader 在执行的过程中是以管道的形式，对数据进行处理。

  对于 a-loader.js 中。为什么要把 content 赋值给 module.exports 属性呢？我们打开 dist/bundle.js 文件， 代码如下(把其他注释全部删除掉)：
```
(() => {
  var __webpack_modules__ = ({
    "./src/data.txt":
    ((module) => {
      eval("module.exports = '大家好，我是空智[cLoader-->bLoader->aLoader]'\n\n//# sourceURL=webpack://webpack-loader-demo/./src/data.txt?");
    }),
    "./src/index.js":
    ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        "use strict";
        eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _data_txt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data.txt */ \"./src/data.txt\");\n/* harmony import */ var _data_txt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_data_txt__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst msgElement = document.querySelector(\"#message\");\nmsgElement.innerText = (_data_txt__WEBPACK_IMPORTED_MODULE_0___default());\n\n//# sourceURL=webpack://webpack-loader-demo/./src/index.js?");
      })
    });
  var __webpack_module_cache__ = {};
  
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = __webpack_module_cache__[moduleId] = {
  	  exports: {}
    };
  	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
      return module.exports;
  }
  (() => {
  	__webpack_require__.n = (module) => {
      var getter = module && module.__esModule ?
      () => (module['default']) :
      () => (module);
      __webpack_require__.d(getter, { a: getter });
        return getter;
    };
  })();
  (() => {
  	__webpack_require__.d = (exports, definition) => {
    for(var key in definition) {
    if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  }
};
})();
  (() => {
  	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  })();
  (() => {
    __webpack_require__.r = (exports) => {
      if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
  })();
  var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
```
  在生成的 bundle.js文件中，./src/index.js 对应函数内部，会通过调用 __webpack_require__ 函数来导入 ./src/data.txt 路径中的内容，在 __webpack_require__ 函数内部会优先从缓存对象中获取 moduleId对应的模块，假如该模块已经存在的话，就会返回该模块对象上 exports 属性的值，如果缓存对象中不存在 moduleId 对应的模块，则会创建一个 包含 exports 属性的module对象。然后会根据 moduleId 从 __webpack_modules__ 对象中，获取对应的函数并使用相对应的参数进行调用。最终返回 module.exports 的值。

  因此我们在 a-loader.js 文件中，把content赋值给 module.exports 属性的目的就是为了导出相应的内容。

#### Pitching Loader

  Pitching Loader 是什么？

  在开发Loader时，我们可以在导出的函数添加一个pitch属性，它的值也是一个函数，那么该函数就被称为 Pitching Loader. 它支持以下3个参数：
```
/**
* @remainingRequest 剩余请求
* @precedingRequest 前置请求
* @data 数据对象
*/
function (remainingRequest, precedingRequest, data) {
  // ....
}
```
  remainingRequest: loader 链中排在自己后面的loader以及资源文件的绝对路径以！作为连接符组成的字符串。<br />
  precedingRequest：loader 链中排在自己前面的loader的绝对路径以！作为连接符组成的字符串。<br />
  data: 每个loader中存放上下文中的固定字段，可用于pitch给loader 传递的数据。<br />

  第三个参数data，可以用于数据传递，即在pitch函数中往data对象上添加数据，之后在 normal 函数中可以通过 this.data 的方式可以读取该data中的数据。
  比如如下代码：
```
module.exports = function(content) {
  // 执行某些操作
  return someSyncOperation(content, this.data.value); // 这里的 this.data.value = 42;
}

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.value = 42;
}
```
  remainingRequest 和 precedingRequest 的作用是干什么的呢？

  我们继续修改下 loaders/a-loader.js 代码如下：
```
function aLoader(content, sourceMap, meta) { 
  console.log("--开始执行aLoader Normal Loader---");
  content += "aLoader]";
  return `module.exports = '${content}'`;
}

aLoader.pitch = function (remainingRequest, precedingRequest, data) { 
  console.log('---开始执行aLoader Pitching Loader---');
  console.log(remainingRequest, precedingRequest, data);
}

module.exports = aLoader;
```
  在上面代码中，我们为 aLoader 函数增加了一个 pitch 属性并设置了它的值为一个函数对象。在函数体中，我们输出了该函数所接收的参数。

  loaders/b-loader.js 代码如下：
```
function bLoader(content, sourceMap, meta) { 
  console.log("---开始执行bLoader Normal Loader---");
  return content + "bLoader->";
}

bLoader.pitch = function (remainingRequest, precedingRequest, data) { 
  console.log('---开始执行bLoader Pitching Loader---');
  console.log(remainingRequest, precedingRequest, data);
}
module.exports = bLoader;
```
  loaders/c-loader.js 代码如下：
```
function cLoader(content, sourceMap, meta) { 
  console.log('---开始执行cLoader Normal Loader---');
  return content + '[cLoader-->';
}

cLoader.pitch = function (remainingRequest, precedingRequest, data) { 
  console.log('---开始执行cLoader Pitching Loader---');
  console.log(remainingRequest, precedingRequest, data);
}
module.exports = cLoader;
```
  编写完成上面代码后，我们在项目的根目录下再次执行 npx webpack 命令后，就会输出如下信息：
```
---开始执行aLoader Pitching Loader---

---开始执行bLoader Pitching Loader---

---开始执行cLoader Pitching Loader---

---开始执行cLoader Normal Loader---
---开始执行bLoader Normal Loader---
--开始执行aLoader Normal Loader---
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/loaderImage/3.png" />

  如上图我们可以看到，Pitching Loader 的执行顺序是 从左到右， 而 Normal Loader 的执行顺序是 从右到左。
  Pitching Loader 可以提前运行之外，还有就是当某个 Pitching Loader 返回非 undefined 值时，就会出现熔断效果。先更新下 bLoader.pitch 方法。让它返回"bLoader Pitching Loader->" 字符串：

  loaders/b-loader.js 代码如下：
```
function bLoader(content, sourceMap, meta) { 
  console.log("---开始执行bLoader Normal Loader---");
  return content + "bLoader->";
}

bLoader.pitch = function (remainingRequest, precedingRequest, data) { 
  console.log('---开始执行bLoader Pitching Loader---');
  return "bLoader Pitching Loader->";
}
module.exports = bLoader;
```
  再次执行 npx webpack 后，执行结果如下：
```
---开始执行aLoader Pitching Loader---
---开始执行bLoader Pitching Loader---
--开始执行aLoader Normal Loader---
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/loaderImage/4.png" />

  由以上输出结果可知：当 bLoader.pitch 方法返回非 undefined 值时，跳过了剩下的Loader。

  我们可以打开 dist/index.html 代码，可以看到如下：
```
Webpack Loader 示例
bLoader Pitching Loader->aLoader]
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/loaderImage/5.png" />

<a href="https://github.com/kongzhi0707/webpack-loader-demo/tree/main/pitchingLoader"> 请看github代码 --- demo </a>

#### <div id="id3">三）处理参数</div>

  我们在配置loader时，经常会给loader传递参数进行配置，一般是通过options属性来传递的，也有其他传递参数方式，比如像 url-loader 通过字符串来传递参数：
```
{
  test: /\.(jpg|png|gif|bmp|jpeg)$/,
  ues: 'url-loader?limt=1024&name=[hash:8].[ext]'
}
```
  webpack 也提供了 query 属性来获取传参，但是 query 属性很不稳定，比如像上面的通过字符串来传参，query就返回字符串格式，通过options方式就会返回对象格式，因此不方便我们处理参数，因此我们可以借助一个官方的包 loader-utils 帮助我们处理，它还提供了很多有用的工具。
代码演示如下：
```
const {
  getOptions,
  parseQuery,
  stringifyRequest,
} = require('loader-utils');

module.exports = function(source, map) {
  // 获取options参数
  const options = getOptions(this);

  // 解析字符串为对象
  parseQuery("?param1=foo")

  // 将绝对路由转换成相对路径
  // 以便能在require或者import中使用以避免绝对路径
  stringifyRequest(this, "test/lib/index.js")

}
```
  我们常用的就是 getOptions 将处理后的参数返回出来，它内部的实现逻辑非常简单，也是根据query属性进行处理的，如果是字符串的话调用 parseQuery方式进行解析，源码如下：
```
//loader-utils/lib/getOptions.js
'use strict';
const parseQuery = require('./parseQuery');
function getOptions(loaderContext) {
  const query = loaderContext.query;
  if (typeof query === 'string' && query !== '') {
    return parseQuery(loaderContext.query);
  }
  if (!query || typeof query !== 'object') {
    return {};
  }
  return query;
}
module.exports = getOptions;
```
#### <div id="id4">四）四种loader</div>

  我们基本可以把常见的loader分为四种：
```
1）同步loader
2）异步loader
3）"Raw" Loader
4) Pitching loader （上面已经讲过）
```
#### 1）同步loader

  一般的loader转换都是同步的。比如下面代码，我们可以直接通过return的结果方式，返回我们的处理结果：
```
module.exports = function(content, soruceMap, meta) {
  // 对 content 的一些处理操作
  const res = doto(content);
  return res;
}
```
  我们也可以直接使用 this.callback() 这个api，然后直接 return undefined 的方式告诉 webpack 去 this.callback() 寻找他要的结果，该API接收如下这些参数：
```
this.callback(
  err: Error | null, // 一个无法正常编译时的 Error 或者 直接给个 null
  content: string | Buffer, // 我们处理后返回的内容，可以是 string 或者 Buffer()
  sourceMap?: SourceMap, // 可选，可以是一个被正常解析的 source map
  meta?: any, // 可选，可以是任何东西，比如一个AST语法树
);
```
  因此我们的同步代码 使用 this.callback() 方法 可以编写成如下：
```
module.exports = function(content, soruceMap, meta) {
  // 获取到用户传递给当前 loader 的参数
  const options = this.getOptions();
  
  // 下面是一些同步的操作代码
  const res = someSyncOperation(content, options);

  // 使用this.callback 处理
  this.callback(null, res, soruceMap);
  // 返回 undefined
  return; 
};
```
#### 2）异步loader

  异步loader主要是使用 this.async() 来告知webpack这次构建操作是异步的。 如下代码：
```
module.exports = function(content, soruceMap, meta) {
  const callback = this.async();
  // 某些操作
  someAsyncOperation(content, function(err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result, soruceMap, meta);
  });
}
```
#### 3) Raw Loader

  默认情况下，资源文件会被转换为 utf-8 字符串，然后传递给 loader， 但是如果我们设置 raw 为 true的话，loader 可以接收原始的 Buffer。每一个loader 都可以使用String或Buffer的形式传递它的处理结果。compiler 将会把它们在loader之间相互转换。我们的 file-loader 就是使用的这个。总之 我们只需要在 module.exports.raw = true; 即可，传给我们的内容就是 Buffer 了。 如下代码：
```
module.exports = function(content, soruceMap, meta) {
  console.log(content instanceof Buffer); // true

  // 执行某些操作
  return doSomeOperaction(content);
}

module.exports.raw = true;
```
#### <div id="id5">五）其他的API</div>
```
this.addDependency: 加入一个文件进行监听，一旦文件产生变化就会重新调用这个loader进行处理。
this.cacheable: 默认情况下loader的处理结果会有缓存效果，给这个方法传入false可以关闭这个效果。
this.clearDependencies: 清除loader的所有依赖。
this.context: 文件所在的目录(不包含文件名)
this.data: pitch阶段和正常调用阶段共享的对象。
this.getOptions(schema)：用来获取配置的 loader 参数选项
this.resolve：像 require 表达式一样解析一个 request。resolve(context: string, request: string, callback: function(err, result: string))。
this.loaders：所有 loader 组成的数组。它在 pitch 阶段的时候是可以写入的。
this.resource：获取当前请求路径，包含参数：'/abc/resource.js?rrr'
this.resourcePath：不包含参数的路径：'/abc/resource.js'
this.sourceMap：bool 类型，是否应该生成一个 sourceMap。
```

#### <div id="id6">六）实现一个简单的loader</div>

  简介：我们实现的loader功能是：在编译出的代码中加上 /** 公司@年份 */ 格式的注释和简单做一下去除代码中的 console.log. 

  我们在上面的loaders文件夹下 新建 company-loader.js ， 代码如下：

  loaders/company-loader.js 
```
module.exports = function (source, sourceMap, meta) { 
  // 获取 webpack 配置中传来的 option 参数
  const options = this.getOptions();
  console.log('----options----', options); // 打印 ----options---- { sign: 'we-doctor@2021' }
  this.callback(null, addSign(source, options.sign));
}

function addSign(content, sign) {
  return  `/** ${sign} */\n${content}`
}
```
  loaders/console-loader.js 
```
module.exports = function (source, sourceMap, meta) { 
  return handleConsole(source);
}

function handleConsole(source) { 
  return source.replace(/console.log\(['|"](.*?)['|"]\)/, '');
}
```
webpack.config.js 文件配置如下：
```
const path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: ["a-loader", "b-loader", "c-loader"],
      },
      {
        test: /\.js$/,
        use: [
          'console-loader',
          {
            loader: 'company-loader',
            options: {
              sign: 'we-doctor@2021',
            },
          },
        ],
      },
    ]
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, "loaders"),
      path.resolve(__dirname, "node_modules"),
    ]
  }
};
```
  在项目的根目录下执行 npx webpack 命令后，在dist文件下bundle.js代码中搜索注释： /** we-doctor@2021 */ 就可以搜索的到了;









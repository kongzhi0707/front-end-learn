
### 理解JS模块化的各种规范 commonJS/AMD/CMD/UMD/ESM

很早的web应用开发非常简单，我们可以直接去加载js，但是随着需求越来越多，应用就会越来越大，因此我们需要模块化去管理项目中的js和css及图片资源文件。后续就有了 commonJS/AMD/CMD/UMD等规范，模块化为我们提供了更好的方式来组织和维护函数中的变量。在nodeJS中，我们使用的commonJS规范，但是该规范不支持浏览器端，因此类似webpack等一些打包工具应运而生。此时，javascript官方的标准化系统ESM也完成了。

#### 为何要模块化？

比如如下javascript代码：
```
var a = 1;
var b = a + 1;
var c = a + b;
```
如上代码，定义变量a的值为1，然后定义变量 b = a + 1; 最后 将 a,b 变量组合在一起并将他们放入变量c中。如果代码中有很少的变量的话，那么代码组织非常简单的，但是如果有很多变量的话，我们会通过函数作用域去组织变量。也就是局部作用域，但是局部作用域有个缺点，它不能访问其他函数中的变量，因此有时候为了满足需求，我们可能会把需要的变量放入全局变量中，这样其他的任何一个函数都可以访问到该全局变量，但是全局变量越来越多的话，有一个很大的缺点，很容易改变全局作用域的值，比如很早之前我们引用JQuery, 在我们需要使用JQuery插件之前，我们必须将jQuery资源放在全局作用域中。且使用script引入时必须保证jquery资源文件在最顶端，如果排列顺序错了，那么js使用jquery的时候会报错。并且停止执行代码。因此代码为了保证顺序，使得代码维护可能会变得更加困难，比如页面上有多个js文件，a.js文件需要依赖b.js文件，因此 b.js文件需要在a.js文件前面被加载完。这样就会变得维护越来越困难。因此这个时候模块化应运而生，模块化就是来解决这个问题的。

#### 模块化的作用

模块化为我们提供了一种更好的方式来组织变量和函数，我们可以把变量和函数放在一个模块中，也就是模块作用域，模块作用域可以提供一种暴露变量或函数的钩子给其他模块使用，模块可以明确指定那些变量，类或函数对外暴露。对外暴露的过程叫做导出，一旦导出，其他模块就可以明确声称他们依赖这些导出的变量/类/函数。

有模块间的导出和导入变量的能力后，我们可以把代码分割成更小的，可以独立运行的代码块，基于这些代码块，我们就可以像搭建乐高积木一样，创建所有不同类型的应用。

#### 理解commonJS规范

CommonJS运行在服务器端，nodejs中使用CommonJS规范的，该规范指出，一个单独的文件就是一个模块，其内部定义的变量属于该模块，不会对外暴露，也就是说不会污染全局变量，它有四个重要的环境变量为模块化的实现提供支持： module/exports/require/global.

CommonJS核心思想：通过require方法来同步加载所要依赖的其他模块，然后通过 exports 或 module.exports 来导出需要暴露的接口。

优点：CommonJS规范在服务器端实现了javascript的模块化，解决了依赖，全局变量污染的问题。
缺点：CommonJS是同步加载模块的，在服务器端，文件是保存到硬盘上的，因此同步加载是没有问题，但是对于浏览器端，需要将文件从服务器端请求过来，是异步的，
因此CommonJS不适用于浏览器端。

代码实列如下：
```
// 定义模块 math.js
var num = 0;
function add (a, b) {
  return a + b;
}

// 需要向外暴露的函数/变量
module.exports = {
  add: add,
  num: num
};

// 引入上面的 math.js 模块
var math = require('./math');
math.add(1, 2); // 调用方法
```
#### 理解AMD规范 （规范代表库 require.js）

AMD 是 "Asynchronous Module Definition" 缩写，含义是："异步模块定义"。 它采用异步方式加载模块的，模块加载不影响它后面代码的执行，所有依赖该模块的
语句，都定义在一个回调函数中，等到加载完成后，这个回调函数才会被执行。

模块功能主要的几个命令：define、require、return和define.amd。define是全局函数，用来定义模块,define(id?, dependencies?, factory)。require命令用于输入其他模块提供的功能，return命令用于规范模块的对外接口，define.amd属性是一个对象，此属性的存在来表明函数遵循AMD规范。

优点：适合在浏览器环境中异步加载模块。可以并行加载多个模块。
缺点：提高了开发成本，并且不能按需加载，而是必须提前加载所有的依赖。

代码实例如下：
```
/** 网页中引入require.js及main.js **/
<script src="js/require.js" data-main="js/main"></script>
/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 执行基本操作
require(["jquery","underscore"],function($,_){
  // some code here
});
```
#### 理解CMD规范 (规范代表库 sea.js)

SeaJS 是一个Javascript模块加载框架，可以实现Javscript的模块化开发及加载机制，CMD 和 AMD 类似，不同点在与，AMD推崇依赖前置，提前执行，CMD推崇依赖就近，延迟执行。也就是说 CMD通过按需加载的方式，而不是必须在模块开始就加载所有的依赖。

优点：同样实现了浏览器的模块化加载，可以按需加载，依赖就近原则。
缺点：依赖SPM打包，模块加载逻辑偏重。

代码实例：
```
define(function(require, exports, module) {
  var a = require('./a'); //在需要时申明
  a.doSomething();
  if (false) {
    var b = require('./b');
    b.doSomething();
  }
});
    
/** sea.js **/
// 定义模块 math.js
define(function(require, exports, module) {
  var $ = require('jquery.js');
  var add = function(a,b){
    return a+b;
  }
  exports.add = add;
});
    
// 加载模块
seajs.use(['math.js'], function(math){
  var sum = math.add(1+2);
});
```
#### 理解UMD规范

UMD规范只是一种通用的写法，是在AMD和CommonJS两个流行而不统一的规范情况下，才催生出umd来统一规范的，UMD前后端均可用。

代码实例：
```
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'underscore'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS之类的
    module.exports = factory(require('jquery'), require('underscore'));
  } else {
    // 浏览器全局变量(root 即 window)
    root.returnExports = factory(root.jQuery, root._);
  }
}(this, function ($, _) {
  // 属性
  var PI = Math.PI;     
  // 方法
  function a() { };                   // 私有方法，因为它没被返回
  function b() { return a() };        // 公共方法，因为被返回了
  function c(x, y) { return x + y };  // 公共方法，因为被返回了
  
   // 暴露公共方法
   return {
     ip: PI,
     b: b,
     c: c
   }
}));
```
#### 理解ESM规范

ESM是ES6提出的标准模块系统，ECMAScript Modules。

暂时先这样～  后面再来理解。


















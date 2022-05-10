
### Babel中plugin,preset的区别和使用

#### 一：Babel Plugin 介绍

  Babel 是代码的转换器，比如我们将 ES6 代码转换成 ES5代码。或者将JSX转换成JS等。因此我们有了Babel，我们可以使用最新的JS特性。
  实现Babel代码转换功能的核心，是Babel的插件plugin。

#### Babel Plugin 列子

下面我们来使用ES6中的两个新特性，箭头函数等，如果我们不使用babel转换的话，那么在浏览器下代码就会报错。因此我们可以借助插件将代码转换成ES5.

```
$ mkdir test-babel 
$ cd test-babel
$ yarn init
```

在 test-babel 文件夹下新建 src 文件夹， 在该文件夹下 新建 index.js。

在 src/index.js 添加如下代码：

```
// 箭头函数
[1, 2, 3].map(n => n + 1);

// 模版字面量
let nick = '我是空智';
let desc = `hello ${nick}`;
```
下面我们需要安装babel。如下命令
```
$ npm install --save-dev @babel/core @babel/cli babel-plugin-transform-es2015-arrow-functions @babel/plugin-transform-literals
```

babel-plugin-transform-template-literals 插件请看官网 <a href="https://babeljs.io/docs/en/babel-plugin-transform-template-literals">https://babeljs.io/docs/en/babel-plugin-transform-template-literals</a>

目录结构如下：
```
|--- test-babel
| |--- src
| | |--- index.js
| |--- package.json
| |--- node_modules
| |--- .babelrc
```
在 .babelrc 文件添加如下配置文件：
```
{
  "plugins": [
    "transform-es2015-arrow-functions",
    "@babel/plugin-transform-literals"
  ]
}
```
在package.json 中添加打包命令如下：
```
"scripts": {
  "compiler": "babel src --out-dir lib --watch"
}
```
当我们运行命令： npm run compiler 后， 在项目的根目录会生成 lib/index.js 文件，内容如下：
```
// 箭头函数
[1, 2, 3].map(function (n) {
  return n + 1;
}); // 模版字面量

let nick = '我是空智';
let desc = `hello ${nick}`;
```
#### Babel Preset 介绍

  Babel插件一般尽可能拆成小的插件，开发者可以按需引入，比如我们对ES6转ES5的功能，Babel官方拆成了20+个插件。这样的优点是：提高了性能和扩展性。比如我们开发想体验ES6的箭头函数特性，我们只需要引入 transform-es2015-arrow-functions插件就可以，而不是加载ES6所有的插件。

  但是在很多时候，一个个插件引入效率会比较低下，比如我们在项目开发中，开发者想要将所有的ES6的代码转换成ES5，我们一个个插件分别引入的话会很烦的。并且很容易出错。因此我们这个时候 就可以使用 Babel Preset.

  我们可以把 Babel Preset 是 Babel Plugin的集合。比如 babel-preset-env 就包含了所有跟ES6转换的有关插件。

#### Babel Preset 列子

  还是上面的代码，我们把之前安装的 npm包 和 node_modules 都删除掉。然后我们这次使用 babel-preset-env 来进行转换操作。

  安装依赖：
```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```
  然后 .babelrc 配置文件改成如下：
```
{
  "presets": [ "@babel/preset-env" ]
}
```
  在项目的根目录下 运行 npm run compiler 命令后， 在lib/index.js 文件下生成如下代码：
```
"use strict";

// 箭头函数
[1, 2, 3].map(function (n) {
  return n + 1;
}); // 模版字面量

var nick = '我是空智';
var desc = "hello ".concat(nick);
```

#### Plugin 和 Preset 执行顺序

可以同时使用多个 Plugin 和 Preset，理解他们的执行顺序非常重要。

  执行顺序总结如下：
```
  1）先执行完所有的Plugin, 再执行 Preset.
  2) 多个Plugin，按照声明顺序来执行。
  3） 多个Preset，按照声明的倒序来执行。
```

  比如 在 .babelrc 配置有如下：

  1）Plugin：transform-react-jsx、transform-async-to-generator
  2）Preset：es2016、es2015

  .babelrc 配置如下：
```
{
  "plugins": [ 
    "transform-react-jsx",
    "transform-async-to-generator"
  ],
  "presets": [ 
    "es2015",
    "es2016"    
  ]
}
```
  那么上面的执行顺序就是 先执行 transform-react-jsx 插件，再执行 transform-async-to-generator 插件。 然后执行 presets 中的插件，倒序执行，也就是说先执行 es2016, 再执行 es2015.











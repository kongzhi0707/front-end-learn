### Rollup 打包 js 库

#### 一）什么是 rollup ？

rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码。比如 vue 源码打包。

#### 二）为什么使用 rollup，不使用 webpack ？

rollup 的优点是 ES6 模块和代码 Tree-shaking, 当然 webpack 也是支持的，webpack 还支持模块热替换，代码分割，静态资源导入等更多功能。
如果我们开发的是应用，我们肯定选择的是 webpack，但是假如我项目中只需要打包出一个简单的 bundle 包。并且是基于 ES6 模块开发的。我们可以考虑使用 rollup .

rollup 相比 webpack，它更少的功能和更简单的 api，因此我们打包类库是选择它的原因。

#### 三）支持打包的文件格式

rollup 支持的打包文件的格式有 amd, cjs, es/esm, iife, umd ， 其中 amd 为 AMD 标准，cjs 为 CommonJS 标准，esm/es 为 ES 模块标准，iife 为立即调用函数。 umd 同时支持 amd，cjs 和 iife.

#### 四）理解 package.json 文件各个字段的含义

```
1）name: 包的名称，必须是唯一的。由小写英文字母，数字和下划线组成，不能包含空格。
2）version：符合语义化版本识别规范的版本字符串。主版本号更改的条件是：当我们做了不兼容的API修改时，子版本号更改的条件是：当我们做了向下兼容的功能新增操作时，修订号更改的条件是：当我们做了向下兼容的问题修正。
3）description: 包的简要说明
4）main：指定包的入口文件，若没有指定，默认找 index.js 文件，若包中没有 index.js 文件，也没有指定 main，就会报错。
5）scripts：保存一些常用的指令，通过 npm run [key] 的方式运行指令。
6）keywords: 关键字数组，通常用于搜索。
7）author：作者
8）license: 许可证数组，每个元素要包含type(许可证名称) 和 url(链接到许可证文本的-地址)字段。也称为开源协议。
9）devDependencies: 开发环境包的依赖，一个关联数组，由包的名称和版本号组成。
```

```
{
  "name": "@xxx/package",    // 包名，必填项 @xxx 是代表范围的
  "version": "1.0.0",        // 发布的版本，必填项
  "description": "xxxx",     // 项目的描述信息，description 是字符串，方便用户在npm上搜索到我们的项目
  "private": true,           // 包私有，无法发布到 npm
  "keywords": [              // 包的关键字，用于npm搜索
    "xxx",
    "yyy"
  ],
  "homepage": "github.com.xxx", // homepage 项目的主页地址
  "bugs": {                     // 项目问题反馈的url或报告问题的邮箱地址
    "email": "",
    "url": ""
  },
  "license": "MIT",            // 许可证
  "author": {                  // 作者信息
    "name": "",
    "url": "",
    "email": ""
  },
  "contributors": [           // 贡献者信息
    {
      "name": "",
      "email": "",
      "url": ""
    }
  ],
  "files": [   // 下载依赖包所包含的文件，指定这个包被install时候有哪些文件，或者说，发布package时，具体哪些文件会发布上去
    "es",
    "lib"
  ],
  "main": "lib/index.js", // 主文件，项目的入口文件，默认值是项目的根目录下的 index.js
  "module": "", // es6 环境下的入口文件
  "resolutions": {}, // 确保所有的 package 具有相同的版本
  "repository": {    // 仓库地址
    "type": "git",
    "url": "http://xxx"
  },
  "dependencies": {}, // 生产环境的包
  "devDependencies": {}, // 开发环境的包
  "scripts": {},  // 保存命令行脚本
  "typings": "lib/index.d.ts", // Typescript的入口文件
}
```

#### 五）rollup 打包

1）新建项目目录文件：

```
mkdir test_rollup
```

2. 初始化项目工程，对包进行管理:

```
npm init -y
```

3. 在项目中安装 rollup,

```
npm install --save-dev rollup
```

4. 创建 rollup 配置文件

在项目根目录下新建文件，rollup.config.js，并添加如下代码：

```
import { defineConfig } from "rollup";
import pkg from './package.json' assert { type: "json" }; // 断言导出json模块

export default defineConfig([
  {
    input: "src/index.js", // 入口文件
    output: [
      {
        file: pkg.main, // 出口文件
        format: "cjs", // 打包成 commonjs模块
      },
      {
        file: pkg.module, // 出口文件
        format: "es", // 打包成 es module 模块
      },
      {
        name: "myUtils", // 打包成UMD模式，需提供name
        file: pkg.browser, // 出口文件
        format: "umd", // 打包成UMD模块
      }
    ]
  }
]);
```

5. 修改 package.json，文件代码如下：

```
{
  "name": "test_rollup",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "browser": "dist/index.umd.js",
  "scripts": {
    "build": "rollup -c",
    "serve": "rollup -c -w"
  },
  "type": "module",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "rollup": "^4.1.0"
  }
}
```

-c: 代表读取配置去打包，默认读取根目录下的 rollup.config.mjs
-w: 代表了 watch 监听，调试的时候可以使用。

如上配置文件，如果没有配置 type: "module" 时，会报错：[!] SyntaxError: Cannot use import statement outside a module, 报错原因是不能在模块外使用 import 语句。在 Node.js 环境中默认使用的是 CommonJS 规范。需要使用 require 语句进行导入。import 是 ES6 中的模块化写法，CommonJS 模块与 ES6 模块不兼容。因此我们要加上 type: "module", 配置代码。

6. 新建需要打包的文件

在项目的根目录下新建文件夹 src，并且在 src 下新建 main.js 文件，作为打包的入口文件。

```
import foo from './foo.js';

export default function () {
  console.log('--foo--', foo);
}
```

src/foo.js 代码如下：

```
export default 'hello world';
```

7）运行 npm run build 进行打包，项目根目录下会生成 dist 文件夹。

dist/index.cjs.js 代码如下：

```
'use strict';

var foo = 'hello world';

function main () {
  console.log('--foo--', foo);
}

module.exports = main;
```

dist/index.es.js 代码如下：

```
var foo = 'hello world';

function main () {
  console.log('--foo--', foo);
}

export { main as default };
```

dist/index.umd.js 代码如下：

```
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.myUtils = factory());
})(this, (function () { 'use strict';

  var foo = 'hello world';

  function main () {
    console.log('--foo--', foo);
  }

  return main;

}));
```

#### 六）插件的使用

rollup 有丰富的插件，我们这里看看常用的插件使用方式。

#### 1）@rollup/plugin-json （处理 JSON 文件）

```
1）安装: npm install @rollup/plugin-json -D
```

2. 修改 src/main.js 文件

```
import { version } from '../package.json';

export default function () {
  console.log("version---" + version);
}
```

3. 在 rollup.config.mjs 文件加入 JSON plugin, 代码如下：

```
import { defineConfig } from "rollup";
import pkg from './package.json' assert { type: "json" }; // 断言导出json模块

import json from "@rollup/plugin-json";

export default defineConfig([
  {
    input: "src/main.js", // 入口文件
    output: [
      {
        file: pkg.main, // 出口文件
        format: "cjs", // 打包成 commonjs模块
      },
      {
        file: pkg.module, // 出口文件
        format: "es", // 打包成 es module 模块
      },
      {
        name: "myUtils", // 打包成UMD模式，需提供name
        file: pkg.browser, // 出口文件
        format: "umd", // 打包成UMD模块
      }
    ],
    plugins: [
      json(),
    ]
  }
])
```

4）运行 npm run build 命令后，dist/index.cjs.js 文件内容变成如下：

```
'use strict';

var version = "1.0.0";

function main () {
  console.log("version---" + version);
}

module.exports = main;
```

如上可以看到，JSON 文件已被成功处理了。

其他的插件也是类似的，这里不一一介绍。


### 深入了解babel 及编写babel插件

  Babel是javascript的编译器，我们平时编写的ES6，ES7的语法在低版本浏览器是不支持的，我们可以通过babel进行转换操作就可以在低版本浏览器中运行了。
在了解Babel过程中，我们首先要理解AST(抽象语法树)。

#### 一：AST(抽象语法树)

#### AST是什么？

  wiki上对抽象语法树的描述：AST(抽象语法树) 是对于源代码语法结构的一种抽象表示，它是用树状的形式编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

  我们知道javascript程序它是由一系列字符组成的，每个字符都有一些含义，但是计算机并不认识它，这些字符在内存中仅仅是个数值，因此为了让计算机能理解这些字符的含义，抽象语法树就诞生了。

  抽象语法树由两部分组成的，分词(将整个代码字符串分割成语法单元数组) 和 语义分析(在分词结果的基础之上分析语法单元之间的关系)。

#### 分词(也叫词法分析)

  词法分析(tokenizer) 会将原始代码按照特定字符(如let，var，=等保留字)分成一个个叫token的东西，token由分号，标签，字符串等组成。
  比如如下代码：const text = 'Hello World'; 可以使用 <a href="https://esprima.org/demo/parse.html?code=let%20str%20%3D%20%27test%27%3B%0Astr%20%2B%20%27abc%27%3B#">在线词法分析链接</a> 进行查看生成的tokens，如下样子：
```
[
  {
    "type": "Keyword",
    "value": "const"
  },
  {
    "type": "Identifier",
    "value": "text"
  },
  {
    "type": "Punctuator",
    "value": "="
  },
  {
    "type": "String",
    "value": "'Hello World'"
  },
  {
    "type": "Punctuator",
    "value": ";"
  }
];
```
  如下是javascript简单编译器中词法分析的实现：https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js#L381

#### 语法分析

  上面词法分析完毕后进入语法分析阶段，语法分析将tokens重新格式化为描述语法各部分及相互关系的表现形式。如下是一个javascript简易的实现，https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js#L555 

  有一个 <a href="https://astexplorer.net/">在线AST转换器</a>, 我们写出的任何代码，它会帮助我们转换成AST。

  如果我们什么都不写，AST默认有一个根节点；
```
{
  "type": "Program",
  "start": 0,
  "end": 0,
  "body": [],
  "sourceType": "module"
}
```
  然后我们在左侧写如下代码：
```
const text = 'Hello World';
```
  会自动帮我们转换成如下AST；
```
{
  "type": "Program",
  "start": 0,
  "end": 27,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 27,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 26,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 10,
            "name": "text"
          },
          "init": {
            "type": "Literal",
            "start": 13,
            "end": 26,
            "value": "Hello World",
            "raw": "'Hello World'"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```
  我们来理解下上面各个字段的含义；

#### Program

  一般将它作为根节点，即代表了一颗完整程序的代码树。如下代码：
```
interface Program <: Node {
  type: "Program";
  body: [ Statement ];
}
```
  body属性是一个数组，包含了多个Statement(语句)节点。
  其中 body 和 sourceType 是它的子节点。

  sourceType 可以是 "module" 或者 "script"，它表示应该用哪种模式来解析。 "module" 将会在严格模式下解析并且允许模块定义，"script" 则不会。

#### 注意： sourceType 的默认值是 "script" 并且在发现 import 或 export 时产生错误。 使用 scourceType: "module" 来避免这些错误。

#### VariableDeclaration
```
interface VariableDeclaration <: Declaration {
  type: "VariableDeclaration";
  declarations: [ VariableDeclarator ];
  kind: "var";
}
```
  kind 属性表示是什么类型声明，因为ES6 引入了 const/let。 declarations 它是一个数组，表示声明的多个描述，因为我们代码可以这样写：let a = 1, b = 2;

#### VariableDeclarator

  变量声明的描述，id表示变量名称节点，init表示初始值的表达式，可以为null。
```
interface VariableDeclarator <: Node {
  type: "VariableDeclarator";
  id: Pattern;
  init: Expression | null;
}
```
  name属性代表它的声明值，value表示值，raw表示原生代码。

  更多其他的抽象语法树节点类型含义，<a href="https://github.com/Pines-Cheng/blog/issues/53">请看这里</a>

#### 二：Babel是如何工作的？

  Babel的编译过程和大多数其他语言的编译器大致相同，可以分为三个阶段。
```
1）解析(PARSE): 将代码字符串解析成抽象语法树。
2）转换(TRANSFORM): 对抽象语法树进行转换操作。
3）生成(GENERATE): 根据变换后的抽象语法树再生成代码字符串。
```
  我们可以看如下流程图就可以很清晰了；

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/114.png" /> <br />

#### 2.1 babel解析成抽象语法树

  babel是javascript的编译器，babel使用的解析器是babylon。因此首先我们需要安装 babylon。
```
// 安装babylon
npm install --save babylon

// 测试代码如下：

import * as babylon from "babylon";
const code = `const text = 'Hello World';`;
const ast = babylon.parse(code);
console.log('-------ast------', ast);
```
  在浏览器中 打印的结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/43.jpg" />

#### 2.2 转换器 babel-traverse 

  对抽象语法树进行转换操作，Babel中使用 babel-traverse 来做的。因此我们需要安装该插件。
```
// 安装 
npm install --save babel-traverse

// 测试代码如下：

import * as babylon from "babylon";
import traverse from "babel-traverse";

const code = `const text = 'Hello World';`;
const ast = babylon.parse(code);
console.log('-------ast------', ast);

traverse(ast, {
  enter(path) {
    console.log('---path----', path);
  }
});
```
  打印结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/44.jpg" />

  traverse方法第一个参数是ast，第二个参数是一个对象，我们写了一个enter方法，方法的参数是path，打印的结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/45.jpg" />

  如上可以看到，我们的path被打印了5次，那是因为ast上有5个节点。如下可以看到：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/46.jpg" />

  traverse 方法是对树的深度遍历，它有两个方法，分别为 enter 和 exit，向下遍历树我们会进入entry每个节点，它是进入节点的回调函数，向上遍历回去时我们退出(exit)每个节点。它是离开节点的回调函数，对于AST来说，traverse遍历了2遍，我们可以选择进入还是退出的时候，来操纵节点。

  我们可以查看 node_modules/@babel/traverse/lib/visitors.js 中代码查看到有enter和exit对象的key。
```
if (typeof visitors === "object") {
  for (const visitorKey of Object.keys(visitors)) {
    if (visitorKey === "enter" || visitorKey === "exit") {
        validateVisitorMethods(`${nodeType}.${visitorKey}`, visitors[visitorKey]);
    } else {
        throw new Error("You passed `traverse()` a visitor object with the property " + `${nodeType} that has the invalid property ${visitorKey}`);
    }
  }
}
```
  我们在转换过程中，可以对代码进行操作拦截，我们后续可以在该过程中编写一个babel插件。

  我们可以对节点添加字段操作，如下代码：
```
// 实验代码
import * as babylon from "babylon";
import traverse from "babel-traverse";

const code = `const text = 'Hello World';`;
const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (path.node.type === "Identifier" && path.node.name === 'text') {
      path.node.name2 = 'xxxxxx哈哈';
    }
  }
});
console.log('-------ast------', ast);
```
  然后打印效果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/47.jpg" />

#### 2.3 生成器 babel-generator

  我们上面得到操作后的ast，我们使用Babel中的babel-generator来生成代码。因此我们需要安装该插件。
```
// 安装
npm install --save babel-generator

// 测试代码

import * as babylon from "babylon";
import traverse from "babel-traverse";
import generator from "babel-generator";

const code = `const text = 'Hello World';`;
const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (path.node.type === "Identifier" && path.node.name === 'text') {
      // 直接修改name字段
      path.node.name = 'xxxxxx哈哈';
    }
  }
});
const genCode = generator(ast);
console.log('----genCode----', genCode);
``` 
  打印效果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/48.jpg" />

#### 编写一个babel插件

#### 1）了解 babel-core

  babel-core 是Babel的核心包，里面存放着很多核心API，比如transform。
  transform：用于字符串转码得到AST。
```
// 安装
npm install babel-core -D

import babel from 'babel-core';
/*
 * @param {string} code 要转译的代码字符串
 * @param {object} options 可选，配置项
 * @return {object}
*/
babel.transform(code:String, options?: Object);

// 返回一个对象(主要包括三个部分)
{
  generated code, // 生成码
  sources map, // 源映射
  AST // 抽象语法树
}
```
#### 2）了解 babel-types

  Babel Types模块是一个用于AST节点的Lodash工具库，它包含了构造，验证以及变换AST节点的方法。相关的API，<a href="https://babeljs.io/docs/en/babel-types">请查看</a>, 该工具库包含很多工具方法，对编写处理AST逻辑非常有用。
```
npm install babel-types -D;

import traverse from "babel-traverse";

import * as t from "babel-types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```
#### 3）了解 Visitors(访问者)

  Babel大量使用了访问者模式，在遍历阶段，Babel将进行深度优先的搜索遍历，并访问AST中的每个节点，我们可以在Vistor中指定一个回调方法，这样在访问节点时，Babel将使用
当前访问的节点调用回调方法。

  比如如下代码：
```
export default function (babel) {
  const { types: t } = babel;
  return {
    visitor: {
      Identifier(path) {
        // 判断变量名为str
        if (path.isIdentifier({ name: "str" })) {
          path.node.name = "transformStr";
        }
      }
    }
  };
}
```
  Babel插件规则是允许我们暴露一个function，function内返回 visitor对象。

#### path

  path代表着在遍历AST的过程中链接两个节点的路径，我们可以通过 path.node 获取当前的节点，通过 path.parent.node 获取父节点。还提供了 path.replaceWith, path.remove等API方法。因此我们可以通过这些API获取对应的节点进行修改。

#### 编写一个简易的babel插件

#### 1）编写转换当前节点变量的名称

  比如我代码中的 const myPlugin = 'hello world'; 我想把该变量名称改成 xxx, 即代码改成：const xxx = 'hello world';

  在项目的根目录下有如下文件
```
|--- 项目名
| |--- my-plugin.js # 插件实现
| |--- before.js # 转化前代码
| |--- after.js # 转化后代码，自动生成该文件
| |--- index.js  # 程序入口
| |--- package.json
```
  进入对应的文件夹中，我们先创建一个package.json. 执行如下命令:
```
npm init
```
  package.json 代码如下：
```
{
  "name": "plugin-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "babel": "node ./index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.13.1"
  }
}
```
  my-plugin.js 代码如下：
```
// my-plugin.js
module.exports = function() {
  return {
    visitor: {
      // 需要操作的访问者方法(节点)
      Identifier(path) {
        if (path.node.name === "myPlugin") {
          path.node.name = 'xxx';
        }
      }
    }
  }
}
```
  before.js 代码如下
```
const myPlugin = 'hello world'; 
```
  index.js 代码如下：
```
const { transform } = require('@babel/core');
const fs = require('fs');
// 读取需要转换的js字符串
const before = fs.readFileSync('./before.js', 'utf8');
// 使用babel-core的transform的API和插件进行字符串 -> AST转化
const res = transform(`${before}`, {
  plugins: [require('./my-plugin')]
});

// 存在after.js删除
fs.existsSync('./after.js') && fs.unlinkSync('./after.js');

// 写入转化后的结果到after.js
fs.writeFileSync('./after.js', res.code, 'utf8');
```
代码分析：

  首先 const myPlugin = 'hello world'; 代码转换成抽象语法树，使用 <a href="https://astexplorer.net/">https://astexplorer.net/</a> 页面进行AST转换，如下AST抽象语法树：
```
{
  "type": "Program",
  "start": 0,
  "end": 31,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 31,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 30,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 14,
            "name": "myPlugin"
          },
          "init": {
            "type": "Literal",
            "start": 17,
            "end": 30,
            "value": "hello world",
            "raw": "'hello world'"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```
如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/50.jpg" />

  然后在访问者 visitor 中对 Identifier(需要对访问者操作的节点)进行操作，判断 path.node.name === "myPlugin" 节点名称，然后进行更改即可。

  当所有代码编写完成后，我们运行 npm run babel, 会在项目的根目录中生成 after.js 文件，该文件代码为：const xxx = 'hello world'; 说明生效了。

#### 2）将node端的代码重构使用TypeScript编写

  分析：将nodejs中的CommonJS模块规范改成 ES modules模块规范。
  列举：const xx = require('xxx') -> import xx from 'xxx';  module.exports = x -> export default x;

  首先我们看下 const xx = require('xxx'); 这行代码 转换成 AST(抽象语法树)后是个什么样的，使用 <a href="https://astexplorer.net/">https://astexplorer.net/</a> 链接转换查看。
```
{
  "type": "Program",
  "start": 0,
  "end": 26,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 26,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 25,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 8,
            "name": "xx"
          },
          "init": {
            "type": "CallExpression",
            "start": 11,
            "end": 25,
            "callee": {
              "type": "Identifier",
              "start": 11,
              "end": 18,
              "name": "require"
            },
            "arguments": [
              {
                "type": "Literal",
                "start": 19,
                "end": 24,
                "value": "xxx",
                "raw": "'xxx'"
              }
            ],
            "optional": false
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```
  module.exports = x; 的抽象语法树AST如下：
```
{
  "type": "Program",
  "start": 0,
  "end": 19,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 0,
      "end": 19,
      "expression": {
        "type": "AssignmentExpression",
        "start": 0,
        "end": 18,
        "operator": "=",
        "left": {
          "type": "MemberExpression",
          "start": 0,
          "end": 14,
          "object": {
            "type": "Identifier",
            "start": 0,
            "end": 6,
            "name": "module"
          },
          "property": {
            "type": "Identifier",
            "start": 7,
            "end": 14,
            "name": "exports"
          },
          "computed": false,
          "optional": false
        },
        "right": {
          "type": "Identifier",
          "start": 17,
          "end": 18,
          "name": "x"
        }
      }
    }
  ],
  "sourceType": "module"
}
```
  如上我们可以使用Babel的visitor去遍历CallExpression，然后找到 callee 中的name为require，然后我们就可以观察该AST的特点，然后我们提取变量名和依赖名，使用Babel的API来构造import语句并且替换父节点就好了。

  因此我们项目的根目录下还是有如下文件
```
|--- 项目名
| |--- my-plugin.js # 插件实现
| |--- before.js # 转化前代码
| |--- after.js # 转化后代码，自动生成该文件
| |--- index.js  # 程序入口
| |--- package.json
```
  package.json 代码如下：
```
{
  "name": "plugin-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "babel": "node ./index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.13.1",
    "@babel/types": "^7.13.0"
  }
}
```
  before.js 代码如下：
```
const xx = require('xxx');
module.exports = x;
```
  my-plugin.js 代码如下：
```
const t = require("@babel/types");

// my-plugin.js
module.exports = function() {
  return {
    visitor: {
      // 需要操作的访问者方法(节点)
      CallExpression(path) {
        // const xx = require('xxx');
        // babel 推荐使用 @babel/types 中的api来做判断
        if (t.isIdentifier(path.node.callee, { name: "require"}) && 
            t.isStringLiteral(path.node.arguments[0]) && 
            path.node.arguments.length === 1
        ) {
          // 提取require依赖名称
          const depName = path.node.arguments[0].value; // 获取到 const xx = require('xxx'); 代码中的 xxx
          if (t.isVariableDeclarator(path.parentPath.node) && t.isIdentifier(path.parentPath.node.id)) {
            // 提取require中的声明变量，如 const xx = require('xxx'); 中的 xx
            const importName = t.identifier(path.parentPath.node.id.name);
            // 如果当前节点父节点父节点是 VariableDeclarator 的话
            if (t.isVariableDeclaration(path.parentPath.parentPath.node)) {
              path.parentPath.parentPath.replaceWith(
                // 使用@babel/types构造import语句
                t.importDeclaration(
                  [t.importDefaultSpecifier(importName)],
                  t.stringLiteral(depName)
                )
              );
            }
          }
        }
      },
      MemberExpression(path) {
        // module.exports = xxx;
        // babel 推荐使用 @babel/types 
        if (t.isIdentifier(path.node.object, { name: "module" }) && 
            t.isIdentifier(path.node.property, { name: 'exports'})) {
          // 获取声明该语句的节点
          const assignmentExpression = path.parentPath;
          // 构造export default
          if (t.isExpression(assignmentExpression.node.right)) {
            assignmentExpression.parentPath.replaceWith(
              t.exportDefaultDeclaration(assignmentExpression.node.right)
            );
          }
        }
      }
    }
  }
}
```
  index.js 代码还是一样如下：
```
const { transform } = require('@babel/core');

const fs = require('fs');

// 读取需要转换的js字符串
const before = fs.readFileSync('./before.js', 'utf8');

// 使用babel-core的transform的API和插件进行字符串 -> AST转化
const res = transform(`${before}`, {
  plugins: [require('./my-plugin')]
});

// 存在after.js删除
fs.existsSync('./after.js') && fs.unlinkSync('./after.js');

// 写入转化后的结果到after.js
fs.writeFileSync('./after.js', res.code, 'utf8');
```
  然后执行命令： npm run babel; 后，会生成 after.js， 代码会变成转换后的代码，如下：
```
import xx from "xxx";
export default x;
```
更多babel插件可以看官网 <a href="https://www.babeljs.cn/docs/plugins"> https://www.babeljs.cn/docs/plugins </a>



























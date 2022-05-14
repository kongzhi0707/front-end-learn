
### 如何编写babel插件及在项目中调用

  对于我们前端开发来说，如果想要在前端中进行升级的话，那么Babel是非常重要的，因为Babel是javascript编译器，我们平时写的代码，比如ES6， ES7语法在低版本中浏览器它是不支持的。但是我们可以通过babel来进行转换操作。想要了解Babel是如何转换代码的，首先我们要了解AST抽象语法树，这些基本知识点就不聊了，可以看如下几篇文章：

<a href="https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md">查看babel插件手册</a>

<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/babel/babelCode.md">了解AST抽象语法树</a>

#### 一：环境搭建

  我们需要搭建一个环境来方便开发，调试及发布Babel插件。首先我们需要安装几个babel的核心包。我们在我们项目位置对应的目录下执行如下命令创建项目文件夹。
```
$ mkdir babel-plugin-test-demo
$ cd babel-plugin-test-demo && npm init -y
$ npm install --save-dev @babel/cli @babel/core @babel/preset-env
$ mkdir src && mkdir test
```
  如上在项目的根目录下新建了src文件夹和test文件夹，src中存放插件的源码，test中存放测试用例，然后我们在 package.json 中配置打包和调试的命令：
```
"scripts": {
  "build": "rm -rf lib && babel src/index.js -d lib",
  "test": "babel test/index.js -d test/compiled --watch"
},
```
  最后我们新建 babel.config.js 文件并且配置plugins， 该配置项是一个数组，表示babel需要加载的插件列表。
```
var config = {
  presets: [
    ['@babel/preset-env']
  ]
};

// 执行 npm run test 时启用插件 
if (ProcessingInstruction.argv[2].indexOf('test') >= 0) { 
  config.plugins = [
    ["./src/index.js"]
  ]
}

module.exports = config;
```
  如上是babel的配置文件，我们只需要事先在 test/index.js 文件中编写好几个测试用例，然后在 src/index.js 中编写插件逻辑，重新执行 npm run test 命令，最后会在 test/compiled/index.js 文件中就可以查看到编译的结果。

#### 2）babel插件结构

  我们编写的插件需要导出一个函数或对象，如果是函数需要返回一个对象。我们只需要在该对象的 visitor 内操作就行， 并且函数会接受几个参数， api 参数继承了
  babel提供的一系列方法，options是我们使用插件时所传递的参数。dirname为处理时的文件路径。
```
// 导出一个对象

module.exports = {
  visitor: {
    VariableDeclaration(path, state) {
      // .....
    }
  }
};

// 或函数形式
module.exports = (api, options, dirname) => {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        // .....
      }
    }
  }
}
```
  如上函数形式的参数 api 可以拿到babel的所有成员， 我们最常用的是types对象，它是由 babel-types 包提供的一个工具对象，用于构造，验证以及变换AST节点。
  对编写处理AST逻辑非常有用。

  函数形式我们也可以如下编写：
```
module.exports = ({ types: t}) => {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        // .....
      }
    }
  }
}
```
  如上函数，入参其实就是babel对象，babel包含了types工具对象。那么工具对象里面会有一些常用的方法。比如我们创建一个节点可以通过 types 调用该节点名称对应的方法。 
```
t.identifier('a');
```
  验证一个节点可以通过types调用is + 该节点名称对应的方法：
```
t.isIdentifier(node)
```
#### 理解path参数

  如上节点类型方法接收一个path(路径)参数，path表示两个节点之间链接的对象，path中存储着当前AST节点信息以及一些节点操作的方法。比如如下几个常用的：

path中的属性：
```
  node: 当前遍历到的节点信息。
  parent: 当前遍历到的节点信息的父节点信息。
  parentPath: 当前遍历到的节点的父节点路径。
  scope：作用域
```
path 中的方法：
```
  findParent: 寻找特定的父节点。
  getSibling: 获取同级路径。
  getFunctionParent: 获取包含该节点最近的父函数节点。
  getStatementParent: 获取包含该节点最近的表达式节点。
  replaceWith: 替换一个节点。
  replaceWithMultiple: 用多节点替换单节点。
  insertBefore: 在之前插入兄弟节点。
  insertAfter: 在之后插入兄弟节点。
  remove: 删除节点。
  pushContainer: 将节点插入到容器中
  stop: 停止遍历
  skip: 跳过此次遍历。
```
#### 3. babel插件实战

#### 1）实现 const a = 1; 转换成 var a = 1;

  首先我们把 const a = 1; 使用 <a href="https://astexplorer.net/">在线AST转换器</a> 转换下AST结构如下：
```
{
  "type": "Program",
  "start": 0,
  "end": 12,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 12,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 11,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 7,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 11,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```
  我们再来看下 var a = 1; 使用AST转换器看下转换后的AST结构如下：
```
{
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 10,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 9,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 9,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```
  如上，如果我们什么都不写，AST默认有一个根节点，如下：
```
{
  "type": "Program",
  "start": 0,
  "end": 0,
  "body": [],
  "sourceType": "module"
}
```
#### Program

  一般将它作为根节点，即代表了一颗完整程序的代码树。

#### body

  body属性是一个数组，它包含了多个 Statement(语句)节点。

#### sourceType 

  sourceType 可以是 "module" 或者 "script", 表示应用那种模式来解析， "module" 将会在严格模式下解析并且允许模块定义， "script" 则不会。

#### 注意： sourceType 的默认值是 "script" 并且在发现 import 或 export 时产生错误。 使用 scourceType: "module" 来避免这些错误。

  查看AST节点类型对照表， 可以看 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/babel/astType.md">这篇文章</a>

  我们来看下 body 里面的AST结构， 我们看到 body 里面的顶级节点的 type 为 VariableDeclaration, 我们查看上面的AST节点类型对照表可以看到，它表示变量声明，比如使用 var let const 等这些声明一个变量。 因此 const a = 1; 或 var a = 1; 顶级节点的 type 就是 VariableDeclaration；

#### declarations

  declarations 数组表示本地声明变量，是一个标识符(Identifier). 具体名称是 a。值 value 就是1； AST结构如下：
```
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "kind": "const"
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "value": 1,
            "raw": "1"
          }
        }
      ],
    }
  ]
}
```
  了解了上面的AST基本结构后，我们使用babel编写一个插件非常简单，我们只需要将AST中的 kind 值为 const 改成 var 就可以了。因此我们在 src/index.js 添加如下插件代码即可：

src/index.js
```
module.exports = ({ types: t}) => {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        console.log('-----打印下path-----', path);
        console.log('----打印下 state----', state);
        const { node } = path;
        if (node.kind === 'const' || node.kind === 'let') { 
          node.kind = "var";
        }
      }
    }
  }
}
```
test/index.js 添加如下代码：
```
const a = 1;

let a = 2;
```
  最后我们在 test/compiled/index.js 看到编译后的代码如下：
```
"use strict";

var a = 1;
var b = 2;
```
如上就是编写一个简单的babel插件了。

#### 2）箭头函数转换插件

  箭头函数有两种形式如下：
```
1) const a = () => {};

2) const a = (b) => b;
```
  同样的道理，我们需要把它生成AST结构。

const a = () => {}; AST结构如下：
```
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "id": null,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "body": []
            }
          }
        }
      ],
    }
  ],
  "sourceType": "module"
}
```
  对于第一种情况， const a = () => {}; 箭头函数，我们只需要改成 函数声明就行了， 我们就可以变成 const a = function() {}; 因此我们把 const a = function() {}; 查询下它的AST结构是如下：
```
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "FunctionExpression",
            "id": null,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "body": []
            }
          }
        }
      ],
    }
  ],
  "sourceType": "module"
}
```
  比较上面的两种AST数据结构区别是：我们只需要把 type为ArrowFunctionExpression 改成 type 为 FunctionExpression 就可以了。
  因此 test/index.js 代码为：
```
const a = () => {};
```
src/index.js 代码可以为：
```
module.exports = ({ types: t}) => {
  return {
    visitor: {
      ArrowFunctionExpression(path, state) {
        console.log('-----打印下path-----', path);
        const { node } = path;
        if (node.type === 'ArrowFunctionExpression') { 
          node.type = "FunctionExpression";
        }
      }
    }
  }
}
```
  最后我们运行 npm run test 命令后， 在 test/compiled/index.js 文件下会生成编译后的代码如下：
```
"use strict";

var a = function a() {};
```
  对于第一种情况，我们已经解决了， 我们现在接下来的问题 解决第二种情况。

#### 箭头函数的第二种情况

  对于 const a = (b) => b; 我们希望转换成 const a = function(b) { return b; }

  首先还是一样 const a = (b) => b; 的AST结构如下：
```
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "id": null,
            "params": [
              {
                "type": "Identifier",
                "name": "b"
              }
            ],
            "body": {
              "type": "Identifier",
              "name": "b"
            }
          }
        }
      ],
    }
  ],
  "sourceType": "module"
}
```
const a = function(b) { return b; } 的AST结构如下：
```
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "FunctionExpression",
            "id": null,
            "params": [
              {
                "type": "Identifier",
                "name": "b"
              }
            ],
            "body": {
              "type": "BlockStatement",
              "body": [
                {
                  "type": "ReturnStatement",
                  "argument": {
                    "type": "Identifier",
                    "name": "b"
                  }
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "sourceType": "module"
}
```
  通过上面的AST对比。我们可以总结他们两者的区别如下：
```
1）ArrowFunctionExpression 类型的节点 需要 改成 FunctionExpression 类型节点，也就是我们上面的第一种函数情况。
2）如果类型为 ArrowFunctionExpression， 并且还需要判断它的内部 body的type是否是一个 BlockStatement，如果不是的话，需要将其包装为 BlockStatement, 并且加上 return 关键字。
```
因此我们的插件代码可以变成如下：
```
// src/index.js 代码如下
module.exports = ({ types: t}) => {
  return {
    visitor: {
      ArrowFunctionExpression(path, state) {
        const { node } = path;
        if (node.type === 'ArrowFunctionExpression') { 
          node.type = "FunctionExpression";

          // 处理第二种情况
          const body = path.get('body');
          const bodyNode = body.node;
          // 如果body的type不是一个 BlockStatement 的话，需要将其包装为 BlockStatement, 并且加上 return 关键字。
          if (bodyNode.type !== 'BlockStatement') { 
            const statements = [];
            statements.push(t.returnStatement(bodyNode));
            node.body = t.blockStatement(statements);
          }
        }
      }
    }
  }
}
```
在 test/index.js 加入如下代码：
```
const a = () => { };

const a2 = (b) => b; 
```
最后我们运行 npm run test 后， 在test/compiled/index.js 编译成如下代码：
```
"use strict";

var a = function a() {};

var a2 = function a2(b) {
  return b;
};
```
#### 在实际项目中调试

我们可以本地进行调试，进入项目的根目录使用 npm link 指令来操作。
```
$ cd babel-plugin-test-demo
$ npm link

// 再去项目根目录下
$ cd my-project
$ npm link babel-plugin-test-demo
```
然后在实际项目中的 babel 配置文件中加上 
```
plugins: [
  ['babel-plugin-test-demo']
]
```
#### 发布包到 npm 中。

执行命令： npm run build 后，会在本地项目目录下生成 1ib/index.js 文件。

配置下 package.json , 如下：
```
{
  "name": "babel-plugin-test-demo",
  "version": "1.0.0",
  "main": "lib/index.js",
  "author": "tugenhua",
  "description": "测试babel插件",
  "keywords": ["测试babel插件"],
  "scripts": {
    "build": "rm -rf lib && babel src/index.js -d lib",
    "test": "babel test/index.js -d test/compiled --watch"
  },
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.17.10",
    "@babel/core": "^7.17.10",
    "@babel/preset-env": "^7.17.10"
  }
}
```
然后发布包， 在其他项目中 下载该包，最后在项目的 babelrc 配置文件中引入该插件即可。














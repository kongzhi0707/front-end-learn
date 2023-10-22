### 认识 babel 插件的 相关的 API 使用

Babel 是 javascript 的编译器。我们可以为 Babel 提供一些 javascript 代码，Babel 可以更改这些代码，然后返回给我们新生成的代码。Babel 主要用于将 ECMAScript2015+的代码转换为能够向后兼容的 javascript 版本。Babel 使用插件系统进行代码转换。

#### 一）Babel 编译流程

Babel 的编译流程主要分为三个部分：解析(parse), 转换 (transform), 生成 (generate).

```
code -> AST -> transformed AST -> transformed code
```

#### 1）解析 Parse

将源码转换成抽象语法树 (AST)，我们可以使用 @babel/parser 插件将源码转换成 AST。

比如下面的代码：

```
function add(x, y) {
  return x + y
}
```

使用 <a href="https://astexplorer.net/">在线 AST 转换</a> 可以转换成如下 AST 抽象语法树，代码如下：

```
{
  "type": "Program",
  "start": 0,
  "end": 37,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 37,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 12,
        "name": "add"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        {
          "type": "Identifier",
          "start": 13,
          "end": 14,
          "name": "x"
        },
        {
          "type": "Identifier",
          "start": 16,
          "end": 17,
          "name": "y"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 19,
        "end": 37,
        "body": [
          {
            "type": "ReturnStatement",
            "start": 23,
            "end": 35,
            "argument": {
              "type": "BinaryExpression",
              "start": 30,
              "end": 35,
              "left": {
                "type": "Identifier",
                "start": 30,
                "end": 31,
                "name": "x"
              },
              "operator": "+",
              "right": {
                "type": "Identifier",
                "start": 34,
                "end": 35,
                "name": "y"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```

#### 2）转换 Transform

转换阶段接收一个 AST 并遍历它，在遍历的过程中对树的节点进行增删改。这是 Babel 的插件阶段。在该阶段，我们可以使用 @babel/traverse 调用 visitor 函数遍历 AST，在这中间可以使用 @babel/types 创建 AST 和 检查 AST 节点的类型。

#### 3）生成 Generate

将经过一系列转换之后的 AST 转换成字符串形式的代码，同时还会创建 sourcemap. 在该阶段我们可以使用 @babel/generator 根据 AST 生成代码字符串和 sourcemap。

#### 二）认识 Babel 插件

babel 插件是一个简单的函数，它必须返回一个匹配以下接口的对象。下面是一个简单的插件列子。

```
module.exports = (api, options, dirname) => {
  return {
    visitor: {
      StringLiteral(path, state) {},
    }
  }
}
```

Babel 插件接收 3 个参数：

api: 一个对象，包含了 types(@babel/types), traverse(@babel/traverse), tempalte(@babel/template) 等实用方法，我们能从这个对象中访问的到 @babel/core dependecies 中包含的方法。

options: 插件参数

dirname: 目录名。

返回的对象有 name，manipulateOptions, pre, visitor, post, inherits 等属性。

```
name: 插件名字
inherits: 指定继承某个插件，通过 Object.assign 的方式，和当前插件的 options 合并。
visitor: 指定 traverse 时调用的函数。
pre 和 post 分别在遍历前后调用，可以做一些插件调用前后的逻辑，比如可以往 file (表示文件的对象，和插件里面通过 state.file拿到)中放一些东西。在遍历过程中取出来。
manipulateOptions: 用于修改 options，是在插件里面修改配置的方式。
```

#### visitor 访问者

它是一个对象，指定了在遍历 AST 过程中，访问指定节点时应该被调用的方法。
假如我们有这么一段代码:

```
function add() {
  return 'string'
}
```

这段代码对应的 AST 如下：

```
{
  "type": "Program",
  "start": 0,
  "end": 36,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 36,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 12,
        "name": "add"
      },
      "expression": false,
      "generator": false,
      "async": false,
      "params": [],
      "body": {
        "type": "BlockStatement",
        "start": 15,
        "end": 36,
        "body": [
          {
            "type": "ReturnStatement",
            "start": 19,
            "end": 34,
            "argument": {
              "type": "Literal",
              "start": 26,
              "end": 34,
              "value": "string",
              "raw": "'string'"
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```

当我们对这颗 AST 进行深度优先遍历时，每次访问 ReturnStatement 都会调用 visitor.ReturnStatement.
当 visitor.ReturnStatement 是一个函数时，它将在向下遍历过程中被调用（即进入阶段）。当 visitor.ReturnStatement 是一个对象时，
{ enter(path, state){}, exit(path, state) {} }, visitor.ReturnStatement 将在向下遍历的过程中被调用(进入阶段)，visitor.ReturnStatement 将在向上遍历的过程中被调用(退出阶段)。

#### Path 路径

Path 用于表示两个节点之间链接的对象。这是一个可操作和访问巨大可变的对象。
Path 对象上访问到当前 AST 节点，父级 AST 节点，父级 Path 对象，还能访问到 添加/更新/移除/删除节点等其他方法。这些方法提高了我们对 AST 增删改的效率。

#### State 状态

在实际编写插件的过程中，某一类型节点的处理可能需要依赖其他类型节点的处理结果，但由于 visitor 属性之间互相不关联，因此需要 state 帮助我们在不同的 visitor 之间传递状态。

一种处理方式是使用递归，并将状态往下传递，类似如下代码：

```
const anotherVisitor = {
  Identifier(path) {
    console.log(this.someParam) // => 'xxx'
  }
};

const MyVisitor = {
  FunctionDeclaration(path, state) {
    // state.cwd: 当前执行目录
    // state.opts: 插件 options
    // state.filename: 当前文件名(绝对路径)
    // state.file: BabelFile 对象，包含当前整个 ast，当前文件内容 code，etc.
    // state.key: 当前插件名字
    path.traverse(anotherVisitor, { someParam: 'xxx' });
  }
};
```

#### 常用的 API

常用的 API，主要是 path 和 types 上的方法或属性。

#### 查询

```
1）path.node: 访问当前节点
2）path.get(): 获取属性内部的 path
3）path.inList: 判断路径是否有同级节点。
4）path.key: 获取路径所在容器的索引。
5）path.container: 获取路径的容器(包含所有同级节点的数组)
6) path.listKey: 获取容器的 key
7) path.getSibling(): 获取同级路径
8）path.findParent(): 对于每一个父路径调用 callback 并将其 NodePath 当作参数，当 callback 返回真值时，则将其 NodePath 返回。
9）path.find(): 和 path.findParent 的区别是：该方法会遍历当前节点。
```

#### 遍历

```
1）path.stop(): 跳过遍历当前路径的子路径。
2）path.skip(): 完全停止遍历
```

#### 判断

```
1）types.isXXX(): 检查节点的类型。比如 types.isStringLiteral(path.node)
2) path.isReferencedIdentifier(): 检查标识符（Identifer）是否被引用
```

is 开头的用于判断节点。

```
创建null节点
const nullNode = types.nullLiteral();
// 创建 square 变量节点
const squareNode = types.identifier('square');
```

#### 增删改

```
1）path.replaceWith(): 替换单个节点
2）path.replaceWithMultiple()：用多节点替换单节点
3）path.replaceWithSourceString()：用字符串源码替换节点
4）path.insertBefore() / path.insertAfter()：插入兄弟节点
5）path.get('listKey').unshiftContainer() / path.get('listKey').pushContainer()：插入一个节点到数组中，如 body
6）path.remove()：删除一个节点
```

#### 作用域

```
1）path.scope.hasBinding(): 从当前作用域开始向上查找变量
2）path.scope.hasOwnBinding()：仅在当前作用域中查找变量
3）path.scope.generateUidIdentifier()：生成一个唯一的标识符，不会与任何本地定义的变量相冲突
4）path.scope.generateUidIdentifierBasedOnNode()：基于某个节点创建唯一的标识符
5）path.scope.rename()：重命名绑定及其引用
```

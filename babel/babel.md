
### 深入Babel原理和Babel插件实践

1. 什么是Babel？

Babel是javascript的编译器，它可以将ES6(ES2015+)的语法的代码编译到ES5版本，从而可以兼容之前的浏览器。

2. Babel是如何工作的？

Babel的编译过程可以分为三个阶段：

1. 解析(PARSE): 将代码字符串解析成抽象语法树(AST)。每个js引擎都有自己的AST解析器，而Babel是通过BaBylon(https://github.com/babel/babylon)实现的。在解析过程中分为2个阶段：词法分析和语法分析，词法分析阶段是把字符串形式的代码转换为令牌(tokens)流，语法阶段则会把一个令牌流转换成AST形式。

2. 转换(TRANSFORM): 对抽象语法树进行转换操作。Babel接受AST并且通过babel-traverse对其进行深度优先遍历，在此过程中会对节点进行添加/更新/移除操作。

3. 生成(GENERATE): 根据变换后的抽象语法树再生成代码字符串。通过深度优先遍历整个AST，然后构建可以表示转换后代码的字符串。

看下如下流程图可以更清晰了：

<img src="https://images2017.cnblogs.com/blog/561794/201711/561794-20171120013201211-2132813361.png" />

3. 什么是抽象语法树(AST)？

javascript程序是由一系列的字符组成的。每一个字符都有一些含义，比如我们可以使用匹配的字符([], {}, ()), 或一些其他成对的字符('', "") 和代码缩进让程序解析更加简单，但是计算机并不认识，这些字符在内存中仅仅是个数值。因此我们需要让计算机来理解这些字符的含义，因此抽象语法树诞生了。

Babel的工作第一步是解析操作，将代码字符串解析成抽象语法树，那么解析又可以分成2个步骤：

1) 词法分析：将整个代码字符串分割成 词法单元数组。
2）语法分析：在分词结果的基础之上分析语法单元之间的关系。

3-1）词法分析

词法分析阶段, tokenizer(分词器)会将原始代码按照特定字符(如let, var, =等保留字)分成一个个叫token的东西，token由分号，标签，变量，字符串等组成。比如构成如下数据
结构：

[
  {type: "whitespace", value: "\n"},
  {type: "identifier", value: "if"},
  {type: "whitespace", value: " "},
  {type: "parens", value: "("},
  {type: "number", value: "1"},
  {type: "whitespace", value: " "},
  {type: "operator", value: ">"},
  {type: "whitespace", value: " "},
  {type: "number", value: "0"},
  {type: "parens", value: ")"},
  {type: "whitespace", value: " "},
  {type: "brace", value: "{"},
  {type: "whitespace", value: "\n"},
  {type: "identifier", value: "alert"},
  {type: "parens", value: "("},
  {type: "string", value: "'aa'"},
  {type: "parens", value: ")"},
  {type: "sep", value: ";"},
  {type: "whitespace", value: "\n"},
  {type: "brace", value: "}"},
  {type: "whitespace", value: "\n"}
]

我们先来理解下什么叫词法单元，词法单元是被解析语法当中具备实际意义的最小单元。比如我们来看下面的一句话：

2022年亚运会将在杭州举行，下面我们可以把这句话拆分成最小单元：2022年, 亚运会, 将, 在, 杭州, 举行。这就是我们所说的分词。也是最小单元，如果我们把它再拆分出去的话，那就没有什么实际意义了。

那么在JS代码中大致有如下词法单元：

1. 空白。JS中连续的空格，换行，缩进等，因此我们可以将连续的空白组合在一起作为一个词法单元。
2. 注释。行注释或块注释。对于编写代码的维护人注释是有意义的。但是对于计算机来说知道这是一个注释就可以了，并不关心注释的含义，因此我们将注释理解为一个不可拆分的词法单元。
3. 字符串。对计算机而言，字符串中的内容会参与计算或显示，因此也可以作为一个词法单元。
4. 数字。JS中有16，10，8进制以及科学表达式等语法，因此可以当作一个词法单元。
5. 标识符。没有被引号括起来的连续字符，可包含字母_, $ 及 数字，或 true, false 等内置常量，或 if, return function 等这些关键字。
6. 运算符：+, - , *, /, >, < 等。
7. 还有一些其他的，比如括号，中括号/小括号/大括号/分号/冒号/点等。

下面我们看看代码是如何进行分词的？比如如下代码：

if (1 > 0) {
  alert("aa");
}

我们会得到如下分词：

'if', ' ', '(', '1', ' ', '>', ' ', '0', ')', ' ', '{', '\n', ' ', 'alert', '(', 'aa', ')', ';', '\n', '}'

下面我们就需要对一个个字符进行遍历，然后分情况判断，如下代码：

<!DOCTYPE html>
<html>
  <head>
    <title>分词</title>
  </head>
  <body>
    <script>
      function tokenizeCode(code) {
        var tokens = [];  // 保存结果数组
        for (var i = 0; i < code.length; i++) {
          // 从0开始 一个个字符读取
          var currentChar = code.charAt(i);
          if (currentChar === ';') {
            tokens.push({
              type: 'sep',
              value: currentChar
            });
            // 该字符已经得到解析了，直接循环下一个
            continue;
          }
          if (currentChar === '(' || currentChar === ')') {
            tokens.push({
              type: 'parens',
              value: currentChar
            });
            continue;
          }
          if (currentChar === '{' || currentChar === '}') {
            tokens.push({
              type: 'brace',
              value: currentChar
            });
            continue;
          }
          if (currentChar === '>' || currentChar === '<') {
            tokens.push({
              type: 'operator',
              value: currentChar
            });
            continue;
          }
          if (currentChar === '"' || currentChar === '\'') {
            // 如果是单引号或双引号，表示一个字符的开始
            var token = {
              type: 'string',
              value: currentChar
            };
            tokens.push(token);
            var closer = currentChar;

            // 表示下一个字符是不是被转译了
            var escaped = false;
            // 循环遍历 寻找字符串的末尾
            for(i++; i < code.length; i++) {
              currentChar = code.charAt(i);
              // 将当前遍历到的字符先加到字符串内容中
              token.value += currentChar;
              if (escaped) {
                // 如果当前为true的话，就变为false，然后该字符就不做特殊的处理
                escaped = false;
              } else if (currentChar === '\\') {
                // 如果当前的字符是 \, 将转译状态变为true，下一个字符不会被做处理
                escaped = true;
              } else if (currentChar === closer) {
                break;
              }
            }
            continue;
          }

          // 数字做处理 
          if (/[0-9]/.test(currentChar)) {
            // 如果数字是以 0 到 9的字符开始的话
            var token = {
              type: 'number',
              value: currentChar
            };
            tokens.push(token);
            // 继续遍历，如果下一个字符还是数字的话，比如0到9或小数点的话
            for (i++; i < code.length; i++) {
              currentChar = code.charAt(i);
              if (/[0-9\.]/.test(currentChar)) {
                // 先不考虑多个小数点 或 进制的情况下
                token.value += currentChar;
              } else {
                // 如果下一个字符不是数字的话，需要把i值返回原来的位置上，需要减1
                i--;
                break;
              }
            }
            continue;
          }
          // 标识符是以字母，$, _开始的 做判断
          if (/[a-zA-Z\$\_]/.test(currentChar)) {
            var token = {
              type: 'identifier',
              value: currentChar
            };
            tokens.push(token);
            // 继续遍历下一个字符，如果下一个字符还是以字母，$,_开始的话
            for (i++; i < code.length; i++) {
              currentChar = code.charAt(i);
              if (/[a-zA-Z0-9\$\_]/.test(currentChar)) {
                token.value += currentChar;
              } else {
                i--;
                break;
              }
            }
            continue;
          }

          // 连续的空白字符组合在一起
          if (/\s/.test(currentChar)) {
            var token = {
              type: 'whitespace',
              value: currentChar
            }
            tokens.push(token);
            // 继续遍历下一个字符
            for (i++; i < code.length; i++) {
              currentChar = code.charAt(i);
              if (/\s/.test(currentChar)) {
                token.value += currentChar;
              } else {
                i--;
                break;
              }
            }
            continue;
          }
          // 更多的字符判断 ......
          // 遇到无法理解的字符 直接抛出异常
          throw new Error('Unexpected ' + currentChar);
        }
        return tokens;
      } 
      var tokens = tokenizeCode(`
        if (1 > 0) {
          alert("aa");
        }
      `);
      console.log(tokens);
    </script>
  </body>
</html>

词法分析在线解析可以查看（https://esprima.org/demo/parse.html?code=let%20str%20%3D%20%27test%27%3B%0Astr%20%2B%20%27abc%27%3B#）

github上的词法分析的实现，可以查看（https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js#L381）

3-2）语法分析 (Syntactic Analysis)

上面词法分析完成后进入语法分析阶段，语法分析将tokens重新格式化为描述语法各部分及其相互关系的表现形式。这就是抽象语法树。

代码简单的实现如下：

<!DOCTYPE html>
<html>
  <head>
    <title>分词</title>
  </head>
  <body>
    <script>
      var parse = function(tokens) {
        let i = -1;     // 用于标识当前遍历位置
        let curToken;   // 用于记录当前符号
        // 读取下一个语句
        function nextStatement () {

          // 暂存当前的i，如果无法找到符合条件的情况会需要回到这里
          stash();
          
          // 读取下一个符号
          nextToken();
          if (curToken.type === 'identifier' && curToken.value === 'if') {
            // 解析 if 语句
            const statement = {
              type: 'IfStatement',
            };
            // if 后面必须紧跟着 (
            nextToken();
            if (curToken.type !== 'parens' || curToken.value !== '(') {
              throw new Error('Expected ( after if');
            }

            // 后续的一个表达式是 if 的判断条件
            statement.test = nextExpression();

            // 判断条件之后必须是 )
            nextToken();
            if (curToken.type !== 'parens' || curToken.value !== ')') {
              throw new Error('Expected ) after if test expression');
            }

            // 下一个语句是 if 成立时执行的语句
            statement.consequent = nextStatement();

            // 如果下一个符号是 else 就说明还存在 if 不成立时的逻辑
            if (curToken === 'identifier' && curToken.value === 'else') {
              statement.alternative = nextStatement();
            } else {
              statement.alternative = null;
            }
            commit();
            return statement;
          }

          if (curToken.type === 'brace' && curToken.value === '{') {
            // 以 { 开头表示是个代码块，我们暂不考虑JSON语法的存在
            const statement = {
              type: 'BlockStatement',
              body: [],
            };
            while (i < tokens.length) {
              // 检查下一个符号是不是 }
              stash();
              nextToken();
              if (curToken.type === 'brace' && curToken.value === '}') {
                // } 表示代码块的结尾
                commit();
                break;
              }
              // 还原到原来的位置，并将解析的下一个语句加到body
              rewind();
              statement.body.push(nextStatement());
            }
            // 代码块语句解析完毕，返回结果
            commit();
            return statement;
          }
          
          // 没有找到特别的语句标志，回到语句开头
          rewind();

          // 尝试解析单表达式语句
          const statement = {
            type: 'ExpressionStatement',
            expression: nextExpression(),
          };
          if (statement.expression) {
            nextToken();
            if (curToken.type !== 'EOF' && curToken.type !== 'sep') {
              throw new Error('Missing ; at end of expression');
            }
            return statement;
          }
        }
        // 读取下一个表达式
        function nextExpression () {
          nextToken();
          if (curToken.type === 'identifier') {
            const identifier = {
              type: 'Identifier',
              name: curToken.value,
            };
            stash();
            nextToken();
            if (curToken.type === 'parens' && curToken.value === '(') {
              // 如果一个标识符后面紧跟着 ( ，说明是个函数调用表达式
              const expr = {
                type: 'CallExpression',
                caller: identifier,
                arguments: [],
              };

              stash();
              nextToken();
              if (curToken.type === 'parens' && curToken.value === ')') {
                // 如果下一个符合直接就是 ) ，说明没有参数
                commit();
              } else {
                // 读取函数调用参数
                rewind();
                while (i < tokens.length) {
                  // 将下一个表达式加到arguments当中
                  expr.arguments.push(nextExpression());
                  nextToken();
                  // 遇到 ) 结束
                  if (curToken.type === 'parens' && curToken.value === ')') {
                    break;
                  }
                  // 参数间必须以 , 相间隔
                  if (curToken.type !== 'comma' && curToken.value !== ',') {
                    throw new Error('Expected , between arguments');
                  }
                }
              }
              commit();
              return expr;
            }
            rewind();
            return identifier;
          }
          if (curToken.type === 'number' || curToken.type === 'string') {
            // 数字或字符串，说明此处是个常量表达式
            const literal = {
              type: 'Literal',
              value: eval(curToken.value),
            };
            // 但如果下一个符号是运算符，那么这就是个双元运算表达式
            stash();
            nextToken();
            if (curToken.type === 'operator') {
              commit();
              return {
                type: 'BinaryExpression',
                left: literal,
                right: nextExpression(),
              };
            }
            rewind();
            return literal;
          }
          if (curToken.type !== 'EOF') {
            throw new Error('Unexpected token ' + curToken.value);
          }
        }
        // 往后移动读取指针，自动跳过空白
        function nextToken () {
          do {
            i++;
            curToken = tokens[i] || { type: 'EOF' };
          } while (curToken.type === 'whitespace');
        }
        // 位置暂存栈，用于支持很多时候需要返回到某个之前的位置
        const stashStack = [];
        function stash () {
          // 暂存当前位置
          stashStack.push(i);
        }
        function rewind () {
          // 解析失败，回到上一个暂存的位置
          i = stashStack.pop();
          curToken = tokens[i];
        }
        function commit () {
          // 解析成功，不需要再返回
          stashStack.pop();
        }
        const ast = {
          type: 'Program',
          body: [],
        };
        // 逐条解析顶层语句
        while (i < tokens.length) {
          const statement = nextStatement();
          if (!statement) {
            break;
          }
          ast.body.push(statement);
        }
        return ast;
      };
      var ast = parse([
          {type: "whitespace", value: "\n"},
          {type: "identifier", value: "if"},
          {type: "whitespace", value: " "},
          {type: "parens", value: "("},
          {type: "number", value: "1"},
          {type: "whitespace", value: " "},
          {type: "operator", value: ">"},
          {type: "whitespace", value: " "},
          {type: "number", value: "0"},
          {type: "parens", value: ")"},
          {type: "whitespace", value: " "},
          {type: "brace", value: "{"},
          {type: "whitespace", value: "\n"},
          {type: "identifier", value: "alert"},
          {type: "parens", value: "("},
          {type: "string", value: "'aa'"},
          {type: "parens", value: ")"},
          {type: "sep", value: ";"},
          {type: "whitespace", value: "\n"},
          {type: "brace", value: "}"},
          {type: "whitespace", value: "\n"}
                ]);
      console.log(ast);
    </script>
  </body>
</html>

最后输出的ast值为如下：

{
  "type": "Program",
  "body": [
    {
      "type": "IfStatement",
      "test": {
        "type": "BinaryExpression",
        "left": {
          "type": "Literal",
          "value": 1
        },
        "right": {
          "type": "Literal",
          "value": 0
        }
      },
      "consequent": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ExpressionStatement",
            "expression": {
              "type": "CallExpression",
              "caller": {
                "type": "Identifier",
                "value": "alert"
              },
              "arguments": [
                {
                  "type": "Literal",
                  "value": "aa"
                }
              ]
            }
          }
        ]
      },
      "alternative": null
    }
  ]
}

下面是javascript简易编译中语法分析的实现(https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js#L555)

我们也可以使用 在线AST查看器(https://astexplorer.net/) 来查看下上面代码在Babel中抽象语法树。
















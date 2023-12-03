### Eslint 配置详解

#### 1）配置文件格式

Eslint 配置文件可以使用多种文件格式，常用的有以下几种:

```
1) .eslintrc.js: 使用javascript编写的配置文件。返回的一个配置对象。
2）.eslintrc.json: 使用JSON格式编写的配置文件。
3）.eslintrc.cjs: 使用该文件编写时，需要在package.json中配置 type: "module".
4) .eslintrc: 普通配置文件。
```

还有一种新的配置文件类型: eslint.config.js. 官方将在 v9 版本全面使用该配置类型。

我们常见的推荐使用 .js 文件格式，因为它可以使用 javascript 的所有特性。方便编写复杂的配置规则。比如如下:

```
// .eslintrc.js
module.exports = {
  //...
}

//eslint.config.js
export default [

]
```

#### 2）常用的配置项

##### 2.1）root

指定 ESlint 在查找配置文件时的起始位置。

比如如下目录结构：

```
project/
  |--- package.json
  |--- .eslintrc.js
  |--- src/
  | |--- .eslintrc.js
  | |--- index.js
  |--- test/
  | |--- .eslintrc.js
  | |--- index.js
```

我们在顶层 .eslintrc.js 中配置 root：

```
// project/.eslintrc.js

module.exports = {
  root: true,
  // ...
};
```

这是告诉 Eslint 应该使用此文件作为起始位置来查找其他配置文件。这将确保 EsLint 始终使用 project/.eslintrc.js 作为项目中所有文件的配置文件。而不是使用子目录中的其他配置文件。

如果在上面列子中没有指定 "root" 字段，ESlint 会使用最近的配置文件来检测代码。如果当前目录下没有配置文件，Eslint 会继续向上查找父目录，直到找到一个配置文件为止。

##### 2.2）env

用来指定校验环境。它告诉 Eslint 代码运行在那个环境中，从而帮助 ESlint 更好的理解我们的代码并检测潜在的问题。

配置如下:

```
{
  env: {
    es6: true /** 启用除了modules以外的所有 ES6 特性,开启后会自动设置ecmaVersion为6 */,
    node: true /** Node.js 全局变量和 Node.js 作用域 */,
    browser: true /** 浏览器全局变量 */,
    commonjs: true /**  CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码) */,
    jest: false /** Jest 全局变量 */,
    jquery: false /** jQuery 全局变量 */,
    'shared-node-browser': false /** Node.js 和 Browser 通用全局变量 */,
    worker: false /** Web Workers 全局变量 */,
    amd: false /** 将 require() 和 define() 定义为像 amd 一样的全局变量 */,
    mocha: false /** 添加所有的 Mocha 测试全局变量 */,
    jasmine: false /** 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。 */,
    shelljs: false /** ShellJS 全局变量 */
  }
}
```

##### 2.3) parser

指定用于解析 JavaScript 代码的解析器。Eslint 默认使用 esprima 解析器。但是可以通过 "parser" 配置来使用其他解析器。

常用的解析器如下:

```
1. esprima：默认的解析器，用于解析ECMAScript 5到ECMAScript 2021之间的JavaScript代码。
2. @babel/eslint-parser：由Babel项目提供的解析器，用于解析ES6+代码。
3. @typescript-eslint/parser：由TypeScript团队提供的解析器，用于解析TypeScript代码。
4. eslint-plugin-html：用于解析HTML文件中的JavaScript代码。
5. vue-eslint-parser：用于解析Vue单文件组件中的JavaScript代码。
```

##### 2.4) parserOptions

给配置的解析器添加可选配置项。

如果我们使用的是默认 parser 配置，可以用如下配置:

```
// .eslintrc.js
module.exports = {
  parser: "esprima",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    range: true,
    loc: true,
  },
  // ...
}
```

字段解析：

```
1. ecmaVersion： 指定要解析的 ECMAScript 版本。可以设置数字(如 3,5,6,7,8,9,10,11,12,13,2020,2021)等或字符串 "latest", 默认为 5.
2. sourceType: 指定要解析的模块系统类型，可选值为 "script"（默认） 或 "module".
3. ecmaFeatures: 一个对象，用于启用或禁用 ECMAScript 中的特定语言功能。可用的选项包括：
   globalReturn：允许在全局作用域中使用 return 语句。
   impliedStrict：允许在非严格模式下解析为严格模式。
   jsx：启用 JSX 语法。
   experimentalObjectRestSpread：启用对象的 rest 和 spread 操作符。

4. allowImportExportEverywhere: 允许在代码的任何位置使用 import 和 export 语句。默认为 false。
5. codeFrame: 当发生语法错误时，提供更详细的错误信息。默认为 true。
6. requireConfigFile: 如果设置为 true，则必须提供 tsconfig.json 或 .eslintrc.\* 文件来配置解析器。默认为 false。
7. babelOptions: 传递给 @babel/parser 的选项对象。示例如下：
```

```
babelOptions: {
  ecmaVersion: "es2020",
  ecmaFeatures: {
    globalReturn: true,
    jsx: true,
  },
  lib: ["ES2020"],
},
```

```
8. tsconfigRootDir: 指定TypeScript配置文件的根目录。默认为解析 tsconfig.json 文件的目录。
```

##### 2.5) globals

指定全局变量的一个配置项。在 Javascript 中，如果一个变量没有经过声明就被使用，会导致该变量被当作全局变量处理。这可能会导致一些潜在的问题。我们可以通过配置 globals, 我们可以告诉 Eslint 这些变量是全局变量。从而可以避免这些问题产生。

比如如下:

```
{
  "globals": {
    "xx": "writable",
    "yy": "readonly",
    "zz": "off"
  }
}
```

如上代码，xx 和 yy 都被指定为全局变量，xx 可以被写入，而 yy 是只读的。zz 是被关闭的。换句话说 ESlint 不会对他进行任何检查。

需要注意的是：使用全局变量可能会降低代码的可读性和可维护性。我们应该谨慎使用。

##### 2.6）rules

用于设置 Eslint 的规则 和 规则的错误等级。rules 配置项是一个对象，它的每个属性表示一个规则，属性值表示该规则的错误等级。

配置方式如下:

```
"rules": {
  "eqeqeq": "off",  // 关闭告警
  "no-undef": "warn", // 警告级别
  "react/prop-types": "error", // 错误级别
}
```

配置项还有第二个参数：

```
"semi": ["error", "always"] // 要求在语句末尾始终使用分号。
"semi": ["error", "never"] // 要求在语句末尾不使用分号。
```

我们可以这样写来拦截特定的文件：

```
overrides: [
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      "no-undef": "off",
      "react/prop-types": "off",
      "semi": "off"
    },
  },
],
```

我们要注意 规则集之间的顺序问题，后面的规则集会覆盖前面的规则集。如果需要保留前面的规则集中的规则：

```
"rules": Object.assign({}, require("eslint-config-airbnb/rules"))
```

常见的 rule 有如下这些，

```
no-var: 禁止使用 var 关键字声明变量，使用 let 或 const 代替。
no-unused-vars: 禁止声明变量但未使用，减少代码冗余。
no-console: 禁止使用 console 语句，避免代码在生产环境中泄漏敏感信息。
semi: 要求在语句末尾使用分号，规范代码风格。
indent: 要求使用指定的缩进风格，提高代码可读性。
quotes: 要求在字符串周围使用指定的引号类型，规范代码风格。
no-undef: 禁止使用未声明的变量，减少错误出现的概率。
no-extra-parens: 禁止出现不必要的括号，提高代码可读性。
no-multiple-empty-lines: 禁止出现多行空白行，提高代码可读性。
no-trailing-spaces: 禁止行末出现空格，提高代码可读性。
no-unreachable: 禁止出现无法到达的代码，减少代码冗余。
no-useless-return: 禁止出现不必要的 return 语句，减少代码冗余。
```

React

```
react/jsx-uses-react: 检测是否使用了 React 库，如果没有使用则报错。
react/jsx-uses-vars: 检测是否声明了 JSX 变量，如果声明了但未使用则报错。
react/jsx-no-undef: 检测是否使用了未定义的 JSX 变量，如果使用了则报错。
react/jsx-indent: 要求 JSX 元素的缩进为指定数量的空格。
react/jsx-indent-props: 要求 JSX 属性的缩进为指定数量的空格。
react/no-unescaped-entities: 禁止在 JSX 中使用未转义的 HTML 实体字符。
react/prop-types: 检测是否为组件声明了 props 类型定义，如果没有则报错。

```

Vue

```
vue/html-indent: 要求模板中的缩进为指定数量的空格。
vue/no-unused-components: 检测是否注册了但未使用的组件，如果有则报错。
vue/no-unused-vars: 检测是否声明了但未使用的变量，如果有则报错。
vue/require-prop-types: 要求组件声明 props 类型定义。
vue/require-default-prop: 要求组件声明 props 的默认值。
vue/require-v-for-key: 要求使用 v-for 指令时为每个项提供唯一的 key 属性。
```

##### 2.7) plugins

用来指定插件的一个选项，插件是一种扩展 ESlint 功能的方式，可以用于检查特定类型的问题或者应用特定的编码规范。Eslint 插件一般是一个 npm 包，包含一组规则和相关的配置，通过 plugins 选项将其引入到项目中，就可以使用这些规则来检查代码。

Eslint 插件一般需要配合对应的规则进行使用，通过 extends 选项来继承插件的规则。常用的插件有如下:

```
1) eslint-plugin-import：用于检查模块导入的规范性，包括路径、文件类型和文件内容等方面的检查。
2) eslint-plugin-react：用于检查 React 代码的规范性，包括 JSX 语法、组件使用和生命周期等方面的检查。
3) eslint-plugin-vue：用于检查 Vue.js 代码的规范性，包括模板、组件和指令等方面的检查。
4) eslint-plugin-jest：用于检查 Jest 测试代码的规范性，包括测试名称、匹配器和断言等方面的检查。
5) eslint-plugin-node：用于检查 Node.js 代码的规范性，包括 API 使用、文件系统和子进程等方面的检查。
6) eslint-plugin-prettier：用于将 Prettier 代码格式化集成到 ESLint 中，可以通过配置来自动修复代码格式问题。
7) eslint-plugin-security：用于检查代码中的安全问题，包括跨站点脚本攻击、命令注入和 SQL 注入等方面的检查。
```

等，比如我们以 eslint-plugin-react 为列子：

安装该插件, 安装命令如下:

```
npm install eslint-plugin-react --save-dev
```

使用方式如下:

```
// .eslintrc.js

{
  "plugins": ["react"],
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "react/jsx-props-no-spreading": "off",
    "react/jsx-props-no-spreading": [
      "error",
      {
        "exceptions": ["Component"],
        "html": "enforce",
        "custom": "ignore"
      }
    ]
  }
}
```

如上配置，使用了 eslint:recommended 和 plugin:react/recommended 扩展，分别表示使用了 ESlint 推荐的规则 和 eslint-plugin-react 的推荐规则。这些规则可以通过 rules 配置项进行修改和覆盖。

##### 2.8）extends

用来继承和扩展 ESlint 规则集的配置项。通过 extends，可以将现有的规则集合合并到自己的规则配置中，也可以基于现有的规则进行扩展和定制化。它与 plugins 的区别是：extends 继承了 plugins 的功能，而且自带了配置规则 rules。

ESLint 提供了多个内置规则集，包括 eslint:recommended、plugin:@typescript-eslint/recommended、plugin:react/recommended、plugin:vue/recommended 等。通过在配置文件中设置 extends 为内置规则集的名称，可以直接使用内置规则集中的规则。
除了内置规则集外，还有许多第三方规则集可以使用，比如 airbnb、standard、prettier 等。
如果需要同时使用多个规则集，可以使用数组的方式将多个规则集合并到一起：

```
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:vue/recommended"
  ]
}
```

如果需要定义自己的规则集，可以使用相对路径或绝对路径指定规则集的位置:

```
{
  "extends": "./path/to/my-rule-set"
}
```

extends 的优先级是从低到高的，后面的规则会覆盖前面的规则，最终以最后一个规则集为准；而当一个规则在多个规则集中定义时，后边的会覆盖前面的。例如：

```
// eslint-config-a.js
module.exports = {
  rules: {
    'no-console': 'off',
    'no-alert': 'error'
  }
};

// eslint-config-b.js
module.exports = {
  extends: ['eslint-config-a'],
  rules: {
    'no-console': 'error',
    'no-debugger': 'warn'
  }
};
```

eslint-config-b 中，no-console 使用 error，而不是 off。

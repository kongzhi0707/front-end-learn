
### tsconfig.json配置详解

如果项目的根目录下存在 tsconfig.json文件，则表示该项目支持 TypeScript。
在命令行中使用 tsc 指令编译 TypeScript 项目时，编译器会自动从目录中寻找 tsconfig.json 文件，并且根据其中的配置信息对项目进行编译。

tsconfig.json 常用配置的含义：
```
{
  // include用来指定哪些ts文件被编译，** 代表src下的任意目录，* 代表任意文件
  "include": ["./src/**/*"],

  // 表示排除哪些文件，不包括哪些文件
  "exclude": ["./src/test/**/*"],  
  
  // extends 定义被继承的配置文件
  "extends": "",
  
  // 指定被编译文件的列表
  "files": [ "文件名字" ],
  
  // 编译器的配置选项
  "compilerOptions": {
    // target 用来指定ts被编译为ES版本，默认被编译为 ES3
    // target 有如下值: 'es3', 'es5', 'es6', 'es2015', 'es2016', 'es2017', 'es2018', 'es2019', 'es2020', 'es2021', 'esnext',
    target: "ES3",

    // module 模块化，指定要使用的模块化规范，也可以理解为生成代码的模版标准
    "module": "es2015",

    // lib, library库的简称，用来指定项目中使用的库，es5默认引用dom，es5，
    "lib": ["es6", "dom"]

    // outDir 用来指定编译后文件所在的目录
    "outDir": "./dist",

    // 将多个相互依赖的文件生成一个文件，可以用在 AMD 模块中，即开启时应设置 "module": "AMD"
    "outFile": "./app.js",

    // 是否对js代码进行编译，默认是false，比如编译器对 js，jsx文件进行编译
    "allowJs": false,

    // 是否检查js代码符合语法规范，默认值是false，一般和 allowJS 一起使用。
    "checkJs": false,

    // 是否删除注释
    "removeComments": true,

    // 不生成编译后的文件，即编译后不会生成任何js文件
    "noEmit": false,

    // 当有错误的时候 不生成编译后的文件
    "noEmitOnError": false,

    // 开启所有严格的类型检查
    "strict": true, 

    // 生成目标文件的sourceMap文件
    "sourceMap": true,

    // 生成目标文件的 inline SourceMap, inline SourceMap 会包含在生成的js文件中
    "inlineSourceMap": true,

    "declarationMap": true, // 为声明文件生成sourceMap

    "typeRoots": [], // 声明文件目录，默认时node_modules/@types

    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块

    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现

    "alwaysStrict": true, // 在代码中注入'use strict'

    "noImplicitAny": true, // 不允许隐式的any类型

    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量

    "strictFunctionTypes": true, // 不允许函数参数双向协变

    "strictPropertyInitialization": true, // 类的实例属性必须初始化

    "strictBindCallApply": true, // 严格的bind/call/apply检查

    "noImplicitThis": true, // 不允许this有隐式的any类型

    "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)

    "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)

    "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)

    "noImplicitReturns": true, //每个分支都会有返回值

    "esModuleInterop": true, // 允许export=导出，由import from 导入

    "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块

    "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入

    "types": [], // 加载的声明文件包

    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    
  }      
}
```

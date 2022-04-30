
### tsconfig.json配置详解

#### 一：什么是 tsconfig.json?

TypeScript 使用 tsconfig.json 文件作为其配置文件，当一个目录中存在 tsconfig.json文件，则认为该目录是TypeScript项目的根目录。
在命令行中使用 tsc 指令编译 TypeScript 项目时，编译器会自动从目录中寻找 tsconfig.json 文件，并且根据其中的配置信息对项目进行编译。
一般 tsconfig.json 文件主要包含两部分内容：指定待编译文件 和 定义编译选项。

#### 二：为什么要使用 tsconfig.json?

如果我们没有安装typescript的话，我们需要全局安装后就可以使用tsc命令了。如下安装：
```
$ sudo npm install -g typescript
```
一般我们可以使用 tsc 命令来编译少量的 TypeScript 文件。

```
$ tsc --outFile index.js --target es3 --module amd index.ts
```
```
--outFile:  编译后生成的文件名称。
--target: 指定ECMAScript目标版本。
--module: 指定生成那个模块系统代码。
index.ts: ts的源文件
```
但是如果在实际项目开发中，很少只有单个文件，当我们需要编译整个项目时，我们就可以使用 tsconfig.json文件，将需要使用到的配置都写进 tsconfig.json文件中。
这样就不用每次编译都手动输入配置。

#### 三：如何使用 tsconfig.json 配置文件？

#### 1. 初始化 tsconfig.json

在初始化操作，有2种方式：

1. 在项目的根目录手动创建 tsconfig.json 文件并且填写配置；
2. 通过 tsc --init 初始化 tsconfig.json 文件。

#### 2. 指定需要编译的目录

在不指定目录文件的情况下执行 tsc 命令，默认会从当前目录开始编译，编译所有的 .ts 文件, 并且从当前目录开始查找 tsconfig.json文件，并且逐渐向上级目录搜索.

```
$ tsc
```

另外我们也可以为 tsc 命令指定参数 --project 或 -p 指定需要编译的目录，该目录需要包含一个 tsconfig.json文件。比如如下：
```
// 文件目录

|---src/
| |--- index.ts
| |--- tsconfig.json
|---package.json

$ tsc --project src
```

#### 三： demo实践

#### 1. 初始化ts项目

执行下面的命令：
```
$ mkdir ts-demo
$ cd ts-demo
$ mkdir src
$ cd src
$ touch index.ts
```
目录结构变为如下：
```
|---te-demo
| |---src
| |---index.ts
```

src/index.ts 文件添加如下代码：
```
// 返回当前版本号

function getVersion(version:string = "1.0.0.") : string {
  return version;
}

console.log(getVersion("1.0.1"));
```

#### 2. 初始化 tsconfig.json 文件

在 ts-demo 项目的根目录下, 手动创建 tsconfig.json 文件。添加如下配置项：
```
{
  "compilerOptions": {
    "target": "ES5",             // 目标语言版本
    "module": "CommonJS",        // 指定生成代码的模版标准
    "noImplicitAny": true,       // 不允许隐式的 any 类型
    "removeComments": true,      // 删除注释
    "preserveConstEnums": true,  // 保留 const 和 enum 声明
    "sourceMap": true            // 生成目标文件的 sourceMap文件
  },
  "files": [ // 指定待编译的文件
    "./src/index.ts"
  ]  
}
```

files: 该配置项的值是一个数组，用来指定待编译的文件，即入口文件。

当入口文件依赖其他文件时，不需要将被依赖文件也指定到 files 中，因为编译器会自动将所有的依赖文件归纳为编译对象。即： index.ts 依赖 xxx.ts 时， 不需要在
files中指定 xxx.ts。xxx.ts会自动纳入待编译文件。

#### 3. 执行编译

配置完成后，我们可以在项目根目录下执行 tsc 命令，执行编译完成后，我们可以在 src 目录下 得到一个 index.js 文件 和 一个 index.js.map 文件。 证明我们编译成功了。
index.js 文件内容如下：

function getVersion(version) {
    if (version === void 0) { version = "1.0.0."; }
    return version;
}
console.log(getVersion("1.0.1"));
//# sourceMappingURL=index.js.map

如上可以看到，我们的注释被去掉了，说明我们的 tsconfig.json 中的 removeComments 配置项生效了。

#### 四： tsconfig.json 文件结构介绍

tsconfig.json 文件有以下几个顶层属性：
```
1. compileOnSave
2. compilerOptions
3. exclude
4. extends
5. files
6. include
7. references
8. typeAcquisition
```
#### 1. compileOnSave

设置保存文件的时候自动编译，需要编译器支持(让IDE在保存文件时候根据 tsconfig.json 重新生成文件)。 

```
{
  // ...
  "compileOnSave": false
}
```

#### 2. compilerOptions：

配置编译选项。

常见如下配置：
```
{
  // ...
  "compilerOptions": {
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
    "diagnostics": true, // 打印诊断信息 
    "target": "ES5", // 目标语言的版本
    "module": "CommonJS", // 生成代码的模板标准
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
    "allowJS": true, // 允许编译器编译JS，JSX文件
    "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "declaration": true, // 生成声明文件，开启后会自动生成声明文件
    "declarationDir": "./file", // 指定生成声明文件存放目录
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    "declarationMap": true, // 为声明文件生成sourceMap
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "types": [], // 加载的声明文件包
    "removeComments":true, // 删除注释 
    "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": true, // 发送错误时不输出任何文件
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "strict": true, // 开启所有严格的类型检查
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
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { // 路径映射，相对于baseUrl
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
    "listEmittedFiles": true, // 打印输出文件
    "listFiles": true// 打印编译的文件(包括引用的声明文件)
  }
}

```
#### 3. exclude

表示编译器需要排除的文件或文件夹，默认排除 node_mdoules 文件夹下文件。 常见配置：

```
{
 // ...
  "exclude": [
    "src/lib" // 排除src目录下的lib文件夹下的文件不会编译
  ]
}
```

和 include 属性一样，支持 glob 通配符：
```
* 匹配0或多个字符（不包括目录分隔符）

? 匹配一个任意字符（不包括目录分隔符）

**/ 递归匹配任意子目录
```
#### 4. extends: 

引入其他配置文件，继承该配置。 比如把基础配置抽离成 tsconfig.json文件，然后引入。 默认包含当前目录和子目录下所有 TypeScript 文件。 

```
{
 // ...
  // 把基础配置抽离成tsconfig.base.json文件，然后引入
 "extends": "./tsconfig.base.json"
}
```

#### 5. files: 表示编译需要编译的单个文件列表。默认包含当前目录和子目录下所有 TypeScript 文件。 
```
{
 // ...
  "files": [
    // 指定编译文件是src目录下的index.ts文件
    "scr/index.ts"
  ]
}
```
#### 6. include: 表示编译需要编译的文件或目录。

"src": 编译src目录下的所有文件和子目录。
"src/*": 只编译src一级目录下的文件。
"src/*/*": 只编译 src 二级目录下的文件。
```
{
 // ...
  "include": [
    // "scr" // 会编译src目录下的所有文件，包括子目录
    // "scr/*" // 只会编译scr一级目录下的文件
    "scr/*/*" // 只会编译scr二级目录下的文件
  ]
}
```
#### 7. references: 指定依赖的工程。 

在项目开发中，有时候我们为了方便将前端项目和后端node项目放在同一个目录下开发，两个项目依赖同一个配置文件和通用文件，但我们希望前后端项目进行灵活的分别打包，那么我们可以进行如下配置：
```
{
 // ...
  "references": [ // 指定依赖的工程
     {"path": "./common"}
  ]
}
```

#### 8. typeAcquisition

typeAcquisition 属性作用是设置自动引入库类型定义文件(.d.ts)相关。
包含 3 个子属性：

enable: 布尔类型，是否开启自动引入库类型定义文件(.d.ts)，默认为 false；

include: 数组类型，允许自动引入的库名，如：["jquery", "lodash"]；

exculde: 数组类型，排除的库名。
```
{
 // ...
  "typeAcquisition": {
    "enable": false,
    "exclude": ["jquery"],
    "include": ["jest"]
  }
}
```



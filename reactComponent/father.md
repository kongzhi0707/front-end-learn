
### 使用 father 搭建react组件库

#### 1) 使用create-react-app 生成 react 脚手架 father-app 项目

首先使用 create-react-app 生成一个react项目，执行如下命令：

$ sudo npm i -g npx
$ npx create-react-app father-app --template typescript
$ cd father-app
$ npm install --save typescript @types/node @types/react @types/react-dom @types/jest
$ npm start

项目重启后，可以看到一个react项目。

#### 2）安装Antd

npm install antd --save

#### 3) 安装 React Router

npm install --save react-router-dom @types/react-router-dom

#### 4）使用 eslint & prettier & husky 统一编码风格

安装依赖：

npm install -D eslint eslint-config-prettier eslint-config-react-app eslint-plugin-flowtype eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks lint-staged prettier husky

上面安装完成后，我们来看下项目的根目录下 tsconfig.json 配置文件，默认配置如下：

tsconfig.json，表示该项目支持 typeScript，编译器启动时会从目录中寻找 tsconfig.json 文件，并且根据其中的配置信息对项目进行编译。

配置如下：

{
  "compilerOptions": {
    "target": "es5",                            // 用来指定ts被编译为ES5版本
    "lib": [                                    // 库的简称，用来指定项目中使用的库
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,                            // 是否对js代码进行编译 
    "skipLibCheck": true,                       // 跳过类型检查所有.d.ts文件
    "esModuleInterop": true,                    // 允许export=导出，由import from 导入
    "allowSyntheticDefaultImports": true,       // 当一个模块没有默认导出时，允许'import x from y'
    "strict": true,                             // 开启所有严格的类型检查
    "forceConsistentCasingInFileNames": true,   // 强制文件名的大小写一致
    "noFallthroughCasesInSwitch": true,         // 在switch语句中启用故障案例的错误报告。
    "module": "esnext",                         // 模块化，指定要使用的模块化规范，也可以理解为生成代码的模版标准
    "moduleResolution": "node",                 // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "resolveJsonModule": true,                  // 启用.json文件导入
    "isolatedModules": true,                    // 确保每个文件都可以在不依赖其他导入的情况下安全地编译
    "noEmit": true,                             // 生成编译后的文件
    "jsx": "react-jsx"                          // 指定生成什么JSX代码
  },
  "include": [                                  // include用来指定src目录下的ts文件被编译
    "src"
  ]
}

#### 5）添加 .eslintrc 文件

在项目中的根目录添加 .eslintrc文件，指定我们想要支持的 Javascript 语言选项。

{
  "extends": "react-app",
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "vars": "all",
      "args": "after-used",
      "ignoreRestSiblings": false
    }]
  }
}

#### 6) 添加 .eslintignore 文件

在项目的根目录下创建一个 .eslintignore 文件来告诉 ESLint 去忽略特定的文件和目录，.eslintignore 文件是一个纯文本文件。其中的每一行glob模式表明哪些路径应该忽略检测。

node_modules/*

#### 7）添加 .prettierrc.js 文件

在项目的根目录下新建 .prettierrc.js 文件，创造一个适合我们团队代码配置。作用是：一键改变代码风格.

module.exports = {
  singleQuote: true,            // 使用单引号
  trailingComma: 'all',         // 行尾逗号,默认none,可选 none|es5|all ,es5 包括es5中的数组、对象  all 包括函数对象等所有可选
  printWidth: 100,              // 行宽
  proseWrap: 'never',           // 换行方式
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
  ],
};

#### 8）添加 .env 文件

在项目的根目录添加 .env 文件，作用是解决 alias 的问题。

NODE_PATH=src

#### 使用Less

安装如下依赖文件：

npm i -D react-app-rewired customize-cra babel-plugin-import less less-loader












### React+TypeScript 项目搭建

搭建一套 React+TypeScript 项目环境， 方便后续开发。

注意：我这边前端编辑器是使用 vscode 编码的。 

### 一：环境搭建

在相应的位置，创建空项目文件， 使用命令： mkdir react-typescript-staging

1. package.json

每一个项目根目录都需要一个package.json文件，它的作用是记录项目的配置信息，比如项目名称，包的入口文件，项目版本，项目所需要的各种依赖，scripts字段，指定了运行脚本命令的npm命令行缩写。

如下命令可以快速生成该文件：

npm init -y

2. .gitignore

在项目的根目录下 新建 .gitignore 文件， 该文件的作用是：git提交时所需要忽略掉的文件或文件夹。目前我这边忽略掉如下文件，后面有需要忽略可以自己继续添加，忽略的文件如下：

node_modules/
.DS_Store
build/
dist/

3. .npmrc

我们平时使用 npm 下载包时，由于服务器在国外，因此下载包，有时候速度非常慢，我们平时的做法可以设置npm源为淘宝镜像源，速度会变快。我们只需要在命令
行中执行如下命令：

npm config set registry https://registry.npm.taobao.org

但是假如之前没有设置过该淘宝源的话，当使用我们项目环境的时候，又要重新设置下会比较繁琐，因此为了不让用户繁琐，我们可以先在项目根目录下添加一恶搞 .npmrc 文件，并且做一些简单的配置即可：

# 在项目的根目录下 创建 .npmrc 文件
touch .npmrc

# 在该文件内输入配置
registry=https://registry.npm.taobao.org/

4. README.md

在项目的根目录下 新建 README.md，该文件可以编写一些项目配置环境的说明文档。

### 二：规范代码与提交

多人共同开发一个项目最大的问题就是代码风格各异，有的人习惯使用2个空格，有的人习惯使用4个空格，导致后续其他人维护代码越来越困难。因此我们从项目开始
就要定一个规则将大家编码的风格统一。这样最终的结果是：增强代码的可维护性。

1. EditorConfig

.editorconfig 是跨编辑器维护一致编码风格的配置文件。有的编辑器会默认集成读取该配置文件的功能，但是vscode需要安装相应的扩展 EditorConfig For vs Code.

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/react/master/images/1.png" />

安装完此扩展后，我们在项目的根目录下新建 .editorconfig 文件，然后我们在该文件下 添加如下配置：

# EditorConfig is awesome: https://EditorConfig.org

# 如果未指定 root = true，则 EditorConfig 将继续在项目外部查找 .editorconfig 文件。
root = true

# 以下配置适用文件类型，可对不同文件类型设置不同规则
[*.{js,jsx,ts,tsx,vue,scss,json}]

indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

扩展和配置都添加完成后，编辑器会首先去读取该配置文件，对缩进风格及缩进大小，按照我们上面的配置来。

indent_style：缩进风格，可选配置有 tab 和 space.
indent_size: 缩进大小，比如我们按 enter 键换行的时候，会按照该设置 2个空格换行。
end_of_line：换行符，可选配置有 lf ，cr ，crlf，会有三种的原因是因为各个操作系统之间的换行符不一致。许多有名的开源库都是使用 lf ，我们这边保持和他们一样。
charset：编码格式，一般选择 utf-8
trim_trailing_whitespace: 去除多余的空格，比如我们不小心在尾巴多打了一个空格，然后会帮我们自动去掉。
insert_final_newline：在尾部插入一行。

在以后缀md文件中，，以 .md 文件中把去除多余空格关掉了。

2. Prettier

EditorConfig 是帮我们统一编辑器的风格的，Prettier是帮我们统一项目风格的。因此我们需要安装 Prettier， 安装命令如下：

npm install prettier -D

安装成功后，需要在项目的根目录下新建文件 .prettierrc, 输入如下配置：

{
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "endOfLine": "lf",
  "printWidth": 120,
  "bracketSpacing": true,
  "arrowParens": "always"
}

下面解释下上面的各个配置项：

trailingComma：给对象的最后一个属性末尾添加 ， 比如 { a:1, b: 2 } 会被格式化为： { a: 1, b: 2, }。
tabWidth：缩进大小
semi：语句后面是否添加分号。
singleQuote: 是否单引号。
jsxSingleQuote：jsx语法是否单引号。
endOfLine：和上面的 .editorconfig 保持一致设置。
printWidth：单行代码最长字符长度，超过之后会自动格式化换行。
bracketSpacing：在对象中的括号之间打印空格，比如 {a:5} 被格式化为 { a: 5 }
arrowParens: 箭头函数的参数无论有几个，都需要括号包裹起来。

我们还需要安装扩展 Prettier - Code formatter。

当安装结束后，在项目的根目录下新建一个文件夹  .vscode, 在该文件夹下再建一个 settings.json 文件。

该文件的配置 优先于 vscode 全局的 settings.json。 当我们下载项目开发后，我们不会因为全局的 settings.json 的配置不同导致 Prettier 或
ESLint, StyleLint 失效。

.vscode/settings.json 添加如下配置项：

{
  // 指定哪些文件不参与搜索
  "search.exclude": {
    "**/node_modules": true,
    "dist": true,
    "yarn.lock": true
  },
  "editor.formatOnSave": true,
  "prettier.tabWidth": 2,
  "prettier.semi": true,
  "prettier.singleQuote": true,
  "prettier.printWidth": 120,

  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript|react]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript|react]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

3. ESLint

如上 EditorConfig 和 Prettier 是为了解决代码风格问题， 而 ESLint 是为了解决代码质量问题。它能在我们编写代码的时候就检测到程序是否符合规范。
我们还可以通过 eslint --fix 自动修复一些代码的写法问题。 比如 当我定义了 var name = 'kongzhi', 自动修复后变为 const name = 'kongzhi';
当无法自动修复时，会给出红线提示，强制开发人员为其寻求更好的解决方案。

首先我们需要在项目中安装eslint。安装命令如下：

npm install eslint -D

安装成功后，执行以下命令：

npx eslint --init

执行完上面的命令后， 需要回答如下问题：

1）How would you like to use ESLint?

我们选择第三条 To check syntax, find problems, and enforce code style ，检查语法、检测问题并强制代码风格。

2）What type of modules does your project use?

项目非配置代码都是采用的 ES6 模块系统导入导出，选择 JavaScript modules (import/export) 。

3）Which framework does your project use?

选择 React

4) Does your project use TypeScript?

选择 Yes 后生成的 eslint 配置文件会给我们默认配上支持 Typescript 的 parse 以及插件 plugins 等。

5) Where does your code run?

Browser 和 Node 环境都选上，之后可能会编写一些 node 代码。

6) How would you like to define a style for your project?

选择 Use a popular style guide ，即使用社区已经制定好的代码风格，我们去遵守就行。

7) Which style guide do you want to follow?

选择 Airbnb 风格，都是社区总结出来的最佳实践。

8) What format do you want your config file to be in?

选择 JavaScript ，即生成的配置文件是 js 文件，配置更加灵活。

9) Would you like to install them now with npm?

选择yes

如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/react/master/images/2.png" />

执行完成后，我们的项目根目录下会多出了新的文件 .eslintrc.js 文件。这就是我们的 eslint的配置文件了。默认的内容如下：

module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
  },
  "extends": [
    "plugin:react/recommended",
    "airbnb"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {}
}

上面的各个属性的具体含义可以到 <a href="https://eslint.bootcss.com/docs/user-guide/configuring">查看文档</a>了解下，

我们需要对上面配置作以下修改：

1）如果我们要开启 React Hooks 的检查，我们需要在 extends 中添加一项 "airbnb/hooks";
2) 根据 <a href="https://www.npmjs.com/package/@typescript-eslint/eslint-plugin">@typescript-eslint/eslint-plugin</a> 官方说明，在 extends 中添加 'plugin:@typescript-eslint/recommended' 可开启针对 ts 语法推荐的规则定义。
3) 添加以下规则到 rules 即可：

rules: {
  'import/extensions': [
    ERROR,
    'ignorePackages',
    {
      ts: 'never',
      tsx: 'never',
      json: 'never',
      js: 'never',
    },
  ],
}

接下来安装 2 个社区中比较火的 eslint 插件：

eslint-plugin-promise ：让你把 Promise 语法写成最佳实践。
eslint-plugin-unicorn ：提供了更多有用的配置项，比如我会用来规范关于文件命名的方式。

执行以下命令进行安装：

npm install eslint-plugin-promise eslint-plugin-unicorn -D

npm install typescript -D

因此 最后的 .eslintrc.js 配置文件最终为如下：

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'unicorn', 'promise', '@typescript-eslint', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
      typescript: {},
    },
  },
  rules: {
    'import/extensions': [
      ERROR,
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
    'import/prefer-default-export': OFF,
    'import/no-unresolved': ERROR,
    'import/no-dynamic-require': OFF,

    'unicorn/better-regex': ERROR,
    'unicorn/prevent-abbreviations': OFF,
    'unicorn/filename-case': [
      ERROR,
      {
        cases: {
          // 中划线
          kebabCase: true,
          // 小驼峰
          camelCase: true,
          // 下划线
          snakeCase: false,
          // 大驼峰
          pascalCase: true,
        },
      },
    ],
    'unicorn/no-array-instanceof': WARN,
    'unicorn/no-for-loop': WARN,
    'unicorn/prefer-add-event-listener': [
      ERROR,
      {
        excludedPackages: ['koa', 'sax'],
      },
    ],
    'unicorn/prefer-query-selector': ERROR,
    'unicorn/no-null': OFF,
    'unicorn/no-array-reduce': OFF,

    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/no-empty-function': WARN,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-use-before-define': ERROR,
    '@typescript-eslint/no-unused-vars': WARN,
    'no-unused-vars': OFF,

    'react/jsx-filename-extension': [ERROR, { extensions: ['.tsx', 'ts', '.jsx', 'js'] }],
    'react/jsx-indent-props': [ERROR, 2],
    'react/jsx-indent': [ERROR, 2],
    'react/jsx-one-expression-per-line': OFF,
    'react/destructuring-assignment': OFF,
    'react/state-in-constructor': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/prop-types': OFF,

    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,

    'lines-between-class-members': [ERROR, 'always'],
    // indent: [ERROR, 2, { SwitchCase: 1 }],
    'linebreak-style': [ERROR, 'unix'],
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'always'],
    'no-unused-expressions': WARN,
    'no-plusplus': OFF,
    'no-console': OFF,
    'class-methods-use-this': ERROR,
    'jsx-quotes': [ERROR, 'prefer-single'],
    'global-require': OFF,
    'no-use-before-define': OFF,
    'no-restricted-syntax': OFF,
    'no-continue': OFF,
  },
};

我们知道 eslint 由编辑器支持是有自动修复功能的，首先我们需要安装扩展：

再到之前创建的 .vscode/settings.json 中添加以下代码：

{
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "typescript.tsdk": "./node_modules/typescript/lib", // 代替 vscode 的 ts 语法智能提示
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
  },
}











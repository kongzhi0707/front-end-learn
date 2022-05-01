
### prettierrc文件常见配置

在项目的根目录创建 .prettierrc 文件，作用是：一键改变代码风格，无需改变开发风格。

#### 1）安装 Prettier

全局安装： 
```
npm install -g prettier
```
局部安装： 
```
npm install --save-dev --save-exact prettier
```

#### 2) 在项目的根目录下添加 .prettierrc.js 文件

常用配置代码如下：
```
// .prettierrc.js 文件

module.exports = {
  printWidth: 200, //行宽
  semi: true, //分号
  singleQuote: true, // 使用单引号
  useTabs: false, //使用 tab 缩进
  tabWidth: 2, //缩进
  trailingComma: 'es5', //后置逗号，多行对象、数组在最后一行增加逗号,  可选 none|es5|all ,es5 包括es5中的数组、对象  all 包括函数对象等所有可选
  arrowParens: 'avoid', //箭头函数只有一个参数的时候可以忽略括号
  bracketSpacing: true, //括号内部不要出现空格
  proseWrap: 'preserve', //换行方式 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  parser: 'babylon', //格式化的解析器，默认是babylon
  endOfLine: 'auto', // 结尾是 \n \r \n\r auto
  jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
  jsxBracketSameLine: false, //在jsx中把'>' 是否单独放一行
  stylelintIntegration: false, //不让prettier使用stylelint的代码格式进行校验
  eslintIntegration: false, //不让prettier使用eslint的代码格式进行校验
  tslintIntegration: false, // 不让prettier使用tslint的代码格式进行校验
  disableLanguages: ['vue'], // 不格式化vue文件，vue文件的格式化单独设置
  htmlWhitespaceSensitivity: 'ignore',
  ignorePath: '.prettierignore', // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  requireConfig: false, // Require a 'prettierconfig' to format prettier
}

```

#### 3) 在vscode编辑器中如何配置

安装插件 prettier-vscode。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/prettier/1.png" /> <br />

安装好后，在项目中的根目录新建 .prettierrc 配置文件，把上面的配置复制进去即可。
然后我们需要打开 vscode 的设置中 打开 settings.json 文件添加如下两条：

"editor.formatOnType":true,
"editor.formatOnSave": true,
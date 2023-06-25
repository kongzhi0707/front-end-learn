
### CSS Modules(模块化方案)

##### 1）概念

CSS Modules 并不是css官方的标准，也不是浏览器的特性，而是通过构建工具 (比如webpack) 的帮助，将class的名字或选择器的名字生成独一无二的命名，从而实现作用域的隔离。

CSS Modules 允许我们像 import 一个 JS Modules 一样去 import 一个 CSS Modules。 每一个css文件都是一个独立的模块，每一个类名都是该模块导出对象的一个属性。通过这种方式，我们可以在使用时明确指定所引用的css样式。并且，CSS Modules 在打包时会自动将id和class混淆成全局唯一的hash值。从而可以避免发生命名冲突的问题。

CSS Modules 特性：
```
1）作用域：模块中的名称默认都属于本地作用域，定义在 :local 中的名称也属于本地作用域，定义在 :global 中的名称属于全局作用域，全局名称不会被被编译成 哈希字符串。

2）命名：对于本地类名称，CSS Modules 建议使用 camelCase 方式来命名，这样会使JS文件更干净，即：styles.className. 但是我们也可以使用 style['class-name']，虽然允许这种写法，但是并不提倡。

3）组合：使用 composes 属性来继承另一个选择器的样式。和 sass 的 @extend 规则类似。

4）变量：使用 @value 来定义变量，不过我们需要安装 PostCSS 的 postcss-modules-values 插件。
```
#### 2）为什么要使用 css modules ？CSS Modules 为我们解决了什么痛点？
```
1）解决了命名冲突和全局样式污染问题. 因为 css modules 只关注于组件本身，只要保证组件本身命名不冲突，就不会有任何问题。
2）解决了css选择器嵌套过深的问题.  因为 css Modules 只关注于组件本身，组件本身基本都可以使用扁平的类名来编写。
3）样式模块化。 一个css文件就是一个独立的模块。
```
CSS Modules 是通过构建工具进行编译打包的，所以我们不局限于 React, Vue or Angular.

Create React App 创建的react项目中，默认是开启的 CSS Modules的，但是对于样式文件的命名有一个约束，需要以 .module.less/css/sass 结尾。

我们也可以通过如下的webpack配置来启用 CSS Module, 来支持 .css 文件的后缀。 配置如下：
```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true //每次打包前清空目录
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src'),
      },
      // 启用 css module 模块
      {
        test: /\.css$/,
        use:[
          'style-loader',
          {
            loader: "css-loader",
            options: {
              // modules: true,
              // 定制hash类名
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          }
        ],
        exclude: /styles/
      },
      // 不启用 css module 模块
      {
        test: /\.css$/,
        use:[
          'style-loader',
          'css-loader'
        ],
        include: /styles/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.html')
    })
  ],
  devServer: {
    port: 8080, // 端口
    open: true, // 自动打开
    compress: true //启用gzip压缩
  }
}
```

#### 3) CSS Modules 特性

#### 3.1）作用域

CSS Modules 分为 局部作用域 和 全局作用域。

两者的区分是通过 :local() 和 :global() 来区分的。CSS Modules 默认的是局部作用域，所以 :local()默认可以省略。 CSS Modules使用 :global(.className)的语法，声明一个全局规则。只要这样声明的class，都不会被编译成哈希字符串，使用全局样式时直接赋值给class就可以了，不需要进行类绑定。

##### 局部作用域的demo
```
// JSX 代码如下：

import React from 'react';
import style from './index.css';

const Index = () => {
  return (
    <div className={style.title}>
      Content title
      <div className="test">test</div>
    </div>
  )
}

export default Index;

// CSS 代码如下：

// 局部作用域 
.title {
  color: #983636;
  font-size: 40px;
}
.test {
  font-size: 50px;
  color: blue;
}
```
编译后效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/2.png" /> <br />

但是我们的类名为test，css样式也有，但是没有引用的话，是不生效的，比如如下 test 的类名是在css是没有的。也就是说在 index.css 文件 启用 css module。index.css 编译，在js中使用 .test 样式失效. 如下 没有 test 样式。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/3.png" /> <br />

##### 全局作用域的demo
```
// jsx

import React from 'react';
import style from './index.css';

const Index = () => {
  return (
    <div>
     <div className={style.header}>
       <h4 className='title2'>全局作用域</h4>
      </div>
      <div className="title2">外面的全局作用域是否生效</div>
    </div>
  )
}
export default Index;

// 全局作用域

.header :global(.title2) {
  font-size: 36px;
  text-align: center;
}
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/4.png" /> <br />

如上可以看到有样式， 但是我们在外面编写的 title2 是没有样式的，可以看如下 效果。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/5.png" /> <br />

因此我们理解为，在 类名为 header 作用域下的 全局样式生效。局限范围在 header 类名下使用全局的样式，不用在JS文件中编写类似的 styles.xxx 样式名。

#### 3.2) 命名

对于局部类名称，CSS Modules 更推荐以 驼峰式 camelCase 命名方式定义类名，即：styles.className. 我们也可以使用 styles['class-name'] 这种方式，但是不提倡使用。

#### 3.3）class 类名组合

CSS Modules 可以将两个选择器的样式组合在一起。也就是说，一个选择器可以继承另一个选择器的样式，通过 composes 来实现。

##### 1）组合当前样式表的class。
```
import React from 'react';
import style from './index.css';

const Index = () => {
  return (
    <div className={style.currentComposes}>
      类名组合-当前css文件
    </div>
  )
}

export default Index

// css 

/* 类名组合 当前css文件 */
.fontSize {
  font-size: 40px;
}

.currentComposes {
  composes: fontSize;
  text-align: center;
}
```
编译后的css效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/6.png" /> <br />

##### 2）组合其他样式表的 class
```
import React from 'react';
import style from './index.css';

const Index = () => {
  return (
    <div className={style.otherComposes}>类名组合 其他css文件</div>
  )
}

export default Index

/* another.css */
.text-align {
  text-align: center;
}

/* 类名组合 其他css文件 */
.otherComposes {
  font-size: 24px;
  composes: text-align from '../../another.css';
}
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/7.png" /> <br />

#### 3.4）变量

使用 @value 来定义变量
```
import React from 'react';
import style from './index.css';

const Index = () => {
  return (
    <div className={style.value}>变量</div>
  )
}

export default Index

/* 变量 */
@value colors: '../../../styles/colors.css';
@value v-primary, v-bg-color from colors;
@value v-size: 36px;

.value {
  color: v-primary;
  background-color: v-bg-color;
  font-size: v-size;
}
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/8.png" /> <br />

当然我们也可以将 CSS Modules 和 sass/less 进行组合使用， 可以有 Sass/Less 的CSS预处理能力, 又可以拥有 CSS Modules 提供的局部作用域的能力。避免全局污染。







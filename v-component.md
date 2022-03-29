
### 实现Vue组件库

需要实现如下几个功能点：组件测试/文档生成/自定义主题/按需加载/vue组件数据通信/webpack打包

我们的Vue组件库的项目目录结构可能如下这样的

｜--- assets                  // 存放一些资源文件，比如 图片之类的
｜--- build                   // webpack的打包配置，比如 webpack.base.js/webpack.prod.js 存放在该目录下
｜--- docs                    // 存放文档
｜ ｜--- .vuepress            // vuepress 配置目录
｜ ｜--- component            // 组件相关的文档放在这里
｜ ｜--- README.md            // 静态首页
｜--- lib                     // 打包后生成的文件放在这里 
｜ ｜--- styles               // 打包后的样式文件放在该目录下
|  |--- 更多 js组件文件        // lib下会存放打包后的更多js文件
｜--- src                     // src目录存放入口文件 和 基础文件都放在这里
｜ ｜--- mixins               // minxin 文件
｜ ｜--- packages             // 各个组件，每个组件是一个子目录
｜ ｜--- styles               // 打包后的样式文件
｜ ｜ ｜--- common            // 公用的样式内容
｜ ｜ ｜--- mixins            // 复用的mixin
｜ ｜--- utils               // utils 一般存放工具目录
｜ ｜--- index.js            // 入口文件，打包的入口
|--- test                   // 测试文件的目录
| |--- specs                // 存放所有的测试用例
|--- .npmignore
|--- .gitignore
|--- .babelrc
|--- README.md
|--- package.json

如上就是我们的Vue组件库的目录架构如上所示。

一：了解Vue组件通信

我们编写组件或组件库的时候，组件之间通信肯定是需要的，组件通信的方法有哪些呢？在Vue中，父组件向子组件传递数据使用 props传递，那么子组件向父组件传递使用 $emit 来触发事件将数据传递给父组件即可。或者通过Vuex 或 eventBus来处理，但是我们如何处理 跨级组件之间的数据通信呢？跨级通信其实我们可以使用Vuex实现的，但是Vuex是一个外部依赖包，我们组件库设计肯定不希望依赖其他的包，打包的时候会导致文件体积变大的。

#### 1）内置的provide/inject

provide/inject 是Vue自带的可以跨级从子组件中获取父级组件数据的一套方案。该两个属性是一起使用的。它允许一个祖先组件向其所有子孙后代组件注入一个依赖，不论组件
层次有多深。详情可以看我之前的文章 <a href="https://www.cnblogs.com/tugenhua0707/p/11761280.html#_labe6">provide/inject用法</a>

#### provide/inject 优点：

允许一个祖先组件向其所有子孙后代组件注入一个依赖，换句话说，祖先组件可以跨级(不论组件层次有多深)，把数据传递给子组件。

#### provide/inject 缺点：

不能解决子组件跨级传递数据给父级组件。

#### 2）使用bus总线

bus 总线可用于解决跨级或兄弟组件通信的问题，了解更多，可以看 <a href="https://www.cnblogs.com/tugenhua0707/p/11761280.html#_labe7">了解使用bus总线</a> 

但是BUS总线也存在问题：比如 在 this.bus.on 回调函数中 this.msg = c; 改变值后，视图并不会重新渲染更新。具体详情可以看我上面的文章。

#### 3）派发和广播，自制dispatch和broadcast功能

dispatch 和 broadcast 可以用来做父子组件之间跨级通信。

dispatch 会派发一个事件，该事件首先会在自己这个组件实例上去触发，然后会沿着父级链一级一级的往上冒泡，直到触发了某个父级中声明的对这个事件的监听器后就停止(但是该监听器需要返回true)。类似于我们DOM中的事件冒泡机制。

broadcast 就是将事件广播到自己的所有子组件实例上。一层一层的往下走，由于组件树的原因，往下走的过程会遇到分叉，我们也可以看成是一条条的多路径，事件会沿着每一个
子路径向下冒泡，每个子路径如果触发了监听器就停止。但是如果监听器返回的是true，那就继续向下再传播。

#### 总结：dispatch派发事件往上冒泡，broadcast广播事件往下传递，遇到对应的事件监听器就处理，如果监听器返回的是true，就继续向下传播，否则就停止。

派发和广播事件都是可以跨层级的，并且还可以携带参数。因此 dispatch 和 broadcast 可以跨级进行数据通信。

因此我们可以写一个 dispatch和broadcast，然后我们通过 mixin的方法混入到需要使用到跨级组件通信的组件中。

因此 在我们项目中 src/mixins 下创建一个 emitter.js 文件，把 dispatch 和 broadcast的方法加进去。如下代码：

src/mixins/emitter.js

function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

然后我们在 src/utils 下新建一个 assist.js, 一些简单的工具函数，代码如下：

src/utils/assist.js 代码如下：

export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

#### 二：完成打包流程

我们需要在我们的项目的build目录下建立三个文件 webpack.base.js(存放基本的rule配置)/webpack.prod.js（组件库的打包配置）/ gen-style.js（单独对样式进行打包）。

#### build/webpack.base.js 配置代码如下：

/**
 * 公共配置
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  // 加载器
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
            less: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
          postLoaders: {
            html: 'babel-loader?sourceMap'
          },
          sourceMap: true,
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          sourceMap: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),

    // webpack.DefinePlugin 是用来定义全局变量的
    new webpack.DefinePlugin({
      'process.env.VERSION': `'${pkg.version}'`
    }),
    new VueLoaderPlugin()
  ]
};

#### build/webpack.prod.js 配置代码如下：

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.js');

process.env.NODE_ENV = 'production';

module.exports = merge(webpackBaseConfig, {
  devtool: 'source-map',
  mode: "production",
  entry: {
    main: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/lib/',
    filename: 'v-component-ui.min.js',
    library: 'v-component-ui',
    libraryTarget: 'umd', 
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
});

上面的 build/webpack.prod.js 的配置代码的含义，首先合并 build/webpack.base.js 代码，打包的入口文件是 src/index.js. 
output.path: 输出的目录为 当前项目下的 lib/ 文件夹内。
output.publicPath: 当浏览器需要引用输出文件时，该配置项指定输入文件的公共url地址。该地址为 '/lib/'下的文件。
output.filename: 指定每一个输出文件的文件名。上面的库文件名为：'v-component-ui.min.js'。
output.library: 库的名字为：v-component-ui
out.libraryTarget = 'umd'; 格式化导出库。在AMD和CommonJS两个流行而不统一的规范情况下，才催生出umd来统一规范的，UMD前后端均可用。
out.umdNamedDefine = true; 如果 output.libraryTarget 设置为umd 而且output.library 也设置了。这个设为true，将为AMD模块命名。

上面的 externals 的配置：

externals: {
  vue: {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue'
  }
},

externals 可以告诉webpack在javascript运行环境中已经内置了哪些全局变量，不应将vue代码打包到代码里面去。详情可以看 <a href="https://www.cnblogs.com/tugenhua0707/p/9384953.html#_labe2_8">理解Externals</a>

#### build/gen-style.js 代码如下：

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const components = require('./components.json')

function buildCss(cb) {
  gulp.src('../src/styles/index.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename('v-component-ui.css'))
    .pipe(gulp.dest('../lib/styles'));
  cb()
}

function buildSeperateCss(cb) {
  Object.keys(components).forEach(compName => {
    gulp.src(`../src/styles/${compName}.scss`)
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(rename(`${compName}.css`))
      .pipe(gulp.dest('../lib/styles'));
  })

  cb()
}

exports.default = gulp.series(buildCss, buildSeperateCss);

如上 build/gen-style.js 使用了gulp对样式文件进行打包。
buildCss 方法中 找到 src/styles/index.scss 文件进行一些列处理后，进行重命名为：v-component-ui.css，然后放到目标目录 lib/styles文件夹内。

然后在 build/components.json 中会维护各个组件的包名对应的路径；比如如下代码：

{
  "button": "packages/button/index.js",
  "form": "packages/form/index.js",
  "form-item": "packages/form-item/index.js",
  "input": "packages/input/index.js",
  "notice": "packages/notice/notice.js"
}

如上json数据，在 buildSeperateCss 方法中，遍历 组件 components，比如 key 为 button 或 form 或 form-item 或 input 或 notice, 因此 buildSeperateCss 函数会找到 src/stles/button.scss, src/stles/form.scss, src/stles/form-item.scss, src/stles/input.scss, src/stles/notice.scss 等源文件的样式文件，然后通过一些列处理，最终打包到 项目的根目录下的 lib/styles 文件目录下。这样做的目的是为了解决将样式和组件进行单独打包成单个文件。单独打包css文件 及 单独打包vue组件。因此我们上面添加了 buildSeperateCss 任务。

#### 那么如何单独打包vue组件呢？

因此我们可以在 build文件夹内，新建一个 webpack.component.js 文件。配置代码如下：

build/webpack.component.js 配置代码如下：

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.js');
const components = require('./components.json')
process.env.NODE_ENV = 'production';

const basePath = path.resolve(__dirname, '../')
let entries = {}
Object.keys(components).forEach(key => {
  entries[key] = path.join(basePath, 'src', components[key])
})

module.exports = merge(webpackBaseConfig, {
  devtool: 'source-map',
  mode: "production",
  entry: entries,
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/lib/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    // library: 'v-component-ui',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
});

如上 build/webpack.component.js 配置也引入了 components.json 文件，该文件是我们自己自定义用来标识我们的组件和组件路径的。因此我们的入口文件 entries就是多入口文件了，比如变成类似这样的;
entries = {
  "button": "./src/packages/button/index.js",
  "form": "./src/packages/form/index.js",
  "form-item": "./src/packages/form-item/index.js",
  "input": "./src/packages/input/index.js",
  "notice": "./src/packages/notice/index.js",
  // ..... 更多入口文件
}

最终我们会打包到 lib/ 目录下。因此 lib文件目录下会有 button.js/form.js/form-item.js/input.js/notice.js. 及对应的map映射源文件，button.js.map/form.js.map/form-item.js.map/input.js.map/notice.js.map; 

因此上面的单独打包流程配置完成后，我们就可以在 package.json文件加上 scripts命令：

{
  "scripts": {
    "build:style": "gulp --gulpfile build/gen-style.js",
    "build:prod": "webpack --config build/webpack.prod.js",
    "build:components": "webpack --config build/webpack.component.js",
    "dist": "npm run build:style && npm run build:prod && npm run build:components",
  }
}

如上命令；npm run build:style 执行后，会把 src/styles/index.scss 及 各个组件的scss样式文件打包到 lib/styles 文件夹内。其中 src/styles/index.scss 会被重新命名为 lib/styles/v-component-ui.css文件，其他的文件名不变。

npm run build:components 执行该命令后，就会把 src/packages/button/index.js 或 src/packages/form/index.js 或 src/packages/form-item/index.js 或 src/packages/input/index.js 或 src/packages/notice/index.js 打包到 lib 目录下对应的文件名。

因此最终当我们执行 npm run dist 命令后，就会包含上面三种命令一起的，它会自动构建完整的样式及js和各个组件单独的样式及js。最终在lib目录下会生成一个完整的组件
包及各个组件的单独的包。

上面完成这些后，我们的项目的目录结构就变成如下了

|--- v-component-ui
| |--- build
| | |--- webpack.base.js                    # webpack基本的配置文件
| | |--- webpack.component.js               # 单独打包vue组件到lib文件夹内
| | |--- webpack.prod.js                    # 构建线上打包
| | |--- gen-style.js                       # 把 src/styles/index.scss 及 各个vue单独的样式打包到 lib文件夹内
| | |--- components.json                    # 维护各个组件的包名及对应的路径
| |--- lib                                  # 打包后生成的文件
| |--- src                                  # 源文件目录
| | |--- mixins
| | | |--- emitter.js                       # dispatch和broadcast组件通信功能
| | |--- packages                           # packages 存放各个组件包，各个包下存放 对应的vue文件 和 index.js文件
| | | |--- button                           # button组件包
| | | | |--- bitton.vue
| | | | |--- index.js
| | | |--- form                             # form组件包
| | | | |--- form.vue
| | | | |--- index.js
| | | |--- form-item                        # form-item组件包
| | | | |--- form-item.vue
| | | | |--- index.js
| | | |--- input                            # input组件包
| | | | |--- input.vue
| | | | |--- index.js
| | | |--- notice                           # notice 组件包
| | | | |--- notice.vue
| | | | |--- index.js
| | |--- styles                             # 各个组件包的样式
| | | |--- common                           # 公用的样式
| | | |--- mixins                           # 混合css
| | | |--- button.scss                      # button.scss组件样式
| | | |--- form.scss                        # form.scss组件样式
| | | |--- form-item.scss                   # form-item.scss组件样式
| | | |--- input.scss                       # input.scss组件样式
| | | |--- notice.scss                      # notice.scss组件样式
| | | |--- index.scss                       # index.scss 包含各个组件样式
| | |--- utils                              # 公用的js方法可以在该目录下新建
| | | |--- assist.js
| | |--- index.js                           # 入口文件 src/index.js
| |--- package.json                         # package.json 依赖包
| |--- README.md
| |--- .babelrc                             # babel 配置

如上是项目目前整个目录架构初步结构。

#### package.json 安装依赖包

下面是项目中用到的所有依赖包：

"dependencies": {
  "async-validator": "^3.0.4",
  "core-js": "2.6.9",
  "webpack": "^4.39.2",
  "webpack-cli": "^3.3.7"
},
"devDependencies": {
  "@babel/core": "^7.5.5",
  "@babel/plugin-transform-runtime": "^7.5.5",
  "@babel/preset-env": "^7.5.5",
  "@vue/test-utils": "^1.0.0-beta.29",
  "babel-loader": "^8.0.6",
  "chai": "^4.2.0",
  "cross-env": "^5.2.0",
  "css-loader": "2.1.1",
  "file-loader": "^4.2.0",
  "gh-pages": "^2.1.1",
  "gulp": "^4.0.2",
  "gulp-autoprefixer": "^7.0.0",
  "gulp-clean-css": "^4.2.0",
  "gulp-rename": "^1.4.0",
  "gulp-sass": "^4.0.2",
  "karma": "^4.2.0",
  "karma-chai": "^0.1.0",
  "karma-chrome-launcher": "^3.1.0",
  "karma-coverage": "^2.0.1",
  "karma-mocha": "^1.3.0",
  "karma-sinon-chai": "^2.0.2",
  "karma-sourcemap-loader": "^0.3.7",
  "karma-spec-reporter": "^0.0.32",
  "karma-webpack": "^4.0.2",
  "less": "^3.10.2",
  "less-loader": "^5.0.0",
  "mocha": "^6.2.0",
  "node-sass": "^4.12.0",
  "rimraf": "^3.0.0",
  "sass-loader": "^7.3.1",
  "sinon": "^7.4.1",
  "sinon-chai": "^3.3.0",
  "style-loader": "^1.0.0",
  "url-loader": "^2.1.0",
  "vue-loader": "^15.7.1",
  "vue-style-loader": "^4.1.2",
  "vuepress": "^1.0.3"
},

如上的依赖包，我们可以直接复制所有的到我们package.json中，然后在项目的根目录执行命令 npm install 来进行安装依赖包。

#### .babelrc配置代码

我们使用了babel，因此需要在我们的项目的根目录添加 .babelrc 文件，配置代码如下：

{
  "presets": [
    [
      "@babel/preset-env",
      {
        "loose": false,
        "modules": "commonjs",
        "spec": true,
        "useBuiltIns": "usage",
        "corejs": "2.6.9"
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
  ]
}

#### 公用样式

1）src/styles/common/var.scss

我们需要在 src/styles/common 下新建 var.scss，该文件的作用是 定义样式变量文件；基本代码如下：

类似的代码如下：

$--color-primary: #ff6b00 !default;
$--color-white: #FFFFFF !default;
$--color-info: #409EFF !default;
$--color-success: #67C23A !default;
$--color-warning: #E6A23C !default;
$--color-danger: #F56C6C !default;

2) src/styles/mixins/mixins.scss

$namespace: 'v-component';

/* BEM
 -------------------------- */
@mixin b($block) {
  $B: $namespace+'-'+$block !global;

  .#{$B} {
    @content;
  }
}

#### 三：编写Vue组件

button组件

在 src/packages 新建 button 文件，然后 在该文件内 新建 button.vue 和 index.js 文件。

src/packages/button/button.vue 代码如下：

<template>
  <button class="lime-button" :class="{[`lime-button-${type}`]: true}" type="button">
    <slot></slot>
  </button>
</template>

<script>
import { oneOf } from '../../utils/assist';

export default {
  name: 'button',
  props: {
    type: {
      validator (value) {
        return oneOf(value, ['default', 'primary', 'dashed', 'text', 'info', 'success', 'warning', 'error']);
      },
      type: String,
      default: 'default'
    },
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default']);
      },
      default: 'default'
    }
  }
}
</script>

index.js 中是导出这个button组件。代码如下：

src/packages/button/index.js 

import Button from './button.vue'
export default Button

如上就是编写vue组件的格式，那么其他的组件也是一样的风格，这里不多介绍其他组件业务相关的代码了。

我们可以假如编写了类似 button 或 form 或 form-item 或 input 或 notice 这些组件，和上面的讲解对应起来。如上vue组件编写完成后，我们需要一个统一的入口文件。我们之前在webpack配置过，就是 src/index.js 就是我们的入口文件。那么在该 src/index.js 文件内部需要把我们刚刚写的button组件或其他组件都引入进来。然后统一导出给webpack打包使用。

#### 入口文件 src/index.js

src/index.js 代码如下：

import Button from './packages/button'

const components = {
  vButton: Button,
}

const install = function (Vue, options = {}) {

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
  });
}

export default install;

如上就是我们的 src/index.js 最终导出的是一个叫 install的函数，该函数是Vue插件的一种写法，便于我们在项目中引入的时候可以使用 Vue.use的方式来自动安装我们的整个组件库。 install接收二个参数，第一个参数是Vue，我们把它用来注册一个组件，还有一个是options，方便我们在注册组件的时候传入一些初始化参数。

#### 编写 src/styles/button.scss 组件样式

src/styles/button.scss 组件样式 代码如下：

/* button.scss */
@charset "UTF-8";
@import "common/var";
@import "mixins/mixins";

@include b(button) {
  min-width: 60px;
  height: 36px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  border-width: 1px;
  border-radius: 4px;
  outline: none;
  border: 1px solid transparent;
  padding: 0 10px;

  &:active,
  &:focus {
    outline: none;
  }

  &-default {
    color: #333;
    border-color: #555;

    &:active,
    &:focus,
    &:hover {
      background-color: rgba($--color-primary, 0.3);
    }
  }
  &-primary {
    color: #fff;
    background-color: $--color-primary;

    &:active,
    &:focus,
    &:hover {
      background-color: mix($--color-primary, #ccc);
    }
  }

  &-info {
    color: #fff;
    background-color: $--color-info;

    &:active,
    &:focus,
    &:hover {
      background-color: mix($--color-info, #ccc);
    }
  }
   &-success {
    color: #fff;
    background-color: $--color-success;

    &:active,
    &:focus,
    &:hover {
      background-color: mix($--color-success, #ccc);
    }
  }
}

最后在我们总的入口样式文件 src/styles/index.scss 文件中将 button的样式引入进去

// src/styles/index.scss 代码如下

@import "button";

那么其他的样式文件也是这种方式引入哦。

#### Notice提示组件

我们再来看一个Notice提示组件，该组件和上面的button组件有所区别。该组件用到我们的动态渲染相关的东西。我们希望该组件如下使用方式：

this.$notice({
  title: '提示',
  content: this.content || '内容',
  duration: 3
})

因此我们需要在我们的 src/packages 目录下新建notice文件夹，然后新建一个 notice.vue 和 index.js。

// src/packages/notice/notice.vue

<template>
  <div class="lime-notice">
    <div class="lime-notice__main" v-for="item in notices" :key="item.id">
      <div class="lime-notice__title">{{item.title}}</div>
      <div class="lime-notice__content">{{item.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notices: []
    }
  },
  methods: {
    add(notice) {
      let id = +new Date()
      notice.id = id
      this.notices.push(notice)
      const duration = notice.duration
      setTimeout(() => {
        this.remove(id)
      }, duration * 1000)
    },
    remove(id) {
      for(let i = 0; i < this.notices.length; i++) {
        if (this.notices[i].id === id) {
          this.notices.splice(i, 1)
          break;
        }
      }
    }
  }
}
</script>

<style>
</style>

src/packages/notice/index.js 就是使用动态渲染。

// src/packages/notice/index.js 代码如下

import Vue from 'vue'
import Notice from './notice.vue'

Notice.newInstance = (properties) => {
  let props = properties || {}
  const Instance = new Vue({
    render(h) {
      return h(Notice, {
        props
      })
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)

  const notice = component.$children[0]

  return {
    add(_notice) {
      notice.add(_notice)
    }, 
    remove(id) {

    }
  }
}

let noticeInstance


export default (_notice) => {
  noticeInstance = noticeInstance || Notice.newInstance()
  noticeInstance.add(_notice)
}

我们通过动态渲染的方式让我们的组件可以直接挂在到body下面。

然后在 src/styles 目录下新建 notice.scss 文件，写上我们的样式文件。

// src/styles/notice.scss

/* notice.scss */
@charset "UTF-8";
@import "common/var";
@import "mixins/mixins";

@include b(notice) {
  position: fixed;
  right: 20px;
  top: 60px;
  z-index: 1000;

  &__main {
    min-width: 100px;
    padding: 10px 20px;
    box-shadow: 0 0 4px #aaa;
    margin-bottom: 10px;
    border-radius: 4px;
  }

  &__title {
    font-size: 16px;
  }
  &__content {
    font-size: 14px;
    color: #777;
  }
}

最后也是一样，我们需要在入口文件 src/index.js 加上对 notice组件的处理，完整代码如下：

import Button from './packages/button'
import Notice from './packages/notice/index.js';

const components = {
  lButton: Button
}

const install = function (Vue, options = {}) {

  Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
  });

  Vue.prototype.$notice = Notice;
}

export default install;

我们可以看到我们再Vue的原型上挂上了我们的 $notice 方法. 然后我们在页面上使用方式如下使用就可以了；

<script>
  export default() {
    mounted() {
      this.$notice({
        title: '提示',
        content: this.content,
        duration: 3
      })
    }
  }
<script>

#### 在其他项目测试使用

我们可以使用 vue-cli 生成一个demo项目，使用这个项目去引入我们的组件库，如果我们的包还没有发布出去，可以在我门的组件库项目的目录下使用 npm link
命令去创建一个link。比如我们的组件库为 v-component-ui, 因此可以在我们的组件库根目录下执行 npm link 命令。

#### 注意修改 package.json 中的几个字段

{
  "name": 'v-component-ui',
  "version": "1.0.0",
  "main": "lib/v-component-ui.min.js"
}

如上name代表别人使用我们的包的时候的包名，main：表示别人直接引入我们包的时候，入口文件是哪一个，这里我们在webpack打包后的文件是 lib/v-component-ui.min.js,
因此我们在main中填写这个就可以了。

然后在我们的demo项目的目录下使用 npm link package_name 这里的package_name就是我们的组件库的包名，然后在我们的demo项目
在入口App.vue 页面上引入包，如下代码：

import Vue from 'vue';

import VComponentUI from 'v-component-ui'; // 引入组件库
import 'v-component-ui/lib/styles/v-component-ui.css'; // 引入整个组件库的样式文件

Vue.use(VComponentUI); // 注册VComponentUI库

使用的方式如下使用

<template>
  <v-button type="primary">Click me</v-button>
</template>

#### 注意上面的演示是在Vue2.0+上，在vue3.0+换了一种方式注册。

#### 按需加载

上面我们实现的是全局载入的一种方式，下面我们实现组件按需加载，按需加载依赖 babel-plugin-component 包，因此需要在我们vue项目中安装该包，然后在我们项目中的 .babelrc文件中加上如下配置：

{
  "plugins": [
    ["component", {
      "libraryName": "v-component-ui",
      "libDir": "lib",
      "styleLibrary": {
        "name": "styles",
        "base": false, // no base.css file
        "path": "[module].css"
      }
    }]
  ]
}

有了上面的配置后，我们就可以在我们的vue项目中进行按需加载了，我们需要在 main.js 这样引入button包就可以了。

import Vue from 'vue'
import { button } from 'v-component-ui';
Vue.component('v-button', button);

然后在我们的App.vue 这样使用就可以了，如下代码：

<template>
  <div id="app">
    <v-button>click me</v-button>
  </div>
</template>

#### 文档生成

#### 自定义主题

#### 编写测试用例

























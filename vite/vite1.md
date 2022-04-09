
### 初识vite使用及工作机制

#### 一：什么是Vite？

在浏览器支持 ES Module模块之前，Javascript并没有提供原生机制让开发者以模块化的方式进行开发，比如在代码中 使用 import 导入模块时候，浏览器解析不了对应的js文件，因此这个时候就出现各类的打包工具，比如 webpack, Rollup 和 Parcel等。这些工具作用是 抓取，处理并将我们的源码模块串联成可以在浏览器中运行的文件。
但是当我们的项目变得越来越复杂的时候，js文件变得越来越多的时候，比如一个完整的项目有几千个js模块，这些工具构建的缺点就出现了，使用该工具打包耗时要很长时间，即使在开发阶段使用 HMR，文件修改后的效果也要几十秒的时候才能反映出来，如果一直这样开发，对我们的开发效率非常低。因此 vite 就是来解决这些问题的。

Vite 是一个基于浏览器原生 ES imports 的开发服务器。利用现代浏览器去解析 imports，会重启一个服务器端，在服务器端截取对应的js文件，按需编译返回，会跳过打包这么一个过程，同时支持热更新(HMR), 对于生产环境可以使用 rollup进行打包。

<a href="https://vitejs.cn/">vite官网</a>, 搭建第一个vite项目，可以<a href="https://vitejs.cn/guide/#scaffolding-your-first-vite-project">点击官网</a>

#### 二：构建一个 Vite + Vue 项目

# npm 6.x 版本的 使用如下方式创建
$ npm init vite@latest my-vue-app --template vue

# npm 7+, 需要额外的双横线
$ npm init vite@latest my-vue-app -- --template vue







### 初识vite使用及工作机制

#### 一：什么是Vite？

在浏览器支持 ES Module模块之前，Javascript并没有提供原生机制让开发者以模块化的方式进行开发，比如在代码中 使用 import 导入模块时候，浏览器解析不了对应的js文件，因此这个时候就出现各类的打包工具，比如 webpack, Rollup 和 Parcel等。这些工具作用是 抓取，处理并将我们的源码模块串联成可以在浏览器中运行的文件。

通俗的话说，就是在过去使用webpack，Rollup等构建工具，我们所写的代码一般都是基于ES Module 规范，在文件中通过 import 和 export 会形成一个很大的依赖图，这些工具在我们本地开发调试的时候，会提前把我们的模块先打包成浏览器可读取的js bundle。但是当我们的项目变得越来越复杂的时候，js文件变得越来越多的时候，比如一个完整的项目有几千个js模块，这些工具构建的缺点就出现了，使用该工具打包耗时要很长时间，即使在开发阶段使用 HMR，文件修改后的效果也要几秒甚至几十秒的时候才能反映出来，如果一直这样开发，对我们的开发效率非常低。因此 vite 就是来解决这些问题的。

Vite 是一个基于浏览器原生 ES imports 的开发服务器。利用现代浏览器去解析 imports，会重启一个服务器端，在服务器端截取对应的js文件，按需编译返回，会跳过打包这么一个过程，同时支持热更新(HMR), 对于生产环境可以使用 rollup进行打包。

<a href="https://vitejs.cn/">vite官网</a>, 搭建第一个vite项目，可以<a href="https://vitejs.cn/guide/#scaffolding-your-first-vite-project">点击官网</a>

#### 二：构建一个 Vite + Vue 项目
```
// npm 6.x 版本的 使用如下方式创建
$ npm init vite@latest my-vue-app --template vue

// npm 7+, 需要额外的双横线
$ npm init vite@latest my-vue-app -- --template vue

```
如上我们选择vue作为模版。

下载完成后，我们 进入 my-vue-app 项目，执行 npm install 后，执行 npm run dev 命令启动我们的项目。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/1.png"/>

然后我们可以查看项目的文件目录如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/2.png"/>

文件目录结构 和之前的vue项目类似，但是vite将 index.html 放到了文件的根目录，当vite服务器启动后，该服务器下访问的根目录，就是该项目的根目录。

index.html 代码如下：
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```
但是当我们打开网页后，右键查看网页的源代码，源码是如下的：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/3.png"/>

当我们访问 http://localhost:3000/package.json 时候，打开package.json文件，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/4.png"/>

如上可以看到，vue依赖了 3.2.25 版本，也就是说 使用了 vue3.0+特性了。

#### 理解vite工作机制

用如下图表示下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/5.png"/>

如上图我们可以看到 vite实际上也是一个server，在启动vite构建 web server (比如访问 http://localhost:3000) 后，我们访问该地址，该页面就会向 web server 发送请求，请求对应的文件并返回。我们可以从 network中看到，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/6.png"/>

在请求这些资源后，这些资源并非直接返回的，我们可以看看 App.vue，该网络请求中，有两个 App.vue, 两个 HelloWorld.vue， 实际上这是因为在我们请求这些文件的时候，被 vite server 拦截了，经过编译后才返回对应的内容，我们可以看看 App.vue 源码 和 网络请求后的代码，如下：

App.vue 的源码如下：
```
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
网络中 请求的 App.vue 源码如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/7.png"/>
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/8.png"/>

可以看到，代码是不同的，我们看网络中的App.vue 代码中，有一行代码是如下：

import "/src/App.vue?vue&type=style&index=0&lang.css"

我们再看看 “App.vue?vue&type=style&index=0&lang.css"的请求得到的Response，我们可以发现，该返回的内容才是 App.vue中的 style(样式)的内容。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/9.png" />

在 App.vue 中的代码 _sfc_render 函数就是渲染我们的 template的内容的。

如上代码，如果我们把 App.vue 中的 style 样式去掉，源码变成如下：
```
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>
```
那么在控制台网络中就不会再去请求 App.vue?vue&type=style&index=0&lang.css 该样式请求，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/10.png" />

而这正是因为vite快的原因，它只会请求它使用到的且改变的文件，也就是可以理解为按需加载，而vite也只会拦截到该请求的文件，所以哪些没有引用到的文件或没有改变的文件不会被重新编译，这就做到了按需编译。

如上我们也可以看到，我们只是去掉了 App.vue 中的style样式，所以对于其他的文件并没有发生改变，因此其他的文件不会重新请求。如下我们可以看到：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/11.png" />

除了 App.vue 和 main.js 外，其他的请求都是304，使用了浏览器缓存。说明了vite只会重新编译其他发生了改变的文件，而其他文件么有发生改变的话，通过缓存的方式，直接使用缓存资源，不需要额外的编译。

上面除了利用浏览器缓存外，vite本身也有一个缓存机制，它会针对依赖的包做一个缓存，我们可以看下 network下的main.js中的response，代码如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/12.png" />

但是 在我们的main.js 源码是如下代码：
```
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```
如上可以看到，我们本地源码是导入vue包，但是在网络请求中变成了对 /node_modules/.vite/deps 下的vue.js的引用。那么这个vue.js 是在我们项目中 node_modules
目录下的 .vite/deps 文件夹内。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/13.png" />

network中的vue.js文件，就是引入我们该目录下的文件，该文件是对vue进行编译后生成的js文件。我们通过看 vue.js 的绝对路径看的到：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/vite/images/14.png" />


















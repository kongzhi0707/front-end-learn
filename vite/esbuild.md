
### Esbuild 为什么这么快

#### 一：什么是Esbuild?

Esbuild 是一个模块打包工具，它提供了 和 webpack，RollUp，Parcel等工具相似的资源打包能力，但是它有非常高的性能优势。

它的优点有如下：

#### 1. 它是用Go语言编写的，编译成可执行代码

大多数前端打包工具都是基于javascript实现的，而Esbuild则选择使用Go语言编写，在资源打包CPU密集场景下，Go更有性能优势。
我们都知道Javascript是一门解释型语言，Javascript程序每次执行都需要先由解释器一边将源码翻译成机器语言，一边调度执行。而Go是一种编译型语言，在编译阶段就已经将源码转译为机器码，启动时只需要直接执行这些机器码即可。换句话说，Go语言编写的程序比使用Javascript编写的程序少了一个动态解释的过程。

#### 2. 多线程优势

Go天生具有多线程运行能力，而Javascript是单线程语言，直到引入 WebWorker 规范之后才有可能在浏览器，Node中实现多线程操作。据了解 Rollup 和 Webpack
都未使用 WebWorker 提供的多线程能力。因此EsBuild使用多线程的，尽可能的饱和使用各个CPU核，特别是在打包过程中的解析，代码生成阶段已经实现完全并行处理。

#### 3. 定制

EsBuild中的所有内容都是从头开始编写的。自己编写的优势是：可以从一开始考虑到性能问题，以确保所有的东西都使用一致的数据结构，避免昂贵的转换。缺点是：是一个很大的工作量。

它不像webpack一样，webpack 和 Rollup 类似的工具，有很多第三方插件来解决各种需求， 比如：

1. 使用babel实现ES版本转译。
2. 使用eslint实现代码检测。
3. 使用TSC实现ts代码转译与代码检查。
4. 使用 less，stylus，sass 等预处理工具。

.... 还有更多。可以自己去了解下。这里不总结了。




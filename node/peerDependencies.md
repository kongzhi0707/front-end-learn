
### 理解peerDependencies作用

peerDependencies作用是: 提示宿主环境去安装满足插件peerDependencies所指定依赖的包，然后在插件 import 或 require所依赖包的时候，永远都是引用宿主环境统一安装的npm包。最终解决插件和项目所依赖包不一致的问题。

上面的解释什么意思呢？比如在我开发的 packageA 里面依赖的 react 和 react-dom 的版本号应该和主系统项目中安装的react 和 react-dom的版本号保持一致。
并且 packageA 被安装到主系统中之后，就应该依赖于主系统中的 react 和 react-dom 版本。

#### 认识 peerDependencies 

peerDependencies 在我们进行一些插件开发的时候经常会被使用到的，比如 html-webpack-plugin 开发依赖 webpack等。

举个列子：

假设我现在有个 MyProject 项目，该项目中有一些依赖包packageA，比如在 package.json 的 dependencies 中声明了 packageA, 也就是项目依赖了 packageA，

但是我现在有两个插件 plugin1 和 plugin2 他们也依赖了 packageA, 如果我们在这两个插件 package.json 中使用的是 dependencies，而不是 peerDependencies 来声明 packageA 的话，那么当我们 npm install 安装完成 plugin1 和 plugin2 两个插件后，那么他们的依赖图结构就是如下：
```
｜--- MyProject
｜ |--- node_modules
｜ | |--- packageA
｜ | |--- plugin1
｜ | | |--- node_modules
｜ | | | |--- packageA
｜ | |--- plugin2
｜ | | |--- node_modules
｜ | | | |--- packageA
```

从上面可以看到，我们的 MyProject 项目已经安装了一次 packageA，但是因为 plugin1 和 plugin2 组件也依赖了 packageA，并且使用的 dependencies 声明的 packageA, 所以最后 packageA 被安装了三次，有两次是多余的。

如果我们使用 peerDependencies 就可以避免类似的核心依赖库重复下载的问题。

如果我们在 plugin1 和 plugin2 组件中的 package.json 中使用 peerDependencies 来声明核心依赖库的话，比如 

plugin1/package.json 
```
{
  "peerDependencies": {
    "packageA": "0.0.1"
  }
}
```
plugin2/package.json
```
{
  "peerDependencies": {
    "packageA": "0.0.1"
  }
}
```

在我们的主系统中 package.json 中的 dependencies 声明 packageA; 如下：

MyProject/package.json
```
{
  "dependencies": {
    "packageA": "0.0.1"
  }
}
```

此时，我们在 MyProject 项目中 执行 npm install 生成的依赖图就是如下这样的：

```
|--- MyProject
| |--- node_modules
| | |--- packageA
| | |--- plugin1
| | |--- plugin2
```

如上可以看到，我们的 packageA 只会安装一次。

因此 当我们 主项目中的 package.json 中的 dependencies 声明了 react 和 react-dom的版本；如下：

MyProject/package.json
```
{
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  }
}
```
接着在我们的组件库中的 package.json 中的 peerDependencies 声明 react 和 react-dom 的版本：

plugin1/package.json 配置如下：
```
{
  "peerDependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  }
}
```
plugin2/package.json 配置如下：
```
{
  "peerDependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  }
}
```
这样当我们的 MyProject 主系统执行 npm install 之后，主系统和组件库 就会共用 node_modules 中安装的 react 和 react-dom了。



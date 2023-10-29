### 理解 package.json 各个配置的含义

<div id="back"></div>

- [x] [一：描述配置](#id1)<br />
      |--- 1.1) name
      |--- 1.2) version
      |--- 1.3) repository
      |--- 1.4) description
      |--- 1.5) keywords
      |--- 1.6）homepage
      |--- 1.7) bugs
      |--- 1.8) license
      |--- 1.9) author
- [x] [二：文件配置](#id2) <br />
      |--- 2.1）files
      |--- 2.2）types
      |--- 2.3) main
      |--- 2.4）browser
      |--- 2.5) module
      |--- 2.6）exports
      |--- 2.7) workspaces
- [x] [三：脚本配置](#id3) <br />
      |--- 3.1）scripts
      |--- 3.2）config
- [x] [四：依赖配置](#id4) <br />
      |--- 4.1）dependencies
      |--- 4.2) devDependencies
      |--- 4.3) peerDependencies
- [x] [五：发布配置](#id5) <br />
      |--- 5.1）private
      |--- 5.2) publishConfig
- [x] [六：系统配置](#id6) <br />
      |--- 6.1）engines
- [x] [七：第三方配置](#id7) <br />
      |--- 7.1）types 或 typings
      |--- 7.2）browserslist
      |--- 7.3）sideEffects
      |--- 7.4）lint-staged

package.json 是前端每个项目都有的 json 文件，位于项目的根目录下。package.json 有许许多多的配置，它与项目息息相关。了解他们有助于了解项目，提效开发，规范代码。

#### <div id="id1">一：描述配置<a href="#back"> 回到顶部</a></div>

主要是项目的基本信息，包括名称，版本，描述，仓库，作者等。

##### 1.1) name

项目的名称，如果是第三方包的话，其他人可以通过该名称使用 npm install -g xxx 来安装该包。

```
{
  name: 'xxx'
}
```

##### 1.2) version

项目的版本号，开源项目的版本号一般 遵循 semver 语义化规范。 比如如下版本号：

```
1.2.3-beta.1+meta
```

1 代表主版本号 Major，通常在涉及重大功能更新，产生了破坏性变更时会更新此版本号。
2 代表次版本号 Minor, 在引入了新功能，但未产生破坏性变更，依然向下兼容时会更新此版本号。
3 代表修订号 Patch，在修复了一些问题，也未产生破坏性变更时会更新此版本号。

package.json 的 version 字段，name + version 能共同构成一个完全唯一的项目标识符。因此 name 和 version 是两个重要的字段。

```
{
  "version": "1.0.0"
}
```

##### 1.3) repository

项目的仓库地址以及版本控制信息。

```
{
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react"
  }
}
```

##### 1.4) description

项目的描述，会展示在 npm 官网，让别人能快速了解该项目。

```
{
  "description": "React is a Javascript library"
}
```

##### 1.5) keywords

一组项目的技术关键词，比如 Ant Design 组件库的 keywords 如下：

```
{
  "keywords": [
    "ant",
    "component",
    "components",
    "design",
    "framework",
    "frontend",
    "react",
    "react-component",
    "ui"
 ],
}
```

关键词可以帮助别人在 npm 官网上更好的检索到此项目。增加曝光率。

##### 1.6）homepage

项目主页的链接，一般是项目的 github 链接，项目官网或文档首页

```
{
  "homepage": "https://reactjs.org/"
}
```

##### 1.7) bugs

项目 bug 反馈地址，一般是 github issue 页面的链接

```
{
  "bugs": "https://github.com/xxxx"
}
```

##### 1.8) license

项目的开源许可证，项目的版权拥有人可以使用开源许可证来限制源码的使用，复制，修改和再发布等行为。常见的开源许可证有 BSD，MIT，Apache 等。

```
{
  "license": "MIT"
}
```

##### 1.9) author

项目作者

```
{
  "author": "kongzhi"
}
```

#### <div id="id2">二）文件配置<a href="#back"> 回到顶部</a></div>

包括项目所包含的文件，以及入口等信息。

##### 2.1）files

项目在进行 npm 发布时，可以通过 files 指定需要跟随一起发布的内容来控制 npm 包的大小，避免安装时间太长。
发布时默认会包括 package.json, license, README 和 main 字段里指定的文件，忽略 node_modules, lockfile 等文件。

在此基础上，我们可以指定更多需要一起发布的内容，可以是单独的文件，整个文件夹，或者使用通配符匹配到的文件。

```
{
  "files": [
    "filename.js",
    "directory/",
    "glob/*.{js,json}"
  ]
}
```

一般情况下，files 里指定构建出来的产物以及类型文件。而 src, test 等目录下的文件不需要跟随发布的。

##### 2.2）types

在 node 支持 ES 模块后，要求 ES 模块采用 .mjs 后缀文件名。只要遇到 .mjs 文件，就认为它是 ES 模块。如果我们不想修改文件后缀，就可以在 package.json 文件中，指定 type 字段为 module.

```
{
  "type": "module"
}
```

这样所有的以 .js 后缀的文件，node 都会用 ES 模块来解析。

如果我们还要使用 CommonJS 模块规范的话，那么我们需要将 CommonJS 脚本的后缀名都改成 .cjs.

##### 2.3) main

项目发布时，默认会包括 package.json，licence, README 和 main 字段里指定的文件，因为 main 字段里指定的是项目的入口文件。在 browser 和 Node 环境中都可以使用。

如果我们不设置 main 字段，那么入口文件就是根目录下的 idnex.js 文件。

比如 在 ts-project 项目的 main 字段指定为 index.js

```
{
  "main": "./index.js"
}
```

当我们引入 ts-project 时，实际上引入的事 node_modules/ts-project/index.js。

##### 2.4）browser

main 字段里指定的入口文件在 browser 和 Node 环境中都可以使用，如果只想在 web 端使用的话，不允许在 server 端使用，可以通过 browser 字段指定入口。如下：

```
{
  "browser": "./browser/index.js"
}
```

##### 2.5) module

我们项目也可以指定 ES 模块的入口文件，这就是 module 字段的作用。

```
{
  "module": "./index.mjs"
}
```

当一个项目同时定义了 main, browser 和 module，像 webpack，rollup 等构建工具会感知这些字段，并会根据环境以及不同的模块规范来进行不同的入口文件查找。

```
{
  "main": "./index.js",
  "browser": "./browser/index.js",
  "modules": "./index.mjs"
}
```

比如 webpack 构建项目时默认的 target 为 "web", 也就是 web 构建，它的 resolve.mainFeilds 字段默认为 ["browser", "module", "main"]

```
module.exports = {
  resolve: {
    mainFields: ["browser", "module", "main"],
  }
}
```

它会按照 browser -> module -> main 的顺序来查找入口文件。

##### 2.6）exports

node 在 14.13 支持在 package.json 里定义 exports 字段，拥有了条件导出的功能。

exports 字段可以配置不同环境应对的模块入口文件。并且当它存在时，它的优先级是最高的。

比如使用了 require 和 import 字段根据模块规范分别定义入口：

```
{
  "exports": {
    "require": "./index.js",
    "import": "./index.mjs"
  }
}
```

如上配置 在使用 import "xxx" 和 require("xxx") 时会从不同的入口引入文件，exports 也支持使用 browser 和 node 字段定义 browser 和 Node 环境中的入口。

上面的 exports 写法 其实等同于 下面的

```
{
  "exports": {
    ".": {
      "require": "./index.js",
      "import": "./index.mjs"
    }
  }
}
```

我们为什么要加一个层级呢？把 require 和 import 放在 "." 下面呢？

因为 exports 除了支持配置包的默认导出，还支持配置包的子路径。比如一些第三方 UI 包需要引入对应的样式文件才能正常使用。

```
import `packageA/dist/css/index.css`
```

我们可以使用 exports 来封装文件路径：

```
"exports": {
  "./style": "./dist/css/index.css"
}
```

这时候我们只需引入如下即可：

```
import `packageA/style`
```

结合上面的讲解，我们来看看下方的 vite 官网推荐的第三方库入口文件的定义，我们现在很容易理解了。如下的 package.json 中使用的如下格式：

```
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

##### 2.7) workspaces

项目的工作区配置，用于在本地的根目录下管理多个子项目。可以自动地在 npm install 时 将 workspaces 下面的包，软链接到根目录下的 node_modules 中，不用手动执行 npm link 操作。

workspaces 字段接收一个数组，数组里可以时文件夹名称或通配符。比如如下：

```
{
  "workspaces": [
    "packageA"
  ]
}
```

表示在 packageA 目录下还有一个项目，它也有自己的 package.json。

```
｜--- package.json
｜--- packageA
   |--- package.json
```

一般子项目都会平铺管理在 packages/目录下，所以根目录下的 workspaces 一般可以配置为如下：

```
{
  "workspaces": [
    "packages/*"
  ]
}
```

#### <div id="id3">三）脚本配置<a href="#back"> 回到顶部</a></div>

##### 3.1）scripts

指定项目的一些内置脚本命令，这些命令可以通过 npm run 来执行。一般包含项目开发，构建 或 CI 命令等。比如：

```
{
  "scripts": {
    "build": "webpack"
  }
}
```

现在我们就可以使用命令 npm run build 或 yarn build 来执行项目构建了。

除了上面指定的基础命令，我们还可以配合 pre 和 post 完成命令的前置和后续操作， 比如：

```
{
  "scripts": {
    "prebuild": "xxx", // build 执行之前钩子
    "build": "webpack",
    "postbuild": "xxx" // build 执行之后的钩子
  }
}
```

当我们执行 npm run build 命令时候，会按照 prebuild -> build -> postbuild 的顺序依次执行上面的命令。 pnpm 和 yarn2 都已经废弃掉了这种 pre/post 自动执行的逻辑。所以我们直接 使用 build 就可以了。pre/post 这样的 就不用了。

##### 3.2）config

config 用于设置 scripts 里的脚本在运行时的参数，比如设置 port 为 3001；

```
{
  "config": {
    "port": "3001"
  }
}
```

在执行脚本时，我们可以通过 npm_package_config_port 这个变量访问的到 3001.

```
console.log(process.env.npm_package_config_port); // 3001
```

#### <div id="id4">四）依赖配置<a href="#back"> 回到顶部</a></div>

项目可能会依赖其他包，需要在 package.json 里配置这些依赖的信息。

##### 4.1）dependencies

运行依赖，也就是项目生产环境下需要用到的依赖，比如 react，vue，状态管理库 或 组件库等。

使用 npm install xxx 或 npm install xxx --save 时，会被自动插入到该字段中。

```
"dependencies": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

##### 4.2) devDependencies

开发依赖，项目开发环境需要用到的，而运行时不需要的依赖，用于辅助开发，一般包括项目工程化工具比如 webpack, vite, eslint 等。
使用 npm install xxx -D 或 npm install xxx --save-dev 时，会自动插入到该字段中。

```
"devDependencies": {
  "webpack": "5.60.0"
}
```

##### 4.3) peerDependencies

peerDependencies 作用是: 提示宿主环境去安装满足插件 peerDependencies 所指定依赖的包，然后在插件 import 或 require 所依赖包的时候，永远都是引用宿主环境统一安装的 npm 包。最终解决插件和项目所依赖包不一致的问题。

上面的解释什么意思呢？比如在我开发的 packageA 里面依赖的 react 和 react-dom 的版本号应该和主系统项目中安装的 react 和 react-dom 的版本号保持一致。 并且 packageA 被安装到主系统中之后，就应该依赖于主系统中的 react 和 react-dom 版本。

peerDependencies 在我们进行一些插件开发的时候经常会被使用到的，比如 html-webpack-plugin 开发依赖 webpack 等。

举个列子：

假设我现在有个 MyProject 项目，该项目中有一些依赖包 packageA，比如在 package.json 的 dependencies 中声明了 packageA, 也就是项目依赖了 packageA，

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

因此 当我们 主项目中的 package.json 中的 dependencies 声明了 react 和 react-dom 的版本；如下：

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

这样当我们的 MyProject 主系统执行 npm install 之后，主系统和组件库 就会共用 node_modules 中安装的 react 和 react-dom 了。

#### <div id="id5">五）发布配置<a href="#back"> 回到顶部</a></div>

##### 5.1）private

如果是私有项目，不希望发布到公共的 npm 仓库上，可以将 private 设置为 true。

```
{
  "private": true
}
```

##### 5.2) publishConfig

publishConfig 是 npm 包发布时使用的配置。
比如在安装依赖时指定了 registry 为 taobao 的镜像源，但发布时希望在公网发布，就可以指定 publishConfig.registry.

```
"publishConfig": {
  "registry": "https://registry.npmjs.org/"
}
```

#### <div id="id6">六）系统配置<a href="#back"> 回到顶部</a></div>

和项目关联的系统配置，比如 node 版本或操作系统兼容性之类。这些要求只会起到提示警告的作用，即使用户的环境不符合要求，也不影响安装依赖包。

##### 6.1）engines

一些项目由于兼容性问题会对 node 或者包管理器有特定的版本号要求，比如：

```
"engines": {
  "node": ">=14 <16",
  "pnpm": ">7"
}
```

要求 node 版本大于等于 14 且小于 16，同时 pnpm 版本号需要大于 7。

#### <div id="id7">七）第三方配置<a href="#back"> 回到顶部</a></div>

##### 7.1）types 或 typings

指定 TypeScript 的类型定义的入口文件

```
"types": "./index.d.ts",
```

##### 7.2）browserslist

设置项目的浏览器兼容情况。babel 和 autoprefixer 等工具会使用该配置对代码进行转换。当然你也可以使用 .browserslistrc 单文件配置。

```
"browserslist": [  // 查询全球市场占有率大于 1% 的浏览器最后两个版本
  "> 1%",
  "last 2 versions"
]
```

##### 7.3）sideEffects

显示设置某些模块具有副作用，用于 webpack 的 tree-shaking 优化。

比如在项目中整体引入 Ant Design 组件库的 css 文件。

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

如果 Ant Design 的 package.json 里不设置 sideEffects，那么 webapck 构建打包时会认为这段代码只是引入了但并没有使用，可以 tree-shaking 剔除掉，最终导致产物缺少样式。
所以 Ant Design 在 package.json 里设置了如下的 sideEffects，来告知 webpack，这些文件具有副作用，引入后不能被删除。

```
"sideEffects": [
  "dist/*",
  "es/**/style/*",
  "lib/**/style/*",
  "*.less"
]
```

##### 7.4）lint-staged

lint-staged 是用于对 git 的暂存区的文件进行操作的工具，比如可以在代码提交前执行 lint 校验，类型检查，图片优化等操作。

```
"lint-staged": {
  "src/**/*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "git add -A"
  ]
}
```

lint-staged 通常配合 husky 这样的 git-hooks 工具一起使用。git-hooks 用来定义一个钩子，这些钩子方法会在 git 工作流程中比如 pre-commit，commit-msg 时触发，可以把 lint-staged 放到这些钩子方法中。

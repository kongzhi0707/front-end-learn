
### npx, npm, yarn, cnpm, pnpm 的区别

npm 大家应该非常熟悉，它是一个开源的，免费的包管理器，便于我们下载和分享资源。 cnpm，yarn，pnpm 等工具都是基于npm管理器的一些变种，解决了早期npm的一些缺点，比如下载速度慢，不能离线下载等。

Node自带了npm模块，npm从5.2版本开始，增加了 npx 命令。因此我们可以直接使用 npx命令，如果万一不能使用 npx 的话，我们需要手动安装下：
```
$ npm install -g npx
```
#### 1. npx解决了什么问题？

1）可运行本地的模块

比如使用vue脚手架创建了一个项目后，我们想在本地运行该项目，如果我们直接使用命令：vue-cli-service serve 后，会提示：zsh: command not found: vue-cli-service 。找不到该命令，因此我们常见的做法是在：项目的根目录中的 package.json 添加 如下这样的打包命令：
```
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint"
},
```
然后我们 npm run serve 即可。

但是现在我们可以通过 npx 即可在命令行中进行打包，如下：
```
$ npx vue-cli-service serve
```
2）可调用项目安装的模块

npx 可以调用内部安装的模块，比如，我们项目内部安装了 eslint，我们在项目的根目录下想查看 eslint 的版本，必须像下面这样使用命令：
```
$ node_modules/.bin/eslint  --version 
```
如果我们使用 npx 的话，我们可以像如下这样调用即可：
```
$ npx eslint --version
```
3) 避免全局安装模块

比如，我们搭建react脚手架，我们一般会使用 create-react-app 来全局安装，我们可以在我们的电脑上已全局安装后，可以使用：
sudo npm uninstall create-react-app -g 这个命令先卸载掉。然后我们再来使用 npx 命令来生成我们的脚手架。
```
$ npx create-react-app react-1
```
如上命令，我们运行后，会在对应的目录下 自动生成 react-1 这个react项目了。

注意：如果我们第一次使用该命令，npx会下载 create-react-app放在临时文件中，过一段时间会自动清除，但是不会立即清除。

4) npm init 和 npx 相似

在npm@6版本中，增加了一个新命令 npm init <pkg>

如下两个命令是等价的：

npm init react-app myapp 

npx create-create-app myapp

npm init <pkg> 对与 create 开头的脚手架制定了一个特殊的命令，比如 create-react-app, npm init 下载时会默认对安装的 pkg 包添加 create 前缀，同时像 npx 一样不会全局安装，只是运行一次，后面会删除。

#### 2. yarn

yarn 也是一个包管理器，它和npm其实没有本质的区别，都是管理和安装包的。它解决了早期npm的一些问题：比如 不支持离线模式，树形结构的依赖，依赖安装不确定等。
但是现在 npm 新版的都已经支持这些特性了。所以他们两者区别应该不会很大。

安装命令如下：
```
$ npm install -g yarn
```
如果我们使用 yarn 安装包的话，需要使用如下类似命令：
```
$ yarn add [packageName]
```
删除包，使用如下命令：
```
$ yarn remove [packageName]
```
#### 3. pnpm

pnpm 也是一个包管理器，它类似于linux的软链接方式，达到一个模块文件多处复用，解决了 npm, yarn 在多个项目安装同一个依赖时会下载重复文件的问题，避免磁盘的浪费，
同时大大提升了下载的速度。

它有如下特点：
```
1. pnpm利用了硬连接和符号连接来避免复制所有本地缓存源文件。也就是说多个项目相同的依赖包只会在某处安装一次，其他地方需要使用 直接连接过来，然后使用，不会重新下载包，节省了安装时间和磁盘空间。

2. pnpm 继承了 yarn 和 新版的npm所有优点，包括离线模式和确定性安装。

3. 其他更多特点....
```
#### 4. cnpm

因为npm的远程服务器在国外，所以有时候安装包的时候会出现安装太慢，甚至无法访问的情况，为了解决这个问题，国内就出现了 cnpm.

因此我们会使用 淘宝的 cnpm 代替 npm。

使用方法有如下两种：

1）直接安装 cnpm 安装淘宝提供的 cnpm, 并更改服务器地址为淘宝的国内地址，命令如下：
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
以后安装直接采用 cnpm 替代 npm. 比如使用npm安装webpack命令为：npm install webpack --save-dev ，那么换成 cnpm 的命令就变成: 
```
cnpm install webpack --save-dev
```
2) 替换npm仓库地址为淘宝镜像地址：命令如下：
```
npm config set registry https://registry.npm.taobao.org
```
查看是否更改成功：npm config get registry，以后安装时，依然用npm命令和之前一样下载方式，但是实际是从淘宝国内服务器下载的。
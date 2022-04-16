
### react-app-rewired使用

在我们使用 create-react-app 创建项目时候，如果我们需要手动修改配置的话，我们可以使用 react-app-rewired ， 它的作用是 帮我们重写 react 脚手架配置。

react-app-rewired@2.x版本需要搭配customize-cra使用。
customize-cra的作用是帮助你自定义react脚手架2.x版本配置。

#### 基本使用

1）安装： 
```
npm i react-app-rewired customize-cra --save-dev
```
2）在项目的根目录下新建文件 config-overrides.js 文件。
```
module.exports = function override(config, env) {
  return config;
}
```
3) 修改 package.json 文件
```
{
  // ...
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
-   "eject": "react-scripts eject"
+   "eject": "react-app-rewired eject"
}
  // ...
}
```
#### 使用ES7的装饰器

修改 config-overrides.js 文件
```
const {
  overrride,
  addDecoratorsLegacy
} = require('customize-cra');

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),
)
```
#### 使用Less

安装 less 和 less-loader:  npm i less less-loader --save-dev

修改 config-overrides.js 文件，增加代码如下：
```
const {
  overrride,
  addLessLoader,
  addDecoratorsLegacy
} = require('customize-cra');

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),

  // less
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      // Optionally adjust URLs to be relative. When false, URLs are already relative to the entry less file.
      relativeUrls: false,
      modifyVars: { '@primary-color': '#A80000' },
      // cssModules: {
      //   // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      //   localIdentName: "[path][name]__[local]--[hash:base64:5]",
      // }
    }
  })
)
```
#### 添加别名

修改config-overrides.js文件
```
const {
  overrride,
  addLessLoader,
  addDecoratorsLegacy,
  addWebpackAlias,
} = require('customize-cra');

const path = require('path')

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),

  // less
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      // Optionally adjust URLs to be relative. When false, URLs are already relative to the entry less file.
      relativeUrls: false,
      modifyVars: { '@primary-color': '#A80000' },
      // cssModules: {
      //   // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      //   localIdentName: "[path][name]__[local]--[hash:base64:5]",
      // }
    }
  })

  // 路径别名
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  })
)
```








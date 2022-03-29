
### VuePress + Github Pages 搭建博客

vuepress官网请看 <a href="https://vuepress.vuejs.org/zh/">https://vuepress.vuejs.org/zh/</a>

#### 1) 本地搭建

1. 创建并进入一个目录
```
mkdir vuepress-init && cd vuepress-init
```
2) 初始化项目
```
npm init
```
3) 将vuepress安装为本地依赖
```
npm install -D vuepress
```
4) 创建 docs 目录

在本地项目的根目录下，创建 docs根目录，然后在 docs根目录下新建 .vuepress目录，在 .vuepress目录下新建 config.js。现在目录结构变为如下：
```
|--- vuepress-init
| |--- docs
| | |--- .vuepress
| | | |--- config.js
| | |--- README.md
| |--- node_modules
| |--- package.json
```
5) 在package.json中添加 scripts
```
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```
6) 在本地启动服务

执行命令：npm run docs:dev

VuePress 会在 http://localhost:8080 启动一个热重载的开发服务器。

#### 2) 基础配置

在 docs/.vuepress/config.js 下配置网站的标题和描述，方便SEO；代码如下：
```
module.exports = {
  title: 'TypeScript 文档',
  description: 'TypeScript 最新官方文档翻译',
};
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/1.png"/>

#### 3）添加导航栏

我们现在在首页的右上角添加导航栏，修改 config.js， 代码如下：
```
module.exports = {
  title: 'TypeScript 文档',
  description: 'TypeScript 最新官方文档翻译',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '空智的 Javascript 博客',
        items: [
          { text: 'Github', link: 'https://github.com/kongzhi0707' },
          { text: '博客园', link: 'https://cnblogs.com/tugenhua0707' }
        ]
      }
    ]
  }
};
```
效果变成如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/2.png"/>

更多配置请参考 <a href="https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E5%AF%BC%E8%88%AA%E6%A0%8F">VuePress导航栏</a>

#### 4) 添加侧边栏

现在我们添加一些md文档，比如目录的文档变为如下：
```
｜--- vuepress-init
｜ |--- README.md
｜ |--- .vuepress
｜ | |--- config.js
｜ |--- handbook
｜ | |--- xxx.md
｜ | |--- yyy.md
｜ |--- package.json
```
.vuepress/config.js 配置变为如下：
```
module.exports = {
  title: 'TypeScript 文档',
  description: 'TypeScript 最新官方文档翻译',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '空智的 Javascript 博客',
        items: [
          { text: 'Github', link: 'https://github.com/kongzhi0707' },
          { text: '博客园', link: 'https://cnblogs.com/tugenhua0707' }
        ]
      }
    ],
    sidebar: [
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false, // 不折叠
        children: [
          { title: '学前必读', path: '/' }
        ]
      },
      {
        title: '基础学习',
        path: '/handbook/xxx.md',
        collapsable: false, // 不折叠
        children: [
          { title: 'js学习', path: '/handbook/xxx.md' },
          { title: 'css学习', path: '/handbook/yyy.md' }
        ]
      }
    ]
  }
};
```
效果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/3.png"/>

handbook/xxx.md 文档如下：

### js学习

大家来学习我们的javascript

handbook/yyy.md 文档如下：

### css学习

大家来学习我们的css代码

就是和我们编写github文档一样的语法应该可以的。

#### 5）更换主题

如上我们现在有了基本的目录和导航功能，但是如果我们想要更换主题的话，我们可以直接使用 <a href="https://vuepress-theme-reco.recoluan.com/">vuepress-theme-reco</a> 主题

因此我们需要安装 vuepress-theme-reco：命令如下：
```
npm install vuepress-theme-reco --save-dev
```
然后我们在 config.js 引用该主题。如下代码：
```
module.exports = {
  // ...
  theme: 'reco'
  // ...
};
```
刷新下页面，我们会看到上面会有一个图标，点击图标会下拉，会有不同的切换主题，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/4.png"/>

#### 6）设置语言

我们需要在 config.js 代码添加 locales 配置，如下所示：
```
module.exports = {
  // ...
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  }
  // ...
};
```
#### 7) 开启目录结构

在原本的主题里，我们发现每篇文章的目录结构出现在左侧，而 vuepress-theme-reco 将原有的侧边栏的中的多级标题移出，生成子侧边栏，放在了页面的右侧，如果我们要全局开启的话，可以在页面的 config.js 里设置开启。如下配置代码：

```
module.exports = {
  // ...
  themeConfig: {
    subSidebar: 'auto',
  },
  // ...
};
```
#### 8) 修改主题颜色

VuePress 基于vue，所以主题色用的是Vue的绿色，那么我们如何修改VuePress的主题色呢？

我们可以创建一个 .vuepress/styles/palette.styl 文件，文件代码如下：

$accentColor = #3178c6

如下我们可以发现主题颜色发生改变了，

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/5.png"/>

<a href="https://vuepress.vuejs.org/zh/config/#patterns">查看palette.styl 更多配置</a>

#### 9）部署

如上我们的博客就做好了，接下来我们部署到免费的Github Pages上，我们先在Github上新建一个仓库，比如我的仓库名称叫 learn-vuepress-test.

然后我们需要在 config.js 添加一个base路径配置：
```
module.exports = {
  // ....
  base: '/learn-vuepress-test/',
  // ...
};
```
最终我们的config.js 文件内容为：
```
module.exports = {
  title: 'TypeScript 文档',
  description: 'TypeScript 最新官方文档翻译',
  base: '/learn-vuepress-test/',
  theme: 'reco',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    subSidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '空智的 Javascript 博客',
        items: [
          { text: 'Github', link: 'https://github.com/kongzhi0707' },
          { text: '博客园', link: 'https://cnblogs.com/tugenhua0707' }
        ]
      }
    ],
    sidebar: [
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false, // 不折叠
        children: [
          { title: '学前必读', path: '/' }
        ]
      },
      {
        title: '基础学习',
        path: '/handbook/xxx.md',
        collapsable: false, // 不折叠
        children: [
          { 
            title: 'js学习',
            path: '/handbook/xxx.md',
          },
          { 
            title: 'css学习',
            path: '/handbook/yyy.md'
          }
        ]
      }
    ],
  },
};
```
然后我们在项目 vuepress-init 目录下建立一个脚本文件： deploy.sh。 配置如下：
```
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:kongzhi0707/learn-vuepress-test master:gh-pages

cd -
```
然后命令行切换到 vuepress-init 目录下，执行 sudo sh deploy.sh 命令，就会开始构建，然后提交到远程仓库，注意这里提交到了 gh-pages 分支，我们查看下对应仓库分支的代码：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/6.png"/>

我们可以在仓库的 Setting -> Pages 中看到最后的地址：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/vuepress/7.png"/>

最后我们访问 https://kongzhi0707.github.io/learn-vuepress-test/ 就可以了。




















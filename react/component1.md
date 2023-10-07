### 从 0 到 1 搭建一个 react 组件库

<div id="back"></div>

- [x] [一) 初始化项目](#id1)<br />
- [x] [二) 安装所需依赖](#id2) <br />
- [x] [三) 创建开发目录](#id3) <br />
- [x] [四) 启动项目](#id4) <br />
- [x] [五) Storybook Css 支持](#id5) <br />
- [x] [六) 构建打包](#id6) <br />
- [x] [七) 测试打包库](#id7) <br />
- [x] [八) 发布到 npm](#id8) <br />
- [x] [九) 增加发布日志](#id9) <br />
- [x] [十) 部署文档](#id10) <br />

开发一个组件库提供给外部或内部使用，是很常见的，本文将从 0 到 1 搭建一个包含 文档/自动化部署/单元测试/开发环境，介绍组件库开发模版。

#### <div id="id1">1）初始化项目 <a href="#back"> 回到顶部</a></div>

我们创建一个项目并进入该文件进行初始化

```
mkdir react-component-library && cd react-component-library
```

如上我们创建了一个名为 react-component-library 的文件夹，接下来我们进行初始化。

npm init

#### <div id="id2">2) 安装所需依赖 <a href="#back"> 回到顶部</a></div>

我们的组件都是使用 typescript 开发的，因此我们需要安装如下相关依赖：

```
npm install react @types/react react-dom typescript -D
```

安装完毕后，我们的依赖项如下：

```
"devDependencies": {
  "@types/react": "^18.2.25",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.2.2"
}
```

#### <div id="id3">3）创建开发目录 <a href="#back"> 回到顶部</a></div>

类似如下结构：

```
|--- src
| |--- components
| | |--- Button
| | | |--- Button.tsx # 组件的核心逻辑
| | | |--- index.ts   # 统一导出组件
| | |--- index.ts     # 导出所有组件
| |--- index.ts       # 外部引用的入口
|--- package.json
|--- package-lock.json
```

src/components/Button/Button.tsx 代码如下：

```
import React from 'react';

export interface ButtonProps {
  label: string;
}

export const Button = (props: ButtonProps) => {
  return <button>{ props.label }</button>
}
```

src/components/Button/index.ts 代码如下：

```
export * from './Button';
```

接着，我们需要从组件的目录导出该按钮，

src/components/index.ts 代码如下：

```
export * from './Button';
```

最后，我们从基本的 src 目录导出所有的组件

src/index.ts 代码如下：

```
export * from './components';
```

#### <div id="id4"> 4) 启动项目 <a href="#back"> 回到顶部</a></div>

在启动项目之前，我们将使用 storybook 来开发以及调试我们的应用，最终将其发布为在线文档可供用户访问。
我们需要 storybook, 安装命令如下：

```
npx storybook init --builder vite
```

安装完毕后，我们需要再安装 vite，安装命令如下：

```
npm install vite -D
```

接着我们运行项目：

```
npm run storybook
```

出现如下图后，说明成功了。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/15.png" /> <br />

默认启动 6006 端口，但是如上我们发现左侧的 Button 组件并不是我们最初编写的。而是它自动生成了一个。因此我们新增 src/components/Button/Button.stories.tsx 文件，并输入如下代码：

```
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  title: '通用/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args

Primary.args = {
	label: 'Button',
};

export const Secondary = Template.bind({});

Secondary.args = {
	label: 'Button 2',
};
```

然后我们看到页面多出了一栏，效果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/16.png" /> <br />

#### <div id="id5"> 5）Storybook Css 支持 <a href="#back"> 回到顶部</a></div>

默认情况下是支持导入 .css 文件格式的，但是我们可能还需要 less, sass 这样的处理器，但是 Storybook 默认是不支持的。因此我们需要安装一些依赖文件。

新增 src/components/Button/Button.scss 文件， 代码如下：

```
button {
  color: red;
}
```

在 src/components/Button/Button.tsx 导入使用

```
import React from 'react';

// 新增的代码
import './Button.scss';

export interface ButtonProps {
  label: string;
}

export const Button = (props: ButtonProps) => {
  return <button>{ props.label }</button>
}
```

下面我们还需要配置对应的 loader，安装命令如下：

```
npm install sass -D
```

安装完成后，我们再使用命令重启： npm run storybook

可以看到颜色变成红色了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/17.png" /> <br />

当然如上是支持 scss 的，对于 less 的配置也是相同的，依赖于 vite 的文档，我们也可以支持 less，我们只需要 npm install less -D 即可。

#### <div id="id6"> 6）构建打包 <a href="#back"> 回到顶部</a></div>

上面我们配置好了本地开发环境，但是最终我们需要构建出产物提供用户下载使用，因此我们使用 rollup 将组件进行打包发布。

#### typescript 配置

在打包之前，一般我们依赖于本地的 typescript 的配置，执行命令如下：

```
npx tsc --init
```

如上命令会生成一个 tsconfig.json 文件，我们将增加如下配置：

```
{
  "compilerOptions": {
    // 默认
    "target": "ES5", // 修改
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,

    // 新增
    "jsx": "react",
    "module": "ESNext",
    "declaration": true,
    "declarationDir": "types",
    "sourceMap": true,
    "outDir": "dist",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "emitDeclarationOnly": true
  }
}
```

```
"jsx": "react", 的含义：将JSX转换为React代码。
"module": "ESNext", 的含义: 指定生成的模块代码。
"declaration": true, 的含义: 为我们的库类型输出一个 .d.ts 文件。
"declarationDir": "types",的含义是将 .d.ts 文件放到哪里，我们放到types里面。
"sourceMap": true, 的含义是：将JS代码映射回其TS文件源进行调试。
"outDir": "dist", 将生成项目的目录
"moduleResolution": "node", 遵循node.js规则查找模块
"allowSyntheticDefaultImports": true, 当模块没有默认导出时，允许 从 y 导入 x。
"emitDeclarationOnly": true 的含义是：只生成声明 .d.ts文件，而不会生成js文件。
```

#### rollup 配置

我们将依赖以下插件来初始配置我们的库；

```
npm install rollup @rollup/plugin-node-resolve @rollup/plugin-typescript @rollup/plugin-commonjs rollup-plugin-dts rollup-plugin-postcss postcss @rollup/rollup-darwin-arm64 --save-dev
```

```
rollup
@rollup/plugin-node-resolve
@rollup/plugin-typescript
@rollup/plugin-commonjs
rollup-plugin-dts # 用于生成 .d.ts 文件
rollup-plugin-postcss
@rollup/rollup-darwin-arm64
postcss
```

创建 rollup.config.mjs 位于根目录，.mjs 代表该文件是 esmodule 规范，内容如下：

```
import { readFileSync } from 'node:fs';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';

const pkg = JSON.parse(readFileSync('./package.json'));

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
    ]
  }
]
```

接下来我们需要修改 package.json 文件， 代码如下：

```
{
  "name": "kz-template-react-component-library",
  "version": "0.0.1",
  "description": "template for react component",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "build": "rollup -c"
  },
  "author": "@kongzhi",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.19.6",
    "@rollup/plugin-commonjs": "^23.0.2",
    "@rollup/plugin-node-resolve": "^15.0.1",
    "@rollup/plugin-typescript": "^9.0.2",
    "@storybook/addon-actions": "^6.5.13",
    "@storybook/addon-essentials": "^6.5.13",
    "@storybook/addon-interactions": "^6.5.13",
    "@storybook/addon-links": "^6.5.13",
    "@storybook/builder-vite": "^0.2.5",
    "@storybook/react": "^6.5.13",
    "@storybook/testing-library": "0.0.13",
    "@types/react": "^18.0.24",
    "babel-loader": "^8.2.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "rollup": "^3.2.3",
    "rollup-plugin-dts": "^5.0.0",
    "rollup-plugin-postcss": "^4.0.2",
    "sass": "^1.55.0",
    "typescript": "^4.8.4",
    "vite": "^3.2.2",
    "postcss": "^8.4.18"
  }
}
```

然后，我们执行命令：npm run build ，即可打包成功。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/18.png" /> <br />

在 dist 目录下我们可以看到打包出来的文件如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/19.png" /> <br />

现在我们可以在本地通过 npm link 来在本地测试是否正常了。

#### <div id="id7"> 7）测试打包库 <a href="#back"> 回到顶部</a></div>

我们可以在本地执行 npm link, 链接到本地，下面我们随意创建一个 react 项目进行测试下。

```
npx create-react-app test-react-app --template typescript
```

进入到 test-react-app 内进行 link

```
npm link kz-template-react-component-library
```

然后进入 /test-react-app/src/App.tsx 代码内部引入 kz-template-react-component-library 包名。如下所示：

```
import React from 'react';
import './App.css';

import { Button } from 'kz-template-react-component-library';

function App() {
  return (
    <div className="App">
      <Button label="测试简单的按钮"></Button>
    </div>
  );
}

export default App;
```

然后执行 npm start 命令，即可看到页面如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/20.png" /> <br />

#### <div id="id8"> 8）发布到 npm <a href="#back"> 回到顶部</a></div>

发布到 npm, 使用如下命令：

```
npm login
```

然后发布：

```
npm publish
```

#### <div id="id9"> 9）增加发布日志 <a href="#back"> 回到顶部</a></div>

我们新建如下目录结构，利用 cicd 来帮我们完成。

```
|--- .github
| |--- workflows
| | |--- release.yml
```

release.yml 代码如下：

```
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        width:
          fetch-depth: 0

      - uses: actions/setup-node@v3
        width:
          node-version: 16.x

      - run: npx changelogithub
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

如上意思是：当我们发布一个以 v 开头的 tag 的时候，会帮我们自动生成 changelog.

#### 提交到 github

首先我们需要将我们的代码提交到 github. 假如我们已经提交到 github 完毕后，接下来我们创建一个 tag，

```
git tag -a v0.0.1 -m "release v0.0.1"
```

创建了一个命名为 v0.0.1 的 tag 的提交信息为 "release v0.0.1"

推送到远程 master 分支：

```
git push origin master --tags
```

#### <div id="id10"> 10）部署文档 <a href="#back"> 回到顶部</a></div>

测试打包后的文档是否正常访问。首先我们需要全局安装 storybook

```
npm install -g storybook
```

然后我们再运行如下命令：

```
npm run build-storybook
```

默认会打包到 storybook-static 文件夹下。 然后我们再执行如下命令：

```
npx http-server storybook-static
```

现在我们可以访问 htttp://127.0.0.1:8080 查看是否是正常的，当前默认开启的端口是 8080.

#### <div id="id11"> 11）配置 GitPage <a href="#back"> 回到顶部</a></div>

增加一个 ci 文件

.github/workflows/storybook.yml

```
name: Storybook
on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.1

      - name: Install and Build
        run: |
          npm ci
          npm run build-storybook

      uses: JamesIves/github-pages-deploy-action@3.6.2
        with:
          branch: gh-pages
          folder: storybook-static # npm run build-storybook输出的文件夹
```

然后我们提交代码， 当我们的 ci 执行完毕后，我们可以看到多出了一个 gh-pages 分支， 进入设置：

#### <a href="https://github.com/kongzhi0707/react-component-library-test"> github 源码 </a>

### 从 0 搭建 vite3 + vue2 + router + vuex + javascript 脚手架项目

<div id="back"></div>

- [x] [一) 初始化项目](#id1)<br />
- [x] [二) Vite 配置文件 vite.config.js](#id2) <br />
- [x] [三) 目录结构](#id3) <br />
- [x] [四) 集成 Vue Router 路由工具](#id4) <br />
- [x] [五) 集成 Vuex 全局状态管理工具](#id5) <br />
- [x] [六) 集成 Axios HTTP 工具](#id6) <br />
- [x] [七) 集成 CSS 预处理器 Less](#id7) <br />
- [x] [八) 代码规范](#id8) <br />
- [x] [九) 解决 Prettier 和 ESLint 的冲突](#id9) <br />
- [x] [十) 集成 Stylelint 配置](#id10) <br />
- [x] [十一) 集成 husky 和 lint-staged](#id11) <br />
- [x] [十二) 提交规范](#id12) <br />
- [x] [十三) 使用 Github Actions 实现自动部署](#id13) <br />

#### 用到的技术栈 <a href="https://github.com/kongzhi0707/vite3-vue2-router-vuex-javascript">github 源码查看</a>

```
1）vite3 构建工具
2）vue2-渐进式 Javascript框架
3）vue Router3 官方路由管理器
4）vuex3 一个专为vue.js应用程序开发的状态管理模式。
5）Less - css预处理器
6）Axios - 一个基于promise的网络请求库，可用于浏览器和nodejs
7）Husky + Lint-staged - Git Hook 工具
8）EditorConfig + ESLint + Prettier + Stylelint  - 代码规范
9）Commitizen + Commitlint - 提交规范
10）Github Actions - 自动部署
```

#### <div id="id1">一）初始化项目<a href="#back"> 回到顶部</a></div>

执行如下命令：

```
npm init vue@2
```

该指令将会安装并执行 create-vue. 它是 Vue 官方的项目脚手架工具。

执行后，我们会看到一些诸如 TypeScript 和 测试支持之类的可选功能提示；我这边目前全部选择 否，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/1.png" />

在项目被创建后，通过以下步骤安装依赖并启动开发服务器：

```
# 进入项目
cd vue2-project

# 安装依赖
npm install

# 启动项目
npm run dev
```

#### <div id="id2">二）Vite 配置文件 vite.config.js<a href="#back"> 回到顶部</a></div>

Vite 的配置文件 vite.config.js 在项目的根目录下，项目启动时会自动读取。

现在我们对公共基础路径，自定义路径别名，服务器选择，构建选项做了如下配置：

```
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // 是否开启 https
    https: false,
    // 端口号
    port: 3000,
    // 监听所有地址
    host: '0.0.0.0',
    // 服务器启动时是否自动打开浏览器
    open: true,
    // 允许跨域
    cors: true,
    // 自定义代理规则
    proxy: {},
  },
  build: {
    // 设置最终构建的浏览器兼容目标
    target: 'es2015',
    // 构建后是否生成 source map 文件
    sourcemap: false,
    // chunk 大小警告的限制 (以 kbs 为单位)
    chunkSizeWarningLimit: 2000,
    // 启用/禁用 gzip 压缩大小报告
    reportCompressedSize: false,
  }
})
```

如果想了解更多的 vite 的配置及用法，可以查看官网 <a href="https://cn.vitejs.dev/config/">https://cn.vitejs.dev/config/</a>

#### <div id="id3">三）目录结构<a href="#back"> 回到顶部</a></div>

目录结构设计成如下：

```
｜--- dist/
｜--- src/
   |--- api/               # 接口请求目录
   |--- assets/            # 静态资源目录
   |--- common/            # 通用类库目录
   |--- components/        # 公共组件目录
   |--- router/            # 路由配置目录
   |--- store/             # 存放状态管理目录
   |--- styles/            # 通用样式目录
   |--- utils/             # 工具函数目录
   |--- views/             # 页面组件目录
   |--- App.vue
   |--- main.js
|--- test/                 # 单元测试目录
|--- index.html
|--- jsconfig.json         # Javascript 配置文件
|--- vite.config.js        # vite 配置文件
|--- package.json
```

#### <div id="id4">四）集成 Vue Router 路由工具<a href="#back"> 回到顶部</a></div>

##### 注意：Vue2.x 只能使用 Vue Router 3 版本

##### 1) 安装依赖

```
npm i vue-router@3
```

##### 2) 创建路由配置文件

在 src/router 目录下新建 index.js 文件 与 modules 文件夹。

```
|--- src/
| |--- router/
    |--- modules/  // 路由模块
    |--- index.js  // 路由配置文件
```

src/router/index.js 添加如下代码：

```
import Vue from 'vue';
import VueRouter from 'vue-router';

import routers from './modules/index';

Vue.use(VueRouter);

const routes = [...routers];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
```

在 src/router/modules 文件夹下新建 index.js 文件，里面存放相关的路由数据。代码如下：

```
export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  }
]
```

根据上面的路由配置，我们需要在 src 下创建 views 目录，用来存储页面组件。

挂载路由配置：

在 src/main.js 文件中挂载路由配置，如下代码：

```
import Vue from 'vue'
import App from './App.vue'
import router from './router';

import './assets/main.css'

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
```

#### <div id="id5">五）集成 Vuex 全局状态管理工具 <a href="#back"> 回到顶部</a></div>

##### 注意：Vue2.x 只能使用 Vuex3 版本。

##### 1）安装依赖文件

```
npm i vuex@3
```

##### 2) 创建仓库配置文件

在 src/store 目录下新建 index.js 文件 和 modules 文件夹

```
|--- src/
| |--- store/
    |--- modules/
    |--- index.js
```

src/store/index.js 代码如下：

```
import Vue from 'vue';
import Vuex from 'vuex';

import counter from './modules/counter';

Vue.use(Vuex);

const store = new Vuex.Store({
  // 严格模式
  strict: import.meta.env.MODE !== 'production',
  modules: { counter },
});

export default store;
```

在 src/store/modules 文件夹下新建 counter.js 文件。 计数器全局状态的示列：

```
const state = {
  count: 0,
};

const mutations = {
  increment(state) {
    state.count++;
  },
};

const actions = {
  increment({ commit }) {
    commit('increment');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
```

##### 3) 挂载 Vuex 配置

在 src/main.js 文件中挂载 Vuex 配置；代码如下：

```
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

import './assets/main.css'

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
```

#### <div id="id6">六）集成 Axios HTTP 工具 <a href="#back"> 回到顶部</a></div>

##### 1）安装依赖

```
npm i axios
```

##### 2) 请求配置

在 utils 目录下创建 request.js 文件，配置请求拦截和响应拦截。

```
|--- src/
  |--- api/    # 接口
  |--- utils/
    |--- request.js  # axios 请求库的二次封装
```

src/utils/request.js 添加如下代码：

```
import axios from 'axios';

// 创建请求实列
const instance = axios.create({
  baseURL: '/api',
  // 指定请求超时的毫秒数
  timeout: 3000,
  // 表示跨域请求时是否需要使用凭证
  withCredentials: false,
});

// 前置拦截器 (发起请求之前的拦截)
instance.interceptors.request.use((config) => {
  /**
   * 这里一般会携带前台的参数发送给后台，比如下面如下代码
   * const token = getToken();
   * if (token) {
   *   config.headers.token = token;
   * }
   */
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 后置拦截器 (获取响应时的拦截)

instance.interceptors.response.use((response) => {
  /**
   * 根据我们的项目实际情况对 response 和 error 做处理
   */
  return response;
}, (error) => {
  const { response } = error;
  if (response && response.data) {
    return Promise.reject(error);
  }
  return Promise.reject(error);
});

// 导出常用的函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const post = (url, data = {}, params = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    params,
  });
};

/**
 * @param {string} url
 * @param {object} params
 */
export const get = (url, params = {}) => {
  return instance({
    method: 'get',
    url,
    params,
  })
};

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const put = (url, data = {}, params = {}) => {
  return instance({
    method: 'put',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export const _delete = (url, params = {}) => {
  return instance({
    method: 'delete',
    url,
    params,
  })
}

export default instance;
```

之后我们在 src/api 文件夹中以业务模型对接口进行拆分。 比如，将所有跟用户相关的接口封装在 User 类中，此类称为用户模型。

在 User 类中可以有 登录/注册/获取用户信息等方法。类似的代码如下：

```
// src/api/user.js

import { post } from '@/utils/request';
export default class User {
  /**
   * 登录接口
   * @param {string} username 用户名
   * @param {string} password 密码
   */
  static async login(username, password) {
    return post('/login', {
      username,
      password,
    });
  }
}
```

##### 如何调用呢？

在页面上需要使用接口的地方，引入对应的业务模型文件。比如如下代码：

```
<script>
  import User from '@/api/user';
  export default {
    data() {
      return {
        username: '',
        password: '',
      }
    },
    methods: {
      async login() {
        const res = await User.login(this.username, this.password);
        console.log('----返回数据----', res);
      }
    }
  }
</script>
```

#### <div id="id7">七）集成 CSS 预处理器 Less <a href="#back"> 回到顶部</a></div>

我们使用 CSS 预处理器 Less。Vite 内部已经帮我们集成了相关的 loader。不需要我们额外配置。

##### 1）安装依赖

```
npm i less -D
```

#### 2) 如何使用

在 <style></style> 样式标签中引用 lang="less" 即可。

```
<style lang="less"></style>
```

#### 3) 全局样式

在 src/styles 目录下创建 variables.less 全局样式文件:

```
|--- src/
| |--- styles/
    |--- variable.less // 全局样式文件
```

然后在 vite.config.js 配置文件中新增 CSS 预处理器相关配置即可实现 less 全局样式。

```
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve('src/style/variables.less')}";`,
        },
        math: 'strict',
        javascriptEnabled: true,
      },
    },
  },
})
```

#### <div id="id8">八）代码规范 <a href="#back"> 回到顶部</a></div>

下面我们来讲解如何使用 EditorConfig + Eslint + Prettier + Stylelint 组合来实现代码规范化。

#### 8.1）集成 EditorConfig 配置

EditorConfig 主要用于统一不同 IDE 编辑器的编码风格。
在项目的根目录下添加 .editorconfig 文件；内容如下：

```
# 表示是最顶层的 EditorConfig 配置文件
root = true

# 表示所有文件适用
[*]
# 缩进风格（tab | space）
indent_style = space
# 控制换行类型(lf | cr | crlf)
end_of_line = lf
# 设置文件字符集为 utf-8
charset = utf-8
# 去除行首的任意空白字符
trim_trailing_whitespace = true
# 始终在文件末尾插入一个新行
insert_final_newline = true

# 表示仅 md 文件适用以下规则
[*.md]
max_line_length = off
trim_trailing_whitespace = false

# 表示仅 ts、js、vue、css 文件适用以下规则
[*.{ts,js,vue,css}]
indent_size = 2
```

如果使用 VSCode 编辑 中使用需要安装 EditorConfig for VS Code 插件。如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/2.png" /> <br />

#### 8.2) 集成 ESLint 的配置

Eslint 是一款代码检测工具，它可以检测项目中编写不规范的代码，如果写出不符合规范的代码会被警告。

##### 安装依赖如下：

```
eslint - ESLint 字体
eslint-define-config - 改善 ESLint 规范编写体验
eslint-plugin-vue - 适用于 Vue 文件的 ESLint 的插件。
eslint-config-airbnb-base -Airbnb Javascript 风格指南
eslint-plugin-import - 使用 eslint-config-airbnb-base 时必须安装的前置插件
vue-eslint-parser - 使用 eslint-plugin-vue 时必须安装的 ESLint 解析器
```

安装命令如下：

```
npm i eslint eslint-define-config eslint-config-airbnb-base eslint-plugin-import eslint-plugin-vue vue-eslint-parser -D
```

##### 安装插件

Visual Studio Code 编辑器使用 Eslint，配置需要下载插件 ESLint。 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/3.png" /> <br />

##### 创建 ESLint 配置文件

在项目的根目录下创建 .eslintrc.js 文件，并填入以下内容：

```
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  plugins: ['vue'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // 禁止使用多余的包
    'import/no-extraneous-dependencies': 0,
    // 确保在导入路径内一致使用文件扩展名
    'import/extensions': 0,
    // 确保导入指向可以解析的文件/模块
    'import/no-unresolved': 0,
    // 首选默认导出导入/首选默认导出
    'import/prefer-default-export': 0,
    // 要求使用 let 或 const 而不是 var
    'no-var': 'error',
    // 禁止使用 new 以避免产生副作用
    'no-new': 1,
    // 禁止变量声明与外层作用域的变量同名
    'no-shadow': 0,
    // 禁用 console
    'no-console': 0,
    // 禁止标识符中有悬空下划线
    'no-underscore-dangle': 0,
    // 禁止在可能与比较操作符相混淆的地方使用箭头函数
    'no-confusing-arrow': 0,
    // 禁用一元操作符 ++ 和 --
    'no-plusplus': 0,
    // 禁止对 function 的参数进行重新赋值
    'no-param-reassign': 0,
    // 禁用特定的语法
    'no-restricted-syntax': 0,
    // 禁止在变量定义之前使用它们
    'no-use-before-define': 0,
    // 禁止直接调用 Object.prototypes 的内置属性
    'no-prototype-builtins': 0,
    // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'no-unneeded-ternary': 'error',
    // 禁止重复模块导入
    'no-duplicate-imports': 'error',
    // 禁止在对象中使用不必要的计算属性
    'no-useless-computed-key': 'error',
    // 禁止不必要的转义字符
    'no-useless-escape': 0,
    // 禁用 continue 语句
    'no-continue': 0,
    // 强制使用一致的缩进
    indent: ['error', 2, { SwitchCase: 1 }],
    // 强制使用骆驼拼写法命名约定
    camelcase: 0,
    // 强制类方法使用 this
    'class-methods-use-this': 0,
    // 要求构造函数首字母大写
    'new-cap': 0,
    // 强制一致地使用 function 声明或表达式
    'func-style': 0,
    // 强制一行的最大长度
    'max-len': 0,
    // 要求 return 语句要么总是指定返回的值，要么不指定
    'consistent-return': 0,
    // 强制switch要有default分支
    'default-case': 2,
    // 强制剩余和扩展运算符及其表达式之间有空格
    'rest-spread-spacing': 'error',
    // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-const': 'error',
    // 强制箭头函数的箭头前后使用一致的空格
    'arrow-spacing': 'error',
    // 只强制对象解构，不强制数组解构
    'prefer-destructuring': ['error', { object: true, array: false }],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // 要求组件名称总是多个单词
        'vue/multi-word-component-names': 0,
      },
    },
  ],
});
```

##### 创建 ESLint 过滤规则

在项目的根目录下 添加一个 .eslintignore 文件，内容如下：

```
dist
node_modules
!.prettierrc.js
components.d.ts
auto-imports.d.ts
```

#### 8.3) 集成 Prettier 配置

Prettier 是一款强大的代码格式化工具，支持 JavaScript, TypeScript, CSS, SCSS, Less, JSX, Vue, GraphQL, JSON 等语言。

安装依赖：

```
npm i prettier -D
```

##### 安装插件

Visual Studio Code 编辑器使用 Prettier 配置需要下载插件 Prettier-Code formatter

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/4.png" /> <br />

##### 创建 Prettier 配置文件

Prettier 支持多种格式的配置文件，比如 .json/.yml/.yaml/.js 等。

在项目的根目录下创建 .prettierrc.js 文件，并填入以下内容：

```
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾需要有逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  // 格式化嵌入的内容
  embeddedLanguageFormatting: 'auto',
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false,
};
```

##### 创建 Prettier 过滤规则

在项目的根目录添加一个 .prettierignore 文件，内容如下：

```
## OS
.DS_Store
.idea
.editorconfig
pnpm-lock.yaml
.npmrc

# Ignored suffix
*.log
*.md
*.svg
*.png
*.ico
*ignore

## Local
.husky

## Built-files
.cache
dist
```

#### <div id="id9">九）解决 Prettier 和 ESLint 的冲突 <a href="#back"> 回到顶部</a></div>

本项目中的 ESLint 配置了使用 Airbnb Javascript 风格指南校验，其规则之一是代码结束后面要加分号，而在 Prettier 配置文件中加了代码结束后面不加分号配置项。从而
会产生冲突。
解决两者冲突的问题，需要使用到 esling-plugin-prettier 和 eslint-config-prettier。

1）esling-plugin-prettier 将 Prettier 的规则设置到 ESLint 的规则中。
2）eslint-config-prettier 关闭 ESLint 中与 Prettier 中会发生冲突的规则。

##### 安装依赖

```
npm i eslint-plugin-prettier eslint-config-prettier -D
```

##### 修改 ESLint 的配置文件

修改 .eslintrc.js 文件，在 extends 中添加 plugin:prettier/recommended 规则，（该规则一定要加在最后）。

```
module.exports = {
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
}
```

##### 自动格式化代码

Visual Syudio Code 在 settings.json 设置文件中, 增加以下代码：

打开 settings.json 方式： Code -> 首选项 -> 设置

在设置 UI 页面上，右上角的装订线中有一个特殊的按钮，用于在 settings.json 文件和设置 UI 之间切换，

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  }
}
```

#### <div id="id10">十）集成 Stylelint 配置 <a href="#back"> 回到顶部</a></div>

Stylelint 是一个强大，先进的 CSS 代码检查器，可以帮助我们规避 CSS 代码中的错误并保持一致的编码风格。

##### 安装依赖文件

```
1) stylelint
2) stylelint-less - Stylelint Less 规则
3）stylelint-config-prettier  关闭Stylelint中与 Prettier 中发生冲突的规则
4）stylelint-config-standard  Stylelint 官方推荐的规则
5）stylelint-config-recess-order 对css声明进行排序
6) stylelint-order  CSS属性顺序规则插件
```

```
npm i stylelint stylelint-less stylelint-config-prettier stylelint-config-standard stylelint-config-recess-order stylelint-order -D
```

##### 安装插件

Visual Studio Code 编辑器使用 Stylelint 配置需要下载插件 Stylelint, 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/5.png" /> <br />

##### 创建 Stylelint 配置文件

在项目的根目录下创建 .stylelintrc.js 文件，配置代码如下：

```
module.exports = {
  root: true,
  defaultSeverity: 'error',
  plugins: ['stylelint-order', 'stylelint-less'],
  extends: [
    'stylelint-config-standard', // the standard shareable config for Stylelint
    'stylelint-config-html/html', // the shareable html config for Stylelint.
    'stylelint-config-html/vue', // the shareable vue config for Stylelint.
    'stylelint-config-recess-order', // use the clean order for properties
    'stylelint-config-prettier', // turn off any rules that conflict with Prettier
  ],
  rules: {
    // 禁止在覆盖高特异性选择器之后出现低特异性选择器
    'no-descending-specificity': null,
    // 禁止空源码
    'no-empty-source': null,
    // 禁止字体族中缺少泛型族关键字
    'font-family-no-missing-generic-family-keyword': null,
    // 禁止未知的@规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
        ],
      },
    ],
    // 不允许未知函数
    'function-no-unknown': null,
    // 不允许未知单位
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    // 不允许选择器使用供应商前缀
    'selector-no-vendor-prefix': null,
    // 指定关键帧名称的模式
    'keyframes-name-pattern': null,
    // 指定类选择器的模式
    'selector-class-pattern': null,
    // 不允许值使用供应商前缀
    'value-no-vendor-prefix': null,
    // 要求或禁止在规则之前的空行
    'rule-empty-line-before': ['always', { ignore: ['after-comment', 'first-nested'] }],
    // 指定字符串使用单引号
    'string-quotes': 'single',
    // 指定@规则名的大小写
    'at-rule-name-case': 'lower',
    // 指定缩进
    indentation: [2, { severity: 'warning' }],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
```

##### 创建 Stylelint 过滤规则

在项目的根目录下添加一个 .stylelintignore 文件， 内容如下：

```
# .stylelintignore
# 旧的不需打包的样式库
*.min.css

# 其他类型文件
*.js
*.jpg
*.woff

# 测试和打包目录
/test/
/dist/*
/public/*
public/*
/node_modules/
```

##### 启用 Vue 文件支持

Stylelint v14 以上默认不支持 vue 文件中的 style 代码自动检测。

##### 安装依赖

```
stylelint-config-html  解析vue文件
postcss-html 使用 stylelint-config-html 依赖的模块
postcss-less 对less文件进行解析
```

```
npm i stylelint-config-html postcss-html postcss-less -D
```

##### 修改 Stylelint 配置文件

修改 .stylelintrc.js 文件，添加以下配置

```
module.exports = {
  overrides: [
    {
      files: ['*.vue', '**/*.vue', '*.html', '**/*.html'],
      customSyntax: 'postcss-html',
      rules: {
        // 禁止未知的伪类选择器
        'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep', 'global'] }],
        // 禁止未知的伪元素选择器
        'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'] }],
      },
    },
    {
      files: ['*.less', '**/*.less'],
      customSyntax: 'postcss-less',
      rules: {
        'less/color-no-invalid-hex': true,
        'less/no-duplicate-variables': true,
      },
    },
  ],
};
```

##### 修改 Visual Studio Code 工作区配置

Visual Studio 在 settings.json 设置文件中，增加以下代码：

```
{
  "stylelint.validate": ["css", "less", "postcss", "scss", "vue", "sass", "html"]
}
```

#### <div id="id11">十一）集成 husky 和 lint-staged <a href="#back"> 回到顶部</a></div>

在项目中已经集成了 ESLint 和 Prettier，在编码时候，这些工具可以对代码进行实时校验，在一定程度上能有效规范所写的代码，但是有些人可能对这些规范视而不见。
依旧按照自己编程风格来写代码，开发完成后就直接把代码提交到了仓库。日积月累，ESLint 也就没有什么用。

因此，我们还需要做一些限制，让没通过 ESLint 检测和修复的代码 禁止提交。从而保证了仓库的代码都是符合规范的。

为了解决这些问题，需要使用到 Git Hook，在本地执行 git commit 的时候，就对所提交的代码 进行 ESlint 检测 和 修复(即执行 eslint --fix)。如果这些代码没有通过 ESLint 规则校验，则禁止提交。

实现这一功能，需要借助 husky + lint-staged

##### 配置 husky

注意：本项目使用 husky 6.x 版本。

使用 husky-init 命令快速在项目初始化 husky 配置。

```
# 初始化仓库
git init

# 初始化
npx husky-init

# 安装依赖
npm install
```

husky 包含很多 hook(钩子)，常用的有 pre-commit, commit-msg.

使用 pre-commit 来触发 ESLint 命令，比如修改 .husky/pre-commit 文件触发如下命令：

```
eslint --fix ./src --ext .vue,.js,.ts
```

pre-commit hook 文件的作用是：当执行 git commit -m 'xxxx' 的时候，会先对 src 目录下所有的 .vue, .js, .ts 文件执行 eslint --fix 命令，如果 ESLint 通过，成功 commit，否则终止 commit。

但是又存在一个问题是：有时候我们明明只改动了一两个文件，却要对所有的文件执行 eslint --fix。

因此我们只需要使用 ESLint 修复此次写的代码，而不去影响其他的代码，我们需要借助 lint-staged 工具。

##### 配置 lint-staged

lint-staged 一般结合 husky 来使用，它可以让 husky 的 hook 触发的命令只作用于 git 暂存区的文件，而不会影响其他的文件。

##### 安装依赖

```
npm i lint-staged -D
```

##### 新增配置

我们在 package.json 里增加 lint-staged 配置项

```
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.vue": [
      "prettier --write",
      "eslint --fix",
      "stylelint --fix"
    ],
    "*.{html,vue,vss,sass,less}": [
      "prettier --write",
      "stylelint --fix"
    ],
    "package.json": [
      "prettier --write"
    ],
    "*.md": [
      "prettier --write"
    ]
  },
}
```

##### 修改触发命令

修改 .husky/pre-commit 文件触发的命令为：

```
npx lint-staged
```

.husky/pre-commit 文件的所有命令如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
. "$(dirname "$0")/common.sh"

npx lint-staged
```

经过以上配置之后，就可以每次在提交之前对所有的代码进行格式化，保证线上代码的规范性。

#### <div id="id12">十二）提交规范 <a href="#back"> 回到顶部</a></div>

多人协作的项目中，在提交代码的环节，也存在一种情况，不能保证每个人对提交信息的准确描述，因此会出现提交信息紊乱，风格不一致的情况。

如果我们 git commit 的描述信息精准，在后期维护和 Bug 处理时会变得有据可查，项目开发周期内还可以根据规范的提交信息快速生成开发日志，从而方便我们追踪项目和把控进度。

##### 集成 cz-git 实现规范提交

安装依赖

```
npm install -D cz-git
```

指定适配器

修改 package.json 文件，添加 config 指定使用的适配器。

```
{
  "scripts": {},
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

##### 集成 commitlint 验证规范提交

尽管我们制定了规范，但是在多人协作的项目中，总有些人依旧是我行我素。因此在提交代码这个环节，也需要增加一个限制。只让符合 Angular 规范的 commit message 通过。

因此我们要借助 @commitlint/config-conventional 和 @commitlint/cli 工具来实现

##### 安装命令

```
npm i @commitlint/config-conventional @commitlint/cli -D
```

##### 配置

在项目根目录下创建 commitlint.config.js 文件，并填入以下内容：

```
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

然后我们使用 husky 命令 在 .husky 目录下创建 commit-msg 文件， 并在此添加如下命令：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"

```

#### <div id="id13">十三）使用 Github Actions 实现自动部署 <a href="#back"> 回到顶部</a></div>

下面我们可以使用 GitHub Actions 来完成前端自动化部署功能，<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/gitActions.md">Github Actions 实现前端应用部署</a> 可以看之前的文章。

<a href="https://github.com/kongzhi0707/vite3-vue2-router-vuex-javascript">github 源码查看</a>

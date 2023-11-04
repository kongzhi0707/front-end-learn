### 从 0 搭建 vite + vue3 + router + Pinia + typescript 脚手架项目

我们基于 Vite 从 0 到 1 搭建一个 Vue3 相关的工程化模版项目，包括集成 TypeScript, Vitest, Tsx, Vue Router, Pinia, Eslint, Prettier, Husky, Git Message 规范等。

#### 一）创建项目

首先我们使用 Vite 可以快速创建一个基本的 Vue 项目。使用如下命令：

```
npm create vite@latest my-vue-app --template vue-ts
```

项目创建好之后我们安装依赖然后运行项目

```
// 安装依赖
npm install

// 本地运行
npm run dev
```

启动后，我们可以看到 初始 页面了。

##### scripts 脚本

Vite 帮我们创建的项目有以下三个脚本。

```
"scripts": {
  "dev": "vite",
  "build": "vue-tsc && vite build",
  "preview": "vite preview"
},
```

其中 dev 是运行本地开发环境，build 是编译正式环境需要的资源，preview 是预览我们 build 出来的资源。

#### 二）集成 Vitest

Vitest 是一个由 Vite 提供支持的单元测试框架，和 Vite 完全兼容。

首先我们安装 Vitest，安装命令如下：

```
npm install vitest -D
```

然后我们在根目录下创建一个目录 tests, 在 tests 下创建一个文件 index.spec.ts , 在该文件下编写我们的单元测试，代码如下：

```
import { test, expect } from 'vitest';

test("First test", () => {
  expect(1 + 1).toBe(2);
});
```

然后我们再在 package.json 里配置测试脚本，如下命令：

```
"scripts": {
  "test": "vitest"
}
```

现在我们执行命令 npm test 就会执行我们的测试用例。Vite 会自动找到项目里面以 test.ts 或 spec.ts 结尾的文件作为测试文件，然后执行他们。

##### 2.1) Vitest 监听模式

Vitest 默认是以监听模式启动的，在我们执行 npm test 的时候，测试启动的服务是不会退出的，它只会监听我们的代码改变，如果改变了会重新执行测试程序，如果不想以监听的模式启动，只想执行单次测试。那么只需要把 "test": "vitest" 改为 "test": "vitest run" 即可。更多配置可查看 <a href="https://cn.vitest.dev/guide/cli.html">vite 文档</a>

##### 2.2) Vitest 测试 ts 模块

在使用 jest 测试 ts 文件的时候，我们需要很多配置来支持，使用 vitest 不需要做任何的配置。默认支持 ts。
比如我们写了一个 sum.ts 的文件，代码如下：

```
// src/utils/sum.ts 代码如下：
function sum(...numbs: number[]): number {
  const result = numbs.reduce((pre, current) => {
    return pre + current;
  });
  return result;
}

export { sum };
```

测试文件可以直接引用这个模块进行测试。如下代码

```
// test/index.spec.ts 测试代码如下：
import { test, expect } from 'vitest';
import { sum } from "../src/utils/sum";

test("First test", () => {
  expect(1 + 1).toBe(2);
});

test("Sum function test", () => {
  expect(sum(1, 2, 3)).toBe(6);
});
```

然后我们执行 npm test 后可以看到测试被正确执行。

##### 2.3）Vitest 测试 vue 模块

在 tests 目录下新建一个 hello.spec.ts 文件，输入内容如下：

```
import Hello from "../src/components/HelloWorld.vue";
```

然后我们发现有报错，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/6.png" /> <br />

我们需要将 tests 目录下的文件加到 ts 的检测目录里面，因此我们需要在 tsconfig.json 里面进行如下配置:

```
"include": [
  "src/**/*.ts",
  "src/**/*.d.ts",
  "src/**/*.tsx",
  "src/**/*.vue",
  "tests/**/*.ts" // 新增的配置
],
```

我们现在在 test/hello.spec.ts 里面输入以下内容：

```
import Hello from "../src/components/HelloWorld.vue";

import { test, expect } from 'vitest';

test("Test Hello.vue", () => {
  console.log(Hello);
});
```

然后我们执行 npm test ，是可以正确执行测试的。说明 vitest 支持对 vue 文件的解析的。是因为 vitest 可以共用 vite 的配置。

我们在项目的根目录下查看 vite.config.ts 如下代码：

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
```

在该配置文件里面，@vitejs/plugin-vue 插件是可以支持 vue 文件的解析的。因此 vitest 默认可以共享 vite 的配置及相关的功能的。

##### 2.4）Vitest 配置

如上代码，我们引入了 test, expect，如果我们想让他们支持全局使用的话，就是不引入他们，也可以全局使用 test 和 expect 方法。这个时候我们可以通过配置来支持这个功能。

我们可以直接在 vite.config.ts 里面做配置，配置如下：

```
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [vue()],
})
```

如上新增了 /// <reference types="vitest" /> 代码 和 test: { globals: true },

上面 三斜杠 指令是引入 vitest 相关的类型配置。Vitest 相关的配置需要添加在 test 属性里，这里我们添加了 globals: true 表示全局使用 test, expect 等方法。

如果我们不想把 Vitest 相关的配置写在 vite.config.ts 里面，我们也可以单独写一个配置文件名为 vitest.config.ts。 那么 vitest 会使用这个文件作为配置文件而忽略 vite.config.js. 之前的 vite.config.ts 文件配置项 都需要复制到 vitest.config.ts 文件来。具体配置可以看<a href="https://cn.vitest.dev/config/">官方文档</a>

我们现在在测试文件把 import { test, expect } from "vitest"; 发现报错了，提示找不到 test 方法，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/7.png" /> <br />

我们还需要告诉编译器这个 test 是一个全局方法，可以直接使用，我们还需要配置下 tsconfig.json 文件，在 tsconfig.json 里增加 types 选项，输入内容如下：

```
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

现在我们再看文件就不会报错了，接着在控制命令行中 运行 npm test 也可以测试成功的。

##### 2.5）测试 Vue 单文件组件

测试 Vue 单文件组件需要安装 @vue/test-utils, 详细信息可查看 <a href="https://test-utils.vuejs.org/guide/">官方文档</a>, 安装命令如下：

```
npm install @vue/test-utils -D
```

然后我们可以使用 @vue/test-utils 里相关的方法来挂载组件，我们可以测试下 Vite 自动生成的 HelloWorld.vue 文件。代码如下：

```
<script setup lang="ts">
  import { ref } from 'vue'
  defineProps<{ msg: string }>()
  const count = ref(0)
</script>
<template>
  <h1>{{ msg }}</h1>
</template>

<style scoped></style>
```

如上代码，会接收一个 prop: msg, 然后将对应的内容显示出来，我们可以测试这个过程是否正确执行。
在 HelloWorld.vue 同级目录编写 HelloWorld.spec.ts，代码如下：

```
import HelloWorld from "./HelloWorld.vue";
import { mount } from "@vue/test-utils";

test("Test HelloWorld Props", () => {
  const wrapper = mount(HelloWorld, {
    props: {
      msg: "欢迎观临",
    },
  })
  expect(wrapper.text()).toContain("欢迎观临");
})
```

如上 mount 方法会挂载我们的组件，然后我们判断渲染出的组件里的内容是否包含 prop 传进去的内容。
如下，我们运行 npm test 测试发现报如下错了，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/8.png" /> <br />

错误信息提示 document is not defined, 这是因为我们执行 mount 方法的时候会创建 dom 元素，我们现在是 node 环境，没有浏览器相关的 API。因此要解决这个问题我们需要模拟浏览器相关的 API，目前有两个库可以用来实现这个功能，分别是 jsdom 和 happydom, 我们使用 jsdom。

安装 jsdom

```
npm install jsdom -D
```

然后配置文件 vite.config.ts 新增 environment: "jsdom"; vite.config.ts 所有代码如下：

```
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom"
  },
  plugins: [vue()],
})
```

这时候我们执行 npm test, 发现测试通过了。

##### 2.6) 支持 jsx/tsx

如果我们要支持 jsx/tsx，需要安装一个插件 @vitejs/plugin-vue-jsx ， 我们可以查看<a href="https://www.npmjs.com/package/@vitejs/plugin-vue-jsx">文档。</a>

我们需要安装它，安装命令如下:

npm install @vitejs/plugin-vue-jsx -D

然后配置 vite.config.ts 文件添加 vue.jsx 插件：代码如下：

```
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom"
  },
  plugins: [vueJsx(), vue()],
})
```

这个时候我们可以编写一个 HelloTsx.tsx 组件看下；如下：

src/components/HelloTsx.tsx 代码如下：

```
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return () => <div>this is tsx</div>;
  }
});
```

然后在 App.vue 里面引入：

```
<script setup lang="ts">
import HelloTsx from "./components/HelloTsx";
</script>

<template>
  <HelloTsx />
</template>

<style scoped>
</style>
```

现在我们执行 npm run dev 后可以看到组件正常显示了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/9.png" /> <br />

##### 2.7）测试 tsx 组件

当我们使用 vite 测试 tsx 组件的时候，我们需要添加一个配置 transformMode;

vite.config.ts 代码如下：

```
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: {
      web: [/\.tsx$/],
    }
  },
  plugins: [vueJsx(), vue()],
})
```

因为默认当我们使用 vitest 测试 tsx 组件的时候，vitest 会认为这是服务端，所以使用 @vitejs/plugin-vue-jsx 转换出来的代码是 SSR 模式的，我们需要告诉 Vitest 这些文件需要使用 Web 模式继续测试。因此我们需要添加如下配置：

```
transformMode: {
  web: [/\.tsx$/],
},
```

详细配置我们可以查看 <a href="https://cn.vitest.dev/config/">官方文档</a>

我们现在可以编写一个 tsx 的测试文件看下：

// src/components/HelloTsx.spec.ts

```
import HelloTsx from "./HelloTsx";
import { mount } from "@vue/test-utils";

test("Test HelloWorld Props", () => {
  const wrapper = mount(HelloTsx, {});
  expect(wrapper.text()).toContain("this is tsx");
})
```

现在我们继续执行 npm test 后测试可以正确执行了。

#### 三）配置 Eslint 和 Prettier

##### 3.1) 安装及配置 Eslint

要在 Vscode 中通过 Eslint 检测语法，首先我们需要安装 ESlint 插件，如下图所示

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/10.png" /> <br />

1. 安装完插件后我们需要安装 eslint npm 包，插件需要通过这个 eslint npm 包来对我们的代码进行检测。

2. 安装命令如下:

```
npm install eslint -D
```

3. 使用 eslint 初始化 .eslintrc.js 配置文件

```
npx eslint --init
```

然后根据提示选择配置完成文件的生成，我这边选择的配置如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/11.png" /> <br />

然后在我们的项目的根目录下会生成 .eslintrc.cjs 文件如下：

```
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "standard-with-typescript",
    "plugin:vue/vue3-essential"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
          "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  "rules": {
  }
}
```

现在解析 vue 文件会报错，我们需要一个 vue 文件的 parser。使用 vue-eslint-parser, 我们把 parser: "@typescript-eslint/parser"移到 parserOptions 里，然后添加 parser: "vue-eslint-parser".

因此 .eslintrc.cjs 文件是如下配置:

```
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "standard-with-typescript",
    "plugin:vue/vue3-essential"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "parser": "@typescript-eslint/parser",
  },
  "plugins": [
    "vue"
  ],
  "rules": {
  }
}
```

然后我们新建一个 .eslintignore 文件用来设置不需要使用 eslint 进行检测的文件，内容如下：

```
node_modules
dist
```

##### 3.2) Prettier 配置

Eslint 主要职责是用来检测代码的语法错误，而 Prettier 主要是负责格式化相关的检测。也就是代码格式是否好看。这两个插件是相互配合的。但是也有一些重叠的地方，比如 ESlint 会做一些格式化代码的工作，Prettier 也会检查一些语法。所以需要做一些配置避免两个插件规则的冲突。比如一个设置了代码使用双引号，一个设置了使用单引号。这时候我们需要合并规则。

1. 首先我们要确认我们的 vscode 是否安装了 Prettier 插件，如果没有安装，先要安装，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/12.png" /> <br />

2. 项目的根目录下 创建 .prettierrc.cjs 文件，内容设置如下：

```
module.exports = {
  singleQuote: true,
};
```

如上我们的规则设置是需要单引号规则，但是这个规则可能和 ESlint 的默认规则有冲突。因此我们需要合并规则，当有冲突的时候以 Prettier 的规则为准。

3. 安装 eslint-plugin-prettier 和 eslint-config-prettier

eslint-config-prettier 插件的作用是：把 Eslint 和 Prettier 有冲突的规则关掉。eslint-plugin-prettier 会将 Prettier 里的规则设置到 Eslint 里面。通过这两个插件的配合，就完成了 Eslint 和 Prettier 规则的合并。其中冲突的规则以 Prettier 里面的规则为准则。

首先我们先安装这两个插件, 安装命令如下：

```
npm install eslint-plugin-prettier eslint-config-prettier prettier -D
```

然后我们在 .eslintrc.cjs 里的 extends 里添加 plugin:prettier/recommended 插件，要添加到最后。这时候规则就已经合并了。代码如下：

```
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "standard-with-typescript",
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "parser": "@typescript-eslint/parser",
  },
  "plugins": [
    "vue"
  ],
  "rules": {
  }
}
```

Prettier 的规则已经通过插件的形式被设置到了 Eslint 的规则里面了。

4. 在项目的根目录下创建 .prettierignore 文件用于设置不想要使用 Prettier 进行格式化的文件，内容如下：

```
dist
node_modules
```

#### 四）代码提交检查

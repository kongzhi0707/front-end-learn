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

eslint-config-prettier 插件的作用是：把 Eslint 和 Prettier 有冲突的规则关掉。
eslint-plugin-prettier 会将 Prettier 里的规则设置到 Eslint 里面。
通过这两个插件的配合，就完成了 Eslint 和 Prettier 规则的合并。其中冲突的规则以 Prettier 里面的规则为准则。

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

以上的配置让我们可以在编译器检测出不符合规范的代码，但是还是可以提交的。为了保证所有人都遵守规范，我们需要在提交代码的时候进行检查，如果不符合规范不让提交。

##### 1）安装 husky

```
npm install husky -D
```

##### 2) 添加配置

```
npx husky install
```

在执行命令之前，我们先要对我们的项目 git init 下， 然后再 执行 npx husky install 将会生成 ./husky 的文件夹，在这里我们可以配置 Git Hooks 的脚本文件。

##### 3) 然后在 package.json 中添加 prepare 钩子，执行命令如下:

```
npm pkg set scripts.prepare="husky install"
```

执行 npm pkg set scripts.prepare="husky install" 将会设置 prepare 脚本，并将该脚本的执行命令设置为 husky install, 它将会在项目启动时初始化 Git Husky.

执行完之后 在 package.json 中添加如下命令:

```
"scripts": {
  "prepare": "husky install",
}
```

prepare 钩子会在我们执行完 npm install 后执行, 因为我们不是第一次下载这个项目，所以手动执行 npm run prepare。 执行完之后会在根目录生成一个 .husky 文件夹。

##### 4) 设置 pre-commit 钩子，执行如下命令

```
pnpm husky add .husky/pre-commit "pnpm lint-staged"
```

执行这个命令后会生成 .husky/pre-commit 文件，该文件的内容如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

我们执行 git commit 的时候会先触发 pre-commit 的钩子，然后会执行这个钩子里的 pnpm lint-staged 脚本，这个脚本是用来做 eslint 检查的，只有检查通过才会执行后面的提交工作。

##### 5) 为了让 pnpm lint-staged 可以正常工作，我们需要安装 lint-staged

```
pnpm install lint-staged -D
```

我们使用 lint-staged 来检查代码的理由是：不想每次执行 eslint 代码都检查所有的代码，因为有些代码我们没有改动过，所以使用 lint-staged 来检查，只检查暂存区的代码，也就是 git add 过的代码。

##### 6）我们还需要设置 lint-staged 的检测规则，在 package.json 里添加如下代码：

```
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix"
  ],
  "*.vue": [
    "eslint --fix"
  ],
  "*.{html,vue,vss,sass,less}": [
    "prettier --write"
  ],
  "package.json": [
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
},
```

这时候当我们执行 git commit 的时候会触发 pre-commit 钩子，然后执行钩子函数 pnpm lint-staged，这时候 lint-staged 会调用 package.json 里配置的规则进行校验。

#### 五）校验 git commit message

校验提交规范我们需要用到三个工具 commitizen/commitlint/husky

```
1) commitizen 是一个命令行交互工具，用来帮助我们书写正确的 Message 格式。
2）commitlint 用来对 message 做校验的。
3）husky 用来让我们设置在 commit-msg 这个钩子里触发 commitlint 校验的。
```

因此我们需要安装他们，husky 我们之前已经安装过了，现在我们安装另外两个。

安装 commitizen 命令如下:

```
pnpm install commitizen -D
```

然后安装 cz-conventional-changelog;

```
pnpm add cz-conventional-changelog -D
```

在 package.json 中增加如下配置:

```
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
},
```

这时候我们可以使用 pnpm cz 命令代替 git commit 命令，pnpm cz 会用命令行交互的方式指引我们写出符合规范的 commit message。

##### Commitlint

当然我们也可以不使用 pnpm cz, 我们自己写 message 也可以，但是自己写出来可能是不规范的，因此我们需要使用 commitlint 来做校验。

##### 安装 Commitlint

```
pnpm install --save-dev @commitlint/{config-conventional,cli}
```

然后配置 config；

```
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.cjs
```

这会生成一个 commitlint.config.cjs 文件，内容如下：

```
module.exports = { extends: ['@commitlint/config-conventional'] };
```

然后我们配置 git 钩子函数，在终端执行如下命令：

```
pnpm husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

这会在.husky 目录下生成一个 commit-msg 文件，内容如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

这时候我们再执行 git commit，输入不符合规范的 message 会提示错误。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/template/images/13.png" /> <br />

#### 五）配置别名 alias

我们在开发中会使用 @/component 之类的路径来简写我们的相对路径，为了实现可以使用别名，我们也需要进行响应的配置。

##### vite.config.ts 配置 alias

我们在 vite.config.ts 中增加如下配置:

```
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: join(__dirname, 'src/'),
      }
    ]
  },
})
```

如上配置告诉 vite 解析到 @/ 开头的路径的时候，需要替换为 src 目录的路径。

##### tsconfig.json 配置 alias

在上面的 vite.config.ts 中配置好别名后，vite 就可以正确解析路径了。项目也可以正常运行。可是在我们的编辑器输入 @/ 相关的路径的时候却不会有提示，还会有报错显示找不到对应的文件。这是因为 vite.config.ts 里的配置是给 vite 用的，Vscode 并不会读取这里面的配置，要让 Vscode 也能正确解析 @/ 路径，需要在 tsconfig.json 里进行相关的配置。

在 tsconfig.json 里增加如下配置:

```
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["src/*"]
  }
},
```

如上配置是告诉 Vscode, 以 tsconfig.json 所在的当前目录作为根目录，遇到@/路径的时候，需要映射到 src/ 的路径下，这样 Vscode 也能正确解析路径别名了。

#### 六）编译脚本

我们可以在 vite.config.ts 里对如何构建生产版本做一些配置，更多配置可以看<a href="https://cn.vitejs.dev/guide/build.html#public-base-path">文档</a>, 我们这边设置编译的版本为 es2015, 是 vite 支持的最低版本。

```
build: {
  target: 'es2015', // 构建出来的产物支持的环境
},
```

现在 vite.config.ts 脚本所有配置代码如下：

```
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { join } from 'path';

import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: join(__dirname, 'src/'),
      }
    ]
  },
  build: {
    target: 'es2015', // 构建出来的产物支持的环境
  },
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

#### 七）集成 Vue Router

我们先要安装 Vue Router

```
pnpm install vue-router@4
```

然后我们在 src 目录下创建 两个目录，一个 views， 一个 router，因此我们的 src 下的 router 目录结构变为如下：

```
｜--- src
｜ |--- App.vue
｜ |--- main.ts
｜ |--- views
｜ | |--- AboutView.vue
｜ | |--- HomeView.vue
｜ |--- router
｜ | |--- index.ts
｜ | |--- modules
｜ | | |--- base.ts
｜ |--- components
｜ | |--- HelloTsx.tsx
｜ | |--- HelloWorld.vue
```

##### views 页面组件

我们在 src/views 目录下 创建两个页面组件 分别为 AboutView.vue 和 HomeView.vue。

src/views/HomeView.vue 页面代码如下：

```
<template>
  <div>This is Home Page</div>
  <HelloTsx />
  <HelloWorld msg="Vite + Vue" />
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import HelloTsx from '@/components/HelloTsx';
</script>

<style scoped></style>
```

src/views/AboutView.vue 页面代码如下：

```
<template>
  <div>This is About Page</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
```

##### router 目录用来保存路由相关的配置

router 文件夹下有一个 index.ts 文件 和 modules 目录，modules 用来保存路由模块的，路由可以根据功能或不同的页面拆分不同的 modules 中，然后在 index.ts 里面进行整合，统一导出。当我们的项目变得复杂的时候可以保持路由的清晰并且多人合作可以尽量避免 git 合并冲突。

在 modules 目录下新建一个 base.ts 来设置我们的基本路由，代码如下：

```
// src/router/modules/base.ts
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
];
```

src/router/index.ts 负责整合和导出路由，代码如下：

```
import { createRouter, createWebHistory } from "vue-router";

import baseRouters from './modules/base';

const routes = [...baseRouters];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

如上，我们使用的路由模式是 webHistory, createWebHistory 需要传递我们项目的根路径进去，import.meta.env.BASE_URL 默认是 /, 即 index.html 所在的目录。

##### App.vue 根组件

App.vue 加上路由后的简化代码如下所示:

```
<script setup lang="ts">
</script>
<template>
  <div>
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
    <RouterView />
  </div>
</template>
<style scoped></style>
```

##### main.ts 使用路由

我们还需要在 main.ts 里面引入 router，并且 use 就可以了。如下代码:

```
// src/main.ts 代码如下：
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';

createApp(App).use(router).mount('#app');
```

#### 八）集成 Pinia

<a href="https://pinia.vuejs.org/">Pina</a> 是 Vue3 官方推荐的全局状态管理工具。

我们首先需要安装它:

```
pnpm install pinia
```

创建 src/store 目录，目录结构如下:

```
|--- src
| |--- store
| | |--- index.ts  # store 配置文件
| | |--- modules   # store 模块
| | | |--- counter.ts  # 负责存储的 counter 的 store
```

src/store/modules/counter.ts 代码如下：

```
import { defineStore } from "pinia";
import { ref } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  function increment() {
    count.value++;
  }
  return { count, increment };
})
```

在 store/index.ts 代码内 创建 store 示列，并且导出 modules 里所有模块。

```
import { createPinia } from 'pinia';

const store = createPinia();

export default store;

export * from './modules/counter';
```

在 main.ts 使用 store 组件

```
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import store from './store';

createApp(App).use(router).use(store).mount('#app');
```

然后我们可以在我们的组件使用 store 了，我们在 views/AboutView.vue 组件添加 store 的逻辑如下：

```
<template>
  <div>
    <div>This is About Page</div>
    <button @click="increment">counter from store {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
  import { useCounterStore } from '@/store';
  import { storeToRefs } from 'pinia';
  const counterStore = useCounterStore();
  const { count } = storeToRefs(counterStore);
  const { increment } = counterStore;
</script>

<style scoped></style>
```

#### 九）集成 element-plus

首先我们需要安装 element-plus. 安装命令如下:

```
pnpm install element-plus
```

##### 自动导入

然后我们需要安装两个插件

```
pnpm install -D unplugin-vue-components unplugin-auto-import
```

在 vite.config.ts 里使用这两个插件。代码如下：

```
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

使用如上两个插件后，当我们在 Vue 模版里使用某个组件的时候，直接如下使用:

<ElMessage />

会自动帮我们引入这个组件相关的代码，这个功能是在编译的时候由插件完成的。

```
import 'element-plus/es/components/message/style/css'
import { ElMessage } from 'element-plus'
```

##### 集成 Icon

Element Plus 提供了很多 Icon，我们也可以进行配置支持自动导入。

首先我们需要安装下插件，安装命令如下：

```
pnpm install unplugin-icons -D
```

然后按照官方推荐进行配置：

```
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),

        ElementPlusResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
});
```

配置好后就可以直接使用 Icon 了，我们在 Element Icon 页面点击一个图标会复制得到以下的组件：

```
<el-icon><IEpArrowLeft /></el-icon>
```

我们在 src/views/AboutView.vue 代码添加 icon 如下代码：

```
<template>
  <div>
    <div>This is About Page</div>
    <button @click="increment">counter from store {{ count }}</button>
    <el-icon><IEpArrowLeft /></el-icon>
  </div>
</template>

<script setup lang="ts">
  import { useCounterStore } from '@/store';
  import { storeToRefs } from 'pinia';
  const counterStore = useCounterStore();
  const { count } = storeToRefs(counterStore);
  const { increment } = counterStore;
</script>

<style scoped></style>
```

#### 十）全局样式

在 src 目录下创建 styles 目录，并且创建 index.scss 来放置全局样式。

##### 支持 Sass

vite 内部已经配置好了 对 Sass 文件的解析规则，我们直接安装它即可，安装命令如下:

```
pnpm install sass -D
```

我们在 src/styles/index.scss 中弄点全局样式进去测试即可。

然后我们在 main.ts 里引入 index.scss 全局样式即可；

```
import '@/styles/index.scss';
```

#### 十一）集成 Axios

```
｜--- apis
｜ |--- index.ts               // 统一导出 apis 里的接口
｜ |--- modules                // 将不同业务的接口拆分到不同模块
｜ | |--- index.ts             // 统一导出不同的业务接口
｜ | |--- user                 // user 业务
｜ | ｜ |--- index.ts          // user 业务接口
｜ | ｜ |--- types.ts          // user 业务接口类型定义
｜ | |--- shop                 // shop 业务
｜ | ｜ |--- index.ts          // shop 业务接口
｜ | ｜ |--- types.ts          // shop 业务接口类型定义
｜ |--- instance               // Axios 实例
｜ | |--- commonConfig.ts      // 实例的通用配置
｜ | |--- create.ts            // 创建实例逻辑
｜ | |--- index.ts             // 导出实例
｜ | |--- types.ts             // 实例相关的类型定义
```

#### 安装

首先我们需要安装 axios，安装命令如下:

```
pnpm install axios
```

#### Axios 封装

##### 创建实例

我们先创建一个实例，代码如下:

```
import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  // 指定请求超时的毫秒数
  timeout: 3000,
  /*
   * 表示支持跨域请求携带cookie，默认是false，表示不携带者Cookie
   * 同时需要后端配合，返回如下字段
   * Access-Control-Allow-Credentials: true
   * Access-Control-Allow-Origin: 当前页面的域名
  */
   withCredentials: false,
});
```

withCredentials: 该属性在跨域的时候用到，默认值是 false，当值为 false 的时候，跨域的请求不会携带 Cookie。比如淘宝的域名是 taobao.com, 但是我们请求的接口的域名是 api.taobao.com, 这两个域名不一致，会存在跨域的情况，这时，当我们请求 api.taobao.com 接口信息的时候不会携带 taobao.com 下的 Cookie 信息的，这样就无法获取登录状态等信息，所以我们需要让这个跨域请求跨域携带 Cookie 信息。这个时候我们需要把 withCredentials 请求头设置为 true。

当然也需要后端设置 Access-Control-Allow-Credentials: true 和 Access-Control-Allow-Origin: 当前页面的域名 才可以生效，携带的 Cokkie 操作前端和后端都确认才真正有效。

##### 设置拦截器

创建好实例后我们需要设置拦截器，比如我们的接口可能有一些公共操作，比如统一在请求头带上某个字段，或者统一对响应做一些相关的处理等。这个时候我们可以设置请求拦截器和响应拦截器。

##### 请求拦截器

在请求拦截器我们可以对 AxiosRequestConfig 做一些更改，比如更改请求头等。

```
// 前置拦截器 发起请求之前的拦截
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  /**
  * 比如在这里我们携带一些token信息发送给后台等配置
  * const token = getToken();
  * if (token) {
  *   config.headers.token = token;
  * }
  */
  return config;
}, (error) => {
  const errorMsg = error?.message || "Request Error";
  console.log('---errorMsg---', errorMsg);
  return Promise.reject(error);
});
```

##### 响应拦截器

响应拦截器可以对返回的数据和错误做统一处理，响应器返回的 response 结构是 AxiosResponse, AxiosResponse 的类型定义如下：

```
export interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}
```

每次要得到后台返回的数据都要用 response.data 来拿，为了可以直接拿到真正想要的数据，我们在响应拦截器做处理，返回 response.data. 我们还可以对一些业务逻辑的错误做统一处理，比如约定后台接口返回码不是 0 的时候认为是业务错误，然后统一进行错误提示。

如果不是业务错误，是网络错误的话，我们可以在拦截器的第二个回调函数统一处理。

```
// 后置拦截器 获取响应时的拦截
instance.interceptors.response.use((response: AxiosResponse) => {
  // 后台返回的数据假如如下:
  const { data } = response;
  return data;
  /*
   这里我们还可以根据业务做其他特殊的拦截，比如根据后台返回的data固有的格式，根据后台返回的code做统一处理
   比如根据错误码请求是否成功，来处理。
   const {code, message, data } = response.data;
   if (code === 0) {
     return data;
   } else {
     // 处理业务错误
     ElMessage({
       type: 'error',
       message,
     })
     return Promise.reject(new Error(message));
   }
  */
}, (error) => {
  const { response } = error;
  let message = '';
  // http 状态码
  const status = response?.status;
  switch(status) {
    case 401:
      message = 'token 失效，请重新登录';
      break;
    case 403:
      message = '拒绝访问';
      break;
    case 404:
      message = '请求地址错误';
      break;
    case 500:
      message = '服务器故障';
      break;
    default:
      message = '网络链接故障';
  }
  // 弹出错误提示
  ElMessage({
    message: message,
    type: 'error'
  });
  return Promise.reject(error);
});
```

因此 src/apis/instance/types.ts 代码如下：

```
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type OnFulfilled<V> = ((value: V) => V | Promise<V>) | null;
export type OnRejected = ((error: any) => any) | null;

export type RequestInterceptor = {
  onFulfilled: OnFulfilled<AxiosRequestConfig>;
  onRejected?: OnRejected;
};

export type ResponseInterceptor = {
  onFulfilled: OnFulfilled<AxiosResponse>;
  onRejected?: OnRejected;
};
```

src/apis/instance/commonConfig.ts 代码如下：

```
import { ElMessage } from 'element-plus';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestInterceptor, ResponseInterceptor } from './types';

// 通用请求配置
const commonRequestConfig: AxiosRequestConfig = {
  baseURL: '/',
  // 指定请求超时的毫秒数
  timeout: 3000,
  /*
   * 表示支持跨域请求携带cookie，默认是false，表示不携带者Cookie
   * 同时需要后端配合，返回如下字段
   * Access-Control-Allow-Credentials: true
   * Access-Control-Allow-Origin: 当前页面的域名
  */
   withCredentials: false,
};

// 通用的请求拦截器
const commonRequestInterceptors: RequestInterceptor[] = [
  {
    onFulfilled: (config: AxiosRequestConfig) => {
      /**
       * 在这里一般会携带前台的参数发送给后台
       * const token = getToken();
       * if (token) {
       *   config.headers.token = token;
       * }
       */
      return config;
    },
    onRejected: (error: any) => {
      const errorMsg = error?.message || "Request Error";
      ElMessage({
        message: errorMsg,
        type: 'error',
      });
      return Promise.reject(error);
    },
  },
];

// 通用响应拦截器
const commonResponseInterceptors: ResponseInterceptor[] = [
  {
    onFulfilled: (response: AxiosResponse) => {
      // 这里我们将后台返回的数据返回回来，方便后续获取
      const { data } = response;
      return data;
      /*
      这里我们还可以根据业务做其他特殊的拦截，比如根据后台返回的data固有的格式，根据后台返回的code做统一处理
      比如根据错误码请求是否成功，来处理。
      const {code, message, data } = response.data;
      if (code === 0) {
        return data;
      } else {
        // 处理业务错误
        ElMessage({
          type: 'error',
          message,
        })
        return Promise.reject(new Error(message));
      }
      */
    },
    onRejected: (error: any) => {
      const { response } = error;
      let message = '';
      // http 状态码
      const status = response?.status;
      switch (status) {
        case 401:
          message = 'token 已失效, 请重新登录';
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求地址错误';
          break;
        case 500:
          message = '服务器故障';
          break;
        default:
          message = '网络链接故障';
      }
      ElMessage({
        message,
        type: 'error'
      });
      return Promise.reject(error);
    }
  }
];

export {
  commonRequestConfig,
  commonRequestInterceptors,
  commonResponseInterceptors,
}
```

##### 封装请求函数

我们可以封装一些常用的请求方法，如下：

```
/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
 export function post(url: string, data = {}, params = {}) {
   return instance({
     method: 'post',
     url,
     data,
     params,
   })
 }

 /**
  * @param {string} url
  * @param {object} params
  */
export function get(url: string, params = {}) {
  return instance({
    method: 'get',
    url,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
*/
export function put(url: string, data = {}, params = {}) {
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
export function _delete(url: string, params = {}) {
  return instance({
    method: 'delete',
    url,
    params,
  })
}
```

src/apis/instance/create.ts 代码如下：

```
import axios, { AxiosRequestConfig } from 'axios';
import {
  commonRequestConfig,
  commonRequestInterceptors,
  commonResponseInterceptors,
} from './commonConfig';

import { RequestInterceptor, ResponseInterceptor } from './types';

// 创建请求实例，允许不同的实例设置不同的配置，这些配置会和默认配置合并
function createInstance(
  config: AxiosRequestConfig,
  requestInterceptors: RequestInterceptor[],
  responseInterceptors: ResponseInterceptor[]
) {
  const instance = axios.create({
    ...commonRequestConfig,
    ...config,
  });

  const allRequestInterceptors: RequestInterceptor[] = [
    ...commonRequestInterceptors,
    ...requestInterceptors,
  ];

  // 设置所有请求拦截器
  allRequestInterceptors.forEach((requestInterceptor) => {
    instance.interceptors.request.use(
      requestInterceptor.onFulfilled,
      requestInterceptor.onRejected
    );
  });

  const allResponseInterceptors: ResponseInterceptor[] = [
    ...commonResponseInterceptors,
    ...responseInterceptors,
  ];

  // 设置所有响应拦截器
  allResponseInterceptors.forEach((responseInterceptor) => {
    instance.interceptors.response.use(
      responseInterceptor.onFulfilled,
      responseInterceptor.onRejected
    );
  });

  // 导出常用函数

  /**
   * @param {string} url
   * @param {object} data
   * @param {object} params
   */
  function post<T>(url: string, data = {}, params = {}): Promise<T> {
    return instance({
      method: 'post',
      url,
      data,
      params,
    });
  }

  /**
   * @param {string} url
   * @param {object} params
   */
  function get<T>(url: string, params = {}): Promise<T> {
    return instance({
      method: 'get',
      url,
      params,
    });
  }

  /**
   * @param {string} url
   * @param {object} data
   * @param {object} params
   */
  function put<T>(url: string, data = {}, params = {}): Promise<T> {
    return instance({
      method: 'put',
      url,
      params,
      data,
    });
  }

  /**
   * @param {string} url
   * @param {object} params
   */
  function _delete<T>(url: string, params = {}): Promise<T> {
    return instance({
      method: 'delete',
      url,
      params,
    });
  }

  return {
    instance,
    post,
    get,
    put,
    _delete,
  };
}

export default createInstance;
```

src/apis/instance/index.ts 代码如下：

```
import createInstance from './create';

// 基础的Axios实例，请求配置以及拦截器都是使用的通用的配置
const baseInstance = createInstance({}, [], []);

// Shop业务可能前缀都是/shop，可以在这里统一处理，
// 如果需要对请求和返回做特殊处理，也可以在这里加拦截器
const shopInstance = createInstance(
  {
    baseURL: '/shop',
  },
  [],
  []
);

export { baseInstance, shopInstance };
```

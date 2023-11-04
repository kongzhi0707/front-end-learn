### ESLint + Prettier + husky + lint-staged 规范统一前端代码风格

#### 一）搭建项目

```
npm create vite@latest my-vue-app --template vue-ts
cd vue-code
npm install
npm run dev
```

在代码开发过程中，我们需要使用 Eslint 和 Prettier 来帮助我们检测代码质量和代码格式。涉及到如何在 VsCode 中进行相关配置。

#### 二）VsCode 配置 Eslint

##### 2.1） 安装 Eslint 插件

在 Vscode 中通过 Eslint 检测语法，在我们开发的时候在语法不正确的地方进行波浪线提示，因此我们首先需要安装 Eslint 插件，如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/1.png" /><br />

安装完插件后我们需要安装 eslint npm 包，插件需要通过这个 eslint npm 包来对我们的代码进行检测。

```
npm i eslint
```

安装完 npm 包后我们需要初始化我们的 .eslintrc 文件，在命令行执行以下命令:

```
npx eslint --init
```

然后根据提示和自己的项目依次进行安装，选择完成后会生成一个 .eslintrc.js 文件。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/2.png" /><br />

在我们的项目根目录下会生成 .eslintrc.js 文件，我选择的是 vue，所以会引入 vue 的 plugin：

```
module.exports = {
  env: {
    browser: true, // 支持浏览器环境的检测
    es2021: true, // 支持es2021语法的检测
    node: true, // 支持node环境的检测
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential', // 支持vue3相关语法的检测
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest', // 解析文件的时候使用最新的ecmaVersion
    sourceType: 'module', // 文件是ES6模块规范
  },
  plugins: [
    'vue',
  ],
  rules: {
  },
};
```

通过以上配置 eslint 插件我们就可以对我们的配置进行检测了。 现在我们在 src/main.ts 写一行代码 const abc = 1; 会有如下提示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/3.png" /><br />

告诉我们 abc 定义了但是没有使用。

#### 三）Vscode User Setting 和 Workspace Setting

在 VsCode 中除了 安装插件，我们还需要对如何使用插件进行一些配置。

如果是 Mac 电脑我们同时按下 Command + Shift + P 会出现如下窗口：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/4.png" /><br />

然后我们点击第一行的 Open User Setting，可以进入用户设置界面。进去后我们可以看到页面如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/5.png" /><br />

有两个 tab，分别是 用户 和 工作区，用户是对用户进行配置，可以理解为全局配置，在用户的配置项会对所有的 VsCode 打开的文件有效。工作区的配置只对当前工作目录有效。如果我们改了工作区的配置，那么 VsCode 会在当前打开的目录下新建 .vscode 目录用来保存做的修改。工作区的配置的优先级大于 用户里面配置的优先级。

##### eslint.enable

如果我们发现我们配置了 Eslint, 但是检测没有生效，我们可以在设置中搜索 eslint.enable， 看下这个开关是否有打开，这个开关如果没有打开的话，即使我们配置了 Eslint, 检查也不会生效。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/6.png" /><br />

然后我们切换到 工作区，然后把下面这个开关关掉。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/7.png" /><br />

##### editor.codeActionsOnSave

在 .eslintrc 的 rules 里我们可以配置自己的规则，比如我们想要在项目里面统一使用单引号的格式（默认是双引号），我们可以进行如下配置：

```
rules: {
  quotes: ["error", "single"]
},
```

配置完成后发现文件都变红了。因为文件默认都是用的是双引号，但是如果我们手动一个个改动又非常麻烦，那么有没有什么简单的方法呢？

我们可以通过在设置中 配置 editor.codeActionsOnSave 在我们进行保存的时候自动格式化代码。如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/8.png" /><br />

如上我们在设置中搜索 codeActionsOnSave， 然后再点击 Edit in settings.json， 这个时候发现打开了 .vscode 目录下的 settings.json 文件。我们在该文件里面添加如下代码：

```
"editor.codeActionsOnSave": {
  "source.fixAll": true,
  "source.fixAll.eslint": true
},
```

.vscode/settings.json 文件完整的代码如下：

```
{
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  }
}
```

如上代码的含义是：在我们保存的时候会自动执行 fix 操作，且使用的是 eslint 进行 fix 操作。该配置后在页面上发现有双引号都会被自动替换为单引号了。

做完以上的配置我们的项目中的代码已经可以使用 VsCode 进行代码检测了，点击保存的时候也会自动帮我们格式化一部分代码了。

#### 四）Prettier

上面我们通过 Eslint 已经可以检测代码了，也可以做自动格式化了。但是我们为什么还需要 Prettier 呢？因为他们所做的事情不一样。Eslint 主要用于检测代码的语法错误，而 Prettier 主要是检测代码的格式。也就是检测我们的代码美不美观。比如下面的代码:

```
const a      = "1";
```

代码是没有任何问题，但是中间有很多空格，看起来很不美观，当我们点击保存的时候，Eslint 是不会帮我们调整格式的。这个工作就需要交给 Prettier 来做。

##### 安装 Prettier 插件

我们在 VsCode 中搜索 Prettier 插件进行安装就可以了， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/9.png" /><br />

##### editor.formatOnSave 保存自动格式化

我们想要在保存的时候自动使用 Prettier 对我们的代码进行格式化，这是花我们需要配置 editor.formatOnSave

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/10.png" /><br />

如上我们把这个 formatOnSave 的勾选上，这个时候我们的 settings.json 新增了一行代码：

```
"editor.formatOnSave": true
```

我们可以看下 .vscode/settings.json 所有代码变成如下：

```
{
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true
}
```

这个时候我们 Save 时候会自动使用 Prettier 进行格式化，因为我们安装了 Prettier 后，VsCode 会自动将 Prettier 设置为我们的默认格式化插件。

我们在 src/App.vye 写如下代码：

```
const abc     = '1';
```

保存后会自动帮我们去掉空格。

#### 五）解决 Prettier 和 Eslint 的冲突问题

当我们同时配置了 Eslint 和 Prettier，然后给 Eslint 加了使用单引号的规则，但是 Prettier 里面的规则是使用双引号，如果两个同时存在的话，最终格式化出来的结果以 Prettier 里的规则为准，也就是说 Eslint 和 Prettier 都会对文件进行格式化，可是 Prettier 格式化的会覆盖掉 Eslint 的格式化的。这个时候 Eslint 的检测就会报错。因此我们需要做一些配置，对 Eslint 和 Prettier 的规则做一下合并，大家都以最终的合并的规则为准，这样就不会有冲突。

##### .prettierrc.js

我们可以在 .prettierrc.js 文件里配置我们项目的规则，这里的规则会覆盖 Prettier 的默认规则。我们可以让在这里修改有冲突的规则，让 Eslint 的规则 和 Prettier 的规则一致。比如上面的 单引号 和 双引号的问题。我们可以新建 .prettierrc.js 文件，然后在里面配置如下规则：

```
// .prettierrc.js
module.exports = {
  singleQuote: true,
};
```

那么这时候 Eslint 和 Prettier 的规则都是使用单引号，就不会有冲突了。

##### eslint-plugin-prettier 和 eslint-config-prettier

如果有时候会有很多规则冲突，或者说我们也不知道有那个规则冲突了，我们一个个手动去改有冲突的规则比较麻烦，所以有两个插件可以帮助我们做这个事情，他们是 eslint-plugin-prettier 和 eslint-config-prettier。

eslint-config-prettier 的作用是：把 Eslint 里 和 Prettier 有冲突的规则关掉。
eslint-plugin-prettier 的作用是：将 Prettier 里的规则设置到 Eslint 里面去，通过这两个插件的配合，就完成了 Eslint 和 Prettier 规则的合并，其中冲突的规则以 Prettier 里的规则为准。

因此我们需要安装这两个插件：

```
npm i eslint-plugin-prettier eslint-config-prettier -D
```

然后我们在 Eslint 的 extends 里添加如下配置 "plugin:prettier/recommended", 这一行一定要加到最后，因为后面的会覆盖前面的。

.eslintrc.cjs 所有的配置项如下：

```
module.exports = {
  env: {
    browser: true, // 支持浏览器环境的检测
    es2021: true, // 支持es2021语法的检测
    node: true, // 支持node环境的检测
  },
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential', // 支持vue3相关语法的检测
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest', // 解析文件的时候使用最新的ecmaVersion
    sourceType: 'module', // 文件是ES6模块规范
  },
  plugins: [
    'vue',
  ],
  rules: {
    quotes: ['error', 'single'],
  },
};
```

保存后应该可以看到冲突的规则以 Prettier 为准了，Eslint 相关的检测不会报错了，如果还没生效可以重启下 VsCode 试试。

##### .eslintignore 和 .prettierignore

有些文件我们可能不想做代码检测，比如 node_modules，dist 目录里的，这时候我们可以配置在这两个文件里面。

我们在项目的根目录下面新建 该两个文件 .eslintignore 和 .prettierignore，然后在这两个文件里面把 dist 和 node_modules 放在里面。

```
dist
node_modules
```

#### 六）代码提交检查

如上我们在 VsCode 里面配置了 Eslint 和 Prettier 来检查和规范我们的代码，但是这个只是对编辑器的错误提示，但是如果有的人可能没有安装插件或对错误提示视而不见的话。因此我们需要在代码提交的时候对代码进行检查，来保证所有人提交的代码格式都是符合要求的。

##### husky

当我们提交 git 的时候，会触发一些钩子，我们可以在这些钩子里面做一些检查，如果检查不通过那么不执行对应的提交操作，husky 就是用来方便我们写钩子函数的。

1. 首先我们先安装 husky. 安装命令如下：

```
npm install husky -D
```

2. 添加配置

```
npx husky install
```

在执行命令之前，我们先要对我们的项目 git init 下， 然后再 执行 npx husky install 将会生成 ./husky 的文件夹，在这里我们可以配置 Git Hooks 的脚本文件。

3. 初始化

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

prepare 钩子会在我们执行完 npm install 后执行, 因为我们不是第一次下载这个项目，所以手动执行 npm run prepare。
执行完之后会在根目录生成一个 .husky 文件夹。

然后我们执行以下命令：

```
npx husky add .husky/pre-commit "npm run lint"
git add .husky/pre-commit
```

执行这个命令后会生成 .husky/pre-commit 文件，该文件的内容如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
```

表示在执行 git commit 命令的时候，会先执行 npm run lint，这个命令通过了才会执行 commit 操作，否则终止 commit 操作。

然后我们才会执行了 git add .husky/pre-commit 表示这个文件要提交到远程仓库的。

我们现在需要在 package.json 里将 lint 命令添加上去。如下：

```
"scripts": {
  "dev": "vite",
  "build": "vue-tsc && vite build",
  "preview": "vite preview",
  "prepare": "husky install",
  "lint": "eslint --fix ./src --ext .vue,.js,.ts"
},
```

通过以上配置我们在 git commit 提交的时候如果代码格式不正确首先 eslint 会自动给你 fix 一下，比如单引号，双引号这个可以 fix 就自动 fix 了。
如果某些错误无法 fix 的，那么会报错然后退出，修改后才能继续 commit.

##### lint-staged

lint-staged 一般结合 husky 来使用，它可以让 husky 的 hook 触发的命令 只作用于 git 暂存区的文件，而不会影响其他的文件。
首先我们要安装 npm 包。

```
npm install lint-staged -D
```

然后我们在 package.json 里增加如下配置：

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

如上代码的含义是：当我们遇到 \*.{js,jsx,ts,tsx} 类型的文件的时候，使用 eslint --fix 进行检测和修复，因为这是一个数组，如果我们需要多个检测规则，还可以继续添加，比如可以设置成这样：

```
"*.{js,jsx,ts,tsx}": [
  "eslint --fix",
  "prettier --write"
],
```

因为我们的 Prettier 规则已经集成到 Eslint 里里，所以这里写一个 eslint --fix 就可以了。

因此我们在命令行执行

```
npx lint-staged
```

就可以对暂存区的文件进行检测，也就是执行了 git add 后的文件进行检查。

我们现在修改下 pre-commit，将 npm run lint 修改为 npx lint-staged 就可以了，每次在执行 git commit 的时候，都会先调用 npx lint-staged 进行检查。

.husky/pre-commit 文件改成如下：

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

到现在我们的代码检测工作就完成了。

#### 七）代码提交规范

代码质量得到保障之后，接下来我们就是要对提交的规范做一些保障，主要会用到 3 个工具来保证提交的代码符合规范。

```
1）commitizen
2) commitlint
3) husky
```

```
1) commitizen: 它是一个命令行交互工具，用来帮助我们书写正确的 Message 格式的。
2）commitlint: 是用来对 message 做校验。
3）husky 是用来让我们设置在 commit-msg 这个git钩子里触发 commitlint 的校验。
```

##### commitizen 本地安装

首先我们安装 commitizen; 安装命令如下：

```
npm install commitizen -D
```

然后我们需要继续安装 cz-conventional-changelog, cz-conventional-changelog 是一个 commitizen 的适配器，适配器的作用是按照某个指定的规范帮助我们生成 commit message.

```
npx commitizen init cz-conventional-changelog -D --save-exact
```

执行完上述命令后，会在我们的 package.json 里新增如下代码：

```
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
}
```

commitizen.path 是我们执行 commitizen 指令的时候，要使用的适配器的路径。commitizen 指令的名称是 cz, 所以当我们使用命令执行 npx cz,
就相当于执行 git commit, npx cz 会以命令行的方式让我们填写 commit 的信息，如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/11.png" /><br />

##### commitizen 全局安装

commitizen 也可以全局安装，全局安装的命令如下:

```
npm install -g commitizen
```

然后在项目的目录下执行:

```
commitizen init cz-conventional-changelog --save-dev --save-exact
```

这会在项目目录下安装 cz-conventional-changelog 然后在 package.json 里增加如下配置：

```
"config": {
  "commitizen": {
    "path": "./node_modules/cz-conventional-changelog"
  }
}
```

这个增加的配置和在本地安装是一样的。

然后我们可以使用 git cz 代替 git commit 指令。

##### commitlint 和 husky

commitlint 是用来校验我们提交的 message 格式的，需要搭配 husky 进行使用，首先我们需要安装该包，安装命令如下：

```
npm install --save-dev @commitlint/{config-conventional,cli}
```

然后配置 config;

```
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

然后我们需要配置在 git 的 commit-msg 钩子执行相关的校验，先安装 husky.

```
npm install husky -D
npx husky install
```

然后添加 hook

```
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

通过以上配置，我们提交的 git commit message 就不会太乱了。如下，当我们 git commit -m '随便输入信息的时候' 会报错如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images2/12.png" /><br />

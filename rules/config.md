### react+ts 代码规范配置和 git 提交规则

描述：在前端项目工程中一套完善的开发环境配置可以提升开发效率，提高代码质量，方便多人合作，以及后期的项目迭代和维护。项目规范分：目录结构规范，
代码格式规范 和 git 提交规范。

#### 一）代码规范如下

#### 1.1）代码格式规范和语法检测

```
1）vscode：统一的前端编辑器。
2）editorconfig: 统一团队 vscode 编辑器默认配置。
3）prettier: 保存文件自动格式化代码。
4）eslint：检测代码语法规范和错误。
5）lint-staged: 只检测暂存区文件代码，优化 eslint 检测速度。
```

#### 1.2）代码 git 提交规范

```
1）husky：可以监听 githooks 执行，在对应 hooks 执行阶段做一些处理的操作。
2）pre-commit: 在 commit 提交之前使用 tsc 和 eslint 对语法进行检测。
3）commit-msg: 在 commit 提交之前对 commit 备注信息进行检测。
4）commitlint: 在 githooks 的 pre-commit 阶段对 commit 备注信息进行检测。
5）commitizen: git 的规范化提交工具，辅助填写 commit 信息。
```

#### 二）创建 react18+vite2+ts 项目

创建项目使用 vite 官网命令，执行命令如下：

// pnpm 如未安装 pnpm，要先 npm i pnpm -g 安装
pnpm create vite my-react-app --template react-ts

执行完成后会在目录下创建 my-react-app 项目，提示依次执行命令。

```
cd my-react-app
pnpm i
pnpm run dev
```

执行如上命令后，就会启动项目在浏览器中打开。

#### 三）editorconfig 统一编辑器配置

由于每个人的 vscode 编辑器默认配置可能不一样，比如有的默认缩进是 4 个空格，有的是 2 个空格，因此我们项目中要统一风格规范。

#### 3.1）安装 vscode 插件 EditorConfig

我们打开 vscode 插件，搜索 EditorConfig for VS Code， 然后进行安装。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/1.png" /> <br />

#### 3.2）添加 .editorconfig 配置文件

安装插件后，在根目录新增 .editorconfig 配置文件：

```
root = true # 控制配置文件 .editorconfig 是否生效的字段
​
[**] # 匹配全部文件
indent_style = space # 缩进风格，可选 space ｜ tab
indent_size = 2 # 缩进的空格数
charset = utf-8 # 设置字符集
trim_trailing_whitespace = true # 删除一行中的前后空格
insert_final_newline = true # 设为 true 表示使文件以一个空白行结尾
end_of_line = lf
​
[**.md] # 匹配 md 文件
trim_trailing_whitespace = false
```

上面的配置文件可以规范本项目中文件的缩进风格，和缩进空格数等。会覆盖 vscode 的配置，来达到不同的编辑器中代码默认行为一致的作用。

#### 四）prettier 自动格式化代码

每个人写代码的风格习惯不一样，比如代码换行，结尾是否带分号，单双引号，缩进等，而且不能只靠口头规范来约束，项目紧急的时候可能不太注意代码格式，
这时候需要有工具来帮我们自动格式化代码. prettier 就是帮助我们做这件事的。

#### 4.1）安装 vscode 插件 Prettier

打开 vscode 插件商店，搜索 Prettier - Code formatter， 然后进行安装。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/2.png" /> <br />

#### 4.2) 添加 .prettierrc.js 配置文件

安装插件后，在根目录新增 .prettierrc.js 配置文件，配置内容如下：

```
module.exports = {
  printWidth: 100, // 一行的字符数，如果超过会进行换行
  tabWidth: 2, // 一个 tab 代表几个空格数，默认就是 2
  useTabs: false, // 是否启用 tab 取代空格符缩进，.editorconfig 设置空格缩进，所以设置为 false
  semi: false, // 行尾是否使用分号，默认为 true
  singleQuote: true, // 字符串是否使用单引号
  trailingComma: 'none', // 对象或数组末尾是否添加逗号 none| es5| all
  jsxSingleQuote: true, // 在 jsx 里是否使用单引号
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为 true，效果：{ foo: bar }
  arrowParens: "avoid", // 箭头函数如果只有一个参数则省略括号
}
```

#### 4.3）添加 .vscode/settings.json

上面虽然配置了 prettier 格式化规则，但是还需要让 vscode 来支持保存后触发格式化。

在项目根目录下新建 .vscode 文件夹，内部新建 settings.json 文件配置文件，内容如下：

```
{
  "search.exclude": {
    "/node_modules": true,
    "dist": true,
    "pnpm-lock.sh": true
  },
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
   },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "liveServer.settings.port": 5502
}
```

如上代码先配置了哪些文件不进行格式化，又添加了保存代码后触发格式化代码配置，以及各类型文件格式化使用的格式。

#### 五）eslint + lint-staged 检测代码

#### 5.1）安装 vscode 插件 ESLint

打开 vscode 插件商店，搜索 ESLint，然后进行安装。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/3.png" /> <br />

#### 5.2）安装 eslint 依赖

```
pnpm i eslint -D
```

#### 5.3) 配置 .eslintrc.js 文件

安装 eslint 后，执行 pnpm create @eslint/config, 选择自己需要的配置如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/4.png" /> <br />

如上我们选择了：

```
1）使用 eslint 检测问题。
2）项目使用的模块规范是 import/export 3) 使用的框架是 react。
4）使用了 typescript 5) 代码选择运行在浏览器端。
6）eslint 配置文件使用 js 格式
7）是否选择安装相关依赖，选择是
8）使用 pnpm 包管理器安装依赖。
```

选择完成后会在项目的根目录下生成 .eslintrc.cjs 文件，默认的配置如下：

```
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
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
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react"
    ],
    "rules": {
    }
}
```

#### 5.4) 解决当前项目 eslint 语法错误

此时 eslint 基础配置就已经配置好了，此时要解决出现的几个问题：

1）打开 App.tsx 页面会发现 jsx 部分有红色报红，提示：'React must be in scope when using JSX'. 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/5.png" /> <br />

这是因为 React18 版本中使用 jsx 语法不需要再引入 React 了，根据 <a href="https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md">eslint-react-plugin</a> 中的说明, 如果使用了 react17 版本以上，不需要在使用 jsx 页面引入 React 时，我们可以在 eslint 配置文件 .eslintrc.cjs 配置文件中的 extends 字段添加插件 plugin:react/jsx-runtime。即可解决问题。

```
"extends": [
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:react/recommended",
  "plugin:react/jsx-runtime",
],
```

且 在项目的根目录下 tsconfig.json 文件改成如下：

```
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

此时我们的 App.tsx 和 main.tsx 就不会报错了。如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/6.png" /> <br />

#### 注意：

1）如果在 tsx 文件中带有警告颜色，看到警告提示时 Forbidden non-null assertion 的提示的话，这个提示是不允许使用非空操作符!, 但实际在项目中经常会使用到，所以可以把该项校验给关闭掉。

在 eslintrc.cjs 配置文件中的 rules 字段添加插件 '@typescript-eslint/no-non-null-assertion': 'off'

```
"rules": {
  '@typescript-eslint/no-non-null-assertion': 'off'
}
```

然后就不会报警告了。

2）如果在 .eslintrc.cjs 的配置文件中有红色报错，报错事 'module' is not defined

这是因为我们上面选择的是浏览器环境，配置文件的 module.exports 需要 node 环境，需要在 eslintrc 的 env 环境配置中添加支持 node 环境。代码如下：

```
"env": {
  "browser": true,
  "es2021": true,
  "node": true,
},
```

#### 5.5) 添加 eslint 语法检测脚本

前面的 eslint 报错和警告都是我们使用眼睛看的到的，有时候我们需要通过脚本执行能检测出来，因此我们需要在 package.json 的 scripts 中新增命令如下：

```
"scripts": {
  "eslint": "eslint src/**/*.{ts,tsx}"
},
```

上面的含义是：检测 src 目录下以 **.ts 或 **.tsx 为后缀的文件，然后在 main.tsx 里面定义一个未使用的变量 a。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/7.png" /> <br />

我们现在可以执行 npm run eslint 命令，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/8.png" /> <br />

运行命令后可以看到控制台会检测到有变量 a 没有使用到，会报错。

除此之外，我们还需要解决的是 eslint 报的警告：Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration 。 需要告诉 eslint 使用的 react 的版本。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/9.png" /> <br />

我们需要在 .eslintrc.cjs 中的 rules 平级添加 settings 配置，让 eslint 自己检测 react 的版本。

<a href="https://github.com/jsx-eslint/eslint-plugin-react/issues/2157">issuse 查看</a>

```
"settings": {
  "react": {
    "version": 'detect'
  }
}
```

我们现在再执行 npm run eslint 就不会报这个未设置 react 版本的警告了。

#### 5.6）使用 lint-staged 优化 eslint 检测速度

在上面配置的 eslint 会检测 src 文件下所有的 .ts, .tsx 文件，虽然功能可以实现，但是当项目文件多的时候，检测的文件会很多，需要的时候也会越来越长。但是我们可以
检测提交到 暂存区 中的文件即可，就是 git add 添加的文件，不在暂存区的文件不用再检测，因此我们使用 lint-staged 就是来帮我们做这件事的。

安装依赖

注意：lint-staged 最新的版本需要 node 大于 14.13.1 版本，我们这里还是使用 12 版本的，配置是一样的。

```
pnpm i lint-staged@12.5.0 -D
```

修改 package.json 脚本 eslint 的配置：

"eslint": "eslint"

在 package.json 中添加 lint-staged 配置。

```
"lint-staged": {
  "src/**/*.{ts,tsx}": [
    "npm run eslint"
  ]
},
```

因为要检测到 git 暂存区代码，所以需要执行 git init 初始化一下 git。

```
git init
```

初始化 git 完成后就可以进行测试了，先提交一下没有问题的文件 App.tsx

```
git add src/App.tsx
```

把 src/App.tsx 提交到暂存区后，我们再执行 npx lint-staged 命令如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/10.png" /> <br />

可以看到检测通过了，没有检测到语法问题，再把有语法问题的 src/main.tsx 文件提交到暂存区再检测一下看看如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/11.png" /> <br />

我们可以看到报错了，有错误提示了。

#### 六）使用 tsc 检测类型和报错

在项目中使用了 ts，但一些类型的问题。配置的 eslint 是检测不出来，需要使用 ts 提供的 tsc 工具进行检测。

我们在 main.tsx 定义了函数 say，参数 name 是 string 类型，当调用传 number 类型参数时，页面有了 ts 报错。如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/12.png" /> <br />

但是此时我们提交 main.tsx 文件到暂存区后执行 npx lint-staged. 发现没有检测到报错，如下，

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/13.png" /> <br />

所以我们需要配置 tsc 来检测类型。在 package.json 添加脚本命令：

"pre-check": "tsc && npx lint-staged"

这时候，我们执行 npm run pre-check, 发现已经可以检测出类型报错了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/14.png" /> <br />

#### 七）git 提交时检测语法规范

为了避免把不规范的代码提交到远程仓库，一般会在 git 提交代码时对代码语法进行检测，只有检测通过时才能被提交，git 提供了 pre-commit 钩子，它会在 git commit 把代码提交到本地仓库之前执行。可以在这个阶段检测代码。如果检测不通过就退出命令行进程停止 commit.

#### 7.1) 代码提交前 husky 检测语法

安装 husky

```
npm i husky -D
```

#### 7.2) 配置 husky 的 pre-commit 钩子

生成 .husky 配置文件夹 (如果项目中没有初始化过 git，需要先执行 git init)

```
npx husky install
```

会在项目的根目录下生成 .husky 文件夹，生成文件成功后，需要让 husky 支持监听 pre-commit 钩子。监听到后 执行我们上面定义的 npm run pre-check 语法检测。

```
npx husky add .husky/pre-commit 'npm run pre-check'
```

执行上面的命令后，会在 .husky 目录下生成 pre-commit 文件，文件里面可以看到我们设置的 npm run pre-check 命令。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/15.png" /> <br />

然后我们就可以提交代码 进行测试。

```
git add .
git commit -m "feat: 测试提交验证"
```

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/16.png" /> <br />

如上会发现 pre-commit 钩子执行了 npm run pre-check 命令，使用 eslint 检测到 git 暂存区的文件，并且发现了 main.tsx 的错误，退出了命令行。没有执行
git commit 把暂存区代码提交到本地仓库。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/17.png" /> <br />

如上文件还在暂存区，说明 git commit 未成功。

#### 7.3）安装依赖后自动 husky install

husky 需要我们手动执行 husky install ，我们可以借助 package.json 里面的 postinstall 钩子实现这个功能，该钩子会在依赖安装完成后执行。我们在 package.json 里面添加

```
"scripts": {
  "postinstall": "husky install"
}
```

如上，以后我们每一次安装依赖时就会自动执行 husky install 了，但是我们的 .husky 文件不能被 git 忽略，需要提交到远程仓库上，不然得重新配置 pre-commit 钩子了。

#### 八）代码提交时检测 commit 备注规范

在提交代码时，良好的提交备注会方便很多人开发时其他人理解本次提交修改的内容，同时也方便后面维护迭代。但是每个人的备注内容不一样，因此在团队中为了规范下，我们需要使用工具来限制下，在 githooks 中的 commit-msg 会在 git commit 之前执行，并获取到 git commit 的备注，我们可以通过该钩子来验证备注是否合理，而验证是否合理我们可以定义一套规范。commitlint 就是来做这件事的。它会预先定义一套规范，然后 验证 git commit 的备注是否符合定义的规范。

#### 8.1）安装和配置 commitlint

npm install --save-dev @commitlint/{cli,config-conventional}

然后我们在项目的根目录下创建 commitlint.config.cjs 文件，添加配置如下：

```
module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  // 定义的规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不是增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
      ]
    ],
    // subject 大小写不做校验
    'subject-case': [0]
  }
}
```

#### 8.2) 配置 husky 监听 commit-msg

我们现在需要让 上面安装的 husky 支持监听 commit-msg 的钩子，在钩子函数中使用 commitlint 来验证。

```
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

执行如上命令后，会在 .husky 目录下生成 commit-msg 文件，并且配置 commitlint 命令对备注进行验证配置，配置完成后就可以进行测试。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/18.png" /> <br />

下面我们把 main.tsx 报错的语法代码去掉 并添加到暂存区去；如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/19.png" /> <br />

提交后可以看到 commit-msg 验证没有通过。输入的备注信息为 修改了 xxx 功能， 下面我们可以通过如下正确格式的备注再次提交(类型与描述之间需要用冒号加空格隔开)：

```
git commit -m 'feat: 修改 xxx 功能'
```

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/20.png" /> <br />

#### 九）添加 git commit 辅助备注信息

如上，我们定义了很多提交类型，但都是英文前缀，不容易记忆，我们可以添加辅助信息在我们提交代码的时候做选择，会比较方便，我们可以借助 commitizen 来实现该功能。

#### 1) 安装 commitizen

我们需要全局安装 commitizen, 否则无法执行插件的 git cz 命令。

```
npm i commitizen -g
```

然后在我们项目内安装 cz-customizable, 命令如下：

```
npm i cz-customizable -D
```

#### 2) 配置 commitizen 自定义提示规则

添加以下配置到 package.json 中：

```
"config": {
  "commitizen": {
    "path": "./node_modules/cz-customizable"
  }
}
```

然后在项目的根目录创建 .cz-config.js 自定义提示文件：

```
module.exports = {
  // 可选类型，和上面 commitlint.config.js 配置的规则一一对应
  types: [
    { value: 'feat', name: 'feat: 新功能' },
    { value: 'fix', name: 'fix: 修复' },
    { value: 'docs', name: 'docs: 文档变更' },
    { value: 'style', name: 'style: 代码格式(不影响代码运行的变动)' },
    { value: 'refactor', name: 'refactor: 重构(既不是增加feature, 也不是修复bug)' },
    { value: 'perf', name: 'perf: 性能优化' },
    { value: 'test', name: 'test: 增加测试' },
    { value: 'chore', name: 'chore: 构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert: 回退' },
    { value: 'build', name: 'build: 打包' }
  ],
  // 消息步骤，正常只需要选择
  messages: {
    type: '请选择提交类型:',
    // customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):',
    // body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交? (y/n)'
  },
  // 跳过问题：修改范围，自定义修改范围，详细描述，issue相关
  skipQuestions: ['scope', 'customScope', 'body', 'footer'],
  // subject描述文字长度最长是72
  subjectLimit: 72,
};
```

#### 3) 测试 commitizen 辅助提交

使用 git add 添加文件到暂存区，然后使用 git cz 替代 git commit 命令提交代码：
会报错如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/21.png" /> <br />

原因是配置文件 .cz-config.js 用的是 module.exports = {}; CommonJS 模式，而 package.json 声明的为 type: "module", 即原生的 ES6 模式。
解决方案：是将 .cz-config.js 改成 .cz-config.cjs，然后在 package.json 中修改模块应用的文件名：

```
"config": {
  "commitizen": {
    "path": "./node_modules/cz-customizable"
  },
  "cz-customizable": {
    "config": "./.cz-config.cjs"
  }
},
```

再次运行 git cz 命令如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/22.png" /> <br />

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/rules/images/23.png" /> <br />

会出现选择提交类型和填写提交描述信息，选择 yes 后，会触发 git 提交语法验证，最终提交成功了。

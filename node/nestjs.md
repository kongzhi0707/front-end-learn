### Nestjs搭建项目

一：安装环境

首先我们需要安装node和npm，这个先不说了，大家都懂，现在我们需要安装 @nest/cli，命令如下所示：

npm i -g @nestjs/cli

然后使用nest创建我们的项目，如下命令：

nest new project-name 

比如我们上面的 project-name 叫 nest-first的化，那么就会在我们项目对应的位置如下项目目录结构，如下所示：

｜--- nest-first
｜ |--- src
｜ | |--- app.controller.spec.ts
｜ ｜｜--- app.controller.ts
｜ ｜｜--- app.module.ts
｜ ｜｜--- app.service.ts
｜ ｜｜--- main.ts
｜ |--- test
｜ |--- .eslintrc.js
｜ |--- .gitignore
｜ |--- .prettierrc
｜ |--- nest-cli.json
｜ |--- package.json
｜ |--- tsconfig.json



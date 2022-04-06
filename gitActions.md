
### Github Actions 实现前端应用部署

#### Github Action简介

Github Action 是 Github推出的持续集成工具。每次提交代码到Github的仓库后，Github都会自动创建一个虚拟机(比如 Mac/Windows/Linux), 来执行一段或多段指令。
它和jenkins是同一类产品，但是Actions最大的优势是：它是与Github高度整合在一起 ，我们只需要一个配置文件即可自动开启服务，甚至我们都不需要购买服务器，Github Actions
自带云环境运行。

#### 基本概念

Github Actions 有一些自己的术语。
```
1）workflow（工作流程）：持续集成一次运行的过程，就是一个workflow。
2）job（任务）：一个workflow由一个或多个jobs构成。
3）step（步骤）：每个job由多个step构成，一步步完成。
4）action（动作）：每个step可以依次执行一个或多个命令(action).
```
#### workflow 文件

Github Actions 的配置文件叫做 workflow文件，存放在代码仓库的 .github/workflows 目录下。

workflow 文件采用 YAML格式，文件名可以任意取，但是后缀名统一为 .yml, 一个库可以有多个 workflow 文件，Github只要发现 .github/workflows 目录里面有 .yml文件，就会自动运行该文件。

workflow 文件常用的配置字段有如下：

#### 1）name

name 字段是 workflow 的名称，如果省略该字段，默认为当前 workflow 的文件名。

// 我们可以叫如下名字，随便自定义名称
```
name: Github Actions Demo
```

#### 2) on 

on字段指定触发 workflow 的条件，一般指某些事件。

on: push

上面代码指定，push 事件就会触发 workflow。

on字段也可以是事件的数组：比如：on: [push, pull_request]

如上代码指定：当 push 事件 或 pull_request 事件都可以触发 workflow。
```
on:
  push:
    branches:
      - master
```
如上代码，当master分支上发生了push事件时，就会触发 workflow。

#### 3）jobs.<job_id>.name

workflow 文件的主体是 jobs字段，表示要执行的一项或多项任务。jobs字段里面，需要写出每一项任务的 job_id(名称自定义)，job_id里面的name字段是任务的说明。
```
jobs:
  my_first_job:
    name: my first job
  my_second_job:
    name: my second job
```
上面代码的 jobs字段包含两个任务，job_id 分别为 my_first_job 和 my_second_job。

#### 4）jobs.<job_id>.needs

needs 字段指定当前任务的依赖关系，即运行顺序。
```
jobs:
  my_first_job:
  my_second_job:
    needs: my_first_job
  my_third_job:
    needs: [my_first_job, my_second_job]
```
如上代码，my_first_job 必须先执行，然后 my_second_job 才执行。my_third_job 必须等待 my_first_job 和 my_second_job 的完成才能运行。 因此，该workflow
的运行顺序依次为：my_first_job，my_second_job，my_third_job。

#### 5）jobs.<job_id>.runs-on

runs-on 字段指定运行所需要的虚拟机环境。它是必填字段。目前可用的虚拟机如下：
```
ubuntu-latest，ubuntu-18.04或ubuntu-16.04
windows-latest，windows-2019或windows-2016
macOS-latest 或 macOS-10.14
```
如下面代码指定虚拟机环境为 ubuntu-latest。
```
runs-on: ubuntu-latest
```
#### 6) jobs.<job_id>.steps

steps字段指定每个Job的运行步骤，可以包含一个或多个步骤，每个步骤都可以指定以下三个字段。

jobs.<job_id>.steps.name: 步骤名称。
jobs.<job_id>.steps.run: 该步骤运行的命令或者action。
jobs.<job_id>.steps.env: 该步骤所需的环境变量。

一个完整的 workflow 文件如下：

.github/workflow/main.yml
```
name: first github action workflow
on:
  push:
    branches:
      - master

jobs:
  first-job:
     name: my first job demo
     runs-on: ubuntu-latest
     steps:

     - name: first-action
       run:  |
         echo hello world
```
#### Github Actions 实现前端应用部署

下面为了演示 Github Actions的用途，我们先使用 create-react-app 快速创建一个react项目，如下命令安装：
```
$ sudo npm i create-react-app -g
$ create-react-app react-github-actions-workflow-demo
$ cd react-github-actions-workflow-demo
$ npm run start 
```
如上执行完命令后，我们就可以在本地启动我们的项目，并且可以看到效果。现在我们把它提交到github上，然后使用 github actions 来部署应用。

#### 1. 获取 Personal Access Token 并设置到仓库中

1.1 获取 Personal Access Token

在GitHub点击自己的头像，找到 Settings ---> 然后找到Developer settings ---> 然后选择Personal access tokens ---> 点击Generate new token
就会拿到一个 token，我们把这个token保存下(因为只会显示一次)。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/0.png" />

1.2 给仓库添加 Secret

进入我们想添加的 github action 的仓库，按照如下步骤操作：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/1.png" />

进入新建 secret 页面后，填写 Name 和 Value 字段，Name 为 ACCESS_TOKEN，Value 为刚刚保存的 Personal Access Token 值。
如上在 secret 设置变量 Name 为 ACCESS_TOKEN，然后在 .yml配置文件中通过 ${{ ACCESS_TOKEN }} 的方式来获取到。

#### 2. 创建 Github Action

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/2.png" />

我们切换到 actions 面板可以看到很多 workflows 模版，我们选择如下模版：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/3.png" />

我们点击安装按钮之后会跳转到编辑界面，我们可以直接点击右上方的提交按钮：如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/4.png" />

如上点击后，就会自动帮我们创建一个 npm-publish.yml, 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/5.png" />

#### 3. 配置项目路径

我们打开项目的 package.json, 配置下项目的地址，目的是为了确定项目的根目录，项目在加载 js, css 等资源文件时能引用到正确的路径。如果不设置该配置的话，
那么访问页面的时候，js和css路径加载时候就会变为404，

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/6.png" />

homepage 的值格式为：https://[github用户名].github.io/[你的项目名]。 对着改下即可。

#### 4. 配置 npm-publish.yml 

在上面第二步完成后，我们需要把项目克隆下来后，在我们的项目根目录下有 .github/workflows/npm-publish.yml 文件。然后把我们的配置文件改成如下即可：
```
name: 打包项目
on:
  push:   # 指定触发事件
    branches:
      - main    # 指定触发 action 的分支

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      # 1. 拉取github仓库代码 这里需要将仓库代码检出到虚拟机实例中
      - name: Chcekout
        uses: actions/checkout@v2.3.1
        with:
        # 如果您正在使用actions/checkout@v2，那么在大多数情况下，您必须将持久凭证设置为false，才能使部署正确工作
          persist-credentials: false
    
      # 2. 执行依赖安装
      - name: 安装依赖
        run: |
          npm install
    
      # 3. 执行构建步骤
      - name: 构建
        run: |
          npm run build
    
      # 4. 执行部署, 将打包后到代码部署到 gh-pages 分支上
      - name: 部署
        # 详情看：https://www.npmjs.com/package/@jamesives/github-pages-deploy-action
        uses: JamesIves/github-pages-deploy-action@releases/v3 # 这个action会根据配置自动推送代码到指定分支
        with:
          # 为了让 GitHub触发重新构建页面，您必须使用存储库提供的GitHub令牌来提供操作,
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }} # 指定密钥，即在第一步中设置的
          BRANCH: gh-pages  # 指定推送到远程分支
          FOLDER: build  # 指定构建之后要推送那个目录的代码，这里react执行 npm run build 后会打包到 build 目录下，因此这里是 build 目录
```
#### 5. 提交测试

上面配置 根据自己的项目情况来设置，然后随便修改下项目的任意代码，然后提交。执行如下命令：
```
$ git add .
$ git commit -m update
$ git push
```
提交成功之后我们打开项目的 github action 面板：如下图看到：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/7.png" />

然后我们点击 update 点击进去，看到成功打包了，如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/7.1.png" />

我们可以看到我们在 npm-publish.yml中定义的push事件被触发了，执行了jobs中的所有步骤，打包并将打包后到 build 文件夹中的内容推送到了 github 仓库的 gh-pages分支上。

当如上 complete job 选项完成的时候，进入仓库的 Settings --> Pages 菜单下，将 source Branch 字段设置为 gh-pages，文件夹选择 root 根目录就好：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/8.png" />

然后我们点击生成的链接即可看到自动构建完成的应用了。从此以后，我们只需要推送yml文件中指定的分支，就可以自动触发构建，自动更新我们的网站。如下访问的效果：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images2/githubAction/9.png" />

最后我们点击访问 <a href="https://kongzhi0707.github.io/react-github-actions-workflow-demo/">https://kongzhi0707.github.io/react-github-actions-workflow-demo/ </a> 就可以访问我们的项目了。

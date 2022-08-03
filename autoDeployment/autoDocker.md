
### 使用Docker+webHook实现前端自动化部署

  在很久之前，我们需要实现部署项目，可能会经历如下几个步骤：
```
1）本地项目打包，运行 npm run build, 生成build文件。
2）将build中所有的文件通过ftp等形式上传到服务器中。
3）git push 提交代码到仓库。
```
  在使用Docker实现前端自动化部署后，我们会经历如下几个过程：
```
1）git push 提交代码到仓库。
2）服务器自动更新镜像文件。
3）镜像中自动运行 npm run build 生成构建产物。
4）服务器自动创建容器。
```
  因此实现前端自动化部署后，我们开发者只需要把代码推送到仓库，其他事情都可以通过服务器上的自动化脚本完成。


#### 创建 demo 项目

  我们先简单的使用 vue-cli 在本地创建项目，
```
vue create docker-webhook-test
```
  然后把我们的demo项目上传到github上，并且准备配置 webhook

##### webhook

  基本原理：当仓库有提交代码时，通过将 webhook 请求地址指向云服务器IP地址，云服务器就能知道项目有更新，之后运行相关代码实现自动化部署。

##### 配置webhook

  打开github的仓库主页，点击右侧的 settings

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/5.png" /> <br />
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/6.png" /> <br />
```
Payload URL: 填写云服务器公网IP，记得添加 http(s) 前缀。
Content type: 选择 application/json 即发送json格式的post请求。
触发时机：Just the push event， 即仓库的push事件，根据不同的需求还可以选择其他事件，比如 PR, 提交 Commit ，提交 issues 等。
```
  最后我们点击 Add webhook 为当前项目添加一个 webhook, 现在当我们 docker-webhook-test 项目有代码提交的时候，就会向 http://47.94.155.8/ 发送一个post请求。 

#### 测试 webhook

  配置完成后，我们可以向我们项目仓库代码提交一个 commit (可以理解为git push 下)，然后点击最下方可以看到post请求参数：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/7.png" /> <br />

#### 处理项目更新的请求

  当云服务器接收到项目更新后发送的post请求后，需要创建/更新镜像来实现自动化部署。

#### 1）创建 Dockerfile

  先在本地项目里新建一个 Dockerfile 用于之后创建镜像，在项目的根目录下创建 Dockerfile 文件，配置内容如下：
```
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/local/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
```
  FROM node:lts-alpine as build-stage 代码的含义：基于node的lts-alpine版本镜像，并且通过构建阶段命名，将有node的环境的阶段命名为 build-stage。
  WORKDIR /app: 将工作区设为 /app, 和其他系统文件隔离。
  COPY package*.json ./: 拷贝 package.json / package-lock.json 到容器 /app 目录下。
  RUN npm install: 运行 npm install 在容器中安装依赖。
  COPY . . : 拷贝其他文件到容器 /app 目录，分两次拷贝是因为保持 node_modules 一致。
  RUN npm run build：运行 npm run build 在容器中构建。
```
  下面是第二个阶段，第一个阶段是基于node镜像，第二个阶段是基于 nginx 镜像构建，可以理解为 docker 的多阶段构建；

  FROM nginx:stable-alpine as production-stage：基于 nginx 的 stable-alpine 版本镜像，并且将有nginx环境的阶段命名为 production-stage。

  COPY --from=build-stage /app/dist /usr/local/nginx/html：通过 --form 参数可以引用 build-stage 阶段生成的产物，将其复制到 /usr/local/nginx/html 目录下。

  EXPOSE 80：容器对外暴露的80端口。

  CMD ["nginx", "-g", "daemon off;"]：容器创建时运行 nginx -g daemon off 命令，一旦 CMD 对应的命令结束，容器就会被销毁，所以通过 daemon off 让 nginx 一直在前台运行。

  最后通过 scp 命令，将 Dockerfile 文件复制到云服务器上，进入到 docker-webhook-test 项目的根目录下，运行如下命令：
```
scp ./Dockerfile root@47.94.155.8:/root
```
如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/8.png" /> <br />

  我们可以在 ftp 工具上可以看到 Dockerfile 文件已经在该远程服务器上了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/9.png" /> <br />

#### 2）创建 .dockerignore

  类似 .gitignore，.dockerignore 可以在创建镜像复制文件时忽略复制某些文件。

  在项目的根目录下新建 .dockerignore 文件，输入如下内容：
```
# .dockerignore
node_modules
```
  因为我们需要保持本地和容器中的 node_module 依赖包一致，在创建 Dockerfile 时使用了二次 COPY 命令，第一次只复制了 package.json 和 package-lock.json, 并且安装依赖。

  第二次复制 除了 node_modules 的所有文件，接着我们将 .dockerignore 文件也复制到云服务器上。使用命令如下：
```
scp ./.dockerignore root@47.94.155.8:/root
```
如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/10.png" /> <br />

  同样 我们可以在 ftp 工具上可以看到 .dockerignore 文件已经在该远程服务器上了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/11.png" /> <br />

#### 3) 创建http服务器

  在项目的根目录下新建 index.js, 添加如下代码：
```
const http = require("http");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 递归删除目录
function deleteFolderRecursive(path) { 
  // fs.existsSync 以同步的方式检测目录是否存在
  if (fs.existsSync(path)) { 
    // fs.readdirSync 以同步读取给定的目录的内容
    fs.readdirSync(path).forEach(function (file) {
      const curPath = path + '/' + file;
      // 判断当前文件目录是否存在
      if (fs.statSync(curPath).isDirectory()) {
        // 如果存在，递归调用
        deleteFolderRecursive(curPath);
      } else {
        // 否则的话，删除文件
        fs.unlinkSync(curPath);
      }
    });
    // 同步删除给定路径下的目录
    fs.rmdirSync(path);
  }
}

const resolvePost = req =>
  new Promise(resolve => {
    let chunk = "";
    req.on("data", data => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    })
  });

http.createServer((req, res) => {
  console.log('receive request')
  console.log(req.url)
  if (req.method === 'POST' && req.url === '/') {
    const data = resolvePost(req);
    const projectDir = path.resolve(__dirname, `./${data.repository.name}`);
    deleteFolderRecursive(projectDir);

    // 拉取仓库最新的代码
    execSync(`git clone https://github.com/kongzhi0707/${data.repository.name}.git ${projectDir}`, {
      stdio: 'inherit',
    });

    // 复制 Dockerfile 到项目的目录
    fs.copyFileSync(path.resolve(__dirname, `./Dockerfile`), path.resolve(projectDir, './Dockerfile'));

    // 复制 .dockerignore 到项目的目录
    fs.copyFileSync(path.resolve(__dirname, `./.dockerignore`), path.resolve(projectDir, './.dockerignore'));

    // 创建 docker 镜像
    execSync(`docker build -t ${data.repository.name}-image:latest .`, {
      stdio: 'inherit',
      cwd: projectDir
    });

    // 销毁 docker 容器
    execSync(`docker ps -a -f "name=^${data.repository.name}-container" --format="{{.Names}}" | xargs -r docker stop | xargs -r docker rm`, {
      stdio: 'inherit',
    });

    // 创建 docker 容器
    execSync(`docker run -d -p 8888:80 --name ${data.repository.name}-container ${data.repository.name}-image:latest`, {
      stdio: 'inherit',
    });
    console.log('deploy success');
  }
  res.end('ok')
}).listen(3000, () => {
  console.log('server is ready')
});
```
  data.repository.name 即 webhook 中记录仓库名的属性.

  同样，我们通过 scp 命令复制到云服务器上， 如下命令：
```
scp ./index.js root@47.94.155.8:/root
```
  同样我们可以看到我们的 index.js 被复制到云服务器上， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/12.png" /> <br />

#### 运行 node 脚本

  我们之前安装过 pm2， 现在我们使用 pm2 将 index.js 作为后台脚本在云服务器上运行，如下命令：
```
pm2 start index.js
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/13.png" /> <br />

#### 实践操作

1）在云服务器上运行 pm2 logs 查看index.js 输出的日志， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/14.png" /> <br />

2) 在本地项目中的 App.vue 中添加 Hello Docker~ kongzhi 文案，并且把代码推送到 github 上去。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/15.png" /> <br />

待续～  感觉没有配置好， 后面再折腾～ 























### Docker部署前端应用

  web前端项目的部署上线一般会经历babel编译，webpack构建打包，最终将打包后的资源放在静态服务器上。

#### 一：部署单页应用

  我们可以使用 create-react-app 快速创建一个react项目。如下：
```
$ npm i create-react-app -g
$ create-react-app react-demo
$ cd react-demo
$ npm run start
```
  就可以启动我们的项目了。

  我们使用如下命令就可以进行打包：
```
npm run build
```
  可以看到，我们在项目的根目录下会自动生成build目录。我们可以把build目录下所有文件放到nginx服务器对应文件的目录下即可。

  我们可以在本地运行下build目录，如下命令：
```
$ npm i http-server -g
$ http-server -p 7777 ./build
```
  访问 http://127.0.0.1:7777/ 即可看到我们打包后的页面。

  现在我们需要使用Docker来打包我们的应用成一个镜像文件。

#### 单页面应用使用docker部署

  在react-demo项目目录下新建 Dockerfile, .dockerignore 和 nginx.conf

#### 1) .dockerignore 文件如下
```
node_modules
build
```
  dockerignore 指定了那些文件不需要被拷贝到镜像里面去。和 .gitignore 类似。

#### 2) 配置 nginx.conf
```
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /app/build; # 打包的路径
        index  index.html index.htm;
        try_files $uri $uri/ /index.html; # 防止重刷新返回404
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
#### 3) 配置 Dockerfile
```
# 基于node11
FROM node:11

# 设置环境变量
ENV PROJECT_ENV production
ENV NODE_ENV production

# 安装nginx
RUN apt-get update && apt-get install -y nginx

# 把 package.json package-lock.json 复制到/app目录下
# 为了npm install可以缓存
COPY package*.json /app/

# 切换到app目录
WORKDIR /app

# 安装依赖
RUN npm install --registry=https://registry.npm.taobao.org

# 把所有源代码拷贝到/app
COPY . /app

# 打包构建
RUN npm run build

# 拷贝配置文件到nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 启动nginx，关闭守护式运行，否则容器启动后会立刻关闭
CMD ["nginx", "-g", "daemon off;"]
```
#### 4）打包镜像

  打包镜像执行如下命令：
```
docker build -t tugenhua/react-app .
```
#### 5）启动容器
```
docker run -d --name my-test-app -p 9001:80 tugenhua/react-app
```
  如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/30.jpg" />

  然后我们访问 http://localhost:9001/ 就可以看到页面，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/31.jpg" />

  我们接下来就可以把项目上传到阿里云仓库里面去，然后可以下载使用即可。

#### 6）多层构建

  如上Dockfile的配置的镜像是基于node11的，但是整个镜像用到的node环境只是前端打包，真正启动项目的是nginx。镜像里面的源代码及node_modules根本没有用，因此冗余文件会造成镜像体积变得庞大。我们仅仅需要的是打包出来的静态文件及启动一个静态服务器nginx即可的。

  我们需要使用 multi-stage（https://docs.docker.com/develop/develop-images/multistage-build/）进行多层构建。

  在项目的根目录下新建一个叫 Dockerfile.multi 文件，代码改成如下：
```
# node镜像仅仅是用来打包文件
FROM node:alpine as builder

# 设置环境变量
ENV PROJECT_ENV production
ENV NODE_ENV production

COPY package*.json /app/

WORKDIR /app

RUN npm install

COPY . /app

RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /app/build
```
  如上文件，用到了两个FROM基础镜像，第一个 node:alpine 仅仅作为打包环境，真正的基础镜像是：nginx:alpine

#### 6.1）打包镜像

  -f 指定使用Dockerfile.multi进行构建
```
docker build -t tugenhua/react-app-multi . -f Dockerfile.multi
```
#### 注意：Docker多阶段构建是在17.05版本后引入的新特性，如果版本低于该版本的话，运行上面的命令会报错的，需要对Docker进行升级即可。

  对于更多知识了解Docker多阶段构建，可以google～

#### 6.2）启动容器
```
docker run -d --name my-react-app-multi  -p 9002:80 tugenhua/react-app-multi
```
  我们先来看看端口映射如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/32.jpg" />

  访问 http://localhost:9002/ 可以看到页面，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/33.jpg" />

#### 查看镜像大小

  运行 docker images , 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/34.jpg" />

  可以看到，tugenhua/react-app 镜像有1.15G，而 tugenhua/react-app-multi 只有22.8M。

  主要原因是，tugenhua/react-app 的基础镜像node:11 有900多兆，而tugenhua/react-app-multi的基础镜像 nginx:alpine只有20几兆。因此多层构建对于减少镜像大小是很有帮助的。

#### 二：使用Docker构建node.js项目

#### 1）创建项目

  这里使用egg.js来做下演示，使用 egg-init 初始化项目。
```
$ mkdir egg-example && cd egg-example
$ npm init egg --type=simple
$ npm i
```
  启动项目：
```
$ npm run dev
$ open http://localhost:7001
```
  我们访问 http://localhost:7001 就可以看到我们的页面了。

#### 2）定制镜像

  在项目的根目录下新建 Dockerfile 文件来定制我们的镜像。
```
1）使用FROM指令指定基础镜像，使用官方提供的 node:8
2) 使用LABEL指令为构建的镜像设置作者信息。
3）使用COPY指令将根目录下的所有文件拷贝到镜像内。
4）使用 RUN 指令执行 npm install 安装依赖。
5）使用 EXPOSE 指令声明运行时容器提供的服务端口，暴露7001端口。
6）使用 CMD 指令设置容器启动命令为 npm start.
```
  Dockerfile 文件代码如下：
```
FROM node:8
LABEL tugenhua "kongzhi0707@qq.com"
COPY . .
RUN npm install
EXPOSE 7001
CMD ["npm", "start"]
```
#### 3）构建镜像

  使用 docker build 命令进行构建
```
$ docker build -t tugenhua/test-egg2 .
```
#### 4) 测试镜像

  使用 docker run 命令启动容器，并且将本地的 4002 端口映射到容器的 7001 端口。如下命令：
```
$ docker run -d --name test-egg-app2 -p 4002:7001 tugenhua/test-egg2
```
如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/34.2.jpg" />

然后，我们打开浏览器，访问 http://localhost:4002/, 页面访问如下所示，说明成功了。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/35.jpg" />

下面我们也可以使用 docker push 上传镜像后续操作等等了。


























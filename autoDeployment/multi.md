
### 理解Docker多阶段构建流程

  如何减少构建镜像的体积，在Docker17.05版本之后，新增了Dockerfile多阶段构建 --- https://docs.docker.com/develop/develop-images/multistage-build/

  所谓多阶段构建，实际上是允许一个Dockerfile中出现多个 FROM 指令。每一条FROM指令都是一个构建阶段，都可以使用各自不同的基础镜像。多条FROM指令就是多阶段构建，虽然最后生成的镜像只能是最后一个阶段的结果，但是，能够将前置阶段中的文件中的产出物拷贝到后边阶段中。这就是多阶段构建中最大的意义。

  比如多阶段构建代码如下：
```
# node镜像仅仅是用来打包文件
FROM node:alpine as builder

# 设置环境变量
ENV PROJECT_ENV production
ENV NODE_ENV production

# 安装nginx
RUN apt-get update && apt-get install -y nginx

# 把 package.json package-lock.json 复制到/app目录下
COPY package*.json /app/

# 切换到app目录
WORKDIR /app

# 安装依赖
RUN npm install --registry=https://registry.npm.taobao.org

# 把所有源代码拷贝到/app
COPY . /app

# 打包构建
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine

# 拷贝配置文件到nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /app/build

EXPOSE 80

# 启动nginx，关闭守护式运行，否则容器启动后会立刻关闭
CMD ["nginx", "-g", "daemon off;"]

```
  我们可以使用一个流程图来演示上面代码要做的事情，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/36.jpg" />

  如上所示，整个过程被分为 构建阶段 和 运行阶段。

#### 构建阶段
```
1）在构建阶段，我们以 node:alpine 基础镜像开始，同时我们将该阶段定名为 builder。为了后续帮助我们在其后引用该阶段。
2）设置环境变量为正式环境。
3) 安装nginx
4）将package.json文件拷贝到工作目录app下，npm需要该文件以安装所需依赖项，注意：我们只是拷贝了package.json文件以确保对于后面代码变更而发生的构建，不会使docker镜像缓存失效。
5）切换到 app目录下。(使用 WORKDIR 命令)。
6）在切换后的app目录下，使用RUN命令运行 npm install 来安装依赖项。
7）使用命令：COPY . /app 将其他文件拷贝到app工作目录下，也就是包含了应用真正代码的那些文件。
8）使用命令：RUN npm run build，来执行 npm run build命令，该命令将准备好 React/Vue 应用的生产环境构建的产物。也就是说，该命令会生成客户端需要的index.html文件和main.js文件等等。
```
#### 运行阶段
```
1）以nginx基础镜像开始运行阶段，使用命令：FROM nginx:alpine
2）拷贝配置文件 nginx.conf 到 /etc/nginx/conf.d/default.conf 目录下。
3）我们从 builder 阶段拷贝构建产物到nginx所需的位置，我们通过 --from=builder /app/build 引用了构建阶段，并且从构建阶段的工作目录拷贝了 /app/build。
```
  如上操作我们就完成了Docker多阶段构建的Dockerfile。

#### 2）docker的层级概念

  文件层级：Docker镜像可以理解为由多层的文件构成，当进行镜像的构建过程中，每执行一次RUN指令，镜像中就会增加一层。

  起始层(根镜像)： 构建镜像的时候需要使用FROM指令选择一个基础镜像，即根镜像，后续所有的操作都会基于这个根镜像进行，Docker镜像只允许有一个根镜像，在多阶段构建中虽然使用了多个FROM指令，但是只有最后一个才是最终构建的根镜像。

  层共享：当我们的操作系统中只存在一个镜像，且该镜像的层数为3，当我们基于这个镜像构建新的镜像(新镜像比之前的镜像多出2层)进行构建的时候，最终在系统一共保存了5层。
而不是 3+5=8层，这就是Docker镜像的层共享。

  联合挂载：由于Docker的每一层只记录文件变更，因此在新启动一个容器的时候会计算当时使用镜像的每一层信息，最终生成一个文件系统。这就是联合挂载的含义。
















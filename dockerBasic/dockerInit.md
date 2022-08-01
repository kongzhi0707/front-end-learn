### 初始化docker 项目环境配置

  Docker 是一个开源的应用容器引擎，让开发者可以打包应用以及依赖包到一个可移植的容器中。然后发布到Linux机器或windows机器上。想要了解更多docker相关的知识点，请看之前 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/autoDeployment/docker.md">这篇文章</a>

  我这边先搭建docker项目环境；

  我在网上买了一个阿里云服务器，为了测试部署功能，部署前端项目到阿里云服务器，看 <a href="https://blog.csdn.net/Kevinblant/article/details/103168451">这篇文章</a> 很详细。

  登录阿里云服务器，切换到实例中，登录远程服务器中，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/1.png" /> <br />

  点击远程连接后，点击 Workbench远程连接 立即登录按钮，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/2.png" /> <br />

  最后连接成功后，打开远程连接窗口如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/3.png" /> <br />

#### 安装环境

#### 1）docker

  我们在本地安装了docker，但是在云服务器上默认是没有的，因此我们需要给他安装docker环境。根据docker官网的安装教程，需要运行如下命令：
```
# Step 1: 安装必要的一些系统工具
sudo yum install -y yum-utils

# Step 2: 添加软件源信息，使用阿里云镜像
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Step 3: 安装 docker-ce
sudo yum install docker-ce docker-ce-cli containerd.io

# Step 4: 开启 docker服务
sudo systemctl start docker
```
  如上操作完成后，我们在远程窗口命令行中 运行 docker --help 命令看到如下信息，说明docker环境已经安装好了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/4.png" /> <br />

#### 2）git

  自动化部署会涉及到拉取最新的代码，因此我们需要安装git环境。安装命令如下：
```
yum install git
```
#### 3) node

  既然是前端自动化部署，云服务器上相关处理逻辑使用js编写，所以我们需要安装node环境，如下命令：
```
sudo yum install node
```
  我们也可以继续安装npm，安装 npm 使用如下命令：
```
sudo yum install npm
```
  如上node安装完成后，我们还需要安装 pm2, 它能使我们的js脚本能在云服务器的后台运行。安装命令如下：
```
npm i pm2 -g
```

#### 2) 基于Docker 安装 Nginx

#### 1) 查看docker已有的images(镜像)
```
docker images

[root@iZ2zeds62pwbss0ax04ja6Z ~]# docker images
REPOSITORY   TAG       IMAGE ID   CREATED   SIZE
```
#### 2）查询需要下载的nginx镜像
```
docker search nginx
```
#### 3）拉取nginx镜像
```
docker pull nginx
```
#### 4）查看是否拉取成功
```
docker images

[root@iZ2zeds62pwbss0ax04ja6Z ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    670dcc86b69d   12 days ago   142MB
```
#### 5) 启动镜像
```
-d: 表示在后台运行
-p: 端口映射 冒号前是本机端口，冒号后是容器端口。
--name=镜像名称 最后的nginx是创建的nginx镜像

docker run -d -p 8888:80 --name=imageName2 nginx
```
#### 6) 查看是否可以访问

  输入服务器公网ip:8888(比如：http://47.94.155.8:8888/), 如果可以看到nginx的界面说明nginx已经安装成功了。

  如果没有看到该界面，可能购买的云服务器没有配置该端口。因此我们下面需要如下配置下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/16.png" /> <br />

  然后点击 入口访问 -> 手动添加按钮，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/17.png" /> <br />

  然后我们再访问公网ip就可以了，如: http://47.94.155.8:8888/

### 了解 Docker

#### 一：什么是Docker？

  Docker 解决了软件环境部署复杂的问题。

  比如说，开发是在windows系统下编写的代码，放到liunx服务器上可能会出问题；或 开发在本地依赖了一个系统自带的驱动，服务器且没有这个驱动。或 开发在本地设置了很多环境变量，服务器上又需要重新设置等等。在软件部署的时候，经常会在这台机器上可以跑，但是在另外一台机器上运行失败。

  那有没有什么办法，使得开发人员在交付代码时，将代码的运行环境(包括配置/数据/参数等)也一并打包到部署环境中呢？Docker正是为了解决这个问题而诞生的，在之前，
开发人员只管将程序编译完然后提交给运维，由运维去部署。但是如果有了Docker后，我们不只是简单提交代码，而是将运行文档，配置环境，运行环境，运行依赖包等放置到一个集装箱中交付给运维(云平台)手中。

  现在的网络都已经采用了分布式集群来应对高并发请求，如果我们现在还是按照传统方式来部署我们的应用的话，运维人员需要手动地配置每个分布式节点的安装环境。如果这样操作的话，人力和时间成本将会花费很大的。再比如，如果分布式集群需要再次进行弹性扩容，运维人员需要重新在新的机器上安装 MySql，JDK等等环境。假设某个App需要依赖Redis，MongoDB，
mySql才能正常运行，如果还是使用传统方法的话，运维人员需要按照开发人员提供的开发手册，手动在部署环境中安装Redis, MongoDB, MySql等这些工具，同时还要考虑到版本不同带来不同的问题(比如mysql不同版本的差别)。

  所以Docker就是来解决这一类问题的，设计者将Docker设计为：将自己的代码+配置+环境 打包成一个镜像文件，然后直接将整个镜像迁移到其他运行机器中。就可以获取完全一样的部署环境。

  如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/0.jpg" />

#### 总结概括Docker

  Docker是一个解决运行环境和配置问题。Docker有如下优点：
```
1）更快速的应用交付和部署。
2）更便捷的升级和扩容/缩容。
3）降低系统运维的门槛。
4）高效的计算资源利用。
5）一次构建，随处运行。
```
#### 镜像/容器/仓库

  Docker由镜像(Image), 容器(Container), 仓库(Repository) 三部分组成。

#### 1）Docker镜像

  Docker镜像可以简单类比为电脑系统用的系统盘，它包括了操作系统及必要的软件。它是只读的。一个镜像可以包含一个完整的centors操作系统环境，并安装了Nginx和Tomcat服务器。我们可以使用 docker images 来查看本地镜像列表。

#### 2）Docker容器

  容器是由镜像创建出来的运行实列，它可以被启动，停止，甚至删除。每个容器都是相互隔离且保证平台安全。我们可以把容器看作一个Linux的电脑，它可以直接运行。
容器在启动的时候基于镜像创建一层可写层作为最上层。我们可以使用 docker ps -a 查看本地运行过的容器。

#### 3）Docker仓库

  Docker仓库用于存放镜像的。这和Git非常类似。我们可以从中心仓库下载镜像。也可以从自建仓库下载。并且我们可以把制作好的镜像commit到本地，然后push到远程仓库。
仓库分为 公开仓库 和 私有仓库。最大的公开仓库是官方仓库 Dock Hub. 国内的公开仓库有阿里云等。

#### Docker 部署环境流程改变

比如我们有三个环境，开发(或叫日常)环境，测试环境，生产环境。并且每个环境都需要部署相同的软件/脚本/运行程序。每次环境中任意一个环境升级的时候，我们都需要维护三份。
那么如果某一天某个环境疏忽的话，就可能会出现问题。如下传统部署的方式：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/1.jpg" />

  但是如果我们引入了Docker后，我们只需要维护一个Docker镜像就可以了。可以实现多套环境，一个镜像，实现系统级别的一次构建到处运行。如下基本流程：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/2.jpg" />

  如上，通过Docker流程改造，我们的镜像文件生成后就可以跑在任何系统上，并且快速部署。基于Docker部署，可以充分利用机器资源，节省成本。

#### 二：安装Docker

#### 2.1）下载安装

  官方下载地址: (Mac) https://download.docker.com/mac/stable/Docker.dmg 
  阿里云下载地址（http://mirrors.aliyun.com/docker-toolbox/mac/docker-for-mac/?spm=5176.8351553.0.0.468b1991jdT95t）

  安装完成后启动，Mac顶部导航栏出现了一个图标，通过菜单可以进行docker配置和退出等操作。如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/3.jpg" />

  官方指南文档（https://docs.docker.com/get-docker/）
  阿里云指南 (Linux) (https://developer.aliyun.com/article/110806)

#### 2.2) 查看版本

  如上我们已经安装完成了，我们来查看下版本，使用命令：docker version

  查看结果，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/4.jpg" />

#### 三：搭建web服务器

  我们先来学习搭建一个web服务器，首先我们需要拉取 centos 镜像。使用如下命令：
```
docker run -p 80 --name web -i -t centos /bin/bash
```
  参数解析：

  -i 选项是 告诉 Docker 容器保持标准输入流对容器开放（即使容器没有终端链接）。
  -t 选项是 告诉 Docker 为容器分配一个虚拟终端，以便于我们接下来安装nginx服务器。

  当然我们还可以 -d, -d选项是告诉Docker在后台运行容器的守护进程。

  --name web 选项是告诉 Docker 创建一个名称是web的容器。如果我们不指定的话，Docker会为我们创建的每一个容器自动生成一个随机的名称。随机名称可读性比较差，并且对后期维护的理解成本会比较大，因此我们需要指定一个web容器的名称。

  -p 80 选项是告诉 Docker 开放80端口，因此 Nginx才可以对外通过访问和服务。

  docker run 选项是 Docker通过run命令来启动一个新容器。Docker 首先会在本机中寻找该镜像，如果没有安装，Docker会在 Docker Hub上查找该镜像并下载安装到本机，最后Docker创建一个新的容器并且启动该程序。

如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/5.jpg" />

  但是，当我们第二次执行 docker run 时，因为Docker在本机中已经安装过该镜像，因此 Docker 会直接创建一个新的容器并且启动该程序。

  如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/6.jpg" />

#### 注意： docker run 每次使用都会创建一个新的容器，因此，我们以后再次启动这个容器时，只需要使用命令 docker start 即可。docker start 的作用是用在重新启动已存在的镜像。而 docker run 包含该镜像放入容器中 docker create，然后将容器启动 docker start，如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/7.jpg" />

#### 1) 安装nginx服务器

  我们需要执行以下命令，来安装nginx源。如下命令：
```
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```
  安装完 Nginx源后，就可以正式安装Nginx了。如下命令：
```
yum install -y nginx
```
  现在，我们输入 whereis nginx 命令就可以看到安装的路径了，如下：
```
[root@8bedca2ab823 /]# whereis nginx
nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man3/nginx.3pm.gz /usr/share/man/man8/nginx.8.gz
```
  现在我们执行 nginx 命令，就可以将nginx跑起来了。
```
nginx
```
  我们执行 ctrl + P +  Q 切换到后台。然后，通过 docker ps -a 来查看随机分配的端口。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/8.jpg" />

  如上可以看到 端口是：32768， 那么我们通过浏览器访问：http://127.0.0.1:32768 即可。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/9.jpg" />

#### 2) 了解docker命令

  我们可以使用 docker --help 查看docker有那些命令操作。

  常用命令如下：
```
docker pull ${CONTAINER NAME}                   # 拉取镜像
docker images                                   # 查看本地所有镜像
docker ps                                       # 查看所有正在运行的容器，加 -q 参数的话，会返回id
docker ps -a                                    # 查看所有容器，加 -q返回id
docker rmi ${IMAGE NAME/ID}                     # 删除镜像
docker rm ${CONTAINER NAME/ID}                  # 删除容器
docker save ${IMAGE NAME} > ${FILE NAME}.tar    # 将镜像保存成文件
docker load < ${FILE NAME}.tar                  # 从文件加载镜像
docker start ${CONTAINER NAME/ID}               # 运行一个以前运行过的容器
docker stop ${CONTAINER NAME/ID}                # 停止一个正在运行的容器
docker logs ${CONTAINER NAME/ID}                # 显示运行容器的日志
docker run...                                   # 运行一个容器
   --name ${container name}                     # 设置容器名称
   -p ${host port}:${container port}            # 映射主机和容器内的端口
   -e ${env name}=${env value}                  # 添加环境变量
   -d                                           # 后台运行
   -v ${host folder path}:${container folder path} # 将主机目录挂到容器内
```
  高级命令：
```
docker ps -f "status=exited"                    # 显示所有退出的容器
docker ps -a -q                                 # 显示所有容器id
docker ps -f "status=exited" -q                 # 显示所有退出容器的id
docker restart $(docker ps -q)                  # 重启所有正在运行的容器
docker stop $(docker ps -a -q)                  # 停止所有容器
docker rm $(docker ps -a -q)                    # 删除所有容器
docker rm $(docker ps -f "status=exited" -q)    # 删除所有退出的容器
docker rm $(docker stop $(docker ps -a -q))     # 停止并删除所有的容器
docker start $(docker ps -a -q)                 # 启动所有容器
docker rmi $(docker images -a -q)               # 删除所有镜像
docker exec -it ${CONTAINER NAME/ID} /bin/bash  # 进入容器内
docker system
  docker system df           #显示硬盘占用
  docker system events       #显示容器的实时事件
  docker system info         #显示系统信息
  docker system prune        #清理文件
```
  了解到了上面一些常见的docker命令后，下面我们可以使用 docker images 命令来查看本地的镜像。
```
docker images
```
  查询结果，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/10.jpg" />

  对上面的名词解析下含义如下：
```
REPOSITORY：仓库名称。
TAG：镜像标签，其中 lastest 表示最新版本。
#### 注意：一个镜像可以有多个标签，那么我们可以通过标签来管理有用的版本和功能标签。
IMAGE ID：镜像唯一的ID。
CREATED：创建时间。
SIZE：镜像大小。
```
  如上我们可以看到我们：
```
仓库名称为：centos，
IMAGE ID(镜像唯一的ID)为：'300e315adb2f'; 
镜像大小为(SIZE)：209 MB；
```
#### 3) 拉取镜像

  如果我们第一次通过 docker pull centos:latest 拉取镜像的话，那么当我们再执行 docker run -p 80 --name web -i -t centos /bin/bash 时，它就不会再去远程获取了，因为我们的本机中已经安装过该镜像文件，所以Docker会直接创建一个新的容器并且启动该程序。

  官方也已经为我们提供了安装好的Nginx镜像，我们可以直接拿过来直接使用，我们可以通过使用命令：docker search nginx 来查找nginx的镜像清单。如下命令：
```
docker search nginx
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/11.jpg" />

  现在，我们可以通过 docker pull nginx 来拉取最新的nginx镜像文件，当然我们也可以通过 docker pull nginx:latest 来操作。
```
docker pull nginx:latest
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/12.jpg" />

  然后我们通过如下命令创建并且运行一个容器。
```
docker run -p 8080:80 -d --name nginx nginx
```
  -d 选项是告诉Docker在后台运行容器的守护进程。
  -p 8080:80：是告诉docker 8080端口是对外开放的端口，80端口对外开放的端口映射到容器里面的端口号。
  第一个nginx，是容器名称。第二个nginx是启动nginx。

  我们再通过 docker ps -a 来查看，发现容器已经在后台运行了，并且后台执行了nginx命令，并且对外开放了8080端口。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/13.jpg" />

  因此，我们通过浏览器访问：http://127.0.0.1:8080 即可，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/14.jpg" />

#### 注意：如上是使用 Docker Hub 上的软件，当然国内也有阿里云服务器，我们也可以登陆阿里云，也可以拉取公开的镜像。

#### 4）构建我们自己的镜像文件

  Docker构建镜像有两种方式：第一种是使用 docker commit 命令，第二种是使用 docker build 命令 和 Dockerfile文件。其中第一种 docker commit 根据介绍是不推荐
使用的。据说它没有使的整个流程标准化。因此我们使用 第二种 docker build 命令 和 Dockerfile 文件来构建我们的镜像了。使用 Dockerfile文件的优点是：可以让我们的
构建镜像更具备可重复性，同时还可以保证启动脚本和运行程序标准化。

#### 构建第一个Dockerfile文件

  比如我们的目录结构如下：
```
|---- centos
| |--- Dockfile
└──
```
#### 1）下面我们需要在 centos/Dockfile 文件下编写如下代码：
```
FROM centos:7
MAINTAINER tugenhua "kongzhi0707@qq.com"
RUN rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
RUN yum install -y nginx
EXPOSE 80
```
  参数解析含义如下：
```
FROM centos:7 含义：指定centos作为基础镜像，它的版本是7(CentOS 7).
MAINTAINER tugenhua "kongzhi0707@qq.com" 含义：指定该镜像的作者是 tugenhua，邮箱是：kongzhi0707@qq.com。

RUN rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
RUN yum install -y nginx
```
  如上两句代码的含义是：执行两个RUN指令进行Nginx的下载及安装。

  EXPOSE 80 含义是：暴露Docker容器的80端口。

#### 2）进行构建

  第二步我们需要使用 docker build 命令进行构建，命令如下所示：
```
docker build -t="tugenhua/nginx_demo:v1" .
```
  如上我们使用了 docker build 命令进行构建，-t 的含义是告诉Docker镜像的名称和版本。最后面的 一个 . 的含义是为了让Docker在当前本地目录下寻找 Dockfile文件。

#### 注意：Docker 会在每一步构建都会将结果提交为镜像，然后将之前的镜像层看作缓存，因此当我们重新执行 docker build 构建类似的镜像层时会直接使用之前的镜像的。如果我们需要跳过，可以在命令行后加上参数 --no-cache 选项告诉Docker不进行缓存。

  构建结果如下报错的话：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/15.jpg" />

  解决的办法很简单，在命令行中进入该文件：sudo vi /etc/resolv.conf

  添加下面一行就可以了
```
nameserver 114.114.114.114
```
  最后再执行命令：docker build -t="tugenhua/nginx_demo:v1" . 即可，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/16.jpg" />

  出现上面提示，说明构建成功了。

  现在， 我们来通过 docker images 看下我们的新镜像吧。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/17.jpg" />

#### 注意：Dockerfile 指令 可以网上搜索下。

#### 3）将镜像推送到远程仓库

  镜像构建完毕后，我们需要将它推送到 Docker Hub上面，因此我们首先要注册账号，注册地址(https://hub.docker.com/) 

  注册完成后，我们在命令行中进行登录，使用命令：
```
docker login
```
  登录成功后，我们使用 docker push 命令进行推送。如下命令：
```
docker push tugenhua/nginx_demo:v1
```
  如上推送到 Docker Hub上面耗时很长，下面我们来学习下 docker 将镜像推送到阿里云上。

#### 3.2）docker将镜像推送到阿里云上

  docker将镜像推送到阿里云仓库一般有如下操作：
```
1）登陆阿里云创建仓库。
2）在docker上登录阿里云仓库。
3）推送镜像到阿里云。
4）在公网上查看是否有自己的tomcat镜像。
5）从阿里云拉取我们自己的镜像是否可以使用。
```
#### 1）登陆阿里云创建仓库

#### 1.1）登录地址：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors 如果没有账号，自己注册一个。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/18.jpg" />

#### 1.2）创建命名空间

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/19.jpg" />

#### 1.3) 创建仓库名称

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/20.jpg" />

  点击下一步

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/21.jpg" />

  仓库创建完成。查看当前仓库信息 (https://cr.console.aliyun.com/cn-hangzhou/instances/repositories) 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/22.jpg" />

  如何登陆，拉取，推送等，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/23.jpg" />

#### 2）在docker上登录阿里云仓库

  使用命令如下：
```
$ sudo docker login --username=我叫空智0707 registry.cn-hangzhou.aliyuncs.com
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/24.jpg" />

#### 注意：第一次输入的密码是因为使用了sudo，因此第一次输入的密码是：自己电脑登陆密码，第二次才是 仓库密码。docker login 登陆失败，请看这里原因（https://help.aliyun.com/knowledge_detail/60761.html）

#### 3）推送镜像到阿里云

  使用如下两条命令：
```
$ sudo docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:[镜像版本号]
$ sudo docker push registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:[镜像版本号]
```
  具体如何操作，看阿里云文档（https://cr.console.aliyun.com/repository/cn-hangzhou/docker_demo0707/tomcat07/details）

  先使用 sudo docker images 查看当前镜像列表信息；如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/25.jpg" />
```
docker tag 9a988767f411 registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:v1
docker push registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:v1
```
  如下，说明推送成功了。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/26.jpg" />

#### 4）在公网上查看是否有自己的镜像

https://cr.console.aliyun.com/cn-hangzhou/instances/images

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/27.jpg" />

#### 5）从阿里云上拉取我们自己的镜像看是否可以使用
```
使用命令：docker pull registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:[镜像版本号]
```
  操作如下：
```
1) 拉取镜像：docker pull registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:v1
2）查看镜像：docker images
3) 运行镜像：docker run -d -p 8084:80 --name tugenhua nginx
4) 查看映射端口: docker ps
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/28.jpg" />

  在浏览器端访问运行：http://127.0.0.1:8084/  如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/29.jpg" />



















































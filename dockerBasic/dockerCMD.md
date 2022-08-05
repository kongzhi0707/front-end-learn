### docker 常用的命令操作

<div id="back"></div>

- [一) docker 容器管理命令](#id1) <br />
  - 1.1) 创建容器 <br />
  - 1.2) 查看正在运行的容器 <br />
  - 1.3) 查看当前所有容器 <br />
  - 1.4) 停止容器 <br />
  - 1.5) 启动容器/重启容器 <br />
  - 1.6) 杀死容器 <br />
  - 1.7) 删除已经停止的容器 <br />
  - 1.8) 删除容器 <br />
  - 1.9) 更新容器的配置 <br />
  - 1.10) 显示容器的端口映射 <br />
  - 1.11) 显示容器的实时资源使用统计 <br />
  - 1.12) 显示容器中正在运行的进程 <br />
- [二) docker 镜像管理命令](#id2) <br />
  - 2.1) 创建镜像 <br />
  - 2.2) 查看当前机器的所有镜像 <br />
  - 2.3) 查看所有的镜像id <br />
  - 2.4) 搜索镜像 <br />
  - 2.5) 拉取镜像(从docker仓库拉取镜像, 名称:版本号) <br />
  - 2.6) 推送镜像<br />
  - 2.7) 删除本地机器的镜像<br />
  - 2.8) 删除所有本地镜像 <br />
  - 2.9) 为一个镜像打tag <br />
  - 2.10) 镜像打包成一个tar包 <br />
  - 2.11) 解压一个镜像tar包 <br />
- [三) docker 查看日志信息](#id3) <br />
  - 3.1) 查看容器日志<br />
  - 3.2) 查看docker服务的信息<br />
  - 3.3) 获取镜像的元信息, 详细信息 <br />
- [四) docker 文件拷贝](#id4) <br />

Docker安装(mac)

Homebrew安装
```
brew install --cask --appdir=/Applications docker
```
安装完成后检查下版本:
```
docker --version 
```
#### <div id="id1">一) docker 容器管理命令 <a href="#back"> 回到顶部</a></div>

#### 1.1) 创建容器

1) 创建一个容器 (不启动它)
```
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]

// 使用docker镜像nginx:latest创建一个容器,并将容器命名为mynginx
docker create  --name mynginx  nginx:latest 
```
#### 创建一个新的容器并运行一个命令
```
// 使用docker镜像nginx:latest以后台模式启动一个容器,并将容器命名为mynginx
docker run --name mynginx -d nginx:latest
```
#### OPTIONS 选项常见的参数说明
```
  -d: 后台运行的容器守护进程.
  -i: 以交互模式运行容器, 通常与-t同时使用.
  -t: 告诉Docker容器分配一个虚拟终端,以便我们接下来安装nginx服务器.
  --name web: 告诉Docker创建一个名称是web的容器. 如果我们不指定的话,Docker会为我们创建的容器自动生成一个随机的名称. 随机名称的可读性比较差, 并且对后期维护的理解成本会比较大, 因此我们需要指定一个web容器的名称. 
  -P: 随机端口映射, 容器内部端口随机映射到主机的端口.
  -p: 指定端口映射, 格式为: 主机(宿主)端口:容器端口
```
因此我们使用如下命令来创建一个web(容器)服务器, 使用如下命令:
```
docker run -d -p 8888:80 --name web nginx
```
  因此我们现在访问 http://127.0.0.1:8888/ 后就可以看到nginx界面了. 如上 -p 8888:80 是告诉docker 8888 端口是对外开放的端口, 80 端口是对外开放的端口到容器里面的端口号(nginx默认端口号是80), web 是容器名称, nginx 含义是启动nginx.

#### 1.2) 查看正在运行的容器
```
docker ps
```
#### 1.3) 查看当前所有容器
```
docker ps -s -a
```
#### 1.4) 停止容器
```
docker stop `容器名称`
```
#### 1.5) 启动容器/重启容器
```
启动容器: docker start `容器名称`

重启容器: docker restart `容器名称`
```
#### 1.6) 杀死容器
```
docker kill `容器名称`
```
#### 1.7) 删除已经停止的容器
```
docker rm -f `镜像ID或镜像名称`
```
#### 1.8) 删除容器

  1) 首先需要停止所有的容器
```
docker stop $(docker ps -a -q)
```
  2) 删除所有的容器
```
docker rm $(docker ps -a -q)
```
  如果我们想删除单个的容器的话, 我们只需要停止单个的容器; 使用命令如下:
```
docker stop `容器的id`
```
  然后我们删除单个容器, 使用命令:
```
docker rm `容器id`
```
  3) 一条命令停用并且删除容器
```
docker stop $(docker ps -q) & docker rm $(docker ps -aq)
```
#### 1.9) 更新容器的配置
```
docker update `容器id`
```
#### 1.10) 显示容器的端口映射
```
docker port `容器名称`
```
#### 1.11) 显示容器的实时资源使用统计
```
docker stats `容器名称`
```
#### 1.12) 显示容器中正在运行的进程
```
docker top `容器名称`
```

#### <div id="id2">二) docker 镜像管理命令 <a href="#back"> 回到顶部</a></div>

#### 2.1) 创建镜像
```
docker build -t tugenhua/nginx_demo:v1

镜像名称为: tugenhua/nginx_demo:v1
```
#### 2.2) 查看当前机器的所有镜像
```
docker images
```
```
  REPOSITORY：仓库名称。
  TAG：镜像标签，其中 lastest 表示最新版本。
  IMAGE ID：镜像唯一的ID。
  CREATED：创建时间。
  SIZE：镜像大小。
```
#### 2.3) 查看所有的镜像id
```
docker images -q
```
#### 2.4) 搜索镜像
```
docker search `镜像名称`
```
  比如我们可以使用 docker search nginx 来查找nginx的镜像清单, 其他镜像名称也是类似搜索.

#### 2.5) 拉取镜像(从docker仓库拉取镜像, 名称:版本号)
```
docker pull `镜像名称`
```
  比如我们可以通过 docker pull nginx:latest 来拉取最新的nginx镜像文件.

#### 2.6) 推送镜像
```
docker push `镜像名称`
```
  比如我的镜像名称为: tugenhua/nginx_demo:v1; 我们可以把我们的镜像名称推送到远程仓库中, 我们只需要登陆远程仓库后, 使用命令: docker push tugenhua/nginx_demo:v1 推送即可.

#### 2.7) 删除本地机器的镜像
```
docker rmi `镜像名称/镜像id`
```
#### 2.8) 删除所有本地镜像
```
docker rmi docker images -q
```
#### 2.9) 为一个镜像打tag
```
docker tag [ImageId] IP地址/仓库名称/镜像名称:版本号
```
  比如我上面的web容器的镜像id为: 35c43ace9216, 阿里云的远程仓库为: registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07, 因此我们打tag命令如下:
```
docker tag 35c43ace9216 registry.cn-hangzhou.aliyuncs.com/docker_demo0707/tomcat07:v1;
```
#### 2.10) 镜像打包成一个tar包
```
docker save -o 打包名称.tar 镜像名称:镜像版本
```
比如: docker save -o nginx.tar nginx:1.0

#### 2.11) 解压一个镜像tar包
```
docker load < nginx.tar
```
#### <div id="id3">三) docker 查看日志信息 <a href="#back"> 回到顶部</a></div>

#### 3.1) 查看容器日志
```
docker logs -f `容器名称`
```
  我们还可以查询具体日期的日志: 比如如下命令: 
```
docker logs -f -t --since="2019-05-11" --tail=10 `容器名称`
```
```
  --since: 此参数指定了输出日志的开始日期, 即只输出指定日期之后的日志.
  -f: 查看实时日志
  -t: 查看日志产生的日期
  --tail=10: 查看最后的10条日志.
```
#### 3.2) 查看docker服务的信息
```
docker info
```
#### 3.3) 获取镜像的元信息, 详细信息
```
docker inspect `容器名称`
```
#### <div id="id4">四) docker 文件拷贝 <a href="#back"> 回到顶部</a></div>

  将容器的某个文件拷贝出来, 使用 cp 命令即可;
```
// 将当前目录的 test.md 文件拷贝到容器web的 /tmp 目录下
docker cp test.md web:/tmp

// 将web容器/tmp/test.md 文件拷贝到当前目录下
docker cp web:/tmp/test.md ./out.md
```


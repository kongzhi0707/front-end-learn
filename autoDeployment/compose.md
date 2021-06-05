### 使用 Docker-Compose 构建项目

#### 一：Docker-Compose简介

  Docker-Compose 是Docker官方的开源项目，实现对Docker容器集群的快速编排。我们项目可以使用Dockerfile文件让用户很方便的定义一个单独的应用容器，但是在日常工作中，我们偶尔会碰到需要多个容器相互配合来完成某项任务的情况。比如开发一个web应用，除了web服务容器本身，我们还需要数据库服务容器，缓存容器或负载均衡容器等等。
  如果还是按照之前使用Dockerfile的话，我们需要编写多个类似的文件，然后进行一个个手动启动，比较麻烦，而Docker-Compose且可以满足我们的需求，Docker-Compose是用于定义和运行多容器Docker应用程序的工具。通过使用 Compose，我们可以使用 YAML 文件来配置应用程序所需要的服务，然后我们使用一个命令，就可以通过 YAML 配置文件创建并且启动所有的服务操作。

  Docker-Compose可以将管理的容器分为三层，分别是工程(project), 服务(service) 以及容器(container). Docker-Compose运行目录下的所有文件(docker-compose.yml, extends文件或环境变量文件等)组成一个工程。若无特殊指定工程名即为当前目录名。一个工程当中可以包含多个服务(service)，每个服务中可以定义容器运行的镜像，参数，依赖等。并且一个服务当中可以包括多个容器实列。

  Docker-Compose的工程配置文件默认为 docker-compose.yml, 该文件是用来定义一组相关联的应用容器为一个项目(project).
  Docker-Compose项目是由Python编写，调用Docker服务提供的API来对容器进行管理，因此，只要所操作的平台支持Docker API， 就可以在其上利用Compose来进行编排管理。

  在前几篇文章中，我们安装过 Docker Desktop， 因此会默认自动安装好 docker-compose。 我们可以在命令中查看当前版本就可以看出的，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/37.jpg" />

#### 二：Docker-Compose部署项目

  我们还是以 create-react-app 为列来快速创建一个react项目，如下命令操作：
```
$ npm i create-react-app -g
$ create-react-app react-demo
$ cd react-demo
$ npm run start
```
  就可以启动我们的项目了。可以访问： http://localhost:3000/

  我们使用如下命令就可以进行打包：
```
npm run build
```
  可以看到，我们在项目的根目录下会自动生成build目录。

  我们现在需要编写一个 docker-compose.yml 文件，该文件的作用是用于创建一个docker容器，然后拉取nginx镜像文件。(注意：这里不用手动安装nginx)。
  然后我们还需要编写一个nginx.conf配置文件，我们将在80端口监听服务请求。因此项目的目录结构如下：
```
｜--- react-demo
｜ |--- build文件夹(是上面项目通过npm run build 生成后的文件夹目录)
｜ |--- docker-compose.yml
｜ |--- nginx.conf
```
  docker-compose.yml 代码如下：
```
version: '2'
services:
  # 服务名称
  nginx:
    # 镜像:版本
    image: nginx:latest
    container_name: my_nginx
    # 映射容器80端口到本地3001端口
    ports:
      - "3001:80"
    # 数据卷 映射本地文件到容器
    volumes:
      # 映射nginx.conf文件到容器的 /etc/nginx/conf.d 目录并覆盖 default.conf文件
      #- ./nginx.conf:/etc/nginx/conf.d/default.conf
      # 映射build文件夹到容器的 /usr/share/nginx/html文件夹
       - ./build:/usr/share/nginx/html
      # 覆盖容器启动后默认执行的命令。
    command: /bin/bash -c "nginx -g 'daemon off;'"
```
  nginx.conf 文件代码如下:
```
# gzip 设置
gzip on;
gzip_vary on;

gzip_comp_level 6;
gzip_buffers 16 8k;

gzip_min_length 1000;
gzip_proxied any;
gzip_disable "msie6";
gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;

server {
    listen:       80;
    server_name   localhost;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        # 其作用是按顺序检查文件是否存在，返回第一个找到的文件或文件夹(结尾加斜线表示为文件夹)，如果所有的文件或文件夹都找不到，会进行一个内部重定向到最后一个参数
        try_files  $uri /index.html;
    }
    error_page  500 502 503 504  /50x.html;
    location = /50x.html {
        root  /usr/share/nginx/html;
    }
}
```
  现在我们需要 运行如下命令，开启容器。
```
$ docker-compose up -d
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/38.jpg" />

  执行如上命令后，就会运行我们的react应用了。我们现在可以打开浏览器，访问：http://localhost:3001/ 就可以访问到我们的页面了，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/39.jpg" />

  我们现在来分析下 docker-compose.yml 代码的含义；
```
version: '2'
services:
  # 服务名称
  nginx:
    # 镜像:版本
    image: nginx:latest
    container_name: my_nginx
    # 映射容器80端口到本地3001端口
    ports:
      - "3001:80"
    # 数据卷 映射本地文件到容器
    volumes:
      # 映射nginx.conf文件到容器的 /etc/nginx/conf.d 目录并覆盖 default.conf文件
      #- ./nginx.conf:/etc/nginx/conf.d/default.conf
      # 映射build文件夹到容器的 /usr/share/nginx/html文件夹
       - ./build:/usr/share/nginx/html
      # 覆盖容器启动后默认执行的命令。
    command: /bin/bash -c "nginx -g 'daemon off;'"
```
  docker-compose.yml 一般用 version 定义开始。version 传递版本号给 Docker-Compose， 告诉它我们正在使用那个配置版本。
  services: 在该段代码中，我们可以用来设置环境的一部分服务。在如上代码中，我们设置了服务名称为 nginx的服务，该服务使用的镜像为：nginx:latest; 并且设置了一个映射的转发端口："3001:80"。也就是说 宿主机端口(运行Docker Compose的主机系统)上的3001端口上的所有请求都将重定向到运行nginx容器的80端口上。并且设置了容器名称为：my_nginx。

  volumes: 代表的含义是 数据卷，它将在主机和容器之间创建共享卷。宿主机上的 build 这个文件夹作为两者之间的共享目录，而 /usr/share/nginx/html 目录是容器内部对应的共享目录地址。这个设置会覆盖Nginx的默认目录。最后我们重启nginx服务。

#### 三：运行 Docker Compose

  如上配置了 docker-compose.yml 文件后，我们可以执行 Docker Compose 来启动环境，如下的命令将会下载一个必备的Docker镜像，为我们需要创建的nginx服务创建一个容器，并且会在后台运行。
```
$ docker-conpose up -d
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/38.jpg" />

  如上执行命令后，首先在本地查询是否有配置文件中配置的镜像文件，如果没有，就会从Docker Hub上直接下载该镜像。如上执行后就会在后台运行了，如果我们想要验证容器是否处于活动状态，我们可以运行命令：docker-compose ps; 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/40.jpg" />

  如上会显示有关正在运行的容器及状态，还有端口映射等信息；

#### 四：编排多个服务

#### 4.1) 使用Docker构建node.js项目

  我们还是使用egg.js来做演示，使用egg-init初始化项目。
```
$ mkdir egg-example && cd egg-example
$ npm init egg --type=simple
$ npm i
```
启动项目：
```
$ npm run dev
```
我们访问 http://localhost:7001 就可以看到我们的页面了。

#### 定制镜像

  在项目的根目录下新建 Dockerfile 文件来定制我们的镜像。

  Dockerfile 文件代码如下：
```
FROM node:8
LABEL tugenhua "kongzhi0707@qq.com"
COPY . .
RUN npm install
EXPOSE 7003
CMD ["npm", "start"]
```
#### 构建镜像

使用 docker build 命令进行构建
```
$ docker build -t tugenhua/test-egg8 .
```
#### 测试镜像

使用 docker run 命令启动容器，并且将本地的 4100 端口映射到容器的 7003 端口。如下命令：
```
$ docker run -d --name test-egg-app8 -p 4100:7003 tugenhua/test-egg8
```
执行完成后，我们就可以在浏览器访问 4100端口了。

#### 4.2）使用docker-compose构建

  上面我们使用容器时，需要先定义 Dockerfile 文件，然后使用 docker build， docker run 等命令操作容器。

  但是我们的系统有可能有上百个服务，每个服务可能会有多个实列，如果我们全部手动来启动关闭的话，那工作量相对来说是非常大的。因此我们这边可以通过 docker-compose 来轻松高效的来管理容器，它是一个用来定义和运行多容器Docker的应用程序工具的。

  首先我们需要在项目的根目录下创建一个 docker-compose.yml 文件。代码如下：
```
version: '3.1'
services: # 服务列表
  node: # node服务
    build: . # Dockerfile的目录，用于构建镜像
    container_name: node-server-1 # 容器名称
    ports: # 暴露的端口
      - "3000:7001"
    restart: always # 自动重启
    environment: # 设置环境变量
      - NODE_ENV=production
    command: npm run dev # 覆盖容器启动后默认执行的命令，注意：这里的执行命令就是我们的egg构建命令
```
#### 构建镜像
```
docker-compose build
```
#### 运行容器
```
docker-compose up -d
```
执行上面完成后，我们就可以通过浏览器访问 http://localhost:3000/ 就可以访问到页面了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/41.jpg" />

#### 编排多个服务

  比如我们现在需要构建一个nginx服务来请求代理到我们的node服务的话，这里我们需要构建两个服务，我们可能需要考虑如下问题：
```
1）nginx容器如何使用我们自己的nginx.conf配置文件呢？---- 我们可以通过 volumns 文件映射。
2）nginx容器和node-server容器如何进行通信问题呢？---- 使用networks和links
```
  因此我们在项目中的根目录下新增一个 nginx.conf 配置文件。配置代码如下：
```
worker_processes 1;
events {
  worker_connections 1024;
}
http {
  upstream node-server {  
    server node:3000;
  }
  server {
    listen 80;
    server_name localhost;
    location / {
      # proxy_pass http://www.baidu.com/;
      # proxy_pass http://node-server/;
      proxy_pass http://192.168.13.189:3000/;
    }
  }
}
```
#### 注意：我们在nginx配置文件中使用了反向代理，但是我们不能直接反向代理到 http://localhost:3000/ 或 http://127.0.0.1:3000/ 的。那是因为nginx运行在docker里面的，所以localhost或127.0.0.1访问的时候访问的是docker里面的容器，无法访问到宿主机里面的服务，因此如果我们想要在docker里面nginx访问到宿主机的服务的话，我们需要使用宿主机局域网的ip地址，比如上面的 192.168.13.189 就是我ip地址的。就可以转发正常。

  docker-compose.yml 配置代码如下：
```
# docker-compose.yml
version: "3"
services: # 服务
    node: # node 服务
        build: . # Dockerfile 的目录，用于构建镜像
        container_name: node-server-1 # 容器名称
        ports: # 暴露的端口
            - "3000:7001"
        restart: always # 自动重启
        environment:
            - NODE_ENV=production
        networks: # 加入网络
            - "my-network"
        command: npm run dev # 覆盖容器启动后默认执行的命令
    nginx:
        image: nginx:latest # 指定 nginx 镜像
        ports: # 将本机的 8080 端口映射到容器的80端口
            - "8080:80"      
        container_name: nginx-node
        restart: always
        volumes: # 映射nginx.conf文件到容器的 /etc/nginx/nginx.conf:ro 文件
            - "./nginx.conf:/etc/nginx/nginx.conf:ro"
        networks: 
            - "my-network"
        links: # 设置 node 服务别名，其实是设置/etc/hosts的域名解析
            - "node"
        depends_on: # 指定依赖于哪个服务
            - node
networks: # 网络
    my-network: # 网络名称
        driver: bridge
```
#### 重新构建

我们现在重新构建，运行如下代码：
```
# 删除上次构建的容器
docker-compose down
# 重新构建镜像 --force-rm 删除构建过程中的临时容器。
docker-compose build --force-rm
# 运行容器
docker-compose up -d
```
  现在我们就可以访问8080服务了，http://localhost:8080/ ， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/42.jpg" />

  按照上面的思路，我们也可以加入其他的服务，比如mongodb/mysql/redis等。可以通过 network 和 links 来进行通信。

#### Docker-Compose使用命令
```
1）创建并启动容器

docker-compose up

2) 创建并后台启动容器

docker-compose up -d

3) 查看当前compose进程

docker-compose ps

4) 启动容器 

docker-compose start

5) 关闭容器

docker-compose stop

6) 关闭并且移除容器

docker-compose down

7) 查看日志

docker-compose logs

8) 关闭并移除容器并且删除容器清除存储

docker-compose down --volumes
```

#### Docker Compose 使用的三个步骤为：
```
1) 使用 Dockerfile 文件定义应用程序的环境；
2) 使用 docker-compose.yml 文件定义构成应用程序的服务，这样它们可以在隔离环境中一起运行；
3) 最后，执行 docker-compose up 命令来创建并启动所有服务。
```

  更多各个配置项的含义，可以看<a href="https://zhuanlan.zhihu.com/p/224876594">这篇文章</a>


































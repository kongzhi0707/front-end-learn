### nodejs代码部署到阿里云服务器

  首先需要解决如下问题：
```
1）将nodejs项目上传到阿里云服务器上。
2）使用pm2运行nodejs项目。
3）使用nginx做反向代理（代理到我们node服务上来）。
```
  然后我们就访问地址就可以直接访问我们的node服务了。

#### 1. 首先在阿里云买个服务器，具体要怎么操作，可以看网上一篇文章，写的挺不错的 <a href="https://blog.csdn.net/Kevinblant/article/details/103168451">点击查看</a> 

#### 2. CentOS7利用yum安装node.js

#### 注意：
##### 1. 阿里云服务器进入系统后默认的文件夹是 /root, 个人建议先进入 /root 文件夹后，输入cd../ 回车。
##### 2. 目前使用的是mac系统

  2.1). 如果我们的服务器是全新的，我们首先要更新源：输入 yum update. <br/>
  2.2). 安装nodejs。 yum install -y nodejs <br/>
  2.3). 查看node.js 版本  node -v  node安装完成后，npm也自动安装好了，可以使用命令 npm -v 查看。 <br/>

#### 3. CentOS7 安装Nginx-1.16.1

#### 注意：登录ssh服务器后，建议进入root文件夹下安装。

  3.1) 安装相关依赖包如下命令：
```
yum -y install gcc gcc-c++ automake pcre pcre-devel zlib zlib-devel openssl openssl-devel
```
  3.2）下载安装包
```
wget http://nginx.org/download/nginx-1.16.1.tar.gz
```
  3.3）创建nginx用户
```
useradd nginx
```
  3.4）解压
```
tar zxvf nginx-1.16.1.tar.gz
```
  3.5）编译
```
cd nginx-1.16.1
./configure
```
  3.6）安装
```
make & make install
```
  3.7) 查看端口状态
```
netstat -ano|grep 80
```
  3.8）启动nginx
```
sudo /usr/local/nginx/sbin/nginx
```
#### 4. 上传nodejs项目

  我在我们服务器/usr/local/ 下新建了一个文件夹 nodejs，用来存放所有的node项目。因此我们近入 /usr/local/nodejs 下，把我们的整个项目放在该目录下即可了。

#### 5. 安装pm2并且启动nodejs项目

  5.1) 使用npm全局安装pm2  npm install -g pm2 后回车。<br/>
  5.2) 进入 /usr/local/nodejs/project下 （project是我们的项目名称）, 进入项目的根目录后，我们有一个deploy.js 是node启动文件。我们在
/usr/local/nodejs/project下 执行 pm2 start deploy.js 回车就可以启动了我们node服务了。<br/>
  5.3）检查nodejs项目是否启动了：输出 pm2 list 回车。如果出现了如下显示，说明我们的nodejs项目已经启动了服务了。<br/>

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/50.jpg" /> <br />

#### 6. 配置nginx反向代理

  我们进入nginx配置文件目录下，cd /usr/local/nginx/conf 文件夹后，输入 vim nginx.conf, 把配置文件改成如下：
```
server {
  listen      *:80;
  server_name  localhost;
  #charset koi8-r;
  #access_log logs/host.access.log main;
  location / {
    root   /usr/local/nginx/html/web;
    #autoindex on;
    index  index.html index.htm;
  }
  location /deploy {
    proxy_pass http://127.0.0.1:7777;
  }
}
```
  如上简单的配置，配置完成后，按ctrl + c 退出编辑，然后按 :wq 退出保存，重启nginx服务即可生效(sudo /usr/local/nginx/sbin/nginx -s reload 重启即可)。

  如上的含义是：当我们访问 http://xx.xx.xx.xx 这个服务器的时候，就会访问到我们的 /usr/local/nginx/html/web/index.html 页面。当我们访问http://xx.xx.xx.xx/deploy 地址的时候，就会反向代理到我们本地node服务的  http://127.0.0.1:7777。(切记该node服务是已经上传到我们的ssh服务器上的)。





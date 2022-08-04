
### 前端学习常用的nginx配置

<div id="back"></div>

- [一) nginx安装, 启动](#id1) <br />
  - 1.1) 在阿里云服务器上安装nginx <br />
  - 1.2) 下载安装包 <br />
  - 1.3) 创建nginx用户 <br />
  - 1.4) 解压 <br />
  - 1.5) 编译 <br />
  - 1.6) 安装 <br />
  - 1.7) 查看端口状态 <br />
  - 1.8) 启动nginx <br />
  - 1.9) 查看服务状态 <br />
  - 1.10) 启动服务器/重启服务器命令 <br />
- [二) nginx文件介绍](#id2) <br />
- [三) nginx配置文件介绍](#id3) <br />
- [四) 关于location匹配](#id4) <br />
  - 4.1) = 表示精确匹配<br />
  - 4.2) ~ 表示区分大小写的正则匹配 <br />
  - 4.3) ~* 表示不区分大小写的正则匹配 <br />
  - 4.4) ^~ 表示 uri 以某个字符串开头 <br />
  - 4.5) / 表示通用匹配 <br />

- [五) root 与 alias 的区别](#id5) <br />
  - 5.1). root 实列 <br />
  - 5.2) alias 实列 <br />
  - 5.3）server 中的root 和 location 中的root 的区别 <br />

- [六) nginx history模式/反向代理/跨域/缓存 及 负载均衡 等](#id6) <br />
  - 6.1) history模式 <br />
  - 6.2) 反向代理 <br />
  - 6.3) 解决跨域 <br />
  - 6.4) 缓存 <br />
  - 6.5) 负载均衡 <br />
  - 6.6) nginx 防盗链 <br />
  - 6.7) nginx 的gzip压缩 <br />
  - 6.8) nginx的重定向 Rewrite指令 <br />
  - 6.9) 适配PC和移动端环境 <br />
  - 6.10) 合并请求 <br />
  - 6.11) 限制只能通过谷歌浏览器访问 <br />
  - 6.12) 快速实现简单的访问限制 <br />

#### <div id="id1">一) nginx安装, 启动 <a href="#back"> 回到顶部</a></div>

#### 1.1) 在阿里云服务器上安装nginx如下:

  在安装Nginx之前，我们需要安装一些依赖的库，
```
yum -y install gcc gcc-c++ automake pcre pcre-devel zlib zlib-devel openssl openssl-devel
```
#### 1.2) 下载安装包
```
wget http://nginx.org/download/nginx-1.16.1.tar.gz
```
#### 1.3) 创建nginx用户
```
useradd nginx
```
#### 1.4) 解压
```
tar zxvf nginx-1.16.1.tar.gz
```
#### 1.5) 编译
```
$ cd nginx-1.16.1
$ ./configure
```
#### 1.6) 安装
```
make & make install
```
#### 1.7) 查看端口状态
```
netstat -ano|grep 80
```
  查找安装路径使用命令：
```
whereis nginx
```
#### 1.8) 启动nginx
```
sudo /usr/local/nginx/sbin/nginx
```
#### 1.9) 查看服务状态
```
ps -ef | grep nginx
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/8.png" /> <br />

  停止服务：
```
kill 29846
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/9.png" />

  我们再在浏览器下访问 http://47.94.155.8/ 访问不到了，因为服务已经被停止了。我们可以继续使用如下命令进行重启了；如下所示：
```
sudo /usr/local/nginx/sbin/nginx
```
#### 1.10) 启动服务器/重启服务器命令
```
启动服务器: sudo /usr/local/nginx/sbin/nginx
重启服务器: sudo /usr/local/nginx/sbin/nginx -s reload
```
#### <div id="id2">二) nginx文件介绍 <a href="#back"> 回到顶部</a></div>

  nginx 我们最常用到的文件 就是 nginx的配置文件.

  先安装 tree; 如下命令:
```
$ sudo yum install -y tree
```
  然后使用 tree /usr/local/nginx 查看nginx的目录如下:
```
[root@iZ2zeds62pwbss0ax04ja6Z ~]# tree /usr/local/nginx
/usr/local/nginx
├── client_body_temp
├── conf                             # Nginx所有配置文件的目录
│   ├── fastcgi.conf                 # fastcgi 相关参数的配置文件
│   ├── fastcgi.conf.default         # fastcgi.conf 的原始备份文件
│   ├── fastcgi_params               # fastcgi的参数文件
│   ├── fastcgi_params.default
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types                   # 媒体类型
│   ├── mime.types.default
│   ├── nginx.conf                   # Nginx主配置文件
│   ├── scgi_params                  # scgi 相关的参数文件
│   ├── scgi_params.default
│   ├── uwsgi_params                 # uwsgi 相关参数文件
│   ├── uwsgi_params.default
│   └── win-utf
├── fastcgi_temp                     # fastcgi 临时数据目录
├── html                             # Nginx默认站点目录
│   ├── 50x.html                     # 错误显示的页面, 比如500或502这些会显示该页面
│   └── index.html                   # 默认的首页文件
├── logs                             # Nginx日志目录
│   ├── access.log                   # 访问日志文件
│   ├── error.log                    # 错误日志文件
│   └── nginx.pid                    # pid文件, Nginx进程启动后, 会把所有进程的ID号写到此文件
├── proxy_temp                       # 临时目录
├── sbin                             # Nginx命令目录
│   └── nginx                        # Nginx的启动命令
├── scgi_temp                        # scgi的临时目录
└── uwsgi_temp                       # uwsgi的临时目录
```
#### <div id="id3">三) nginx配置文件介绍 <a href="#back"> 回到顶部</a></div>

  /usr/local/nginx/conf: nginx所有配置文件目录   
  /usr/local/nginx/conf/nginx.conf: 这个是Nginx的核心配置文件，这个文件非常重要，也是我们即将要学习的重点   
```
[root@iZ2zeds62pwbss0ax04ja6Z ~]# cd /usr/local/nginx/conf
[root@iZ2zeds62pwbss0ax04ja6Z conf]# ls
fastcgi.conf          fastcgi_params          koi-utf  mime.types          nginx.conf   scgi_params.default  uwsgi_params.default
fastcgi.conf.default  fastcgi_params.default  koi-win  mime.types.default  scgi_params  uwsgi_params         win-utf
[root@iZ2zeds62pwbss0ax04ja6Z conf]# cat nginx.conf

worker_processes  1;                             # worker 进程的数量
events {                                         # 事件区块的开始
  worker_connections  1024;                      # 每个worker进程支持的最大链接数
}                                                # 事件区块结束
http {                                           # HTTP区块开始
  include       mime.types;                      # Nginx支持的媒体类型库文件
  default_type  application/octet-stream;        # 默认的媒体类型
  sendfile        on;                            # 开启高效传输模式
  keepalive_timeout  65;                         # 链接超时
  server {                                       # 第一个Server区块开始,表示一个独立的虚拟主机站点
    listen       80;                             # 提供服务的端口, 默认是80
    server_name  localhost;                      # 服务域名的主机名 localhost
    root         /usr/share/nginx/html;          # 站点的默认根目录为 /usr/share/nginx/html
    location / {                                 # 第一个location区块开始
      root   /home/www/react-test;               # 站点的根目录, 相当于Nginx的安装目录
      index  index.html index.htm;               # 默认的首页文件, 多个用空格分开
    }                                            # 第一个location区块结束
    error_page   500 502 503 504  /50x.html;     # 错误页面, 当状态码返回500,502, 503, 504 的时候, 使用 50x.html页面显示
    location = /50x.html {                       # location区块开始,访问 50x.html
      root   html;                               # 指定对应的站点目录为html.
    }   
  }
}
```
  nginx.conf 相当于是入口文件. nginx 启动后会先从 nginx.conf 里面读取基础的配置信息.

#### <div id="id4">四) 关于location匹配 <a href="#back"> 回到顶部</a></div>

  下面我们列举个列子:
```
http {
  server {
    listen 80;
    server_name www.taobao.com;
    location / {
      root   /home/www/react-test/; 
      index  index.html;
    }
  }
}
```
  当我们访问 www.taobao.com 的 80 端口的时候, 返回 /home/www/react-test/index.html 文件.

  我们来看下 Location 的具体语法:
```
location [ = | ~ | ~* | ^~ ] uri { ... }
```
#### 4.1) = 表示精确匹配, 比如:
```
location = /test {
  root   /home/www/react-test/; 
  index  index.html;
}
```
  /test: 可以精确匹配的到
  /test/: 不能匹配到
  /test2: 不能匹配到
  /test/1: 不能匹配到

#### 4.2) ~ 表示区分大小写的正则匹配. 比如如下:
```
location = ~ ^/test$ {
  root   /home/www/react-test/; 
  index  index.html;
}
```
  匹配以 /test 开始和结束的, 并且区分大小写.

  /test: 可以匹配到
  /Test: 不能匹配到
  /test/: 不能匹配到
  /test2: 不能匹配到

#### 4.3) ~* 表示不区分大小写的正则匹配
```
location = ~* ^/test$ {
  root   /home/www/react-test/; 
  index  index.html;
}
```
  /test: 可以匹配的到
  /Test: 可以匹配的到
  /test/: 不能匹配的到
  /test2: 不能匹配的到

#### 4.4) ^~ 表示 uri 以某个字符串开头
```
location = ^~ /test/ {
  root   /home/www/react-test/; 
  index  index.html;
}
```
  /test/1 可以匹配的到.

#### 4.5) / 表示通用匹配
```
location / {
  root   /home/www/react-test/; 
  index  index.html;
}
```
  /index.html 可以匹配的到

  如果是如下配置的话:
```
location /test {
  root   /home/www/react-test/; 
  index  index.html;
}
```
  只要匹配到 /test 到就匹配成功. 如下:

  /test: 可以匹配的到.
  /test2: 可以匹配的到
  /test/: 可以匹配的到.
  /xxx: 不能匹配的到.

#### 匹配顺序

  当存在 多个 location 的时候, 匹配顺序如下:

  1) 检查使用前缀字符串的 locations, 在使用前缀字符串的locations中选择最长匹配的, 并将结果进行存储.
  2) 如果符合带有 = 修饰符的 URI, 则立刻停止匹配.
  3) 如果符合带有 ^~ 修饰符的URI, 则也立刻停止匹配.
  4) 按照定义文件的顺序, 检查正则表达式, 匹配到就停止.

  优先匹配顺序: 先 = 修饰符最高, ^~ 次之, 再者就是正则(正则表达式按照定义的顺序优先级, 那个定义在前面就匹配成功), 最后就是前缀字符串匹配. 那如果有多个字符串匹配的话, 按照匹配字符串的长度来确定. 那个匹配字符串更多的话, 就匹配那个.

  比如demo如下:
1) 
```
server {
  location /abc {
    root   /home/www/react-test/; 
    index  index.html;
  }
  location /abcd {
    root   /home/www/react-test/; 
    index  index.html;
  }
}
```
  当我们的请求是 /abcde 的话, 那么就使用 /abcd 的配置, 因为字符串匹配是按照长度来确定优先级的, 那个匹配到更多的长度的话, 就选择哪一个匹配.
2) 
```
server {
  location ^~ /abc {
    root   /home/www/react-test/; 
    index  index.html;
  }
  location ~ ^/abcd {
    root   /home/www/react-test/; 
    index  index.html;
  }
}
```

  当我们的请求是 /abcde 的话, 那么就使用 /abc的配置, 虽然 ~ ^/abcd 也能匹配的到, 但是 ^~ 优先级更高.
3) 
```
server {
  location /abc {
    root   /home/www/react-test/; 
    index  index.html;
  }
  location ~ ^/abcd {
    root   /home/www/react-test/; 
    index  index.html;
  }
}
```
  当我们请求 /abcde 的时候, 那么就使用 ~ ^/abcd, 虽然 /abc 也能匹配的到, 但是正则优先级更高.

#### <div id="id5">五) root 与 alias 的区别 <a href="#back"> 回到顶部</a></div>

  nginx 指定文件路径有两种方式: root 和 alias, 主要区别在于 nginx 如何解释 location 后面的uri, 会使两者分别以不同的方式将请求映射到服务器文件上.

#### 1. root 实列
```
location ^~ /t/ {
  root /www/root/html/;
}
```
  当我们的请求 url 是 /t/a.html 时候, web服务器将会返回服务器上的 /www/root/html/t/a.html 的文件. (root 会拼接location后面配置的路径).

#### 2. alias 实列
```
location ^~ /t/ {
  alias /www/root/html/;
}
```
  当我们的请求 url 是 /t/a.html 时候, web服务器将会返回服务器上的 /wwww/root/html/a.html 的文件. (alias 不会拼接location后面配置的路径, 会把它丢弃掉, 把当前匹配到的目录指向到指定的目录).

#### 注意:
  1) 使用alias时, 目录名后面一定要加 "/".
  2) alias 只能位于location块中. (root可以不放在location中).

#### server 中的root 和 location 中的root 的区别

  server 和 location 中都可以使用root, 如下demo:
```
http {
  server {
    listen 80;
    server_name www.taobao.com;
    root  /usr/share/nginx/html; 
    location / {
      root   /home/www/react-test/; 
      index  index.html;
    }
  }
}
```
  如上, 如果两者同时出现, 他们的优先级是就近原则, 如果 location 中能匹配的到, 就使用 location 中的 root 配置, 忽略 server 中的root, 当 location 中
  里面没有 root 的配置的话, 就使用 server 中的root 配置.

#### <div id="id6">六) nginx history模式/反向代理/跨域/缓存 及 负载均衡 等 <a href="#back"> 回到顶部</a></div>

#### 6.1) history模式

  浏览器下的单页面应用的路由模式有两种: hash模式 和 history 模式. hash模式通用性好,而且不依赖服务器的配置, 但是缺点是不够优雅. history模式则更加美观.

  但是history模式同样会有一个问题, 当我们刷新页面的时候, 如果匹配不到合适的路由, 页面就会出现404的错误, 因此我们需要额外的服务器端配置. 对于找不到的url,可以将首页html返回.

  比如我们的nginx配置如下:
```
http {
  server {
    listen 80;
    server_name www.example.com;
    root  /usr/share/nginx/html; 
    location / {
      root   /home/www/react-test/; 
      index  index.html;
    }
  }
}
```
  当我们访问 http://www.example.com/post 的时候, 然后我们在 /post 路由下刷新页面, 那么 nginx 会返回404, 这是什么原因呢? 因为我们没有告诉nginx找不到某个文件时该怎么做. root 指定了 / 对应的单页静态资源目录, 从而使url映射到 /home/www/react-test/ 目录下.但是我们的 react-test/文件夹下面并没有post这个文件或文件夹, 所以nginx 会给我们显示404页面. try_files 就是解决这个问题的. try_files 基本语法如下:
```
location / {
  root   /home/www/react-test/; 
  index  index.html;
  try_files $uri $uri/ /index.html;
}
```
  try_files 的含义是: 试着去访问一下当前浏览器所请求的页面.
  $uri: 当前请求的路径, 如果找到就返回
  $uri/: 把当前请求的路径当成一个目录去找下面的文件, 如果找到了就返回.
  /index.html: 如果上面两个都没有找到, 就直接返回 index.html.

  因此当我们访问 http://www.example.com/post 时候, $uri 会匹配到 /post, nginx 发现 react-test/ 目录下没有post这个文件, 也没有post这个文件夹, 所以最后返回 react-test/ 目录下的 index.html文件. 因此 index.html 被浏览器加载之后, 前端路由就会工作, 将用户需要的资源加载出来, 因此 前端build下的资源css/js文件, 可以被nginx正确的找到, 因此不会404页面. 可以正确的现实 /post 路由下的页面.

#### 6.2) 反向代理

  在理解什么是反向代理之前, 我们来理解下什么是正向代理? 正向代理, "它代理的是客户端", 是一个位于客户端和原始服务器之间的服务器, 为了从原始服务器取得内容,客户端向代理发送一个请求并指定原始服务器, 然后代理向原始服务器转交请求并将获得的内容返回给客户端.

  其实我们平时使用的翻墙工具就是一个正向代理工具.它会把我们访问墙外服务器server的网页请求,代理到一个可以访问该网站的代理服务器proxy, 这个代理服务器proxy把墙外服务器server上的网页内容获取, 再转发给客户端.

  反向代理: 是指以代理服务器接收Internet上的链接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给Internet上请求连接的客户端。

#### 理解proxy_pass指令

  该指令是用来设置代理服务器的地址，可以是主机名称，IP地址加端口号等形式. 基本配置代码如下:
```
server {
  listen 80;
  server_name xy.xxx.com; // 接口的域名
  location / {
    proxy_pass http://192.168.1.212:8136;
  }
  error_page   500 502 503 504  /502.html;
  location = /50x.html {
    root   html;
  }
}
```
  如上代码的含义是: 当我们访问 http://xy.xxx.com/xxx 接口的时候, 它会通过反向代理到 http://192.168.1.212:8136 服务器上来.

#### 注意: 我们本地host需要绑定下 192.168.1.212 xy.xxx.com

#### 6.3) 解决跨域

  跨域对于我们前端来说经常会碰到, 跨域的解决方法也有很多中, 比如使用 CORS, 或 nginx 反向代理来解决跨域, 在 Nginx 的配置文件中进行如下配置即可:

  问题是：前端项目域名是 a.xxxx.com, 后端的接口域名是 b.xxx.com，然后后端接口没有设置跨域相关的响应设置头，因此就接口和我们
  域名就会存在跨域的情况，因此我们可以使用 nginx服务器来配置一下；

  网上很多资料将 在nginx配置下 加如下代码就可以解决跨域的问题；
```
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Credentials true;
add_header Access-Control-Allow-Methods GET,POST;
```
  即在nginx如下配置:
```
server {
  listen 80;
  server_name b.xxx.com;
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Credentials true;
  add_header Access-Control-Allow-Methods GET,POST;
  location / {
    proxy_pass http://192.168.1.212:8136;
  }
  error_page   500 502 503 504  /502.html;
  location = /50x.html {
    root   html;
  }
}
```
  但是还是会存在跨域的情况，因此我们需要指定 对应的域名就可以解决上面的跨域问题了。
```
add_header Access-Control-Allow-Origin http://a.xxx.com; 
```
  因此我们的nginx配置如下:
```
server {
  listen 80;
  server_name b.xxx.com;
  add_header Access-Control-Allow-Origin http://a.xxx.com;
  add_header Access-Control-Allow-Credentials true;
  add_header Access-Control-Allow-Methods GET,POST;
  location / {
    proxy_pass http://192.168.1.212:8136;
  }
  error_page   500 502 503 504  /502.html;
  location = /50x.html {
    root   html;
  }
}
```
#### 6.4) 缓存
```
location ~* \.(?:css(\.map)?|js(\.map)?|gif|svg|jfif|ico|cur|heic|webp|tiff?|mp3|m4a|aac|ogg|midi?|wav|mp4|mov|webm|mpe?g|avi|ogv|flv|wmv)$ {
  # 静态资源设置七天强缓存
  expires 7d;
  access_log off;
}
```
  可以如上配置, 设置缓存, nginx缓存更多配置, 可以看我之前的 <a href="https://www.cnblogs.com/tugenhua0707/p/10841267.html">文章</a>

#### 6.5) 负载均衡

  当我们的网站需要解决高并发, 海量数据的时候, 就需要使用到负载均衡来调度服务器, 将请求合理的分发到应用服务器集群中的一台服务器上.

  那么负载均衡也有如下几种:

#### 1) 默认轮询

  每个请求按时间顺序逐一分配到不同的后端服务器上, 如果后端某个服务器宕机了, 能自动剔除故障服务器.
```
# constPolling 作为存放负载均衡的变量
upstream constPolling {
  server localhost:10001; 
  server localhost:10002;
}
server {
  listen 80;
  server_name localhost;
  location / {
    proxy_pass http://constPolling; # 在代理的时候接入constPolling
  }
}
```
#### 2) 加权轮询

  通过设置 weight, 值越大分配率越大, 到的访问率就越高, 主要用于后端每台服务器性能不均衡的情况下. 其次是为在主从的情况下设置不同的权值, 达到合理有效的利用主机资源.
```
# constPolling 作为存放负载均衡的变量
upstream constPolling {
  server localhost:10001 weight=1; 
  server localhost:10002 weight=2;
}
server {
  listen 80;
  server_name localhost;
  location / {
    proxy_pass http://constPolling; # 在代理的时候接入constPolling
  }
}
```
  权重越大, 被访问的概率越大, 比如上面 weight=1 就是33.33% 和 weight=2 百分66.66%的访问概率 访问的效果.

#### 6.6) nginx 防盗链
nginx 防盗链相关的, 可以看我之前 <a href="https://www.cnblogs.com/tugenhua0707/p/10798762.html#_labe3">这篇文章</a>,

#### 6.7) nginx 的gzip压缩
nginx 的gzip压缩, 可以看我之前 <a href="https://www.cnblogs.com/tugenhua0707/p/10841267.html#_labe1">这篇文章</a>.

#### 6.8) nginx的重定向 Rewrite指令

nginx的重定向 Rewrite指令, 可以看我之前 <a href="https://www.cnblogs.com/tugenhua0707/p/10798762.html#_labe1">这篇文章</a> 

#### 6.9) 适配PC和移动端环境

  现在很多网站都存在PC站和H5站两个站点，因此根据用户的浏览环境自动切换站点是很常见的需求。Nginx可以通过内置变量$http_user_agent，获取到请求客户端的userAgent，从而知道用户处于移动端还是PC，进而控制重定向到H5站还是PC站。

  nginx 配置如下:
```
location / {
  # 移动、pc设备适配
  if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
    set $mobile_request '1';
  }
  if ($mobile_request = '1') {
    rewrite ^.+ http://mysite-base-H5.com;
  }
}
```
#### 6.10) 合并请求

  前端性能优化中重要一点就是尽量减少http资源请求的数量。通过nginx-http-concat模块（淘宝开发的第三方模块，需要单独安装）用一种特殊的请求url规则（例子：example.com/??1.js,2.js,3.js ），前端可以将多个资源的请求合并成一个请求，后台Nginx会获取各个资源并拼接成一个结果进行返回。例如上面的例子通过一个请求将1.js,2.js,3js三个js资源合并成一个请求，减少了浏览器开销。

Nginx 配置如下:
```
# js资源http-concat
# nginx-http-concat模块的参数远不止下面三个，剩下的请查阅文档
location /static/js/ {
  concat on; # 是否打开资源合并开关
  concat_types application/javascript; # 允许合并的资源类型
  concat_unique off; # 是否允许合并不同类型的资源
  concat_max_files 5; # 允许合并的最大资源数目
}
```
#### 6.11) 限制只能通过谷歌浏览器访问
```
server {
  listen 80;
  server_name localhost;
  # 限制除了谷歌浏览器, 都返回500 
  if ($http_user_agent !~ Chrome) {
    return 500;
  }
  location / {
    root   /home/www/react-test/;
    index index.html index.htm;
  }
}
```
#### 6.12) 快速实现简单的访问限制

  经常会遇到希望网站让某些特定用户的群体（比如只让公司内网）访问，或者控制某个uri不让人访问。Nginx配置如下：
```
location / {
  deny  192.168.1.100;
  allow 192.168.1.10/200;
  allow 10.110.50.16;
  deny  all;
}
```
  其实deny和allow是ngx_http_access_module模块（已内置）中的语法。采用的是从上到下匹配方式，匹配到就跳出不再继续匹配。上述配置的意思就是，首先禁止192.168.1.100访问，然后允许192.168.1.10-200 ip段内的访问（排除192.168.1.100），同时允许10.110.50.16这个单独ip的访问，剩下未匹配到的全部禁止访问。实际生产中，经常和ngx_http_geo_module模块（可以更好地管理ip地址表，已内置）配合使用。






























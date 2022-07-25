
### shell脚本实现前端自动部署

  前端部署服务器，之前需要打包，迁移，部署操作，如果每次手动操作，容易出错并且浪费时间，今天我们可以使用shell脚本自动化。

#### 一：构建前端项目

#### 1) 使用 create-react-app 创建项目

  我们以react项目为列，使用 create-react-app 快速创建一个react项目，如下命令安装：
```
$ sudo npm i create-react-app -g
$ create-react-app shell-auto-demo
$ cd shell-auto-demo
$ yarn install
```
#### 2）修改项目文件 package.json

  安装依赖 cross-env, 执行如下命令：
```
sudo npm install -g cross-env
```
该包是使用环境变量脚本 和 跨平台设置的。然后修改 scripts 打包配置如下：
```
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "build:pre": "cross-env REACT_APP_BUILD_ENV=development react-scripts build",
  "build:prod": "cross-env REACT_APP_BUILD_ENV=production react-scripts build"
},
```
  如上，""build:pre" 和 "build:prod" 是添加的。在项目中我们可以通过 process.env.REACT_APP_BUILD_ENV 可以获取当前项目的打包环境。执行命令:
  yarn build:pre 是打包测试环境，执行 yarn build:prod 是打包生产环境。

#### 编写shell脚本打包

  在项目的根目录下 新建 scripts/publish.sh, scripts 为文件夹，后面还有其他的脚本文件。添加如下脚本：
```
#!/usr/bin/env bash
function build() {
  echo $1;
  # 执行打包命令
  yarn build:$1
  # 上传本地的build包到服务器指定的目录
  scp -r ./build/* root@47.94.155.8:/home/www/react-test/
}

if [ $1 == "pre" ]; then
  build $1
elif [ $1 == "prod" ]; then
  build $1
else 
  echo "shell脚本命令错误"
fi
```
  修改 package.json, 增加发布命令"publish:pre" 和 "publish:prod"; scripts 打包脚本命令如下：
```
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "build:pre": "cross-env REACT_APP_BUILD_ENV=development react-scripts build",
  "build:prod": "cross-env REACT_APP_BUILD_ENV=production react-scripts build",
  "publish:pre": "sh scripts/publish.sh pre",
  "publish:prod": "sh scripts/publish.sh prod"
},
```
#### 配置nginx，及 执行脚本

  1）nginx 配置

  登录服务器，ssh root@47.94.155.8, 然后输入密码，即可登录，也可以自己设置免密码登录。
```
# 进入配置文件目录
cd /usr/local/nginx/conf

# 修改配置文件内容
vim nginx.conf
```
```
server {
  listen       80 default_server;
  listen       [::]:80 default_server;
  server_name  _;
  #include      /etc/nginx/default.d/x.conf;
  #access_log  logs/host.access.log  main;
  location / {
    root   /home/www/react-test;
    index  index.html index.htm;
  }
  #error_page  404              /404.html;
  # redirect server error pages to the static page /50x.html
  #
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   html;
  }
}
```
  保存退出 (:wq)后， 重新启动下服务器就会生效了：
```
sudo /usr/local/nginx/sbin/nginx -s reload
```
  2）执行脚本发布

  执行 yarn publish:pre, 输入服务器密码，即可运行 publish.sh 脚本命令，将前端资源文件迁移到服务器上去。
  登录服务器后，查看前端资源如下：
```
[root@iZ2zeds62pwbss0ax04ja6Z conf]# cd /home/www/react-test
[root@iZ2zeds62pwbss0ax04ja6Z react-test]# ls
asset-manifest.json  favicon.ico  index.html  logo192.png  logo512.png  manifest.json  robots.txt  static
```
  现在我们访问 http://47.94.155.8/ 就可以访问的到我们的页面了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/59.png" /> <br />












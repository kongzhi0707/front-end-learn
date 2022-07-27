
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

#### ssh 认证

  如上，我们每次 执行 npm run publish:pre 后，都要输入密码，也是比较烦的，因此我们希望不需要输入密码。

  首先我们需要在自己的电脑上 创建密钥对，执行如下命令：
```
ssh-keygen -t rsa
```
  然后根据个人情况按需修改密钥对的文件名，输入密码时回车即可，代表不需要使用密码：如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/60.png" /> <br />

#### 2) 把公钥传输到服务器上

  我们可以使用命令 cd ~/.ssh ，然后 使用 ls 命令，可以看到 id_rsa.pub 文件，需要把该文件上传到服务器中的 /.ssh/authorized_keys文件中即可。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/61.png" /> <br />

#### 如果没有 .ssh文件夹 和 authorized_keys文件，我们可以手动创建。

如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/62.png" /> <br />

  如上，我们在 服务器中的 /home 目录下 刚刚新建了 .ssh目录，然后再 .ssh目录下新建authorized_keys，现在我们需要把 id_rsa.pub 文件上传到该文件夹内即可。

  执行命令如下：
```
scp ~/.ssh/id_rsa.pub root@47.94.155.8:/home/.ssh/authorized_keys
```
  输入密码后，即可上传文件；如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/63.png" /> <br />

#### 3) 修改我们的脚本

  然后我们再修改部署脚本，改用 ssh 认证方式向 linux 服务器传输文件。

  我们的 publish.sh 代码改为如下：scp 中添加了 -i ~/.ssh/id_rsa
```
#!/usr/bin/env bash
function build() {
  echo $1;
  # 执行打包命令
  yarn build:$1
  # 上传本地的包到服务器指定的目录
  scp -i ~/.ssh/id_rsa -r ./build/* root@47.94.155.8:/home/www/react-test/
}

if [ $1 == "pre" ]; then
  build $1
elif [ $1 == "prod" ]; then
  build $1
else 
  echo "shell脚本命令错误"
fi
```
  scp 的 -i 参数指定传输时使用的密钥文件，这样就可以通过ssh安全访问了，我们不用每次输入密码了。 -r参数则是recursive，代表递归复制整个目录。

#### 注意，如果 publish.sh 文件的执行权限不够，我们在命令行中先给改文件 设置执行权限，使用命令: chmod 777 publish.sh; 运行一次即可。

#### 基本原理：执行命令：ssh-keygen -t rsa 本地会生成公钥和私钥，然后把公钥上传到服务器上，然后我们上传文件的时候，把我们电脑上的私钥上传上去，然后服务区可能公钥和私钥进行解密操作，如果解密成功，说明是正确的，所以就不需要输入密码了。

#### 去掉ssh密码 (假如如果有的话)

如果我们电脑上本身有设置了密码的话，我们可以如下操作去掉密码：
```
1、在终端下输入ssh-keygen -p

ssh-keygen -p
Enter file in which the key is (/Users/username/.ssh/id_rsa):

2、系统会提示选择需要修改的私钥，可以直接回车，默认是/Users/username/.ssh/id_rsa

3、选好文件后按回车，会提示你输入旧密码：

Enter old passphrase:

4. 输入好后会提示输入新密码：

Enter new passphrase (empty for no passphrase):

5. 如果直接回车，会提示确认新密码，再直接回车，此时以前设置的私钥密码就被清除了：

Enter same passphrase again:
```

在 publish.sh 脚本中，我们判断了，如果是 pre 环境的话， 执行 build 函数上传代码，如果是 prod(线上的话)，我们也执行 build 函数上传代码，但是如果
测试环境 和 线上 环境的文件目录不一样的话，其实我们可以多加一个函数，比如线上的话， 执行 和 build 函数一样的命令，无非就是 上传目录不一样而已。

#### 打tag并上传Git仓库

当我们每次把项目部署到线上的时候，我们希望编写一个shell命令，实现自动打tag，打tag的目的可以防止代码回滚操作。每次发布上线后打一个tag，当本次发布到上线后，假如代码不正常的话，我们可以回滚到上一个tag代码里面即可。因此打tag也是非常重要的。

我们首先在 scripts/ 目录下 新建 tag.sh 文件，目的是为了运行命令就可以自动打tag。shell 代码如下：
```
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e
# 判断tag是否为空
if [ $# -eq 0 ];
then
  echo 'please input tag name!'
  exit
fi
# 校验tag格式是否正确
TAGPATTERN="^v[1-9]\.[0-9]\.[0-9]$"
if [[ "$1"=~$TAGPATTERN ]]; then :
else
echo "tag format is invalid!"
exit
fi
# 判断build目录是否存在
if [ ! -d "build" ]; then
echo 'build folder cannot found!'
exit
fi

# 创建tag并上传远程Git仓库
git tag $1
git push -f origin $1
```
如上脚本内容做了如下判断：
```
1）tag名称不能为空。
2）tag名称使用正则匹配了 vx.x.x格式，比如 v1.0.0 版本的。
3）项目的根目录是否存在 build 目录。
```
2）package.json 文件的scripts中添加 tag 命令如下：
```
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "build:pre": "cross-env REACT_APP_BUILD_ENV=development react-scripts build",
  "build:prod": "cross-env REACT_APP_BUILD_ENV=production react-scripts build",
  "publish:pre": "sh scripts/publish.sh pre",
  "publish:prod": "sh scripts/publish.sh prod",
  "tag": "sh scripts/tag.sh"
},
```
3) 执行 npm run tag v1.0.0, 创建了名为 v1.0.0 的tag了。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/64.png" /> <br />

然后我们继续查看 我们项目的tag，可以看到已经打上去了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/images/65.png" /> <br />

#### <a href="https://github.com/kongzhi0707/shell-auto-demo">查看github 上的测试demo</a>

### Git实现前端的CI/CD

  我们想把我们前端代码部署到服务器上，我们可以使用 源码部署，源码部署 就是 把 源文件上传到服务器上，然后 执行如下命令：
```
$ npm install && npm run build
```
  这种方式是将打包的工作交给服务器了，本地只是将源代码push上去，git监听到推送，然后自动开始构建。

#### 服务器

  首先准备一台服务器，安装好 node git nginx. 等。我这边是买了一个阿里云服务器作为测试工具。
```
  我服务器的IP: 47.94.155.8
  项目的存放目录: /home/www/react-test
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/51.jpg" /> <br />

#### 创建裸仓库

  登录服务器，在服务器下创建一个文件夹 opt，然后进入该目录创建一个裸仓库。

  什么是裸仓库？裸仓库就是没有工作目录的仓库。执行如下命令创建：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/52.jpg" /> <br />

  创建好后，如上会生成 react-test.git 文件夹。因此我们仓库的位置是 /root/opt/react-test.git.

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/53.jpg" /> <br />

  如上可以看到，在我们的裸仓库 react-test.git 文件夹下，里面又个 hook 文件夹。该文件夹的作用是存放 Git 钩子。其实Git钩子就是一个shell文件。在执行 git 操作(比如push, pull) 时会触发执行。

#### 添加钩子

  在 hook 目录下新建 post-receive 文件，该钩子文件会在代码 push 到这个裸仓库后执行。
```
[root@iZ2zeds62pwbss0ax04ja6Z react-test.git]# ls
branches  config  description  HEAD  hooks  info  objects  refs
[root@iZ2zeds62pwbss0ax04ja6Z react-test.git]# cd hooks
[root@iZ2zeds62pwbss0ax04ja6Z hooks]# vim post-receive
```
  post-receive 文件具体内容如下：
```
#!/bin/bash
echo 'server: received code push...'
cd /home/www/react-test

echo 'server: checkout latest code from git...'

git --git-dir=/root/opt/react-test.git --work-tree=/home/www/react-test checkout -f release2

echo 'server: running npm install...'

npm install \
&& echo 'server: buildding...' \
&& npm run build \
&& echo 'server: done...'
```
  如上shell命令中 git --git-dir=/root/opt/react-test.git --work-tree=/home/www/react-test checkout -f release2 这句代码的含义解释如下：

  一般我们在项目的目录下使用 git init 初始化git仓库，然后我们在项目的目录下可以执行 add , commit 操作， 项目的目录就是我们的 package.json 文件所在的目录，我们的项目代码放在这里的，git仓库时项目目录下的 .git 文件夹，它是一个隐藏的目录，在我们的 git init 时会自动生成的。

  那有没有办法在当前项目目录下，使用其他目录的git仓库呢？我们可以使用 --git-dir 参数来指定一个其他的 git 仓库。
```
# 默认加到 /home/www/react-test/.git
$ git add .
# 加到 /home/git-test/.git
$ git --git-dir /home/git-test/.git add .
```
  项目目录可以指定其他的git仓库，那么 git 仓库 可不可以指定其他的项目目录呢？ 也是可以的，可以使用 --work-tree 参数允许我们指定其他的项目目录。

  比如说，我要在 /home/www/react-test 下检出分支：
```
# 默认从 /home/www/react-test/.git 检出
$ git checkout dev-test
# 从 /home/git-test/.git 检出
$ git --work-tree /home/git-test/.git checkout dev-test
```
  如上操作，项目和仓库分开了。

  因此我们 git --git-dir=/root/opt/react-test.git --work-tree=/home/www/react-test checkout -f release2 代码的含义是：

  将 /root/opt/react-test.git 这个git仓库的 release2 分支 检出(checkout) 到项目目录下 /home/www/react-test. 因此就会更新了项目的目录代码。
  检出新代码后，运行打包命令，更新部署文件。因此最新代码就生效了。

#### nginx 配置

  打包完成后，会生成最新代码到 build 文件夹下， 因此我们需要nginx配置下。
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
  root         /usr/share/nginx/html;
  #include      /etc/nginx/default.d/x.conf;
  #access_log  logs/host.access.log  main;
  location / {
    root   /home/www/react-test/build;
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
#### 客户端

我们前面在服务器端创建好了git裸仓库 /root/opt/react-test.git. 我们现在本地代码推送到该裸仓库去即可。

#### 基本原理：我们前端本地代码推送到 远程仓库 /root/opt/react-test.git 下， 然后该远程仓库 /root/opt/react-test.git 裸库中有个hooks钩子中的post-receive shell文件会被触发执行，然后执行里面的命令，npm install 和 npm run build 后生成的文件，复制到 项目目录下 /home/www/react-test 仓库下，然后我们的nginx.conf 配置了。 当我们访问网站的时候就是访问最新的代码了。

#### 推送代码

  我们本地使用 react 脚手架生成一个项目来测试下，我们先使用 create-react-app 快速创建一个react项目，如下命令安装：
```
$ sudo npm i create-react-app -g
$ create-react-app react-test
$ cd react-test
```
1) 第一步，我们先在本地项目下 react-test 根目录下，将这个裸仓库添加为远程仓库
```
$ git remote add prod ssh://root@47.94.155.8/root/opt/react-test.git
```
2) 第二步，我们直接将代码推送到这个远程仓库
```
$ git checkout -b release2
$ git push prod release2
```
如下执行完成后， 可以看到我们控制台打印如下信息：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/54.jpg" /> <br />

当我们看到如下信息了，说明我们成功了。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/55.jpg" /> <br />

然后到我们的远程服务下，可以看到有如下文件了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/56.jpg" /> <br />

现在访问我们的网站就可以访问的到了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/57.jpg" /> <br />

#### 注意：如上我们一定要切换到 release2 分支再推送。因为在远程仓库shell命令钩子中，我们定义的是检出 release2 分支。因此我们推送的是 release2 分支。
因此我们的 CI/CD 已经完成了。

如果我们后面代码发生改变了， 我们需要把代码重新部署下， 我们只需要执行如下命令:
```
$ git add .
$ git commit -m update
$ git push prod release2
```
执行完上面的命令后， 会重新运行远程的shell命令的，会重新打包的。

比如我现在 App.js 改成如下代码：
```
function App() {
  return (
    <div className="App">
     Learn React 为什么为什么xxx哈哈哈
    </div>
  );
}

export default App;
```
然后我重新执行上面提交代码，然后会重新打包，上传，最后我们访问我们的服务器地址，结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/58.jpg" /> <br />















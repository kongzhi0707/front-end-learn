
### 使用 WebHook 来自动化部署 NodeJS 项目

  实现的目标是：我们在本地开发完成node项目后，我希望通过 执行 npm run push 命令后会自动打包推送到git仓库。服务器端能监听到 git push请求后
自动拉取最新的代码。

  要实现上面的需求，我们需要做如下事情：
```
1. 在github上对应的项目中---创建webhook。
2. 编写shell脚本实现git相关的操作。
3. nodejs 起一个服务监听请求。
4. nginx反向代理到该node服务。
```
#### 一：创建webhook

  首先我们需要把我们到nodejs项目先推送到github上去，比如我node项目地址为：https://github.com/tugenhua0707/git-node-webhook 推送完成后我们进入该项目到 settings ---> Webhooks---> Add webhook， 然后如下所示操作：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/51.jpg" /> <br />

  如果创建成功后，显示是如下所示的：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/52.jpg" /> <br />

  如上就是webhook创建完成了。

#### 二：编写shell 脚本。

  1. 编写自动打包的shell，执行 npm run push 命令后推送代码到github的shell。我们在项目的根目录下新建文件 commit-push.sh 文件，基本代码如下：
```
#!/bin/bash
# 确保脚本抛出遇到的错误
set -e 
echo "git auto push start..."

# date

dateNow=$(date +%T)

# build
npm run build

# push
git add .
git commit -m ":ok_hand: build at ${dateNow}"
git push origin master

echo "git auto push end..."
echo "build: now: ${dateNow}"
```
#### 2. 编写git push后执行的shell脚本。

  在项目的根目录下 新建 deploy.sh , 基本配置代码如下：
```
#!/bin/bash
WEB_PATH='/usr/local/nodejs/webpack+react+staging'  // node项目在ssh服务器上项目地址
WEB_USER='root'
WEB_USERGROUP='root'
 
echo "Start deployment"
cd $WEB_PATH

echo "------ 开始清理代码 防止冲突 ------"
git reset --hard origin/master
git clean -f
echo "pulling source code..."
git pull origin master

npm install   # 防止有新的包加入
npm build
echo '构建完毕'

echo "changing permissions..."
chown -R $WEB_USER:$WEB_USERGROUP $WEB_PATH
chmod -R 777 $WEB_PATH
echo "Finished."

sudo /usr/local/nginx/sbin/nginx -s reload

echo '重启服务成功'
```
#### 三：nodejs开启服务---deploy.js

  在我们项目的根目录新建 deploy.js, 该js代码的作用是 启动一个node服务，并且监听 git push 操作，当我们push代码到github上的时候，我们会使用
webhook中的去监听，然后会发送一个post请求到 http:xx.xx.218.178/webhook 服务器上去。就是我们上面在webhook配置的请求地址。但是我们需要在nginx上去监听该请求，然后使用反向代理的方式代理到我们的node本地服务上来，因此我们本地node就可以监听到push这个操作了。我们使用了 github-webhook-handler 这个库来实现。监听到push操作后，我们就执行我们上面到 deploy.sh shell脚本了。基本代码如下：
```
const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({ path: '/webhook', secret: 'kongzhi' });

var app = http.createServer(function(req, res) {
  console.log('我进来了11111123334455');
  handler(req, res, function(err) {
    res.statusCode = 404;
    res.end('no location');
  })
});
app.listen(7788, () => {
  console.log('web-hook listen on http://localhost:7788')
})

handler.on('error', function(err) {
  console.log('error', err.message);
});

handler.on('push', function(event) {
  console.log('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
  run_cmd('sh', ['./deploy.sh'], function(text) {
    console.log(text);
  })
});

// run_cmd 函数
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = '';
  child.stdout.on('data', function(buffer) {
    resp += buffer.toString();
  })
  console.log('resp', resp);
  child.stdout.on('end', function() {
    console.log('xxx------');
    callback(resp);
  });
}
```
#### 四：nginx配置

  1. 首先在我们ssh服务器上存放nodejs项目中克隆我们的git-node-webhook项目下来，比如在 /usr/local/nodejs/ 目录下是存放所有的node项目的。因此我们登录我们的ssh服务器后，进入该项目下，执行 git-node-webhook项目 克隆。执行命令如下：
```
git clone https://github.com/tugenhua0707/git-node-webhook.git
```  
  然后进入 git-node-webhook项目后，执行 npm install 把项目的包安装下。安装完成后，就变成如下的目录了，如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/53.jpg" /> <br />

  这些东西做完以后，我们需要去配置nginx了。

#### 2. 配置nginx环境

  执行命令：cd /usr/local/nginx/conf 后，使用 vim nginx.conf 命令来编辑nginx配置文件，配置如下：
```
server {
  listen      *:80;
  server_name  xx.xx.218.178; # 服务器地址/域名
  location / {
    root   /usr/local/nodejs/git-node-webhook/dist;       
    index  index.html index.htm;
  }
  location /webhook {
    proxy_pass http://127.0.0.1:7788;
  }
}
```
#### 五：使用pm2来启动nodejs

  上面所有的配置完成后，我们进入 /usr/local/nodejs/git-node-webhook 目录，运行 pm2 start deploy.js 后就启动来我们到node服务了，然后我们在本地node项目随便更改一些东西，我们在本地运行 npm run watch 命令后，就可以把我们到代码推送到github上了，然后推送完成后，我们的node服务会监听到push这个监听，然后会执行deploy.sh脚本对github代码进行拉取，拉取后会自动执行 npm run build 命令打包，打包完成后，会自动重启nginx服务器。因此我们在页面刷新下就可以看到新内容了。shell执行后如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/54.jpg" /> <br />
<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/55.jpg" /> <br />

  如上我们就打包完成了，因此我们刷新页面就可以看到效果了。如上就是整个自动化过程了。～

<a href="https://github.com/tugenhua0707/git-node-webhook">查看github代码</a>


















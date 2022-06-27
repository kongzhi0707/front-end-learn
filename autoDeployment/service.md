
### 如何将前端项目部署到阿里云服务器上

#### 1) 购买服务器

  因工作需要，代码需要测试，所以买了阿里云服务器，我直接买了个云服务器ECS，我们可以登录阿里云官网，<a href="https://ecs-buy.aliyun.com/wizard#/prepay/cn-beijing">自定义购买</a>页面, 我这边买了一个月的最便宜的，因为就是想测试 前端一键部署代码到服务器上的功能，也就是自学docker+webhook一键部署代码的功能，因此自己买了一个月的服务器。如下购买页面：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/1.png" /> <br />

  购买完成后，付完款，会自动开通了，恭喜你，你已经拥有阿里云服务器主机了。

  点击进入我的控制台 -> 云服务 -> 实例 -> 可以查看到当前服务器状态及公网的IP（该公网的IP地址就是我们服务器对外的IP地址，我们可以直接使用该IP地址访问我们的页面）。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/2.png" /> <br />

#### 2）配置安全组

  需要配置以下安全组，否则到时候使用公网IP访问的时候会出现访问不到的情况。

  安全组 -> 创建安全组  如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/3.png" /> <br />

  添加安全组：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/4.png" /> <br />

  配置完成后，必须要有80端口。如上所示；

  绑定域名相关的这边先不讲了，因为我只是前端测试，不需要域名。

#### 3）配置服务器

  现在我们可以使用远程连接到我们的阿里云服务器了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/5.png" /> <br />

  但是，如果第一次连接之前，我们需要先修改user的登录密码等操作。

  我们输入远程密码后，会进入服务器命令界面，user 默认的用户名是 root，密码是我们刚刚第一次修改的密码，登录成功后如下样子：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/6.png" /> <br />

#### 4）安装Nginx

  在安装Nginx之前，我们需要安装一些依赖的库，
```
yum -y install gcc gcc-c++ automake pcre pcre-devel zlib zlib-devel openssl openssl-devel
```
#### 4.2) 下载安装包
```
wget http://nginx.org/download/nginx-1.16.1.tar.gz
```
#### 4.3）创建nginx用户
```
useradd nginx
```
#### 4.4）解压
```
tar zxvf nginx-1.16.1.tar.gz
```
#### 4.5）编译
```
cd nginx-1.16.1
./configure
```
#### 4.6）安装
```
make & make install
```
#### 4.7）查看端口状态
```
netstat -ano|grep 80
```
#### 4.8）启动nginx
```
sudo /usr/local/nginx/sbin/nginx
```
  查找安装路径使用命令：
```
whereis nginx
```
  执行上面启动nginx命令后，我们就可以在浏览器中访问公网IP地址了，http://47.94.155.8/， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/7.png" /> <br />

#### 查看服务运行状态
```
ps -ef | grep nginx
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/8.png" /> <br />

#### 停止服务：
```
kill 29846
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/9.png" /> <br />

  我们再在浏览器下访问 http://47.94.155.8/ 访问不到了，因为服务已经被停止了。我们可以继续使用如下命令进行重启了；如下所示：
```
sudo /usr/local/nginx/sbin/nginx
```
#### 重新启动服务
```
sudo /usr/local/nginx/sbin/nginx -s reopen
```
#### 5) 上传静态资源文件 

  现在可以开始上传我们本地的静态资源文件到服务器了，以便外网可以访问的到，我使用的是mac电脑，因此我安装了一个 FileZilla 软件，然后打开，输入用户名，用户名默认为 root， 输入密码，端口号默认为22， 点击链接，链接成功后，就可以先简单的手动上传文件了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/10.png" /> <br />

#### 6) SSH 登录

  我们使用的是mac电脑，因此我们可以直接在我们mac本地终端命令行中进行远程登录服务器：
```
# 语法：ssh root@<实例的固定公网IP或EIP>

# 示例：
ssh root@47.94.155.8

# 输入实例登录密码
# 如果出现 Welcome to Alibaba Cloud Elastic Compute Service ! 表示成功连接到实例。
```
  如下所示就是在我们的本地mac终端进行远程登录的：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/11.png" /> <br />

  登陆后如果我们一段时间没有操作，再操作的时候就会需要重新登陆，又要输入一次密码，为了能够自动登陆，我们需要：
```
# 在本地起一个终端，获取本地公钥
cat ~/.ssh/id_rsa.pub

# 登陆服务器，将获取的公钥写入服务器的 authorized_keys
echo "这里修改为你的公钥内容" >> ~/.ssh/authorized_keys
```
这样我们再次登陆的时候就不需要输入密码了。注意，我们写入的是 ~ 目录里，这就意味着如果我们切换了用户，是需要再按照这个方式配置一遍的。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/service/12.png" /> <br />

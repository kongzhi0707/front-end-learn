
### 使用Docker+webHook实现前端自动化部署

在很久之前，我们需要实现部署项目，可能会经历如下几个步骤：

1）本地项目打包，运行 npm run build, 生成build文件。
2）将build中所有的文件通过ftp等形式上传到服务器中。
3）git push 提交代码到仓库。

在使用Docker实现前端自动化部署后，我们会经历如下几个过程：

1）git push 提交代码到仓库。
2）服务器自动更新镜像文件。
3）镜像中自动运行 npm run build 生成构建产物。
4）服务器自动创建容器。

因此实现前端自动化部署后，我们开发者只需要把代码推送到仓库，其他事情都可以通过服务器上的自动化脚本完成。

想要全面了解Docker，请看<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/autoDeployment/docker.md">这篇文章</a>

我在网上买了一个阿里云服务器，为了测试部署功能，部署前端项目到阿里云服务器，看 <a href="https://blog.csdn.net/Kevinblant/article/details/103168451">这篇文章</a> 很详细 

登录阿里云服务器，切换到实例中，登录远程服务器中，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/1.png" /> <br />

点击远程连接后，点击 Workbench远程连接 立即登录按钮，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/2.png" /> <br />

最后连接成功后，打开远程连接窗口如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/3.png" /> <br />

#### 安装环境

#### 1）docker

我们在本地安装了docker，但是在云服务器上默认是没有的，因此我们需要给他安装docker环境。根据docker官网的安装教程，需要运行如下命令：

# Step 1: 安装必要的一些系统工具
sudo yum install -y yum-utils

# Step 2: 添加软件源信息，使用阿里云镜像
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Step 3: 安装 docker-ce
sudo yum install docker-ce docker-ce-cli containerd.io

# Step 4: 开启 docker服务
sudo systemctl start docker

如上操作完成后，我们在远程窗口命令行中 运行 docker --help 命令看到如下信息，说明docker环境已经安装好了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/autoDeployment/autoDocker/4.png" /> <br />

#### 2）git

自动化部署会涉及到拉取最新的代码，因此我们需要安装git环境。安装命令如下：

yum install git

#### 3) node

既然是前端自动化部署，云服务器上相关处理逻辑使用js编写，所以我们需要安装node环境，如下命令：

sudo yum install node

我们也可以继续安装npm，安装 npm 使用如下命令：

sudo yum install npm

如上node安装完成后，我们还需要安装 pm2, 它能使我们的js脚本能在云服务器的后台运行。安装命令如下：

npm i pm2 -g

#### 创建 demo 项目

我们先简单的使用 vue-cli 在本地创建项目，

vue create docker-webhook-test

然后把我们的demo项目上传到github上，并且准备配置 webhook

##### webhook

基本原理：当仓库有提交代码时，通过将 webhook 请求地址指向云服务器IP地址，云服务器就能知道项目有更新，之后运行相关代码实现自动化部署。

##### 配置webhook

打开github的仓库主页，点击右侧的 settings

















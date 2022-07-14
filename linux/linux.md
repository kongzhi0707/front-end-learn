
### 系统学习linux命令

#### 1）命令

#### 1.1）命令行提示符

我目前买的是阿里云服务器 ECS，Centos7 64位。我们也可以自己的电脑安装虚拟机，虚拟机中再去安装 CentOS系统。

我们首先 终端链接阿里云服务器，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/1.png" /> <br />

我们通过执行 ssh root@47.94.155.8 命令，然后输入服务器连接密码就可以登录远程服务器。因此我们可以在本地电脑操作远程服务器。

我们执行一个简单的命令 pwd

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/2.png" /> <br />

如上命令解释：

root: 表示用户名；
iZ2zeds62pwbss0ax04ja6Z：表示主机名；
~: 表示目前所在的目录为家目录，其中 root 用户的家目录是 /root; 普通用户的家目录在 /home 下；
#: 表示我们所具有的权限 (root 用户为 #， 普通用户为 $).

执行 whoami 命令可以查看当前用户名；执行 hostname 命令可以查看当前主机名；

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/3.png" /> <br />

#### 注意：root是超级用户，具备操作系统的一切权限。

#### 2）文件和目录

#### 2.1）pwd 查看当前路径

$ pwd

显示当前目录的路径。

#### 2.2) which (查看命令的可执行文件所在路径)

查看命令的可执行文件所在路径，在Linux下，每一条命令其实都对应一个可执行程序，在终端输入命令，按回车的时候，就是执行了对应的那个程序。
比如我们想查看node 可执行文件所在的路径， 或 npm 可执行文件所在的路径，可以使用 which node 或 which npm 来查看，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/4.png" /> <br />

#### 2.3）浏览和切换目录

#### ls（列出文件和目录）

常用的参数如下：

-a 显示所有文件和目录(包括隐藏的)
-l 显示详细列表
-h 适合人类阅读的
-t 按文件最近一次修改时间排序
-i 显示文件的 inode （inode是文件内容的标识）

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/5.png" /> <br />

如上 ls -la 命令是由 显示所有文件和目录(包括隐藏) 和 -l 显示详细列表组成。

我们如上看到 每一行都有7列，我们以上面的 .npm 为列 讲解每列的含义：


| drwxr-xr-x  | 4 | root ｜ root ｜ 4096 ｜ 6月 26 09:02 ｜ .npm ｜
| :-------------------------------------------|-----------------: 
｜ 文件类型和权限信息 ｜ 链接数或者一级子目录数   ｜  所有者 ｜  所属组  ｜  文件大小，单位字节 ｜  最后修改时间  ｜ 文件名  ｜

重点我们看第一列的内容，以 drwxr-xr-x 为列，这里一共有10位，第一位 表示文件类型，其中 - 表示普通文件，d 表示目录文件。

第 2 到 第 4 位，表示所有者的权限，其中 r 表示读权限，w 表示写权限，x 表示可执行权限，- 表示无权限，第 2 到 第 4 位 为 rwx，表示所有者有可读可写可执行。

第 5 到 第 7 位，表示用户权限，这里是 r-x ， 表示有可读可执行权限，无写入权限。

第 8 到 第 10 位，表示其他用户权限，这里是 r-x; 表示有可读可执行权限，无写入权限。

#### 注意：像 root 用户创建文件夹默认的权限 位 rwxr-xr-x; 如果是创建文件的话默认的权限位 rw-r--r--, 创建文件默认会去掉 x 权限。

如下创建 test 文件夹， 创建 index.html 文件的权限；

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/6.png" /> <br />

#### cd (表示切换目录)

cd /  ---> 跳转到根目录
cd ~  ----> 跳转到家目录
cd .. ----> 跳转到上级目录
cd ./home ----> 跳转到当前目录的home目录下
cd /home/xxx  ----> 跳转到根目录下的home目录下的xxx目录
cd  ----> 不添加任何参数，也是回到家目录

#### du（列举目录大小信息）

 常用参数如下：

-h 适合人类阅读的
-a 同时列举目录下文件的大小信息
-s 只显示总计带下，不显示具体信息。

#### cat 查看文件

一次性显示文件的所有内容，更适合查看小的文件。常用的参数如下：

-n 显示行号; 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/7.png" /> <br />

#### less (分页显示文件内容，更适合查看大的文件。)

less index.js

#### head --- 显示文件的开头几行 (默认是10行)

head index.js

可使用的参数如下：

-n 指定行数; 比如查看2行；使用命令 head index.js -n 2;

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/8.png" /> <br />

#### tail -- 显示文件的结尾几行 (默认是10行)

常用的参数如下：

-n 指定行数；

比如 tail index.js -n 2; 代表末尾2行。
-f 每过1秒检查下文件是否有更新内容，也可以使用 -s 参数指定间隔的时间 tail -f -s 4 index.js

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/9.png" /> <br />

#### touch (创建一个文件)

touch index.html

#### mkdir (创建一个目录)

mkdir test

常用的参数如下：

-p: 递归的创建目录结构，

比如如下 mkdir -p test/test2/test3, 就可以创建 test/test2/test3 目录， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/10.png" /> <br />

#### cp (拷贝文件和目录)
```
  cp file file_copy   -> file 是目标文件，file_copy 是拷贝出来的文件
  cp file one  -> 把 file 文件 拷贝到 one 目录下，并且文件名依然为 file
  cp file one/file_copy  -> 把file文件拷贝到 one 目录下，文件名为 file_copy;
  cp *.txt folder -> 把当前目录下的所有txt文件拷贝到 folder 目录下。
```
常用的参数：

  -r：递归的拷贝，常用来拷贝一整个目录。

#### mv(移动文件或目录)

```
  mv file one	--> 将 file 文件移动到 one 目录下
  mv new_folder one	--> 将 new_folder 文件夹移动到one目录下
  mv *.txt folder	--> 把当前目录下所有 txt 文件移动到 folder 目录下
  mv file new_file	--> file 文件重命名为 new_file
```

#### rm (删除文件和目录)

Linux 是没有回收站的，一旦删除非常难恢复，因此我们需要小心操作。
```
rm new_file 	--> 删除 new_file 文件
rm f1 f2 f3 	--> 同时删除 f1 f2 f3 3个文件
```
常用的参数：
```
  -i 向用户确认是否删除
  -f 文件强制删除
  -r 递归删除文件夹，常见的删除使用方式: rm -rf node_modules
```

#### 3) 用户与权限

  Linux 是一个多用户的操作系统。在Linux中，理论来说，我们可以创建无数个用户，但是这些用户会被分到不同的群组里面的，我们有一个超级用户root，它是拥有最高权限的。

#### sudo

  以root身份运行命令。

#### useradd + passwd

  useradd 添加新用户
  passwd 修改用户密码

  如上两个命令 需要root 用户权限。
```
useradd git  // 添加一个git用户，添加完成之后 在 /home 路径下可以查看的到
passwd git   // 修改 git 用户的密码
```
#### userdel

  删除用户，需要root的用户权限。
```
userdel git // 只会删除用户名，不会从 /home 中删除对应的文件夹
userdel git -r // 会同时删除 /home 下的对应文件夹
```
#### su

  切换用户，需要 root 用户权限。
```
sudo su -> 切换为root用户
su git -> 切换为普通用户
su -  -> 切换为root用户
```
#### chmod (修改访问权限)

  常用参数：

  -R 可以递归地修改文件访问权限，比如: chmod -R 777 /home/git

  如上我们已经介绍过目录权限相关的，比如如下：

| drwxr-xr-x  | 4 | root ｜ root ｜ 4096 ｜ 6月 26 09:02 ｜ .npm ｜
| :-------------------------------------------|-----------------: 
｜ 文件类型和权限信息 ｜ 链接数或者一级子目录数   ｜  所有者 ｜  所属组  ｜  文件大小，单位字节 ｜  最后修改时间  ｜ 文件名  ｜

  重点我们看第一列的内容，以 drwxr-xr-x 为列，这里一共有10位，第一位 表示文件类型，其中 - 表示普通文件，d 表示目录文件。链接是 l。

  第 2 到 第 4 位，表示所有者的权限，其中 r 表示读权限，w 表示写权限，x 表示可执行权限，- 表示无权限，第 2 到 第 4 位 为 rwx，表示所有者有可读可写可执行。

  第 5 到 第 7 位，表示用户权限，这里是 r-x ， 表示有可读可执行权限，无写入权限。

  第 8 到 第 10 位，表示其他用户权限，这里是 r-x; 表示有可读可执行权限，无写入权限。
```
  d: 表示目录。
  r: read 表示文件可读.
  w: white 表示文件可写，一般有写的权限，就有删除的权限。
  x: execute: 表示文件可执行。
  -：表示没有相应的权限。
```
  权限的整体是按用户来划分的，如下图所示：

| d  | rwx | rwx ｜ rwx ｜
| :------|-----------------: 
｜ 文件属性 ｜ 所有者   ｜  群组用户 ｜  其他用户  ｜

现在我们再来理解 drwxr-xr-x 的意思：
```
  它是一个文件夹，因为第一个字符是d：表示目录。
  它的所有者具有：读，写，执行权限。
  它的群组用户具有：读，执行的权限，没有写的权限。
  它的其他用户具有：读，执行的权限，没有写的权限。
```
  现在我们可以使用 chmod 来试着修改权限，chmod 它不需要root用户才能运行的。只要你是此文件的所有者，就可以使用 chmod 来修改文件的访问权限。

#### 数字分配权限如下：

| 权限 | 数字 ｜
| :------|---: 
｜ r ｜  4  ｜
｜ w ｜  2  ｜
｜ x ｜  1  ｜

因此我们做如下分析:
```
chmod 640 demo1.txt
```
```
6 = 4 + 2 + 0; // 表示所有者具有 rw 权限
4 = 4 + 0 + 0; // 表示群组用户具有 r 权限
0 = 0 + 0 + 0; // 表示其他用户没有权限
```
#### 用字母来分配权限
```
  u: user的缩写，用户的意思，表示所有者。
  g: group 的缩写，群组的意思，表示群组用户。
  o: other 的缩写，其他的意思，表示其他用户。
  a: all 的缩写，所有的意思，表示所有用户。
  +: 加号，表示添加权限。
  -: 减号：表示去除权限。
  =: 等于号，表示分配权限。

  chmod u+rx file	--> 文件file的所有者 增加 读和运行的权限
  chmod g+r file	--> 文件file的群组用户增加读的权限
  chmod o-r file	--> 文件file的其它用户移除读的权限
  chmod g+r o-r file	--> 文件file的群组用户增加读的权限，其它用户移除读的权限
  chmod go-r file	--> 文件file的群组和其他用户移除读的权限
  chmod +x file	--> 文件file的所有用户增加运行的权限
  chmod u=rwx,g=r,o=- file	--> 文件file的所有者分配读写和执行的权限，群组其它用户分配读的权限，其他用户没有任何权限
```

#### 4) 软件仓库 (yum 安装软件相关的)

Linux 的包都存在一个仓库，叫做软件仓库，它可以使用 yum 来管理软件包，yum 是 CentOS 中默认的包管理工具。

#### yum 常用的命令有如下：
```
  yum update | yum upgrade // 更新软件包
  yum search xxx // 搜索相应的软件包
  yum install xxx // 安装软件包
  yum remove xxx // 删除软件包
```
#### 切换 CentOS 软件源

  有时候 CentOS 默认的 yum 源不一定是国内镜像，导致 yum 在线安装及更新速度不是很理想。这个时候需要将 yum 源设置为国内镜像站点。国内主要开源的镜像
站点是阿里云。

1、首先备份系统自带 yum 源配置文件 
```
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup 
```
2、下载阿里云的 yum 源配置文件到 /etc/yum.repos.d/CentOS7
```
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```
3、生成缓存
```
yum makecache
```

#### 5) 



















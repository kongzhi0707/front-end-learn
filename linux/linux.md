
### 系统学习linux命令

<div id="back"></div>

- [一）命令](#id1) <br />
  - 命令行提示符 <br />
- [二）文件和目录](#id2) <br />
  - 2.1）pwd 查看当前路径 <br />
  - 2.2) which (查看命令的可执行文件所在路径) <br />
  - 2.3）浏览和切换目录 <br />

- [三) 用户与权限](#id3) <br />
  - 3.1) useradd + passwd 添加用户<br />
  - 3.2) userdel 删除用户 <br />
  - 3.3) su 切换用户 <br />
  - 3.4) chmod (修改访问权限) <br />
  - 3.5) 数字分配权限 <br />
  - 3.6) 用字母来分配权限 <br />

- [四）软件仓库 (yum 安装软件相关的)](#id4) <br />

- [五) 文本操作](#id5) <br />
  - 5.1) sort 对文件的行进行排序 <br />
  - 5.2) wc 用于文件的统计，它可以统计单词数目，行数，字符数，字节数等。 <br />
  - 5.3) uniq (删除文件中的重复内容。) <br />
  - 5.4) cut (剪切文件的一部分内容。) <br />

- [六）查看进程](#id6) <br />
  - 6.1）w (快速了解系统中目前有哪些用户登录) <br />
  - 6.2）ps (显示当前系统的进程) <br />
  - 6.3）kill (结束一个进程) <br />

- [七：守护进程](#id7) <br />
  - 7.1) systemd<br />

- [八 文件压缩解压](#id8) <br />
  - 8.1）tar (创建一个 tar 归档) <br />
  - 8.2）gzip / gunzip <br />
  - 8.3）tar 归档 + 压缩 <br />
  - 8.4) zip/unzip <br />

#### <div id="id1">一）命令 <a href="#back"> 回到顶部</a></div>

#### 1.1）命令行提示符

我目前买的是阿里云服务器 ECS，Centos7 64位。我们也可以自己的电脑安装虚拟机，虚拟机中再去安装 CentOS系统。

我们首先 终端链接阿里云服务器，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/1.png" /> <br />

我们通过执行 ssh root@47.94.155.8 命令，然后输入服务器连接密码就可以登录远程服务器。因此我们可以在本地电脑操作远程服务器。

我们执行一个简单的命令 pwd

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/2.png" /> <br />

如上命令解释：
```
  root: 表示用户名；
  iZ2zeds62pwbss0ax04ja6Z：表示主机名；
  ~: 表示目前所在的目录为家目录，其中 root 用户的家目录是 /root; 普通用户的家目录在 /home 下；
  #: 表示我们所具有的权限 (root 用户为 #， 普通用户为 $).
```
执行 whoami 命令可以查看当前用户名；执行 hostname 命令可以查看当前主机名；

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/3.png" /> <br />

#### 注意：root是超级用户，具备操作系统的一切权限。

#### <div id="id2">二）文件和目录<a href="#back"> 回到顶部</a></div>

#### 2.1）pwd 查看当前路径

$ pwd

显示当前目录的路径。

#### 2.2) which (查看命令的可执行文件所在路径)

查看命令的可执行文件所在路径，在Linux下，每一条命令其实都对应一个可执行程序，在终端输入命令，按回车的时候，就是执行了对应的那个程序。
比如我们想查看node 可执行文件所在的路径， 或 npm 可执行文件所在的路径，可以使用 which node 或 which npm 来查看，如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/4.png" /> <br />

#### 2.3) 浏览和切换目录

#### ls（列出文件和目录）

常用的参数如下：
```
  -a 显示所有文件和目录(包括隐藏的)
  -l 显示详细列表
  -h 适合人类阅读的
  -t 按文件最近一次修改时间排序
  -i 显示文件的 inode （inode是文件内容的标识）
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/5.png" /> <br />

如上 ls -la 命令是由 显示所有文件和目录(包括隐藏) 和 -l 显示详细列表组成。

我们如上看到 每一行都有7列，我们以上面的 .npm 为列 讲解每列的含义：


| drwxr-xr-x       | 4                     | root   | root    | 4096             | 6月 26 09:02 | .npm  |
| :----------------|-----------------------|--------|---------|------------------|--------------|--------: 
| 文件类型和权限信息  | 链接数或者一级子目录数    |  所有者 |  所属组  |  文件大小，单位字节 |  最后修改时间  | 文件名 |

重点我们看第一列的内容，以 drwxr-xr-x 为列，这里一共有10位，第一位 表示文件类型，其中 - 表示普通文件，d 表示目录文件。

第 2 到 第 4 位，表示所有者的权限，其中 r 表示读权限，w 表示写权限，x 表示可执行权限，- 表示无权限，第 2 到 第 4 位 为 rwx，表示所有者有可读可写可执行。

第 5 到 第 7 位，表示用户权限，这里是 r-x ， 表示有可读可执行权限，无写入权限。

第 8 到 第 10 位，表示其他用户权限，这里是 r-x; 表示有可读可执行权限，无写入权限。

#### 注意：像 root 用户创建文件夹默认的权限 位 rwxr-xr-x; 如果是创建文件的话默认的权限位 rw-r--r--, 创建文件默认会去掉 x 权限。

如下创建 test 文件夹， 创建 index.html 文件的权限；

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/6.png" /> <br />

#### cd (表示切换目录)
```
  cd /  ---> 跳转到根目录
  cd ~  ----> 跳转到家目录
  cd .. ----> 跳转到上级目录
  cd ./home ----> 跳转到当前目录的home目录下
  cd /home/xxx  ----> 跳转到根目录下的home目录下的xxx目录
  cd  ----> 不添加任何参数，也是回到家目录
```
#### du（列举目录大小信息）

 常用参数如下：
```
  -h 适合人类阅读的
  -a 同时列举目录下文件的大小信息
  -s 只显示总计带下，不显示具体信息。
```
#### cat 查看文件

一次性显示文件的所有内容，更适合查看小的文件。常用的参数如下：

-n 显示行号; 如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/7.png" /> <br />

#### less (分页显示文件内容，更适合查看大的文件。)
```
less index.js
```
#### head --- 显示文件的开头几行 (默认是10行)
```
head index.js
```
可使用的参数如下：
```
-n 指定行数; 比如查看2行；使用命令 head index.js -n 2;
```
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

#### <div id="id3"> 三) 用户与权限 <a href="#back"> 回到顶部</a></div>

  Linux 是一个多用户的操作系统。在Linux中，理论来说，我们可以创建无数个用户，但是这些用户会被分到不同的群组里面的，我们有一个超级用户root，它是拥有最高权限的。

#### sudo

  以root身份运行命令。

#### 3.1) useradd + passwd

  useradd 添加新用户
  passwd 修改用户密码

  如上两个命令 需要root 用户权限。
```
useradd git  // 添加一个git用户，添加完成之后 在 /home 路径下可以查看的到
passwd git   // 修改 git 用户的密码
```
#### 3.2) userdel

  删除用户，需要root的用户权限。
```
userdel git // 只会删除用户名，不会从 /home 中删除对应的文件夹
userdel git -r // 会同时删除 /home 下的对应文件夹
```
#### 3.3) su

  切换用户，需要 root 用户权限。
```
sudo su -> 切换为root用户
su git -> 切换为普通用户
su -  -> 切换为root用户
```
#### 3.4) chmod (修改访问权限)

  常用参数：

  -R 可以递归地修改文件访问权限，比如: chmod -R 777 /home/git

  如上我们已经介绍过目录权限相关的，比如如下：

| drwxr-xr-x       | 4                     | root   | root    | 4096             | 6月 26 09:02 | .npm  |
| :----------------|-----------------------|--------|---------|------------------|--------------|--------: 
| 文件类型和权限信息  | 链接数或者一级子目录数    |  所有者 |  所属组  |  文件大小，单位字节 |  最后修改时间  | 文件名 |


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

| d        | rwx     | rwx      | rwx       |
|:---------|---------|----------|-----------: 
| 文件属性  ｜ 所有者   |  群组用户 |  其他用户  |

现在我们再来理解 drwxr-xr-x 的意思：
```
  它是一个文件夹，因为第一个字符是d：表示目录。
  它的所有者具有：读，写，执行权限。
  它的群组用户具有：读，执行的权限，没有写的权限。
  它的其他用户具有：读，执行的权限，没有写的权限。
```
  现在我们可以使用 chmod 来试着修改权限，chmod 它不需要root用户才能运行的。只要你是此文件的所有者，就可以使用 chmod 来修改文件的访问权限。

#### 3.5) 数字分配权限如下：

| 权限 | 数字 ｜
|:----|------: 
| r   |  4   |
| w   |  2   |
| x   |  1   |

因此我们做如下分析:
```
chmod 640 demo1.txt
```
```
6 = 4 + 2 + 0; // 表示所有者具有 rw 权限
4 = 4 + 0 + 0; // 表示群组用户具有 r 权限
0 = 0 + 0 + 0; // 表示其他用户没有权限
```
#### 3.6) 用字母来分配权限
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

#### <div id="id4"> 四) 软件仓库 (yum 安装软件相关的) <a href="#back"> 回到顶部</a></div>

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

#### <div id="id5"> 五) 文本操作 <a href="#back"> 回到顶部</a></div>

#### 5.1) sort

  对文件的行进行排序。

  基本语法：sort name.txt  // 对 name.txt 文件进行排序

  为了演示，我们可以创建一个文件 name.txt, 然后放入以下内容：
```
Christopher
Shawn
Ted
Rock
Noah
Zachary
Bella
```
  执行 sort name.txt 命令，会对文本内容进行排序；如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/11.png" /> <br />

#### 常用如下参数：
```
  -o: 将排序后的文件写入新文件， sort -o name_sorted.txt name.txt (将name.txt排序后的文件写入到 name_sorted.txt 文件中)
  -r: 倒序排序，用法：sort -r name.txt;
  -R: 随机排序，用法: sort -R name.txt;
  -n: 对数字进行排序，默认是把数字识别成字符串的，因此 138 会排在 25 前面，如果添加了 -n 数字排序的话，则 25 会在 138 前面。
```
#### 5.2) wc 用于文件的统计，它可以统计单词数目，行数，字符数，字节数等。

  word count 的缩写，用于文件的统计。它可以统计单词数目，行数，字符数，字节数等。

#### 基础用法
```
wc name.txt // 统计 name.txt
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/12.png" /> <br />
```
  第一个7，表示行数。
  第二个7，表示单词数。
  第三个46，表示字节数。
```
#### 常用参数
```
  -l 只统计行数， 如：wc -l name.txt
  -w 只统计单词数, 如: wc -w name.txt
  -c 只统计字节数, 如：wc -c name.txt
  -m 只统计字符数, 如: wc -m name.txt
```
#### 5.3) uniq (删除文件中的重复内容。)

  删除文件中的重复内容。

#### 基础语法：
```
  uniq name.txt  // 去除name.txt重复的行数，并打印到屏幕上
  uniq name.txt uniq_name.txt // 把去除重复后的文件保存为 uniq_name.txt
```
#### 只能去除连续重复的行数

#### 常用的参数
```
  -c 统计重复的行数，如: uniq -c name.txt
  -d 只显示重复的行数，如: uniq -d name.txt
```
#### 5.4) cut (剪切文件的一部分内容。)

  剪切文件的一部分内容。

  基本使用方法如下：
```
cut -c 2-4 name.txt // 剪切每一行的 第二道第四个字符
```
#### 常用参数
```
  -d 用于指定什么分隔符 (比如逗号, 分号，等), 比如使用方法: cut -d , name.txt
  -f 表示剪切下用分隔符分割的那一块或哪几块区域， cut -d , -f 1 name.txt
```
#### <div id="id6"> 六）查看进程 <a href="#back"> 回到顶部</a></div>

  在window中，我们可以通过 ctrl+Alt+Delete 快捷键查看软件的进程

#### 6.1）w (快速了解系统中目前有哪些用户登录)

  帮我们快速了解系统中目前有哪些用户登录着，以及他们在干什么。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/13.png" /> <br />

#### 6.2）ps (显示当前系统的进程)

  用于显示当前系统中的进程，ps命令显示的进程列表不会随时间而更新。它是静态的。是运行 ps 命令那个时刻的状态或者说是一个进程快照。

  基本使用方法：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/14.png" /> <br />
```
[root@iZ2zeds62pwbss0ax04ja6Z ~]# ps
    PID TTY          TIME CMD
  36825 pts/0    00:00:00 bash
  36875 pts/0    00:00:00 ps
[root@iZ2zeds62pwbss0ax04ja6Z ~]# 

  PID: 进程号，每个进程都有唯一的进程号
  TTY: 进程运行所在的终端
  TIME: 进程运行的时间
  CMD: 产生这个进程的程序名，如果在进程列表中看到有好几行都是同样的程序名，那么就是同样的程序产生了不止一个进程。
```
#### 常用的参数有如下：
```
  -ef:   列出所有的进程。
  -efH:  以乔木状列举出所有进程;
  -u:    列出此用户运行的进程
  -aux:  通过CPU和内存使用来过滤进程 ps -aux | less;
  -aux --sort -pcpu: 按cpu使用降序排列;
  -aux --sort -pmem: 表示按内存使用降序排列；
  -axjf: 以树形结构显示进程
```
#### 6.3）kill (结束一个进程)

  结束一个进程使用命令：kill + PID;
```
  kill 956  // 结束进程号为956的进程
  kill 956 957 // 结束多个进程
  kill -9 7291  // 强制结束进程 7291
```
#### <div id="id7"> 七：守护进程 <a href="#back"> 回到顶部</a></div>

  一个运行起来的程序被称为进程。在Linux中有些进程是特殊的，它不与任何进程关联，不论用户的身份如何，都在后台运行，这些进程的父进程是 PID 为1的进程，PID为1的进程只在系统关闭时才会被销毁。它们会在后台一直运行等待分配工作。我们将这类进程称之为守护进程 daemon.

  守护进程的名字一般会在最后有一个d，表示 daemon 守护的意思，比如 systemd, httpd.

#### 7.1) systemd

  systemd 是一个linux系统基础组件的集合，提供了一个系统和服务管理器，运行为 PID 1 并负责启动其他程序。
```
[root@iZ2zeds62pwbss0ax04ja6Z ~]# ps -aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  1.1 103336 10744 ?        Ss   Jul03   0:12 /usr/lib/systemd/systemd --switched-root --system --deserialize 18
root           2  0.0  0.0      0     0 ?        S    Jul03   0:00 [kthreadd]
root           3  0.0  0.0      0     0 ?        I<   Jul03   0:00 [rcu_gp]
root           4  0.0  0.0      0     0 ?        I<   Jul03   0:00 [rcu_par_gp]
root           6  0.0  0.0      0     0 ?        I<   Jul03   0:00 [kworker/0:0H-events_highpri]
root           8  0.0  0.0      0     0 ?        I<   Jul03   0:00 [mm_percpu_wq]
root           9  0.0  0.0      0     0 ?        S    Jul03   0:00 [rcu_tasks_rude_]
root          10  0.0  0.0      0     0 ?        S    Jul03   0:00 [rcu_tasks_trace]
root          11  0.0  0.0      0     0 ?        S    Jul03   0:03 [ksoftirqd/0]
root          12  0.0  0.0      0     0 ?        R    Jul03   0:24 [rcu_sched]
root          13  0.0  0.0      0     0 ?        S    Jul03   0:00 [migration/0]
root          14  0.0  0.0      0     0 ?        S    Jul03   0:00 [cpuhp/0]
root          16  0.0  0.0      0     0 ?        S    Jul03   0:00 [kdevtmpfs]
root          17  0.0  0.0      0     0 ?        I<   Jul03   0:00 [netns]
root          18  0.0  0.0      0     0 ?        S    Jul03   0:00 [kauditd]
root          19  0.0  0.0      0     0 ?        S    Jul03   0:00 [khungtaskd]
root          20  0.0  0.0      0     0 ?        S    Jul03   0:00 [oom_reaper]
root          21  0.0  0.0      0     0 ?        I<   Jul03   0:00 [writeback]
root          22  0.0  0.0      0     0 ?        S    Jul03   0:04 [kcompactd0]
...... 更多
```
  如上我们通过命令看到 PID 为 1 的进程就是 systemd 的系统进程。

  systemd 常用命令如下：
```
  systemctl start nginx # 启动服务
  systemctl stop nginx # 停止服务
  systemctl restart nginx # 重启服务
  systemctl status nginx # 查看服务状态
  systemctl reload nginx # 重载配置文件(不停止服务的情况)
  systemctl enable nginx # 开机自动启动服务
  systemctl disable nginx # 开机不自动启动服务
  systemctl is-enabled nginx # 查看服务是否开机自动启动
  systemctl list-unit-files --type=service # 查看各个级别下服务的启动和禁用情况
```
#### <div id="id8"> 八 文件压缩解压 <a href="#back"> 回到顶部</a></div>

  打包：是将多个文件变成一个总的文件，我们称它为存档，归档。
  压缩：是将一个大文件压缩变成一个小的文件。

  我们经常使用 tar 将多个文件 打包一个总的文件，称为 archive, 然后我们使用 gzip 或 bzip2 命令将 archive 压缩为更小的文件。

#### 8.1）tar (创建一个 tar 归档)

  创建一个 tar 归档。

  用法如下：
```
  tar -cvf sort.tar sort/   // 将sort文件夹归档为sort.tar
  tar -cvf archive.tar file1 file2 file3  // 将 file1 file2 file3  归档为archive.tar
```
#### 常用参数如下：
```
  -cvf  表示 create (创建) + verbose (细节) + file (文件)，创建归档文件并显示操作细节；
  -tf   显示归档里的内容，并不解开归档; 使用如下： tar -tf sort.tar
  -rvf  追加文件到归档， 使用如下：tar -rvf archive.tar file.txt
  -xvf  解开归档， tar -xvf archive.tar
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/15.png" /> <br />

#### 8.2）gzip / gunzip

  压缩 (gzip) / 解压 (gunzip) 归档，默认使用 gzip 命令，压缩后的文件名后缀为 .tar.gz.
```
  gzip archive.tar  // 压缩
  gunzip archive.tar.gz  // 解压
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/linuxImage/16.png" /> <br />

#### 8.3）tar 归档 + 压缩

  我们可以用 tar 命令同时完成归档和压缩的操作，就是给 tar 命令多家一个选项参数，使之完成归档操作后，还是调用 gzip 或 bzip2 命令来完成压缩操作。
```
  tar -zcvf archive.tar.gz archive/  // 将archive文件夹归档并压缩
  tar -zxvf archive.tar.gz  // 将archive.tar.gz归档压缩文件解压
```
#### 8.4) zip/unzip

  压缩/解压 zip 文件(zip文件一般来自windows操作系统的)

  命令安装：
```
// Red Hat 一族中的安装方式
yum install zip 
yum install unzip 
```
  使用方法：
```
unzip archive.zip # 解压 .zip 文件
unzip -l archive.zip # 不解开 .zip 文件，只看其中内容
```
  zip -r sort.zip sort/ # 将sort文件夹压缩为 sort.zip，其中-r表示递归


























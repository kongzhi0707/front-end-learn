
### 理解find命令

  Linux 的find查找命令是Linux系统中最重要和最常用的命令之一。 用于根据与参数匹配的文件指定的条件来搜索和查找文件和目录列表的命令。
  我们还可以通过权限，用户，组，文件类型，日期，大小等可能的条件查找文件。

  基本用法如下：
```
find path -option [ -print] [-exec  -ok  command ] {} \;
```
  各个含义如下：
```
path: find命令所查找的目录路径。比如使用 . 来表示当前目录，使用 / 来表示系统的根目录。
-print: find命令将匹配的文件输出到标准输出。
-exec: find命令对匹配到的文件执行该参数所给出的shell命令。
-ok: 和 -exec 的作用相同，只不过以一种更为安全的模式来执行该参数所给出的shell命令，在执行每一个命令之前，都会给出提示，让用户来确定是否执行。
option: 各类控制参数，有如下常见的几种：
```
```
-name  filename              # 查找名为filename的文件
-perm                        # 按执行权限来查找
-user  username              # 按文件属主来查找
-group groupname             # 按组来查找
-mtime -n +n                 # 按文件更改时间来查找文件 -n指n天以内，+n 指n天以前
-atime -n +n                 # 按文件访问时间来查找
-ctime -n +n                 # 按文件创建时间来查找。-n指n天以内，+n 指n天以前
-nogroup                     # 查无有效属组的文件，即文件的属组在/etc/groups中不存在
-nouser                      # 查无有效属主的文件，即文件的属主在/etc/passwd中不存
-newer   f1 !f2              # 找文件，-n指n天以内，+n指n天以前 
-nogroup                     # 查无有效属组的文件，即文件的属组在/etc/groups中不存在
-nouser                      # 查无有效属主的文件，即文件的属主在/etc/passwd中不存
-newer   f1 !f2              # 查更改时间比f1新但比f2旧的文件
-type    b/d/c/p/l/f         # 查是块设备、目录、字符设备、管道、符号链接、普通文件
-size      n[c]              # 查长度为n块[或n字节]的文件
-depth                       # 使查找在进入子目录前先行查找完本目录
-fstype                      # 查更改时间比f1新但比f2旧的文件
-type    b/d/c/p/l/f         # 查是块设备、目录、字符设备、管道、符号链接、普通文件
-size      n[c]              # 查长度为n块[或n字节]的文件
-depth                       # 使查找在进入子目录前先行查找完本目录
-fstype                      # 查位于某一类型文件系统中的文件，这些文件系统类型通常可 在/etc/fstab中找到
-mount                       # 查文件时不跨越文件系统mount点
-follow                      # 如果遇到符号链接文件，就跟踪链接所指的文件
-cpio                %;      # 查位于某一类型文件系统中的文件，这些文件系统类型通常可 在/etc/fstab中找到
-mount                       # 查文件时不跨越文件系统mount点
-follow                      # 如果遇到符号链接文件，就跟踪链接所指的文件
-cpio                        # 对匹配的文件使用cpio命令，将他们备份到磁带设备中
-prune                       # 忽略某个目录
```
#### 基本查找命令

  1. 在当前目录，查找名为 xxx.js 的文件
```
find xxx.js
```
  #### 2）-name 根据文件名查找

  在主目录下寻找文件

  比如在 /home 目录下寻找名为 aaa.js 的所有文件
```
find /home -name aaa.js
```
  比如我现在在远程服务器下， 查找 /etc 目录下的所有以 conf 结尾的文件，如下命令：
```
find /etc -name '*conf'
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/1.png" /> <br />

#### 3）-iname 根据文件名查找且忽略大小写

  忽略文件名大小写查找文件

  比如在 /home 目录下寻找名为 aaa.js 的所有文件，忽略大小写，AAA.js 也会匹配到。
```
find /home -iname aaa.js
```
#### 4）-type 根据类型查找
```
find -type 类型

有如下类型：

f：文件  命令：find . -type f
d: 目录  命令：find . type d
c: 字符设备文件 命令：find . type c
b: 块设备文件：命令：find . type b
l: 链接文件：命令：find . type l
p: 管道文件：命令：find . type p
```
#### 4.1) 根据名称查找目录

  在当前目录下，寻找名为 test 的目录，其中 . 代表当前目录， / 代表根目录，～ 代表主目录
```
find . -type d -name test
```
#### 4.2) 使用名称寻找js文件

  在当前目录下，寻找名为 test.js 的文件
```
find . -type f -name test.js
```
#### 4.3) 查找目录下的所有js文件

  查找当前目录下所有的js类型的文件。
```
find . -type f -name "*.js"
```
#### 4.4) 查找文件并删除

  在当前目录下查找到所有 test.js 和 文本 txt， 并且删除掉
```
find . type f -name "test.js" -exec rm -f {} \;
find . type f -name "*.txt" -exec rm -f {} \;
```
#### 4.5) 查找到所有空文件
```
find . -type f -empty
```
#### 4.6) 查找到所有空目录
```
find . -type d -empty
```
#### 5) 根据权限查找文件

  先来理解下 Chmod 二进制权限，Linux权限默认使用 rwx 来表示，为了更简化在系统中对权限进行配置和修改，Linux权限引入二进制表示方法：

  Linux 权限可以将 rwx 用二进制来表示，其中有权限用1表示，没有权限用0表示。
  Linux权限用二进制显示如下：
```
rwx = 111
r-x = 101
rw- = 110
r-- = 100
```
  依次类推，转化为十进制，对应十进制结果显示如下：
```
rwx = 111 = 4+2+1=7
r-x = 101 = 4 + 0 + 1 = 5
rw- = 110 = 4 + 2 + 0 = 6
r-- = 100 = 4 + 0 + 0 = 4;
```
  chmod 的具体语法如下：
```
# -R：递归更改文件属组
chmod [-R] xyz 文件或目录
```
  其中xyz分别表示 Owner，Group，Others的权限。

#### 5.1）查找 权限为777的所有文件
```
find . -type f -perm 777 
```
#### 5.2）查找不是777权限的所有文件
```
find . -type f ! -perm 777
```
#### 5.3）查找到所有777的文件，并将权限修改为 644
```
find . -type f -perm 777 -exec chmod 644 {} \;
```
#### 5.4）查找所有隐藏文件
```
find . -type f -name ".*"
```
#### 6）根据所有者和组查找文件

#### 6.1）基于某个用户查找文件

  查找当前目录下 root 用户所拥有的名为 test.js 的文件
```
find . -user root -name test.js
```
#### 6.2）user 根据所属用户查找 

  查找某个用户的所有文件. 在当前目录下查找属于 moke 的所有文件
```
find . -user moke 
```
#### 6.3）group 根据所属用户组查找

  查找某个用户组拥有的所有文件. 在当前目录下查找 staff 用户组所拥有的所有文件
```
find . -group staff
```
#### 7. 根据日期和时间查找文件和目录

#### 7.1）当前目录寻找最后一天内修改过的文件
```
find . -mtime -1
```
#### 7.2）主目录寻找最近50~100d内被修改过的文件
```
find ~ -mtime +50 -mtime -100
```
#### 7.3）根目录查找最近一个小时内更改过的所有文件
```
find / -cmin -60
```
#### 8）根据文件大小查找文件和目录

#### 8.1）当前目录找到所有50MB的文件
```
find . -size 50M
```
#### 8.2) 当前目录寻找大于50M,小于100M的所有文件
```
find . size +50M -size -100M
```
#### 8.3) 主目录查找超过10M 的所有mp3文件，并删除
```
find ~ -type f -name "*.mp3" -size +10M -exec rm {} \;
```





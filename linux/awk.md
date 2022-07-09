
### awk用法详解

  awk 是文本三剑客之一(awk, grep, sed), 它是处理文本文件的一个应用程序，基本上所有Linux系统都自带这个程序。相对于grep的查找，sed的编辑，awk 在其对数据分析并生成报告时，显得尤为强大，awk的基本原理是：把文件逐行的读入，以空格为默认分隔符将每行切片，切开的部分再进行各种分析处理。换句话说，它会依次处理文件的每一行，并且读取里面的每一个字段。对于处理日志或其他的文本文件，awk是最方便的工具。

#### 一）基本用法
```
// 基本格式
$ awk 动作 文件名

// demo 示列
$ awk '{print $0}' demo.txt
```
  分析：demo.txt 是awk所要处理的文本文件。前面的单引号内部有一个大括号，里面就是一个处理的动作 print $0. 其中 print 是打印命令，$0 代表当前的行，因此上面执行的结果： 就是把 demo.txt 的 每一行原样打印出来.

  我们可以演示下，在命令行中，新建 demo.txt, 然后加入一些内容，如下：
```
$ touch demo.txt
$ vim demo.txt
```
  然后加入如下内容到 demo.txt 中，
```
aaaaa
bbbbb
ccccc
ddddd
kongzhi !!
```
  最后我们退出保存, 使用上面的命令操作下：
```
$ awk '{print $0}' demo.txt
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/15.png" /> <br />

  我们可以再用标准输入演示上面的列子；
```
$ echo 'this is a test' | awk '{print $0}'
```
  打印：this is a test， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/16.png" /> <br />

  上面代码中，print $0 就是把标准输入 this is a test ， 重新打印了一遍。

  awk 会根据空格和制表符，将每一行分成若干字段，依次使用 $1, $2, $3 代表第一个字段，第二个字段，第三个字段，依次类推等等。
```
$ echo 'this is a test' | awk '{print $3}'
```
  打印出 a; 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/17.png" /> <br />

  如上代码，$3 代表 "this is a test" 的第三个字段 a.

#### 二）awk的调用方式

#### 2.1）命令行方式
```
awk [-F field-separator] 'commands' input-file(s)
```
  下面我们来解释下上面的含义：
```
commands: 是真正awk命令，[-F域分隔符]是可选的。input-file(s) 是待处理的文件。
```
  在 awk 中，文件的每一行中，由域分隔符分开的每一项称为一个域，一般情况下，在不指定 -F 域分隔符的情况下，默认的域分隔符是空格。

  我们可以先来看一个demo，理解下如何使用命令行方式来调用命令，我们把上面的 demo.txt 的内容改成如下：
```
>root:x:0:0:root:/root:/usr/bin/zsh
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync

$ awk -F ':' ' { print $1 }' demo.txt
```
  如上命令，我们使用了 -F 参数指定分隔符为冒号，然后 打印每一行的第一个字段，最后输出如下：
```
>root
daemon
bin
sys
sync
```
  如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/18.png" /> <br />

#### 2.2）shell脚本方式
```
awk 'BEGIN{ print "start" } pattern{ commands } END{ print "end"}' file
```
  一个 awk 的脚本一般由：BEGIN语句块，能够使用模式匹配的通用语句块，END语句块 三部分组成。这三个部分都是可选的。任意一个部分都可以不出现在脚本中，脚本通常使用单引号或双引号中。

  比如如下shell脚本列子：
```
awk 'BEGIN { i=0 } { i++ } END { pring i} ' filename
```
  如下demo使用方式：
```
$ awk 'BEGIN{print "----开始处理了---"} {print "ok"} END{print "----都处理完毕---"}' demo.txt
```
如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/19.png" /> <br />

  awk 的选项有：
```
-F 可以指定分隔符
-v 自定义变量：定义变量
```
#### 三）awk 的内置变量

| 变量 | 描述 | 
| :------| ------: 
| \$n | 当前记录的第n个字段，字段间由FS分割 | 
| \$0 | 完整的输入记录 | 
| ARGC | 命令行参数的数目 | 
| ARGIND | 命令行中当前文件的位置(从0开始算) | 
| ARGV | 包含命令行参数的数组 | 
| CONVFMT | 数字转换格式(默认值为%.6g)ENVIRON环境变量关联数组 | 
| ERRNO | 最后一个系统错误的描述 | 
| FIELDWIDTHS	 | 字段宽度列表(用空格键分隔) | 
| FILENAME | 当前文件名 | 
| FNR | 各文件分别计数的行号 | 
| FS | 输入字段分隔符(默认是任何空格) | 
| IGNORECASE | 如果为真，则进行忽略大小写的匹配 | 
| NF | 一条记录的字段的数目 | 
| NR | 已经读出的记录数，就是行号，从1开始 | 
| OFMT | 数字的输出格式(默认值是%.6g) | 
| OFS | 输出记录分隔符（输出换行符），输出时用指定的符号代替换行符 | 
| ORS | 输出记录分隔符(默认值是一个换行符) | 
| RLENGTH | 由match函数所匹配的字符串的长度 | 
| RS | 记录分隔符(默认是一个换行符) | 
| RSTART | 由match函数所匹配的字符串的第一个位置 | 
| SUBSEP | 数组下标分隔符(默认值是/034) | 

#### 3.1）输入分隔符

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/20.png" /> <br />

  如上，FS内置变量，设置空白字符为分隔符，然后取 1，3 个字段。

#### 3.2）替换输出分隔符

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/21.png" /> <br />

  如上是 OFS 内置变量表示将输出结果分隔符变成 :, 因此输出为 1:2:3. 也就是说，把空格分隔符替换成冒号 ":"。

#### 四）awk的赋值运算

  在赋值操作符中，sum+=i; 就相当于 sum = sum + i;

| 变量 | 描述 | 
| :------| ------: 
| = | 将右侧的值赋值给左侧变量 | 
| += | 将自身和右侧值相加然后赋给左侧变量 | 
| -= | 将自身减去右侧的变量，然后赋值给左侧变量 | 
| *= | 将自身剩以右边的变量，然后赋值给左侧变量 | 
| /= | 将自身除以右边的变量，然后赋值给左侧的变量 | 
| %= |  求余操作 | 
| ++ |  自身加1 | 
| -- |  自身减去1 | 

  比如：a+=5; 等价于 a=a+5;

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/22.png" /> <br />

#### 五) 模式匹配，使用正则 

  还是上面的demo.txt, 假如该文本文件有如下内容：
```
>root:x:0:0:root:/root:/usr/bin/zsh
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
```
我们现在要做的事情是：输出包含有 root 的行;
```
$ awk -F: /root/ demo.txt
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/23.png" /> <br />

#### 六）比较操作符

| 变量 | 描述 | 
| :------| ------: 
| == | 两侧相等 | 
| != | 两侧不等 | 
| > | 大于 | 
| >= | 大于等于 | 
| < | 小于 | 
| <= |  小于等于 | 

#### 七）逻辑操作符
```
&&: 表示同时满足两个条件；
||: 表示满足两个条件中的一个即可；
!: 表示取匹配结果的反值。
```
  1）取同时满足两个条件的结果&&
```
$ awk -F: '$3>=50 && $3<=100{print $1, $3}' /etc/passwd
```
  2) 满足一个或两个条件的结果 ||
```
$ awk -F: '$3>=50 || $3<=100{print $1, $3}' /etc/passwd
```
#### 八）条件表达式 (三目表达式)

  基本语法：判断条件 ? 条件为真时执行语句 : 条件为假时执行语句
```
$ awk -F: '{ $3>=500 ? usertype="common user" : usertype="system user"; print usertype, $1 }' /etc/passwd
```
#### 九）PATTERN 模式搜索

  该模式下支持扩展正则表达式，支持模糊搜索。

#### 1）如果未指定，空模式，匹配每一行，默认搜索每一行
```
$ awk '{print $0}' /etc/passwd
```
#### 2) /指定匹配字符/: 仅处理能够模式匹配的行需要使用 / / 括起来，假如匹配的行关键字中也有 / 的话，则需要使用 / 来转译。

  2.1）只有满足root为行首的行才会被匹配
```
$ awk '/^root/{print $0}' /etc/passwd
```
  2.2) 只要满足 r...t 条件的将全部匹配
```
$ awk '/r...t/{print $0}' /etc/passwd
```
#### 10) awk 控制语句

#### 1）if else
```
if（判断条件）{满足条件执行的语句} [else {不满足条件执行语句}
if（判断条件1）{满足条件1执行语句}else if （判断条件2{满足条件2时执行语句}else{不
满足上述两个条件执行语句]
```
实例一、根据UID判断系统中用户是系统用户还是普通用户
```
$ awk -F: '{if($3<=200){name="system"}else {name="user"} print $1,name}' /etc/passwd
```
实例二、将20到30的数相加
```
$ seq 50 |awk '{if($1>=20&&$1<=30){sum+=$1}}END{print sum}'
275
```
2) while 循环

  基本语法：{while (判断条件){循环语句}}，条件为真时，开始执行循环

实例一: 将每一行的和输出值终端
```
$ awk '{sum=0;i=1;while(i<=NF){sum+=$i ;i++}print sum}' demo2.txt
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/24.png" /> <br />

3) do while 循环

  基本语法：
```
do { 循环语句 } while (判断条件)，该语句和while唯一不同的是 循环一定执行一次，不管判断条件是否为真。
```
4）for 循环

等等。

#### 11）函数

  awk还提供了一些内置函数，方便对原始数据的处理。

  函数toupper()用于将字符转为大写。
```
$ awk -F ':' '{ print toupper($1) }' /etc/passwd
```
  上面代码中，第一个字段输出时都变成了大写。

  其他常用函数如下。
```
tolower()：字符转为小写。
length()：返回字符串长度。
substr()：返回子字符串。
sin()：正弦。
cos()：余弦。
sqrt()：平方根。
rand()：随机数。
```
awk内置函数的完整列表，可以查看手册。
或许还有更多的语法，可以看手册。这里总结一些常用的。








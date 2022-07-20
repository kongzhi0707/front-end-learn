
### shell 脚本全面学习

<div id="back"></div>

- [一) Shell简介](#id1) <br />
  - 1.1）什么是Shell？ <br />
  - 1.2）什么是Shell脚本？ <br />
  - 1.3) Shell 环境 <br />
- [二) 基本语法](#id2) <br />
  - 2.1) 解释器 <br />
  - 2.2) 注释 <br />
  - 2.3）echo <br />
  - 2.4）printf <br />
- [三) 变量](#id3) <br />
  - 3.1）变量命名原则<br />
  - 3.2）声明变量 <br />
  - 3.3）只读变量 <br />
  - 3.4）删除变量 <br />
  - 3.5）变量类型 <br />

- [四）字符串](#id4) <br />
  - 4.1）单引号和双引号<br />
  - 4.2）拼接字符串 <br />
  - 4.3）获取字符串长度 <br />
  - 4.4）截取子字符串 <br />

- [五）数组](#id5) <br />
  - 5.1）创建数组 <br />
  - 5.2) 访问数组元素 <br />
  - 5.3）访问数组的长度 <br />
  - 5.4）向数组中添加元素 <br />
  - 5.5）从数组中删除元素 <br />

- [六）运算符](#id6) <br />
  - 6.1）算术运算符 <br />
  - 6.2）关系运算符 <br />
  - 6.3）布尔运算符 <br />
  - 6.4）逻辑运算符 <br />
  - 6.5）字符串运算符 <br />

- [七）控制语句](#id7) <br />
  - 7.1）条件语句 if else <br />
  - 7.2) for 循环 <br />
  - 7.3）while 循环 <br />
  - 7.4) until 循环 <br />
  - 7.5）select 循环 <br />
  - 7.6) break 和 continue <br />

#### <div id="id1">一) Shell简介 <a href="#back"> 回到顶部</a></div>

#### 1.1）什么是Shell？

  Shell 是一个用C语言编写的程序，它是用户使用 Linux 的桥梁。Shell 的作用是解释执行用户的命令，用户输入一条命令，Shell 就解释执行一条，这种方式称为交互式。Shell 还有一种执行命令的方式称为批处理 (Batch)， 用户事先写一个Shell脚本，其中有很多条命令，让Shell一次把这些命令执行完，而不必一条一条的敲命令。
  Shell脚本和其他编程语言也是非常相似的。也有变量和流程控制语句。但是Shell脚本是解释型的，它不需要编译。

#### 1.2）什么是Shell脚本？

  Shell 脚本(shell script) 是一种为shell编写的脚本程序，一般文件后缀为 .sh.

#### 1.3) Shell 环境

  Shell 编程 和 java，php 编程一样，只要有一个能编写代码的文本编辑器 和 一个能解释执行的脚本解释器就可以了。

  Shell 的解释器种类有很多，常见的有如下两种：

  sh - 即 Bourne Shell。sh 是 Unix 标准默认的 shell。
  bash - 即 Bourne Again Shell。bash 是 Linux 标准默认的 shell。

#### 指定脚本解释器

  在shell脚本中， #! 告诉系统其后路径所指定的程序 即是解释此脚本文件的 Shell 解释器。 因此我们在shell脚本中，经常会看到如下指定脚本解释器：

#### 1）指定 sh 解释器
```
#!/bin/sh
```
#### 2) 指定 bash 解释器
```
#!/bin/bash

但是更好的写法是：

#!/usr/bin/env bash
```
  如果我们使用 #!/bin/bash，那么系统会选择老版本的bash来执行脚本，如果用#!/usr/bin/env bash，则会使用新版本。

#### 1.4) 如何编写脚本和执行脚本？
```
sh 脚本格式命名：

#! 后面指定的解释器 /bin/sh 解释执行

// vi 脚本名称.sh, 
```
  1) 我们在我们项目的指定目录下先创建一个 shell 脚本， 比如叫 test.sh
```
$ vi test.sh
```
  在 test.sh 文件中加入如下内容： 
```
#!/usr/bin/env bash
echo "hello world"
```
  添加了 hello world; 内容; 如上test.sh 是一个包含shell解释器可以识别并执行的命令的普通文本文件。sh 和 bash 是Shell解释器程序。

  2) 我们 还需要给他们添加 可执行权限，来直接执行脚本文件，如下：
```
chmod a+x test.sh  // 使脚本具有执行权限
```
3) 执行脚本有如下几种方式：
```
$ /bin/sh ./***.sh   // 不需要增加权限

$ source ./***.sh  // 交互式shell执行

$ . ./***.sh  // 交互式shell执行
```
如下直接结果：
```
tugenhua@192 shell % /bin/sh ./test.sh
hello world
tugenhua@192 shell % source ./test.sh
hello world
tugenhua@192 shell % . ./test.sh
hello world
```
#### 注意：source 或者 . 命令是Shell的内建命令，这种方式不会创建子 Shell，而是直接在交互式Shell下逐行执行脚本中的命令。

#### <div id="id2">二)：基本语法<a href="#back"> 回到顶部</a></div>

#### 2.1) 解释器

  在Shell脚本中， #! 是告诉系统其后 路径所指定的程序是解释此脚本文件的Shell解释器。#! 决定了脚本可以像一个独立的可执行文件一样执行，而不用在终端之前输入 sh 来执行文件。

  下面两种方式都可以指定 Shell 解释器 为 bash， 但是第二种方式更好:
```
#!/bin/bash
#!/usr/bin/env bash
```
#### 2.2) 注释

  注释可以说明我们的代码有什么作用，在Shell语法中。注释会被Shell解释器忽略，它只是代表该程序的一种说明及用途。

  1）单行注释: 以 # 开头，到行尾结束。
  2）多行注释: 以 :<<EOF 开头，到 EOF 结束。
```
#--------------------------------------------
# shell 单行注释示例
# author：zp
#--------------------------------------------

# echo '这是单行注释'

########## 这是分割线, 下面是多行注释 ##########

:<<EOF
echo '这是多行注释'
echo '这是多行注释'
echo '这是多行注释'
EOF
```

#### 2.3）echo

  echo 用于字符串的输出。

  1）输出普通字符串：
```
tugenhua@192 shell % echo "hello, world"
hello, world
```
  2) 输出含变量的字符串：
```
tugenhua@192 shell % name=zp
echo "hello, \"${name}\""
hello, "zp"
```
  3）输出含换行符的字符串：
```
tugenhua@192 shell % echo "YES\nNO"
YES
NO

tugenhua@192 shell % echo -e "YES\nNO"  # -e 开启转义
YES
NO
```
  4） 输出重定向至文件
```
tugenhua@192 shell % echo "test" > test.txt
tugenhua@192 shell % ls
test.sh         test.txt
```
  如上可以看到，我们把 test 输出到 test.txt 文件里面， 如果目录下没有 test.txt 文件，则会创建该文件。

  5）输出执行结果
```
tugenhua@192 shell % echo `pwd`
/Users/tugenhua/个人/learn/shell
```
  也就是 pwd 是当前目录的路径。我们直接执行 pwd，效果也是一样的。

#### 2.4）printf

  printf 用于格式化输出字符串。默认的情况下，printf 不会像 echo 那样自动添加换行符，如果我们需要换行的话，我们可以手动添加 \n.

  在了解之前，我们先来理解下 C 语言中的 printf 中的 %c, %d, %s, %f 分别是代表什么意思？
```
%d: 用来输出十进制整数。
%f: 用来输出实数 (包括单，双精度), 以小数形式输出，默认情况下保留小数点6位。
%c: 用来输出一个字符。
%s: 用来输出一个字符串。
```
  c语言 标识符 %-10s\t 什么意思？
```
- 代表左对齐，10表示字段宽度，s是字符串格式，\t是一个制表符的位置。\n 代表换行
```
  因此在我们的 shell 文件目录下， 新建 printf.sh 文件，添加如下测试：
```
#!/usr/bin/env bash
# 单引号
printf '%d %s\n' 1 "abc"
#  输出如下:1 abc

# 双引号
printf "%d %s\n" 1 "abc"
#  输出如下:1 abc

# 无引号
printf %s abcdef
#  输出如下: abcdef(并不会换行)

# 格式只指定了一个参数，但多出的参数仍然会按照该格式输出
printf "%s\n" abc def
#  输出如下:
#  abc
#  def

printf "%s %s %s\n" a b c d e f g h i j
#  输出如下:
#  a b c
#  d e f
#  g h i
#  j

# 如果没有参数，那么 %s 用 NULL 代替，%d 用 0 代替
printf "%s and %d \n"
#  输出如下:
#   and 0

# 格式化输出
printf "%-10s %-8s %-4s\n" 姓名 性别 体重kg
printf "%-10s %-8s %-4.2f\n" 郭靖 男 66.1234
printf "%-10s %-8s %-4.2f\n" 杨过 男 48.6543
printf "%-10s %-8s %-4.2f\n" 郭芙 女 47.9876
#  输出如下:
#  姓名     性别   体重kg
#  郭靖     男      66.12
#  杨过     男      48.65
#  郭芙     女      47.99
```
  在 命令行中执行脚本命令： /bin/sh ./printf.sh 控制台结果输出如下：
```
tugenhua@192 shell % /bin/sh ./printf.sh
1 abc
1 abc
abcdefabc
def
a b c
d e f
g h i
j  
 and 0 
姓名     性别   体重kg
郭靖     男      66.12
杨过     男      48.65
郭芙     女      47.99
```
#### <div id="id3">三）变量 <a href="#back"> 回到顶部</a></div>

  我们也可以像其他编程语言一样，在bash中我们也可以创建变量。

#### 3.1）变量命名原则
```
1）命名只能使用英文字母，数字和下划线，首个字符不能以数字开头。
2）中间不能有空格，可以使用下划线 (_).
3) 不能使用标点符号。
4）不能使用 bash 里面的关键字 (我们可以使用help命令查看保留的关键字)。
```
#### 3.2）声明变量

  访问变量可以有如下两种: ${var} 和 $var.

  变量名外面的花括号是可选的，加花括号是为了帮助解释器识别变量的边界。所以可以使用花括号。如下的输出：
```
tugenhua@192 shell % word="hello"
echo ${word}
hello
```
#### 3.3）只读变量

  我们使用 readonly 命令可以将变量定义为只读变量，只读变量的值不能被改变。
```
rword="hello"
echo ${rword}
readonly rword
# rword="bye" 如果我们放开注释，执行时会报错，比如如下执行结果可以看得到

tugenhua@192 shell % rword="hello"
echo ${rword}
readonly rword
rword="bye"
hello
zsh: read-only variable: rword
```
#### 3.4）删除变量

  我们使用 unset 命令可以删除变量。变量被删除后不能被再次使用，但是 unset 命令不能删除只读变量。
```
tugenhua@192 shell % dword="hello" 
echo ${dword}

unset dword
echo ${dword}
hello
// 输出空
```
#### 3.5）变量类型

  1）局部变量：局部变量是仅在某个脚本内部有效的变量。它们不能被其他的程序和脚本访问。
  2）环境变量：环境变量是对当前 shell 会话内所有的程序或脚本都可见的变量。创建它们和创建局部变量类似，但是使用的是 export 关键字，shell脚本也可以定义环境变量。

  shell 设置环境变量的 基本语法如下：

  export 变量名=变量值 （功能描述：将 shell 变量输出为环境变量/全局变量）

#### 环境变量的设置

  环境变量和用户自定义变量最主要的区别在于，环境变量是全局变量，而用户自定义变量是局部变量。用户自定义变量只在当前的 Shell 中生效，而环境变量会在当前 Shell 和这个 Shell 的所有子 Shell 中生效。如果把环境变量写入相应的配置文件，那么这个环境变量就会在所有的 Shell 中生效。

  这是有区别的，如果环境变量不写入配置文件，那么当前 Shell 一旦终止，这个环境变量就会消失，而只有写入配置文件才会永久地在所有 Shell 中生效。

  我们可以使用 export 命令将变量声明为环境变量，命令如下：
```
tugenhua@192 shell % export age="18"
```
  如上 使用 export 声明的变量就是环境变量。

  我们可以在命令行中使用 set 命令来查询下刚刚设置的 age = "18" 的环境变量。

#### 环境变量查询和删除

  set 即可以查询所有的变量，也可以查询环境变量，我们上面使用 set 命令进行环境变量查询，当然，我们也可以使用 env 命令进行环境变量查询，命令如下：
```
USER=tugenhua
__CFBundleIdentifier=com.microsoft.VSCode
COMMAND_MODE=unix2003
LOGNAME=tugenhua
PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/opt/homebrew/bin:/opt/homebrew/sbin
SSH_AUTH_SOCK=/private/tmp/com.apple.launchd.AQD01fnuij/Listeners
SHELL=/bin/zsh
HOME=/Users/tugenhua
__CF_USER_TEXT_ENCODING=0x1F5:0x19:0x34
TMPDIR=/var/folders/hx/xlxh333s4h7d3hlnrvnyyr9c0000gn/T/
XPC_SERVICE_NAME=0
XPC_FLAGS=0x0
ORIGINAL_XDG_CURRENT_DESKTOP=undefined
SHLVL=1
PWD=/Users/tugenhua/个人/learn/front-end-learn
OLDPWD=/Users/tugenhua/个人/learn
HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles/bottles
HOMEBREW_PREFIX=/opt/homebrew
HOMEBREW_CELLAR=/opt/homebrew/Cellar
HOMEBREW_REPOSITORY=/opt/homebrew
MANPATH=/opt/homebrew/share/man:/usr/share/man:/usr/local/share/man:/opt/homebrew/share/man:
INFOPATH=/opt/homebrew/share/info:/opt/homebrew/share/info:
TERM_PROGRAM=vscode
TERM_PROGRAM_VERSION=1.65.0
LANG=zh_CN.UTF-8
COLORTERM=truecolor
VSCODE_GIT_IPC_HANDLE=/var/folders/hx/xlxh333s4h7d3hlnrvnyyr9c0000gn/T/vscode-git-f3716b6770.sock
GIT_ASKPASS=/private/var/folders/hx/xlxh333s4h7d3hlnrvnyyr9c0000gn/T/AppTranslocation/890DC269-029B-40C5-9A90-FDC2F72BB702/d/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh
VSCODE_GIT_ASKPASS_NODE=/private/var/folders/hx/xlxh333s4h7d3hlnrvnyyr9c0000gn/T/AppTranslocation/890DC269-029B-40C5-9A90-FDC2F72BB702/d/Visual Studio Code.app/Contents/MacOS/Electron
VSCODE_GIT_ASKPASS_EXTRA_ARGS=--ms-enable-electron-run-as-node
VSCODE_GIT_ASKPASS_MAIN=/private/var/folders/hx/xlxh333s4h7d3hlnrvnyyr9c0000gn/T/AppTranslocation/890DC269-029B-40C5-9A90-FDC2F72BB702/d/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js
TERM=xterm-256color
_=/usr/bin/env
```
#### env 和 set 命令的区别是：set 命令可以查看所有的变量，而 env 命令只能查看环境变量。我们可以发现系统默认有很多环境变量。

##### 环境变量删除

  环境变量的删除 和 用户自定义变量是一样的，都使用 unset 命令，命令如下：
```
unset age
```
  我们可以继续使用 set 命令查看下， 发现没有我们的 age 环境变量了。

  常见的系统默认的环境变量有如下：

| 变量         | 描述                                          ｜
|:------------|-----------------------------------------------: 
| $HOME       |  当前用户的用户目录                              |
| $PATH       |  用分号分隔的目录列表，shell 会到这些目录中查找命令  |
| $PWD        |  当前工作目录                                   |
| $RANDOM     |  0 到 32767 之间的整数                          |
| $UID        |  数值类型，当前用户的用户 ID                      |
| $PS1        |  主要系统输入提示符                              |
| $PS2        |  次要系统输入提示符                              |

#### <div id="id4">四）字符串 <a href="#back"> 回到顶部</a></div>

#### 4.1）单引号和双引号

  shell 字符串可以使用单引号 '', 也可以使用 双引号 "", 还可以不用引号。

  单引号的特点：
```
  1）单引号里不识别变量。
  2）单引号不能出现单独的单引号, 但可成对出现，作为字符串拼接使用。
```
  双引号的特点：
```  
  1）双引号里面可以识别变量。
  2）双引号里面可以出现转义字符。
```
#### 4.2）拼接字符串。

  我们可以新建一个 string.sh 脚本文件；在里面添加如下代码：
```
#!/usr/bin/env bash
# 使用单引号拼接
name1='kongzhi'
str1='hello, '${name1}''
str2='hello, ${name1}'
echo ${str1}_${str2} # 输出 hello, kongzhi_hello, ${name1}

# 使用双引号拼接
name2="kongzhi2"
str3="hello, "${name2}""
str4="hello, ${name2}"
echo ${str3}_${str4} # 输出 hello, kongzhi2_hello, kongzhi2
```
执行结果如下：
```
tugenhua@192 shell % /bin/sh ./string.sh
hello, kongzhi_hello, ${name1}
hello, kongzhi2_hello, kongzhi2
```
我们可以看到，单引号里面不能识别变量，双引号里面可以识别变量， 因此我们一般推荐使用双引号。

#### 4.3）获取字符串长度
```
tugenhua@192 shell % text="12345"
echo ${#text}
5
```
如上可以看到 使用 ${#变量} 可以获取字符串的长度。

#### 4.4）截取子字符串
```
tugenhua@192 shell % text="12345"
echo ${text:2:2}
34
```
  使用的语法是 ${变量:2:2}, 第一个冒号后面的2，是指从第几个字符开始截取，默认索引是从0开始，因此2是从第三个字符开始，第二个冒号的2，是指截取几个字符。因此截取2个字符，最后返回34.

#### <div id="id5">五）数组 <a href="#back"> 回到顶部</a></div>

  bash 只支持一维数组。数组下标从0开始，下标可以是整数或算术表达式，其值应大于或等于0.

#### 5.1）创建数组
```
// 创建数组的不同方式
nums=([2]=2 [0]=0 [1]=1)
colors=(red yellow "dark blue")
```
#### 5.2) 访问数组元素
```
// 访问数组的单个元素
echo ${nums[1]} # 输出 1

// 访问数组的所有元素
echo ${colors[*]}
// 输出: red yellow dark blue

echo ${colors[@]}
// 输出: red yellow dark blue
```
我们可以新建一个 arrs.sh 文件，加入如下代码：
```
#!/usr/bin/env bash
# 创建数组的不同方式
nums=([2]=2 [0]=0 [1]=1)
colors=(red yellow "dark blue")

# 访问数组的单个元素
echo ${nums[1]} # 输出 1

# 访问数组的所有元素
echo ${colors[*]}
# 输出: red yellow dark blue

echo ${colors[@]}
# 输出: red yellow dark blue
```
然后我们执行效果如下：
```
tugenhua@192 shell % /bin/sh ./arrs.sh
1
red yellow dark blue
red yellow dark blue
```
#### 5.3）访问数组的长度
```
echo ${#nums[*]}; // 打印 3
```
#### 5.4）向数组中添加元素
```
# 向数组中添加元素
colors=(white "${colors[@]}" green black)
echo ${colors[@]}
# 输出 white red yellow dark blue green black
```
上面的例子中，${colors[@]} 扩展为整个数组，并被置换到复合赋值语句中，然后，对数组colors的赋值覆盖了它原来的值。

#### 5.5）从数组中删除元素

用unset命令来从数组中删除一个元素：
```
# 用unset命令来从数组中删除一个元素：
unset nums[0]
echo ${nums[@]}  # 输出 1 2
```

然后我们的 arrs.sh 所有代码如下：
```
#!/usr/bin/env bash
# 创建数组的不同方式
nums=([2]=2 [0]=0 [1]=1)
colors=(red yellow "dark blue")

# 访问数组的单个元素
echo ${nums[1]} # 输出 1

# 访问数组的所有元素
echo ${colors[*]}
# 输出: red yellow dark blue

echo ${colors[@]}
# 输出: red yellow dark blue

echo ${#nums[*]}
# 打印出 3

# 向数组中添加元素
colors=(white "${colors[@]}" green black)
echo ${colors[@]}
# 输出 white red yellow dark blue green black

# 用unset命令来从数组中删除一个元素：
unset nums[0]
echo ${nums[@]}  # 输出 1 2
```

我们进入对应的目录下执行: /bin/sh ./arrs.sh 即可看到效果。

#### <div id="id6">六）运算符 <a href="#back"> 回到顶部</a></div>

#### 6.1）算术运算符

  下表列出了常用的算术运算符，假定变量 x 为 10，变量 y 为 20：

| 运算符   | 说明                                  ｜ 举例                         ｜
|:--------|---------------------------------------|------------------------------: 
| +       |  加法                                  | expr $x + $y = 30           |
| -       |  减法                                  | expr $x - $y = -10          |
| *       |  乘法                                  | expr $x * $y = 200          |
| /       |  除法                                  | expr $y / $x = 2            |
| %       |  取余                                  | expr $y % $x = 0            |
| =       |  赋值                                  | x=$y 把变量y的值赋给x         ｜
| ==      |  相等。用于比较两个数字，相同则返沪true     | [ $x == $y ] 返回false       |
| !=      |  不相等，用于比较两个数字，不相同则返回true  | [ $x != $y ] 返回true       |

#### 注意：条件表达式要放在方括号之间，并且要有空格，例如: [$x==$y] 是错误的，必须写成 [ $x == $y ]。且 val=`expr ${y} % ${x}` val和运算符之间不能有空格。

我们可以新建一个 operator.sh 文件，代码如下：
```
#!/usr/bin/env bash
x=10
y=20

echo "x=${x}, y=${y}";  # 输出 x=10, y=20

val=`expr ${x} + ${y}`
echo "${x} + ${y} = $val" # 输出 10 + 20 = 30

val=`expr ${x} - ${y}`
echo "${x} - ${y} = $val" # 输出 10 - 20 = -10

val=`expr ${x} \* ${y}`
echo "${x} * ${y} = $val" # 输出 10 * 20 = 200

val=`expr ${y} / ${x}`
echo "${y} / ${x} = $val" # 输出 20 / 10 = 2

val=`expr ${y} % ${x}`
echo "${y} % ${x} = $val" # 输出 20 % 10 = 0
```
#### 6.2）关系运算符

  关系运算符只支持数字，不支持字符串，除非字符串的值是数字。

  下表列出了常用的关系运算符，假设变量 x 为10，变量y为20；

| 运算符   | 说明                                       ｜ 举例                         ｜
|:--------|--------------------------------------------|------------------------------: 
| -eq     |  检测两个数是否相等，相等返回true               | [ $x -eq $y ] 返回false      |
| -ne     |  检测两个数是否相等，不相等返回true             | [ $x -ne $y ] 返回true       |
| -gt     |  检测左边的数是否大于右边的，如果是，返回true     | [ $x -gt $y ] 返回false      |
| -lt     |  检测左边的数是否小于右边的，如果是，返回true     | [ $x -lt $y ] 返回true       |
| -ge     |  检测左边的数是否大于等于右边的，如果是，返回true  | [ $x -ge $y ] 返回false      |
| -le     |  检测左边的数是否小于等于右边的，如果是，返回true  | [ $x -le $y ] 返回true       ｜
```
#!/usr/bin/env bash
x=10
y=20

if [[ ${x} -eq ${y} ]]; then
   echo "${x} -eq ${y} : x 等于 y"
else
   echo "${x} -eq ${y}: x 不等于 y" # 输出 10 -eq 20: x 不等于 y
fi

if [[ ${x} -ne ${y} ]]; then
   echo "${x} -ne ${y}: x 不等于 y" # 输出 10 -ne 20: x 不等于 y
else
   echo "${x} -ne ${y}: x 等于 y"
fi

if [[ ${x} -gt ${y} ]]; then
   echo "${x} -gt ${y}: x 大于 y"
else
   echo "${x} -gt ${y}: x 不大于 y" # 输出 10 -gt 20: x 不大于 y
fi

if [[ ${x} -lt ${y} ]]; then
   echo "${x} -lt ${y}: x 小于 y" # 输出 10 -lt 20: x 小于 y
else
   echo "${x} -lt ${y}: x 不小于 y"
fi

if [[ ${x} -ge ${y} ]]; then
   echo "${x} -ge ${y}: x 大于或等于 y"
else
   echo "${x} -ge ${y}: x 小于 y"  # 输出 10 -ge 20: x 小于 y
fi

if [[ ${x} -le ${y} ]]; then
   echo "${x} -le ${y}: x 小于或等于 y" # 输出 10 -le 20: x 小于或等于 y
else
   echo "${x} -le ${y}: x 大于 y"
fi
```
#### 6.3）布尔运算符

  下表列出了常用的布尔运算符。假设变量 x 为 10，变量 y 为 20.

| 运算符   | 说明                                          ｜ 举例                                   ｜
|:--------|---------------------------------------------- |----------------------------------------: 
| !       |  非运算，表达式为true，则返回false，否则返回true    | [ ! false ] 返回true                   |
| -o      |  或运算，有一个表达式为true，则返回true            | [ $x -lt 20 -o $y -gt 100 ] 返回 true。 |
| -a      |  与运算，两个表达式都为true，才返回true            | [ $x -lt 20 -a $y -gt 100 ] 返回 false。|
```
#!/usr/bin/env bash
x=10
y=20

echo "x=${x}, y=${y}"

if [[ ${x} != ${y} ]]; then
   echo "${x} != ${y} : x 不等于 y" # 输出: 10 != 20 : x 不等于 y
else
   echo "${x} != ${y}: x 等于 y"
fi

if [[ ${x} -lt 100 && ${y} -gt 15 ]]; then
   echo "${x} 小于 100 且 ${y} 大于 15 : 返回 true" # 输出: 10 小于 100 且 20 大于 15 : 返回 true
else
   echo "${x} 小于 100 且 ${y} 大于 15 : 返回 false"
fi

if [[ ${x} -lt 100 || ${y} -gt 100 ]]; then
   echo "${x} 小于 100 或 ${y} 大于 100 : 返回 true" # 输出：10 小于 100 或 20 大于 100 : 返回 true
else
   echo "${x} 小于 100 或 ${y} 大于 100 : 返回 false"
fi

if [[ ${x} -lt 5 || ${y} -gt 100 ]]; then
   echo "${x} 小于 5 或 ${y} 大于 100 : 返回 true"
else
   echo "${x} 小于 5 或 ${y} 大于 100 : 返回 false" # 输出：10 小于 5 或 20 大于 100 : 返回 false
fi
```
#### 6.4）逻辑运算符

| 运算符   | 说明         ｜ 举例                                            ｜
|:--------|------------- |-------------------------------------------------: 
| &&      |  逻辑的AND    | [[ ${x} -lt 100 && ${y} -gt 100 ]] 返回 false    |
| ||      |  逻辑的OR     | [[ ${x} -lt 100 || ${y} -gt 100 ]] 返回 true     |

我们假设变量 x 为10，变量 y 为 20
```
#!/usr/bin/env bash
x=10
y=20

echo "x=${x}, y=${y}" # 打印: x=10, y=20

if [[ ${x} -lt 100 && ${y} -gt 100 ]]
then
  echo "${x} -lt 100 && ${y} -gt 100 返回 true"
else
  echo "${x} -li 100 && ${y} -gt 100 返回 false" # 打印 10 -li 100 && 20 -gt 100 返回 false
fi


if [[ ${x} -lt 100 || ${y} -gt 100 ]]
then
  echo "${x} -lt 100 || ${y} -gt 100 返回 true" # 打印：10 -lt 100 || 20 -gt 100 返回 true
else
  echo "${x} -li 100 || ${y} -gt 100 返回 false"
fi
```
#### 6.5）字符串运算符

下表列出了常用的字符串运算符，假定变量 a 为 "abc"，变量 b 为 "efg"：

| 运算符   | 说明                                ｜ 举例                       ｜
|:--------|-------------------------------------|----------------------------: 
| =       |  检测两个字符是否相等，相等返回true      | [ $a = $b ] 返回 false。    |
| !=      |  检测两个字符是否相等，不相等返回true    ｜ [ $a != $b ] 返回 true     ｜
| -z      |  检测字符串长度是否为0，为0返回true      | [ -z $a ] 返回 false。      |
| -n      |  检测字符串长度是否为0，不为0返回true    |  [ -n $a ] 返回 true。      |
| str     |  检测字符串是否为空，不为空返回true      |  [ $a ] 返回 true。         |
```
#!/usr/bin/env bash
x="abc"
y="xyz"

echo "x=${x}, y=${y}" # 输出：x=abc, y=xyz

if [[ ${x} = ${y} ]]; then
   echo "${x} = ${y} : x 等于 y"
else
   echo "${x} = ${y}: x 不等于 y" # abc = xyz: x 不等于 y
fi

if [[ ${x} != ${y} ]]; then
   echo "${x} != ${y} : x 不等于 y" # abc != xyz : x 不等于 y
else
   echo "${x} != ${y}: x 等于 y"
fi

if [[ -z ${x} ]]; then
   echo "-z ${x} : 字符串长度为 0"
else
   echo "-z ${x} : 字符串长度不为 0" # -z abc : 字符串长度不为 0
fi

if [[ -n "${x}" ]]; then
   echo "-n ${x} : 字符串长度不为 0" # -n abc : 字符串长度不为 0
else
   echo "-n ${x} : 字符串长度为 0"
fi

if [[ ${x} ]]; then
   echo "${x} : 字符串不为空" # abc : 字符串不为空
else
   echo "${x} : 字符串为空"
fi
```
#### <div id="id7">七）控制语句 <a href="#back"> 回到顶部</a></div>

#### 7.1）条件语句

  Bash 中的条件语句是由 [[ ]] 包起来的表达式被称作 检测命令 或 基元。该表达式能帮助我们检测一个条件的结果。

#### 1）if

  if 和其他语言一样，如果中括号里的表达式为真，那么then和fi之间的代码会被执行。fi 代表条件代码块的结束。
```
#!/usr/bin/env bash
# 写成一行 如果 1 等于 1 的话，输出值： 1 -eq result is: true
if [[ 1 -eq 1 ]]; then echo "1 -eq result is: true"; fi 

# 写成多行形式 输出值：abc -eq abc result is: true
if [[ "abc" -eq "abc" ]]
then
  echo ""abc" -eq "abc" result is: true"
fi
```
#### 2）if else 语句
```
#!/usr/bin/env bash
# 如果2不等于1 返回true 否则的话 返回false
if [[ 2 -ne 1 ]]; then
  echo "true"
else 
  echo "false"
fi
```
#### 3）if elif else 语句
```
#!/usr/bin/env bash
x=10
y=20

if [[ ${x} > ${y} ]]; then 
  echo "${x} > ${y}";
elif [[ ${x} < ${y} ]]; then 
  echo "${x} < ${y}"
else 
  echo "${x} == ${y}";
fi
```
#### 7.2) for 循环

基本语法如下：
```
for i in elem1 elem2 ... elemN
do
  ### 语句
done
```
  在每次循环中，i 依次被赋值为 从 elem1 到 elemN. 我们也可以把 for 循环写在一行，但是这要求 do 之前要有一个分号，如下：
```
for i in {1..5}; do echo ${i}; done  // 输出 1 2 3 4 5
```
  我们也可以如下使用：
```
#!/usr/bin/env bash

for (( i = 0; i < 10; i++)); do
  echo ${i};
done
```
如果我们想对一个目录下的所有文件做同样的操作时，for循环就很方便了，如果我们想把所有的 .bash 文件移动到 scripts 文件夹中。我们的脚本可以如下写：
```
#!/usr/bin/env bash
# 将 /home/zp 目录下所有 sh 文件拷贝到 /home/zp/scripts 下
DIR=/home/zp
for FILE in ${DIR}/*.sh; do
  mv "${FILE}" "${DIR}/scripts"
done
```
#### 7.3）while 循环

while 循环检测一个条件，只要这个条件为真，就执行一段命令。while 使用如下：
```
while [[ condition ]]
do
  ### 语句
done
```
和 for 循环一样，如果我们把do和被检测的条件写到一行的话，那么必需要在do之前加一个分号。如下：
```
#!/usr/bin/env bash
# 输出: 0 1 4 9 16 25 36 49 64 81
x=0
while [[ ${x} -lt 10 ]]; do
  echo $((x * x))
  x=$((x+1))
done
```
#### 7.4) until 循环

  until 循环 和 上面的 while 循环正好相反。它和while一样也需要检测一个测试条件，但是不同的是，只要该条件 为假 就一致执行循环。

如下代码：
```
#!/usr/bin/env bash
# 输出 0 1 2 3 4
x=0
until [[ ${x} -ge 5 ]]; do
  echo ${x};
  x=`expr ${x} + 1`
done
```
#### 7.5）select 循环

select 循环帮助我们组织一个用户菜单。他的语法和for循环一样的。如下代码：
```
select answer in elem1 elem2 .... elemN
do
  ### 语句
done
```
  select 会打印 elem1..elemN 以及他们的序列号到屏幕上，之后会提示用户输入。一般会看到的是 $?, 用户选择的结果会被保存到answer中，如果answer是一个 1..N之间的数字，那么语句会被执行。紧接着会进行下一次迭代。我们也可以使用break语句跳出。
```
#!/usr/bin/env bash
PS3="choose the package manager: "
select ITEM in bower npm gem pip
do
echo -n "Enter the package name: " && read PACKAGE
case ${ITEM} in 
  bower) bower install ${PACKAGE} ;;
  npm) npm install ${PACKAGE} ;;
  gem) gem install ${PACKAGE} ;;
  pip) pip install ${PACKAGE} ;;
esac
break # 避免无限循环
done
```
  我们把上面的bash语句存入一个文件里面， 然后执行bash语句命令：

 /bin/sh ./oif.sh

 <img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/shell/images/1.png" /> <br />

 如上我们看到，会先询问我们想使用什么包管理器，接着，又询问了想安装什么包，最后执行安装操作。在我们的目录下生成一个npm包，如下所示:

 <img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/shell/images/2.png" /> <br />

#### 7.6) break 和 continue

如果我们想提前结束一个循环或跳过某次循环执行的话，我们可以使用 break 或 continue 语句来执行。

  break 语句是用来提前结束当前循环
  continue 语句是用来跳过某次迭代

```
#!/usr/bin/env bash
# 查找 10 以内第一个能整除 2 和 3 的正整数 输出 6
i=1
while [[ ${i} -lt 10 ]]; do
  if [[ $((i % 3)) -eq 0 ]] && [[ $((i%2)) -eq 0 ]]; then
    echo ${i}
    break;
  fi
  i=`expr ${i} + 1`
done

#!/usr/bin/env bash
# 打印10以内的奇数 输出：1 3 5 7 9
for (( i = 0; i < 10; i++)); do
  if [[ $((i % 2)) -eq 0 ]]; then
    continue;
  fi
  echo ${i}
done
```






















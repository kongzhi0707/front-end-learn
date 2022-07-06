
### xargs命令教程
```
  xargs 是Unix系统的一个命令，xargs可以将管道或标准输入(stdin)数据转换成命令行参数，也能够从文件的输出中读取数据。
  xargs命令可以通过管道接收字符串，并将接收到的字符串通过空格分割成许多参数(默认情况下是通过空格分割)，然后将参数传递给其后面的命令，作为后面命令的命令行参数。
```
  比如如下命令 输出："hello world";
```
echo "hello world" | xargs
```
  默认以 echo作为输出，即等价于echo "hello world" | xargs echo
  默认以空格作为界定符，换行和空白将被 空格取代。

  上面的代码使用了管道命令 | , 管道命令的作用：是将左侧字符串 "hello world" 的标准输出转换为 标准输入，提供给右侧命令 echo 作为命令行参数。因此就变成：
```
$ echo "hello world"; 
```
  最后输出 "hello world";

  xargs 命令的格式如下：
```
$ xargs [ -options] [command]
```
  真正执行的命令，是紧跟在 xargs 后面的那个命令，它接收 xargs 前面传来的参数。

  xargs 可以和其他命令 (比如 rm, mkdir, ls) 与管道一起使用。比如如下代码：
```
$ echo "one two three" | xargs mkdir
```
  上面的代码等同于 mkdir one two three. 

#### 2) xargs 的单独使用

  xargs 后面的命令默认是 echo。
```
$ xargs 
// 等同于
$ xargs echo
```
  当我们上面输入 xargs 按下回车以后，命令行就会等待用户输入，作为标准输入。我们可以输入任何内容，当我们按下  ctrl + d 键后，表示输入结束。这时 echo
  命令就会把前面的输入打印出来。
```
tugenhua@192 / % xargs
aa
aa (按ctrl+d键后)
aa aa
```
#### 3) -d参数 与 分隔符

  默认情况下，以空格作为界定符，换行和空白将被 空格取代。把标准 输入分解成一个个命令行参数。
```
$ echo "one two three" | xargs mkdir
```
  如上命令，mkdir 会新建三个子目录，因为 xargs 将 one two three 分解成三个命令行参数，执行 mkdir one two three.

  -d 参数可以更改分隔符。
```
$ echo "helloXworld" | xargs -d X
```
  上面的命令指定 X 作为分隔符，因此 helloXworld 就转换成了命令行参数，因此输出 "hello world"; 如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/2.png" /> <br />

#### 4）-p 参数，-t参数

  -p 参数打印出要执行的命令，询问用户是否要执行；
```
[root@iZ2zeds62pwbss0ax04ja6Z ~]# echo 'one two three' | xargs -p touch
touch one two three ?...Y 
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/3.png" /> <br />

  上面的命令执行以后，回打印出最终要执行的命令，让用户确认，用户输入y(大小写都可以)以后，才会真正执行。

  -t 参数则是打印出最终要执行的命令，然后直接执行，不需要用户确认。
```
[root@iZ2zeds62pwbss0ax04ja6Z ~]# echo 'one two three' | xargs -t rm
rm one two three 
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/4.png" /> <br />

  如上所示；当我执行命令：echo 'one two three' | xargs -t rm 后，回车，会直接把上面三个文件直接删除掉，不需要询问。

#### 5）-o 参数 和 find 命令

  由于 xargs 默认将空格作为分隔符，因此不太适合处理文件名，因为文件名可能包含空格。
  find 命令有一个特别的参数 -print0, 指定输出的文件列表以 null 分割，然后 xrags 命令的 -0 参数表示用 null 作为分隔符。
```
$ find /path -type f -print0 | xargs -0 rm
```
  上面的命令的含义是：删除 /path 路径下的所有文件，由于分隔符是 null， 所以处理包含空格的文件名。

#### 6）-L参数

  如果标准输入包含多行，-L 参数指定多少行作为一个命令行参数。
```
$ echo -e "a\nb\nc" | xargs -L 1
```
  echo命令的-e参数表示解释转义字符。

  上面 命令指定了每一行 (-L 1) 作为命令行参数，分别运行一次命令。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/5.png" /> <br />

#### 7）-n 参数

  上面 -L参数虽然解决了多行的问题，但是有时候用户会在同一行输入多项。
  -n 参数指定每次将多少项，作为命令行参数。

  比如如下代码：
```
$ xargs -n 1 find -name
```
  上面命令指定将每一项 (-n 1) 标准输入作为命令行参数，分别执行一次命令 (find -name).

如下列子：
```
$ echo {0..9} | xargs -n 2
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/6.png" /> <br />

  上面命令指定，每2个参数运行一次 echo 命令，因此 10个数字运行了5次echo命令，输出了5行。

#### 8）-I 参数

  如果 xargs 要将命令行参数传给多个命令，可以使用 -I 参数。
  -I 指定每一项命令后参数的替代字符串。

  我们先创建一个 foo.txt，使用 touch foo.txt 命令，然后使用 vim foo.txt 查看内容，然后输入 one two three 字符后，保存，现在使用 cat foo.txt
查看文件如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/7.png" /> <br />
```
$ cat foo.txt | xargs -I file sh -c 'mkdir file'
$ ls 
one two three
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/8.png" /> <br />

  上面代码中，foo.txt 是一个三行的文本文件，我们希望对每一项命令行参数，执行命令 mkdir， 使用 -I file 表示 file 是命令行参数的替代字符串。执行命令时，具体的参数会替代掉 mkdir file 里面的file。








### 学习ShellJS使用

  shelljs 是 Unix Shell 在 Node.js API层的轻量级实现，可以支持 Windows， Linux， OS X, shellJS 模块重新包装了 child_process， 使得调用系统命令更加简单， 了解 child_process, 可以看我之前的<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/child_process.md">child_process文章</a>。

#### 一: shelljs的安装

shelljs 是第三方模块，需要安装后才能使用。

#### 1）全局安装
```
$ npm install shelljs -g
```
#### 2) 局部安装
```
$ npm install shelljs --save
```
#### 二：API 使用

#### 2.1）shelljs.which(command)

  在环境变量PATH中寻找指定命令的地址，判断该命令是否可执行，并且返回该命令的绝对地址；
  和linux中的 which 命令功能类似；

  使用demo示列如下:
```
const shelljs = require('shelljs');

//判定git命令是否可用
if (!shelljs.which('git')) {
	//向命令行打印git命令不可用的提示信息
  shelljs.echo('Sorry, this script requires git');
  //退出当前进程
  shelljs.exit(1);
}

console.log('---xxx---', shelljs.which('git').stdout); // 返回该bin目录下的绝对地址 '/usr/bin/git' .stdout 是标准输出
```
#### 2.2) shelljs.echo

在控制台中输出指定内容。

使用demo示列如下:
```
// 在控制台中打印如下信息

shelljs.echo('Sorry, this script requires git');
```
#### 2.3）shelljs.exit(code)

以退出码为code退出当前进程。code 等于0，表示成功，code 非0 表示失败。

#### 2.4）shelljs.rm([options, ] file[, file...])

  删除一个目录中的一个或多个文件或目录，一旦删除，无法恢复。
  常用参数：
```
1）-f: 强制删除文件
2）-i: 删除之前先询问用户；
3）-r: 递归处理目录；
4）-v: 显示处理过程；
```
比如我们项目的目录下 有 test/a.js 文件目录，
```
const shelljs = require('shelljs');

shelljs.rm('-rf', 'test/a.js');
```
如上命令就可以把 test/a.js 文件删除掉。
```
const shelljs = require('shelljs');
shelljs.rm('-rf', 'test');
```
执行如上命令就可以把当前目录下的test目录全部删除掉。

#### 2.5）shelljs.cp([options,] source_array, dest)

常用的参数为: '-R' 或 '-r', 递归处理，将指定目录下的文件与子目录一并处理。

用来将一个或多个源文件或目录复制到指定的文件或目录。

比如我们目录是如下的
```
|--- test
|--- dist
| |--- a.js
| |--- b.js
```
我现在想把 dist 目录复制到 test 目录下面，变成 test/dist/** 文件。执行命令如下:
```
const shelljs = require('shelljs');

shelljs.cp('-R', 'dist/', 'test');
```
但是源文件 dist/* 并不会删除， 只是把目录复制到 test 文件夹内。最后就变成了如下目录文件了；如下：
```
|--- test
| |--- dist
| | |--- a.js
| | |--- b.js
|--- dist
| |--- a.js
| |--- b.js
```
#### 2.6) shelljs.cd

切换工作目录至指定的相对路径或绝对路径。cd.. 为返回上一级，cd- 回到前一目录。

#### 2.7）shelljs.ls

用来显示目录列表。

常用参数：
```
1）-a: 显示所有文件。
2）-C: 多列显示查询结果。
3）-l: 单列长格式显示查询结果(与-C相反)。
4）-R: 递归处理目录；
5）-A: 所有文件
6）-d: 列出目录本身， 而不是其内容。
```
演示代码如下：
```
const shelljs = require('shelljs');
const path = require('path');

shelljs.ls(path.join('dist', '/')).forEach(item => {
  // 打印 ---item--- a.js
  // 打印 ---item--- b.js
  console.log('---item----', item);
});
```
#### 2.8) shelljs.sed([options,] search_regex, replacement, file_array)

将 file_array 中符合 search_regex 的内容替换为 replacement。支持正则的捕获组自引用。一次处理一行内容，处理完成后把缓冲区内容送往屏幕，然后处理下一行，循环直至结束。

常用参数：

-i: 直接作用源文件。

目录结构如下：
```
|--- index.js
|--- dist
| |--- a.js
| |--- b.js
```
dist/a.js 代码如下：
```
const ss = 'aaaa';
```
dist/b.js 代码如下：
```
const ss = 'bbbbb';
```
index.js 代码如下：
```
const shelljs = require('shelljs');

shelljs.cd('dist'); // 切换当前工作目录 dist 下
shelljs.ls(['*.js']).forEach(file => {
  shelljs.sed('-i', 'aaaa', 'testA', file);
  shelljs.sed('-i', 'bbbbb', 'testB', file);
});
```
  如上代码的含义：当前是在 index.js 目录下执行命令， 我们首先 使用 shelljs.cd('dist'); 切换到工作目录dist目录下，然后使用 shelljs.ls(['*.js']).forEach 遍历当前dist目录下的所有js文件， 把 dist/a.js 中的代码 const ss = 'aaaa'; 替换成 const ss = 'testA'; 把 dist/b.js 中的代码 const ss = 'bbbbb'; 替换成 const ss = 'testB'; 执行完成后就可以看到效果了。

#### 2.9）shelljs.cat([options,] file [, file ...])

  将一个或多个文件内容读入，指定一个文件时读入该文件，指定多个文件时将内容连接在一起读入。

可用选项：
```
-n: number all output lines
```
#### 2.10) shelljs.exec(command [, options] [, callback])
```
command <String>: 要在命令行执行的完整命令；
options <Object>: 可选参数，JSON对象如下：
  1）async: 是否异步执行，默认为false，传入callback时自动开启。
  2）slient：不输出信息到console，默认为false。
  3）encoding: 默认为utf8
```
演示代码如下：
```
const shelljs = require('shelljs');
var version = shelljs.exec('node --version', { silent: true }).stdout;
console.log('---version---', version); // ---version--- v18.7.0
```
#### 2.11）shelljs.chmod 

设置文件调用权限
```
u: 表示该文件拥有者
g: 表示同一群体者，
o: 表示其他
a: 表示所有
+: 表示增加权限
-: 表示取消权限
=: 表示唯一设定权限
r: 表示可读
w: 表示可写
x: 表示可执行
X: 表示当该文件是个子目录
```
演示代码如下：
```
shelljs.chmod(755, '/dist/xxx');
shelljs.chmod('755', '/dist/xxx');
shelljs.chmod('u+x', '/dist/xxx');
shelljs.chmod('-R', 'a-w', '/dist/xxx');
```
#### 2.12) shelljs.find(path [, path...])

查找文件
```
shelljs.find('/dist/a.js');
```
返回 path_array; 路径数组。

#### 2.13）shelljs.grep([options, ] regex_filter, file[, file...])

grep 用于查找内容。

可用选项：
```
-v: 反转正则表达式的意义并打印不符合条件的行。
-l: 仅打印匹配文件的文件名。
```
#### 2.14) shelljs.head([{' - n'：}，] file [，file ...]）

读取文件的开头。

可用选项：

-n 显示文件的第一行。
```
console.log(shelljs.head('bundle.js'))  
console.log(shelljs.head({'-n':1},'bundle.js'))  // 获取第一行
```
#### 2.15) shelljs.tail（[{' - n'：}，] file [，file ...]）

读取文件的结尾。

可用选项：-n; 显示文件的最后几行。
```
var str = tail({'-n': 1}, 'file*.txt');
var str = tail('file1', 'file2');
var str = tail(['file1', 'file2']); // same as above
```
#### 2.16）shelljs.mkdir([options, ] dir[, dir...])

创建文件夹

可用选项：

-p: 完整路径 
```
const shelljs = require('shelljs');
shelljs.mkdir('-p', ['bundle', 'js'])
```
如上代码，会在当前目录下 创建 bundle 和 js 文件夹。

#### 2.17）shelljs.touch([options, ] file [, file...])

touch 时创建文件的。

可用选项：
```
1）-a: 仅更改访问时间
2) -c: 不要创建任何文件
3）-m: 仅更改修改时间
4) -d DATE: 指定时间
5）-r FILE: 用FILE的时间替代新文件的时间
```
#### 2.18）shelljs.mv([options, ] source [, source...], dest)

移动文件

可用选项:
```
-f: force
-n: no-clobber

shelljs.mv('move', 'target'); // 将move文件移动到target文件夹
```
#### 2.19）shelljs.pwd()

查看当前目录路径
```
const shelljs = require('shelljs');
console.log(shelljs.pwd())
```
#### 2.20）shelljs.set（选项）

设置全局配置变量
可用选项：
```
+/-e：出错时退出（config.fatal）
+/-v：verbose：show all commands（config.verbose）
+/-f：禁用文件名扩展（globbing）
```
```
set('-e'); // exit upon first error
set('+e'); // this undoes a "set('-e')"
```
#### 2.21）shelljs.sort（[options，] file [，file ...]）

内容排序

可用选项：
```
-r：反转比较结果
-n：根据数值比较
```
```
sort('foo.txt', 'bar.txt');
sort('-r', 'foo.txt');
```
返回文件的内容，逐行排序。排序多个

#### 2.22）shelljs.test()

文件类型判断
```
可用选项：
'-b', 'path'：如果path是块设备，则为true
'-c', 'path'：如果path是字符设备，则为true
'-d', 'path'：如果path是目录，则为true
'-e', 'path'：如果路径存在，则为true
'-f', 'path'：如果path是常规文件，则为true
'-L', 'path'：如果path是符号链接，则为true
'-p', 'path'：如果path是管道（FIFO），则为true
'-S', 'path'：如果path是套接字，则为true

const shelljs = require('shelljs');
if (!shelljs.test('-f', path)) continue;
```
















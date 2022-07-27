
### node子进程child_process

  在node中，child_process 模块还是非常重要的，特别对于编写一些前端工具，经常会使用到 child_process 这个模块的。使用它来进行文件压缩，脚本运行等操作。因此我们有必要研究下，为以后编写一些前端工具做下铺垫，先要理解基本原理，然后再做复杂的事情。

#### 1) 创建子进程的方式

  child_process 模块提供了4个方法用于创建子进程; 他们都有同步版本，比如: spawnSync, 其他也是一样，在后面加 Sync 就是同步的。 如下4种：
```
1）spawn: 启动一个子进程来执行命令。
2）exec: 启动一个子进程来执行命令，与 spawn 不同的是，它有一个回调函数来获得子进程的状况。
3）execFile: 启动一个子进程来执行可执行文件。
4）fork: 与 spawn 类似，不同的地方是它创建Node的子进程只需指定要执行的javascript文件模块即可。
```
  其中 fork 和 spawn 返回一个 stream, exec 和 execFile 把执行结果放到 callback 中，因此我们可以看到，如果执行非常大的文件，使用 fork 或 spawn 比较合适，执行不是非常大的文件，或执行脚本，我们使用 exec 或 execFile 即可。

#### exec 和 spawn 的区别
```
spawn: 
  1. 不会创建衍生的 shell。
  2. 流式的传输子进程产生的数据。
  3. 没有数据大小的限制。
exec:
  1. 会创建衍生的 shell。
  2. 最大传输200KB的数据。
  3. 会缓存数据，进程关闭后传输数据。
```
目录如下：
```
|--- child_process
| |-- index.js
| |--- test1.js
```
基本用法如下：
```
// index.js 代码如下
const cp = require('child_process');

// spawn
cp.spawn('node', ['./test1.js'], { stdio: 'inherit' });

// exec
cp.exec('node ./test1.js', (err, stdout, stderr) => {
  console.log('--exec---', stdout);
});

// execFile
cp.execFile('node', ['./test1.js'], (err, stdout, stderr) => {
  console.log('--execFile---', stdout);
});

// fork
cp.fork('./test1.js', { silent: false });

// test1.js 代码如下：
console.log('test1 输出...');
```
#### 2) 理解 child_process.exec(command[, options][, callback]) 的使用

  创建一个shell，然后在shell里执行命令，执行完成后，会提供一个回调函数，将 err, stdout, stderr 作为参数传入回调方法里面。
  当执行成功，err 为null，执行失败，err 为 Error 的实例。err.code 为错误码。stdout、stderr为标准输出、标准错误。默认是字符串，除非options.encoding为buffer。

  options 有如下参数：
```
cwd: 当前工作路径
env: 环境变量
encoding: 编码，默认为 utf-8
shell: 用来执行shell的命令，unix上默认是 /bin/sh, windows上默认是 cmd.exe
timeout: 默认为0. 如果timeout大于0，那么，当子进程运行超过timeout毫秒，那么，就会给进程发送killSignal指定的信号（比如SIGTERM）。
killSignal：默认是SIGTERM。
uid：执行进程的uid。
gid：执行进程的gid。
maxBuffer： 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死。默认是200*1024（就是200k啦）
```
如下代码演示：
```
const { exec } = require('child_process');

exec('ls', (error, stdout, stderr) => {
  if (error) { 
    console.log('error1111: ', error);
    return;
  }
  console.log('stdout111: ' + stdout); // 输出 index.js test1.js
  console.log('stderr111: ' + stderr); // 输出 空
});

exec('ls', { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) { 
    console.log('error22222: ', error);
    return;
  }
  console.log('stdout222: ' + stdout); // 输出 index.js test1.js
  console.log('stderr222: ' + stderr); // 输出 空
});

// 子进程监听 --- 使用事件
const child = exec('node ./test1.js');

child.stdout.on('data', data => {
  console.log('stdout 输出: ', data); // 打印： stdout 输出:  test1 输出...
});

child.stderr.on('data', err => { 
  console.log('error 输出: ', err);
})

child.on('close', function(code) {
  console.log('closing code: ' + code); // closing code: 0
});
```
#### 3）child_process.execFile(file[, args][, options], [, callback])

execFile 会执行一个文件，他和exec不一样的地方是：它不会创建一个shell。options 参数与 exec 一样；

#### 3.1）执行 node 文件
```
const { execFile } = require('child_process');

// 执行命令
execFile('node', ['./test1.js'], (error, stdout, stderr) => {
  if (error) {
    console.log('error: ', error);
    return;
  }
  console.log('stdout: ', stdout); // stdout:  test1 输出...
  console.log('stderr: ', stderr);
});
```
#### 3.2) 执行 shell 脚本文件

execFile 会执行一个文件，他和exec不一样的地方是：它不会创建一个shell。因此我们不能直接写成 node ./test1.js，这样的话，会找不到文件的，我们应该从根目录去寻找。
```
// index.js 代码如下：

const { execFile } = require('child_process');

// 执行shell脚本，在shell脚本中可以访问的到 process.env 的属性。
process.env.DIRNAME = __dirname;

execFile(`${__dirname}/test2.sh`, (error, stdout, stderr) => { 
  if (error) { 
    console.error('error: ', error);
    return;
  }
  console.log('stdout: ', stdout); // stdout:  执行 test2.sh
  console.log('stderr: ', stderr); // 输出 空
})

// ./test2.sh

#!/usr/bin/env bash
chmod u+x test2.sh
echo '执行 test2.sh';
node $DIRNAME/test1.js # test1 输出...

// ./test1.js

console.log('test1 输出...');
```
我们在命令行要执行 bash 文件的话，我们首先在控制台给他设置权限，先执行 chmod 777 test2.sh; 然后运行 node index.js 即可；

#### 4）child_process.fork(modulePath[, args][, options])

执行一个 node.js 文件。

fork 实际上是 spawn 的一种特殊形式，固定 spawn Node.js 进程，并且在主子进程间建立了通信通道。让主子进程可以使用process模块基于事件进行通信。

参数解析如下：
```
modulePath: 子进程运行的模块。
args: 字符串参数列表.
options: 参数和exec参数一样，但是也有不同的参数如下：

execPath: 用来创建子进程的可执行文件，默认是 /usr/local/bin/node. 我们可以通过 execPath 来指定具体的node可执行文件路径。
execArgv: 传给可执行文件的字符串参数列表。默认是 process.execArgv, 和父进程保持一致；
slient: 默认是false，即子进程的 stdio 从父进程继承，如果是true，则直接 pipe 向子进程的 child.stdin, child.stdout 等。
stdio: 该选项用于配置在父进程和子进程之间建立的通道，如果声明了stdio，则会覆盖 slient 选项的设置。
```
#### 使用列子
```
const { fork } = require('child_process');

// silent 默认为false 子进程会输出 test1.js 中的内容，会打印：test1 输出...
fork('./test1.js', {
  silent: false
});

// 设置 silent 为true，则子进程不会输出，不会打印
fork('./test1.js', {
  silent: true
});

// 通过 stdout 属性, 可以获取到子进程输出的内容
const test1 = fork('./test1.js', {
  silent: true
});

test1.stdout.setEncoding('utf8');
test1.stdout.on('data', function (data) {
  console.log('stdout 中输出:', data); // 打印：stdout 中输出: test1 输出...
}); 
```

#### 5）child_process.spawn(command[, args][, options])

  command: 要执行的命令；
  args: 字符串参数列表；
  options: 参数和exec参数一样，但是也有不同的参数如下：

  argv0: 显示地设置发送给子进程的 argv[0]的值，如果没有指定，则会被设置为 command 的值。
  detached: [Boolean] 让子进程独立于父进程之外运行；

```
// demo 使用如下 index.js 代码如下：

const { spawn } = require('child_process');

const ls = spawn('ls', ['-al']);

// 输出
ls.stdout.on('data', function (data) {
  console.log('data from child: ', data);
});

// 错误的输出
ls.stderr.on('data', function (data) {
  console.log('error from child: ', data);
});

// 子进程结束时输出
ls.on('close', function (code) { 
  console.log('child exists with code: ', code);
})
```
输出结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/5.png" /> <br />

#### 5.2) 声明stdio

  父子进程公用一个输出管道。index.js 代码如下；可以看到 其实 和 运行 ls -al 结果是一样的。
```
const { spawn } = require('child_process');

const ls = spawn('ls', ['-al'], {
  stdio: 'inherit'
});

// 子进程结束时输出
ls.on('close', function (code) { 
  console.log('child exists with code: ', code);
})
```
结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/6.png" /> <br />

#### 5.3）错误场景
```
const { spawn } = require('child_process');

// 场景1，命令本身不存在，创建子进程报错
const child = spawn('bad_command');

child.on('error', (err) => {
  console.log('---命令不存在--', err);
});

// 场景2，命令存在，但运行过程报错
const child2 = spawn('ls', ['nonexistFile']);

child2.stderr.on('data', (data) => {
  console.log('Error msg from process 2: ', data);
});

child2.on('error', (err) => { 
  console.log('Failed to start child process 2: ', err);
});
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/7.png" /> <br />

#### 6. 子进程常用的事件

  1. exit: 子进程自行退出时触发；
  2. close: 子进程的stdio流关闭时触发。
  3. error: 产生错误时触发。
  4. message:  它在子进程使用 process.send()函数来传递消息时触发
  5. disconnect: 事件在父进程手动调用 child.disconnect 函数时触发.

列子如下：
```
// 例子
const { fork } = require('child_process');

const child = fork('./test1.js')

child.on('close', (code, signal) => {
  console.log('close 事件：', code, signal);
})

child.on('disconnect', () => {
  console.log('disconnect 事件...');
})

child.on('error', (code, signal) => {
  console.log('error 事件：', code, signal);
})

child.on('exit', (code, signal) => {
  console.log('exit 事件：', code, signal);
})

child.on('message', (val) => {
  console.log('message 事件：', val);
})

// test1.js 如下：

console.log('test1 输出...');
process.send('子进程发送给父进程的消息...')
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/node/images/8.png" /> <br />

#### 子进程应用场景
```
1）计算密集型系统。
2）前端构建工具利用多核CPU并行计算，提升构建效率。
3）进程管理工具，比如 PM2中部分功能等。
```






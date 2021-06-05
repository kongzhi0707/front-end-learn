### 了解Commander.js命令行框架

  Commander 是node.js命令行界面的完整解决方案。

  1. 安装命令：
```
$ node install commander --save
```
  2. 使用实列
```
// 引入依赖
var program = require('commander');

// 定义参数和版本选项
program
  .version('1.0.0', '-v, --version')
  .option('-i, --init', 'init something')
  .option('-g, --generate', 'generate something')
  .option('-r, --remove', 'remove something');

program.on('--help', function() {
  console.log(111);
  console.log('this is an example');
});
// 解析参数
program.parse(process.argv);

if(program.init) {
  console.log('init something');
}

if (program.generate) {
  console.log('generate something');
}
if (program.remove) {
  console.log('remove something');
}
```
  在命令行中运行如下命令：
```
node bin/index.js --help
```
  输出结果如下：
```
Usage: index [options]

Options:
  -v, --version   output the version number
  -i, --init      init something
  -g, --generate  generate something
  -r, --remove    remove something
  -h, --help      display help for command
111
this is an example
``` 
  在命令行中输入如下命令：
```
$ node bin/index.js -i 

运行结果如下：
init something

在命令行中输入如下命令:
$ node bin/index.js -g 

运行结果如下：
generate something
```
  3. API解析

#### 3.1）version

  作用：定义程序的版本号
  用法: .version('1.0.0', '-v, --version')
  参数解析：
  1. 版本号<必须>
  2. 自定义标志<可省略>: 默认为 -V 和 --version

#### 3.2) option

  作用：用于定义命令选项 <br/>
  用法: .option('-n, --name<path>', 'name description', 'default name') <br/>
  参数解析：<br/>
  1）自定义标志<必须>：分为长短标识，中间用逗号, 竖线, 或者 空格分割; 标志后面可跟必须参数或可选参数，前者使用<>包含, 后者使用 [] 包含。<br/>
  2）选项描述; 在使用 --help 命令时显示标志描述。<br/>
  3) 默认值<可省略><br/>

#### 3.3）command

  作用：添加命令名称。
  用法: .command('add <num> [otherDirs...]', 'install description', opts)
  参数解析：
  1. 命令名称<必填项>：命令后面可跟用<> 或 []包含的参数; 命令的最后一个参数可以是可变的，像下面的demo中那样在数组后面加入...标志；在命令后面传入的参数会被传入到action的回调函数以及program.args数组中。
  2. 命令描述<可省略>：如果存在，且没有显示调用action(fn), 就会启动子命令程序，否则会报错。
  3. 配置选项<可省略>：可配置 noHelp, isDefault等
```
// 引入依赖
var program = require('commander');
 
program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmd) {
    console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
  })
 
program.parse(process.argv);
```
  执行命令：$ node bin/index.js rm /xxx -r
  打印结果如下: remove /xxx recursively

#### 3.4) alias description usage

  定义命令的别名, 描述和用法
```
// 引入依赖
var program = require('commander');
 
program
  .version('1.0.0')
  .usage('<command> [options] 快速启动项目');

program
  .command('revert <name>')
  .description('我是一段描述')
  .option('-r, --rules', 'list all module rule names') // 选项
  .option('-p, --plugin', 'list all plugin names')
    .alias('rv')
    .action((name, cmd) => {
      // 如果传了选项，就可以取到
      var rules = cmd.rules ? true : false;
      // name取到命令后面的参数
      console.log(`回复了${name}`);
    });
program.parse(process.argv);
```
  运行 $ node bin/index.js 后，打印信息如下:
```
Usage: index <command> [options] 快速启动项目

Options:
  -V, --version               output the version number
  -h, --help                  display help for command

Commands:
  revert|rv [options] <name>  我是一段描述
  help [command]              display help for command
```
  运行 $ node bin/index.js -V 打印信息如下：1.0.0

  运行 $ node bin/index.js rv kongzhi 或 运行了 node bin/index.js revert kongzhi 打印的信息都是:
回复了kongzhi; 也就是说 alias 的别名是 revert 命令的别名。

#### 3.5) action
  定义命令的回调函数。
  用法：.action(fn)
```
// 引入依赖
var program = require('commander');
program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmd) {
    console.log('remove ' + dir + (cmd.recursive ? ' recursively' : ''))
  })
 
program.parse(process.argv);
```
  执行命令：$ node bin/index.js rm /xxx -r
  打印结果如下: remove /xxx recursively


 


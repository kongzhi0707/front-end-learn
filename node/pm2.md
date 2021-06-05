
### pm2入门及自动化部署nodejs项目

  pm2是常用的node进程管理工具。它可以对nodejs应用进行管理，比如自动重载，性能监控，负载均衡等。

#### 一：PM2安装

  使用PM2需要npm全局安装，安装命令如下：
```
npm install -g pm2
```
  安装完成pm2后，将自动创建如下文件夹：
```
kongzhi@kongzhi-PC:~/.pm2$ ls
logs  module_conf.json  modules  pids  pm2.log  pm2.pid  pub.sock  rpc.sock  touch

$HOME/.pm2: 包含所有pm2相关文件。
$HOME/.pm2/logs: 包含所有应用程序日志。
$HOME/.pm2/pids: 包含所有应用程序pids。
$HOME/.pm2/pm2.log pm2日志。
$HOME/.pm2/rpc.sock: 远程命令的套接字文件。
$HOME/.pm2/pub.sock: 可发布事件的套接字文件
```
#### 二：启动pm2项目

  假如我现在的node目录结构如下：
```
|--- koa-demo
| |--- app.js
| |--- node_modules
| |--- package.json
```
  app.js 代码如下：
```
// 引入模块

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const KoaStatic = require('koa-static');
const Router = require('koa-router');

const cors = require('koa2-cors');

const app = new Koa();

/*
 解决跨域 
 app.use(cors()); // 全部允许跨域
*/
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'], // 设置允许的HTTP请求方法
  // 设置服务器支持的所有头信息字段
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}));

app.use(async ctx => {
  ctx.body = 'Hello World';
});

// 使用 bodyParser 和 koaStatic中间件
app.use(bodyParser()); // 处理post请求时，koa无法解析http请求体中的数据
app.use(KoaStatic(__dirname + '/public'));

app.listen(3000, () => {
  console.log('graphQL server listen port: ' + 3000);
});
```
#### 2.1）启动项目
```
pm2 start app.js
```
  执行如上命令后，就可以启动 Node.js应用。成功后可以看到如下信息：
```
[PM2] Starting /media/kongzhi/_dde_data/r-doc/koa-demo/app.js in fork_mode (1 instance)
[PM2] Done.

┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ app                │ fork     │ 0    │ online    │ 0%       │ 25.2mb   │
```
  如上表格中我们可以看到 应用名称为：app，id为0. 应用名称和id都可以作为该应用标识。

#### 2.2）查看应用列表
```
pm2 list

kongzhi@kongzhi-PC:/media/kongzhi/_dde_data/r-doc/koa-demo$ pm2 list
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ app                │ fork     │ 0    │ online    │ 0.3%     │ 36.9mb   │
```
#### 2.3) 查看应用详情

  在命令行中输入 pm2 show 0 或 pm2 show app，弹出信息如下：
```
───────────────────┬────────────────────────────────────────────────┐
│ status            │ online                                         │
│ name              │ app                                            │
│ namespace         │ default                                        │
│ version           │ 1.0.0                                          │
│ restarts          │ 0                                              │
│ uptime            │ 16m                                            │
│ script path       │ /media/kongzhi/_dde_data/r-doc/koa-demo/app.js │
│ script args       │ N/A                                            │
│ error log path    │ /home/kongzhi/.pm2/logs/app-error.log          │
│ out log path      │ /home/kongzhi/.pm2/logs/app-out.log            │
│ pid path          │ /home/kongzhi/.pm2/pids/app-0.pid              │
│ interpreter       │ node                                           │
│ interpreter args  │ N/A                                            │
│ script id         │ 0                                              │
│ exec cwd          │ /media/kongzhi/_dde_data/r-doc/koa-demo        │
│ exec mode         │ fork_mode                                      │
│ node.js version   │ 12.12.0                                        │
│ node env          │ N/A                                            │
│ watch & reload    │ ✘                                              │
│ unstable restarts │ 0                                              │
│ created at        │ 2020-08-06T20:10:38.824Z                       │
└───────────────────┴────────────────────────────────────────────────┘
 Actions available 
┌────────────────────────┐
│ km:heapdump            │
│ km:cpu:profiling:start │
│ km:cpu:profiling:stop  │
│ km:heap:sampling:start │
│ km:heap:sampling:stop  │
└────────────────────────┘
 Trigger via: pm2 trigger app <action_name>

 Code metrics value 
┌────────────────────────┬──────────┐
│ Heap Size              │ 8.32 MiB │
│ Heap Usage             │ 73.86 %  │
│ Used Heap Size         │ 6.15 MiB │
│ Active requests        │ 0        │
│ Active handles         │ 4        │
│ Event Loop Latency     │ 0.75 ms  │
│ Event Loop Latency p95 │ 2.43 ms  │
```
#### 2.4) 监控CPU/内存

  使用 pm2 monit方法，即可监控cpu和内存的使用情况。并且应用报错信息会打印到 Global Logs 窗口中，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/100.jpg" /> <br />

#### 2.5）监听代码的变化

  使用如下命令，可以监听代码保存，并且更新应用：
```
pm2 start app.js --watch
```
  pm2不止监听app.js文件，还监听了它引用的所有模块，只要任意模块代码进行了保存，比如我们按下了ctrl+s. pm2就会进行重启。

  如果我们想忽略某些文件，我们可以在配置文件中设置（后续我们会使用配置文件），比如如下：
```
{
  "watch": ["server", "client"],
  "ignore_watch" : ["node_modules", "client/img"],
  "watch_options": {
    "followSymlinks": false
  }
}
```
  1）watch可以是布尔值，路径数组或表示路径的字符串。默认为false。
  2）ignore_watch可以是一个路径数组或一个字符串，它将被chokidar解释为glob或正则表达式。
  3）watch_options是一个替代chokidar的选项的对象。有关定义，请参阅<a href="https://github.com/paulmillr/chokidar#api">chokidar文档</a>。

#### 3) pm2 常使用的命令及命令行参数
```
1. 启动命令：pm2 start app.js
2. 重启命令：pm2 restart app.js
3. 停止命令: pm2 stop app_name | app_id (我们可以先通过pm2 list 获取应用名字或进程id)
4. 停止全部应用：pm2 stop all
5. 删除命令：pm2 delete app_name | app_id (可以通过pm2 list获取应用名字或进程id，然后调用命令来删除相应的应用)。
6. 删除全部应用: pm2 delete all
7. 查看有那些进程: pm2 list
8. 查看某个进程信息：pm2 describe app_name | app_id
9. 查看应用状态信息: pm2 show (app_name | app_id)
10. 监控每个node进程的cpu和内存使用情况： pm2 monit
11. 显示所有进程的日志信息：pm2 logs
```
#### 3.1）负载均衡

  可以使用 -i 参数配置集群数，实现负载均衡。相关命令如下：
```
$ pm2 start app.js -i 3 // 开启三个进程
$ pm2 start app.js -i max // 根据机器cpu核数，开启对应数目的进程
```
#### 3.2）内存超过使用上限自动重启

  我们可以使用 --max-memory-restart 参数来限制内存使用上限，当超过使用内存上限后自动重启。
```
$ pm2 start app.js --max-memory-restart 100M
```
#### 3.3) 开机自启动

#### 在linux中，设置开机自启动，需要如下两个步骤：

  1) 运行 pm2 startup. 在 /etc/init.d/目录下会生成 pm2-root的启动脚本，且自动将 pm2-root 设为服务。

  2）运行 pm2 save, 会将当前pm2所运行的应用保存在 /root/.pm2/dump.pm2 下，当开机重启时，
运行 pm2-root 服务脚本，并且到 /root/.pm2/dump.pm2 下读取应用并启动；

#### 在window中，需要如下操作：

  1）安装：npm install pm2-windows-startup -g
  2) pm2-startup install

  然后我们只需要运行以下保存命令，就可以将现在正在运行的服务添加到开机自动命令中，后面即使我们的服务器开机重启，也会将我们保存的服务自动重启；
```
$ pm2 save
```
#### 常用的命令行参数如下
```
--watch: 监听应用目录的变化，一旦发生变化，自动重启。
-i 或 --instance：启用多少个实列，可使用于负载均衡，比如 -i 0 或 -i max. 
--ignore-watch: 排除监听的目录或文件，可以是特定的文件名或正则。
-n or --name: 应用的名称，查看应用信息的时候可以使用的到。
-o or --output path: 标准输出日志文件的路径。
-e or --error path: 错误输出日志文件的路径。
```
  我们可以在启动命令后面加入一些参数。比如启动命令如下所示：
```
pm2 restart app.js --watch -i max -n app
```
  执行的结果如下所示：
```
[PM2] Applying action restartProcessId on app [app.js](ids: [ 0 ])
[PM2] [app](0) ✓
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ app                │ fork     │ 1    │ online    │ 0%       │ 21.9mb   │
```
#### 三：添加配置文件

  如上如果我们使用命令行参数定义一些选项，那么在每次启动的时候都需要敲一大堆命令，非常繁琐，因此我们可以使用一个配置文件来将命令行参数进行配置。比如说我们在项目中的根目录中新建一个配置文件叫 pm2.json. 然后我们在package.json文件中配置启动命令："pm2": "pm2 start pm2.json". 因此我们以后只需要运行 npm run pm2命令就可以使用pm2来启动我们的node项目。
  所有的配置参数都在pm2.json中配置下就可以了。
```
{
  "apps": {
  	"name": "koa-demo",             // 项目名称
  	"script": "app.js",             // 执行文件
  	"cwd": "./",                    // 根目录
  	"args": "",                     // 传递给脚本的参数
  	"interpreter": "",              // 指定的脚本解释器
  	"interpreter_args": "",         // 传递给解释器的参数
  	"watch": true,                  // 是否监听文件变动然后重启
  	"ignore_watch": [               // 不用监听的文件
  	  "node_modules",
  	  "public"
  	],
  	"exec_mode": "cluster_mode",    // 应用启动模式，支持fork和cluster模式
  	"instances": "max",             // 应用启动实列个数，仅在cluster模式下有效
  	"error_file": "./logs/app-err.log", // 错误日志文件
  	"out_file": "./logs/app-out.log", // 正常日志文件
  	"merge_logs": true,             // 设置追加日志而不是新建日志
  	"log_date_format": "YYYY-MM-DD HH:mm", // 指定日志文件的时间格式
  	"min_uptime": "60s",            //应用运行少于时间被认为是异常启动
    "max_restarts": 30,             // 最大异常重启次数
    "autorestart": true,            // 默认为true，发生异常情况下自动重启
    "restart_delay": 60,            // 异常重启情况下，延时重启时间
    "env": {
      "NODE_ENV": "production",     // 环境参数，当前指定为生产环境
    },
    "env_dev": {
      "NODE_ENV": "development",    // 环境参数，当前指定为开发环境
    },
    "env_test": {
      "NODE_ENV": "test",           // 环境参数，当前指定为测试环境
    }
  }
}
```
  然后我们在命令行中运行 npm run pm2 即可：如下所示：
```
kongzhi@kongzhi-PC:/media/kongzhi/_dde_data/r-doc/koa-demo$ npm run pm2

> koa-demo@1.0.0 pm2 /media/kongzhi/_dde_data/r-doc/koa-demo
> pm2 start pm2.json

[PM2][WARN] Applications koa-demo not running, starting...
[PM2][WARN] Folder does not exist: /media/kongzhi/_dde_data/r-doc/koa-demo/logs
[PM2] Creating folder: /media/kongzhi/_dde_data/r-doc/koa-demo/logs
[PM2][WARN] Folder does not exist: /media/kongzhi/_dde_data/r-doc/koa-demo/logs
[PM2] Creating folder: /media/kongzhi/_dde_data/r-doc/koa-demo/logs
[PM2] App [koa-demo] launched (8 instances)
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ koa-demo           │ cluster  │ 1    │ online    │ 0%       │ 35.7mb   │
│ 1  │ koa-demo           │ cluster  │ 1    │ online    │ 0%       │ 33.3mb   │
│ 2  │ koa-demo           │ cluster  │ 0    │ [1… │ 0%       │ 0b       │
│ 3  │ koa-demo           │ cluster  │ 0    │ [1… │ 0%       │ 0b       │
│ 4  │ koa-demo           │ cluster  │ 0    │ online    │ 0%       │ 40.1mb   │
│ 5  │ koa-demo           │ cluster  │ 0    │ online    │ 0%       │ 36.7mb   │
│ 6  │ koa-demo           │ cluster  │ 0    │ online    │ 0%       │ 34.2mb   │
│ 7  │ koa-demo           │ cluster  │ 0    │ online    │ 0%       │ 28.6mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```
  然后会在我们的项目的根目录下 生成 logs文件夹，该文件夹下面有 app-err.log 和 app-out.log文件。

#### 四：启动开发环境

  在服务器端的代码中，可以通过 process.env.NODE_ENV 拿到设置的值。

  比如我们使用 pm2 start pm2.json --watch --env development 命令启动项目，则可以打印出process.env.NODE_ENV的值为 "dev";
```
const process = require('process')
console.log(process.env.NODE_ENV) // dev
```
#### 五：日志管理

  pm2提供了十分强大的 <a href="https://pm2.keymetrics.io/docs/usage/log-management/#log-management">日志管理</a> 功能，支持以多种方式查看日志。
```
1. 以特殊日期格式查看日志：

   pm2 logs koa-demo --format

2. 以json格式查看日志：
   
   pm2 logs koa-demo --json 

3. 查看最近3行日志：
   
   pm2 logs koa-demo --lines 3
```
  或者我们直接可以在我们的项目根目录下的 logs文件夹下的 app-out.log文件中查看。

#### 日志分割

  我们上面的日志全部输出到了 app-out.log 和 app-err.log中，日积月累，排查问题肯定很费劲。因此我们需要使用日志分割功能。

  我们在node中，大家肯定都使用过 log4js 来进行按日期写入的，那么pm2可不可以按日期写入呢？
  当然可以的。pm2为我们提供了插件系统，该插件为 pm2-logrotate-ext

  因此我们现在需要安装该插件，安装命令如下所示：
```
pm2 install pm2-logrotate-ext
```
  安装好后会自动重启生效，可以执行命令设置如下参数，设置好参数后也会自动重启。
```
pm2 set pm2-logrotate-ext:retain 7   //保存7个文件

pm2 set pm2-logrotate-ext:compress false    //是否启动压缩

pm2 set pm2-logrotate-ext:dateFormat YYYY-MM-DD_HH-mm-ss    //日志名添加时间

pm2 set pm2-logrotate-ext:rotateInterval '0 0 * * * '    //每天凌晨0点启动备份

pm2 set pm2-logrotate-ext:rotateModule true    //把pm2本身的日志也进行分割

pm2 set pm2-logrotate-ext:max_size 100M    //每个备份文件大小为100M

pm2 set pm2-logrotate-ext:workerInterval 5    //设置启动几个工作进程监控日志尺寸，默认30，这里设置为5

pm2 set pm2-logrotate-ext:retain 30       //保存30个备份日志文件，超过30个，会把之前的删掉，防止日志总体体积越来越大
```

  执行如下命令：pm2 set pm2-logrotate-ext:retain 7 
```
kongzhi@kongzhi-PC:/media/kongzhi/_dde_data/r-doc/koa-demo$ pm2 set pm2-logrotate-ext:retain 7 
[PM2] Module pm2-logrotate-ext restarted
[PM2] Setting changed
Module: pm2-logrotate-ext
$ pm2 set pm2-logrotate-ext:max_size 10M
$ pm2 set pm2-logrotate-ext:retain 7
$ pm2 set pm2-logrotate-ext:compress false
$ pm2 set pm2-logrotate-ext:dateFormat YYYY-MM-DD_HH-mm-ss
$ pm2 set pm2-logrotate-ext:workerInterval 30
$ pm2 set pm2-logrotate-ext:rotateInterval 0 0 * * *
$ pm2 set pm2-logrotate-ext:rotateModule true
$ pm2 set pm2-logrotate-ext:forced true
```

  查看当前的设置： pm2 conf pm2-logrotate-ext
  如下所示：
```
pm2 conf pm2-logrotate-ext

Module: pm2-logrotate-ext
$ pm2 set pm2-logrotate-ext:max_size 10M
$ pm2 set pm2-logrotate-ext:retain 7
$ pm2 set pm2-logrotate-ext:compress false
$ pm2 set pm2-logrotate-ext:dateFormat YYYY-MM-DD_HH-mm-ss
$ pm2 set pm2-logrotate-ext:workerInterval 30
$ pm2 set pm2-logrotate-ext:rotateInterval 0 0 * * *
$ pm2 set pm2-logrotate-ext:rotateModule true
$ pm2 set pm2-logrotate-ext:forced true
```
  之前的日志如果不需要了，可以使用命令：pm2 flush，可以不重启项目删除日志。
  可以自行修改参数检验备份结果。


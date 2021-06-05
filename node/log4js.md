
### log4js 入门介绍

  log4js 是一个nodejs日志管理工具，可以将日志以各种形式输出来，可以通过设置其优先级别，可以打印出不同级别的日志，便于后续的系统分析。

#### 1. 安装
```
npm install log4js --save
```
  简单使用如下：

  在项目的根目录下 新建 app.js， 基本代码如下：
```
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug'; 
logger.debug("Some debug messages");
```
  然后我们 执行 node app.js 将会打印如下信息：
```
[2020-08-01T00:15:20.747] [DEBUG] default - Some debug messages
```
  如上：Some debug messages 是我们想要输出的内容。

#### 2. 日志分级

  log4js的日志分为九个等级，各个级别的权重和名字如下：
```
all (权重: Number.MIN_VALUE) ---> 级别最低的, 输出所有的日志
trace (权重 5000)     | ---> 最详细的信息, 一般这些信息只记录到日志文件中
debug (权重 10000)    | ---> 系统的详细信息.
info (权重 20000)     | ---> 运行时事件(启动/关闭)，一般这些信息将立即呈现在状态控制台上，因而要保守使用，并保持到最低限度。
warn (权重 30000)     | ---> 使用已过时的API，API滥用。或其他不良或意味的运行时状况(但不一定是错误的)。
error (权重 40000)    | ---> 运行时错误或意外情况，一般将这些信息立即呈现在控制台上。
fatal (权重 50000)    | ---> 导致应用程序提前终止的严重错误，一般将这些信息立即呈现在控制台上。
mark (权重 2的53次方)  |
off (权重: Number.MAX_VALUE) ---> 级别最高的，所有日志都不输出
```
  默认情况下，日志级别是关闭的，即不会输出日志。如上代码，我们手动指定了 logger.level = 'debug'; 因此会输出等于或高于 debug的日志。

  log4js 建议只使用四个级别，优先级从高到低分别是：error，warn，info，debug。通过定义级别，我们可以控制到应用程序中相应级别的日志信息的开关。
比如我们定义了 info的级别，则应用程序中所有 debug级别的日志信息将不会被打印出来。也就是说大于等于级别的日志才会被输出。

#### 3. 获取实列指定的别名

  log4js.getLogger(); 比如如上demo打印的信息为如下：
```
[2020-08-01T00:15:20.747] [DEBUG] default - Some debug messages
```
  因此它控制的就是上面 default 这个地方。如果我们将代码改成如下：
```
var log4js = require('log4js');
var logger = log4js.getLogger('aaa');
logger.level = 'debug'; 
logger.debug("Some debug messages");
```
  那么打印的信息就会变成如下了：
```
[2020-08-01T08:20:49.609] [DEBUG] aaa - Some debug messages
```
#### 4. configure(string | object) 方法

  通过调用 configure 方法就可以为我们对日志进行分类管理。该方法对参数可以是一个字符串或是一个object字符串参数用于加载配置对文件名。配置文件它是一个json文件。我们也可以直接将配置对象传递给 configure 方法。

#### 配置对象

  配置对象常用的两个属性为：appenders 和 categories。 

  appenders：主要用于定义以怎样的方式输出，输出到哪里。
  categories：用来定义日志输出的规则，然后调用之前定义好的 appenders 进行输出。

  比如我们可以看如下一个demo列子：
```
var log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'application.log' }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
});

var logger = log4js.getLogger();
logger.debug("Some debug messages");
```
  如上代码，然后我们执行 node app.js 后，将会在项目中的根目录文件下创建 application.log 文件。同时会把日志打印到控制台和 application.log文件中。
打印信息如下：
```
[2020-08-01T08:41:21.360] [DEBUG] default - Some debug messages
```
  如上配置代码，appenders 定义了两个对象，out 和 app， out的type为 'stdout' 输出到命令行控制台中，另一个为 type: 'file'， 输出类型为文件，并且filename为"application.log", 因此我们知道 appenders 主要用来定义输出位置的。

  categories 定义了一个规则，调用了 appenders 中定义的输出，并且定义了输出的级别为 debug。

#### appenders

  appenders 是一个map，key代表的是appenders的名字是一个字符串。value里面有一个必选的属性是type。根据type的不同value的格式也不一样。下面我们可以看下我们有哪些常用的type。

#### type

  是设置生成的类型，它有两种类型，一种是file，另一种是dateFile。

  file文件类型：则是将日志生成到一个文件中。通过maxLogSize来设置文件的最大值。当大于此值后，则自动创建一个新的文件来存储日志。

  dateFile类型：则是以天为单位，每天创建一个日志，可以根据自己的需要来判断具体使用那种类型。

#### file

  file 日志将会输出到指定的文件中 ----- 所有日志写到一个文件中(可以设置文件的大小限制)

  比如我们上面的代码，我们会将日志信息输出到项目根目录下的 application.log文件中。代码如下：
```
var log4js = require('log4js');

log4js.configure({
  appenders: {
    app: { type: 'file', filename: 'application.log' }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: 'debug' }
  }
});

var logger = log4js.getLogger();
logger.debug("Some debug messages");
```
  常用的配置属性有如下：
```
type: 'file'
filename: 'application.log' 输出文件的名字
maxLogSize: 日志文件的最大大小(以字节为单位)。如果未指定，则不会发生日志滚动。
backups: 日志滚动期间要保留的旧日志文件数，默认为5.
layout：默认是basic
keepFileExt boolean 默认为false, 滚动日志文件时保留文件扩展名（比如file.log会变为file.1.log）
compress 对滚动的日志文件进行压缩。
```
#### dateFile

  dateFile日志的滚动将根据配置的时间格式进行滚动，它和 file 最主要的区别是：file它是单文件存储数据的，并且可以设置文件大小。dateFile它是多文件存储的。
它会根据日期的设定生成多个文件。

  比如如下demo：
```
var log4js = require('log4js');

log4js.configure({
  appenders: {
    log_file: { type: 'dateFile', filename: 'logs/log_file', pattern: "yyyy-MM-dd.log", alwaysIncludePattern: true }
  },
  categories: {
    default: { appenders: [ 'log_file' ], level: 'debug' }
  }
});

var logger = log4js.getLogger("log_file");
logger.debug("Some debug messages");
```
  最终我们的日志文件会被写入到项目根目录下的 logs/log_file.2020-08-02.log 文件中。然后该文件的内容如下：
```
[2020-08-02T07:31:17.964] [DEBUG] log_file - Some debug messages
```
  常用的配置项如下：
```
type: 'dateFile'
filename: logs/log_file 输出文件目录及文件名字。
pattern(默认为.yyyy-MM-dd) 用于确定何时滚动日志模式。
layout 默认是basic layout
daysToKeep：默认为0，如果该值大于0，则在日志滚动期间将删除早于该天数的文件。
keepFileExt: 默认为false 在滚动日志文件时保留文件扩展名 (比如file.log变为 file.2020-08-02.log)
compress: 对滚动的日志文件进行压缩。
```
#### categories

  categories 也是一个map类型的数据，key是category的名字是一个字符串，value是一个对象。value的常用属性如下：

  1. level定义打印日志的级别。
  2. appenders 定义打印的 appender

  如下是整个demo代码：
```
var log4js = require('log4js');

log4js.configure({
  appenders: {
    // 设置控制台输出
    out: { type: 'console' },
    // 所有日志记录，文件类型file，文件最大值 maxLogSize, 单位byte  backups: 备份文件个数最大值，最新数据覆盖旧数据
    allLog: { type: "file", filename: "logs/all.log", keepFileExt: true, maxLogSize: 10485760, backups: 3 },
    // http请求日志 http请求日志需要 app.use 引用一下，这样才会自动记录每次请求的信息
    httpLog: { type: "dateFile", filename: "logs/httpAccess.log", pattern: ".yyyy-MM-dd", keepFileExt: true },
    // 错误日志type：过滤类型 logLevelFilter, 将过滤error日志写进指定文件
    errorLog: { type: "file", filename: "logs/error.log" },
    error: { type: "logLevelFilter", level: "error", appender: 'errorLog' }
  },
  // 不同等级日志追加到不同的输出位置
  categories: {
    http: { appenders: ['out', 'httpLog'], level: "debug" },
    default: { appenders: ['allLog', 'error'], level: 'debug' }
  }
});

var logger = log4js.getLogger("log_file");

// 调用方式
logger.info();
logger.warn();
logger.debug("Some debug messages");
logger.error();
```
  当我们在项目的根目录执行 node app.js 后，在项目中的根目录下生成 logs/all.log, logs/error.log, logs/httpAccess.log 文件。

  logs/all.log 记录日志如下：
```
[2020-08-02T08:26:12.657] [INFO] log_file - 
[2020-08-02T08:26:12.658] [WARN] log_file - 
[2020-08-02T08:26:12.658] [DEBUG] log_file - Some debug messages
[2020-08-02T08:26:12.658] [ERROR] log_file - 
```
  logs/error.log 记录日志如下：
```
[2020-08-02T08:26:12.658] [ERROR] log_file - 
```
  logs/httpAccess.log 目前没有，因为我们没有请求。

#### 过滤级别和类别

  我们可以调整 appender 的配置，对日志的级别和类别进行过滤。如下代码：

#### 如何在项目中使用 log4.js。

  我们可以简单的封装一个库。
```
|--- log4jsConfig
| |--- config.js
| |--- log4.js
```
  log4jsConfig/config.js 代码如下：
```
const path = require('path');

// 日志根目录
const baseLogPath = path.resolve(__dirname, '../logs');

// 请求日志目录
const reqPath = '/request';

// 请求日志文件名
const reqFileName = 'request';

// 请求日志输出完整路径
const reqLogPath = baseLogPath + reqPath + '/' + reqFileName;

// 响应日志目录
const resPath = '/response';

// 响应日志文件名
const resFileName = 'response';

// 响应日志输出完整路径
const resLogPath = baseLogPath + resPath + '/' + resFileName;

// 错误日志目录
const errPath = '/error';

// 错误日志文件名
const errFileName = 'error';

// 错误日志输出完整路径
const errLogPath = baseLogPath + errPath + '/' + errFileName;

module.exports = {
  appenders: {
    // 所有日志
    'console': {type: 'console'},
    // 请求日志
    'reqLogger': {
      type: 'dateFile', // 日志类型
      filename: reqLogPath, // 输出文件名
      pattern: '-yyyy-MM-dd-hh.log', 
      alwaysIncludePattern: true, // 上面两个参数是否合并
      encoding: 'utf-8', // 编码格式
    },
    // 响应日志
    'resLogger': {
      type: 'dateFile',
      filename: resLogPath,
      pattern: '-yyyy-MM-dd-hh.log', 
      alwaysIncludePattern: true, // 上面两个参数是否合并
      encoding: 'utf-8', // 编码格式
    },
    // 错误日志
    'errLogger': {
      type: 'dateFile',
      filename: errLogPath,
      pattern: '-yyyy-MM-dd-hh.log', 
      alwaysIncludePattern: true, // 上面两个参数是否合并
      encoding: 'utf-8', // 编码格式
    }
  },
  // 分类以及日志等级
  categories: {
    default: {
      appenders: ['console'],
      level: 'all'
    },
    reqLogger: {
      appenders: ['reqLogger'],
      level: 'info'
    },
    resLogger: {
      appenders: ['resLogger'],
      level: 'info'
    },
    errLogger: {
      appenders: ['resLogger'],
      level: 'error'
    }
  }
};
```
  log4jsConfig/log4.js 代码如下：
```
const log4js = require('log4js');
const log4Config = require('./config');

// 调用配置文件
log4js.configure(log4Config);

class CommonHandle {
  constructor() {}

  // 格式化请求日志
  static formatReqLog(ctx, time) {
    let text = '------------request start-------------';
    let method = ctx.method;
    text += `request method: ${method} \n request url: ${ctx.originalUrl } \n`;
    if (method === 'GET') {
      text += `request data: ${JSON.stringify(ctx.query)} \n`;
    } else {
      text += `request data: ${JSON.stringify(ctx.body)} \n`;
    }
    text += `ctx all: ${JSON.stringify(ctx)}`;
    return text;
  }
  // 格式化响应日志
  static formatResLog(ctx, time) {
    let text = '------------- response start ----------------';
    text += `response result: ${JSON.stringify(ctx.response.body)} \n`;
    text += `response all: ${JSON.stringify(ctx)} \n`;
    text += `response time: ${time} \n`;
    return text;
  }
  // 格式化错误日志
  static formatErrorLog(ctx, error, time) {
    let text = '----------- error start ----------------';
    text += this.formatResLog(ctx, time);
    text += `error content: ${JSON.stringify(error)}`;
    return text;
  }
}

class HandleLogger extends CommonHandle {
  constructor() {
    super();
  }
  // 请求日志
  static reqLogger(ctx) {
    log4js.getLogger('reqLogger').info(this.formatReqLog(ctx));
  }
  // 响应日志
  static resLogger(ctx, time) {
    log4js.getLogger('resLogger').info(this.formatResLog(ctx, time));
  }
  // 错误日志
  static errorLogger(ctx, error, time) {
    log4js.getLogger('errLogger').info(this.formatErrorLog(ctx, error, time));
  }
}

module.exports = (options) => {
  return async (ctx, next) => {
    const startTime = new Date();
    let period;
    try {
      // 请求日志
      HandleLogger.reqLogger(ctx);
      await next();
      period = new Date() - startTime;
      // 响应日志
      HandleLogger.resLogger(ctx, period);
    } catch(err) {
      period = new Date() - startTime;
      // 错误日志
      HandleLogger.errorLogger(ctx, err, period);
    }
  }
}
```
  在我们的页面上引入方式如下：
```
const Koa = require('koa');
const app = new Koa();
const LogJS = require('./log4jsConfig/log4');

// log4.js 引入
app.use(LogJS());

app.listen(3000, () => {
  console.log('http://localhost:3000 is start');
});
```
  然后我们在命令行中 执行 node app.js 后，会在项目的根目录中生成 logs/request/request.-2020-08-02-09.log 文件 及 logs/response/response.-2020-08-02-09.log 文件。

  logs/request/request.-2020-08-02-09.log 文件代码如下：
```
[2020-08-02T09:41:04.413] [INFO] reqLogger - ------------request start-------------request method: GET 
 request url: / 
request data: {} 
ctx all: {"request":{"method":"GET","url":"/","header":{"host":"localhost:3000","connection":"keep-alive","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","sec-fetch-site":"none","sec-fetch-mode":"navigate","sec-fetch-user":"?1","sec-fetch-dest":"document","accept-encoding":"gzip, deflate, br","accept-language":"zh-CN,zh;q=0.9"}},"response":{"status":404,"message":"Not Found","header":{}},"app":{"subdomainOffset":2,"proxy":false,"env":"development"},"originalUrl":"/","req":"<original node req>","res":"<original node res>","socket":"<original node socket>"}
[2020-08-02T09:41:04.817] [INFO] reqLogger - ------------request start-------------request method: GET 
 request url: /favicon.ico 
request data: {} 
ctx all: {"request":{"method":"GET","url":"/favicon.ico","header":{"host":"localhost:3000","connection":"keep-alive","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36","accept":"image/webp,image/apng,image/*,*/*;q=0.8","sec-fetch-site":"same-origin","sec-fetch-mode":"no-cors","sec-fetch-dest":"image","referer":"http://localhost:3000/","accept-encoding":"gzip, deflate, br","accept-language":"zh-CN,zh;q=0.9"}},"response":{"status":404,"message":"Not Found","header":{}},"app":{"subdomainOffset":2,"proxy":false,"env":"development"},"originalUrl":"/favicon.ico","req":"<original node req>","res":"<original node res>","socket":"<original node socket>"}
```
  logs/response/response.-2020-08-02-09.log 文件代码如下：
```
[2020-08-02T09:41:04.418] [INFO] resLogger - ------------- response start ----------------response result: undefined 
response all: {"request":{"method":"GET","url":"/","header":{"host":"localhost:3000","connection":"keep-alive","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9","sec-fetch-site":"none","sec-fetch-mode":"navigate","sec-fetch-user":"?1","sec-fetch-dest":"document","accept-encoding":"gzip, deflate, br","accept-language":"zh-CN,zh;q=0.9"}},"response":{"status":404,"message":"Not Found","header":{}},"app":{"subdomainOffset":2,"proxy":false,"env":"development"},"originalUrl":"/","req":"<original node req>","res":"<original node res>","socket":"<original node socket>"} 
response time: 7 

[2020-08-02T09:41:04.817] [INFO] resLogger - ------------- response start ----------------response result: undefined 
response all: {"request":{"method":"GET","url":"/favicon.ico","header":{"host":"localhost:3000","connection":"keep-alive","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36","accept":"image/webp,image/apng,image/*,*/*;q=0.8","sec-fetch-site":"same-origin","sec-fetch-mode":"no-cors","sec-fetch-dest":"image","referer":"http://localhost:3000/","accept-encoding":"gzip, deflate, br","accept-language":"zh-CN,zh;q=0.9"}},"response":{"status":404,"message":"Not Found","header":{}},"app":{"subdomainOffset":2,"proxy":false,"env":"development"},"originalUrl":"/favicon.ico","req":"<original node req>","res":"<original node res>","socket":"<original node socket>"} 
response time: 0 
```

























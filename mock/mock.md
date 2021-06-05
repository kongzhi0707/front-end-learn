
### 开发一个简单的前端mock工具

  在很久之前我们mock数据使用的是一些工具，或者使用webpack中的before配置项来mock数据，今天我们自己也可以依赖webpack中的devServer中before配置项来弄一个简单的mock工具的。我之前写过一篇文章，是关于mock数据的，可以<a href="https://www.cnblogs.com/tugenhua0707/p/9846298.html">点击这篇文章查看</a>

#### 一：基本使用方法：

  1. 下载安装执行命令： npm install --save-dev json-mocker-tool </br>

  2. 在webpack中的devServer中的before配置下，如下： </br>
```
// webpack.config.js
const mocker = require('json-mocker-tool');

module.exports = {
  devServer: {
    //....
    before: app => {
      mocker({
        mockDir: path.resolve('./mock')
      })(app);
    }
    //....
  }
}
```
  3. 在项目的根目录下新建mock文件夹。</br>
  4. 在mock文件夹下新建json文件，该json文件是根据接口来命名的，比如你接口为 /api/xxxx/widget.json 的话，那么在mock文件夹下新建 widget.json 即可，然后把和后端约定好的数据复制进去即可。如果有多个接口，命名方式和上面一样。</br>
  5. 默认请求的是正式环境的地址，如果我们想要使用本地的mock数据的话，需要在地址栏上 加上 mode=dev ，刷新下页面即可请求到本地mock数据了。</br>

#### 二：特点

  1）默认是正式环境的接口，如想使用mock数据，需要在地址栏中加上 mode = dev; </br>
  2) json文件命名是根据接口名来命名的。比如接口为 'api/xxxx/yyy/widget.json'， 那么在mock文件夹下新建 widget.json文件即可。然后把约定的json数据复制进去。</br>
  3) Mock 文件支持热更新，修改后立即生效。</br>
  4）只支持get请求进行mock数据。</br>

#### 三：实现的思路：

  依赖webpack打包中的devServer中的before配置项，如下代码配置：
```
// webpack.config.js
const mocker = require('../lib/index.js');

module.exports = {
  devServer: {
    //....
    before: app => {
      mocker({
        mockDir: path.resolve('./mock')
      })(app);
    }
    //....
  }
}
```
  首先我们整个项目目录架构基本如下：
```
｜---- 项目目录
｜ ｜--- config
｜ ｜ ｜--- webpack.config.js
｜ ｜--- lib
｜ ｜ ｜--- index.js 
｜ ｜ ｜--- mocker.js
｜ ｜ ｜--- util.js
｜ ｜ ｜--- watcher.js
```
  lib/index.js 是入口文件，基本代码如下：
```
const bodyParser = require('body-parser');
const mocker = require('./mocker');
const watcher = require('./watcher');
const isDevelopFunc = require('./util');

module.exports = config => app => {
  app.use((req, res, next) => {
    // 如果是开发环境的话
    const { isDevelop } = isDevelopFunc(req);
    if (isDevelop) {
      bodyParser.json()(req, res, next); // 返回一个只解析json
      /**
       * extended: true, 是采用qs库，允许将富对象和数组编码为url编码格式，允许使用url编码的json体验
       * 比如 extended: true 会将数据解析成如下格式：
       * { 
           movie: { 
             _id: 'undefined',
            title: '电影名称11121',
            poster: ''
          } 
        }
      * extended: false, 是对 URL-encoded的数据的解析采用querystring库
      * extended: false 会将数据解析成如下格式：
      * { 
          'movie[_id]': 'undefined',
          'movie[title]': '电影名称11121',
          'movie[poster]': ''
        }
      */
      app.use(bodyParser.urlencoded({ extended: true })); // 返回对象的任意类型
      mocker(config)(req, res, next);
      watcher(config); // 实时监听mock数据更改
    } else {
      return next();
    }
  });
};
```
  1. 首先会判断是否是开发环境，如果是开发环境就进入代码进行处理，否则的话，就 执行 return next(); 代码，请求的是正式环境的接口。</br>
  2. 判断是否是开发环境，使用的是 lib/util.js 代码。该所有代码就只有一个函数判断是否是开发环境，基本代码如下：</br>
```
// lib/util.js

// 是否是开发环境
function isDevelopFunc(req) {
  let isDev;
  if (req.headers.referer) {
    const params = new URLSearchParams(req.headers.referer.split('?')[1]);
    isDev = params.get("mode") && params.get("mode").includes("dev");
  }
  var isDevelop = isDev ? true : false;
  return {
    isDevelop
  }
}
module.exports = isDevelopFunc;
```
  3. 如果是开发环境的话，执行 mocker(config)(req, res, next); 代码，就会调用 lib/mocker.js 代码，该文件代码的作用就是mock数据到本地。如下所有代码：
```
const fs = require("fs");
const chalk = require("chalk");
const url = require("url");
const isDevelopFunc = require("./util");

module.exports = config => (req, res, next) => {
  // 如果是开发环境的话
  const { isDevelop } = isDevelopFunc(req);
  if (isDevelop) {
    /*
    const url = require('url');
    const path = url.parse("http://localhost:9000/api/widget").path;
    console.log(path); // "/api/widget"
    */
    const { mockDir } = config;
    fs.exists(`${mockDir}`, function(exists) {
      // 如果文件夹不存在的话
      if (!exists) {
        console.log(chalk.red('该文件夹不存在, 请创建该文件夹'));
        return;
      }
    });
    let path = url.parse(req.url).path;
    let suffix; // 后缀
    
    // 只能针对get请求做mock数据
    if (req.method === "GET"  && path.includes("?")) {
      path = path.split("?")[0];
      suffix = path.substring(path.lastIndexOf('/') + 1); // 返回后缀 widget
    }
    // 获取mock文件夹下到所有文件，然后进行遍历找到对应到json文件
    const files = fs.readdirSync(`${mockDir}`); // 返回 ['xx.json', 'yy.json'] 这样到
    let response;
    if (suffix) {
      const rets = files.filter(item => item.includes(suffix));
      if (rets.length) {
        const filePath = `${mockDir}` + '/' + rets[0];
        if (fs.existsSync(filePath)) {
          response = require(`${filePath}`);
        } else {
          // if no mock file found. tell user to create it
          const msg = `\n Mock Server Error: Please crate ${filePath}.json file to enable mock`;
          res.json({ code: 404, msg });
          console.log(chalk.red(msg));
          return next();
        }
      } else {
        // if no mock file found. tell user to create it
        const msg = `\n Mock Server Error: Please crate ${filePath}.json file to enable mock`;
        res.json({ code: 404, msg });
        console.log(chalk.red(msg));
        return next();
      }
    }
    res.json(response);
  }
};
```
  如上代码的思路：

  1. 首先会判断本地项目的根目录下是否有mock文件夹，如果没有的话，提示消息，并且直接返回，因此请求还是走正式接口的。</br>
  2. 判断该请求是否是接口请求，并且请求的方式是否是get方式。并且返回请求的后缀名，比如我们请求的接口为 "http://localhost:9000/api/widget?id=LocalNews&ajax=json"; 执行 path = path.split("?")[0]; 这句代码时候，path = "http://localhost:9000/api/widget"; 再执行如下代码就获取该接口的后缀名：</br>
suffix = path.substring(path.lastIndexOf('/') + 1); // 返回后缀 widget

  3. 遍历mock文件夹，获取所有的文件，比如代码：const files = fs.readdirSync(`${mockDir}`); 如果该mock文件夹下有如下文件：widget.json, xx.json的话，最后files返回的结果是：files = ['widget.json', 'xx.json']; </br>

  4. 再判断suffix是否有，如果有说明是接口域名的。然后遍历上面files进行过滤，是否包含 我们上面返回的 suffix中是否包含 'widget' 文件名，如下代码判断：
const rets = files.filter(item => item.includes(suffix)); 最后如果找到的话，就会返回 ['widget.json'] 了。</br>

  5. 如果rets的长度大于0的话，说明找到本地对应的json文件了，然后我们会进行目录组装，如代码：const filePath = `${mockDir}` + '/' + rets[0];
最后我们的 filePath 就是我们的mock数据中的json文件的完整路径了。</br>

  6. 我们会再进行判断该路径是否存在，通过代码：fs.existsSync(filePath); 来判断，如果存在的话，使用 response = require(`${filePath}`); 获取到，最后我们使用 res.json(response); 进行转成json数据返回来。当然如果上面的都不存在的话，就会进入else代码给出提示了。如果就简单的完成一个mock数据了。</br>

  7. 使用 chokidar 插件来监听文件的变化了，了解更多 可以看下 <a href="https://github.com/paulmillr/chokidar">官网API</a>, 或看中文文档的话，可以看<a href="https://blog.csdn.net/qq_26582705/article/details/82559019">这篇文章</a>;</br>

  如下就是 lib/watcher.js 来监听文件的变化了。当我们修改我们的json文件后，在浏览器刷新下就可以生效，不需要重启webpack服务哦。如下是代码：
```
const chokidar = require("chokidar");
const chalk = require("chalk");

module.exports = ({ mockDir }) => {
  chokidar
    .watch(mockDir, {
      ignoreInitial: true // 表示是否对增加文件或者增加文件夹的时候进行发送事件，默认值为false表示add/addDir会触发事件
    })
    .on("all", (event, path) => {
      if (event !== "change" && event !== "add") return;
      try {
        // delete require cache
        Object.keys(require.cache).forEach(i => {
          i.includes(mockDir) && delete require.cache[require.resolve(i)];
        });
        console.log(chalk.green(`\n Mock file updated: ${path}`));
      } catch (error) {
        console.log(chalk.red(error));
      }
    });
  console.log(chalk.green("\n Mock server start running!"));
};
```
  <a href="https://github.com/kongzhi0707/json-mocker-tool.git">github源码查看</a>





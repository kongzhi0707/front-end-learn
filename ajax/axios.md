### axios对请求的封装和API接口管理

  Axios中文文档，<a href="https://segmentfault.com/a/1190000020786471?utm_source=tag-newest">请点击这里</a> <br/>
  <a href="https://github.com/tugenhua0707/HttpClient">github源码请查看</a> <br/>

  我们首先来了解下axios有默认如下配置项：
```
console.log(axios.defaults); // 打印axios的默认配置项有如下默认配置
```
<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/56.jpg" /> <br />

  在项目中，如果我们想使用axios作为http库来完成和后台数据接口对接工作的话，在axios库中，有 axios.get(url[,config]), axios.post(url[,data[,config]]), axios.delete(url[,config]), axios.put(url[,data[,config]]) 等常见的方法，在代码中，我们可能像如下完成一个get请求，如下代码：
```
axios.get('http://news.baidu.com/widget?id=LocalNews&ajax=json&t=1589436973689').then(res => {
  console.log(res);
  const data = res.data;
  // 判断请求状态，success字段为true代表成功
  if (data.success) {
    // 结果成功后的业务代码
  } else {
    // 结果失败后的业务代码
  }
}).catch(err => {
  console.log(err);
});
```
  如上直接调用axios可以看到，每个调用的地方都要进行响应状态的判断，冗余代码比较多。每次调用接口就有很多重复性工作。因此下面我们需要对它进行简化。

  为了解决直接调用axios的缺陷，我们一般会使用Promise对axios的二次封装，对接口响应状态进行集中判断，对外暴露get/post/put/delete等http方法。

#### axios二次封装

  一般我会在项目的src目录中，新建一个server文件夹，然后在里面新建一个http.js和一个config.js文件。http.js文件用来封装我们的axios，config.js用来统一管理我们的接口。因此项目的目录结构一般是如下：
```
|---- 项目文件夹
| |--- src
| | |--- server
| | | |--- http.js
| | | |--- config.js
```
  src/server/http.js 代码如下：
```
// http.js
import axios from 'axios';
import QS from 'qs'; // 引入qs模块, 用来序列化post类型的数据

// 全局默认配置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 10000; // 设置默认请求超时时间
axios.defaults.baseURL = 'http://localhost:9000';

/**
 * 添加一个请求拦截器
*/
axios.interceptors.request.use(function(config){
  // 在请求发出之前进行一些操作
  console.log('打印请求之前的配置:', config);
  config.withCredentials = true; // 携带cookie
  /**
   * 每次发送请求之前是否存在token，如果存在的话，则统一在http请求的header中加上token
   */
  /*
   const token = store.state.token; // 获取token
   token && config.headers.Authorization = token; // 设置token
  */
  return config;
},function(err){
  // Do something with request error
  return Promise.reject(error);
});

//添加一个响应拦截器
axios.interceptors.response.use(function(res){
  //在这里对返回的数据进行处理
  console.log('打印请求返回的数据', res);
  // 如果返回的状态码为200，说明接口请求成功，因此我们需要把成功数据传递出去即可，外部不再需要判断状态
  if (res.status === 200) {
    console.log('----', res);
    const data = res.data;
    return Promise.resolve(data);
  } else {
    return Promise.reject(res);
  }
  // return res;
},function(err) {
  /**
   * 状态码不是200的情况，会有很多情况
   * 我们可以根据返回的状态码进行一些操作，比如登录过期提示，错误提示等
   */
  if (err.response && err.response.status) {
    // 401 
    switch (err.response.status) {
      case 401:
      // ...
      break;
      case 403:
      // ....
      break;
      case 404:
      // ....
      break;
      default:
      // ....
    }
  }
  return Promise.reject(err);
});

/**
 * 封装get方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}
/**
 * 封装post方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params)).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 封装put方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [配置项]
 */
export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, QS.stringify(params)).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  });
}

/**
 * 封装delete方法
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * delete 是关键字，因此命名为 deleteItem代替
 */
export function deleteItem(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}
/**
 * patch方法，对应patch请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * 如果是formdata的数据格式，可以使用该patch方法
 */
export function patch(url, params = {}) {
  // 将数据转换为formData格式
  var formData = new FormData();
  for (const p in params) {
    formData.append(p, params[p]);
  }
  return new Promise((resolve, reject) => {
    axios.patch(url, params).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  });
}
```
  src/server/config.js 代码如下所示:
```
/**
 * api 接口统一管理
*/
import { get, post, put, deleteItem } from './http';

// get请求
export const getWidget = params => get('/api/widget', params);

// post请求
export const postWidget = params => post('/api/widget', params);

// delete请求
export const deleteWidget = params => deleteItem('/api/widget', params);

// put请求
export const putWidget = params => put('/api/widget', params);
```
  那么页面上调用方式如下会讲解到，在讲解之前我们来看下我们项目到基本的目录结构如下:
```
|---- 项目文件夹
| |--- src
| | |--- server
| | | |--- http.js
| | | |--- config.js
| | |--- js
| | | |--- app.js  // 入口文件
```
  因此我们在 src/js/app.js 调用方式如下：
```
// 引入请求
import { getWidget, postWidget, deleteWidget, putWidget } from '../server/config';

// 调用不再判断请求状态，调用方式如下：

// get 请求
getWidget({
  'id': 'LocalNews',
  'ajax': 'json'
}).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});

// post 请求
postWidget({
  'id': 'LocalNews',
  'ajax': 'json'
}).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});
```
  在 src/server/http.js 中我们设置了全局的 baseURL路径为： axios.defaults.baseURL = 'http://localhost:9000'; 我这边是本地测试环境路径，如果你们自己的前缀域名可以改成自己的前缀即可。但是有时候一个项目下可能接口会有多个不同的域名，目前如上封装的js文件不支持js配置域名，如果真有这种情况的话，可以在 src/server/config.js 中配置绝对路径，比如我们现在有一个接口 为：https://www.baidu.com/xxx/json, 那么在我们的 src/server/config.js 中我们可以写成如下：
```
// get请求
export const getWidget = params => get('https://www.baidu.com/xxx/json', params);
```
  也是可以解决的。

  但是首先我们需要解决的问题是，在多个接口域名的情况，因此会在 config.js 封装的get/post等请求在增加一层域名接口适配层，在适配层中做多个不同的域名保存。

  因此我们会在 src/server 下新建一个 domain.js 文件，用来保存所有的域名接口，因此目录结构变成如下:
```
|---- 项目文件夹
| |--- src
| | |--- server
| | | |--- http.js
| | | |--- config.js
| | | |--- domain.js
| | |--- js
| | | |--- app.js  // 入口文件
```
  src/server/domain.js 代码如下：
```
export const namespace = 'http://localhost:9000';
export const namespace2 = 'http://www.baidu.com';
```
  src/server/config.js 代码引入domain中的域名，代码如下：
```
/**
 * api 接口统一管理
*/
// 域名引入
import { namespace, namespace2 } from './domain';
import { get, post, put, deleteItem } from './http';

// get请求
export const getWidget = params => get(`${namespace}/api/widget`, params);

// post请求
export const postWidget = (params, config) => post(`${namespace}/api/widget`, params);

// delete请求
export const deleteWidget = params => deleteItem(`${namespace}/api/widget`, params);

// put请求
export const putWidget = (params, config) => put(`${namespace}/api/widget`, params);
```
  在src/server/http.js 中把如下这句baseUrl注释即可：

  // axios.defaults.baseURL = 'http://localhost:9000';

  在src/js/app.js 调用方式还是不变：
```
import { getWidget, postWidget, deleteWidget, putWidget } from '../server/config';
getWidget({
  'id': 'LocalNews',
  'ajax': 'json'
}).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err);
});
```
#### 再次封装axios

  如果我们不封装axios的话，那么发一个正常的请求，可能代码会如下：
```
axios('http://www.baidu.com/data', {
  method: 'GET',
  timeout: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'xxx',
  },
  transformRequest: [function (data, headers) {
    return data;
  }],
  // 其他请求配置...
})
.then((data) => {
  // todo: 真正业务逻辑代码
  console.log(data);
}, (err) => {
  if (err.response.status === 401) {
  // handle authorization error
  }
  if (err.response.status === 403) {
  // handle server forbidden error
  }
  // 其他错误处理.....
  console.log(err);
});
```
  对于axios更多的配置项请看官网 <a href="https://github.com/axios/axios#request-config">更多的配置项请点击</a>

  项目的目录结构还是和之前是一样的，如下：
```
|---- 项目文件夹
| |--- src
| | |--- server
| | | |--- http.js
| | | |--- config.js
| | | |--- domain.js
| | |--- js
| | | |--- app.js  // 入口文件
```
  创建一个类来进行封装，我们把 src/server/http.js 封装axios，再继续优化：
```
// src/server/http.js
class HttpClient {

}
```
#### 1) 配置超时时间
  timeout属性，我们一般可以设置为10秒时间, 如下代码：
```
// src/server/http.js
class HttpClient {
  constructor() {
    // ...
    this.timeout = 10000;
  }
}
```
#### 2) 配置允许携带凭证

  withCredentials 属性设置为true。
```
// src/server/http.js
class HttpClient {
  constructor() {
    // ...
    this.withCredentials = true;
  }
}
```
  ....  还有跟多属性配置等

  src/server/http.js 代码封装配置成如下:
```
// http.js
import axios from 'axios';
import QS from 'qs'; // 引入qs模块, 用来序列化post类型的数据

class HttpClient {
  constructor(cfg) {
    this.timeout = 10000;  // 10秒超时
    this.withCredentials = true;
    // 异常的回掉函数, 对外面全局处理
    if (cfg && cfg.responseException) {
      this.responseException = cfg.responseException;
    }
  }
  setInterceptors(instance, options) {
    // 获取请求拦截器
    instance.interceptors.request.use((config) => {
      const method = config.method;
      if (method && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
        config.data = QS.stringify(config.params);
        delete config.params;
      }
      // 外部方法处理请求拦截器后 再返回config
      options.requestCallBack && options.requestCallBack(config);
      return config;
    }, err => Promise.reject(err));

    // 处理响应拦截器
    instance.interceptors.response.use((response) => {
      // 外部方法处理响应拦截器后 再返回response
      options.responseCallBack && options.responseCallBack(response);
      if (response.status === 200) {  // 正常200的情况下
        return response.data;
      } else {
        // 处理响应拦截器异常的情况
        this.responseException && this.responseException(response);
      }
    }, (err) => {
      // 处理响应拦截器异常的情况
      this.responseException && this.responseException(err);
      console.log('err.response', err);
      return Promise.reject(err);
    })
  }
  request(options) {
    // 每次请求都会创建新的axios的实列
    const instance = axios.create();
    // 参数合并
    const config = {
      timeout: this.timeout,
      withCredentials: this.withCredentials,
      ...options,
    };
    // 设置拦截器
    this.setInterceptors(instance, config);
    return instance(config); // 返回axios的实列的执行结果
  }
}

export default HttpClient;
```
  src/server/config.js 负责统一管理我们的接口，代码如下：
```
/**
 * api 接口统一管理
*/
// 域名引入
import { namespace } from './domain';
import HttpClient from './http';


// 统一处理异常信息
const exception = {
  responseException(err) {
    console.log('返回异常', err);
  }
};
const httpClient = new HttpClient(exception);
const params = function(options) {
  const obj = {};
  for (const i in options) {
    obj[i] = options[i];
  }
  return obj;
};
// 请求
export const getWidget = options => httpClient.request({
  url: `${namespace}/api/widget`,
  params: params(options),
  method: 'post',
  // 请求拦截器回调函数
  requestCallBack(cfg) {
    console.log('xxxx--请求拦截器添加参数----');
    console.log(cfg);
    cfg.headers['Accept'] = 'application/x-www-form-urlencoded';
    cfg.headers.common['Authorization'] = 'AUTH_TOKEN';
  },
  // 响应拦截器回调函数
  responseCallBack(cfg) {
    // cfg.status = 404;
    console.log('---响应拦截器可以对返回的数据进行构造---', cfg);
    // cfg.data = {'xx': 11};
  }
});
```
  src/server/domain.js
```
export const namespace = 'http://localhost:9000';
export const namespace2 = 'http://www.baidu.com';
```
  页面上如下调用即可，src/js/app.js 代码调用如下：
```
import { getWidget } from '../server/config';

getWidget({
  'id': 'LocalNews',
  'ajax': 'json'
}).then((data) => {
  console.log('data---');
  console.log(data);
}).catch(err => {
  console.log(err);
});
```
<a href="https://github.com/tugenhua0707/HttpClient">github源码请查看</a>














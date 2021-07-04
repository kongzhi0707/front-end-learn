
### 实现JSONP
```
/**
 * 创建一个script标签地址，指向请求服务器，将回调函数名作参数带到服务器。
 * 服务器拿到回调名称，并返回前端
 */
function jsonp(url, cb) {
  let script = document.createElement('script');
  let uniqueName = `jsonpCallback${new Date().getTime()}`;
  script.src = `url${url.indexOf('?') > -1 ? '&' : '?'}callback=${uniqueName}`;
  document.body.appendChild(script);

  window[uniqueName] = (res) => {
    cb && cb(res);
    document.body.removeChild(script);
    delete window[uniqueName];
  }
}

// 调用
jsonp('getList', (res) => {
  console.log(res)
});
```

#### promise 的写法
```
function jsonp ({url, query}) {
  let script = document.createElement("script");
  let cb = `jsonpCallBack${new Date().getTime()}${Math.floor(Math.random(5)*100000)}`
  let params = {...query, cb}

  let arr = []
  for (let key in params) {
    arr.push(`${key}=${params[key]}`)
  }

  script.src = `${url}?${arr.join("&")}`
  document.body.appendChild(script)

  return new Promise((resolve, rej) => {
    window[cb] = function (res) {
      resolve(res)
      document.body.removeChild(script)
      delete window[cb]
    }
  })
}

jsonp({
  url:'/getList',
  query: {name: 'ys',age: 19}
}).then((res) => {
  console.log(res)
})
```

### 实现一个请求控制函数

说明：一次性输入多个url，要求实现按照的最大值并发请求，完成一个请求后自动发送下一个，请求全部结束后调用回调函数。
```
var urls = ['http://1', 'http://2', 'http://3', 'http://4'];
function _fetch(url) {
  return new Promise(resolve => {
    console.log('---fetching---', url);
    resolve(url);
  })
}
var requestControl = function(urls, max, callback) {
  // .... 代码
})
```
#### 使用递归：
```
var urls = ['http://1', 'http://2', 'http://3', 'http://4'];
function _fetch(url) {
  return new Promise(resolve => {
    console.log('---fetching---', url);
    resolve(url);
  })
}
var requestControl = function(urls, max, callback) {
  let urlsCopy = [...urls]; // 防止影响外部urls变量
  function request() {
    function Handle() {
  	  count--; // 请求完成一个，就减少一个
  	  console.log('---end当前并发数为：' +count);
  	  if (urlsCopy.length) {
  	    request();
  	  } else {
  	    callback();
  	  }
    }
    count++;
    console.log('start当前并发数：' +count);
    _fetch(urlsCopy.shift()).then(Handle).catch(Handle);
    // 并发数不足时递归
    count < max && request();
  }
  let count = 0; // 请求并发数
  request();
};
let max = 4;
let callback = () => {
  console.log('run callback');
};
//执行
requestControl(urls, max, callback);
```









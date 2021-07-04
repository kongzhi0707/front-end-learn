
### 函数防抖

#### 1）什么是函数防抖？

函数防抖，是指触发事件后，在n秒内函数只能执行一次，如果触发事件后在n秒内又触发了事件，则会重新计算函数延迟时间。

比如我们日常生活中，坐电梯的时候，如果电梯检测到有人进来，就会等待10秒钟，如果这个时候又有人进来的话(10秒之内重复触发事件)，那么电梯就会再多等待10秒，只有电梯检测到10秒钟后没有人进来，电梯门才会关闭掉。函数防抖关键在 "一个事件" 发生一定时间之后，才会执行特定的动作。

#### 2）为什么需要函数防抖？

有一些事件，比如 onresize, scroll, mousemove, mousehover等，会被频繁的触发，如果不做限制的话，有可能一秒之内执行几十次。几百次。或者说在短时间内重复调用ajax请求，会造成网络拥塞，增加服务器压力。

#### 如何实现函数防抖？

我们需要一个setTimeout来延迟执行需要执行的代码，如果多次触发的话，则需要把上次记录的延迟时间使用 clearTimeout 清掉。重新开始计时。若计时期间事件没有被重新触发，等延迟时间计时完毕，则会执行目标代码。

简单版的代码如下：
```
function debounce(fn, wait) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, wait);
  }
}

function handle() {
  console.log(11111);
}

window.addEventListener('resize', debounce(handle, 1000));
```
#### 函数防抖使用场景

1. 搜索框搜索输入，只需用户最后一次输入完，再发送请求。
2. 用户名/手机号/邮箱输入验证。
3. 浏览器窗口大小改变后，比如resize事件。

函数防抖其实分为 "立即执行版" 和 "非立即执行版" 的。立即执行版的含义是：触发事件后函数会立即执行，然后n秒内不触发事件才能继续执行函数的效果。
非立即执行版：触发事件后函数不会立即执行，而是在n秒后执行，如果在n秒内又触发了事件，则会重新计算函数执行时间。

下面我们可以封装一个 两者都兼容的版本。
```
/*
 * 函数防抖
 * @param fn 需要执行的函数
 * @param wait 延迟执行的时间 (毫秒)
 * @param immediate --- true 表示立即执行，false 表示非立即执行
*/

function debounce(fn, wait, immediate) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) { // 立即执行
      // 如果已经执行过了，就不再执行
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      console.log('---callNow---', callNow);
      if (callNow) {
        fn.apply(context, args);
      }
    } else { // 非立即执行
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  }
}

// 测试代码

function handle() {
  console.log(11111);
}

window.addEventListener('resize', debounce(handle, 3000, true)); // 立即执行

// window.addEventListener('resize', debounce(handle, 1000, false)); // 非立即执行
```






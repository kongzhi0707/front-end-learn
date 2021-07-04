
### 函数节流

#### 1）什么是函数节流？

概念：限制一个函数在一定时间内只能执行一次。只有大于设定的周期后才会执行第二次。
什么意思呢？当持续触发事件时，保证一定时间段内只调用一次事件处理函数，简单的说，就是让一个函数无法在很短时间间隔内被连续调用，只有当上一次函数执行过后
规定的时间间隔，才能进行下一次函数的执行。

#### 2）为什么需要函数节流？

有一些事件，比如 onresize, scroll, mousemove, mousehover等，会被频繁的触发，如果不做限制的话，有可能一秒之内执行几十次。几百次。或者说在短时间内重复调用ajax请求，会造成网络拥塞，增加服务器压力。

#### 函数节流的应用场景？

1. DOM元素的拖曳功能的实现(mousemove).
2. 射击游戏的 mousedown/keydown事件。
3. 计算鼠标移动的距离。（mousemove）
4. 搜索事件(keyup).
5. 滚动事件scroll，懒加载，加载更多或监听滚动条的位置。
6. 防止高频点击提交，防止表单重复提交。

#### 函数节流和防抖的区别是：函数节流是周期性进行触发的，也就是在规定的时间内触发的次数也是固定的。函数防抖则不固定，会被打断，打断就需要重新积蓄时长。

#### 如何实现函数节流？

函数节流主要有两种实现方法：时间戳和定时器。

#### 1）时间戳

实现思路：如果触发了，就用Date方法获取当前时间now，和上一次调用的时间 prev 做比较。

1.1）如果时间差大于等于规定的时间间隔，就执行一次目标函数，执行之后，将存储上一次调用时间prev的值更新为当前时间now。
1.2）如果时间差小于规定的时间间隔，则等待下一次触发重新进行第一步操作。

代码实现如下：
```
/*
 * @param fn 需要调用的函数
 * @param delay 规定的时间间隔
*/
function throttle(fn, delay) {
  var context, args;
  var prev = 0;
  return function() {
    context = this;
    args = arguments;
    var now = +new Date();
    if (now - prev >= delay) {
      fn.apply(context, args);
      prev = now;
    }
  }
}

// 测试代码如下

function handle() {
  console.log(11111);
}

window.addEventListener('resize', throttle(handle, 1000));
```

#### 2) 定时器

实现思路：当定时器不存在时，说明可以执行函数。定义一个定时器来向任务队列注册目标函数。目标函数执行后保存定时器ID变量为空，当定时器已经被定义，说明已经在
等待过程中，则等待下次触发事件再进行查看。

代码如下：
```
/*
 * @param fn 需要调用的函数
 * @param delay 规定的时间间隔
*/
function throttle(fn, delay) {
  var timer = null;
  var context, args;
  return function() {
    context = this;
    args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(context, args);
      }, delay);
    }
  }
}

// 测试代码如下

function handle() {
  console.log(11111);
}

window.addEventListener('resize', throttle(handle, 1000));
```

#### 时间戳 和 定时器 的区别：

时间戳：触发事件一发生先执行目标函数，然后等待规定的时间间隔再次执行目标函数，如果在等待过程中停止触发，后续不会再执行目标函数。
定时器：触发事件一发生，先等待规定的时间间隔再执行目标函数，即使在等待的过程中停止触发，若定时器已经在任务队列里注册了定时器，也会执行最后一次。

#### 定时器 + 时间戳

如果我们想要能够控制鼠标移入能够立即执行，停止触发时候能够再执行一次的话，我们可以综合时间戳和定时器两种方法来实现该功能。

代码如下：

```
/*
 * @param fn 需要调用的函数
 * @param delay 规定的时间间隔
*/
function throttle(fn, delay) {
  var timeout, context, args;
  var prev = 0;
  var throttled = function() {
    context = this;
    var now = +new Date();
    // 下次触发fn剩余时间
    var remaining = delay - (now - prev);
    // 如果没有剩余的时间了或你改了系统时间
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      fn.apply(context, args);
      prev = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        prev = +new Date();
        timeout = null;
        fn.apply(context, args);
      }, remaining);
    }
  };
  return throttled;
}

// 测试代码如下

function handle() {
  console.log(11111);
}
window.addEventListener('resize', throttle(handle, 1000));
```
如上测试后，我们可以看到会打印两次信息，当我们缩放窗口时候，会执行一次，当时间间隔完成后，又会执行一次回调。

#### 注意：控制好在上一周期的 "尾" 和 下一周期的 "头" 之间的时间间隔，我们引入了变量 remaining 表示还需要等待的时间。来让尾部那一次执行也符合时间间隔。

#### 优化

在上面的时间戳和定时器的基础上，如果我们想要实现是否启用第一次或尾部最后一次计时回调的执行，要如何实现呢？

我们可以在throttle函数中添加第三个参数，根据该值判断需要那种效果，我们可以约定：

leading：false表示禁用第一次执行.
trailing：false表示禁用停止触发的回调.

代码如下：
```
/*
 * @param fn 需要调用的函数
 * @param delay 规定的时间间隔
*/
function throttle(fn, delay, options) {
  var timeout, context, args;
  var prev = 0;
  if (!options) {
    options = {};
  }
  var later = function() {
    prev = options.leading === false ? 0 : +new Date();
    fn.apply(context, args);
    context = args = timeout = null;
  };
  var throttled = function() {
    var now = +new Date();
    if (!prev && options.leading === false) {
      prev = now;
    }
    context = this;
    args = arguments;
    // 下次触发fn剩余时间
    var remaining = delay - (now - prev);
    // 如果没有剩余的时间了或你改了系统时间
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      fn.apply(context, args);
      prev = now;
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  // 取消操作
  throttled.cancel = function() {
    clearTimeout(timeout)
    prev = 0;
    timeout = null;
  };
  return throttled;
}

// 测试代码如下

function handle() {
  console.log(11111);
}
window.addEventListener('resize', throttle(handle, 1000, { leading: true, trailing: false }));
```
#### 注意：leading 和 trailing 不能同时设置false。







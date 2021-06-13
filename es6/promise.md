
### 理解 Promise 的实现

我们平时使用Promise编写代码一般如下写法：
```
new Promise((resolve, reject) => {
  // http请求
  http.get('some_url', (res) => {
    resolve(res);
  });
}).then((res) => {
  console.log('----res---', res);
})
```
如上代码，我们可以看到，Promise 接受一个函数，并且该函数会自动执行代码。然后会有一个then方法。
因此我们需要封装成如下代码：
```
class Promise2 {
  callbacks: [];
  constructor(fn) {
    fn(this._resolve.bind(this));
  }
  then(onFulfilled) {
    this.callbacks.push(onFulfilled);
  }
  _resolve(value) {
    this.callbacks.forEach(fn => fn(value));
  }
}
```
然后我们代码调用如下：
```
let p = new Promise2((resolve) => {
  setTimeout(() => {
    console.log('done');
    resolve('1秒');
  }, 1000);
}).then((tip) => {
  console.log(tip);
});
```
在浏览器中会打印：'done', '1秒';

上面代码的含义：

  1. 创建Promise实列时传入的函数会赋予一个函数的参数，即resolve。他接受一个参数value。代表异步操作返回的结果。当异步操作执行成功后，会调用resolve方法。因此会执行callbacks队列的回调一一执行。

  2. 封装then方法。将想要在Promise异步操作成功时需要执行的onFulfilled放入callbacks队列中。

理清思路：首先我们 new Promise 的时候，在构造函数 constructor中传递了一个参数 fn，该函数需要自动执行，在该函数内部设置了一个定时器模拟异步场景的情况下。接着我们会调用Promise对象的then方法注册异步回调完成后的 onFulfilled 成功函数。最后当定时器异步操作完成后，调用 resolve(value).
就会执行 then 方法注册的 onFulfilled 成功函数。

如上代码，then方法注册的 onFulfilled 是存放在一个数组中，如果放入多个回调函数的话，就可以调用多次了。并且注册多个 onFulfilled 会在异步操作完成后根据我们添加的顺序会依次执行代码。比如如下代码，我想让它执行多次then的回调的话。
```
let p = new Promise2((resolve) => {
  setTimeout(() => {
    console.log('done'); // 1. 先打印出 done
    resolve('1秒');
  }, 1000);
}).then((tip) => {
  console.log(tip); // 2. 然后打印出 1秒
}).then((tip) => {
  console.log('-----then2---', tip); 
});
```
因此我们需要把代码稍微改下，在then函数里面返回 this 即可：
```
class Promise2 {
  callbacks = [];
  constructor(fn) {
    fn(this._resolve.bind(this));
  }
  then(onFulfilled) {
    this.callbacks.push(onFulfilled);
    return this; // 新加的
  }
  _resolve(value) {
    this.callbacks.forEach(fn => fn(value));
  }
}
```
#### 增加状态

上面Promise的实现存在一个问题，如果在then方法注册onFulfilled。resolve就执行了，onFulfilled 就执行不到。如下代码，把setTimeout去掉。
```
class Promise2 {
  callbacks = [];
  constructor(fn) {
    fn(this._resolve.bind(this));
  }
  then(onFulfilled) {
    this.callbacks.push(onFulfilled);
    return this; // 新加的
  }
  _resolve(value) {
    this.callbacks.forEach(fn => fn(value));
  }
}
let p = new Promise2((resolve) => {
  // setTimeout(() => {
    console.log('done'); // 打印出 done
    resolve('1秒');
  // }, 1000);
}).then((tip) => {
  console.log(tip); // 不会被打印
}).then((tip) => {
  console.log('-----then2---', tip); // 不会被打印
});
```
如上代码，把setTimeout去掉的话，只会打印 'done'， 后面的then不会被打印，resolve被执行的时候，callbacks还是空数组。还没有onFulfilled注册
函数。

因此为了解决这个问题，我们需要增加状态，也就是我们大家熟悉的 pending, fulfilled, rejected.

在Promise/A+ 规范中明确规定了，pending 可以转化为 fulfilled 或 rejected 并且只能转化一次。也就是说如果 pending 转化到 fulfilled 状态后，就不能再转换到 rejected。且 fulfilled 和 rejected 状态只能由 pending 转化而来。

因此我们需要增加状态，代码如下：
```
class Promise2 {
  callbacks = [];
  state = 'pending'; // 增加状态
  value = null; // 保存结果
  constructor(fn) {
    fn(this._resolve.bind(this));
  }
  then(onFulfilled) {
    if (this.state === 'pending') {
      this.callbacks.push(onFulfilled);
    } else {
      // 在resolve之后，直接执行回调，返回结果
      onFulfilled(this.value);
    }
    return this;
  }
  _resolve(value) {
     this.state = 'fulfilled'; // 改变状态
     this.value = value; // 保存结果
     this.callbacks.forEach(fn => fn(value));
  }
}
// 测试代码如下
let p = new Promise2((resolve) => {
  console.log('done'); // 打印出 done
  resolve('1秒');
}).then((tip) => {
  console.log(tip); // 打印出 1秒
}).then((tip) => {
  console.log('-----then2---', tip); // 打印出：----then2--- 1秒
});
```
#### 注意：当resolve同步执行时，虽然callbacks为空，回调函数还没有注册，但是没有关系，当注册好了后，判断状态为 fulfilled, 就会立即执行回调。

如上then方法中返回了this，可以使Promise实列可以多次调用then方法。但因为是同一个实列，调用多次then也只能返回相同的结果。比如我想支持如下的：
```
function getTestId(url) {
  return new Promise(function(resolve) {
    // 异步请求
    http.get(url, function(id) {
      resolve(id);
    })
  })
}

getTestId('url').then(function(id) {
  // do something
  return genNameById(id);
}).then(function(name) {
  // do something
  return getName(name);
}).then(function(age) {
  // do something
  return getAge(age);
});
```
上面每个then注册的 onFulfilled 都返回了不同的结果。因此我们直接在then方法中 return this 是不能达到这个效果的。

#### 链式调用的实现

后面再折腾。。。
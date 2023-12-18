### 相似的请求合并

#### 背景

在开发中，有一种很常见的场景，比如在无代码编辑器里面，一个指标卡组件就是一个 ajax 请求，但是页面上有很多很多指标卡，然后根据不同的参数去发相同的请求，这就会导致多个 ajax 请求，我们能不能有一种方法，把参数合并，只发一个 ajax 请求，然后返回的数据根据数据分别对应上的指标卡上？

#### 收集类型

首先我们思考一个问题，如果一个函数同步调用了多次，那么如何只执行一次呢？比如，我们下面这段代码：

```
function print() {
  console.log("---print----");
}
for (let i = 0; i < 10; i++) {
  print();
}
```

如上代码 会打印 10 次 print。如果我只想打印 1 次 print 呢？该如何实现？

我们可以看下，Vue 中响应式数据更新的优化策略。主体思想上：把需要触发的回调函数放进一个任务队列中，同时过滤掉相同的回调。并且在下一次事件循环中执行队列中的所有回调。如下代码：

```
// 定义一个任务队列
const jobQueue = new Set();
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列中
const p = Promise.resolve();

// 一个标志代表是否正在刷新队列
let isFlushing = false;
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return
  // 设置为 true，代表正在刷新
  isFlushing = true
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    // 结束后重置 isFlushing
    isFlushing = false
  })
}
```

因此我们参考上面的思路，把 print 函数改造一下，如下代码：

```
// 定义一个任务队列
const jobQueue = new Set();
// 使用 Promise.resolve() 创建一个promise实例，我们用它将一个任务添加到微任务队列中
const p = Promise.resolve();

// 一个标志代表是否正在刷新队列
let isFlushing = false;
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return;
  // 设置为true，代表正在刷新
  isFlushing = true;
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    // 结束后重置 isFlushing
    isFlushing = false;
  })
}

function transform(callback) {
  return function () {
    // 每次调用时，将回调函数添加到 jobQueue 队列中
    jobQueue.add(callback);
    // 调用 flushJob 刷新队列
    flushJob();
  }
}

const print = transform(() => {
  console.log('----print---');
});

for (let i = 0; i < 10; i++) {
  print();
}
```

如上代码，只会打印一次。 因此我们可以去收集传入的多种类型。比如下面这段代码：

```
function print(type) {
  console.log(type);
}
print("a")
print("b")
print("c")
print("a")
```

如上虽然 print 调用了 4 次，但是我们期望最后只打印一次，且结构为 ["a", "b", "c"];
我们可以改造成如下代码：

```
const collectTypes = function (callback) {
  const types = new Set();
  const p = Promise.resolve();
  let isFlushing = false;

  function flush() {
    if (isFlushing) return;
    isFlushing = true;
    p.then(() => {
      const typeValues = [...types.values()];
      callback(typeValues);
    }).finally(() => {
      isFlushing = false;
      types.clear();
    })
  }
  return function (type) {
    types.add(type);
    flush();
  }
}

const print = collectTypes(type => {
  console.log(type);  // 打印 ['a', 'b', 'c', 'd']
});

print("a");
print("b");
print("c");
print("d");
```

如上代码：

```
1. collectTypes 接收一个函数作为入参，同时执行完成后返回一个新函数。
2）新函数每次执行时，会将传入的 type 收集在内部的 types 中。
3）在 promise 实例 p 的 then 方法中处理最终结果。执行 callback 并将收集到的所有类型传入，同时在 finally 方法中清空 types.
```

#### 发起请求

收集到所有类型后，接下来就是发起请求。代码如下：

```
const mergeSimilarRequest = function (req) {
  const types = new Set();
  let p = Promise.resolve();
  let isFlushing = false;

  function flush() {
    if (isFlushing) return;
    isFlushing = true;
    p = p.then(() => {
      const values = [...types.values()];
      return req(values);
    }).finally(() => {
      isFlushing = false;
      types.clear();
    })
  }
  return function fetchData(type) {
    types.add(type);
    flush();
    return p;
  }
}

const data = [
  { type: "a", name: "a-1" },
  { type: "a", name: "a-2" },
  { type: "b", name: "b-1" },
  { type: "b", name: "b-2" },
  { type: "c", name: "c-1" },
  { type: "c", name: "c-2" }
]

const request = types => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("发起请求,types:", types)
      const res = data.filter(v => types.includes(v.type))
      resolve(res)
    }, 1000)
  })
}

const fetchData = mergeSimilarRequest(request)

fetchData("a").then(dataA => {
  console.log("dataA", dataA)
})
fetchData("b").then(dataB => {
  console.log("dataB", dataB)
})
```

如下图所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/es6/images/1.png" /> <br />

从执行结果可以看出：request 只执行了一次，并且入参的请求类型是 a 和 b，dataA 与 dataB 都是请求到的所有数据，还需要进行拆分。

#### 拆分数据

现在已经知道实例 p 返回的是所有数据，而返回函数 fetchData 的入参里有 type，那么去做数据拆分就十分容易了。代码如下：

```
const mergeSimilarRequest = function (request) {
  /* ... */
  return function fetchData(type) {
    /* ... */
    return p.then(res => {
      return res.filter(v => v.type === type)
    })
  }
}
```

但是，我们还需要考虑通用性的问题，并不是所有的类型字段就叫做 type，也有可能叫做 type1、type2，返回的结果 res 也不一定都是数组类型。所以，不妨把这个拆分规则抽离成一个方法 filterRule ，作为 mergeSimilarRequest 的新入参传入。如下所示：

```
const mergeSimilarRequest = function (request, filterRule) {
  /* ... */
  return function fetchData(type) {
    /* ... */
    return p.then(res => {
      return filterRule(res, type)
    })
  }
}
```

后续测试的时候发现，request 和 filterRule 其实是强关联的，filterRule 的内部逻辑完全依赖于 request 返回数据的类型，于是就把它俩合并成一个入参，最终版代码如下：

```
const mergeSimilarRequest = function ({ request, filterRule }) {
  const types = new Set()
  let p = Promise.resolve()
  let isFlushing = false

  function flush() {
    if (isFlushing) return
    isFlushing = true
    p = p
      .then(() => {
        const values = [...types.values()]
        return request(values)
      })
      .finally(() => {
        isFlushing = false
        types.clear()
      })
  }
  return function fetchData(type) {
    types.add(type)
    flush()
    return p.then(res => {
      return filterRule(res, type)
    })
  }
}
```

测试代码如下：

```
const data = [
  { type: "a", name: "a-1" },
  { type: "a", name: "a-2" },
  { type: "b", name: "b-1" },
  { type: "b", name: "b-2" },
  { type: "c", name: "c-1" },
  { type: "c", name: "c-2" }
]

const request = types => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("发起请求，types:", types)
      const res = data.filter(v => types.includes(v.type))
      resolve(res)
    }, 1000)
  })
}
const filterRule = (data, type) => {
  return data.filter(v => v.type === type)
}
const config = {
  request,
  filterRule
}

const fetchData = mergeSimilarRequest(config)

fetchData("a").then(dataA => {
  console.log("dataA", dataA)
})
fetchData("b").then(dataB => {
  console.log("dataB", dataB)
})
```

打印结果如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/es6/images/2.png" /> <br />

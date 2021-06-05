### 了解面向切面编程AOP

#### 1. 什么是AOP？

  AOP(面向切面编程)的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来。换句话说，分离业务代码和非业务代码。在前端常见的需求中，有以下一些常见业务可以使用AOP将从其分离出来。

1. Node.js 日志log。<br />
2. 埋点，数据上报。 <br />
3. 性能分析，统计函数执行时间。<br />
4. 给ajax请求动态添加参数。 <br />
5. 分离表单请求和验证。 <br />
6. 安全控制。 <br />
7. 异常处理操作。 <br />
8. .... 等等 <br />

  把如上一些功能抽离出来之后，再通过 "动态织入" 的方式掺入到业务逻辑模块中。

#### 2. 使用AOP的优势？

  AOP的优点是：可以保持业务逻辑模块的纯净和高内聚性。其次我们还可以复用分离出来的非业务代码模块等功能。

#### 了解装饰器（Decorator）

  提到AOP，就先要了解ES7中的装饰器了，想要了解装饰器，请看<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/es6/decorator.md">这篇文章</a>

  在ES6+之前，要使用装饰器模式，一般是通过 Function.prototype.before 做前置装饰，使用 Function.prototype.after做后置装饰。但是在ES7中，javascript引入了 Decorator提案，提供了对javascript的类和类里面的方法进行装饰的能力。

#### 3. 使用 Function.prototype.before 和 Function.prototype.after 来做前置和后置装饰器

  下面我们先看使用 Function.prototype 来做前置和后置装饰器的功能。
```
Function.prototype.before = function(beforefn) {
  var _self = this; // 保存原函数的引用
  return function() {
    beforefn.apply(this, arguments); // 执行新函数
    return _self.apply(this, arguments); // 执行原函数
  }
}

Function.prototype.after = function(afterfn) {
  var _self = this; // 保存原函数的引用
  return function() {
    var ret = _self.apply(this, arguments); // 执行原函数
    afterfn.apply(this, arguments); // 调用新函数作为回调
    return ret;
  }
}
```
  下面我们来看一个使用 Function.prototype.before(前置) 和 Function.prototype.after(后置) 做个简单的demo，如下：
```
Function.prototype.before = function(beforefn) {
  var _self = this; // 保存原函数的引用
  console.log('--before---');
  console.log(_self);
  return function() {
    console.log(_self);
    console.log(this); // 指向 undefined
    beforefn.apply(this, arguments); // 执行新函数
    return _self.apply(this, arguments); // 执行原函数
  }
}

Function.prototype.after = function(afterfn) {
  var _self = this; // 保存原函数的引用
  console.log('------');
  console.log(this);
  console.log('---after---');
  return function() {
    console.log(_self);
    console.log('aaa');
    console.log(this); // 指向 undefined
    var ret = _self.apply(this, arguments); // 执行原函数
    console.log('after');
    afterfn.apply(this, arguments); // 调用新函数作为回调
    return ret;
  }
}
// 测试demo
var func = function() {
  console.log(2);
}
var retFunc = func.before(function(){
  console.log(1);
}).after(function() {
  console.log(3);
});
retFunc();
```
  在浏览器打印如下信息：
```
--before---
ƒ func() {
  console.log(2);
}
------
ƒ () {
  console.log(_self);
  console.log(this); // 指向 undefined
  beforefn.apply(this, arguments); // 执行新函数
  return _self.apply(this, arguments); // 执行原函数
}
---after---
ƒ () {
  console.log(_self);
  console.log(this); // 指向 undefined
  beforefn.apply(this, arguments); // 执行新函数
  return _self.apply(this, arguments); // 执行原函数
}
aaa
undefined
ƒ func() {
  console.log(2);
}
undefined
1
2
after
3
```
  从如上代码打印中，我们可以理解如下信息：

  首先我们调用代码方式如下：
```
var func = function() {
  console.log(2);
}
var retFunc = func.before(function(){
  console.log(1);
}).after(function() {
  console.log(3);
});
retFunc();
```
  当我们首先调用 func.before(function(){ console.log(1);}) 代码的时候，先调用 Function.prototype.before 函数，因此打印 console.log('--before---'); 打印 console.log(_self); 此时此刻的this指向的是  var func = function() { console.log(2); } 这个函数。因为this的指针是
  调用谁就指向谁。最后返回如下函数赋值给retFunc变量：
```
return function() {
  console.log(_self);
  console.log(this); // 指向 undefined
  beforefn.apply(this, arguments); // 执行新函数
  return _self.apply(this, arguments); // 执行原函数
}
```
  但是由于代码又调用了 Function.prototype.after 这个函数。因此打印 console.log('------'); 在after中打印this，即：console.log(this); 就指向了 before中返回的函数，即：
```
return function() {
  console.log(_self);
  console.log(this); // 指向 undefined
  beforefn.apply(this, arguments); // 执行新函数
  return _self.apply(this, arguments); // 执行原函数
}
```
  接着就打印 console.log('---after---'); 信息出来。最后在 after 函数内部也返回了一个函数，如下代码：
```
return function() {
  console.log(_self);
  console.log('aaa');
  console.log(this); // 指向 undefined
  var ret = _self.apply(this, arguments); // 执行原函数
  console.log('after');
  afterfn.apply(this, arguments); // 调用新函数作为回调
  return ret;
};
```
  因此 retFunc 最终被赋值为 如上 after中返回的函数。当我们在代码中调用的 retFunc()的时候。就执行了该函数，因此打印出 console.log(_self);
此时 _self 保存的是 Function.prototype.before 返回的函数的引用。因此打印信息如下：
```
return function() {
  console.log(_self);
  console.log(this); // 指向 undefined
  beforefn.apply(this, arguments); // 执行新函数
  return _self.apply(this, arguments); // 执行原函数
}
```
  接着就打印 'aaa'; 接着打印 console.log(this); 该this指向了undefined; 再执行 var ret = _self.apply(this, arguments); 这句代码的时候，由于 _self 执行的是 Function.prototype.before 中返回的函数，即如下：
```
return function() {
  console.log(_self);
  console.log(this); // 指向 undefined
  beforefn.apply(this, arguments); // 执行新函数
  return _self.apply(this, arguments); // 执行原函数
}
```
  因此该函数被调用了，因此 Function.prototype.before 中保存的 _self 指向的被调用的函数 func。 因此打印 console.log(_self); 打印如下：
```
ƒ func() {
  console.log(2);
}
```
  同理，当我们打印 console.log(this); 也指向的是 undefined; 
  接着执行 beforefn.apply(this, arguments); 函数后，就打印 1了。然后再执行 _self.apply(this, arguments); 就执行了 func函数了，因此打印2.
  并且返回了该函数的引用，赋值给了 Function.prototype.after中的 ret 变量，代码再往下执行就打印 console.log('after'); 代码继续执行：
afterfn.apply(this, arguments); 就调用了 function() { console.log(3); } 因此最后打印3了。

#### 4. AOP的应用场景

#### 4.1 性能分析，统计函数执行时间

  比如我们发现一段代码执行的时间比较耗时，我们想知道这段代码执行了多长时间，一般我们的做法是：在执行阶段记录一下当前时间，在执行结束阶段用当前时间减去开始执行的时间，比如如下代码：
```
function testFunc() {
  const startTime = new Date().getTime();
  for (let i = 0; i < 1000; i++) {
    let div = document.createElement('div');
    document.body.appendChild(div); 
  }
  const endTime = new Date().getTime();
  console.log(endTime - startTime);
}
testFunc();
```
  如上代码确实是可以解决问题的，但是我们要把我们计算时间的代码插入到函数内部去，要去源码中增加代码，这样业务逻辑代码和非业务逻辑代码耦合起来了，并且修改源代码把测试执行多长的时间代码去掉，不小心删了一些原代码，可能会导致一些问题的产生。因此我们需要使用 AOP的方式加以改进。通过 "动态织入" 的方式掺入到业务逻辑模块中。而不用修改原来的业务逻辑代码。

  如下代码测试：
```
Function.prototype.before = function(beforefn) {
  var _self = this; // 保存原函数的引用
  return function() {
    beforefn.apply(this, arguments); // 执行新函数
    return _self.apply(this, arguments); // 执行原函数
  }
}

Function.prototype.after = function(afterfn) {
  var _self = this; // 保存原函数的引用
  return function() {
    var ret = _self.apply(this, arguments); // 执行原函数
    afterfn.apply(this, arguments); // 调用新函数作为回调
    return ret;
  }
}

function testFunc() {
  for (let i = 0; i < 1000; i++) {
    let div = document.createElement('div');
    document.body.appendChild(div); 
  }
}
const logTime = function(fn) {
  let startTime;
  return fn.before(function(){
    startTime = new Date().getTime();
    console.log('before');
  }).after(function() {
    const endTime = new Date().getTime();
    console.log(endTime - startTime);
    console.log('after');
  })
}
// 调用
logTime(testFunc)();
```
  控制台依次打印 before 20 after 等信息出来。

#### 4.2 分离表单请求和验证

  我们在提交表单之前，一般会先验证一下表单参数是否合规，类似如下代码一样进行验证，如下代码：
```
<div id="app">
  <form id="formId">
    <input type="text" id="inputId" />
    <input type="button" value="提交" id="submitBtn"/>
  </form>
</div>
<script>
  var formId = document.getElementById('formId');
  var inputId = document.getElementById('inputId');
  var submitBtn = document.getElementById('submitBtn');
  function validate(value) {
    if (!value.length) {
      console.log('请输入值');
      return false;
    }
    if (value.length > 10) {
      console.log('长度不能大于10');
      return false;
    }
    return true;
  }
  function submitFunc(value) {
    if (!validate(value)) {
      return;
    }
    console.log('提交请求');
    // 提交请求
    formId.submit(value);
  }
  submitBtn.addEventListener('click', function() {
    const value = inputId.value;
    console.log(value);
    submitFunc(value);
  });
</script>
```
  如上代码是使用一般的情况下解决问题的，但是validate验证函数中有多个if else 这样的代码，我们先使用策略模式来优化下上面的代码，优化后的代码可能变成如下所示：
```
<div id="app">
  <form id="formId">
    <input type="text" id="inputId" />
    <input type="button" value="提交" id="submitBtn"/>
  </form>
</div>
<script>
  var formId = document.getElementById('formId');
  var inputId = document.getElementById('inputId');
  var submitBtn = document.getElementById('submitBtn');
  const validate_rules = {
    not_empty: function(value) {
      return value !== '';
    },
    max_length: function(value) {
      return value.length < 10;
    }
  };
  function validate(value) {
    for (var i in validate_rules) {
      if (!validate_rules[i].apply(this, arguments)) {
        console.log('输入的值不合法');
        return false;
      }
    }
    return true;
  }
  function submitFunc(value) {
    if (!validate(value)) {
      return;
    }
    // 提交请求
    formId.submit(value);
  }
  submitBtn.addEventListener('click', function() {
    const value = inputId.value;
    submitFunc(value);
  });
</script>
```
  如上代码，我们可以看到，submitFunc函数中有 validate 验证函数，又有form表单提交代码submit，导致submitFunc函数不够纯洁，下面我们使用AOP来改造下，
  我们希望如下代码风格：
```
// 定义提交函数
const submit = function (value) {
  form.submit(value)
}
// 添加before 切面函数
const submitFunc = submit.before(validate)
submitFunc(value);
```
  因此我们现在需要改造一下before函数，当validate函数返回false的时候，submit函数就不再执行，因此 Function.prototype.before 代码改成如下：
```
Function.prototype.before = function(beforefn) {
  var _self = this; // 保存原函数的引用
  return function() {
    const ret = beforefn.apply(this, arguments); // 执行新函数
    // 当beforefn函数返回false就不再往下执行了
    if (!ret) {
        return ret;
    }
    return _self.apply(this, arguments); // 执行原函数
  }
}
```
  Function.prototype.after 代码没有变，如下：
```
Function.prototype.after = function(afterfn) {
  var _self = this; // 保存原函数的引用
  return function() {
    _self.apply(this, arguments); // 执行原函数
    return afterfn.apply(this, arguments); // 调用新函数作为回调
  }
}
```
  经过使用AOP改造后所有的代码如下：
```
<div id="app">
  <form id="formId">
    <input type="text" id="inputId" />
    <input type="button" value="提交" id="submitBtn"/>
  </form>
</div>
<script>
  var formId = document.getElementById('formId');
  var inputId = document.getElementById('inputId');
  var submitBtn = document.getElementById('submitBtn');
  const validate_rules = {
    not_empty: function(value) {
      return value !== '';
    },
    max_length: function(value) {
      return value.length < 10;
    }
  };
  function validate() {
    for (var i in validate_rules) {
      if (!validate_rules[i].apply(this, arguments)) {
        console.log('输入的值不合法');
        return false;
      }
    }
    return true;
  }
  Function.prototype.before = function(beforefn) {
    var _self = this; // 保存原函数的引用
    return function() {
      const ret = beforefn.apply(this, arguments); // 执行新函数
      // 当beforefn函数返回false就不再往下执行了
      if (!ret) {
        return ret;
      }
      return _self.apply(this, arguments); // 执行原函数
    }
  }
  // 定义提交函数
  const submit = function(value) {
    // 提交请求
    formId.submit(value);
  }
  submitBtn.addEventListener('click', function() {
    const value = inputId.value;
    // 添加before 切面函数
    const retFunc = submit.before(validate);
    var res = retFunc(value);
    if (!res) {
      return;
    }
    submit(value);
  });
</script>
```
#### 4.3 给ajax请求动态添加参数
  使用ajax请求数据时，有时候我们需要在请求之前设置一些参数，或者增加一些参数，比如ajax请求数据一般会设置一个默认的请求超时时长，但是由于有的请求返回的数据比较慢，我们可以把超时的时长设置长一点，此时我们可以使用前置来修改请求参数。
```
比如如下是一个请求函数：
// param 是请求的参数，比如 param = { id: '11' }; 这样的
const fetchData = function(param) {
  ajax(param);
}
Function.prototype.before = function(beforefn) {
  var _self = this; // 保存原函数的引用
  return function() {
    beforefn.apply(this, arguments); // 执行新函数
    return _self.apply(this, arguments); // 执行原函数
  }
}
const resFunc = fetchData.before(function(param, time) {
  param.timeOut = time;
});
resFunc(param, 2000);
```

#### 4.4 使用AOP来处理职责链模式需求

  职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。比如：我们坐公交车的时候，我们从后门上车之后，我们需要把硬币投进收款霜里面去，但是我又投不进去，所以我只能把硬币给我前面那个人，前面那个人继续给前面那个人，
最前面的那个人就帮我把钱投进去了。再比如找钥匙打开门，现在我们手里有很多把钥匙，但是我们并不知道那把钥匙能打开锁，因此我们只能一个个尝试，直到找到为止。这种场景我们可以使用职责链模式了。

  比如如下代码：
```
function pet(type) {
  switch(type) {
    case 'cat':
      console.log('我是猫咪');
      break;
    case 'dog':
      console.log('我是狗狗');
      break;
    case 'pig':
      console.log('我是小猪佩奇');
      break;
  }
}

pet('pig'); // 我是小猪佩奇
pet('dog'); // 我是狗狗
pet('cat'); // 我是猫咪
```
  如上代码，就可以根据动物的不同的类型来输出不同的答案，对于小数据来说，这是没有问题的，但是如果有1000种类型的动物呢？我们是不是要写1000种case语句呢？或者每一种动物下面还要执行其他的代码逻辑，那么该代码就会很难维护，因此针对这种情况，我们可以使用职责链模式来处理这种需求，我们给每种动物都定义一个函数，然后把他们都添加到职责链上。这样代码直接就得到解藕。下面我们使用AOP加职责链模式重构上面的代码：
```
function cat(type) {
  if (type === 'cat') {
    console.log('我是猫咪');
  } else {
    return 'next';
  }
}
function dog(type) {
  if (type === 'dog') {
    console.log('我是狗狗');
  } else {
    return 'next';
  }
}
function pig(type) {
  if (type === 'pig') {
    console.log('我是小猪佩奇');
  } else {
    return 'next';
  }
}
Function.prototype.after = function(afterfn) {
  var _self = this; // 保存原函数的引用
  return function() {
    var ret = _self.apply(this, arguments); // 执行原函数
    if (ret === 'next') {
      return afterfn.apply(this, arguments); // 调用新函数作为回调
    }
    return ret;
  }
}
var pet = cat.after(dog).after(pig);
pet('pig'); // 我是小猪佩奇
pet('dog'); // 我是狗狗
pet('cat'); // 我是猫咪
```
#### 5. ES7中 装饰器（Decorator）实现AOP

#### 5.1 埋点数据上报

  我们下面以react来举例说明在ES7中使用装饰器（Decorator）实现AOP场景，比如我们在页面上有一个按钮需要被点击，我们需要点击前进行一个埋点数据。来统计该按钮被点击了多少次。demo代码如下：
```
// index.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import send from './send';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xx: 11
    }
  }
  @send
  clickFunc (desc) {
    console.log(desc);
  }
  render() {
    return (
      <button onClick={() => this.clickFunc('aaaa')}>点击事件</button>
    )
  }

}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  如上代码引用了 @send 装饰器，它会修改Component类中的原型方法。 下面是 @send 装饰器的代码：
```
// send.js 代码如下：
export default function send(target, name, descriptor) {
  const oldValue = descriptor.value; 
  descriptor.value = function() {
    console.log(`before calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  }
  return descriptor;
}
```
  如上每次点击时候，会打印如下信息：
```
before calling clickFunc with Arguments ["aaaa", callee: (...), Symbol(Symbol.iterator): ƒ]
aaaa
```
#### 封装前置装饰器和后置装饰器

  如上send其实是一个前置装饰器，我们现在需要封装一个前置和后置装饰器。
```
// send.js 代码封装如下：

// 前置装饰器实现
function before(beforefn = function() {}) {
  return function(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function() {
      beforefn.apply(this, arguments); // 调用前置装饰器函数
      return oldValue.apply(this, arguments); // 调用原函数
    }
    return descriptor;
  }
}

// 后置装饰器的实现
function after(afterfn = function() {}) {
  return function(target, name, descriptor) {
    const oldValue = descriptor.value;
    descriptor.value = function() {
      const ret = oldValue.apply(this, arguments); // 先调用原函数
      afterfn.apply(this, arguments); // 再调用回调函数
      return ret;
    };
    return descriptor;
  }
}
export {
  before,
  after
}
```
```
// index.jsx 代码如下：

import React from 'react';
import ReactDOM from 'react-dom';
import { before, after } from './send';

function beforeLog() {
  console.log('------before------');
  console.log(this);
  console.log(`before calling ${name} with`, arguments);
}
function afterCallback() {
  console.log('----afterCallback----');
  console.log(arguments);
}
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xx: 11
    }
  }
  @before(beforeLog)
  @after(afterCallback)
  clickFunc (desc) {
    console.log(desc);
  }
  render() {
    return (
      <button onClick={() => this.clickFunc('aaaa')}>点击事件</button>
    )
  }

}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  如上代码，我们在 按钮被点击的时候，调用 clickFunc函数，使用前置和后置装饰器 @before 和 @after，他们都提供了 回调函数 beforeLog 和 afterCallback，
当我们点击的时候，输出信息如下：
```
------before------

Component {props: {…}, context: {…}, refs: {…}, updater: {…}, state: {…}, …}
context: {}
props: {}
refs: {}
state: {xx: 11}
updater: {isMounted: ƒ, enqueueSetState: ƒ, enqueueReplaceState: ƒ, enqueueForceUpdate: ƒ}
_reactInternalFiber: FiberNode {tag: 1, key: null, stateNode: Component, elementType: ƒ, type: ƒ, …}
_reactInternalInstance: {_processChildContext: ƒ}
isMounted: (...)
replaceState: (...)
__proto__: Component

before calling  with Arguments ["aaaa", callee: (...), Symbol(Symbol.iterator): ƒ]
aaaa
----afterCallback----
iArguments ["aaaa", callee: (...), Symbol(Symbol.iterator): ƒ]
``` 
  如上可以看到，我们使用前置和后置装饰器，对元素点击之前，我们可以提供前置回调做一些事情，和后置回调来处理一些事情。比如对表单一些验证可以放到前置装饰器来处理，或
一些打点数据等操作。上面也可以看到，我们打印 this指针 它指向的是 我们当前的那个类名，它可以获取该类名中的一些属性出来，因此我们可以做表单验证或打点数据，或其他操作，我们可以在before来做了。

#### 5.2 性能分析

  我们之前也使用过 Function.prototype.before 前置装饰器 和 Function.prototype.after 后置装饰器对性能进行分析. 现在我们使用ES7中 装饰器（Decorator）来重构代码。
```
import React from 'react';
import ReactDOM from 'react-dom';

function measure(target, name, descriptor) {
  let oldValue = descriptor.value;
  descriptor.value = function () {
    performance.mark("startWork");
    let ret = oldValue.apply(this, arguments);
    performance.mark("endWork");
    performance.measure("work", "startWork", "endWork");
    performance
      .getEntries()
      .map(entry => JSON.stringify(entry, null, 2))
      .forEach(json => console.log(json));
    return ret;
  };
  return descriptor;
}

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xx: 11
    }
  }
  @measure
  clickFunc (desc) {
    console.log(desc);
    for (let i = 0; i < 1000; i++) {}
  }
  render() {
    return (
      <button onClick={() => this.clickFunc('aaaa')}>点击事件</button>
    )
  }

}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```






























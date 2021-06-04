
### ES6中的箭头函数的this指向

#### 一：普通函数中的this指向问题

  1. this指向直接调用者，可以理解为：谁调用我，我就指向谁，比如使用 obj.func() 函数的时候，那么在func函数中的this就指向了obj对象。
  2. 在默认情况下（非严格模式下，未使用 "use strict"）, 没有直接调用者的话，那么this就指向了window。
  3. 在严格模式下，没有直接调用者的函数中的this指向了undefined。
  4. 使用call/apply/bind绑定时，this指向的是：绑定的对象。

#### 1.1 普通函数中的this指向
```
function hello () {
  console.log(this); // window
};
hello();
```
  如上代码，hello是全局函数，没有直接调用它的对象，也没有使用严格模式，因此this指向的是 window。

#### 1.2. 在严格模式下this的指向
```
function hello () {
  'use strict';
  console.log(this); // undefined
};
hello();
```
  如上代码，hello是全局函数，没有直接调用它的对象，但是使用了严格模式，因此this指向了 undefined。

#### 1.3. this指向了调用者
```
const obj = {
  count: 2,
  hello: function() {
    console.log(this); // obj
    setTimeout(function() {
      console.log(this); // window
    });
  },
  test: function() {
    'use strict';
    console.log(this); // 指向了 obj
    setTimeout(() => {
      console.log(this); // 指向了 obj
    });
  }
};

obj.hello();
obj.test(); 
```
  如上代码，hello函数的直接调用者是obj，因此第一个this指向的是obj，setTimeout匿名函数没有直接调用者，因此this指向了window。 在test函数内部，虽然使用了严格模式，但是test函数也使用直接调用者obj，因此在test函数内 this 也指向了 obj。 我们可以这样理解，谁调用我们的函数，那么在该函数执行环境内，this就指向了调用的那个对象。在test函数内部，我们使用setTimeout的箭头函数，在箭头函数内部，this指向的是最近的函数this的指向。因此test函数中的this指向是obj. 因此在箭头函数内部的this也指向的是obj。

  下面我们再来看一个demo，如下代码：
```
const obj = {
  count: 2,
  hello: function() {
    return this.count * 2;
  },
  test: () => {
    return this.count * 2;
  }
};

console.log(obj.hello()); // 4

console.log(obj.test());  // NAN
```
  如上代码，我们看到 hello 是普通函数，因此普通函数中，里面的this指向的是直接调用它的对象obj。但是test函数是箭头函数，在箭头函数内部，this指向的是上下文
函数this的指向。也可以理解为 箭头函数的this指向的是离它上下文的最近那个函数对象的this指向，但是这边上下文没有函数对象，因此默认就指向了window，但是window
中没有count这个属性，因此就返回了 NAN。

#### 总结：箭头函数的this指向的是离它上下文的最近那个函数对象的this指向。也可以理解为箭头函数this指向于定义时所处的那个函数对象this指向。


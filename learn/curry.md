
### 函数柯里化

#### 什么是柯里化？

柯里化(Currying) 又叫部分求值，是把接受多个参数的函数变成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
简单的说就是函数多参数传入的函数拆成单参数函数，内部再返回调用下一个单参数函数，依次处理剩余的参数。

柯里化(Currying)的优点是：
```
1. 参数复用。
2. 提前返回。
3. 延迟计算/执行。
```
比如我们现在实现一个简单的加法，代码如下：
```
function add(a, b) {
  return a + b;
}
add(1, 2);
```
如果我们现在使用柯里化实现的话，我们需要编写如下代码：
```
const currying = (x) => {
  return (y) => {
    return x + y;
  }
}
console.log(currying(1)(2)); // 打印：3
```
如上代码，我们使用柯里化把add函数分成了两个函数，currying首次执行返回一个新的函数，然后再次调用返回结构。
我们有道经典面试题实现 add(1)(2)(3)(4) = 10;

代码如下：
```
function add(num) {
  var sum = num;
  var fn = function(v) {
    sum += v;
    return fn;
  };
  fn.toString = function() {
    return sum;
  }
  return fn;
}
const value = add(1)(2)(3)(4);
console.log('---返回值---', value); // 10
```
执行 add(1) 时返回了 fn 函数。同时定义了fn的toString方法。每个对象的toString和valueOf方法都可以被重写。每个对象执行完毕后，如果被用于操作javascript解析器就会自动调用对象的 toString() 或 valueOf()方法。利用toString隐式调用的特性，当最后执行隐时调用，并计算最终的值返回。

如果改成如下调用方法的话， add(1)(2, 3)(4) 这种形式的话，我们上面方法是不支持的。我们需要改成如下方法：
```
function add() {
  var args = [...arguments];
  var fn = function() {
    args.push(...arguments);
    return fn;
  };
  fn.toString = function() {
    return args.reduce(function(a, b) {
      return a + b;
    });
  }
  return fn;
}
const value = add(1)(2, 3)(4);
console.log('---返回值---', value); // 10

const value2 = add(1)(2, 3, 4);
console.log('---返回值---', value2); // 10

const value3 = add(1)(2)(3)(4);
console.log('---返回值---', value3); // 10

const value4 = add(1)(2)(3, 4);
console.log('---返回值---', value4); // 10
```
如上方法，支持上面四种不同调用方法了，最终返回的结果是一样的。

我们再来看下函数柯里化的好处。比如我们想实现一个判断数据类型的话，我们一般会如下写代码：

#### 函数柯里化 判断数据类型 的优点
```
// 实现一个判断数据类型的方法
const checkType = function(type, content) {
  return Object.prototype.toString.call(content) === `[object ${type}]`;
};

console.log(checkType('Number', 2)); // 打印：true
```
我们可以使用函数柯里化实现参数的复用。代码如下：
```
const curry = function(type) {
  return function(content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`;
  }
};

const isNumber = curry('Number');
console.log(isNumber(3)); // 打印：true

console.log(isNumber('111')); // 打印：false
```







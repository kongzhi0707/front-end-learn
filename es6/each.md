### JS遍历数组方法集合

1. forEach循环/map <br/>
2. for in/for of <br/>
3. filter <br/>
4. includes/find/findIndex <br/>
5. some/every<br/>
6. reduce <br/>

#### 1. forEach循环/map

  相同点： 

  JS 提供了forEach()/map() 方法都可以遍历Array对象的方法。forEach和map用法类似，都可以遍历数组的每个元素，而且参数都是一致的。
  比如如下:
```
Array.forEach((item, index, array) => {
  // item 为当前某一项的元素
  // index 为当前某一项的索引
  // array 为操作的数组
}, thisArg);   // thisArg 为执行回调的this值
```
  不同点:
  1. forEach()方法 没有返回值，它每次返回都是undefined。map()方法 创建一个新数组。返回值它是一个新数组。
  2. 当数组中的元素是值类型，forEach不会改变数组，当是引用类型，则可以改变数组。

  forEach代码测试如下：
```
const arr1 = [{ name: 'kongzhi1', age: 11 }, { name: 'kongzhi2', age: 12 }]; // 引用类型
const arr2 = [1, 2, 3, 4]; // 值类型

arr1.forEach((item, index, arr1) => {
    item.age = item.age * 2;
});
console.log('---------');

// 输出 [{ name: 'kongzhi1', age: 22 }, { name: 'kongzhi2', age: 24 }]
console.log(arr1); 

var ret = arr2.forEach((item, index, arr2) => {
    item = item * 2;
    return item + 10;
});
console.log('---------');
console.log(arr2); // 输出 [1, 2, 3, 4]

// forEach 没有返回值，因此下面打印为 undefined
console.log(ret);  

// 对于不是引用类型的话, 我们可以换一种方式编写来改变值
arr2.forEach((item, index, arr2) => {
    arr2[index] = item * 2;
});
console.log('下面输出改变值');
console.log(arr2);  // 输出 [2, 4, 6, 8]
```
#### map 使用
```
const y1 = arr1.map((item, value, arr1) => {
  console.log(item); // 打印出每一项
  return item.age + 1;
});
console.log(y1); // 输出：[12, 13]
```
  #### 2. for in/for of

  for...in 是ES5的标准，该方法遍历对象的属性名称(key:键名)。但是需要注意如下几点：

  1. 不建议使用for in 遍历数组，因为输出的顺序是不固定的。
  2. 如果我们迭代的对象的变量值是null或undefined，for in不会执行循环体。因此我们在使用for in循环之前，我们可以先检查对象的值是不是null
或undefined。
  3. 一般用于遍历对象的自身和继承的可枚举属性。以及对象从构造函数原型中继承的属性。如果我们仅仅想从对象中遍历的话，我们可以使用 hasOwnProperty() 这个方法来判断自身是否有该属性。
  4. for...in的原理类似于 Object.keys(). 它返回给定对象所有可枚举属性字符串数组。

  for...of 是ES6的标准，该方法遍历的是对象属性所对应的值(value:键值)。因此它用来遍历数组时得到每个元素的值。for of也有如下几个注意点:

  1. for...of 语句遍历可迭代对象定义要迭代的数据。
  2. for...of 循环可以使用迭代的范围包括 数组、Set和Map结构，某些类似数组的对象、Generator对象、及字符串。

#### 2.1 for...in/for...of 对Array，Set，Map 演示：
```
const arrs = ['a', 'b', 'c'];
const s = new Set(['a', 'b', 'c']);
const m = new Set([ [1, 'x'], [2, 'y'], [3, 'z'] ]);

// 遍历数组
for (let i in arrs) {
  console.log(i); // 输出下标：0, 1, 2
}
for (let j of arrs) {
  console.log(j); // 输出值：a, b, c
}
console.log('----');

// 遍历Set集合
for (let i in s) {
  console.log(i); // 不会输出任何值，不能使用for...in 循环遍历Set集合
}
console.log('---分割线----');
for (let j of s) {
  console.log(j); // 输出的是Set集合每个元素的值为: a, b, c
}
console.log('---遍历map分割线----');
// 遍历Map集合
for (let i in m) {
  console.log(i[0] + "=" + i[1]); // for in 不能用于遍历Map，不会输出任何值
}
for (let j of m) {
  console.log(j[0] + "=" + j[1]); // 输出：1=x 2=y 3=z
}
```
  2.2 for...in 和 for...of 遍历数组和对象

  1. 遍历对象
```
let obj = { a:1, b:2, c:3 };
for (var p in obj) {
  console.log(p); // 输出：a, b, c
  console.log(obj[p]); // 输出：1, 2, 3
}
for (var p of obj) {
  console.log(p);  // 直接报错：Uncaught TypeError: obj[Symbol.iterator] is not a function
}
```
  2. 遍历数组
```
let obj = ['a', 'b', 'c'];
for (var p in obj) {
  console.log(p); // 输出：0, 1, 2
  console.log(obj[p]); // 输出：a, b, c
}
for (var p of obj) {
  console.log(p);  // 输出值：a, b, c
}
// 给对象添加原型属性，for...in 会循环原型上的属性, for...of 不会
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};
obj.xx = 1;
console.log('-----下面是分割线----')
for (let p in obj) {
  console.log(p); // 输出对象本身及原型属性: 0, 1, 2, xx, arrCustom, objCustom
}
console.log('-----下面是分割线----')
for (let p of obj) {
  console.log(p); // 输出值为: a, b, c 
}
```
#### 3. filter

  filter: 用于把Array的某些元素过滤掉，然后返回剩下的元素。filter()接收一个函数把传入的函数依次作用于每个元素，然后根据返回值是true还是
false决定保留还是丢弃该元素。

  基本语法: array.filter((currentValue, index, array), thisValue);
  currentValue: 必须，当前元素的值
  index: 可选，当前元素的索引值。
  array: 可选，当前元素所属的数组对象。

  如下实例：
```
const arrs = [1, 2, 4, 5, 6];
const ret = arrs.filter((x) => {
  return x % 2 !== 0;
});
console.log(ret); // 输出 [1, 5]

// 去掉数组中重复的元素
const arrs = [1, 2, 4, 5, 6, 1, 2];
const ret = arrs.filter((item, index, arrs) => {
  return arrs.indexOf(item) === index; 
});
console.log(ret); // 输出 1, 2, 4, 5, 6
```
#### 4. includes/find/findIndex

  find(): 该方法返回数组中满足条件中的第一个元素的值。  
  基本语法: arrs.find(callback[, thisArg]);

  findIndex(): 该方法返回数组中满足条件中第一个元素的索引。否则返回 -1.
  基本语法: arrs.findIndex(callback[, thisArg]);

  includes() 方法用来判断当前数组是否包含某些指定的值，如果是，则返回true，否则返回false.
  基本语法: arrs.includes(searchElement);

请看下面的实例：
```
// find方法
const arrs = [1, 2, 4, 5, 6, 10, 12];
let num = arrs.find((elem, index) => {
  return elem >= 6;
});
console.log(num); // 输出6

// findIndex()方法, 查找数组中第一个大于等于6的位置
const arrs = [1, 2, 4, 5, 6, 10, 12];
let num = arrs.findIndex((elem, index) => {
  return elem >= 6;
});
console.log(num); // 输出索引为 4 (索引从0开始的)

// includes() 方法用来判断当前数组是否包含某指定的值，如果是，则返回 true，否则返回 false。
const arrs = [1, 2, 4, 5, 6, 10, 12];
let flag = arrs.includes(2);
console.log(flag); // true;
console.log(arrs.includes(3)); // false;
```
#### 5. some/every

  every() 是对数组中每一项运行给定函数，如果该函数所有项都返回true，则结果返回true。如果有任何一项不满足则返回false。
```
const arrs = [1, 2, 4, 5, 6, 10, 12];
const flag = arrs.every((item, index, arrs) => {
  return item > 1;
});
console.log(flag); // false

const flag2 = arrs.every((item, index, arrs) => {
  return item >= 1;
});
console.log(flag2); // true
```
  some() 对数组中的每一项运行给定函数，如果该函数的某一项返回true，则结果返回true。
```
const arrs = [1, 2, 4, 5, 6, 10, 12];
const flag = arrs.some((item, index, arrs) => {
  return item > 1;
});
console.log(flag); // true

const flag2 = arrs.every((item, index, arrs) => {
  return item >= 13;
});
console.log(flag2); // false
```
#### 6. reduce

  reduce()方法接收一个函数作为累加器，该方法为数组中的每一个元素依次执行回调函数。该回调函数接收4个参数，分别为：初始值(上一次回调的返回值)，当前元素值，当前索引，原数组。

  基本语法: arrs.reduce(callback, [initialValue]);
  callback函数中包含四个参数：

  1. previousValue(上一次调用回调返回的值，或者是初始值（initialValue）)。
  2. currentValue(数组中当前被处理的元素值)。
  3. index(当前元素在数组中的索引)。
  4. array(当前被调用的数组)

  initialValue（作为第一次调用callback的第一个参数，初始化值）。

#### 1. 数组求和
```
const arrs = [1, 2, 3, 4, 5];
const sum = arrs.reduce((prev, item, index, arrs) => {
  return prev + item;
}, 2);
console.log(sum); // 输出：17，因为初始化值为2

const sum2 = arrs.reduce((prev, item, index, arrs) => {
  return prev + item;
}, 0);
console.log(sum2); // 输出：15
```
  如上代码，我们也可以写成如下代码：
```
const arrs = [1, 2, 3, 4, 5];
const reducer = function add (num1, num2) {
  return num1 + num2;
}
const sum = arrs.reduce(reducer, 2);
console.log(sum); // 输出：17，因为初始化值为2
```
  如上初始化值为number类型，同理：初始值也可以为object类型。如下代码演示:
```
const arrs = [1, 2, 3, 4, 5];
const reducer = function add (obj, item) {
  obj.sum = obj.sum + item;
  return obj;
}
const sum = arrs.reduce(reducer, {sum: 2});
console.log(sum); // 输出：{sum: 17}
```
#### 2. 合并二维数组
```
// 合并二维数组
var twoArr = [['aa', 'bb'], ['cc', 'dd'], ['ee', 'ff']];
var add = function add(total, currentValue) {
  return total.concat(currentValue);
};
var oneArr = twoArr.reduce(add);
console.log(oneArr); // 输出 ['aa', 'bb', 'cc', 'dd', 'ee', 'ff'];
```


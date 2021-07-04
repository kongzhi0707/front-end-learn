
### 深度克隆

如何区分深拷贝还是浅拷贝，简单点说：如果是一个引用类型，假设B复制了A，当修改A时，看B是否发生变化，如果B也跟着变化，说明这是浅拷贝，如果B没变，那这就是深拷贝。

#### 理解javascript内存管理

javascript有基本类型和引用类型2种，基本数据类型有：number，string，boolean，null，undefined，symbol 及未来ES10新增的BigInt类型。
引用类型有：Object，Array，Date，Function等。

JS内存管理，我们都知道JS拥有自动垃圾回收机制，在JS中，每一个数据都需要一个内存空间，内存空间分为2种：堆内存(heap) 和 栈内存(stock).

#### 基础数据类型和栈内存

JS中的基础数据类型都有固定大小的，基础数据类型都保存在栈内存中，由系统自动分配存储空间。我们可以直接操作保存在栈内存空间的值。因此基础数据类型都是按值访问的。也就是说，他们的值存储在变量访问的位置。

数据在栈内存中的存储和使用方式类似数据结构中的堆栈数据结构，遵循后进先出的原则。

#### 引用数据类型与堆内存

JS中的引用类型，比如数组Array，他们值的大小是不固定的，所以在不声明长度的情况下，是动态填充的。引用数据类型的值保存在堆内存中的对象。

JS不允许直接访问堆内存中的位置，因此我们不能直接操作对象的堆内存空间的。

在操作对象时，实际上是在操作对象的引用而不是实际对象，因此，引用类型的值都是按引用访问的。

我们先看一个demo：

```
var a1 = 0; // 栈
var a2 = 'this is string'； // 栈
var a3 = null; // 栈

var b = { m: 20 }; // 变量b保存在栈中，{ m: 20 } 作为对象保存在堆内存中
var c = [1, 2, 3]; // 变量c保存在栈中, [1, 2, 3] 作为对象保存在堆内存中
```
<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210704220237753-328867378.jpg" />

#### JS中基础类型和引用类型的特点

如上我们明白栈内存和堆内存的储存数据的特点。那么我们现在来看下基本类型和引用类型的存储特点：
```
let a = 20;
let b = a;
b = 30;
console.log(a); // 打印a的值 a=20;
```
<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210704220306122-2084567302.jpg" />

如上是在栈内存在的数据发生复制行为，系统会自动为新的变量分配一个新的内存空间。上列中的 let b = a 执行之后，a 和 b 值都等于20.但是他们其实是相互独立互不影响的值了。所以我们即使修改了b的值以后，a的值并不会发生变化，因此输出的a的值还是20.

我们继续看下面的代码：
```
let m = { a: 10, b: 20 };
let n = m;
n.a = 15;
console.log(m.a); // 15
```
<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210704220333150-345091768.jpg" />

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210704220400097-1976653799.jpg" />

我们通过 let n = m 执行一次复制引用类型的操作，引用类型的复制同样也会为新的变量自动分配一个新的值保存在栈内存中。但不同的是，这个新值仅仅只是引用类型存在栈内存中的一个地址指针。当地址指针相同时，尽管他们相互独立，但是在堆内存中访问到的具体对象实际是同一个。

因此当我改变n时，m也发生了变化。此时输出的 m.a 的值也变成了15.这就是引用类型的特点。

#### JS中的浅克隆和深度克隆

#### 浅克隆

浅克隆是指对象只会被克隆最外部的一层，至于更深层的对象，则依然是通过引用指向同一块堆内存。
```
// 浅克隆函数
function shallowClone(o) {
  const obj = {};
  for (let i in o) {
    obj[i] = o[i];
  }
  return obj;
}

// 被克隆的对象
const oldObj = {
  a: 1,
  b: [ 'a', 'b', 'c' ],
  c: { a: { b: 1 }}
};

const newObj = shallowClone(oldObj);

console.log(newObj.c.a, oldObj.c.a); // { b: 1 } { b: 1 }
console.log(oldObj.c.a === newObj.c.a); // true
```
如上代码，我们可以很明显看到，虽然 oldObj.c.a被克隆了，但是他与 oldObj.c.a相等。这说明他们还指向同一段堆内存地址。这不是我们想要的。如果我们现在改变
oldObj.c.a的值的话，那么newObj.c.a的值也会发生改变。

#### 深克隆

1）JSON.parse() 方法

JSON对象parse方法可以将JSON字符串反序列化成JS对象。JSON.stringify()方法可以将JS对象序列化JSON字符串。两个方法合在一起就能产生一个深克隆。
```
// 被克隆的对象
const oldObj = {
  a: 1,
  b: [ 'a', 'b', 'c' ],
  c: { a: { b: 1 }}
};

const newObj = JSON.parse(JSON.stringify(oldObj));

console.log(newObj.c.a, oldObj.c.a); // { b: 1 } { b: 1 }
console.log(oldObj.c.a === newObj.c.a); // false

oldObj.c.a = { xxx: 111 };

console.log(oldObj.c.a); // 输出：{ xxx: 111 }
console.log(newObj.c.a); // 输出: { b: 1 }
```
虽然使用 JSON.parse() 方法 实现深度克隆，但是他也有很多缺点：

1）他无法实现对函数，RegExp等特殊对象的克隆。
2）对象有循环引用，会报错。
3）会抛弃对象的constructor，所有的构造函数会指向Object。

如下测试代码：
```
// 构造函数
function Person(pname) {
  this.name = pname;
}

const p1 = new Person('kongzhi');

// 函数
function say() {
  console.log('---hi---');
}

const oldObj = {
  a: say,
  b: new Array(1),
  c: new RegExp('ab+c', 'i'),
  d: p1
};

const newObj = JSON.parse(JSON.stringify(oldObj));

// 无法复制函数
console.log(newObj.a, oldObj.a); // undefined,  f say() {}

// 数组，复制错误
console.log(newObj.b[0], oldObj.b[0]); // null, undefined

// 无法复制正则对象
console.log(newObj.c, oldObj.c); // {}, /ab+c/i

// 构造函数指向错误
console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: Object] [Function: person]

// 对象循环引用会抛出错误
const oldObj2 = {};
oldObj2.a = oldObj2;

const newObj2 = JSON.parse(JSON.stringify(oldObj2));
console.log(newObj2.a, oldObj2.a); // 报错
```
因此我们需要构造一个深度克隆。

#### 实现深度克隆
```
const isType = (obj, type) => {
  if (typeof obj !== 'object') return false;
  // 判断类型
  const typeString = Object.prototype.toString.call(obj);
  let flag = false;
  switch (type) {
    case 'Array':
      flag = typeString === '[object Array]';
      break;
    case 'Date':
      flag = typeString === '[object Date]';
      break;
    case 'RegExp':
      flag = typeString === '[object RegExp]';
      break;
    default:
      flag = false;
  }
  return flag;
};

// 正则处理
const getRegExp = re => {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};

/**
 * 深度克隆
 * @param {Object} parent 需要进行克隆的对象
 * @return {Object} 深度克隆后的对象
 */

 const clone = parent => {
   // 维护两个存储循环引用的数组
   const parents = [];
   const children = [];
   const _clone = parent => {
     if (parent === null) return null;
     if (typeof parent !== 'object') return parent;

     let child, proto;
     if (isType(parent, 'Array')) {
       // 对数组做特殊处理
       child = [];
     } else if (isType(parent, 'RegExp')) {
       // 对正则做特殊处理
       child = new RegExp(parent.source, getRegExp(parent));
       if (parent.lastIndex) child.lastIndex = parent.lastIndex;
     } else if (isType(parent, 'Date')) {
       // 对Date对象做特殊处理
       child = new Date(parent.getTime());
     } else {
       // 处理对象的原型
       proto = Object.getPrototypeOf(parent);
       // 利用Object.create切断原型链
       child = Object.create(proto);
     }
     // 处理循环引用
     const index = parents.indexOf(parent);
     if (index !== -1) {
       // 如果父数组存在本对象，说明之前已经被引用过，直接返回此对象
       return children[index];
     }
     parents.push(parent);
     children.push(child);
     for (let i in parent) {
       child[i] = _clone(parent[i]);
     }
     return child;
   }
   return _clone(parent);
 }
```

```
 // ------------------------ 下面是代码测试 --------------------------------------

// 构造函数
function Person(pname) {
  this.name = pname;
}

const p1 = new Person('kongzhi');

// 函数
function say() {
  console.log('---hi---');
}

const oldObj = {
  a: say,
  b: new Array(1),
  c: new RegExp('ab+c', 'i'),
  d: p1
};

oldObj.b = oldObj;

const newObj = clone(oldObj);
console.log(newObj.a, oldObj.a); // [Function: say] [Function: say]
console.log(newObj.b, oldObj.b); 
// { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] } { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] }
console.log(newObj.c, oldObj.c); // /ab+c/i /ab+c/i
console.log(newObj.d.constructor, oldObj.d.constructor); 
// [Function: person] [Function: person]
```













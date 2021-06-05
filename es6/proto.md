
### 理解JavaScript原型链

  所有的引用类型（函数/数组/对象）都拥有 __proto__ 属性。 

#### 1. 每个函数都有prototype属性。
  如下代码：
```
function Person () {};

Person.prototype.name = 'kongzhi';
const p1 = new Person();
const p2 = new Person();
console.log(p1.name); // kongzhi
console.log(p2.name); // kongzhi
```

  如上代码，我们创建了一个Person函数。Person函数有一个prototype属性。给Person.prototype 定义一个name属性，然后 p1 和 p2 是Person的实例，因此该实例也有name属性值。

  原型的基本含义：每个javascript对象（除null）创建时候，都会与之关联一个prototype原型对象，并且每个实例都会从原型对象中继承属性。

#### 构造函数 和 原型关系

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/21.png" /> <br />

#### 2. __proto__

  每个对象（除null外）都会有 __proto__ 属性。该属性会指向该对象的原型。

  我们首先创建一个普通对象：
```
var obj = {};
console.log(obj);
```
  然后我们在控制台中打印信息如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/20.jpg" /> <br />

  可以看到，每个对象都会有一个 __proto__ 属性。该属性会指向对象的原型。obj它是一个普通对象。因此 obj.__proto__ === Object.prototype;
如下代码打印可以看到：
```
var obj = {};
console.log(obj.__proto__ === Object.prototype); // 打印：true
```
  同理，我们再来看下函数。如下代码：
```
function Person () {};
var p1 = new Person();
console.log(p1.__proto__ === Person.prototype); // 打印：true
```
#### 因此构造函数/实例原型 之间的关系如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/22.png" /> <br />

#### 3. constructor 

  每个原型都有一个 constructor 属性，指向与该关联的构造函数。如下代码：
```
function Person () {};

console.log(Person.prototype.constructor === Person); // true
```
  因此他们之间的关系如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/23.png" /> <br />

#### 4. 实例和原型关系

  当我们给函数定义属性时，然后实例化该对象，当读取实例化的属性时候，如果在实例中找不到该属性的话，就会查找和对象相关联的原型中的属性。如果原型中也找不到的话，就会从原型中的原型去查找，最终就是 Object.protortype. 如果还未找到，就返回undefined。一直回溯上个原型查找。
```
function Person () {};
Person.prototype.name = 'kongzhi';
var person = new Person();
person.name = 'tugenhua';

console.log(person.name); // 输出：tugenhua
delete person.name;

console.log(person.name); // 输出：kongzhi
console.log(person.age); // 输出：undefined

console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
console.log(Object.prototype.constructor === Object); // true 
```
  如上代码，我们明白，Person的函数也是对象，因此 Person.prototype.__proto__ 就指向了 Object.prototype; 但是 Object.prototype.__proto__ 就为null。因此 Object为最顶层的对象。如下所示可以解析他们之间的关系：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/24.png" /> <br />
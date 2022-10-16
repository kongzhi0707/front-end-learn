
### TypeScript 入门教程

#### 一：TypeScript是什么？

TypeScript 是JavaScript的一个超集。本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。

#### 1 安装 TypeScript
```
$ npm install -g typescript
```
#### 2 编译TypeScript 文件
```
$ tsc index.ts
```

#### 二）TypeScript 基础类型

#### 2.1）Boolean 类型
```
let isDone: boolean = false;
// ES5 var isDone = false;
```
#### 2.2) Number 类型
```
let count: number = 20;
// ES5: var count = 20;
```
#### 2.3) String 类型
```
let name: string = "kongzhi";
// ES5: var name = "kongzhi";
```
#### 2.4) Array 类型
```
let list: number[] = [1, 2, 3];
// ES5: var list = [1, 2, 3];

let list: Array<number> = [1, 2, 3]; // Array<number>泛型语法
// ES5: var list = [1, 2, 3];
```

#### 2.5) Enum 类型

枚举类型，使用枚举可以清晰的表达意图或创建一组有区别的用列。TypeScript 支持数字和基于字符串的枚举。

#### 1）数字枚举
```
enum Direction { 
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH;
```
  默认情况下，NORTH的初始值为0，其余的成员会从1开始自动增长，因此：Direction.NORTH = 0, Direction.SOUTH的值为1，Direction.EAST的值为2，
Direction.WEST 的值为3.上面的代码经过编译后会生成以下代码：
```
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["SOUTH"] = 1] = "SOUTH";
    Direction[Direction["EAST"] = 2] = "EAST";
    Direction[Direction["WEST"] = 3] = "WEST";
})(Direction || (Direction = {}));
var dir = Direction.NORTH;
```
当然我们也可以设置 NORTH 的初始化值，比如如下， 其他的成员值是在此基础之上自增1；如下：
```
enum Direction { 
  NORTH = 3,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH;
```
转译后变成如下：
```
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 3] = "NORTH";
    Direction[Direction["SOUTH"] = 4] = "SOUTH";
    Direction[Direction["EAST"] = 5] = "EAST";
    Direction[Direction["WEST"] = 6] = "WEST";
})(Direction || (Direction = {}));
var dir = Direction.NORTH;
console.log('---dir---', dir);
```
#### 2）字符串枚举

在TypeScript2.4以后版本，允许我们使用字符串枚举，在一个字符串枚举里面，每个成员必须使用字符串字面量。
```
enum Direction { 
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST"
}
```
以上代码转换成ES5的代码如下：
```
var Direction;
(function (Direction) {
    Direction["NORTH"] = "NORTH";
    Direction["SOUTH"] = "SOUTH";
    Direction["EAST"] = "EAST";
    Direction["WEST"] = "WEST";
})(Direction || (Direction = {}));
```
#### 3）异构枚举

异构枚举的成员值是数字和字符串的混合：
```
enum Enum { 
  A,
  B,
  C = "C",
  D = "D",
  E = 8,
  F,
}
```
以上代码转换成ES5，代码变成如下：
```
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
    Enum[Enum["B"] = 1] = "B";
    Enum["C"] = "C";
    Enum["D"] = "D";
    Enum[Enum["E"] = 8] = "E";
    Enum[Enum["F"] = 9] = "F";
})(Enum || (Enum = {}));
```
如上代码，我们可以看到， 我们打印 Enum.A 就等于 0; Enum[0] 的返回值就等于 A。

#### 2.6）Any类型

在TypeScript中，任何类型都可以归为any类型。因此any类型称为了类型系统的顶级类型 (或被称作为：全局超级类型)。
```
let notSure: any = 666;
notSure = "kongzhi";
notSure = true;
```
如上代码转换成ES5后， 代码变成如下：
```
var notSure = 666;
notSure = "kongzhi";
notSure = true;
```
TypeScript 允许我们对any类型的值执行任何操作，而无需事先执行任何形式的检查。比如如下代码演示：
```
let value: any;

value.xx; // ok
value.trim(); // ok
value(); // ok
new value(); // ok
value[0][1]; // ok
```
  使用any类型，我们可以很容易的编写类型正确但是在运行时有问题的代码。如果我们使用 any 类型，我们就无法使用 TypeScript 提供的大量的保护机制。为了解决any带来的问题，TypeScript3.0引入了 unknown 类型。

#### 2.7）Unknown 类型

我们所有类型都可以赋值给any，我们的所有类型也都可以赋值给 unknown。这使得 unknown 成为了 TypeScript 类型系统的另一种顶级类型。我们可以先来看下 unknown 类型的使用demo：
```
let value: unknown;

value = true; // ok
value = 42; // ok
value = "kongzhi"; // ok
value = []; // ok
value = {}; // ok
value = Math.random; // ok
value = null; // ok
value = undefined; // ok
value = new TypeError(); // ok
```
对value变量的所有赋值都被认为是类型正确的。但是，当我们尝试将类型为 unknown 的值赋值给其他类型的变量时会发生什么呢？
```
let value: unknown;

let value1: unknown = value; // ok
let value2: any = value; // ok

let value3: boolean = value; // Error
let value4: number = value; // Error
let value5: string = value; // Error
let value6: object = value; // Error
let value7: any[] = value; // Error
let value8: Function = value; // Error
```
如上可以看到，unknown 类型只能被赋值给 any 类型 和 unknown 类型本身。现在我们来看看当我们尝试对 unknown 的值执行操作时会发生什么，以下是我们之前对any操作过相同的操作；代码如下：
```
let value: unknown;

value.xx; // Error
value.trim(); // Error
value(); // Error
new value(); // Error
```
将value变量类型设置为 unknown 后，这些操作都不再认为是类型正确的。

#### 2.8）Tuple类型

  众所周知，数组一般由同种类型的值组成，但是有时候我们需要在单个变量中存储不同类型的值，这个时候我们可以使用元组，在javascript中是没有元组的，元组是
TypeScript中特有的类型。
  元组可用于定义具有有限数量的未命名属性的类型。每个属性都有一个关联的类型。使用元组时，必须提供每个属性的值。如下demo：
```
let tupleType: [string, boolean];
tupleType = ["kongzhi", true];
```
  如上代码，我们定义了一个名为 tupleType 的变量，它的类型是一个类型数组 [string, boolean], 然后我们按照正确的类型依次初始化 tupleType 的变量，
和数组一样，我们可以通过下标来访问元组中的元素。
```
let tupleType: [string, boolean];
tupleType = ["kongzhi", true];

console.log(tupleType[0]); // kongzhi
console.log(tupleType[1]); // true
```
  在元组初始化的时候，如果出现类型不匹配的话，比如如下代码：
```
let tupleType: [string, boolean];
tupleType = [true，"kongzhi"];

console.log(tupleType[0]); 
console.log(tupleType[1]); 
```
  会提示如下报错：

字符 U+ff0c "，" 可能会与字符 U+002c "," 混淆，后者在源代码中更为常见。 调整设置
```
不能将类型“boolean”分配给类型“string”。ts(2322)
无效的字符。ts(1127)
不能将类型“string”分配给类型“boolean”。ts(2322)
```
很明显是因为类型不匹配导致的。在元组初始化的时候，我们还必须提供每个属性的值，不然也会出现错误。

#### 2.9）Void类型

  void类型和any类型相反，它表示没有任何类型。当一个函数没有返回值时，我们通常会看到返回值类型是void。
```
// 声明函数返回值为void
function test1(): void { 
  console.log('---1111----');
}
```
以上代码编译成ES5的代码如下：
```
// 声明函数返回值为void
function test1() {
  console.log('---1111----');
}
```
但是我们要注意的是，我们声明一个void类型的变量没有什么作用，因为他的值只能为 undefined 或 null；比如如下代码：
```
let xx: void = undefined;
```
#### 2.10) Null 和 Undefined 类型

  TypeScript 中，undefined 和 null 两者有各自的类型分别为 undefined 和 null.
```
let u: undefined = undefined;
let n: null = null;
```
  默认情况下，null 和 undefined 是所有类型的子类型。也就是说我们可以把 null 和 undefined 赋值给 number 类型的变量。如果我们指定了--strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自的类型。

#### 三）类型守卫

类型保护是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内。类型保护可以保证一个字符串是一个字符串，尽管它的值也可以是一个数值。类型保护和特性检测并不完全相同，其主要思想是尝试检测属性，方法或原型，以确定如何处理值。主要有4种方法来实现类型保护。

#### 3.1）in关键字
```
interface Admin { 
  name: string;
  privileges: string[];
}

interface Employee { 
  name: string;
  startDate: Date;
}

type UnknownEmployee = Employee | Admin;

function xxx(emp: UnknownEmployee) { 
  console.log("Name: " + emp.name);
  if ('privileges' in emp) { 
    console.log('privileges: ' + emp.privileges);
  }
  if ("startDate" in emp) { 
    console.log('Start Date: ' + emp.startDate);
  }
}
```
#### 3.2) typeof 关键字
```
function padleft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

#### 3.3) 自定义类型保护的类型谓词
```
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```
#### 四）TypeScript 函数

#### 1）函数参数类型和返回类型
```
function func(name: string, id: number): string {
  return name + id;
}
```
#### 2) 函数类型
```
let IdGenerator: (chars: string, nums: number) => string;

function func(name: string, id: number): string {
  return name + id;
}

IdGenerator = func;
```
#### 3) 可选参数及默认参数
```
// 可选参数

function func(name: string, id: number, age?: number): string {
  return name + id;
}

// 默认参数
function func2(name: string = "kongzhi", id: number, age?: number): string {
  return name + id;
}
```
如上， 在声明函数时， 我们可以通过 ? 号来定义可选参数， 比如上面的 age?: number 这种形式。可选参数需要放在普通参数后面，否则的话， 编译会报错。

#### 4）剩余参数
```
function func(array, ...items) {
  items.forEach(item => {
    array.push(item);
  })
}

let a = [];
func(a, 1, 2, 3);
```
#### 5) TypeScript 接口

在面向对象语言中，接口是一个很重要的概念，它是对行为的抽象。它常用于对 对象的形状 进行描述。

#### 5.1）对象的形状
```
interface Person {
  name: string;
  age: number;
}

let kongzhi: Person = {
  name: 'kongzhi',
  age: 34
};
```
#### 5.2) 可选 ｜ 只读属性
```
interface Person {
  readonly name: string;
  age?: number;
}
```
只读属性用于限制只能在对象刚刚创建的时候修改其值。TypeScript 还提供了 ReadonlyArray<T> 类型，它与 Array<T> 相似，只是把所有可变方法去掉了，因此可以确保数组
创建后再也不能被修改。
```
let a: number[] = [1, 2, 3, 4];
let ret: ReadonlyArray<number> = a;
ret[0] = 12; // error 
ret.push(5); // error
ret.length = 100; // error
```
#### 6) TypeScript 类

#### 6.1）类的属性与方法

在面向对象语言中，类是一种面向对象计算机编程语言的构造，它描述了所创建的对象共同的属性和方法。

在TypeScript 中，我们可以通过 Class 关键字来定义一个类；

比如如下代码：
```
class Greeter { 
  // 静态属性
  static cname: string = "Greeter";
  // 成员属性
  greeting: string;

  // 构造函数
  constructor(message: string) { 
    this.greeting = message;
  }
  // 静态方法
  static getClassName() { 
    return "Class name is Greeter";
  }
  // 成员方法
  greet() { 
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```
编译成 ES5代码变成如下：
```
var Greeter = /** @class */ (function () {
    // 构造函数
    function Greeter(message) {
        this.greeting = message;
    }
    // 静态方法
    Greeter.getClassName = function () {
        return "Class name is Greeter";
    };
    // 成员方法
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    // 静态属性
    Greeter.cname = "Greeter";
    return Greeter;
}());
var greeter = new Greeter("world");
```
#### 6.2）访问器 getter 和 setter

在TypeScript中，我们可以通过 getter 和 setter 方法来实现数据的封装和有效性校验，防止出现异常数据。
```
let passcode = 'Hello TypeScript';

class Employee { 
  private _fullName: string;

  get fullName(): string { 
    return this._fullName;
  }

  set fullName(newName: string) { 
    if (passcode && passcode === 'Hello TypeScript') {
      this._fullName = newName;
    } else { 
      console.log('---error---');
    }
  }
}

let employee = new Employee();
employee.fullName = 'kongzhi';
if (employee.fullName) { 
  console.log(employee.fullName);
}
```
#### 6.3) 类的继承

继承是一种联结类与类的层次模型。指的是一个类(称为子类，子接口) 继承 另外的一个类 (称为父类，父接口)的功能，并且还可以增加它自己的新功能的能力。

在TypeScript 中，我们可以通过 extends 关键字来实现继承；代码如下：

```
class Animal { 
  name: string;

  constructor(theName: string) { 
    this.name = theName;
  }
  move(distanceInMeters: number = 0) { 
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Kongzhi extends Animal { 
  constructor(name: string) { 
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

let kz = new Kongzhi("Sammy the Python");
kz.move();
```
#### 6.4) ECMAScript 私有字段

在TypeScript3.8+版本支持ECMAScript私有字段， 使用方式如下：
```
class Person { 
  #name: string;
  constructor(name: string) { 
    this.#name = name;
  }
  greet() { 
    console.log(`Hello, my name is ${this.#name}!`);
  }
}

let semlinker = new Person("kongzhi");
```
semlinker.#name; // 提示：属性 "#name" 在类 "Person" 外部不可访问，因为它具有专用标识符。ts(18013)

私有字段有以下规则：
```
1）私有字段以 # 字符开头，有时我们称之为私有名称；
2）每个私有字段名称都唯一地限定于其包含的类；
3）不能在私有字段上使用 TypeScript 可访问性修饰符 (如public或private)；
4）私有字段不能在包含的类之外访问，甚至不能被检测到。
```























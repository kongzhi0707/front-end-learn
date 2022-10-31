
### 全面学习typescript

#### 一: 安装和编译

  1) 新建一个文件夹,名字假如叫ts.
  2) 全局安装 ts 和 ts-node

```
npm i typescript -g // 全局安装 typescript
npm i ts-node -g // 全局安装 ts-node
```
  3) 在 ts 文件夹下运行如下命令, 生成 tsconfig.js 配置文件.
```
tsc --init
```
  4) 在ts文件夹下新建一个 index.ts 文件, 写入如下代码:
```
const s: string = "hello world";
console.log(s);
```
  5) 编译ts为js在控制台输入命令
```
tsc index.ts
```
  会在我们项目ts文件夹下生成一个同名的 index.js 文件. 因此我们已经把ts文件编译成js文件了.

  上面我们已经全局安装了 ts-node 有什么作用呢? 该包的作用是帮助我们在不需要编译成js的前提下,就可以直接执行我们的ts代码, 我们可以在ts文件夹下,执行如下命令: 
```
ts-node index.ts
```
  可以看到在控制台命令中打印 hello world.

  如果想要ts文件代码发生改变后, 自动编译我们的ts文件代码变成js代码. 命令如下:
```
tsc --watch index.ts
```
#### 二) typeScript 类型

#### 2.1) 布尔类型
```
const b: boolean = true;
```
#### 2.2) Number 类型
```
const n: number = 1;
```
#### 2.3) String 类型
```
const s: string = "hello world";
```
#### 2.4) 数组类型
```
const a1: number[] = [1, 2, 3];
const a2: Array<number> = [1, 2, 3];
```
#### 2.5) 元组类型(tuple)

  在 TypeScript 的基础类型中, 元组表示一个已知数量和类型的数组. 
```
const flag: [string, number] = ['hello', 1];
```
#### 2.6) 任意类型(any)

  任何类型都可以被归为 any 类型, any类型成为了类型系统的 顶级类型, TypeScript 允许我们对 any 类型的值执行任何操作, 而无需先执行任何形式的检查.
```
const flag: any = document.getElementById("root");
```
#### 2.7) null 和 undefined

  null 和 undefined 两者各自的类型分别为 null 和 undefined.
```
let n: null = null;
let u: undefined = undefined;
```
#### 2.8) Unknown 类型

  unknown 和 any 都是TS中的顶级类型, 主要区别是: 使用any相当于彻底放弃了类型检查, 而 unknown 类型相较于 any 更加严格, 在执行大多数操作之前,会进行某种形式的检查.
```
let foo: any = 123;
console.log(foo.msg); // 符合TS的语法

let value1: unknown = foo; // ok
let value2: any = foo; // ok
let value3: string = foo; // ok

let bar: unknown = 222; // ok
console.log(bar.msg); //Error
let value1: unknown = bar; // ok
let value2: any = bar; // ok
let value3: string = bar; // Error
```
  1) foo 是 any类型, 任何操作都是没有类型检查的, 因此对其进行任意类型的赋值都是合法的.
  2) bar 是 unknown 类型, 因此不能确定是否有msg属性, 不能通过语法检查, 同时 unknown 类型的值也不能赋值给 any 和 unknown 以外的类型变量.

#### 2.9) void 类型

  void 表示没有任何类型, 当一个函数没有返回值时 TS 会认为它的返回值是 void 类型.
```
function hello(name: string): void{}
```
#### 2.10) never 类型

  never 一般表示用户无法达到的类型, 比如 never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式返回值类型.
```
function neverFunc(): never {
  throw new Error('an error');
}
```
#### 2.11) object/Object/{} 类型

  object 类型用于表示非原始类型.
```
let obj: object;
obj = 1; // error
obj = "a"; // error
obj = false; // error
obj = null; // error
obj = undefined; // error
obj = {}; // ok
```
  Object 类型 代表所拥有 toString, hasOwnProperty 方法的类型, 因此 所有原始类型, 非原始类型都可以赋值给 Object(严格模式下 null 和 undefined 不可以)
```
let obj: Object;
obj = 1; // ok
obj = "a"; // ok
obj = false; // ok
obj = null; // error
obj = undefined; // error
obj = {}; // ok
```
  {} 空对象类型 和 大 Object 一样, 也是表示原始类型 和 非原始类型的集合. 如下代码:
```
let obj: {};
obj = 1; // ok
obj = "a"; // ok
obj = false; // ok
obj = null; // error
obj = undefined; // error
obj = {}; // ok
```
#### 2.12) 类型推论

  指编程语言中能够自动推导出值的类型的能力, 它是一些强静态类型语言中出现的特性, 定义时未赋值就会推导成 any 类型, 如果定义的时候赋值了, 就能利用类型推论. 比如如下代码:
```
let flag; // 推断any类型
let count = 1; // 推断为 number 类型
let hello = '123'; // 推断为 string 类型.
```
#### 2.13) 联合类型

  联合类型 (Union Types) 表示取值可以为多种类型中的一种, 未赋值时 联合类型上只能访问两个类型共有的属性和方法.
```
let name1: string | number;
name1 = 1; // ok
name1 = "hello"; // ok
name1 = true; // error
```
#### 2.14) 字面量类型

  在TypeScript中, 字面量不仅可以表示值, 还可以表示类型, 即所谓的字面量类型. 目前 TypeScript 支持3种字面量类型: 字符串字面量类型, 数字字面量类型, 布尔字面量类型. 具体代码如下:
```
let name1: "hello" = "hello";
let name2: 1 = 1;
let name3: true = true;
```
#### 2.15) 交叉类型

  交叉类型是将多个类型合并为一个类型. 通过 & 运算符可以将现有的多种类型叠加到一起成为一种类型, 它包含了所需的所有类型的特性.
```
type f1 = { x: number };
type f2 = f1 & { y: string };

let f3: f2 = {
  x: 1,
  y: '',
}
```
#### 2.16) 类型保护

  类型保护是指在编译的时候通过类型信息确保某个作用域内变量的类型, 其主要的思想是尝试检测属性, 方法 或 原型, 以确定如何处理值.

  1) typeof 类型保护
```
function double(input: string | number | boolean) {
  if (typeof input === "string") {
    return input + input;
  } else {
    if (typeof input === "number") {
      return input * 2;
    } else {
      return !input;
    }
  }
}
```
2) in 关键字
```
interface Bird {
  fly: number;
}

interface Dog {
  leg: number;
}

function getNumber(value: Bird | Dog) {
  if ("fly" in value) {
    return value.fly;
  }
  return value.leg;
}
```
#### 三) 函数

#### 3.1) 函数的定义

  我们可以指定参数的类型 和 返回值的类型.
```
function hello(name: string): string {
  return name;
}

hello("hello");
```
#### 3.2) 函数表达式

  定义函数的类型
```
type SumFunc = (x: number, y: number) => number;

let countNumber: SumFunc = function(a, b) {
  return a + b;
}
```
#### 3.3) 可选参数

  在TS中函数的形参和实参必须一样, 不一样就要配置可选参数, 可选参数必须是最后一个参数.
```
function test(name: string, age?: number): void {
  console.log(name, age);
}

test("kongzhi");
```
#### 3.4) 默认参数
```
function ajax(url: string, method: string = "GET") {
  console.log(url, method);
}

ajax("/xxxx");
```
#### 3.5) 剩余参数
```
function sum(...numbers: number[]) {
  return numbers.reduce((val, item) => (val += item), 0);
}
console.log(sum(1, 2, 3));
```
#### 3.6) 函数重载

  函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力. 在 TypeScript 中, 表现为给同一个函数提供多个函数类型的定义.
```
let obj: any = {};

function attr(val: string): void;
function attr(val: number): void;
function attr(val: any): void {
  if (typeof val === "string") {
    obj.name = val;
  } else {
    obj.age = val;
  }
}

attr("hahaha");
attr(9);
console.log(obj); // { name: 'hahaha', age: 9 }
```
#### 注意：函数重载真正执行的是同名函数最后定义的函数体 在最后一个函数体定义之前全都属于函数类型定义 不能写具体的函数实现方法 只能定义类型

#### 四) 类

#### 4.1) 类的定义

  在TypeScript中, 我们可以通过 Class 关键字来定义一个类.
```
class Person {
  constructor(public name: string) {}
  getName(): string {
    console.log(this.name);
    return this.name;
  }
}
let p1 = new Person("kongzhi");
p1.getName(); // kongzhi
```
#### 4.2) 存取器

  在TypeScript中, 我们可以通过存取器来改变一个类中属性的读取和赋值行为.
```
class User {
  myname: string;
  constructor(myname: string) {
    this.myname = myname;
  }
  get name() {
    return this.myname;
  }
  set name(value) {
    this.myname = value;
  }
}

let user = new User("kongzhi");
console.log(user.name); // kongzhi
user.name = 'xxx';
console.log(user.name); // xxx
```
#### 4.3) readonly 只读属性

  readonly 修饰的变量只能在构造函数中初始化. TypeScript的类型系统同样也允许将 interface, type, class 上的属性标识为 readonly.
  readonly 实际上只是在编译阶段进行代码检查.
```
class Animal {
  public readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
  changeName(name: string) {
    this.name = name; // 报错 提示: 无法分配到 "name" ，因为它是只读属性。
  }
}
```
#### 4.4) 继承

  子类继承父类后, 子类的实列就拥有了父类中的属性和方法. 可以增强代码的可复用性.

  super 可以调用父类上的方法和属性.

  在 Typescript 中, 我们可以通过 extends 关键字来实现继承.
```
class Person {
  name: string; // 定义实列属性, 默认省略 public 修饰符
  age: number;
  constructor(name: string, age: number) {
    // 构造函数
    this.name = name;
    this.age = age;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
}

class Student extends Person {
  no: number;
  constructor(name: string, age: number, no: number) {
    super(name, age);
    this.no = no;
  }
  getNo(): number {
    return this.no;
  } 
}

let s1 = new Student("hello", 10, 1);
console.log(s1); // Student { name: 'hello', age: 10, no: 1 }

console.log(s1.getName()); // hello

s1.setName("kongzhi");

console.log(s1.getName()); // kongzhi
```
#### 4.5) 类里面的修饰符

  在父类中,使用关键字 public 定义的变量, 子类继承父类, 在子类其他任何地方都可以访问的到该变量, 如果使用的是 protected 关键字的话, 子类都可以访问, 在其他任何地方都不能访问, 如果我们使用的是 private 关键字的话, 在父类中可以访问, 子类和其他地方都不可以访问.
```
class Parent {
  public name: string;
  protected age: number;
  private car: number;

  constructor(name: string, age: number, car: number) {
    this.name = name;
    this.age = age;
    this.car = car;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name: string, age: number, car: number) {
    super(name, age, car);
  }
  desc() {
    console.log(`${this.name} ${this.age}`); 
    console.log(`${this.name} ${this.age} ${this.car}`); //car访问不到 会报错
  }
}

let child = new Child("hello", 10, 1000);
console.log(child.name);
console.log(child.age); //age访问不到 会报错
console.log(child.car); //car访问不到 会报错
```
#### 4.6) 静态属性 / 静态方法

  类的静态属性和方法是直接定义在类本身上面的, 所以只能通过直接调用类的方法和属性来访问.
```
class Parent {
  static mainName = "parent"; // 静态属性
  static getMainName() { // 静态方法
    console.log(this);
    return this.mainName;
  }
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

console.log(Parent.mainName); 
console.log(Parent.getMainName);
```
#### 4.7) 抽象类和抽象方法

  抽象类, 无法被实列化, 只能被继承并且无法创建抽象类的实列, 但是子类可以对抽象类进行不同的实现.

  使用场景: 我们一般用抽象类和抽象方法抽离出事物的共性, 以后所有继承的子类必须按照规范去实现自己的具体逻辑, 这样可以增加代码的可维护性和复用性.

  在TypeScript中, 使用 abstract 关键字来定义抽象类和抽象方法.
```
abstract class Animal {
  name!: string;
  abstract speak(): void;
}

class Cat extends Animal {
  speak() {
    console.log('--xx---x');
  }
}

let animal = new Animal(); // 直接报错, 不能实列化抽象类

let cat = new Cat();
cat.speak();
```
#### 重写和重载的区别?

  重写是指子类重写继承自父类中的方法, 重载是指为 同一个函数提供多个类型定义.
```
// 重写

class Animal {
  speak(word: string): string {
    return "动物: " + word;
  }
}

class Cat extends Animal {
  speak(word: string): string {
    return "xxx:" + word;
  }
}

let cat = new Cat();
console.log(cat.speak('hello'));

// 重载
function double(val: string): string;
function double(val: number): number;
function double(val: any): any {
  if (typeof val == "number") {
    return val * 2;
  }
  return val + val;
}

let r = double(1);
console.log(r); // 2
```
#### 五) 接口

  在TypeScript中, 我们使用 interface 关键字来定义接口, 在接口中我们可以使用分号或逗号分割每一项.

#### 5.1) 对象的形状
```
// 接口是用来描述对象的形状
interface Obj {
  speak(): void;
  readonly lng: string; // readonly 表示只读属性, 后面不可以更改
  name?: string; // ? 表示可选属性
};

let speakman: Obj = {
  name: "hello",
  speak(){},
  lng: "en"
}
```
#### 5.2) 行为的抽象

  接口可以把一些类中共有的属性和方法抽象出来.

  我们可以使用 implements 关键字来实现.
```
interface Speakable {
  speak(): void;
}

interface Eatable {
  eat(): void;
}

// 一个类可以实现多个接口
class Person implements Speakable, Eatable {
  speak() {
    console.log('---speak---');
  }
  eat() {
    console.log('---eat---');
  }
}

const p = new Person();
p.speak();
p.eat();
```
#### 5.3) 定义任意的属性

  如果我们在定义接口的时候无法预先知道属性名叫什么, 我们可以使用 [propName: string]: any, propName 命名是任意的.
```
interface Person {
  id: number;
  name: string;
  [propName: string]: any;
}

let p1: Person = {
  id: 1,
  name: "hello",
  age: 10,
  age2: 10,
}
```
  这个接口表示, 必须有id 和 name 这两个字段, 然后我们还可以新加其余的未知字段. 比如上面的 age 和 age2.

#### 5.4) 接口的继承

  我们除了类可以继承 接口也可以继承 同样的使用 extends关键字
```
interface Speakable {
  speak(): void;
}
interface SpeakChinese extends Speakable {
  speakChinese(): void;
}
class Person implements SpeakChinese {
  speak() {
    console.log("Person");
  }
  speakChinese() {
    console.log("speakChinese");
  }
}
```
#### 六) 泛型

  泛型是指在定义函数，接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
  我们先来看一个demo， 代码如下：
```
function createArray(length: number, value: any): any[] { 
  let result = [];
  for (let i = 0; i < length; i++) { 
    result[i] = value;
  }
  return result;
}

createArray(3, 'x');
```
  上面代码是用来生成长度为length值的value数组，但是不管我们传入什么类型的值，返回的值的类型永远是any类型，如果我们想要的结果是，假如我们预先不知道会传入什么类型，但是我们希望不管我传递什么类型，我们返回的类型永远和传递的类型保持一致，这个时候我们就可以使用泛型来解决这个问题。

  使用泛型代码如下：
```
function createArray<T>(length: number, value: T): Array<T> { 
  let result: T[] = [];
  for (let i = 0; i < length; i++) { 
    result[i] = value;
  }
  return result;
}

console.log(createArray<string>(3, 'x')); // [ 'x', 'x', 'x' ]
console.log(createArray<number>(3, 1)); // [1, 1, 1]
```
更多的泛型可以看之前 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/es6/typescript2.md">这篇文章</a>

#### 七 关键字

#### 1）typeof 关键字

  typeof 关键字除了做类型保护，还可以从实现推出类型。
```
// 先定义变量，再定义类型
let p1 = {
  name: "hello",
  age: 30,
};

type People = typeof p1;

function getName(p: People): string { 
  return p.name;
}

console.log(getName(p1)); // hello
```
  如上代码使用 typeof 获取一个变量的类型。

#### 2）keyof 关键字

  keyof 可以用来获取到一个对象接口的所有key值。
```
interface Person { 
  name: string;
  age: number;
  gender: "male" | "female";
}

// type PersonKey = 'name'|'age'|'gender';
type PersonKey = keyof Person;

function getValueByKey(p: Person, key: PersonKey) { 
  return p[key];
}

let val = getValueByKey({ name: "hello", age: 10, gender: "male" }, "name");
console.log(val); // hello
```
#### 3) 索引访问操作符

  使用 [] 操作符可以进行索引访问。
```
interface Person { 
  name: string;
  age: number;
}

type x = Person["name"];
```
#### 八）装饰器

  装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，属性或参数上，可以修改类的行为。

  常见的装饰器有 类装饰器，属性装饰器，方法装饰器 和 参数装饰器。

  想要使用装饰器的方法，需要使用 @装饰器的写法， 需要在 tsconfig.json 的 experimentalDecorators 字段设置为true。

#### 8.1) 类装饰器

  类装饰器在类声明之前声明, 用来监视, 修改 或 替换类定义.

  代码如下:
```
//当装饰器作为修饰类的时候，会把构造器传递进去
function addNameEat(constructor: Function) {
  constructor.prototype.name = "hello";
  constructor.prototype.eat = function () {
    console.log("eat");
  };
}
@addNameEat
class Person {
  name!: string;
  eat!: Function;
  constructor() {}
}
let p: Person = new Person();
console.log(p.name); // hello
p.eat(); // eat
```
第二种方法使用 装饰器工厂, 代码如下:
```
//还可以使用装饰器工厂 这样可以传递额外参数
function addNameEatFactory(name: string) {
  return function (constructor: Function) {
    constructor.prototype.name = name;
    constructor.prototype.eat = function () {
      console.log("eat");
    };
  };
}
@addNameEatFactory("hello")
class Person {
  name!: string;
  eat!: Function;
  constructor() {}
}
let p: Person = new Person();
console.log(p.name); // hello
p.eat(); // eat
```
第三种,我们还可以使用类, 代码如下:
```
// 还可以替换类,不过替换的类要与原类结构相同
function enhancer(constructor: Function) {
  return class {
    name: string = "jiagou";
    eat() {
      console.log("吃饭饭");
    }
  };
}
@enhancer
class Person {
  name!: string;
  eat!: Function;
  constructor() {}
}
let p: Person = new Person();
console.log(p.name); // jiagou
p.eat(); // 吃饭饭
```

#### 8.2) 属性装饰器

  属性装饰器表达式会在运行时当作函数被调用, 传入2个参数, 第一个参数对于静态成员来说是类的构造函数, 对于实列成员是类的原型对象. 第二个参数是属性的名称.
```
function upperCase(target: any, propertyKey: string) {
  let value = target[propertyKey];
  const getter = function() {
    return value;
  }
  const setter = function(newVal: string) {
    value = newVal.toUpperCase();
  }
  // 替换属性, 先删除原先的属性, 再重新定义属性
  if (delete target[propertyKey]) {
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    })
  }
}

class Person {
  @upperCase
  name!: string;
}

let p: Person = new Person();
p.name = 'kongzhi';
console.log(p.name); // KONGZHI
```
#### 九) tsconfig.json 
```
tsconfig.json 作用:
1) 用于标识 TypeScript 项目的跟路径
2) 用于配置 TypeScript 编译器.
3) 用于指定编译的文件.
```
 #### tsconfig.json 重要字段

   files - 设置要编译的文件的名称；
   include - 设置需要进行编译的文件，支持路径模式匹配；
   exclude - 设置无需进行编译的文件，支持路径模式匹配；
   compilerOptions - 设置与编译流程相关的选项。
```
 {
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}
```
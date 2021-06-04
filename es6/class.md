### ES6中class类 静态方法/静态属性 的理解

#### 一：静态方法 / 静态属性

  ES6新增了一种定义对象实列的方法，使用class关键字来定义类。不需要 实列化类，即可直接通过该类来调用的方法，称之为："静态方法"。 静态方法的形式是在前加上 static 关键字即可。作用是：该方法不会被实列继承。因为类的内部相当于实列的原型，在类中直接定义的方法相当于在原型上定义的方法。都会被类的实列继承。如果我们不想让该方法在实列中继承的话，或 我们想直接使用类来调用方法，我们可以使用 静态方法 来编写。

  静态的本质：静态属性和方法是class类自身的属性。和我们之前的构造函数一样。之前我们习惯构造函数+原型来编写代码，原型中所有的方法和属性都会被实例共享的，但是如果有的属性我们是私有的，不需要被共享，我们可以放在构造函数内部编写。静态类/静态属性也是一个道理的。

  如下是一个简单的 class类中的静态方法：
```
class Test {
  static a() {
    console.log('我是一个静态方法');
  }
  b() {
    console.log('输出b');
  }
}
// 可以通过类名直接调用
Test.a(); // 打印：我是一个静态方法

var t1 = new Test(); // 实列化类
t1.b(); // 打印：输出b
t1.a(); // Uncaught TypeError: t1.a is not a function
Test.b(); // Uncaught TypeError: Test.b is not a function
```
  如上Test类中，a方法是静态方法，b方法是实列方法。因此在类中，我们直接使用类调用静态方法可以调用，比如：如上代码中的 Test.a() 就可以被执行。t1是实列对象，因此可以调用 t1.b()方法。但是我们使用类调用 实列化的方法的话，是会报错的。同理我们使用 实列对象 调用静态方法也会报错的。如上代码可以看得到。

#### this的指向问题

  this指向，我们可以理解为：在静态方法中的this指向的是类，在实列方法中的this指向的是实列。比如如下代码：
```
class Test {
  static a() {
    this.b();
  }
  static b() {
    console.log('我是静态方法b')
  }
  b() {
    console.log('输出b');
  }
  testB() {
    this.b();
  }
}
// 可以通过类名直接调用
Test.a(); // 打印：我是静态方法b

var t1 = new Test();
t1.testB(); // 打印：输出b
```
  如上代码我们可以看得到，我们使用 Test.a(); 调用静态方法a时候，在该静态方法a中，又使用 this.b() 调用可以看到，该this指向了的是类。而我们使用实列对象调用 t1.testB(); 方法后，可以看到 在 testB方法内部的 this 指向的是该实列。因此会输出 'b'。

#### 父类中的静态方法可以被子类继承 
```
class Parent {
  static a() {
    return 'hello';
  }
}
class Child extends Parent {};
console.log(Child.a()); // 打印出：'hello'
```
#### 子类中的静态方法调用父类的静态方法

  如果我们想在子类中的静态方法来调用父类的静态方法的话，我们需要从super对象上调用。代码如下所示：
```
class Parent {
  static a() {
    return 'hello';
  }
}

class Child extends Parent {
  static a() {
    return super.a();
  }
};

console.log(Child.a()); // 打印出：'hello'
```
#### 静态属性的理解

  1. 在类中定义属性
```
class MyClass {
  myProp = 42;
  constructor() {
    console.log(this.myProp); // 调用new MyClass 实列化后，自动输出：42
  }
}
var cls = new MyClass();
console.log(cls.myProp); // 42
```
  如上代码，myProp是类MyClass的实列属性，在MyClass的实列上，可以读取这个属性。如上 cls 就是个实列，然后我们可以打印 cls.myProp 的值。

  2. 在constructor中定义

  如下代码是等价的：
```
class MyClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
}

// 上面代码 等价于 如下代码：

class MyClass extends React.Component {
  state = {
    count: 0
  };
}
```
  如上代码都是实列方法中定义的属性，如果我们想使用静态属性的话，我们只需要在实列属性前 添加 static 关键字 即可。如下代码：
```
class MyClass {
  static myStaticProp = 42;
  constructor() {
    console.log(this.myStaticProp); // 打印： undefined，因为实例没有该属性
    console.log(MyClass.myStaticProp); // 打印静态属性：42
  }
}
new MyClass();
```








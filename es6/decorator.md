
### Es6/Es7之Decorator装饰器模式

#### 1. 什么是装饰器模式？
  装饰器是一个函数，它用来修改类的行为。它允许向一个现有的对象添加新的功能，同时又不改变该对象的结构。在ES7中引入了装饰器模式 @decorator，主要分为两种。第一种是类的装饰器（Class decorators），第二种是类的属性或方法装饰器。
  比如 张三 写的代码实现了一个需求，但是 李四 希望使用 张三 的方法来实现一个新的需求，但是张三又不希望针对李四这么一个需求更改自己的代码，因此这个时候装饰器就可以派上用场了。

#### 2. 在项目中添加装饰器 环境配置

  想要在项目中使用装饰器模式的话，我们需要安装如下包：
```
npm install babel-plugin-transform-decorators-legacy --save-dev
```
然后在 babelrc文件中，添加如下配置即可：
```
"plugins": ["transform-decorators-legacy"]
```
  为了方便查看 babelrc中所有的配置，我贴下目前的配置：
```
{
  "plugins": [
     [
      "transform-runtime",
      {
        "polyfill": false
      }
     ],
     "transform-decorators-legacy"
   ],
   "presets": [
     [
       "env",
       {
         "modules": false   // 关闭Babel的模块转换功能，保留ES6模块化语法
       }
     ],
     "stage-2",
     'react'
  ]
}
```
#### 3. 装饰类
```
function log(target, name, descriptor) {
  target.islog = true;
  /*
   打印：ƒ Car() {
          babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, Car);
        }
  */
  console.log(target); // Car类本身
  console.log(name); // undefined
  console.log(descriptor); // undefined
}

@log // 装饰器
class Car {
  run() {
    console.log('car is running');
  }
}
const c1 = new Car();
c1.run(); // car is running
console.log(Car.islog); // true
```
  如上代码，@log 就是一个装饰器，它修改了 Car 这个类的行为，为它添加了静态属性 islog。log函数中的target属性是 Car类本身，我们从上面中打印也可以看得到。同时如上该类也有自身的run方法，实列化后的对象就可以执行该方法。

#### 类装饰器传递参数
  类装饰器也可以传递参数，需要在该方法的装饰器外部再封装一层函数。如下代码：
```
function log(param) {
  return function(target) {
    target.param = param;
  }
}

@log('kongzhi')
class Car {}

console.log(Car.param); // kongzhi
```
#### 类装饰器 可以添加实列属性和方法

  如上代码，通过装饰器对Car类添加静态属性param，装饰器还可以通过操作 prototype 给类添加实列属性。如下代码：
```
function log(target) {
  target.prototype.name = 'kongzhi';
}

@log
class Car {}

const c1 = new Car();
console.log(c1.name); // kongzhi
```
  我们可以再看另外一个demo，使用类装饰器 在原型上添加多个实列方法，如下代码：
```
// mixins.js

export function mixins(...params) {
  return function(target) {
    Object.assign(target.prototype, ...params);
  }
}

// index.js
import { mixins } from './mixins';
const obj = {
  foo() {
    console.log('foo');
  }
};

@mixins(obj)
class Car {}

const c1 = new Car();
c1.foo(); // foo
```
  上面代码通过装饰器mixins，把obj对象中的方法foo添加到了类Car的原型上了。因此Car的实列就有foo该方法了。

#### 注意：
  1). 装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰类的目标类本身。<br/>
  2). 装饰器对类行为的改变，是代码编译时发生的，而不是在运行时的。也就是说，装饰器能在编译阶段运行代码。<br/>

#### 4. 装饰类属性(或叫函数)
  如果装饰的成员是函数，则第三个参数的value字段就表示的是这个函数本身。
```
class Car {
  @log
  add(a, b) {
    return a + b;
  }
}
function log(target, name, descriptor) {
  // { constructor: f Car(), add: f(), __proto__: Object}
  console.log(target); 

  // add
  console.log(name); 

  // {configurable: true, enumerable: false, writable: true, value: f()}
  console.log(descriptor); 

  let oldValue = descriptor.value;

  /*
    输出：function add(a, b) { return a+b; }
  */
  console.log(oldValue);

  descriptor.value = function() {
    console.log(`Calling "${name}" with`); // Calling "add" with
    return oldValue.apply(null, arguments); 
  };
  return descriptor;
}

const c1 = new Car();
const d = c1.add(2, 4);
console.log(d); // 6
```
  类方法装饰器，会传入3个参数，target, name, descriptor. <br/>
  target: 表示类的原型对象，比如上面的 Car.prototype <br/>
  name: 表示修饰的属性名；比如上面修饰的是 add <br/>
  descriptor：表示属性的描述对象。<br/>

  如果我们想要了解 descriptor的话，我们可以理解下 ES5中的 Object.defineProperty 对 descriptor 的定义。在ES5中，通过Object.defineProperty
定义对象的属性有两种描述对象：数据属性 和 访问器属性。

  数据属性有如下四个属性：
```
configurable: 属性是否可以删除，重新定义。
enumerable: 属性是否可枚举。
writable: 属性值是否可修改。
value: 属性值
```
  访问器属性也有如下四个属性：
```
configurable: 属性是否可以删除，重新定义。
enumerable: 属性是否可枚举。
get: 读取属性调用
set: 设置属性调用
```
  我们类装饰器中的 descriptor 属于是数据属性。

  比如下面的demo，Car类有一个方法run，打印一些信息，如下代码：
```
class Car {
  run() {
    console.log(1111);
  }
}
```
  它通过babel转义后会变成如下：
```
function Car() {}
Object.defineProperty(Car.prototype, 'run', {
  value: function() { console.log(111) },
  enumerable: false,
  configurable: true,
  writable: true
});
```
  我们可以给 run 方法加上 @readonly 装饰器，使其变为可读不可写，如下代码：
```
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Car {
  @readonly
  run() {
    console.log(111);
  }
}
```
  如上代码经过babel转义后变成如下代码：
```
function Car() {}
Object.defineProperty(Car.prototype, 'run', {
  value: function() {console.log(111)},
  enumerable: false,
  writable: false,
  configurable: true
});
```
  我们再来看下我们之前上面的demo，基本代码如下：
```
class Car {
  @log
  add(a, b) {
    return a + b;
  }
}
function log(target, name, descriptor) {
  let oldValue = descriptor.value;
  descriptor.value = function() {
    console.log(`Calling "${name}" with`); // Calling "add" with
    return oldValue.apply(null, arguments); 
  };
  return descriptor;
}

const c1 = new Car();
const d = c1.add(2, 4);
console.log(d); // 6
```
  因此上面的代码经过babel转义后会变成如下：
```
function Car() {}
var oldValue = function(a, b) { return a + b };
Object.defineProperty(Car.prototype, 'add', {
  value: function() {
    console.log(`Calling "${name}" with`);
    return oldValue.apply(null, arguments); 
  },
  enumerable: false,
  configurable: true,
  writable: true
});
```
  因此我们下面如下调用即可打印对应的信息出来，如下调用代码：
```
const c1 = new Car();
const d = c1.add(2, 4);
console.log(d); // 6
```
  如上代码，当我们调用 c1 该实列中的 add方法时候，实际就是通过 Object.defineProperty 去监听 Car.prototype 中的 add方法，因此会调用 value() 这个方法，因此在代码执行 return a+b 之前，可以先打印出一些日志信息出来后，再调用原先的add函数，通过 oldValue.apply(null, arguments);  方法调用即可。最后通过return返回 return oldValue.apply(null, arguments); 后，就能返回对应的值了，因此我们 可以打印出 d的值了。

#### 总结：通过上面的demo方式，可以在执行代码之前，我们打印出一些日志信息出来。可以使业务代码 和 日志功能代码进行 解偶 操作。

#### 注意：装饰器不能使用在函数中，只能使用在类中或类方法或属性中。

#### 为什么装饰器不能用于函数呢？

  装饰器只能用于类和类方法中，不能用于函数中，因为函数的作用域会提升。比如如下代码：
```
var num = 0;
var add = function() {
  num++;
};
@add
function foo() {}
```
  如上代码，通过对函数的作用域的提升，会变成如下代码：
```
@add
function foo() {}
var num;
var add;

num = 0;
add = function() {
  num++;
};
```
#### 动态修改类的属性

  比如如下代码，我们更改Car类中的属性。
```
function log(target, name, descriptor) {
  return class Bike {
    run() {
      console.log('Bike is running');
    }
  }
}
@log
class Car {
  run() {
    console.log('Car is running');
  }
}
const c1 = new Car();
c1.run(); // 打印出 Bike is running
```
#### 5. 应用场景

  1. 日志输出（在执行某些方法之前，输出一些日志信息出来，比如对于数据打点操作）
```
class Car {
  @log
  add(a, b) {
    return a + b;
  }
}
function log(target, name, descriptor) {

  let oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling "${name}" with`); // 首先打印：Calling "add" with
    return oldValue.apply(null, arguments); 
  };
  return descriptor;
}

const c1 = new Car();
const d = c1.add(2, 4);
console.log(d); // 6
```
  2. 函数劫持
```
function log(target, name, descriptor) {
  return class Bike {
    run() {
      console.log('Bike is running');
    }
  }
}
@log
class Car {
  run() {
    console.log('Car is running');
  }
}
const c1 = new Car();
c1.run(); // 打印出 Bike is running
```
  3. AOP(面向切面的编程)的使用场景

  开发一个业务过程中，我们希望埋点、日志、错误收集、权限验证等操作从业务代码中分离开，就可以使用 AOP。
  举个例子，银行办业务，有取款、查询、转账三种操作，每种操作都需要验证用户。
  一般的情况下，我们可能会这样做，如下代码：
```
function fluent(fn) {
  return function(...args) {
    // 此处执行验证操作，成功执行下面语句，否则报错或return
    fn.apply(this, args)
    return this
  }
}
function Business() {}
Business.prototype.qukuan = fluent(function() {
  // do something...
})
Business.prototype.chaxun = fluent(function() {
  // do something...
})
Business.prototype.zhuanzhang = fluent(function() {
  // do something...
})
var b = new Business();
// 下面三种操作都会进入验证，成功后才能执行
b.qukuan();
b.chaxun();
b.zhuanzhang();
```
  但是如果我们使用装饰器的话，我们只需要编写如下代码即可：
```
function validate(target, name, descriptor) {
  var fn = descriptor.value
  descriptor.value = function(...args) {
    /*
     ... 这边我们可以调用验证的方法，验证通过，则执行下面语句
     const flag = xxx();
     if (!flag) {
       return;
     }
    */
    fn.apply(this, args)
  }
  return descriptor
}

class Business {
  @validate
  qukuan () {}
  
  @validate
  chaxun () {}
  
  @validate
  zhuanzhang () {}
}
```



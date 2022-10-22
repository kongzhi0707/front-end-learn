
### typescript泛型

#### 一）什么是泛型？

  在设计组件的过程中，我们不仅需要创建一致的定义良好的API，同时也需要考虑组件的可重用，一个组件需要支持多种类型的数据。这样做的目的是可以以自己的数据类型来使用组件。使用泛型来做就可以解决这些问题。
  下面我们来看个列子，我们可以定义一个通用的 identify 函数，该函数接收一个参数并直接返回它；如下代码：
```
function indentity(value) { 
  return value;
}
console.log(indentity(1)); // 打印1
```
  现在，我们将 identify 函数做适当的调整，以支持 TypeScript 的 Number 类型的参数：
```
function indetify(value: Number): Number {
  return value;
}
console.log(indetify(1)); // 1
```
  如上代码，在 indetify 函数中，我们将 Number 类型分配给参数和返回的类型，使该函数仅可使用该原始类型。但是该函数并不是可扩展的。
  如果上面我们把 Number 改成 any，那么我们就失去了定义应该返回那种类型的能力。并且在该过程中失去了编译器类型保护的作用。我们目标是想让 indetify 函数可以适用于任何特定的类型。为了实现该目标，我们可以使用泛型来解决这个问题。

  实现代码可以如下：
```
function indetify<T>(value: T): T {
  return value;
}

console.log(indetify<Number>(1)); // 1
console.log(indetify<String>('kongzhi')); // kongzhi
```
  理解代码下，当我们调用 indetify<Number>(1) 的时候，Number的类型传递给T，调用 indetify<String>('kongzhi') 的时候，String 传递给T，T 可以充当了数据类型。在定义泛型时通常用作第一个类型变量名称。实际上T可以用任何有效名称代替。除了T以外，下面有其他常见泛型变量：
```
K(key): 表示对象中的键类型；
V(value): 表示对象中的值类型；
E(Element): 表示元素类型；
```
  其实也并不是只能定义一个类型变量，我们可以引入定义的任何数量的类型变量。比如我们可以引入一个新的类型变量 U， 用于扩展我们定义的 indetify 函数；

  代码如下：
```
function indetify<T, U>(value: T, message: U): T {
  console.log('---message----', message);
  return value;
}
console.log(indetify<Number, String>(1, 'kongzhi')); // 1
```
  如上代码，我们可以看到我们可以传递任何的数据类型，使得我们可以为不同类型创建可重用的组件。我们再来看上面的函数， 我们给 indetify 函数增加了一个类型变量U，但该函数的返回类型我们任然是使用T，如果我们想要返回两种类型的对象该怎么办呢？第一种方法，我们可以使用元数组来解决这个问题， 如下代码：
```
function indetify<T, U>(value: T, message: U): [T, U] {
  return [value, message];
}
console.log(indetify<Number, String>(1, 'kongzhi')); // [1, 'kongzhi']
```
  如上我们使用了元数组解决了上述问题，但是我们还可以使用更好的方法，那就是使用泛型接口。

#### 二）泛型接口

  为了解决上面的问题，首先我们创建一个用于 indetify 函数通用的 Identities 接口；
```
interface Identities<V, M> {
  value: V,
  message: M
}
```
  如上，在Identities接口中，我们引入了类型变量 V 和 M， 进一步表明不同的字母都可以用于表示类型变量，之后我们就可以将 Identities 接口作为 identity 函数的返回类型。代码如下：
```
interface Identities<V, M> {
  value: V,
  message: M
}

function indetify<T, U>(value: T, message: U): Identities<T, U> {
  console.log(value + ": " + typeof (value)); // 打印：1: number
  console.log(message + ": " + typeof (message)); // 打印：kongzhi: string
  let identities: Identities<T, U> = {
    value,
    message
  };
  return identities;
}

console.log(indetify(1, 'kongzhi')); // 打印：{value: 1, message: 'kongzhi'}
```
  泛型除了可以应用在函数和接口之外，它也可以应用在类中。下面我们就来看一下在类中如何使用泛型。

#### 三）泛型类

  在类中使用泛型很比较简单，我们只需要在类名后面，使用 <T, ...> 的语法定义任意多个类型变量。代码如下：
```
interface GenericInterface<U> {
  value: U
  getIdentity: () => U
}

class IdentityClass<T> implements GenericInterface<T> {
  value: T
  constructor(value: T) {
    this.value = value;
  }
  getIdentify(): T {
    return this.value
  }
}

const myNumberClass = new IdentityClass<Number>(68);
console.log(myNumberClass.getIdentity()); // 68

const myStringClass = new IdentityClass<string>("Semlinker!");
console.log(myStringClass.getIdentity()); // Semlinker!
```
分析调用过程：
```
1）在实例化 IdentityClass 对象时，我们传入 Number 类型和构造函数参数值 68；
2）之后在 IdentityClass 类中，类型变量 T 的值变成 Number 类型；
3）IdentityClass 类实现了 GenericInterface<T>，而此时 T 表示 Number 类型，因此等价于该类实现了 GenericInterface<Number> 接口；
```
#### 泛型可以使用在如下地方：
```
1）当我们的函数，接口或类将处理多种数据类型的时候。
2）当函数，接口 或 类在多个地方使用该数据类型时候。
```
#### 四）泛型约束

#### 4.1）确保属性存在

  有时候我们可能希望类型变量对应的类型上存在某些属性。这个时候就要使用到泛型约束。
  比如我们在处理字符串或数组时，我们会假设 length 属性是可用的，比如如下 identity 函数，并尝试输出参数的长度；如下代码：
```
function identity<T>(arg: T): T {
  console.log(arg.length); // Error
  return arg;
}
console.log(identity([]));
```
  如上，TypeScript 会提示相关的错误信息，会报错。编译器将不会知道 T 确实含有 length 属性，尤其是我们将任何类型赋值给类型变量T的情况下，因此我们需要让类型变量
extends 一个含有我们所需要属性的接口，比如如下代码：
```
interface Length {
  length: number;
}

function identity<T extends Length>(arg: T): T {
  console.log(arg.length); // 输出 0
  return arg;
}

console.log(identity([]));
```
  T extends Length 用于告诉编译器，我们支持已经实现 Length 接口的任何类型。当然我们可以使用 逗号(,) 来分割多种约束的类型，比如 <T extends Length, Type2, Type3>. 

  当我们使用不含有length属性的对象作为参数调用 identity 函数时，TypeScript会提示相关的错误信息如下：
```
console.log(identity(68)); // Argument of type 'number' is not assignable to parameter of type 'Length'.
```
  对于传递的参数有length的属性的话，我们也可以显式地将变量设置为数组类型，也可以解决该问题，比如如下代码：
```
function identity<T>(arg: T[]): T[] {
  console.log(arg.length); // 输出 0
  return arg;
}
console.log(identity([]));
```
或如下代码：
```
function identity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length); // 输出 0
  return arg;
}
console.log(identity([]));
```
#### 五）泛型参数默认类型

  在 TypeScript2.3以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推断出类型时，这个默认类型就会起作用。

  泛型参数默认值语法如：<T=Default Type>, 代码如下：
```
interface A<T=string> {
  name: T;
}

const strA: A = { name: "kongzhi" };
const numB: A<number> = { name: 101 };

console.log(strA); // {name: "kongzhi"}
console.log(numB); // {name: 101}
```
















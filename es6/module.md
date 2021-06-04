  
### ES6/AMD/CMD/CommonJS 中Module的介绍

#### 1. ES6模块
  基本特点如下:<br/>
  1 每一个模块只会加载一次，每一个JS只执行一次。如果下一次再去加载同目录同个文件，会直接从内存中读取。<br/>
  2 模块内部的变量或函数可以通过export导出或import引入，export命令用于规定模块的对外接口，import命令用于导入其他模块的引用。且模块内的变量都是局部变量，不会污染全局作用域。<br/>
  3 一个模块就是一个独立文件，该文件内的所有变量，外部都无法获取，如果我们希望某个变量或函数需要对外暴露，我们可以使用export关键字。<br/>
  4 使用export命令定义了模块对外接口后，其他的JS文件就可以通过import命令加载这个模块，import命令接收一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须和导出模块对外接口的名称相同。<br/>

#### 1.1) export 导出变量或函数
  比如如下代码：
```
// 1. 导出变量
export const name = "kongzhi";
export const num = 1;

// 或者 也可以如下写

const name = "kongzhi";
const num = 1;
export { name, num };

// 2. 导出函数或类
export function moduleFunc(x, y) {
  return x + y;
}

// component2.js 代码如下：
const name = "kongzhi";
const num = 1;
function moduleFunc(x, y) {
  return x + y;
}
export { name, num, moduleFunc};

// index.js 代码引入
import { name, num, moduleFunc } from './component2';
console.log(name);  // 打印出：kongzhi
console.log(num);   // 打印出： 1
console.log(moduleFunc(1, 2)); // 输出：3
```
#### 1.2) 使用as关键字重命名

  一般情况下，export输出的变量是本来的名字，但是我们可以使用 as 关键字来重命名。
```
// component2.js 代码如下：
const name = "kongzhi";
const num = 1;
function moduleFunc(x, y) {
  return x + y;
}
export { 
  name as name1,
  num as num1,
  moduleFunc as moduleFunc1
};

// index.js 引入模块 代码如下：
import { name1, num1, moduleFunc1 } from './component2';
console.log(name1);  // 打印出：kongzhi
console.log(num1);   // 打印出： 1
console.log(moduleFunc1(1, 2)); // 输出：3
```
  如上代码，我们也可以对导入的文件重新命名一个新的名字，也可以使用as关键字。比如如下代码：
```
import { name1 as name, num1 as num, moduleFunc1 as moduleFunc } from './component2';
console.log(name);  // 打印出：kongzhi
console.log(num);   // 打印出： 1
console.log(moduleFunc(1, 2)); // 输出：3
```
#### 1.3) import命令有提升作用，会提升到整个模块的头部，然后再执行。比如如下代码，也是可以运行的。
```
// index.js
console.log(name);  // 打印出：kongzhi
console.log(num);   // 打印出： 1
console.log(moduleFunc(1, 2)); // 输出：3
import { name1 as name, num1 as num, moduleFunc1 as moduleFunc } from './component2';
```
#### 1.4) import除了指定加载某个输出值，还可以使用整体加载，即用星号(*)指定一个对象，所有输出的值都加载在这个对象上面。

  如下代码：
```
// 逐一加载

// component2.js 代码如下：
const name = "kongzhi";
const num = 1;
function moduleFunc(x, y) {
  return x + y;
}
export { 
  name, num, moduleFunc
};
// index.js 代码引入如下：
import {  name, num, moduleFunc } from './component2';
console.log(name);  // 打印出：kongzhi
console.log(num);   // 打印出： 1
console.log(moduleFunc(1, 2)); // 输出：3
```
  下面我们使用 * 号整体引入代码加载，代码如下：
```
// index.js 代码引入如下
import * as component2 from './component2';
console.log(component2.name); // 输出 'kongzhi'
console.log(component2.num); // 输出 1
console.log(component2.moduleFunc(1,2)); // 输出3
```
#### 1.5) export default 命令

  export default命令为模块指定默认输出, 因此在我们使用import命令的时候，引入的名字可以随便编写。比如如下代码：
```
// component2.js 
export default function() {
  console.log(1122);
}
// index.js 代码引入如下：
// xxx 是随便写的
import xxx from './component2';
xxx(); // 输出 1122
```
  如上代码component2.js ，他默认输出是一个函数，在其他模块引入该模块时候，import命令可以为该匿名函数指定任意名字。

  export default 也可以使用在非匿名函数之前。比如如下代码：
```
// component2.js 
export default function foo() {
  console.log(1122);
}
// 或写成如下：
function foo() {
  console.log(1122);
}
export default foo;

// 在index.js 引入的方式也可以一样随便命名，如下引入方式不变
import xxx from './component2';
xxx(); // 输出 1122
```















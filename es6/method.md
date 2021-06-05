### ES6中两种定义及调用方法的区别

基本代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
  }
  // 常规定义方式
  clickFunc1() {
    console.log(112);
    console.log(this); // undefined
  }
  // 箭头函数定义方式
  clickFunc2 = () => {
    console.log(this); // Component {props: {...}, context: {...}, refs: {...}, clickFun2: f, ...}
  }
  render() {
    console.log(this);
    console.log(this.__proto__);
    console.log(this.__proto__ === Component.prototype); // 返回true
    console.log(Component.prototype.__proto__ === React.Component.prototype); // 返回true
    console.log(React.Component.prototype.__proto__ === Object.prototype); // 返回true
    return (
      <div className="container">
        <div onClick={this.clickFunc1}>点击我</div>
        <div onClick={this.clickFunc2}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  代码执行后，在render函数中分别打印 console.log(this), console.log(this.__proto__) 的值如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/25.jpg" /> <br />

  如上，我们可以看到，在render函数中this指针指向了 Component 类。并且有clickFunc2属性，因此在 clickFunc2 箭头函数中 this指向的就是当前的 Component 这个类。 了解箭头函数的this指向，请看这篇文章。<a href="./arrow.md">ES6中的箭头函数的this指向</a> 。 总之：箭头函数的this指向的是离它最近上下文函数对象中的this指向。它上下文函数对象 就是 Component 类，因此箭头函数中的this指向的是 Component。因此当我们点击后，在 clickFunc2 函数中的this指向的是Component类包含的所有属性。

  如上我们也可以看到，clickFunc1 函数并不在 Component类中，它指向了 Component.prototype 中，因此当我们点击 clickFunc1 后，打印 this为undefined。

  之所以出现这种情况，是因为我们把 this.clickFunc1 赋值给了div元素的点击事件，this指向所属函数的调用者，但是点击事件由浏览器的事件处理线程执行的。它和箭头函数最主要的区别是：箭头函数中的this指向于所定义那个对象，定义时的对象是Component类，因此指向了Component类，但是clickFun1函数内部的this的具体指向需要等到运行时才会进行动态绑定。因此在该 clickFunc1 中的this指向不再是当前类的实例了。

  解决的办法：

#### 1. 在类的 constructor中进行手动绑定：
```
constructor(props) {
  super(props);
  this.clickFunc1 = this.clickFunc1.bind(this);
}
```
  通过bind方法将 clickFunc1方法内部的this绑定到当前类的实例，并返回了一个新的函数。然后将新的函数赋值给类的自身属性 clickFunc1, 当我们点击div元素的时候，就会调用 clickFunc1方法。因此在该方法内部的 this 就指向了 Component类。

#### 2. 在调用的时候使用箭头函数进行包裹。
```
<div onClick={() => {this.clickFunc1()}}>点击我</div>
```
  如上处理也是可以的，我们知道，箭头函数的this指向于离上下文最近的那个函数this指向，因此最近的上下文就是Component了，因此就可以调用 clickFunc1() 函数了，并且该函数内部的this就指向了Component类，我们可以这样理解，我们把 clickFunc1 理解为普通函数，谁调用该函数，那么该函数内部的this指针就指向了调用者的那个对象。由于箭头函数的this指针是指向Component类的，因此在clickFunc1中内的this指针也是指向 Component类的。

#### 缺点：这种方式不值得推荐的，因为每次render的时候，都会创建不同的匿名函数，当这个匿名函数被当作prop向下传递时候，可以会导致子元素会做额外的渲染。

#### 2.2 函数存在类的位置不同

  使用常规方式定义的方法，比如：<div onClick={() => {this.clickFunc1()}}>点击我</div> 定义的方法，存在类的原型上面，子类可以继承到该方法，而使用箭头函数定义的方法则属于类的自己的方法，子类是无法继承的。比如我们使用该方法点击div元素后，打印信息如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/26.jpg" /> <br />

  如上我们可以看到，clickFunc2 箭头函数定义的方式存在是 Component类自身属性中，而 clickFunc1 存在的是 Component的原型上。





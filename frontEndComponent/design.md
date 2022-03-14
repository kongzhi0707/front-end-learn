
### React组件设计原则

#### 一：单一职责原则

组件库开发中，我们组件原则上只专注一件事情，并且把这件事做好。单一职责的优点是最大可能性的复用组件。

一个复杂的组件，我们可以根据功能点进行拆分，我们可以将每个功能点封装成一个组件。当然也不是组件的颗粒度越小越好，只要将一个组件内的功能和逻辑控制在一个可控的范围内即可。并且想好每个功能组件将来是否还可以进行复用。

举个列子：一个自动完成组件(AutoComplete)，它其实有Input组件和Select组件组合而成的。因此我们可以复用该2个组件。因此 Input 组件 和 Select组件的颗粒度就是合适的。因为他们很容易被复用。

再比如：一个微章组件(Badge)，它的右上角会有红点提示，可能是数字也可能是icon，它的职责可能也单一。按道理也可以把它设计成一个组件，但是正常情况下，我们不会把它设置成一个独立的组件，因为该组件在其他场景中无法复用到。其他场景中不会用到小红点这个组件了。因此我们可能会把它设置到 Badge内部组件了。

因此，所谓的单一职责组件是要建立在可复用的基础之上，对于不可复用的单一职责组件我们仅仅把它作为独立组件的内部组件即可。

#### 二：通用性考量

我们组件设计需要有通用性方案，通用组件是和业务解藕但是又服务于业务开发的。那么如何保证组件的通用性呢？

比如我们设计一个Select组件，一般情况下我们会设计成如下这个样子：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/frontEndComponent/images/0.png" /><br />

如上是我们很常见的结构，但是有时候Select组件还有可能是如下这个样子：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/frontEndComponent/images/1.png" /><br />

因此我们设计组件的时候不仅仅要考虑上面的通用性各种情况下结构外，我们还需要给组件预留类似 itemRender 的自定义渲染函数，对于一些特殊的结构可以让用户自己去渲染相对应的DOM结构来满足对应的需求。也就是需要把对应的钩子回调初始化函数暴露给开发者，让他们自己去负责渲染操作。当然提供回调钩子还有很多情况，比如选择下拉框的某一项后，我们也可以给开发者提供回调，让他们自己做自己的事情。

#### 三：可配置性

一个组件，需要明确它的输入和输出分别是什么。

组件除了上面要展示默认的内容外，我们还需要做一些动态的适配。比如：一个组件有一段文本，一个图片和一个按钮，那么字体的颜色，图片的规则，按钮的位置，按钮的点击事件处理逻辑等，都可以做成可配置的。

要做成可配置性，我们需要通过属性向组件传递配置的值，而在组件初始化声明的周期内，通过读取属性的配置值来渲染出对应的数据结构值。当然我们还需要有一些方法，通过调用组件暴露出来的函数，向函数传递有效的值，修改全局css样式，或向组件传递特定的事件，并且在组件内监听该事件来执行函数等操作。

在做可配置性时，为了让组件更加的健壮，保证组件接收的是有效的属性，函数接收到的是有效的参数，我们需要做一些校验。

#### 3.1）属性值的校验

对属性值的校验，我们一般需要考虑如下的点：

1）属性值的类型是否是有效的，如果某个属性要求传递是一个Number类型，那么传递过来的值不是Number类型的话，我们就要抛出异常，并给出相应的提示。
2）属性是否是必填的。有的属性值是组件内不可缺少的，就是要必填的，那么在组件初始化时要做是否传递的检查，如果没有传递，则需要抛出异常，并给出相应的提示。
如果属性不是必填的，我们可以设置一个默认值，当属性没有传递该值时，就使用默认的值。

在React中，我们可以使用 React.PropTypes 进行类型检车设置。比如类似如下代码：
```
import React, { Component, PropTypes } from 'react';

export default class Index extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
  }
  render() {
    const { title } = this.props;
    return (
      <div>{ title }</div>
    )
  }
}
```
#### 3.2) 函数参数的校验

函数的参数校验，我们只要按照传统的方法进行校验即可。在函数内部上面判断参数的类型和值，如果不满足要求，则抛出异常，并给出相应的提示。

如下代码，判断一个函数的参数是必填的，且为String的格式，可以如下：
```
changeTitle(title) {
  if (typeof title !== 'string') {
    throw new Error('title的类型必须为字符串类型');
    return;
  }
  this.setState({
    title,
  })
}
```
#### 四：生命周期

一个组件，需要明确知道在生命周期的不同阶段做该做的事情。

初始化阶段：读取属性的值，如果需要做数据和逻辑处理的话，在这个阶段执行。
属性值变化时，如果属性发生变化，且需要对变化后的数据进行处理的话，那么在该生命周期内执行等等。

组件销毁阶段：如果组件已经创建了一些可能会对系统产生一些副作用的东西，可以在该阶段进行清除，比如 setTimeout, setInterval 等。

如果组件在渲染的时候报错，需要显示错误的信息，React 16 提供了 componentDidCatch 生命周期函数 进行处理。

React 中提供了一些生命周期函数：componentWillMount，componentDidMount，componentWillReceiveProps，shouldComponentUpdate，componentWillUpdate，componentDidUpdate，render，componentWillUnmount，componentDidCatch。 等等更多。

#### 五：事件传递

在React中，父组件可以使用Props向子组件传递值，而子组件向父组件传递值，需要在父组件内定义函数并通过属性传递给子组件，在子组件内通过调用该属性对应的函数。
```
// 子组件 child-component.js

import React from 'react';
export default class ChildComponent extends React.Component {
  render() {
    <button onClick={ ()=> { this.props.clickHandler('kongzhi')}}></button>
  }
}

// 父组件 parent-component.js

import ChildComponent from './child-component';

export default class ParentComponent extends React.Component {
  clickHandler(name) {
    console.log(name);
  }
  render() {
    return (
      <ChildComponent clickHandler={ this.clickHandler.bind(this) }/>
    )
  }
}
```






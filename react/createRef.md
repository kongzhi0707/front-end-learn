
### 理解使用React.createRef()使用 及 React父组件调用子组件的方法

  在React数据流中，props是唯一的父组件和子元素的通讯方式。如果我们要更改子元素，我们需要使用新的props去重新渲染子元素。但是在某些特殊的情况下，
被更改的子元素可能是一个React组件的实例，或者是一个DOM元素。对这些特殊情况的话，React提供了一种特殊的方法：Refs；

#### 1）什么时候使用Refs？

  父组件需要调用子组件的方法等操作的时候。

#### 2）如何创建Refs？

  我们可以通过 React.createRef()创建Refs并通过ref属性关联到React组件。Refs一般当组件被创建时被分配给实例变量，这样他们就能在组件中被引用。
```
import React, { Component } from 'react';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    console.log('----render----');
    return (
      <div ref={ this.myRef }></div>
    );
  }
}
```
#### 3) 如何访问Refs？

  当一个ref通过render放入一个元素中，一个对节点的引用可以通过ref的current属性拿到；如下：
```
const node = this.myRef.current;
```
  ref的值根据节点类型的不同而不同：
```
1）当ref属性用于HTML元素，在构造器中通过 React.createRef()函数创建的ref接收底层DOM元素作为它的current属性；
2）当ref属性用于传统的类组件，ref对象接收挂载好的组件实例作为它的current；
3）但是我们不能将ref属性用于函数式组件上，因为他们没有实例.
```
#### 3.1) DOM元素
```
import React, { Component } from 'react';
export default class CustomTextInput extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }
  focusTextInput() { 
    this.myRef.current.focus();
  }
  render() {
    console.log('----render----');
    return (
      <div>
        <input type="text" ref={this.myRef} />
        <input type="button" value="click button" onClick={ this.focusTextInput } />
      </div>
    );
  }
}
```
  如上代码，React将会在组件挂载时将DOM元素分配给current属性，并且在组件被卸载时，将current属性重置为null。ref将会在 componentDidMount 和 
componentDidUpdate生命周期钩子前被更新。

#### 3.2）类组件

  如果我们想要包装上面的 CustomTextInput，模仿挂载后被点击，我们可以通过ref得到自定义的Input组件，手动调用它的 focusTextInput 函数。
代码如下：
```
import React, { Component } from 'react';

class CustomTextInput extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }
  focusTextInput() { 
    this.myRef.current.focus();
  }
  render() {
    console.log('----render----');
    return (
      <div>
        <input type="text" ref={this.myRef} />
        <input type="button" value="click button" onClick={ this.focusTextInput } />
      </div>
    );
  }
}

export default class AutoFocusTextInput extends Component { 
  constructor(props) { 
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() { 
    console.log('---this.ref---', this.myRef.current);
    this.myRef.current.focusTextInput();
  }
  render() { 
    return (
      <div>
        <CustomTextInput ref={ this.myRef } />
      </div>
    )
  }
}
```
#### 四：父组件调用子组件的方法

#### 4.1）自定义事件

  父组件的代码如下：
```
import React, { Component } from 'react';
import Child from './Child';

class Parent extends Component { 
  componentDidMount() { 
    console.log('----this.childRef----', this.childRef);
  }
  handleChildEvent = (ref) => { 
    // 将子组件的实例存到 this.childRef 中，这样整个父组件就能拿到
    this.childRef = ref;
  }
  // 事件
  handleClick = () => { 
    // 通过子组件的实列调用组件中的方法
    this.childRef.sendMessage();
  }
  render() { 
    return (
      <>
        <Child onChildEvent={ this.handleChildEvent } />
        <div onClick={ this.handleClick }>Trigger Child Event</div>
      </>
    )
  }
}

export default Parent;
```
  子组件代码如下：
```
import React, { Component } from 'react';

class Child extends Component { 
  // 子组件完成挂载时，将子组件的方法 this 作为参数传递到父组件的函数中
  componentDidMount() { 
    // 在子组件中调用父组件的方法，并且把当前的实例传进去
    this.props.onChildEvent(this);
  }
  // 子组件的方法，在父组件中触发
  sendMessage = () => { 
    console.log('---sending message----');
  }
  render() { 
    return (<div>Child</div>);
  }
}

export default Child;
```
#### 4.2）使用 React.createRef()

  父组件的代码如下：
```
import React, { Component } from 'react';
import Child from './Child';

export default class Parent extends Component { 
  constructor(props) { 
    super(props);
    // 创建Ref
    this.childRef = React.createRef();
  }
  // 按钮事件
  handleClick = () => { 
    // 直接通过 this.childRef.current 拿到子组件的实例
    this.childRef.current.sendMessage();
  }
  render() { 
    return (
      <>
        <Child ref={this.childRef} />
        <div onClick={ this.handleClick}>Trigger Child Event </div>
      </>
    )
  }
}
```
子组件代码如下：
```
import React, { Component } from 'react';

class Child extends Component { 
  
  // 子组件的方法，在父组件中触发
  sendMessage = () => { 
    console.log('---sending message----');
  }
  render() { 
    return (<div>Child</div>);
  }
}

export default Child;
```

#### 4.3) 使用回调 Refs

回调Refs是另一种设置Ref的方式，它能更精细的控制何时refs被设置和删除，createRef()创建的ref属性，它需要传递一个函数。访问Ref的时候也不需要current。

Parent.js 代码如下：
```
import React, { Component } from 'react';
import Child from './Child';

export default class Parent extends Component { 
  constructor(props) { 
    super(props);
    // 创建Ref，不通过 React.createRef()
    this.childRef = null;
  }
  // 设置Ref
  setChildref = (ref) => { 
    this.childRef = ref;
  }
  // 事件
  handleClick = () => { 
    // 直接通过 this.childRef 拿到子组件的实例
    this.childRef.sendMessage('xxxxxx');
  }
  render() { 
    return (<div>
      <Child ref={this.setChildref} />
      <div onClick={ this.handleClick }>Trigger Child Event </div>
    </div>)
  }
}
```
Child.js 代码如下：
```
import React, { Component } from 'react';

class Child extends Component { 
  
  // 子组件的方法，在父组件中触发
  sendMessage = (message) => { 
    console.log('---sending message----', message);
  }
  render() { 
    return (<div>Child</div>);
  }
}

export default Child;
```
#### 4.4）Function组件

  默认情况下，不能在函数组件上使用ref属性，因为他们没有实例。但是我们可以使用 forwardRef 和 useImperativeHandle。
在函数的内部我们可以使用 useRef 钩子来获取组件内的 DOM 元素。

Parent.jsx 代码如下：
```
import React, { useRef } from 'react';
import Child from './Child';

const Parent = () => { 
  // 通过 Hooks 创建的 Ref
  const childRef = useRef(null);
  const handleClick = () => { 
    childRef.current.sendMessage();
  }
  return (
    <div>
      <Child ref={childRef} />
      <div onClick={ handleClick}>Trigger Child Event </div>
    </div>
  )
}

export default Parent;
```
child.jsx 代码如下：
```
import React, { forwardRef, useImperativeHandle } from 'react';

const Child = forwardRef((props, ref) => {
  //将子组件的方法 暴露给父组件
  useImperativeHandle(ref, () => ({
    sendMessage
  }))
  const sendMessage = () => {
    console.log('sending message')
  }
  return ( <div>Child</div> );
})
export default Child;
```









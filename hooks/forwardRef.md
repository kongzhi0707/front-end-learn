### useImperativeHandle和forwardRef的结合使用可以使子组件对外提供方法和属性供父组件使用

  forwardRef: 引用父组件的ref实例，成为子组件的一个参数，可以引用父组件的ref绑定到子组件自身的节点上。
  useImperativeHandle: 该方法接收2个参数，第一个参数是一个通过 forwardRef引用父组件的ref实例。第二个参数是一个回调函数，返回一个对象，对象里面存储需要暴露给父组件的属性或方法。

#### 1. 组件内使用ref，来获取dom元素，基本代码如下：
```
import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function Index() {
  const myRef = useRef(null);
  useEffect(() => {
    console.log(myRef.current);
  }, []);
  return (
    <div ref={myRef}>ref获取DOM元素</div>
  );
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Index />, document.getElementById('app'));
```
  打印结果如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/9.jpg" /> <br />

#### 2. ref作为子组件的属性，获取的是该子组件，代码如下：
```
import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function Index() {
  const myChildRef = useRef(null);
  useEffect(() => {
    console.log('------');
    console.log(myChildRef.current);
  }, []);
  return (
    <Child myRef={myChildRef} />
  );
}
// 子组件
function Child(props) {
  console.log(props);
  return (
    <div ref={props.myRef}>我是子组件</div>
  )
}
// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Index />, document.getElementById('app'));
```
  打印结果如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/10.jpg" /> <br />

#### 3. React.forwardRef()

  作用是：从父组件中获取子组件的DOM实例. 

  基本可以理解为：引用传递(Ref forwading) 是一种通过组件向子组件自动传递引用ref的技术。

  代码演示如下：
```
import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Child = React.forwardRef((props, ref) => {
  console.log(props);
  console.log(ref);
  return <div ref={ref}>child div</div>
});

function Index() {
  const parentRef = useRef(null);
  useEffect(() => {
    console.log(parentRef.current);
  }, []);
  return (
    <Child ref={parentRef} name={"kongzhi"} />
  );
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Index />, document.getElementById('app'));
```
  通过如上方式，也可以从父组件中获取子组件的DOM实例。打印数据如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/11.jpg" /> <br />

#### React.forwardRef() 的使用优势点：

  对于一些重复使用的组件，可能很有用，比如某些input组件，需要控制其focus，本来我们也可以使用ref来控制的，但是因为该input组件被其他的组件包裹在内部，因此这个时候我们可以使用 React.forwardRef() 来透过组件获得该input实例的引用。

#### 注意：如下demo是使用 React高阶组件中使用React.forwardRef。
```
import React from 'react';
import ReactDOM from 'react-dom';

const FocusInput = React.forwardRef((props, ref) => <input type="text" ref={ref} />);

const bindRef = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    return (
      <div>
        <WrappedComponent {...props} ref={ref} />
      </div>
    )
  });
};
const FouceInputWithRef = bindRef(FocusInput);

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount() {
    console.log(this.ref);
    const { current } = this.ref;
    current.value = '111';
    current.focus();
  }
  render() {
    return (
      <div>
        <p>forward ref</p>
        <FouceInputWithRef ref={this.ref} />
      </div>
    )
  }
}
// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Index />, document.getElementById('app'));
```
#### 二：理解 React中useImperativeHandle用法

  在函数组件中需要获取子组件的数据，我们需要做如下两个步骤：
  1. 将ref传递到子组件中。
  2. 需要使用forwardRef对子组件进行包装。
```
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

function ParentComponent() {
  const parentRef = useRef();
  const focusHandler = () => {
    // 获取子组件的数据
    console.log(parentRef);
    parentRef.current.focus();
    parentRef.current.value="222";
  };
  return (
    <React.Fragment>
      <ForwardChild ref = {parentRef} />
      <button onClick={focusHandler}>获取焦点</button>
    </React.Fragment>
  )
}
// 子组件
function Child(props, parentRef) {
  return (
    <React.Fragment>
      <input type="text" ref = {parentRef} />
    </React.Fragment>
  )
}
// 使用 forwardRef 将ref直接传递进去
let ForwardChild = React.forwardRef(Child);

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<ParentComponent />, document.getElementById('app'));
```
  上面代码，我们会将组件中的全部数据都暴露出去，但是现在有时候我们只想暴露出一部分数据。因此我们可以使用 useImperativeHandle.
```
import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import ReactDOM from 'react-dom';

function ParentComponent() {
  const parentRef = useRef();
  const focusHandler = () => {
    console.log(parentRef);
    parentRef.current.focus();
    parentRef.current.setValue(22345);
  };
  return (
    <React.Fragment>
      <ForwardChild ref = {parentRef} name={'I am is kongzhi'} />
      <button onClick={focusHandler}>获取焦点</button>
    </React.Fragment>
  )
}
// 子组件
function Child(props, parentRef) {
  const inputRef = useRef();
  useImperativeHandle(parentRef, () => {
    // return 返回的值可以被父组件获取到
    return {
      focus() {
        inputRef.current.focus();
      },
      name: 'kongzhi',
      setValue(value) {
        inputRef.current.value = value;
      }
    }
  });
  return (
    <React.Fragment>
      <p>{props.name}</p>
      <input type="text" ref = {inputRef} />
    </React.Fragment>
  )
}
// 使用 forwardRef 将ref直接传递进去
let ForwardChild = React.forwardRef(Child);

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<ParentComponent />, document.getElementById('app'));
```
  当我们点击 页面上按钮的时候，会打印出如下信息：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/12.jpg" /> <br />






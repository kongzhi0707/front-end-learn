### 理解 useMemo 的用法

  useMemo主要是用来解决使用React 产生无用渲染的性能问题的。

  useMemo 它传递一个创建函数和一个依赖数组，然后会返回一个记忆化的值，当依赖发生变化的时候，useMemo将会重新计算记忆化的值。
  基本使用方法如下：
```
useMemo(() => xxxFunc(), [xxx]);
```
比如如下代码：
```
｜--- index.jsx
｜--- hello.jsx
```
  index.jsx 代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Hello />, document.getElementById('app'));
```
  hello.jsx 代码如下：
```
import React, { useState } from 'react';

function Parent() {
  const [name1, setName1] = useState('我是空智');
  const [name2, setName2] = useState('我是涂根华');
  return (
    <React.Fragment>
      <button onClick={() => {setName1(new Date().getTime())}}>点击按钮11</button>
      <button onClick={() => {setName2(new Date().getTime())}}>点击按钮22</button>
      <ChildComponent name={name1}>{name2}</ChildComponent>
    </React.Fragment>
  )
}
function ChildComponent({name, children}) {
  const changeName1 = function(name) {
    console.log('我是空智进来了');
    return name + ', 空智信息被打印出来了';
  }
  const actionName1 = changeName1(name);
  return (
    <React.Fragment>
      <div>{actionName1}</div>
      <div>{children}</div>
    </React.Fragment>
  )
}

export default Parent;
```
如上代码，Parent 为父组件，ChildComponent 为子组件，然后父组件代码中引入了 ChildComponent 子组件。然后我们代码运行后，当我们点击 按钮1 或 按钮2的时候，可以看到，我们子组件中的 changeName1() 方法都会被执行到，其实我们 '点击按钮11' 的时候，只是想改变name1的值，我们点击 '点击按钮2' 的时候，我们想改变 name2的值，不想重新调用 changeName1方法。因为name1值并没有发生改变。因此我们可以使用 useMemo 来优化了。现在把我们的代码改成如下即可。

```
function ChildComponent({name, children}) {
  const changeName1 = function(name) {
    console.log('我是空智进来了');
    return name + ', 空智信息被打印出来了';
  }
  const actionName1 = useMemo(() => changeName1(name), [name]);
  return (
    <React.Fragment>
      <div>{actionName1}</div>
      <div>{children}</div>
    </React.Fragment>
  )
}
```
  注意：如果我们没有提供第二个参数，则会在每次呈现时计算一个新值。也就是说，当我们的依赖列表为空的时候，每次渲染都会重新计算。也就是说每次渲染的时候也会重新调用changeName1()方法。
  因此我们可以简单的总结为如下：

  1. 当计算逻辑比较复杂耗时操作的时候，我们可以考虑使用 useMemo。
  2. useMemo依赖列表为空的时候，每次渲染时都会重新计算。
  3. useMemo依赖列表不为空的时候，当依赖发生变化的时候，重新渲染会重新计算值。

#### 使用场景：

  可以避免子组件没有被调用的时候，可以防止重复被渲染。
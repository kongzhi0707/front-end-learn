### 理解 useState 的用法

  Hook 是 React 16.8 的新增特性。它允许我们不写class的情况下也可以操作state和react的其他特性。Hooks只是多了一种写组件的方法，使得我们编写组件更简单和方便，同时我们可以自定义的hook把公共的逻辑提出来，让逻辑在多个组件之间共享。

  useState的作用是：通过在函数组件内调用它来给组件添加一些内部的state。React在重复渲染的时候会保留这个state。useState会返回一对值：即：当前状态和一个让你更新它的函数。我们可以在事件处理函数中或其他一些地方调用这个函数。

  首先我们来看下在代码下引入 useState，如下基本代码：
```
  ｜--- index.jsx
  ｜--- hello.jsx
```
  index.jsx 代码如下：
```
// 引入 useState
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';

class TestFun extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div><Hello /></div>
    )
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<TestFun />, document.getElementById('app'));
```
  hello.jsx 代码如下：
```
// 引入useState
import React, { useState } from 'react';
export default function() {
  console.log(111)
  // 初始化useState，它返回一对值，on保存为当前状态值，初始化为false，setOn 是更新状态值的函数
  const [ on, setOn ] = useState(false);
  return (<div className={ on ? 'on' : 'off' }>11222333</div>)
}
```
  如上代码，首先引入 useState，如代码：import React, { useState } from 'react'; 然后调用useState来初始化值，如代码：const [ on, setOn ] = useState(false); useState方法返回一对值，分别为 'on' 保存为当前状态值，'setOn' 为更新状态值的函数，默认值为false，因此我们可以在我们的html页面中可以看到我们的html代码被渲染成为如下代码：
```
<div id="app">
  <div>
    <div class="off">11222333</div>
  </div>
</div>
```
  现在我们需要使用 setOn 方法来更新状态值，我们要更新组件的状态，需要使用setOn来更新。组件会重新渲染，如下基本代码：
```
const [ on, setOn ] = useState(false);
// 将状态更改为 'newState' , 并重新触发渲染。
setOn(newState);
```
  因此为了在页面中更新状态值，我们可以添加两个按钮点击事件，如下代码：

  hello.jsx 代码变为如下了：
```
import React, { useState } from 'react';
export default function() {
  console.log(111)
  const [ on, setOn ] = useState(false);
  const lightOn = () => setOn(true);
  const lightOff = () => setOn(false);
  return (
    <React.Fragment>
      <div className={ on ? 'on' : 'off' }>11222333</div>
      <button onClick={lightOn}>使class变为on</button>
      <button onClick={lightOff}>使class变为off</button>
    </React.Fragment>
    
  )
}
```

  当我们点击 lightOn 按钮的时候，类名变为 'on', 当我们点击 lightOff 按钮的时候，类名变为 'off'; 当状态值发生改变的时候，React就会重新渲染组件，on变量就会获取到新的状态值了。

#### 1. 使用回调函数来更新状态

  我们现在下面也可以使用回调函数来更新状态了，setOn(on => !on) 使用回调函数来更新状态。比如如上 hello.jsx上的代码也可以改成如下代码：

```
import React, { useState } from 'react';
export default function() {
  console.log(111)
  const [ on, setOn ] = useState(false);
  const lightFunc = () => setOn(on => !on);
  return (
    <React.Fragment>
      <div className={ on ? 'on' : 'off' }>11222333</div>
      <button onClick={lightFunc}>自动切换类</button>
    </React.Fragment>
  )
}
```
  因此我们可以简答的总结下 useState的基本使用：
  1. 引入 useState() Hook , 然后调用 useState() 方法来启用函数组件中的状态。
  2. 初始化 useState()方法后，会返回2个元素的数组，比如代码：const [ on, setOn ] = useState(false); on为状态值，setOn为状态值的更新函数。
  3. 使用新值调用状态更新函数 setState(newState)来更新状态。或者我们可以使用一个回调函数来更新状态，比如 setOn(on => !on);来调用状态更新值。调用状态更新后，React会重新渲染组件，使新状态变为当前状态。

#### 2. 组件中如何处理多种状态

  我们可以使用useState(),来处理一个函数组件中的多个状态。比如简单的示列如下：

```
const [state1, setState1] = useState(false);
const [state2, setState2] = useState(true);
const [state3, setState3] = useState(false);
```
  因此我们可以在hello.jsx中代码添加多种状态。代码如下：
```
import React, { useState } from 'react';
export default function() {
  console.log(111)
  const [ on, setOn ] = useState(false);
  const lightFunc = () => setOn(on => !on);

  // 更新计数器
  const [count, setCount] = useState(1);
  const addCount = () => setCount(count => count + 1);
  
  return (
    <React.Fragment>
      <div className={ on ? 'on' : 'off' }>11222333</div>
      <button onClick={lightFunc}>自动切换类</button>
      <div>{count}</div>
      <button onClick={addCount}>增加计数</button>
    </React.Fragment>
  )
}
```

#### 3. 初始状态值的延迟处理

  每当react重新渲染组件时，都会执行useState(initialState). 如果初始状态是原始值（比如数字，布尔值等），不会有性能问题的。但是如果初始状态是一个非常复杂的逻辑操作的话(对性能会有影响的话)，我们可以使用一个 useState(computeInitialState)提供一个函数使用状态延迟初始化，比如如下 hello.jsx 代码改为如下：

```
import React, { useState } from 'react';
export default function(bigData) {
  console.log(111)
  const [ on, setOn ] = useState(function getInitialState() {
    console.log(1);
    const data = bigData;
    return data;
  });
  const lightFunc = () => setOn(on => !on);

  return (
    <React.Fragment>
      <div className={ on ? 'on' : 'off' }>11222333</div>
      <button onClick={lightFunc}>自动切换类</button>
    </React.Fragment>
  )
}
```

  如上 getInitialState() 仅仅会在页面初始渲染时执行一次，来获取初始化状态数据。在以后的组件渲染中，就不会再调用 getInitialState()方法了。我们可以打印下，当我们点击按钮后，就不会打印1了。
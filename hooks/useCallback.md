### 理解useCallback的用法

  useCallback的优点是：可以把匿名回调 "存" 起来。我们在使用Component render的时候会声明一些匿名方法，但是这些匿名方法会被反复重新声明而无法被多次使用。这样就会造成component反复不必要的渲染。

  在 Class Component 中我们一般将回调函数声明为类成员。

  比如我们之前写代码是如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  clickCallback() {
    console.log(111);
  }
  callback2 = () => {
    console.log(22222);
  }
  render() {
    return (
      <div>
        <button onClick={() => {this.callback2()}}>Click Me</button>
        <button onClick={this.clickCallback}>Click Me</button>
      </div>
    )
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  如上代码，我们的 clickCallback 和 callback2 都是 App类中的成员，每次组件重复渲染的时候，会重复声明该匿名方法。

  下面我们在 "函数组件" 中使用 useCallback 就可以把这些匿名方法 "存" 起来。如下代码：
```
import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';

function App (props) {
  const clickCallback = useCallback( () => {
    console.log(111);
  }, []);
  const callback2 = useCallback( () => {
    console.log(2222);
  }, []);
  return (
    <div>
      <button onClick={callback2}>Click Me</button>
      <button onClick={clickCallback}>Click Me</button>
    </div>
  )
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
#### 理解useCallback 缓存函数

  基本语法：const fnA = useCallback(fnB, [a]);

  上面代码的含义是：使用 useCallback 会将我们传递给它的函数fnB返回给fnA，并且将这个结果缓存起来，当依赖 a 发生变更的时候，会返回一个新的函数。
既然返回的fnA也是一个函数，如果我们想判断一个函数是否发生变更，我们可以借助ES6中的数据类型Set来判断。如下demo代码：
```
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

const set = new Set();

function App (props) {

  const [count, setCount] = useState(1);
  const [value, setValue] = useState(1);

  const callback = useCallback( () => {
    console.log(11222);  // 函数没有被调用，不会被打印
    console.log(count);
  }, [count]);
  set.add(callback);

  return (
    <div>
      <h3>count的值: {count}</h3>
      <h3>set.size的值：{set.size}</h3>
      <h3>value的值：{value}</h3>
      <div>
        <button onClick={() => setCount(count + 1)}>新增</button>
        <button onClick={() => setValue(value + 1)}>值新增</button>
      </div>
    </div>
  )
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  如上代码，我们可以看到，每次点击按钮修改count值的时候，set.size 就会自增1. 这说明useCallback依赖变量count，count变更的时候会返回新的函数。
  但是当我们点击 "值新增" 按钮的时候，只有value值会发生改变。set.size不会变，说明返回的缓存是旧版本的函数。我们也可以把依赖值count改成value，
这个时候，点击value发生改变的时候，set.size 会自增1，点击count按钮的时候 不会发生改变。

#### useCallback 使用场景

  当我们在项目中有一个父组件，其中包含了子组件，子组件接收一个函数作为props。一般情况下，如果父组件更新了，子组件也会被更新，但是我们可以使用
useCallback来返回函数，然后把该函数作为props传递给子组件。因此子组件就能避免不必要的更新。

  如下代码：
```
import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [count, setCount] = useState(1);
  const [value, setValue] = useState(1);

  const callback = useCallback(() => {
    return count;
  }, [count]);
  return (
    <div>
      <h3>count的值为：{count}</h3>
      <Child callback={callback}></Child>
      <div>
        <button onClick={() => setCount(count + 1)}>新增按钮1</button>
        <button onClick={() => setValue(value + 1)}>新增按钮2</button>
      </div>
    </div>
  )
}

function Child({ callback }) {
  const [count, setCount] = useState(() => callback());
  useEffect(() => {
    console.log('渲染子组件');
    // 这里也可以是ajax请求
    setCount(callback());
  }, [callback]);
  return (
    <div>{count}</div>
  )
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  如上当我们点击 新增按钮1 的时候，会改变 count的值，从而值发生改变，会重新渲染子组件useEffect的方法调用。如果我们改变value值，就不会调用
子组件中的 useEffect中的方法。




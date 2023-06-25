
### React 组件设计思路和风格

#### 1）React中组件的定义有哪些方式？

目前React组件的定义有下面的几种方式：
```
1）Class 组件：使用class关键字组件，并扩展 React.Component.
2) Function组件：使用普通的Javascript函数定义组件。
3）Hooks: 使用特殊的函数，称为 Hooks。在 Function 组件中管理状态和其他 React 特性。
```
如下代码：
```
import React from 'react';

// class 组件
class Button extends React.Component {
  render() {
    return (
      <button>{this.props.children}</button>
    )
  }
}

// Function
const Button = ({children}) => {
  return (
    <button>{children}</button>
  );
}

// Hooks 
const Button = ({children}) => {
  const [state, setState] = useState();
  return (
    <button>{children}</button>
  )
}

export default Button;
```
如上代码，Function组件和Hooks是相同的。Button组件不需要管理状态或其他的React特性。

#### 2）常见的设计模式
```
2.1）Render props 模式
2.2）Function as Child Components
2.3) Hoc模式
2.4）自定义hooks模式
2.5）Context API
2.6) State reducer + Context API
```
#### 2.1) Render props 

它是以一种以函数作为参数传递数据的方法。允许组件在组件树中进行共享数据，而不需要将状态传递到组件的层次结构中。

src/App.js 代码如下：
```
import React, { Component } from 'react';
import Toggle from './Toggle';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { loading } = this.state;
    console.log('loading加载状态', loading);
    // const loading = true;
    return (
      <Toggle render={({ on, toggle }) => (
        <div>
          {on ? 'the button is on' : 'the button is off'}
          <button onClick={ toggle }>Toggle</button>
        </div>
      )}/>
    );
  }
}

export default App;
```
src/Toggle.jsx 代码如下：
```
import React, { Component } from 'react';

class Toggle extends Component { 
  state = {
    on: false,
  };
  toggle = () => { 
    this.setState(({ on }) => ({ on: !on }));
  }
  render() { 
    return this.props.render({
      on: this.state.on,
      toggle: this.toggle,
    })
  }
}

export default Toggle;
```
#### 2.2）FACC模式 (Function as Child Components)

FACC 是一种React组件的设计模式，它允许父组件将一个函数作为子组件传递。这个函数将返回组件需要呈现的内容。这样做的目的是为了让子组件具有更多的灵活性。
并且能够方便的适应不同的场景。

代码演示如下， 页面上有三个颜色， 红色， 橙色， 蓝色， 点击某一个颜色， 渲染出子组件的颜色。
```
import React, { Component } from 'react';

const options = [
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Blue', value: 'blue' },
];

class Toggle extends React.Component { 
  constructor(props) { 
    super(props);
    this.state = {
      val: 'red'
    };
  }
  handle = (data) => { 
    this.setState({
      val: data.value,
    })
  }
  render() { 
    console.log('--this.state---', this.state);
    return (
      <div className="wrap">
        <ul>
          {
            this.props.options.map(data => (
              <li key={data.val} className={`item ${this.state.val === data.val ? 'selected' : ''}`} onClick={() => this.handle(data)}>
                { data.name }
              </li>
            ))
          }
        </ul>
        { /* 关键部位，下面的代码调用子组件函数， 渲染出哪一种颜色 */}
        { this.state.val && this.props.children(this.state.val)}
      </div>
    )
  }
}
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Toggle options={options}>
        {
          color => (
            <div style={{ width: '50px', height: '50px', background: color }} />
          )
        }
      </Toggle>
   )
  }
}

export default App;
```

#### 2.3) Hoc模式

高阶组件 看这篇文章 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/react/high.md">高阶组件</a>

#### 2.4）自定义hooks

通过创建自定义的Hooks，可以使代码更简洁，同时使功能更易复用。
```
import React, { useState } from 'react';

function useToggle(initialValue = false) { 
  const [on, setOn] = useState(initialValue);
  const toggle = () => setOn(!on);
  return [on, toggle];
}

const MyComponent = () => { 
  const [on, toggle] = useToggle();
  return (
    <div>
      {on ? 'the button is on' : 'the button is off'}
      <button onClick={ toggle }>点击我</button>
    </div>
  )
}

export default MyComponent;
```
#### 2.5）Context API

通过使用 Context API, 可以在应用程序的不同部分共享状态，而不必通过额外的props传递。

context 看这篇文章 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/react/context4.md">context API</a>

#### 2.6) State reducer + Context

通过结合 Context API 和 State Reducer 模式，我们可以实现全局状态管理。并且可以方便地访问和更新状态，而不需要通过props传递。
```
import React, { useReducer, createContext, useContext } from 'react';

// 1 需要创建一个Context来存储当前的状态，并且定义一个reducer来更新状态
const ToggleContext = createContext();

function toggleReducer(state, action) { 
  switch (action.type) { 
    case 'toggle':
      return { on: !state.on };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function ToggleProvider({ children }) { 
  const [state, dispatch] = useReducer(toggleReducer, { on: false });
  const value = { state, dispatch };
  return <ToggleContext.Provider value={value}>{ children }</ToggleContext.Provider>
}

// 2. 我们可以创建一个组件，使用 Context API 和 useReducer hooks 来访问和更新状态

function ToggleButton() { 
  const { state, dispatch } = useContext(ToggleContext);
  return (
    <button onClick={() => dispatch({ type: 'toggle' })}>
      { state.on ? 'Turn off' : 'Turn on'}
    </button>
  )
}

function ToggleDisplay() { 
  const { state } = useContext(ToggleContext);
  return <div>the toggle is { state.on ? 'on' : 'off'}</div>
}

// 3. 使用

function App() { 
  return (
    <ToggleProvider>
      <ToggleButton />
      <ToggleDisplay />
    </ToggleProvider>
  )
}

export default App;

```



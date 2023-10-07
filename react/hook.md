### React 内置 hook 全面学习

React 官网目前一共有 10 几种内置的 hook。我们来整理下这 10 几种 hook 的用法和使用场景进行介绍。

<div id="back"></div>

- [x] [一) useState](#id1)<br />
- [x] [二) useReducer](#id2) <br />
- [x] [三) useContext](#id3) <br />
- [x] [四) useRef](#id4) <br />
- [x] [五) forwardRef](#id5) <br />
- [x] [六) useEffect](#id6) <br />
- [x] [七) useLayoutEffect](#id8) <br />
- [x] [八) useMemo](#id9) <br />
- [x] [九) useCallback](#id10) <br />

#### <div id="id1">1）useState<a href="#back"> 回到顶部</a></div>

声明一个可以直接更新的 state 的变量。

基本使用语法如下：

```
const [state, setState] = useState(initialState);
```

当我们使用 useState 定义 state 变量的时候，它通过传入一个初始值，返回一个有两个值的数组，第一个值是当前的 state，第二个值是更新 state 的函数。
如果我们直接修改 state 的值的话，它不会触发函数组件重新渲染，但是这个值的确是改变了，想改变值并且重新触发更新的话，那么就需要使用 setState 进行修改值，这样修改值会自动让组件重新渲染。

代码如下：

```
import React, { useState } from 'react';

export default function Count() {
  let [count, setCount] = useState(0);
  const handlerAdd = function () {
    count = count + 1;
    setCount(count);
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={ handlerAdd }>加1</button>
    </div>
  )
}
```

注意：在使用 useState 的时候，useState 内置了优化，它会比较传入的值在更新前和更新后是否是一样的，如果两个值是一样的，该函数组件并不会重新渲染。这个过程是
浅比较的。但是当我们的状态值是一个引用数据类型的话，比如一个数组，如果我们直接使用 push pop 这样改变数组内的元素的话，那也不会触发组件的重新渲染。因为 useState 内部通过浅比较判断更新前和更新后的引用地址是同一个。

代码演示如下（不会重新渲染的）：

```
import React, { useState } from 'react';

export default function Count() {
  let [arr, setArr] = useState([0]);
  const handlerAdd = function () {
    arr.push(1);
    setArr(arr);
    // setArr([...arr, 1])
  }
  console.log('--arr--', arr);
  return (
    <div>
      <button onClick={ handlerAdd }>加1</button>
    </div>
  )
}
```

下面如果我们改成 setArr([...arr, 1]) 就会重新渲染函数组件的， 如下代码：

```
import React, { useState } from 'react';

export default function Count() {
  let [arr, setArr] = useState([0]);
  const handlerAdd = function () {
    setArr([...arr, 1])
  }
  console.log('--arr--', arr);
  return (
    <div>
      <button onClick={ handlerAdd }>加1</button>
    </div>
  )
}
```

#### <div id="id2">2）useReducer <a href="#back"> 回到顶部</a></div>

useReducer 相当于对 useState 的升级处理，useReducer 的思想采用了 redux 中对状态的管理，每次改变一个状态的时候通过派发一个 action 去通知 reducer 去更新状态。

基本用法：

```
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

reducer: 我们自定义的状态逻辑函数，参数为 state 和 action，用于更新 state，返回值是更新后的 state。
initialArg：初始化 state，可以是一个简单的值，也可以是一个对象。
init?: 计算初始值的函数。如果存在，使用 init(initialArg) 的执行结果作为初始值，否则使用 initialArg.

useReducer 接收三个参数分别是 reducer 函数，初始值 initialArg，和一个可选的惰性初始化的 init 函数。

但是一般使用 useReducer 的场景是一个组件中含有大量的状态，大量的修改状态的逻辑，才会选择采用 useReducer 进行管理，使用代码如下：

```
import React, { useReducer } from 'react';

interface IState {
  count: number;
}
interface IAction {
  type: 'add' | 'subtract';
  payload: number;
}
const initialState: IState = { count: 0 };

const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'add':
      return { count: state.count + action.payload };
    case 'subtract':
      return { count: state.count - action.payload };
    default:
      throw new Error('---error----');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>counter: {state.count}</p>
      <p>
        <button onClick={() => dispatch({type: 'add', payload: 1 })}>add 1</button>
      </p>
      <p>
        <button onClick={() => dispatch({type: 'subtract', payload: 1 })}>subtract 1</button>
      </p>
    </>
  )
}

export default Counter;
```

使用场景：

1. 组件中有复杂的状态逻辑。
2. 有多个子值的状态对象。
3. 想要优化性能避免不必要的渲染时。

#### <div id="id3">3）useContext <a href="#back"> 回到顶部</a></div>

useContext 可以让我们在组件中读取和订阅一个 context 的值，context 是一种在组件树中传递数据的方式，我们不需要通过 props。useContext 可以让我们在不同层级的组件之间共享数据，而不需要一层层地传递 props。比如我们可以使用 context 来传递主题色，语言，用户信息等。

基本使用语法：

const value = useContext(SomeContext);

SomeContext: 一个对象，由 React.createContext 返回。这个值由距离组件最近的 SomeContext.Provider 的 value prop 决定。如果没有对应的 Provider，那么
返回值就是创建该 context 时传入的 defaultValue.

value: 返回值。

使用实列：

```
// 创建一个 context
const SomeContext = React.createContext(defaultValue);

// 在组件中使用 useContext，读取 context 的值
function MyComponent() {
  const value = useContext(SomeContext);
  //....
}
// 在组件树中提供 context 的值
function MyPage() {
  return (
    <SomeContext.Provider value={value}>
      <MyComponent />
    </SomeContext>
  )
}
```

使用 demo 如下：

```
import React, { useContext, useState } from 'react';

const ThemeContext = React.createContext({ number: 0, changeNumber: (item: number) => { } });

const App = function App() {
  let [number, setNumber] = useState(0);

  const changeNumber = (n: number) => {
    setNumber(n);
  }
  return <ThemeContext.Provider value={{ number, changeNumber }}>
    <div>
      <Child />
    </div>
  </ThemeContext.Provider>
}

const Child = function Child() {
  let { number, changeNumber } = useContext(ThemeContext);
  return <div className="main">
    <p>child: {number}</p>
    <button onClick={() => { changeNumber(++number)}}>点击</button>
  </div>
}

export default App;
```

#### <div id="id4">4) useRef <a href="#back"> 回到顶部</a></div>

useRef 可以用来获取组件的实列，还可以用来缓存数据。

1）基于 useRef 获取 DOM 元素

```
import React, { useRef, useState, useEffect } from 'react';

function App() {
  const [num, setNum] = useState(0);
  const btnBox = useRef(null);

  useEffect(() => {
    console.log('--index---', btnBox.current);
  }, [num]);

  return (
    <div>
      <span>{num}</span>
      <button ref={btnBox} onClick={ () => setNum(num + 1)}>按钮</button>
    </div>
  )
}

export default App;
```

#### <div id="id5">5) forwardRef <a href="#back"> 回到顶部</a></div>

forwardRef 是当父组件需要得到子组件元素时，可以利用 forwardRef 来实现。ref 的作用是获取实例, 可能是 DOM 实列，也可能是 ClassComponent 实例。
但是如果目标组件是一个 FunctionComponent 的话，是没有实例的。此时用 ref 去传递会报错。
React.forwardRef 会创建一个 React 组件，这个组件能够将其接收的 ref 属性转发到其组件树下的另一个组件中。我们可以在以下两种场景中使用：

1）转发 refs 到 DOM 组件。
2）在高阶组件中转发 refs。

下面我们来看一个普通实例。点击搜索按钮后，让文本输入框处于聚焦状态。普通代码用法如下：

```
import React, { Component } from 'react';

export default class App extends Component<any, any> {
  mytext = {
    current: {
      focus: () => { },
      value: ''
    }
  };
  render() {
    return (<div>
      <button type="button" onClick={() => {
        console.log('---mytext---', this.mytext);
        this.mytext.current.focus();
        this.mytext.current.value = '2222';

      }}>获取焦点</button>
      <Child callback={(el: any) => {
        console.log('---this.mytext----', el);
        this.mytext = el;
      }}/>
    </div>)
  }
}

class Child extends Component<any, any>{
  mytext = React.createRef<HTMLInputElement>();
  componentDidMount() {
    this.props.callback(this.mytext);
  }
  render() {
    return (<div style={{ background: "yellow" }}>
      <input defaultValue={111} ref={ this.mytext } />
    </div>)
  }
}
```

#### 使用 forwardRef

```
import React, { Component, forwardRef } from 'react';

export default class App extends Component {
  mytext = {
    current: {
      focus: () => { },
      value: ''
    }
  };
  render() {
    return (<div>
      <button type="button" onClick={() => {
        console.log('---mytext----', this.mytext);
        this.mytext.current.focus();
        this.mytext.current.value = '222';
      }}>获取焦点</button>
      <Child ref={ this.mytext } />
    </div>)
  }
}

const Child = forwardRef((props, ref: any) => {
  return (
    <div>
      <input defaultValue="1111" ref={ ref } />
    </div>
  )
})
```

基本用法：React.forwardRef(render);

forwardRef 函数接收一个名为 render 的函数(也可以将 render 方法理解成一个函数组件)，返回值是 react 组件。

```
const render = (props, ref) => {
  return <></>;
}
```

上面代码中，render 函数接收 2 个参数，第一个参数为 props(父组件传递的参数对象)，第二个参数为 ref(React.createRef());

因此，就组合成我们常见的写法：

```
const Button = React.forwardRef=((props, ref)) {
  return <></>;
}
```

我们可以再看另外一个列子，当我们没有使用 forwardRef 时，父组件传入子组件 ref 属性，此时 ref 指向的是子组件本身。如下代码所示：

```
import React, { useEffect, useRef } from 'react';

class Child extends React.Component {
  state = {
    test: '这是子组件'
  };
  render() {
    return (<div>
      <button>点击我</button>
    </div>)
  }
}

function App() {
  const child = useRef<any>();
  useEffect(() => {
    setTimeout(() => {
      console.log('---child---', child); // 打印出 child 的 ref 指向了子组件本身
    }, 200);
  }, []);
  return (
    <div>
      <Child ref={ child } />
    </div>
  )
}

export default App;
```

可是现在如果我想让 child 指向的是 Child 的 button 按钮呢？此时我们只能拓展 Child 的 props，新增一个字段如 buttonRef。如下代码：

```
import React, { useEffect, useRef } from 'react';

interface IProps {
  buttonRef: any;
}

class Child extends React.Component<IProps> {
  render() {
    return (<div>
      <button ref={ this.props.buttonRef}>点击我</button>
    </div>)
  }
}

function App() {
  const child = useRef<any>();
  useEffect(() => {
    setTimeout(() => {
      console.log('---child----', child);
    }, 200);
  }, []);
  return (<div>
    <Child buttonRef={child} />
  </div>)
}

export default App;
```

此时 child 指向了 button 这一 dom 对象。

如上可以看到该场景中存在的问题，子组件需要增加 buttonRef 字段，父组件需要承担一些负担。

因此 React 提供了 forwardRef， 用于将 ref 转发，这样子组件在提供内部的 dom 时，不用扩充额外的 ref 字段。

修改后的代码如下：

```
import React, { forwardRef, useEffect, useRef } from 'react';

const Child = forwardRef((props: any, ref: any) => {
  return (
    <div>
      <button ref={ref}>点我</button>
    </div>
  )
});

function App() {
  const child = useRef<any>();
  useEffect(() => {
    setTimeout(() => {
      console.log('---child---', child);
    }, 200);
  }, []);

  return (
    <div>
      <Child ref={ child } />
    </div>
  )
}

export default App;
```

#### <div id="id6">6) useEffect <a href="#back"> 回到顶部</a></div>

useEffect 是 react 函数组件用来替代生命周期的函数，我们可以把 useEffect Hook 看作是 componentDidMount 和 componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

用法：useEffect(callback[,[]]);

第一个参数接收一个 callback 的回调函数，里面可以编写执行业务代码。
第二个参数可省略，它接收一个数组，可以是空数组。

1）当我们不传递第二个参数时，每次 render 都会执行一遍 callback 函数，相当于包含一次 render 的 componentDidUpdate 声明周期。
2）当传递第二个参数且是空数组时，只有第一次 render 才会执行 callback，类似于 componentDidMount 生命周期。
3）不管是否传递第二个参数，只要在 callback 中 return 一个函数，就相当于告诉 react 此组件挂掉之前执行什么操作，类似于 componentWillUnMount.

```
useEffect(() => {
  console.log('---useEffect---'); // 等价于 componentDidUpdate，在组件挂载完成后执行。
})

useEffect(() => {
  console.log('---useEffect----'); // 等价于 componentDidMount, 在组件每次更新执行
}, []);

useEffect(() => {
  return () => {
    console.log('---useEffect----'); // 等价于 componentWillUnmount, 在组件将要销毁的时候执行的。
  }
})
```

#### 模拟 componentDidMount

```
import React, { useEffect, useState } from 'react';

export default function App() {
  const [state, setState] = useState(0);
  useEffect(() => {
    console.log('---执行第一次render了');
  }, []);
  return (<div>
    <h1>{state}</h1>
    <button onClick={() => {
      setState((x) => x + 1);
    }}>按钮+1</button>
  </div>)
}
```

如上代码，页面只会执行一次。当我们点击按钮的时候，不会再打印了。

#### 模拟 componentDidUpdate

```
import React, { useEffect, useState } from 'react';

export default function App() {
  const [state, setState] = useState(0);
  useEffect(() => {
    console.log('---执行第一次render了');
  }, [state]);
  return (<div>
    <h1>{state}</h1>
    <button onClick={() => {
      setState((x) => x + 1);
    }}>按钮+1</button>
  </div>)
}
```

如上代码，当 state 每次发生改变的时候，会重新渲染 useEffect 函数内部代码。当我们每次点击按钮的时候，都会执行一次。

#### 注意： 当然，如果我们要监听所有的数据的话，我们可以不传递第二个参数。每次渲染的时候 都会执行一遍。

#### 模拟 componentWillUnMount

在 useEffect 参数的 callback 函数中直接返回 return 一个函数，就相当于告诉 react，我要在这个组件死之前，执行一段代码。

```
import React, { useEffect, useState } from 'react';

export default function App() {
  const [state, setState] = useState(0);
  return (
    <div>
      {state === 1 ? null : <Child />}
      <h1>{state}</h1>
      <button onClick={() => {
        setState((x) => x + 1);
      }}>按钮+1</button>
    </div>
  )
}

const Child = () => {
  React.useEffect(() => {
    console.log('这个child组件第一次render了');
    return () => {
      console.log('---这个div灭亡前的代码');
    }
  }, []);
  return <div>孩子组件</div>
}
```

#### <div id="id8">8) useLayoutEffect <a href="#back"> 回到顶部</a></div>

useLayoutEffect 与 useEffect 使用方式是一致的，useLayoutEffect 的区别是：会在页面渲染前执行，useEffect 的回调函数会在页面渲染后执行；useEffect 是异步调用，而 useLayoutEffect 是同步调用。那么什么时候使用 useLayoutEffect, 什么时候使用 useEffect 呢？如果回调函数修改 state 导致组件重新渲染的话，但是我们又不想它重新渲染， 这个时候我们使用 useLayoutEffect，因为使用 useEffect 可能会导致页面闪烁；如果回调函数中去请求数据或 js 执行时间过长，我们建议使用 useEffect; 因为 useLayoutEffect 堵塞浏览器渲染。

一般情况下，对于一些通过 js 计算的布局，如果你想减少 useEffect 带来的 页面抖动，我们可以考虑使用 useLayoutEffect 来代替它。

来看下面的一个列子：

```
import React, { useEffect, useState } from 'react';

function App() {

  let [flag, setFlag] = useState(false);

  useEffect(() => {
    if (!flag) {
      setFlag(true);
    }
  }, [flag]);

  return <div style={{ backgroundColor: flag  ? 'red' : 'green' }} onClick={() => { setFlag(false); }}>
      {+flag}
  </div>;
};


export default App;
```

如上 demo，我们通过一个点击 div 来回切换背景色，在运行代码后可以发现，每次点击最终都会变成红色，但变成红色过程中会存在闪烁，一瞬间变成绿色再变成红色。而如果我们将
useEffect 替换成 useLayoutEffect 就不会出现闪烁这种情况，如下代码：

```
import React, { useLayoutEffect, useState } from 'react';

function App() {

  let [flag, setFlag] = useState(false);

  useLayoutEffect(() => {
    if (!flag) {
      setFlag(true);
    }
  }, [flag]);

  return <div style={{ backgroundColor: flag  ? 'red' : 'green' }} onClick={() => { setFlag(false); }}>
      {+flag}
  </div>;
};


export default App;
```

#### <div id="id9">9) useMemo <a href="#back"> 回到顶部</a></div>

useMemo 具备 "计算缓存"，类似于 vue 里面的 computed，在其依赖项没有改变的情况下，传递给 useMemo 的 callback 就不会重新执行。如下所示：
当 number1 或 number2 的值改变的时候，sum 才会改变，而改变 x 的值，不会改变 sum，也不会重新执行 useMemo 的 callback。

```
import React, { useMemo, useState } from 'react';

const App = function Demo() {
  let [number1, setNumber1] = useState(10);
  let [number2, setNumber2] = useState(5);
  let [x, setX] = useState(0);

  let sum = useMemo(() => {
    console.log('---change sum---');
    return number1 + number2;
  }, [number1, number2]);

  return <div>
    <div>
      <p>number1: {number1}</p>
      <p>number2: {number2}</p>
      <p>sum: {sum}</p>
      <p>x: {x}</p>
    </div>
    <div>
      <button onClick={() => setNumber1(number1 + 1)}>number1增加</button>
      <button onClick={() => setNumber2(number2 + 1)}>number2增加</button>
      <button onClick={ () => setX(x+1)}>x改变</button>
    </div>
  </div>
}

export default App;
```

#### <div id="id10">10) useCallback <a href="#back"> 回到顶部</a></div>

useCallback 可以缓存一个函数，在其依赖项不变的情况下，useCallback 返回的函数的引用地址不会产生变化。

```
const handle = useCallback(() => {
  // 代码
}, []);
```

useCallback 相当于 useMemo 的语法糖，也就是说 useCallback 能实现的， useMemo 也能实现，useMemo 实现上述代码如下：

```
const handle = useMemo(() => {
  return () => {
    // 代码逻辑
  }
}, []);
```

```
1) 子组件没有从父组件传入的props或者传入的props仅仅为简单的数值类型使用 memo 即可。
2）子组件有从父组件传来的方法时，在使用memo的同时，使用useCallback包裹该方法，传入方法需要更新的依赖值。
3）子组件有从父组件传来的对象和数组等值时，在使用memo的同时，使用useMemo 以方法形式返回该对象，传入需要更新的依赖值。
```

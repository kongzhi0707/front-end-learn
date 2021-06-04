### 理解useReducer的用法

  在hooks中提供了useReducer功能，我们可以实现类似Redux的功能，引入 useReducer 后，useReducer 它接受一个reducer函数作为参数，reducer接受2个参数，一个是state，另一个是action。然后返回一个状态 count 和 dispatch，count 是返回状态中的值，而dispatch是一个可以发布事件来更新state的。

  基本使用如下代码：
```
import React, {useReducer} from 'react';
export default function ReducerDemo() {
  const [count, dispatch] = useReducer((state, action) => {
    // ....
  }, 0);
  return (
    <div>
      <div className="title">{count}</div>
    </div>
  )
}
```
  因此我们可以看个如下的demo：
```
|--- index.jsx
|--- hello.jsx
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
import React, { useReducer } from 'react';

export default function ReducerDemo() {
  const [count, dispatch] = useReducer((state, action) => {
    switch(action) {
      case 'add':
        return state + 1;
      case 'sub':
        return state - 1;
      default:
        return state;
    }
  }, 0);
  return (
    <div>
      <div className="title">{count}</div>
      <button className="btn" onClick={() => dispatch('add')}>增加</button>
      <button className="btn" onClick={() => dispatch('sub')}>减少</button>
    </div>
  )
}
```
然后初始化页面，有两个按钮，并且count初始化的值为0. 当我们点击按钮的时候，会使用dispatch来发布一个事件，传递一个值作为action的值，最后返回state的值给count。

#### 2）action是一个对象

  因此我们把 hello.jsx 代码改成如下：
```
import React, { useReducer } from 'react';

// 在state中存放两个数字。
const initialState = {
  count1: 0,
  count2: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'add1':
      return { ...state, count1: state.count1 + 1 };
    case 'sub1':
      return { ...state, count1: state.count1 - 1 };
    case 'set1': 
      return { ...state, count1: action.count };

    case 'add2':
      return { ...state, count2: state.count2 + 1 };
    case 'sub2':
      return { ...state, count2: state.count2 - 1 };
    case 'set2':
      return { ...state, count2: action.count };
    default:
      throw new Error('Unexpected action');
  }
}

export default function ReducerDemo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <React.Fragment>
      <div>
        {state.count1}
        <button onClick={() => dispatch({ type: 'add1'})}>增加1</button>
        <button onClick={() => dispatch({ type: 'sub1'})}>减少1</button>
        <button onClick={() => dispatch({ type: 'set1', count: 0})}>reset</button>
      </div>
      <div>
        {state.count2}
        <button onClick={() => dispatch({ type: 'add2'})}>增加1</button>
        <button onClick={() => dispatch({ type: 'sub2'})}>减少1</button>
        <button onClick={() => dispatch({ type: 'set2', count: 0})}>reset</button>
      </div>
    </React.Fragment>
  );
}
```
  如上代码，在state初始化的时候，会使用对象的形式保存两个或多个值，比如代码：
```
// 在state中存放两个数字。
const initialState = {
  count1: 0,
  count2: 0,
};
```
  在使用useReducer方法时候，会把 initialState的值传递给state，如下代码：
```
const [state, dispatch] = useReducer(reducer, initialState);
```
  reducer 函数如上代码，当我们每次点击一个操作的时候，就会使用dispatch传递一个参数给action，如代码：dispatch({ type: 'add2'}); 也就是说action现在传递的是一个对象形式，因此会调用 reducer 函数，该函数会接受2个值，一个是state值，另一个是action参数，因此我们使用switch语句来判断 action.type 的值，最后我们使用 return { ...state, count1: state.count1 + 1 }; 这句代码来合并对象值的方式。比如 state的初始值为：
```
state = {
  count1: 0, 
  count2: 0
};

return { ...state, count1: state.count1 + 1 };
```
  因此最后结果就变为: 
```
{
  count1: 1,
  count2: 0
}
```
  最后会重新渲染页面，返回对应的值。

#### 3）使用多个 useReducer

  上面的单个state中出现了两个计数器。这是一种典型的全局state方法。但是有时候我们仅仅需要使用本地（局部）的state。因此我们这个时候可以使用多个useReducer。

  hello.jsx 代码改成如下：
```
import React, { useReducer } from 'react';

const initialState = 0;
const reducer = (state, action) => {
  switch (action.type) {
    case 'add': 
      return state + 1;
    case 'sub':
      return state - 1;
    case 'set':
      return action.count;
    default:
      throw new Error('Unexpected action'); 
  }
}

export default function ReducerDemo() {
  const [count1, dispatch1] = useReducer(reducer, initialState);
  const [count2, dispatch2] = useReducer(reducer, initialState);
  return (
    <React.Fragment>
      <div>
        {count1}
        <button onClick={() => dispatch1({ type: 'add'})}>增加1</button>
        <button onClick={() => dispatch1({ type: 'sub'})}>减少1</button>
        <button onClick={() => dispatch1({ type: 'set', count: 0})}>reset</button>
      </div>
      <div>
        {count2}
        <button onClick={() => dispatch2({ type: 'add'})}>增加1</button>
        <button onClick={() => dispatch2({ type: 'sub'})}>减少1</button>
        <button onClick={() => dispatch2({ type: 'set', count: 0})}>reset</button>
      </div>
    </React.Fragment>
  );
}
```
  实现的效果和上面是一样的。每个计数器都有各自的dispatch的方法，但是共享了reducer方法。

#### 4）文本输入demo实现

  我们下面可以看一个简单的demo，我们以React中的input组件为列，使用多个useReducer，在本地状态state中存储文本数据。通过调用dispatch函数来更新文本状态值。

  hello.jsx 代码如下：
```
import React, { useReducer } from 'react';

const initialState = 0;
const reducer = (state, action) => action;

const TextInput = ({value, onChangeText }) => (
  <input type="text" value={value} onChange={e => onChangeText(e.target.value)} />
);

export default function ReducerDemo() {
  const [count1, dispatch1] = useReducer(reducer, initialState);
  const [count2, dispatch2] = useReducer(reducer, initialState);
  return (
    <React.Fragment>
      <div>
        count1: {count1}
        <TextInput value={count1} onChangeText={dispatch1} />
      </div>
      <div>
        count2: {count2}
        <TextInput value={count2} onChangeText={dispatch2} />
      </div>
    </React.Fragment>
  );
}
```
### redux的理解

#### 1. 为什么要使用redux？

  React数据是单向数据流的，因此组件之间传递的数据是一级一级往下传递，那么这样传递数据非常麻烦，Redux就是来解决这些问题而产生的，Redux有一个核心部分是Store，在Store中它将所有状态都存储到一个仓库中，被一个reducer进行管理，如果React中的某个组件的某个数据在某个时刻改变了，我们可以直接更改这个Store中的管理数据，那么其他的组件如果想要拿到对应数据的话，就可以直接从仓库里面去拿了。不需要父子组件互相传递数据。

  redux有如下准则：
  1）单一数据源：整个应用状态，都应该被存储在单一store的对象树中。
  2）只读状态：如果我们想更改state状态的话，我们只有通过dispatch发送一个action动作，然后我们可以通过 store.getState()方法获取状态值。

#### 2. 理解redux中核心几个概念。

  1). store： store是管理整个应用状态。store提供了一个方法dispatch，用来发送一个动作去修改store里面的状态, 然后我们可以通过 store.getState()方法来重新获取最新的状态。也就是state。

  2). reducer：当dispatch发送之后，getState的状态发送了改变，Reducer是用来修改状态的，Reducer是一个纯函数，它接收Action和当前state作为参数，并且返回一个新的state。

  3). action: action是我们可以对状态做那些改变。action它是一个对象，一般包含 type 和 payload两个参数，分别表示发起了什么类型操作 以及 所携带的数据。

  4). dispatch: 当我们要修改状态的时候，我们不能直接修改状态，我们需要通过调用dispatch函数，传入我们想要的action。然后由reducer来帮我们来完成状态的修改。

  5). subscribe：该方法是用来监听store中state值的，如果state值被改变，那么我们通过 subscribe 注册过listener监听器函数，redux就会依次调用我们的listener。一般我们可以在listener中做一些UI重新渲染操作等。

#### 3. 如何使用Redux？

  安装redux： npm install --save redux

  下面我们可以来使用redux来做一个简单的计数器demo。我们假如我们的项目基本目录结构如下:
```
|--- 项目
| ｜--- src
| ｜ ｜--- reducer.js
| ｜ ｜--- store.js
| ｜ ｜--- action.js
| |  |--- actionTypes.js
```
  3.1) src/actionTypes.js
```
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
```
  actionTypes.js 是用来保存所有的操作类型的。

#### 3.2）src/store.js

  store是将所有前端状态都存储到一个仓库中。我们可以使用 createStore函数来创建一个store。然后把我们创建的reducer作为参数传递进去，如下代码：
```
import { createStore } from 'redux';
import Reducer from './reducer';

const store = createStore(Reducer);

export default store;
```
#### 3.3) src/reducer.js 

  reducer是个纯函数，它接收参数并且更新数据。

  reducer会接收2个参数，previousState(老的状态数据)和action(在何种操作下)，返回newState(返回新的状态数据)。基本代码如下：
```
import * as ActionTypes from './actionTypes';
/** 
 * @param {Number} state 初始化数据为0，既可以是一个对象，也可以是一个数字
 * @param {Object} action 它是一个对象，一般包含 type(数据类型) 和 payload(需要被传递的数据)
 * @return {Number} newState 返回新的状态数据 
*/
export default (state = 0, action) => {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return state + 1;
    case ActionTypes.DECREMENT:
      return state - 1;
    default:
      return state;
  }
}
```
#### 3.4) src/action.js
```
import * as ActionTypes from './actionTypes';

export const increment = () => {
  return {
    type: ActionTypes.INCREMENT
  }
}

export const decrement = () => {
  return {
    type: ActionTypes.DECREMENT
  }
}
```
#### 3.5）入口文件代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import * as actionTypes from './actionTypes';
import * as actions from './action';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState()
    };
  }
  onIncrement = () => {
    // 触发disptah事件
    store.dispatch(actions.increment())
  }
  onDecrement = () => {
    // 触发dispatch事件
    store.dispatch(actions.decrement())
  }
  render() {
    store.subscribe(() => { 
      // 使用setState 重新渲染页面
      this.setState({
        count: store.getState()
      })
    });
    return (
      <div>
       <p>
         <button onClick={this.onIncrement}>increment</button>
       </p>
      <div>计数器的值：{this.state.count}</div>
       <p>
         <button onClick={this.onDecrement}>decrement</button>
       </p>
      </div>
      
    )
  }

}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));

```
  如上代码，我们看到，当我们点击 increment 按钮的时候，会调用 onIncrement 函数，在该函数内部使用 store.dispatch() 方法来改变state值，首先会调用 src/actions.js 中的 increment 方法，该方法返回一个对象，该对象一般有两个值，一个是type类型(必填), 另一个是payload(传递的数据)。当dispatch发送之后，getState的状态发送了改变，就会调用src/reducer.js, Reducer是用来修改状态的，Reducer是一个纯函数，它接收Action和当前state作为参数，并且返回一个新的state。最后state值发送改变后，在入口文件中我们可以通过 store.subscribe()方法来监听store中state值的，最后执行listener函数，然后为了重新渲染UI，因此我们暂时使用setState让页面重新渲染。






















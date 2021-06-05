### 理解Redux-thunk的使用

#### 1. 理解applyMiddleware中间件

  在我们dispatch一个action之后，到达reducer之前，比如我们想进行日志记录，调用异步接口操作等，我们可以使用中间件来做这件事。中间件的基本使用如下：
```
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));
```
  如上代码，redux-thunk 就是一个中间件，我们直接将 thunk中间件引入到我们的 applyMiddleware方法中即可。传入到 createStore 方法参数内，就完成了 store.dispatch()的功能增强，因此我们就可以在reducer进行一些异步操作。applyMiddleware的作用是将所有的中间件组成一个数组，依次执行，因此如果有多个数组的话，我们可以依次传入到 applyMiddleware 方法内即可。比如 applyMiddleware(thunk, logger); 

  下面让我们来使用 redux-thunk 来做一个异步计数器demo，来更加了解 redux-thunk 来处理异步操作。

  同样，这篇文章，也是在上篇文章之上进行的，因此我们也可以先了解下上篇文章的一些知识点，<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/react/redux1.md">点击查看</a>

  现在还是假如我们现在的目录结构如下：
```
|--- 项目
| ｜--- src
| ｜ ｜--- reducer.js
| |  |--- combineReducer.js
| ｜ ｜--- store.js
| ｜ ｜--- action.js
| |  |--- actionTypes.js
| |  |--- index.js  // 入口文件
| |  |--- app.js
```
#### 1. 编写仓库的主文件代码 src/store.js 代码，该文件主要用于导出store，提供给组件使用，基本代码如下：
```
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './combineReducer';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import reduxLogger from 'redux-logger';

// 使用中间件 reduxThunk，reduxPromise，reduxLogger
const store = createStore(rootReducer, applyMiddleware(reduxThunk, reduxPromise, reduxLogger));

export default store;
```
#### 2. 编写 src/reducer.js, 它是一个计数器reducer。如下代码：
```
import * as ActionTypes from './actionTypes';
/** 
 * @param {Number} state 初始化数据为0，既可以是一个对象，也可以是一个数字
 * @param {Object} action 它是一个对象，一般包含 type(数据类型) 和 payload(需要被传递的数据) {type: '', count: 1} 这样的
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
#### 3. src/actionTypes.js 的代码如下：
```
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
```
  actionTypes.js 是用来保存所有的操作类型的。

#### 4. src/combineReducer.js 是将多个reducer链接起来。代码如下：
```
import { combineReducers } from 'redux';
import count from './reducer';

const rootReducer = combineReducers({
  count,
});

export default rootReducer;
```
#### 5. src/action.js 
```
import * as ActionTypes from './actionTypes';

export const incrementAstnc = () => {
  return (dispatch) => {
     setTimeout(function () {
         dispatch(increment())
     }, 500)
  }
}

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
#### 6. src/index.js 代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import store from './store';
import { Provider } from 'react-redux'; // 新增的

console.log('store', store);
// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(
  <Provider store = {store} >
    <App />
  </Provider>, 
  document.getElementById('app')
);
```
#### 7. src/app.js 代码如下：
```
import React, { Component } from 'react';

import * as Action from './action';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    console.log(this.props);
    const { incrementAstnc, decrement } = this.props;
    return (
      <div>
       <p>
         <button onClick={incrementAstnc}>increment</button>
       </p>
        <div>计数器的值：{this.props.count}</div>
       <p>
         <button onClick={decrement}>decrement</button>
       </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.count,
});

export default connect(mapStateToProps, Action)(App);
```

### 理解 react-redux, combineReducer 的使用

#### 一：react-redux

  React-Redux 它能够使React组件从Redux store中读取数据，并且向store分发actions来更新数据。
  首先我们需要安装 react-redux， 安装命令如下:
```
npm install --save react-redux
```
  React-Redux 提供了 <Provider /> 组件，直接在最顶层组件把数据传递进去，然后组件想用的时候再接收。并且还提供了 connect 方法能够让我们把组件和store链接起来。

#### 理解Provider

  React-Redux 提供了 <Provider /> 组件，一般我们将顶层组件包裹在 <Provider /> 组件之中，然后将 store作为参数传递到 Provider组件中去，比如如下代码：
```
<Provider store={store}>
  <App />
</Provider>
```
  这样做的目的是让所有子组件都能够访问的到Redux中的数据。

#### 理解connect

  如下这句代码：
```
connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```
  connect方法接收二个参数为：mapStateToProps, mapDispatchToProps，他们定义了UI组件的业务逻辑，前者负责输入逻辑，即将state映射成UI组件的参数(props),后者负责输出逻辑，即将用户对UI组件的操作映射成Action。

#### mapStateToProps

  mapStateToProps 的含义可以理解为：把Redux中的state数据映射到React中到props中去。比如如下代码：
```
const mapStateToProps = (state) => {
  return {
    foo: state.bar
  }
}
```
  如上代码的含义是：将state中的bar数据映射到 props中的foo去，因此在页面渲染的时候，我们就可以使用 this.props.foo 来获取数据了。

  比如如下代码：
```
import React, { Component } from "react";
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      // 如下代码渲染其实就是 state.bar的数据了
      <div>{this.props.foo}</div> 
    )
  }
}
const mapStateToProps = state => ({
  foo: state.bar
});

export default connect(mapStateToProps, null)(App);
```
#### mapDispatchToProps

  可以为对象或函数，该参数的作用是将actions挂载到props中，方便组件调用，如果是函数，参数默认为dispatch，它会返回一个对象，对象里分别是actions。要自己调用dispatch。如果传入的是一个对象的话，对象的名为action名称，值为 action creater(也就是返回一个由type的对象)，由connect函数中统一处理重写函数，将该对象传入dispatch方法统一调用。

  比如是函数，代码如下：
```
const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch({
        type: 'increatment'
      });
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button onClick={this.props.onClick}>点击increase</button>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
```
  我们可以直接通过this.props.onClick，来调用dispatch,这样就不需要在代码中来进行store.dispatch了。

  我们还是在上篇文章的基础之上来学习，<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/react/redux.md">查看上篇文章</a>

  首先结构目录如下：

```
|--- 项目
| ｜--- src
| ｜ ｜--- reducer.js
| ｜ ｜--- store.js
| ｜ ｜--- action.js
| |  |--- actionTypes.js
| |  |--- index.js  // 入口文件
| |  |--- app.js
```

  在src/index.js 代码中，将store直接从最顶层组件将它传递进去。如下代码：
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import store from './store';
import { Provider } from 'react-redux'; // 新增的

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(
  <Provider store = {store} >
    <App />
  </Provider>, 
  document.getElementById('app')
);
```
  然后我们在 src/app.js 中，我们引入 connect 来接收store，下面我们可以使用 this.props 来使用 dispatch 了，如下代码：
```
import React, { Component } from 'react';
import * as Action from './action';
import { connect } from 'react-redux';

class App extends Component {

  onIncrement = () => {
    this.props.dispatch(Action.increment());
  }
  onDecrement = () => {
    this.props.dispatch(Action.decrement());
  }
  
  render() {
    console.log(this.props);
    return (
      <div>
       <p>
         <button onClick={this.onIncrement}>increment</button>
       </p>
      <div>计数器的值：{this.props.count}</div>
       <p>
         <button onClick={this.onDecrement}>decrement</button>
       </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state
});

export default connect(mapStateToProps)(App);
```
  如上代码，我们打印 console.log(this.props); 值为如下：
```
{count: 0, dispatch: ƒ}
count: 0
dispatch: ƒ dispatch(action)
__proto__: Object
```
  可以看到，我们的 this.props 值有 count 和 dispatch 两个属性。当我们点击下页面中按钮的时候，计数器会加一或减1，并且我们发现我们不需要使用 setState 来重新渲染页面，redux已经帮我们做了这件事了。

#### 处理Action

  如上代码，我们使用了react-redux后，我们不再需要使用setState来重新渲染页面了。现在我们继续把我们的Action也传入进去，如代码：connect(mapStateToProps,Action)(App);这样的。我们再来看下我们的 App.js 代码，src/app.js代码如下：
```
import React, { Component } from 'react';

import * as Action from './action';
import { connect } from 'react-redux';

class App extends Component {
  /*
  onIncrement = () => {
    this.props.dispatch(Action.increment());
  }
  onDecrement = () => {
    this.props.dispatch(Action.decrement());
  }
  */
  render() {
    console.log(this.props);
    const { increment, decrement } = this.props;
    return (
      <div>
       <p>
         <button onClick={increment}>increment</button>
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
  count: state
});

export default connect(mapStateToProps, Action)(App);
```
  如上代码，我们打印 this.props 信息如下：
```
{count: 0, increment: ƒ, decrement: ƒ}
count: 0
decrement: ƒ ()
increment: ƒ ()
__proto__: Object
```
  如上可以看到，我们的 this.props 属性值没有dispatch了，直接返回 src/action.js 中的两个函数 increment 和 decrement; 因此我们点击按钮的时候，直接可以调用该两个函数。

#### 二：如何使用多个 reducer ---- combineReducer

  redux中只有一个全局的store，那么如果我们需要管理多个状态的话，我们可能会使用到多个reducer，在redux中提供了一个 combineReducer 可以将多个 reducer 链接起来。

  我们在 项目中src文件夹下创建 reducer2.js 文件。因此目录结构如下：
```
|--- 项目
| ｜--- src
| ｜ ｜--- reducer.js
| |  |--- reducer2.js
| |  |--- combineReducer.js
| ｜ ｜--- store.js
| ｜ ｜--- action.js
| |  |--- actionTypes.js
| |  |--- index.js  // 入口文件
| |  |--- app.js
```
  src/reducer2.js 代码如下：
```
export default (state = "hello", action) => {
  switch (action.type) {
    default:
      return state;
  }
}
```
  src/combineReducer.js 是将多个reducer链接起来。代码如下：
```
import { combineReducers } from 'redux';

import count from './reducer';
import hello from './reducer2';

const rootReducer = combineReducers({
  count,
  hello
});

export default rootReducer;
```
  src/store.js 代码需要改成如下：
```
import { createStore } from 'redux';
// import Reducer from './reducer';
import rootReducer from './combineReducer';

const store = createStore(rootReducer);

export default store;
```
  src/app.js 代码改成如下：

```
import React, { Component } from 'react';

import * as Action from './action';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    console.log(this.props);
    const { increment, decrement } = this.props;
    return (
      <div>
       <p>
         <button onClick={increment}>increment</button>
       </p>
        <div>计数器的值：{this.props.text} {this.props.count}</div>
       <p>
         <button onClick={decrement}>decrement</button>
       </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.count,
  text: state.hello
});

export default connect(mapStateToProps, Action)(App);
```
  我们点击 increment 按钮或 decrement 按钮的时候，会打印 this.props 的值可以看到如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/60.jpg" /> <br />




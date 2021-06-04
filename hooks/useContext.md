### 理解 useContext 的用法

  useContext的应用场景是：在父组件的数据需要共享到所有的子组件甚至孙子组件去，那么这个时候我们可以使用useContext。Context能让这些数据向组件下所有的组件进行广播，所有的组件都能访问到这些数据，也能访问到后续数据的更新。

  如下目录：
```
|--- index.jsx
|--- hello.jsx
|--- sonComponent.jsx
|--- appContext.jsx
```
  index.jsx 为父组件，hello.jsx 为子组件，sonComponent.jsx 为孙子组件。

  appContext.jsx 基本代码如下：
```
import React from 'react';
const AppContext = React.createContext({});
export default AppContext;
```
  index.jsx 父组件代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';
import  AppContext  from './appContext';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      num: 1
    };
  }
  changeValue = () => {
    this.setState({
      count: this.state.count + 1,
      num: this.state.num + 1,
    });
  }
  render() {
    return (
      <AppContext.Provider value={{state: this.state}}>
        <div>
          <button onClick={this.changeValue}>click me</button>
          <Hello></Hello>
        </div>
      </AppContext.Provider>
    )
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  如上index.jsx 为父组件，使用了 AppContext.Provider 中有一个参数为value来作为传递值。然后 Hello为子组件。
  hello.jsx 组件代码如下：
```
import React, { useState, useEffect } from 'react';
import  AppContext  from './appContext';
import SonComponent from './sonComponent';

class PostList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <AppContext.Consumer>
          {
            ({state}) => {
              console.log(state); // 打印 {count: 1, num: 1}
            }
          }
        </AppContext.Consumer>
        <SonComponent></SonComponent>
      </div>
    ); 
  }
}

export default PostList;
```
  如上hello.jsx 为子组件，在子组件中我们通过 AppContext.Consumer 就能获取值了。如上所示的demo。并且在子组件中，我们引用了孙子组件 SonComponent，因此在 sonComponent.jsx 中代码如下：
```
import React, { useState, useEffect } from 'react';
import  AppContext  from './appContext';

const SonComponent = () => {
  return (
    <div>
        <AppContext.Consumer>
        {
            ({state}) => {
            console.log('这是孙子组件')
            console.log(state); // 打印 {count: 1, num: 1}
            }
        }
        </AppContext.Consumer>
    </div>
  );
}

export default SonComponent;
```
如上是孙子组件 SonComponent，因此在孙子组件中我们也能拿到对应的值了。
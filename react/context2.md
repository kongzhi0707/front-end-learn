
### React Context 嵌套传值

在前一篇文章，我们介绍了 react 中的context的基本使用， <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/es6/context.md">context请看这里</a>, 下面我们来看下使用context嵌套传值。

目录结构如下：
```
｜--- main.jsx
｜--- hello.jsx
｜--- context.jsx
｜---- userContext.jsx
```
#### context.jsx 代码如下：
```
import React from 'react';
const MainContext = React.createContext();
export default MainContext;
```
#### userContext.jsx 代码如下：
```
import React from 'react';
const UserContext = React.createContext();
export default UserContext;
```
#### main.jsx 代码如下：
```
import React, { Component } from 'react';
import MainContext from './context';
import UserContext from './userContext';
import Hello from './hello';

export class Main extends Component { 
  constructor(props) { 
    super(props);
  }
  state = {
    arr: 'hello',
    obj: {name: 'kongzhi'}
  }
  render() { 
    return (<div>
      <MainContext.Provider value={this.state.arr}>
        <UserContext.Provider value={this.state.obj}>
          Main Page
          <Hello />
        </UserContext.Provider>
      </MainContext.Provider>
    </div>)
  }
}

export default Main;
```
  如上在 祖先组件中进行嵌套传值:
```
1) 同时引入两个context的文件。
2）MainContext.Provider 和 UserContext.Provider 进行嵌套传值。
```
  在我们的孙子组件中(hello)：
```
1）也要同时引入两个 context。
2）接收值也需要进行嵌套，注意观察写法。
```
  这样我们就能接受不了到两个不同的值。
```
import React, { Component } from 'react';
import MainContext from './context';
import UserContext from './userContext';

class Hello extends Component { 
  render() { 
    return (
      // 组件中推荐使用 Consumer 进行取值消费
      <MainContext.Consumer>
        {
          context => { 
            return <UserContext.Consumer>
              {
                user => { 
                  console.log('----返回的值----', context, user);
                  return (
                    <div>hello world ---- {context} ---- { user.name }</div>
                  )
                }
              }
            </UserContext.Consumer>
          }
        }
      </MainContext.Consumer>
    )
  }
}

export default Hello;
```





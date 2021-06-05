
### 更好用的Redux

  官方推荐action和reducer放在不同的文件夹内，但是这样会导致文件频繁切换的繁琐。因此我们可以把 action.js 和 reducer.js 统一放在 store 文件夹内。比如文件目录结构如下：
```
  |--- store
  | |--- action.js
  | |--- reducer.js
  | |--- index.js
```
  我们可以举例计数器来说明：

  store/action.js 代码如下：
```
  export const ADD ='add';
```
  store/reducer.js 代码如下：
```
const counter = {
  count: 0
};

export default function reducer(state = counter, action) {
  switch(action.type) {
  	case 'ADD':
  	  return {
  	  	...state,
  	  	count: state.count + 1
  	  }
  	  break;

  	default:
  	  return state;
  	  break;
  }
}
```
  store/index.js 代码如下：
```
import { createStore } from 'redux';
import Reducer from './reducer';

const store = createStore(Reducer);

export default store;
```
  入口文件 app.js 代码如下：
```
import React, { Component } from "react";
import {
  Link
} from "react-router-dom";

import store from '../store';
import { ADD } from '../store/action';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState().count
    };
  }
  onIncrement = () => {
    // 触发dispatch事件
    store.dispatch({type: ADD});
  }
  render() {
    store.subscribe(() => { 
      // 使用setState 重新渲染页面
      this.setState({
        count: store.getState().count
      })
    });
    console.log(this.state)
    return (
      <div>
        <p onClick={this.onIncrement}>increment</p>
        <p>计数器的值：{this.state.count}</p>
      </div>
    );
  }
}

export default App;
```
  如上代码，当我们点击 increment 时候，就会自增1操作。

  如上代码，我们把action和reducer放入到两个文件内，其实他们本质都是改变同一个状态(即counter对象)，既然都是改变同一个状态，那我们就可以把它放在一起。因此我们可以把store文件夹中的action.js 和 reducer.js 删除掉，然后新建 counter.js，即：
```
|--- store
| |--- counter.js
| |--- index.js
```
  store/counter.js 代码如下：
```
const initialState = {
  count: 0
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
  	case 'ADD':
  	  return {
  	  	...state,
  	  	count: state.count + 1
  	  }
  	  break;

  	default:
  	  return state;
  	  break;
  }
}
```
  store/index.js 代码如下：
```
import { createStore } from 'redux';
import Reducer from './counter';

const store = createStore(Reducer);

export default store;
```
  入口文件 app.js 代码改成如下：
```
import React, { Component } from "react";
import {
  Link
} from "react-router-dom";

import store from '../store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState().count
    };
  }
  onIncrement = () => {
    // 触发dispatch事件
    store.dispatch({type: 'ADD'});
  }
  render() {
    store.subscribe(() => { 
      // 使用setState 重新渲染页面
      this.setState({
        count: store.getState().count
      })
    });
    console.log(this.state)
    return (
      <div>
        <p onClick={this.onIncrement}>increment</p>
        <p>计数器的值：{this.state.count}</p>
        <ul>
          <li><Link to='/index'>首页</Link></li>
          <li><Link to='/about'>关于</Link></li>
        </ul>
      </div>
    );
  }
}

export default App;
```
#### Reducer switch 写法改善

  当reducer中switch 情况较多时，写switch较为繁琐，我们可以写个工具方法将reducer switch风格转换成对象风格。
将 action 转换成对象的属性名。

#### reducer 必须是纯函数，返回新的引用。

  因此可以通过 immer(https://segmentfault.com/a/1190000017270785) 来优化。

  1. 第一步 安装 immer 及 引入 immer
```
import produce from "immer";
```
  2. 第二步 修改 handleActions 工具函数

  项目目录结构改成如下：
```
|--- store
| |--- util.js
| |--- index.js
| |--- counter.js
```
  store/counter.js 代码改成如下：
```
import { handleActions } from "./util";

const initialState = {
  count: 0
};
/* 改造前
const reducers = {
  add(state, action) {
  	return {
  	  ...state,
  	  count: state.count + 1
  	}
  },
  minus(state, action) {
  	return {
  	  ...state,
  	  count: state.count - 1
  	}
  }
};
*/
// 改造后
const reducers = {
  add(state, action) {
    state.count++;
    console.log(state.count);
  },
  minus(state, action) {
    state.count--
  },
}
export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers
})
```

  store/util.js 代码改成如下：
```
import produce from "immer"

export const handleActions = ({ state, action, reducers }) => {
  const obj = Object.keys(reducers)
    .includes(action.type)
    ? produce(state, draft => reducers[action.type](draft, action))
    : state;
  console.log(obj);
  return obj;
}
```
  store/index.js 代码改成如下：
```
import { createStore } from 'redux';
import Reducer from './counter';

const store = createStore(Reducer);

const _dispatch = store.dispatch;

store.dispatch = (type, data) => _dispatch({type, data});

console.log('---store---', store);
export default store;
```
  App.js 入口文件代码变成如下：
```
import React, { Component } from "react";
import {
  Link
} from "react-router-dom";

import store from '../store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState().count
    };
  }
  onIncrement = () => {
    // 触发dispatch事件
    store.dispatch('add');
  }
  minus = () => {
    // 触发dispatch事件
    store.dispatch('minus');
  }
  render() {
    store.subscribe(() => { 
      // 使用setState 重新渲染页面
      this.setState({
        count: store.getState().count
      })
    });
    console.log(this.state);
    return (
      <div>
        <p onClick={this.onIncrement}>increment</p>
        <p onClick={this.minus}>minus</p>
        <p>计数器的值：{this.state.count}</p>
        <ul>
          <li><Link to='/index'>首页</Link></li>
          <li><Link to='/about'>关于</Link></li>
        </ul>
      </div>
    );
  }
}

export default App;
```
  如上当我们点击 increment 会自增1，点击 minus 会自减1.

#### 增加命名空间

  当项目越来越复杂的时候，我们编写的action可能存在命名冲突的问题，比如不同的模块都有相同的add
类型的话，那么在一个页面中编写会调用冲突，为了解决这个问题，可以以当前文件名当做命名空间。

  比如我们有如下目录结构：
```
|--- store
| |--- modules
| | |--- counter.js
| | |--- todoList.js
| |--- index.js
| |--- util.js
```
  为了防止 counter 和 todoList内action的命名冲突，我们需要改造下 util中的handleActions工具函数。

  store/util.js 代码如下：
```
import produce from "immer"

const getKey = (str, flag) => {
  const index = str.indexOf(flag);
  return str.substring(index + 1, str.length + 1);
}

export const handleActions = ({ state, action, reducers, namespace = '' }) => {
  const obj = Object.keys(reducers)
    .map(key => namespace + '/' + key)
    .includes(action.type)
    ? produce(state, draft => reducers[getKey(action.type, '/')](draft, action))
    : state;
  console.log(obj);
  return obj;
}
```
  store/index.js 代码如下：
```
import { createStore, combineReducers } from 'redux';
import counter from './modules/counter';
import todoList from './modules/todoList';

const reducer = combineReducers({
  counter,
  todoList,
});

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const _dispatch = store.dispatch;

store.dispatch = (type, data) => _dispatch({type, data});

export default store;
```
  store/modules/counter.js 代码如下：
```
import { handleActions } from "../util";

const initialState = {
  count: 0
};
const reducers = {
  add(state, action) {
    state.count++;
    console.log(state.count);
  },
  minus(state, action) {
    state.count--
  },
}
export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
  namespace: 'counter',
});
```
  store/modules/todoList.js 代码如下：
```
import { handleActions } from "../util";

const initialState = {
  inputValue: '123',
  list: []
}
const reducers = {
  add(state, action) {
    state.list.push(action.data)
  },
  delete(state, action) {
    state.list.splice(action.data, 1)
  },
  changeInput(state, action) {
    state.inputValue = action.data
  }
}

export default (state = initialState, action) => handleActions({
  state,
  action,
  reducers,
  namespace: 'todo'
})
```
  入口文件app.js 代码调用如下：
```
import React, { Component } from "react";
import {
  Link
} from "react-router-dom";

import store from '../store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: store.getState().count
    };
  }
  onIncrement = () => {
    // 触发dispatch事件
    store.dispatch('counter/add');
  }
  minus = () => {
    // 触发dispatch事件
    store.dispatch('counter/minus');
  }
  render() {
    store.subscribe(() => {
      const { counter } = store.getState();
      // 使用setState 重新渲染页面
      this.setState({
        count: counter.count
      })
    });
    console.log(this.state);
    return (
      <div>
        <p onClick={this.onIncrement}>increment</p>
        <p onClick={this.minus}>minus</p>
        <p>计数器的值：{this.state.count}</p>

        <ul>
          <li><Link to='/index'>首页</Link></li>
          <li><Link to='/about'>关于</Link></li>
        </ul>
      </div>
    );
  }
}

export default App;
```
<a href="https://github.com/kongzhi0707/react-staging-template">github代码</a>




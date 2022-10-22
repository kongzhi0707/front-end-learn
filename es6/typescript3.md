
### React.FC 和 React.Component 使用和区别

#### 创建React项目

使用脚手架方式如下：
```
js项目：npx create-react-app js-react
ts项目：npx create-react-app ts-react --template typescript
```
创建成功后，启动项目：
```
cd ts-react
npm start
```
在TypeScript中，React组件可以定义为 函数(React.FC<>) 或class（继承React.Component）的形式。

#### 一：React.FC(函数组件)

  React.FC 是函数式组件，是在TypeScript使用的一个泛型。FC是 FunctionComponent 的缩写，React.FC 可以写成 React.FunctionComponent.
函数组件是一个纯函数，使用React.FC来写React组件的时候，不能使用 setState, 取而代之的是 useState(), useEffect()等Hook API。函数组件也叫做无状态组件。

  React.FC 包含了PropsWithChildren的泛型，不用显式的声明 props.children 的类型。React.FC<>对于返回类型是显式的，而类函数或普通函数返回的隐式的。
  React.FC 提供了类型检查和自动完成的静态属性（比如：displayName, propTypes, 和 defaultProps）.

#### 1.1）React.FC传入props

下面一个列子，为React.FC传入props。代码如下：
```
import React, { useState } from 'react';

interface NoticeProps { 
  name?: string;
  address?: string;
}

const App: React.FC<NoticeProps> = (props) => { 
  console.log('-----props----', props);

  const [name, setName] = useState('kongzhi');
  const [count, setCount] = useState(1);
  const addCount = () => { 
    setCount(count + 1);
  }
  console.log('---count----', count);
  return <div>
    <p>message页面，name是：{name}</p>
    <p>message的页面，count是：{count}</p>
    <button onClick={() => setName('tugenhua')}>点击我改变name</button>
    <br />
    <button onClick={ addCount }>点击我改变count</button>
  </div>
}

export default App;
```
#### 1.2）父子组件间通讯props

父组件 App.tsx 的代码如下：
```
import React, { FC } from 'react';
import Child from './child';

const Parent: FC = () => { 
  const emitChild = (v: number): void => alert(v);
  const id = 12;
  const msg = "props传递";
  return <Child id={id} msg={msg} onClick={ emitChild }/>
}

export default Parent;
```
子组件 child.tsx 代码如下：
```
import React, { FC } from 'react';

interface Props { 
  id?: number;
  msg?: string;
  onClick?: (v:number) => void;
}

// 通过函数的参数传递
const Child: FC<Props> = ({ id, msg, onClick }) => { 
  const handleClick = () => { 
    onClick(id);
  }
  return (
    <div>
      <span onClick={handleClick}>{ `${id} - ${msg}`}</span>
    </div>
  )
}
export default Child;
```
页面显示如下：

12 - props传递

当我们点击的时候， 会弹出alert框 12.

#### 二）React.Component（类组件）

  React.Component 是ES6的形式，取代了ES5的原生方式定义的组件 React.createClass。

  定义class组件，需要继承 React.Component. React.Component 是类组件。在TypeScript中，React.Component是通用类型（React.Component<PropType, StateType>）. 需要为其提供(可选) props 和 state 类型参数。

  如下代码演示：
```
App.tsx 代码如下：

import React from 'react';
import Child from './child';

class Parent extends React.Component { 
  
  render() { 
    return <div>
      <Child message1={'kongzhi'} message2={'xxxx'} />
    </div>
  }
}

export default Parent;
```
child.tsx 代码如下：
```
import React, { Component } from 'react';

interface IProps { 
  message1?: string;
  message2?: string;
}

interface IState { 
  message3: any;
}

class Child extends Component<IProps, IState> { 
  // 构造函数
  constructor(props: IProps, context: any) { 
    super(props, context);
    this.state = {
      message3: "test"
    }
  }
  render() { 
    return (
      <div>
        <div>{ this.props.message1 }</div>
        <div>{ this.props.message2 }</div>
      </div>
    )
  }
}

export default Child;
```
#### 三）函数组件 和 类组件的区别？
```
1）语法上不同： 函数组件是一个纯函数，它接收一个props对象返回一个react元素。类组件需要去继承 React.Component， 并且创建 render 函数返回react代码。
2）类组件使用的时候需要实例化，而函数组件直接执行函数返回结构即可。
3）函数组件不能访问this对象。没有生命周期的方法，没有状态的state。类组件有this，生命周期，有状态的state。
4）无状态组件只能访问输入的props，同样的 props 会得到同样的渲染效果。不会有副作用。函数组件的性能比类组件的性能要高。
```

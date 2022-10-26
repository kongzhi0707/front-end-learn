
### React Context 使用介绍

#### 一）为什么需要使用 Context

  在React中，数据传递一般使用props传递数据，维持单向数据流。但是单向数据流在某些场景中并不适用。比如有三个组件，Parent, Child. Son，他们三者之间的关系如下：
```
Parent -> Child -> Son
```
  Parent 需要把 数据传递给 Son， 按照传统的方法，Parent 需要把数据传递给子组件 Child， 然后子组件把数据再传递给 孙子组件 Son。那这样就比较烦，并且当有n多个孙子组件，一步步传递是非常繁琐的。因此这个时候，我们需要使用 Context 来解决这些问题。

#### 二）Context 是什么？

  Context 提供了一个无需为每层组件手动添加props。就能在组件树间进行数据传递的方法。在一个React应用中，数据是通过props属性自上而下（由父及子）进行传递的。但是这种对于
非常深的孙子组件传递数据是非常繁琐的。因此 Context 提供了一种组件之间共享值的方式，而不必显式的通过组件树逐层传递props。

  下面代码中，有父组件把数据theme通过props传递给子组件中去，子组件通过props传递给孙子组件，孙子组件拿到props对应的数据，如下代码：

  Parent.tsx 代码如下：
```
import React from 'react';
import Child from './child';

class Parent extends React.Component { 
  
  render() { 
    return (<div>
      <Child theme="dark" />
    </div>)
  }
}

export default Parent;
```
Child.tsx 代码如下：
```
import React, { Component } from 'react';
import Son from './son';

interface IProps { 
  theme: string;
}

class Child extends Component<IProps> { 
  constructor(props:IProps, context: any) { 
    super(props);
  }
  render() {
    
    return <div>
      <Son theme={ this.props.theme }/>
    </div>
  }
}

export default Child;
```
Son.tsx 代码如下：
```
import React, { Component } from 'react';

interface IProps { 
  theme: string;
}

class Child extends Component<IProps> { 
  constructor(props:IProps, context: any) { 
    super(props);
  }
  render() {
    
    return <div>
      { this.props.theme }
    </div>
  }
}

export default Child;
```
  在页面上就会显示 theme 字符串了。如上通过props传递数据一层一层往下传递数据很烦。

#### React.createContext
```
const MyContext = React.createContext(defaultValue);
```
  创建一个 Context 对象。当 React 渲染了一个订阅了这个 Context对象的组件，这个组件会从组件中离自身最近的那个匹配的 Provider 中读取当前的 context 值。
当组件所处的树中没有匹配到 Provider 时， defaultValue（默认值）才会生效。

#### Context.Provider
```
<MyContext.Provider value={/* 某个值 */} />
```
  每个 Context 对象都会返回一个 Provider React组件。它允许消费组件订阅 context 的变化。Provider 接收一个value属性，传递给消费组件。一个Provider可以和多个消费组件有对应的关系。多个Provider也可以嵌套使用，但是里面的会覆盖外层的数据，因此嵌套其实意义也不大。

  当Provider的value值发生变化时，它内部的所有消费组件都会重新渲染。Provider及其内部 consumer 组件都不受制于 shouldComponentUpdate函数。因此当 consumer 组件在其祖先组件退出更新的情况下也能更新数据。

#### Class.contextType

  挂载在Class 上的 contextType 属性会被赋值为一个由 React.createContext() 创建的 Context 对象。因此我们在类中使用 this.context 中就可以拿到 Context 上的值。
我们可以在React中的任何生命周期中都能访问到它的值。 包括在 render 函数中。 代码演示如下：

  比如有如下三个文件 context.tsx, App.tsx, son.tsx 文件代码分别如下：

  context.tsx 代码如下：
```
import React from 'react';
// 默认值为 'default'
const context = React.createContext('default');
export default context;

App.tsx 代码提供值数据如下：

import React from 'react';
import Son from './son';
import Context from './context';

class Parent extends React.Component { 
  
  render() { 
    return (<div>
      <Context.Provider value="dark">
        <Son />
      </Context.Provider>
    </div>)
  }
}

export default Parent;
```
son.tsx 代码消费数据如下：
```
import React, { Component } from 'react';
import Context from './context';

class Child extends Component{ 
  componentDidMount() { 
    let value = this.context;
    console.log('----componentDidMount----', value);
  }
  componentDidUpdate() { 
    let value = this.context;
    console.log('----componentDidUpdate----', value);
  }
  componentWillUnmount() { 
    let value = this.context;
    console.log('----componentWillUnmount----', value);
  }
  render() {
    let value = this.context;
    console.log('----render----', value);
    return <div>222</div>
  }
}
Child.contextType = Context;
export default Child;
```
  如上代码，context.tsx 负责创建一个context对象。App.tsx 返回一个 Provider React组件，它提供一个属性value，son组件 把 Context 挂载在Class 上的 contextType 属性上， 且在各个生命周期演示来获取该值。最后在浏览器上打印的效果如下：
```
----render---- dark
son.tsx:21 ----render---- dark
son.tsx:9 ----componentDidMount---- dark
son.tsx:17 ----componentWillUnmount---- dark
son.tsx:9 ----componentDidMount---- dark
```
如上打印可以看到，我们在各个生命周期 通过 this.context 就可以拿到值了。

#### Context.Consumer

  React context 使用了Provider 和 Customer 模式， 在顶层的组件使用 Provider 中传入 value，在子孙组件中使用 Consumer 中获取值。
比如有 App.tsx ，context.tsx, child.tsx， son.tsx 文件。 代码分别如下：

  context.tsx 代码如下：
```
// 创建Context组件
import React from 'react';
// 默认值为 'default'
const context = React.createContext('default');
export default context;
```
  App.tsx 代码如下：
```
// 顶层组件传递数据

import React from 'react';
import Child from './son';
import Context from './context';

class Parent extends React.Component { 
  
  render() { 
    return (<div>
      <Context.Provider value="dark">
        <Child />
      </Context.Provider>
    </div>)
  }
}

export default Parent;
```
  child.tsx 中间组件如下代码：
```
import React, { Component } from 'react';
import Son from './son';

class Child extends Component { 
  render() {
    return <div>
      <Son />
    </div>
  }
}

export default Child;
```
  son.tsx 接收组件代码如下：
```
import React, { Component } from 'react';
import Context from './context';

class Son extends Component { 
  render() {
    
    return (<div>
      <Context.Consumer>
        {
          (value) => <div>{ value }</div>
        }
      </Context.Consumer>
    </div>)
  }
}
export default Son;
```

#### 在嵌套组件中更新 Context

从一个组件中嵌套很深的组件中更新 context 是很有必要的。在这种情况下，我们可以通过 context 传递一个函数， 使得 consumer 组件来更新 context。

代码如下：

context.tsx 代码如下：
```
import React from 'react';

export const themes = {
  light: {
    foreground: '#000',
    background: '#eee',
  },
  dark: {
    foreground: '#fff',
    background: '#222'
  }
};

export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => { }, // 定义更新主题的方法， 向下传递
});
```
App.tsx 代码如下：
```
import React from 'react';
import { 
  themes,
  ThemeContext,
} from './context';

import ThemeToggleButtom from './theme-toggle-button';

interface IProps {
  
}

interface IState { 
  theme: {
    foreground: string;
    background: string; 
  };
  toggleTheme: () => void;
  
} 
class Parent extends React.Component<IProps, IState> {
  constructor(props: any) { 
    super(props);
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }
  toggleTheme = () => { 
    this.setState({
      theme: this.state.theme === themes.dark ? themes.light : themes.dark,
    });
  }
  render() { 
    const {
      theme,
      toggleTheme
    } = this.state;
    console.log('---state---', this.state);
    return (<div>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ThemeToggleButtom />
      </ThemeContext.Provider>
    </div>)
  }
}

export default Parent;
```
theme-toggle-button.tsx 代码如下：
```
import React from 'react';

import {
  ThemeContext,
} from './context';

class ThemeToggleButtom extends React.Component { 
  
  render() { 
    return <ThemeContext.Consumer>
      {
        ({ theme, toggleTheme }) => (
          <button onClick={toggleTheme} style={{ background: theme.background}}>
            Toggle Theme
          </button>
        )
      }
    </ThemeContext.Consumer>
    
  }
}

export default ThemeToggleButtom;
```











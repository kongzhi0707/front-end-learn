
### react之context前世今生

#### 一）为什么要使用context？

在React的项目有一个全局变量 theme (theme可能是初始化数据交互获得的，也可能是切换主题变化的)。有一些视图UI组件(比如表单input框，button按钮)，
需要主题切换后，需要使用theme变量来做对应的视图渲染，我们要怎么样把theme一直往子组件或孙子组件传递呢？

因此为了解决这个问题，React提供了context上下文模式，具体模式是：React组件树根节点，使用 Provider 提供者注入 theme， 然后在需要 theme 的地方，使用 Consumer 消费者形式 取出 theme, 提供给组件渲染使用即可。这样减少很多无用功。

#### 二）老版本 context

在v16.3.0之前，Reatc使用 PropTypes 来声明 context 类型，提供者需要 getChildContext 来返回需要提供的 context， 并且用静态属性的 childContextTypes 声明需要提供的 context 的数据类型。具体如下：
```
// 父组件
import React, { Component } from "react";
import propsTypes from 'proptypes';
import Child from './Child';

// 提供者
class ProviderDemo extends React.Component { 
  getChildContext() { 
    // 提供者要提供的主题颜色，供消费者消费
    const theme = {
      color: '#ccc',
      background: 'red',
    }
    return { theme }
  }
  render() { 
    return <div>
      hello world
      <Child />
    </div>
  }
}

ProviderDemo.childContextTypes = {
  theme: propsTypes.object,
}

export default ProviderDemo;
```
// 子组件 Child.jsx
```
import React, { Component } from "react";
import propsTypes from 'proptypes';

class ChildDemo extends React.Component { 
  render() { 
    console.log('----theme---', this.context.theme);
    const { color, background } = this.context.theme;
    return <div style={{color, background }}>消费者</div>
  }
}

ChildDemo.contextTypes = {
  theme: propsTypes.object,
}

export default ChildDemo;
```
作为消费者，需要在组件的静态属性指明我到底需要那个提供者的提供状态，在如上代码中，ChildDemo中的contextTypes明确的指明了需要 ProviderDemo提供的
theme信息，然后就可以通过 this.context.theme 访问到 theme，用作渲染消费来。

#### 三）新版本context使用

新版本是使用 createContext 创建出一个context上下文对象，context对象提供两个组件，Provider 和 Consumer 作为新的提供者和消费者，这种context模式，更便捷的传递context。还增加了一些新的特性。

#### 3.1）createContext

React.createContext 的基本用法如下：
```
const ThemeContext = React.createContext(null);
const ThemeProvider = ThemeContext.Provider; // 提供者
const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者
```
createContext 接收一个参数，作为初始化 context 的内容，返回一个 context 对象，Context 对象上的 Provider 作为提供者，Context对象上的
Consumer 作为消费者。

创建一个 { Provider, Consumer }, 当React渲染context Consumer 时，它将从组件树中匹配最接近的 Provider 中读取当前的 context 值。

API说明：
```
1) React.createContext: 创建一个Context对象，当React渲染一个订阅了这个Context对象的组件，这个组件会从组件树中离自身最近的那个匹配的Provider中读取当前的
context的值。

2）Context.Provider: 每个Context对象都会返回一个Provider React组件，它允许消费组件订阅context的变化，当Provider的value值发生变化时，它内部的所有消费
组件都会重新渲染。

3）Context.Consumer: 每个Context对象都会返回一个 Consumer React 组件，可以订阅 context 的变更，此组件可以让你在函数组件中订阅 context。

4）Class.contextType: 挂载到class上的 contextType 属性可以赋值由 React.createContext() 创建的Context对象。此属性可以使用 this.context 来获取
最近的 Context 上的值。我们可以在任何生命周期中访问的到，包括在render函数中。

5）Context.displayName: context对象接收一个名为 displayName的property，类型为字符串。React DevTools 使用该字符串来确定context要显示的内容。
```
#### 3.2）基本使用方式如下：

#### 1) 自定义Context
```
// context.jsx 代码如下

import React from 'react';
const ThemeContext = React.createContext('light');
export default ThemeContext;
```
如上代码定义了一个 ThemeContext，默认值为 'light';

#### 2) 在需要的位置使用 Context 的 Provider。
```
import React, { Component } from "react";
import ThemeContext from "./context";
import ThemeButton from './ThemeButton';

// 提供者
class ProviderDemo extends React.Component { 
  
  render() { 
    return (<div>
      <ThemeContext.Provider value="dark">
        <div className="app">
          <ThemeButton />
        </div>
      </ThemeContext.Provider>
    </div>)
  }
}

export default ProviderDemo;
```
如上代码我们在组件的最外层使用了自定义的 Context 的 Provider，传入value覆盖了默认值，之后子组件读取到的ThemeContext的值就是 dark, 而不是默认的light，
如果Provider由value定义就使用value的值，只有当Provider未提供时才会使用定义时的默认值。

#### 3）定义 contextType，获取到 Context 上的值。
```
// ThemeButton.jsx 代码如下：

import React, { Component } from 'react';
import ThemeContext from './context';

class ThemeButton extends Component { 
  static contextType = ThemeContext;
  render() { 
    console.log('----this.context---', this.context); // 打印出 dark
    return <button>{ this.context }</button>
  }
}

export default ThemeButton;
```
如上代码，ThemeButton 声明了 contextType 是 ThemeContext，因此this.context的值就是最近的 ThemeContext 提供的 value，也就是light。

#### 四）Context更新机制

如果Provider的value属性是一个变量，当值变更时，消费这个Provider的子组件会触发更新机制。从而实现更新。值是否变更使用 Object.is的判断方法进行判断的，
所以不要使用动态生成的对象来作为context的值。

比如下面的value是一个对象，由于每次渲染的时候value所指向的值都是新生成的对象，内存地址指向不同，导致每次都触发消费这个 Provider的组件更新。
```
<ThemeContext.Provider value={{ theme: 'light' }}></ThemeContext.Provider />
```
#### 从嵌套组件中更新 context

我们通常需要从组件树中深层嵌套组件中更新context，在这种情况下，我们可以在 context 中向下传递一个函数。以允许 Consumer 更新 context。
```
// context.js 代码如下

import React from 'react';
export const ThemeContext = React.createContext(null);
```
在需要的位置使用 Context 的 Provider。代码如下：
```
import React, { Component } from "react";
import { ThemeContext } from "./context";
import ThemeButton from './ThemeButton';

// 提供者
class ProviderDemo extends React.Component { 
  constructor(props) { 
    super(props);
    this.state = {
      theme: 'light',
      toggleTheme: this.toggleTheme,
    }
  }
  toggleTheme = () => { 
    const { theme } = this.state;
    let newTheme = '';
    if (theme === 'light') {
      newTheme = 'dark';
    } else { 
      newTheme = 'light';
    }
    this.setState({
      theme: newTheme
    });
  }
  render() { 
    return (<ThemeContext.Provider value={ this.state }>
      <div className="app">
        <ThemeButton />
      </div>
    </ThemeContext.Provider>)
  }
}

export default ProviderDemo;
```
```
// ThemeButton.jsx 代码如下

import React, { Component } from 'react';
import { ThemeContext } from './context';

class ThemeButton extends Component { 
  render() { 
    return <ThemeContext.Consumer>
      {
        ({ theme, toggleTheme }) => { 
          console.log('---theme---', theme);
          return <button onClick={toggleTheme}>Toggle Theme</button>
        }
      }
    </ThemeContext.Consumer>
  }
}

export default ThemeButton;
```
#### 五）逐层传递Provider

Provider 还有一个特性，就是可以逐层传递 context，也就是用一个context可以用多个Provider传递，下一层级的Provider会覆盖上一层级的Provider。
```
import React, { Component } from "react";

// 逐层传递 Provider

const ThemeContext = React.createContext(null);

function Son2() { 
  return <ThemeContext.Consumer>
    {
      (themeContextValue2) => { 
        const { color, background } = themeContextValue2;
        return <div style={{color, background }}>第二层Provider</div>
      }
    }
  </ThemeContext.Consumer>
}

function Son() { 
  // useContext 接收一个参数，就是想获取的context，返回一个value值，就是最近的provider提供的value值
  const { color, background } = React.useContext(ThemeContext);
  const [themeContextValue2] = React.useState({ color: '#fff', background: 'blue' });
  // 第二层 Provider 传递内容
  return <div style={{ color, background }}>
    第一层Provder
    <ThemeContext.Provider value={themeContextValue2}>
      <Son2 />
    </ThemeContext.Provider>
  </div>
}

export default function ProviderDemo() { 
  const [themeContextValue] = React.useState({ color: 'orange', background: 'red' });
  // 第一层 Provider 传递内容
  return <ThemeContext.Provider value={themeContextValue}>
    <Son />
  </ThemeContext.Provider>
}
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/react/images/14.png" /> <br />

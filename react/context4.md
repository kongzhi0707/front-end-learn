
### react之context前世今生

#### 1）为什么要使用context？

在React的项目有一个全局变量 theme (theme可能是初始化数据交互获得的，也可能是切换主题变化的)。有一些视图UI组件(比如表单input框，button按钮)，
需要主题切换后，需要使用theme变量来做对应的视图渲染，我们要怎么样把theme一直往子组件或孙子组件传递呢？

因此为了解决这个问题，React提供了context上下文模式，具体模式是：React组件树根节点，使用 Provider 提供者注入 theme， 然后在需要 theme 的地方，使用 Consumer 消费者形式 取出 theme, 提供给组件渲染使用即可。这样减少很多无用功。

#### 2）老版本 context

在v16.3.0之前，Reatc使用 PropTypes 来声明 context 类型，提供者需要 getChildContext 来返回需要提供的 context， 并且用静态属性的 childContextTypes 声明需要提供的 context 的数据类型。具体如下：

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

// 子组件 Child.jsx

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

作为消费者，需要在组件的静态属性指明我到底需要那个提供者的提供状态，在如上代码中，ChildDemo中的contextTypes明确的指明了需要 ProviderDemo提供的
theme信息，然后就可以通过 this.context.theme 访问到 theme，用作渲染消费来。

#### 3）新版本context使用

新版本是使用 createContext 创建出一个context上下文对象，context对象提供两个组件，Provider 和 Consumer 作为新的提供者和消费者，这种context模式，更便捷的传递context。还增加了一些新的特性。

#### 3.1）createContext

React.createContext 的基本用法如下：

const ThemeContext = React.createContext(null);
const ThemeProvider = ThemeContext.Provider; // 提供者
const ThemeConsumer = ThemeContext.Consumer; // 订阅消费者

createContext 接收一个参数，作为初始化 context 的内容，返回一个 context 对象，Context 对象上的 Provider 作为提供者，Context对象上的
Consumer 作为消费者。

创建一个 { Provider, Consumer }, 当React渲染context Consumer 时，它将从组件树中匹配最接近的 Provider 中读取当前的 context 值。





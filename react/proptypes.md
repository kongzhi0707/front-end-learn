
### react 中的 prop-types 插件对数据类型进行检测。

#### 一）为什么使用 prop-types

  在多人开发时，在组件传递参数时，有可能出现类型传递错误的时候，因此我们需要在我们的组件上加上 prop-types， 它可以对父组件传进来的props进行检查。
假如副组件想传递的是字符串类型的话，而只传递了一个数字类型的话。如果我们没有类型检查系统不会给报错提示，但是有了类型检查以后。在控制台会给一个类型
传递错误的提示。

#### 二）安装 和 引入 
```
// 安装
npm install prop-types --save
// 引入
import PropTypes from 'prop-types';
```
#### 三）使用

#### 1）在class定义中使用方式如下：
```
class Greeting extends React.Component {
  render() {
    return (<div>Hello, { this.props.name }</div>)
  }
}

Greeting.defaultProps = {
  name: 'kongzhi'
};

ReactDOM.render(<Greeting />, document.getElementById('root'));
```
#### 2) ES7中使用方式示列
```
class Greeting extends React.Component {
  // 如果没有传递该属性的默认值
  static defaultProps = {
    name: "kongzhi"
  };
  // 如果传递该属性，该属性值必须为字符串
  static propTypes = {
    name: PropTypes.string
  };
  render() {
    return (
      <div>hello, {this.props.name}</div>
    )
  }
}
```
#### 四）常见的约束规则

1）常用类型
```
PropTypes.array // 数组
PropTypes.bool // 布尔
PropTypes.func // 函数
PropTypes.object // 对象
PropTypes.number // 数值
PropTypes.string // 字符串
PropTypes.symbol // symbol
PropTypes.element // React 元素
```
2）必填项，isRequired 在类型后面添加
```
Greeting.propTypes = {
  colors: PropTypes.array.isRequired, // 限制colors为数组类型，且必须
};
```
3）仅限制必要：any.isRequired
```
Greeting.propTypes = {
  colors: PropTypes.any.isRequired,  // 限制colors类型随意， 但是必须的
};
```
4）多可选类型 oneOfType([])
```
// 该方法接收一个数组参数，数组内容为允许通过的类型

Greeting.propTypes = {
  colors: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
```
5）多可选值：oneOf([])
```
// colors的值只能从 red 和 blue 中选择一个

Greeting.propTypes = {
  colors: PropTypes.oneOf(['red', 'blue'])
}
```
6) 特定的结构对象: shape({})
```
Greeting.propTypes = {
  people: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired
  })
}

// 如上 people = {name: 'kongzhi', id: 123} 满足校验
```
#### 五）使用demo
```
// Home.jsx

import React from 'react';
import PropTypes from 'prop-types';

function Home(props) {
  return (
    <div>
      <span>{props.value}</span>
      <button onClick={props.increaseValue}></button>
    </div>
  )
}

Home.propTypes = {
  value: PropTypes.number.isRequired,
  increaseValue: PropTypes.func.isRequired,
};

export default Home;

// App.jsx

import React from 'react';
import Home from './Home';

function App() {
  return (
    <div className="App">
      <Home value={0} increaseValue={() => {}} />
    </div>
  )
}

export default App;
```
一旦我们设置了 props 校验，就必须按照规定， 如上编写的传入一个函数的壳子 也会报错。











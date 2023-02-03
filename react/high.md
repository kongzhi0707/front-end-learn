
### React高阶组件及应用场景

#### 一：什么是高阶组件？

我们先来理解下什么是高阶函数，高阶函数的定义是：如果一个函数 接收一个或多个函数作为参数，然后返回一个函数，我们称之为：高阶函数。

下面就是一个简单的高阶函数：

function highFunc(greeting = () => {}) {
  return greeting;
}

高阶组件的定义和高阶函数是类似的，高阶组件的定义：如果一个函数接收一个或多个组件作为参数并且返回一个组件，我们可以称之为：高阶组件。

下面就是一个简单的高阶组件：

function HigherOrderComponent(WrappedComponent) {
  return <WrappedComponent />;
}

#### 二）React中的高阶组件

React中的高阶组件主要有两种形式：属性代理 和 反向继承。

#### 2.1）属性代理（Props Proxy）

最简单的属性代理实现代码如下：

// 无状态
function HigherOrderComponent(WrappedComponent) {
  return props => <WrappedComponent {...props} />;
}

// 有状态
function HigherOrderComponent(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

如上代码可以看到，属性代理其实就是一个函数接收一个 WrappedComponent 组件作为参数传入，并且返回了一个继承了 React.Component 组件的类，且在该类的 render() 方法中返回被传入的 WrappedComponent 组件。

属性代理类型的高阶组件返回的是一个标准的 React.Component 组件。因此它可以 操作props/抽离state/通过ref访问到组件实例/用其他元素包裹传入的组件 WrappedComponent。

#### 1）操作props

为 WrappedComponent 添加新的属性， 基本代码如下：

function HigherOrderComponent(WrappedComponent) {
  return class extends React.Component {
    const newProps = {
      name: 'kongzhi',
      age: 34,
    }
    return <WrappedComponent {...this.props} {...newProps} />;
  }
}

#### 2) 抽离state

利用props和回调函数把state抽离出来。

function HigherOrderComponent(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: ''
      };
    }
    onChange = () => {
      this.setState({
        name: 'kongzhi',
      })
    }
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onChange,
        }
      }
      return <WrappedComponent {...this.props} {...newProps} />
    }
  }
}

如何使用， 如下所有代码：


import React from 'react';

/*
import CheckInput from './InputComp';

class InputComp extends React.Component { 
  onsubmit = () => { }
  render() { 
    const { gradeInput } = this.props;

    return (<div>
      <div>
        <p>
          用户名: {
            gradeInput("uname", {
              rules: [{ required: true, message: '用户名不能为空' }, {type: 'password', reg: /^[a-zA-Z]/, message: "用户名必须以字母开头"}]
            })(<input />)
          }
        </p>
        <p>
          密码：{
            gradeInput("pwd", {
              rules: [{required: true, message: '密码不能为空'}]
            })(<input type="password" />)
          }
        </p>
        <button onClick={ this.onsubmit}>提交</button>
      </div>
    </div>)
  }
}

export default CheckInput(InputComp);
*/

function HigherOrderComponent(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: ''
      };
    }
    onChange = (e) => {
      
      this.setState({
        name: e.target.value,
      })
    }
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onChange,
        }
      }
      return <WrappedComponent {...this.props} {...newProps} />
    }
  }
}

const NameInput = props => (<input name="xx" {...props.name} />);

export default HigherOrderComponent(NameInput);

如上，我们就将input转换成受控组件了。










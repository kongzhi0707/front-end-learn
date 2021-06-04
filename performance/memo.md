### React.memo、React.PureComponent props发生改变组件重新渲染

  我们下面先看一个demo，当我们页面中有一个父组件和子组件，当我每次改变父组件的时候，重新渲染页面，页面中的子组件也会被重新渲染。如下demo:
```
import React from 'react';
import ReactDOM from 'react-dom';

function Child(props) {
  const { name } = props;
  console.log(name);
  return (
  <div>name值为: {name}</div>
  )
} 
class ParentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'kongzhi'
    };
  }
  changeHandler = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.changeHandler}/>
        <Child name="foo" />
      </div>
    )
  }
}
// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<ParentComponent />, document.getElementById('app'));
```
  如上代码，父组件中嵌套了一个子组件，父组件中有一个input输入框，该输入框监听了onChange事件，每次输入的时候都会使用setState该变值，因此组件会重新渲染，但是子组件中的props值并没有改变，Child组件也会被重新渲染了，但是我并不希望子组件发生渲染。因此我们有常见的两种方式解决：

  1. 第一种是子组件也使用类组件，然后extends React.PureComponent 即可解决。比如改成如下代码即可：
```
import React from 'react';
import ReactDOM from 'react-dom';

// 子组件也使用类组件 并且继承了 React.PureComponent
class Child extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { name } = this.props;
    console.log(name);
    return (
    <div>name的值为: {name} </div>
    )
  }
}
class ParentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'kongzhi'
    };
  }
  changeHandler = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.changeHandler}/>
        <Child name="foo" />
      </div>
    )
  }
}
// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<ParentComponent />, document.getElementById('app'));
```
  2. 第二种是子组件是个函数组件。我们使用React.memo()方法即可解决。
```
import React from 'react';
import ReactDOM from 'react-dom';

const areEqual = (prevProps, nextProps) => {
   // prevProps 和 nextProps 是否相等，相等返回true，组件不会重新渲染，反之，组件被重新渲染
   return prevProps.name === nextProps.name;
}
const Child = React.memo((props) => {
  const { name } = props;
  console.log(name);
  return (
    <div>name的值为: {name} </div>
  )
}, areEqual);

class ParentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'kongzhi'
    };
  }
  changeHandler = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.changeHandler}/>
        <Child name="foo" />
      </div>
    )
  }
}
// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<ParentComponent />, document.getElementById('app'));
```
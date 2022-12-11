
### React中重新渲染的四种方式

#### 1）在state改变时重新渲染组件

  React组件在每次state变化时都会运行render()方法。
```
import React, { Component} from 'react';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "name": 'kongzhi'
    }
  }
  componentDidMount() { 
    this.setState({
      name: 'tugenhua',
    });
  }
  render() {
    console.log('----render----');

    return (
      <div>
        { this.state.name }
      </div>
    );
  }
}
```
  如上列子中，我们在组件挂载完成之后更新了state。当然我们也可以在事件监听器中触发重新渲染组件。比如click事件里面。
```
import React, { Component} from 'react';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "name": 'kongzhi'
    }
  }
  handleClick = () => { 
    this.setState({
      name: 'tugenhua',
    });
  }
  render() {
    console.log('----render----');

    return (
      <div>
        <button onClick={ this.handleClick}>xxxxx</button>
        { this.state.name }
      </div>
    );
  }
}
```
#### 2) 在props改变时重新渲染组件

代码如下：
```
import React, { Component } from 'react';

class Child extends React.Component { 
  render() { 
    console.log('Child component: render()'); // 会执行
    return this.props.message;
  }
}
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "name": 'kongzhi'
    }
  }
  handleClick = () => { 
    this.setState({
      name: 'tugenhua',
    });
  }
  render() {
    console.log('----render----');

    return (
      <div>
        <button onClick={ this.handleClick}>xxxxx</button>
        <Child message={ this.state.name } />
      </div>
    );
  }
}
```
  如上代码中的 <Child /> 组件不含有 state， 但是它接收了一个名为 prop 名为message，当我们点击按钮后， 会更新 <Child /> 组件，会引起 render() 再次执行。也就是说， 父组件值发生改变后， 子组件会重新被渲染。

#### 3）key prop 重新渲染

  上面更新state和props操作不会引起子组件的重新挂载/卸载。只会重新调用 render()方法。componentWillUnmount 生命周期中打印的信息， 永远没有被执行。但是有时候对于一些复杂的逻辑组件。我们需要重新挂载/卸载操作。方便重新渲染内容。
```
import React, { Component } from 'react';

class Child extends React.Component { 
  componentWillUnmount() { 
    console.log('--child---will unmount');
  }
  render() { 
    console.log('Child component: render()'); // 会执行
    return this.props.message;
  }
}
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        { id: 1, title: 'aaa', content: "aaa" },
        { id: 2, title: 'bbb', content: "bbb" },
        { id: 3, title: 'ccc', content: "ccc" },
      ],
      activeId: null,
    }
  }
  render() {
    console.log('----render----');
    const { messages, activeId } = this.state;
    return (
      <div>
        <ul>
          {
            messages.map((item) => { 
              return (<li
                onClick={() => { 
                  this.setState({
                    activeId: item.id
                  })
                }}
              >
                { item.title }
              </li>)
            })
          }
        </ul>
        <Child
          key={activeId}
          message={
            activeId ? messages.find((item) => item.id === activeId).content : ''
           }
        />
      </div>
    );
  }
}
```
  如上代码，当我们点击标题时候，如果我们想要重新挂载/卸载整个子组件的话，我们可以在子组件上增加一个key属性，这样就可以实现，当我们每次点击标题后，都会执行子组件中的 componentWillUnmount() 方法了。

#### 4）强制重新渲染

  强制重新渲染， 使用 forceUpdate() 方法。 如下代码：
```
import React, { Component } from 'react';
export default class Home extends Component {
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    // force a re-render
    this.forceUpdate();
  };
  render() {
    console.log('----render----');
    return (
      <div>
        <button onClick={this.handleClick}>Say something</button>
      </div>
    );
  }
}
```



### React setState 数组、对象多种方式

  本篇文章有如下知识点：
```
1. 修改object中的某项 <br/>
2. 删除数组的首位 <br/>
3. 删除数组的尾部 <br/>
4. 删除数组中的任意一项 <br/>
5. 数组尾部添加一项 <br/>
6. 数组头部添加一项 <br/>
7. 数组任意位置添加一项 <br/>
8. 修改数组中任意一项的值 <br/>
```
#### 一. 修改object中的某项
```
this.setState({
  object: {...object, key: value}
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      object: {
        'name': 'kongzhi',
        'age': 31
      }
    };
  }
  onClickFunc = () => {
    this.setState({
      object: {...this.state.object, 'name': 'tugenhua', 'age': 32 }
    });
  }
  render() {
    return (
      <div className="container">
        <div>{'名字:' + this.state.object.name + ', 年龄:' + this.state.object.age }</div>
        <div onClick={this.onClickFunc}>点击我改变值</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  如上代码，我们点击一下，对象值就会重新渲染了。如上是使用setState改变对象的值的方法。

#### 二：修改数组中的值

#### 2.1 删除数组的首位

  基本方法如下：
```
this.state.arrs.splice(0, 1);
this.setState({
  arrs: this.state.arrs
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    this.state.arrs.splice(0, 1);
    this.setState({
      arrs: this.state.arrs
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  点击一下，如下效果：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/13.jpg" /> <br />

#### 2.2 删除数组的尾部

  使用方法如下:
```
this.state.arrs.splice(this.state.arrs.length - 1);
this.setState({
  arrs: this.state.arrs
});
```
  代码如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    this.state.arrs.splice(this.state.arrs.length - 1);
    this.setState({
      arrs: this.state.arrs
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  点击一下，效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/14.jpg" /> <br />

#### 2.3 删除数组中的任意一项

  使用方法如下:
```
this.state.arrs.splice(index, 1);
this.setState({
  arrs: this.state.arrs
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    // 删除数组的第二项
    const index = 1;
    this.state.arrs.splice(index, 1);
    this.setState({
      arrs: this.state.arrs
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  效果如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/15.jpg" /> <br />

#### 2.4 数组尾部添加一项

  使用方法如下: 
```
this.setState({
  arrs: [...this.state.arrs, item];
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    this.setState({
      arrs: [...this.state.arrs, { 'age': 35 }]
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  效果如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/16.jpg" /> <br />

#### 2.5 数组头部添加一项

  使用方法如下所示:
```
this.setState({
  arrs: [{'age': 35}, ...this.state.arrs]
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    this.setState({
      arrs: [{ 'age': 35 }, ...this.state.arrs]
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  效果如下所示:

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/17.jpg" /> <br />

#### 2.6 数组任意位置添加一项

  使用方法如下：
```
this.state.arrs.splice(index, 0, item);
this.setState({
  arrs: this.state.arrs
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    // 在数组第二项添加一项
    const index = 1;
    this.state.arrs.splice(index, 0, { 'age': 35 });
    this.setState({
      arrs: this.state.arrs
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  效果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/18.jpg" /> <br />

#### 2.7 修改数组中任意一项中的值

  使用方法如下:
```
const index = 1;
this.setState({
  arrs: this.state.arrs.map((item, _index) => index === _index ? {...item, [key]: value} : item);
});
```
  代码演示如下：
```
import React from 'react';
import ReactDOM from 'react-dom';
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrs: [
        { 'age': 30 },
        { 'age': 31 },
        { 'age': 32 },
        { 'age': 33 },
        { 'age': 34 }
      ]
    };
  }
  onClickFunc = () => {
    const index = 1;
    this.setState({
      arrs: this.state.arrs.map((item, _index) => index === _index ? {...item, ['age']: 35} : item)
    });
  }
  render() {
    console.log(this.state.arrs);
    return (
      <div className="container">
        <div onClick={this.onClickFunc}>点击我</div>
      </div>
    );
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Component />, document.getElementById('app'));
```
  效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/19.jpg" /> <br />
### 理解 React.Fragment 用法

  该特性的作用是：包裹一组子节点，但不返回本身节点。
  比如说：返回子组件里有多个 <td> 节点。

  比如如下代码：
```
import React from 'react';
import ReactDOM from 'react-dom';

// 父组件
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    )
  }
}
// 子组件
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>1111</td>
        <td>22222</td>
      </div>
    )
  }
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<Table />, document.getElementById('app'));
```
  最终被渲染的结果会变为如下，可见下面的结果并不是我们想要的，因为 table中不能有div标签。如下渲染：
```
<div id="app">
  <table>
    <tr>
      <div>
        <td>1111</td>
        <td>22222</td>
      </div>
    </tr>
  </table>
</div>
```
  因此我们可以使用 React.Fragment 来包裹 td的外层，这样在react中渲染的时候就不会有多余的标签，如下代码：
```
// 子组件使用 React.Fragment 包裹
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>1111</td>
        <td>22222</td>
      </React.Fragment>
    )
  }
}
```
  最终被渲染的html代码变成如下：
```
<div id="app">
  <table>
    <tr>
      <td>1111</td>
      <td>22222</td>
    </tr>
  </table>
</div>
```
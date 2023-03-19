
### React-smooth-dnd 实现拖拽排序

  在我们js中，我们可以通过onDrag和onDrop事件来实现拖拽效果，在React中，我们有一个强大的库，react-dnd， 对拖拽相关的能力进行了封装。而我们的 react-smooth-dnd 是对 react-dnd 实现了二次封装。

#### 安装
```
npm i react-smooth-dnd
```
#### API 使用

  该组件包括 Container 和 Draggable 两个， 其中 Draggable 是被拖拽的元素，Container 是这些元素的父容器。属性和方法都在 Container 上设置的。

  一般实例代码如下结构：
```
import React, { Component } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

class SimpleSortableList extends Component {
  render() {
    return (
      <div>
        <Container onDrop={this.props.onDrop}>
          {this.props.items.map(item => {
            return (
              <Draggable key={item.id}>
                {this.props.renderItem(item)}
              </Draggable>
            );
          })}
        </Container>
      </div>
    );
  }
}
```
  常用的属性有如下：
```
1）behaviour, 规定了拖动元素的状态，可选值有四个：move（默认，移动）, copy(复制)， drop-zone(跌落), contain(包含)。
2）orientation, 决定内部的 draggable 的排布方向，是水平还是垂直，horizontal(水平)/vertical(默认，垂直)。
3）groupName, 拖动容器的名称， 当有多个 Container 时，只有相同的 groupName 之间才可以互相拖拽。
4）dropPlaceholder, 拖动元素拖走时或进入其他位置时，用于占位当前元素的配置。可配置值：className: 占位元素的样式，animationDuration： 动画延时。
5）dragBeginDelay: 延时拖动，时间为毫秒，用在防误操作的情况，或者在拖动的元素上有其他事件的情况。拖拽生效延时，以避免点击事件触发拖拽。
6）getChildPayload: 记录当前拖动元素的信息，使用该函数返回一个payload的值，当 onDrop 触发时，会自动带入该函数返回的信息，用于做数据的处理。
7）onDrapEnter: 拖动进入会触发此事件。
8）onDragLeave: 拖动离开触发此事件。
9）getGhostParent: 当多层拖动且容器名称相同时，下层元素向上拖动会出现拖动元素不可见，此时可以设置此函数。
10）onDrop: 放置函数，接收一个事件，里面包含 addedIndex, removedIndex, payload. 这样我们就可以根据这些数据去修改列表的值，实现排序或插入。
11）lockAxis: 限制当前拖动的方向，可选值有 x, y, 表示x，y轴拖动。
12）dragClass: 拖动元素被拖动时的样式。
13）dropClass: 拖动元素被释放时的样式。
```
#### Draggable API

render方法
```
<Draggable render={() => {
  return (
    <li>....</li>
  )
}} />
```
  render 返回一个dom元素。当render存在时会忽略 Draggable 的 children.

#### 实现拖拽排序功能

  拖拽排序是默认设置的，一个 container 自身的 draggable 拖拽即可，无需设置 groupName, 只需要设置 onDrop 即可，通过 addedIndex 和 removedIndex 去修改列表。

  基本代码如下：
```
import React, { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

const list = [
  { label: '第一个数据', fieldName: 'data-a1', children: [] },
  { label: '第二个数据', fieldName: 'data-a2', children: [] },
  { label: '第三个数据', fieldName: 'data-a3', children: [] },
];

function IndexPage() {
  const [data, setData] = useState(list);

  const onDrag = (arr = [], dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) {
      return arr;
    }
    const result = [...arr];
    console.log('---result---', result);
    let itemToAdd = payload;
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
    return result;
  };

  const onDrop = (dropResult) => {
    console.log('---dropResult---', dropResult);
    const { removedIndex, addedIndex } = dropResult;
    if (removedIndex !== null || addedIndex !== null) {
      const list = onDrag(data, dropResult);
      setData(list);
    }
  }

  return (
    <div>
      <Container onDrop={onDrop}>
        {data.map((item) => (
          <Draggable>
            <div>
              {item.label}
            </div>
          </Draggable>
        ))}
      </Container>
    </div>
  );
}

export default IndexPage;
```
  如上代码，其中 Draggable 是被拖拽的元素，Container 是这些元素的父容器。onDrop 是放置函数，比如从第三个元素拖动到第二个元素去，放置的时候会触发onDrop函数，该函数
接收一个对象，对象中有 addedIndex, removedIndex, payload 三个参数，addedIndex 是增加的索引，removedIndex 是删除的索引，比如我们从第三个元素拖动到第二个元素
位置的时候，此时 addedIndex 索引为1，removedIndex 索引为2(因为索引值从0开始的)。思路是：从数组的第二个元素插入第三个被拖动的元素进去，然后删除数组之前的第三个元素。因此 addedIndex, removedIndex 索引被用到。在 onDrop 函数中，const list = onDrag(data, dropResult); 会执行代码， 调用 onDrag函数，该函数内部代码就是
做数组排序的事情，最后返回新的数组，最后通过 setState 执行，重新渲染代码即可。

了解更多， 请看官方的demo <a href="https://kutlugsahin.github.io/smooth-dnd-demo/">https://kutlugsahin.github.io/smooth-dnd-demo/</a>
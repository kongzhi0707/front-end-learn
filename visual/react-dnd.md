### react-dnd 使用介绍

  React-dnd 是一组React高阶组件，它能实现拖拽效果。我们首先需要知道如下几个核心的API。
```
DragSource: 用于包装我们需要拖动的组件，使组件能够被拖曳。
DropTarget: 用于包装接收拖拽元素的组件，使组件能够放置。
DragDropContext: 用于包装拖拽根组件，DragSource 和 DropTarget 都需要包裹在 DragDropContext 内。
DragDropContextProvider 和 DragDropContext 类似，使用 DragDropContextProvider 元素也可以包裹拖拽根组件。
```
基本使用方式大概如下：
```
｜--- src
｜ ｜--- Box.jsx 
｜ ｜--- Dustbin.jsx
｜ ｜--- Container.jsx
```
  src/Box.jsx 
```
import { DragSource } from 'react-dnd';

@DragSource(type, spec, collect)
export default class Box {}
```

  src/Dustbin.jsx
```
import { DropTarget } from 'react-dnd';
@DropTarget(type, spec, collect)
export default class Dustbin {}
```
  src/Container.jsx
```
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Box from './Box';
import Dustbin from './Dustbin';
import React, { Component } from 'react';

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  render() {
    return (
      <div>
        <Box />
        <Dustbin />
      </div>
    )
  }
}

// 我们也可以写成如下代码

import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Box from './Box';
import Dustbin from './Dustbin';
import React, { Component } from 'react';

export default class Container extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <Box />
          <Dustbin />
        </div>
      </DragDropContextProvider>
    )
  }
}
```
  react-dnd-html5-backend 插件的含义是：解决浏览器差异，抽象事件操作为可以处理的state。该库是必须的，类似于React的合成事件。

#### API参数介绍
```
@DragSource(type, spec, collect)
@DropTarget(type, spec, collect)
```
  DragSource 和 DropTarget 分别有三个参数：
```
type: 拖拽类型，必填项。
spec: 拖拽事件的方法对象，必填项。
collect: 把拖拽过程中需要信息注入组件的props，接收两个参数 connect 和 monitor，也是必填项。
```
#### type

  当 DragSource包装的组件的type 和 DropTarget 包装的组件的 type 一致时，才会对拖动源生效(可以拖动元素)。
  type的类型可以是 string/symbol/或其他用一个函数来返回该组件的其他props。
```
比如如下：

// ItemTypes.js 定义的类型
export default {
  BOX: 'box',
}

// Box.jsx
import ItemTypes from './ItemTypes';
@DragSource(ItemTypes.BOX, spec, collect)

// Dustbin.jsx
import ItemTypes from './ItemTypes';
@DropTarget(ItemTypes.BOX, spec, collect)
```
#### spec

  spec 定义特定方法的对象。

#### 1) 在 DragSource 组件中的spec 可以定义 拖动 相关的事件。如下介绍：
```
beginDrag(props, monitor, component): 拖动开始时触发的事件。必须的。返回跟props相关的对象，该方法会返回一个js对象来描述被拖拽的元素，比如返回一个
{id: props.id }, 我们可以通过 monitor.getItem() 方法可以获取到返回的结果。

endDrag(props, monitor, component): 拖动结束时触发的事件，可选。通过 monitor.didProp()可以判断 drag source 是否已经被 drop target 处理完毕。
如果在 drop target 的drop方法中返回了一个对象，可以通过 monitor.getDropResult()获取到返回的结果。

canDrag(props, monitor): 可以指定当前的拖拽操作是否被允许，可选。
isDragging(props, monitor): 拖拽时触发的事件，可选。注意：在该方法里面不能再调用  monitor.isDragging().
```
  使用代码介绍可以理解为如下：
```
// Box.jsx

const sourceSpec = {
  beginDrag(props, monitor, component) {
    // 返回需要注入的属性
    return {
      id: props.id
    }
  },
  endDrag(props, monitor, component) {},
  canDrag(props, monitor) {},
  isDragging(props, monitor) {}
};

import ItemTypes from './ItemTypes';
@DragSource(ItemTypes.BOX, sourceSpec, collect)
```
#### 2) 在DropTarget组件的spec可以定义放置相关的事件
```
drop(props, monitor, component) 组件放下时触发的事件，可选。如果这个方法返回的是一个js对象，在drag source 的 endDrag 方法里面，调用 monitor.getDropResult() 可以获取返回的结果。

hover(props, monitor, component) 组件在DropTarget上方时响应的事件，可选。当item经过 drop targte 的时候被调用。可以通过 monitor.isOver({ shallow: true }) 方法来检查悬停是仅发生在当前目标上还是嵌套上。

canDrop(props, monitor, component) 组件可以被放置时触发的事件，可选。
```
  使用代码介绍可以理解为如下：
```
// Dustbin.jsx
const targetSpec = {
  drop(props, monitor, component) {},
  hover(props, monitor, component) {},
  canDrop(props, monitor, component) {}
};

import ItemTypes from './ItemTypes';
@DropTarget(ItemTypes.BOX, targetSpec, collect)
```
  如上事件中的参数介绍如下：
```
props: 组件当前的props参数。

monitor: 查询当前的拖拽状态。DragSource 组件的monitor参数是 DragSourceMonitor的实列，DropTarget组件的 monitor参数是 DropTargetMonitor的实列。
通过它可以获取当前的拖拽信息，比如可以获取当前被拖拽的项目及其类型，当前和初始坐标和偏移，以及它是否已被删除。

component: 当前组件的实列。使用它可以访问DOM元素来进行位置或大小测量，或调用组件里面定义的方法，或者进行setState操作。

```
#### collect

  1) DragSource 组件 collect 中的 connect 是 DragSourceConnector的实列。它内置了两个方法：dragSource 和 dragPreview()。

  dragSource()返回一个方法，将source组件传入这个方法，可以将 source DOM 和 React DnD backend 链接起来。
  dragPreview()返回一个方法，可以传入节点，作为拖拽预览时的角色。

  使用代码介绍可以理解为如下：
```
// Box.jsx

const sourceSpec = {
  beginDrag(props, monitor, component) {
    // 返回需要注入的属性
    return {
      id: props.id
    }
  },
  endDrag(props, monitor, component) {},
  canDrag(props, monitor) {},
  isDragging(props, monitor) {}
};

import ItemTypes from './ItemTypes';
@DragSource(ItemTypes.BOX, sourceSpec, (connect) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
}))

export default class Box {
  render() {
    const { connectDragSource } = this.props;
    return connectDragSource(
      <div>
        {
          /* ... */
        }
      </div>
    )
  }
}
```
  2) DropTarget 组件collect 中 connect中 是 DropTargetConnector的实列，内置的方法是 dropTarget(), 返回可以将 DropTarget 和 React DnD backend 链接起来的方法。

使用代码介绍可以理解为如下：
```
// Dustbin.jsx
const targetSpec = {
  drop(props, monitor, component) {},
  hover(props, monitor, component) {},
  canDrop(props, monitor, component) {}
};

import ItemTypes from './ItemTypes';
@DropTarget(ItemTypes.BOX, targetSpec, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}));

export default class Dustbin {
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
       {
         /* */
       }
      </div>
    )
  }
}
```
#### monitor

  monitor 用于查询当前的拖拽状态。其对应实列内置了很多方法：
```
// DragSourceMonitor
monitor.canDrag()        // 是否能被拖拽
monitor.isDragging()      // 是否正在拖拽
monitor.getItemType()     // 拖拽组件type
monitor.getItem()         // 当前拖拽的item
monitor.getDropResult()   // 查询drop结果
monitor.didDrop()         // source是否已经drop在target
monitor.getInitialClientOffset()   // 拖拽组件初始拖拽时offset
monitor.getInitialSourceClientOffset()
monitor.getClientOffset() // 拖拽组件当前offset
monitor.getDifferenceFromInitialOffset() // 当前拖拽offset和初始拖拽offset的差别
monitor.getSourceClientOffset()

// DropTargetMonitor
monitor.canDrop()         // 是否可被放置
monitor.isOver(options)   // source是否在target上方
monitor.getItemType()     // 拖拽组件type
monitor.getItem()         // 当前拖拽的item
monitor.getDropResult()   // 查询drop结果
monitor.didDrop()         // source是否已经drop在target
monitor.getInitialClientOffset()   // 拖拽组件初始拖拽时offset
monitor.getInitialSourceClientOffset()
monitor.getClientOffset() // 拖拽组件当前offset
monitor.getDifferenceFromInitialOffset() // 当前拖拽offset和初始拖拽offset的差别
monitor.getSourceClientOffset()
```

#### DragDropContext && DragDropContextProvider

使用 DragSource 和 DropTarget 包裹的组件必须放置在 DragDropContext 或 DragDropContextProvider 组件内部。

基本方法：

import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default function MyReactApp() {
  return (
    <DndProvider backend={Backend}>
      /* your drag-and-drop application */
    </DndProvider>
  )
}

参数：

backend: 必填项。HTML5中 DnD API 兼容性不好，并且不适用于移动端。因此把DnD相关具体DOM事件抽离出去，单独作为了一层，即Backend。



demo 请看这里 <a href="https://github.com/wzb0709/CardSwitch---react-dnd">点击查看拖拽</a>












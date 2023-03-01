
### React中实现拖拽的基本知识点

  在html5中，为标签元素新增了拖拽 draggable 属性，添加这个属性后，我们就可以通过监听元素的拖拽事件就能实现各种拖放功能。
```
<div draggable="true" id="draggableBox"></div>
```
#### 拖拽事件

  拖拽事件有两个步骤：拖起和放下，事件可以分为两类：
```
  1）被拖起的元素所触发的事件，即拖起事件；
  2）拖起放下后，所在区域的目标元素触发的事件，即拖放事件。
```

#### 1）拖起事件

  拖拽元素自身的事件。
```
ondragstart: 当鼠标按下并且开始移动拖拽元素后，触发此事件，整个拖拽周期只触发一次。
ondrag: 拖拽过程中会不断的触发此事件。
ondragend: 鼠标松开结束拖拽后，会触发此事件的执行，整个拖拽周期只会触发一次。
```
代码如下：
```
import React from 'react';

class Parent extends React.Component { 
  componentDidMount() { 
    const draggableBox = document.getElementById("draggableBox");
    draggableBox.ondragstart = function (event) { 
      console.log('---开始拖拽---');
    }
    draggableBox.ondrag = function (event) { 
      console.log('---拖拽中----');
    }
    draggableBox.ondragend = function (event) { 
      console.log('----拖拽结束----');
    }
  }
  render() { 
    return (<div>
      <div draggable="true" id="draggableBox">123444</div>
    </div>)
  }
}

export default Parent;
```
#### 2）拖放事件 (目标元素)

  当拖拽的元素到一个目标元素上时，目标元素会触发以下事件：
```
ondragenter: 拖拽元素移动到目标元素时，触发此事件。
ondragover: 拖拽元素停留在目标元素时，会持续触发此事件。
ondragleave: 拖拽元素离开目标元素时（没有在目标元素上放下），触发此事件。
ondrop: 拖拽元素在目标元素放下（松开鼠标），触发此事件。
```
代码如下：
```
import React from 'react';

class Parent extends React.Component { 
  componentDidMount() { 
    const draggableBox = document.getElementById("draggableBox");
    draggableBox.ondragstart = function (event) { 
      console.log('---开始拖拽---');
    }
    draggableBox.ondrag = function (event) { 
      console.log('---拖拽中----');
    }
    draggableBox.ondragend = function (event) { 
      console.log('----拖拽结束----');
    }

    const target = document.getElementById('draggableTarget');
    target.ondragenter = function (event) { 
      console.log('----进入目标元素----');
    }
    target.ondragover = function (event) { 
      // 目标元素默认是不能够被拖放的，也就是说不会触发ondrop事件，我们需要在该事件中取消默认事件来解决此问题。
      event.preventDefault();
      console.log('---在目标元素中拖拽----');
    }
    target.ondragleave = function (event) { 
      console.log('---拖放离开目标元素----');
    }
    target.ondrop = function (event) { 
      console.log('--在目标元素中拖放----');
    }
  }
  render() { 
    return (<div>
      <div draggable="true" id="draggableBox">123444</div>
      <div id="draggableTarget" style={{"width":"400px", "height":"400px", "border": "1px solid #333" }}>target</div>
    </div>)
  }
}

export default Parent;
```
#### 数据传递

  有时候，我们在拖起元素时，需要携带一些数据，在拖放到目标元素后，将数据交给目标元素做处理，HTML5 拖拽提供了数据交换的方式： event.dataTransfer.
```
import React from 'react';

class Parent extends React.Component { 
  componentDidMount() { 
    const draggableBox = document.getElementById("draggableBox");
    draggableBox.ondragstart = function (event) { 
      console.log('---开始拖拽---');
      event.dataTransfer.setData('value', '数据传递');
    }
    draggableBox.ondrag = function (event) { 
      console.log('---拖拽中----');
    }
    draggableBox.ondragend = function (event) { 
      console.log('----拖拽结束----');
    }

    const target = document.getElementById('draggableTarget');
    target.ondragover = function (event) { 
      // 目标元素默认是不能够被拖放的，也就是说不会触发ondrop事件，我们需要在该事件中取消默认事件来解决此问题。
      event.preventDefault();
      console.log('---在目标元素中拖拽----');
    }
    target.ondrop = function (event) { 
      console.log('--在目标元素中拖放----');
      const value = event.dataTransfer.getData('value');
      console.log('----value---', value);
    }
  }
  render() { 
    return (<div>
      <div draggable="true" id="draggableBox">123444</div>
      <div id="draggableTarget" style={{"width":"400px", "height":"400px", "border": "1px solid #333" }}>target</div>
    </div>)
  }
}

export default Parent;
```
#### 自定义原生拖动图像

  原生默认的拖拽效果是拖拽元素的一个半透明的预览图，有时候我们需要自定义拖拽的预览图来实现我们的需求，html5拖拽也提供了自定义的方式；
  基本语法如下：
```
event.dataTransfer.setDragImage(element, xOffset, yOffset);
```
  代码如下：
```
import React from 'react';

class Parent extends React.Component { 
  componentDidMount() { 
    const draggableBox = document.getElementById("draggableBox");
    draggableBox.ondragstart = function (event) { 
      console.log('---开始拖拽---');
      event.dataTransfer.setDragImage(document.getElementById('customEle'), 0, 0);
    }
    
  }
  render() { 
    return (<div>
      <div draggable="true" id="draggableBox">123444</div>
      <div id="customEle" style={{"width":"400px", "height":"400px", "border": "1px solid #333" }}></div>
    </div>)
  }
}

export default Parent;
```
#### 实现拖拽效果

拖拽流程三步：开始拖拽 -> 拖拽中 -> 结束拖拽。

完整的流程如下：
```
1）设置指定元素为可拖拽元素(使用 draggable属性，只有设置了 draggable 属性，元素才可以被拖动).
2) 点击拖拽元素开始进行拖拽并监听拖拽开始事件 (我们可以设置拖拽相关的数据保存起来)。
3）监听拖拽移动时的事件。
4）监听拖拽元素目标进入目标元素事件。
5）监听拖拽元素在目标元素上移动的事件（处理移动中的一些操作）。
6）在目标元素上松开拖拽元素完成拖拽（处理拖拽完成时的操作）。
```
#### 注意：
```
1） dragover 事件下需要阻止浏览器默认行为让目标元素成为可释放的目标元素。
2）当从操作系统向浏览器中拖拽文件时，不会触发 dragstart 和 dragend 事件。
```
JS 代码如下：
```
import React, { useState, useRef } from 'react';
import './index.less';
const list = [
  { id: '1', text: '序列1' },
  { id: '2', text: '序列2' },
  { id: '3', text: '序列3' },
  { id: '4', text: '序列4' },
  { id: '5', text: '序列5' },
];

export default function DragEvent() { 

  const [leftDragList, setleftDragList] = useState(list);
  const [rightDragList, setrightDragList] = useState([]);
  const dataRef = useRef(null);
  // 定义初始化元素需要的数据
  dataRef.current = {
    left: {
      callback: setleftDragList,
      list: leftDragList
    },
    right: {
      callback: setrightDragList,
      list: rightDragList
    }
  }
  // 拖拽元素在目标元素移动事件-阻止浏览器默认行为让目标元素成为可释放的目标元素
  const handleDragOver = e => e.preventDefault();

  // 拖拽完成事件
  const handleDrop = (callback, arrow) => { 
    return e => { 
      const { dataset: { id }, classList } = e.target;
      classList.remove('over');
      const curData = JSON.parse(e.dataTransfer.getData('itemData'));
      callback(preData => { 
        const mapPreData = JSON.parse(JSON.stringify(preData)).filter(item => item.id !== curData.id);
        if (!id) { 
          return [...mapPreData, curData];
        }
        const index = mapPreData.findIndex(item => item.id === id);
        mapPreData.splice(index, 0, curData);
        return mapPreData;
      })
      if (arrow === 'left') {
        setrightDragList(preData => preData.filter(item => item.id !== curData.id))
      } else { 
        setleftDragList(preData => preData.filter(item => item.id !== curData.id))
      }
    }
  }
  // 拖拽元素进入目标元素时触发的事件 - 为目标元素添加拖拽元素进入时的样式效果
  const handleDragEnter = e => e.target.classList.add('over');

  // 拖拽元素离开目标元素时触发事件 --- 移除目标元素的样式效果
  const handleDragLevel = e => e.target.classList.remove('over');

  // 拖拽开始时触发的事件 --- 通过dataTransfer对象设置所需要的数据
  const handleDragStart = data => e => e.dataTransfer.setData('itemData', JSON.stringify(data));

  return (
    <div className="dragEvent-wrap">
      {
        Object.entries(dataRef.current).map(([key, { callback, list }]) => { 
          return (
            <div
              key={key}
              className="content-wrap"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLevel}
              onDrop={ handleDrop(callback, key)}
            >
              {
                list.map(item => (
                  <div
                    className="item-text"
                    key={item.id}
                    data-id={item.id}
                    draggable
                    onDragStart={ handleDragStart(item)}
                  >{item.text}</div>
                ))
              }
            </div>
          )
        })
      }
    </div>
  )
}
```
css 代码如下：
```
.dragEvent-wrap {
  height: 500px;
  margin-top: 20px;
  display: flex;
}

.content-wrap {
  width: 102px;
  height: 200px;
  border: solid 1px black;
  margin-left: 100px;
}

.item-text {
  background-color: blueviolet;
  width: 100px;
  text-align: center;
  margin-top: 3px;
}

.over {
  border: red solid 2px;
}
```

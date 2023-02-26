
### 手动实践一个可拖放列表

  可拖拽列表上下排序是一个非常常见的需求，主要用到 mouseDown, mouseUp, mouseMove 等事件进行监听。
  我们命名组件叫 SortableList, 该组件需要传递两个参数分别为 lists 和 setLists。

  lists: 列表内容。
  setLists：更新列表内容状态的函数，列表顺序发生变更时会调用并传入新的列表内容。

  初始化代码如下：
```
import React, { useState  } from "react";
import Sortable from "./SortableList";

export default function App() { 
  const [lists, setLists] = useState(() =>
    [1, 2, 3, 4, 5].map((v) => ({
      key: v,
      children: `Item ${v}`
    }))
  );
  return (
    <div className="App">
      <h1>Sortable</h1>
      <Sortable lists={lists} setLists={ setLists }></Sortable>
    </div>
  )
}
```
```
// SortableList.jsx 代码可以编写如下：

import React, { useState, useRef, useEffect } from 'react';

function Item({ children, index, onMove, listsLength }) { 
  const [top, setTop] = useState(0); // 设置top的值 默认为0
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖动，默认为false
  const [zIndex, setZIndex] = useState(0); // 当前的层级index，默认为0

  const ref = useRef(); // dom元素的引用
  
  // 执行一次
  useEffect(() => {
    const el = ref.current; // 当前的dom元素

    // 存储起始位置
    let startY = 0;
    // 开始拖动，拿到最新的 clientY, 然后减去开始的 startY, 最后保存的就是移动后的top距离。
    const mouseMove = (ev) => { 
      ev.preventDefault();

      // 计算最新的top位置
      let latestTop = ev.clientY - startY;
      setTop(latestTop);
    }
    // 鼠标松开时 对事件进行删除操作 及 其他值复原。
    const mouseUp = (ev) => { 
      ev.preventDefault();
      document.removeEventListener('mousemove', mouseMove);
      // 重置Top
      setTop(0);
      // 结束拖拽
      setIsDragging(false);
      setZIndex(0);
    }
    // mousedown 按下鼠标发生的事件，然后进行开始拖拽，记录开始的位置，设置 zIndex, 
    const mouseDown = (ev) => { 
      ev.preventDefault();
      // 注册事件
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp, { once: true });
      // 开始拖拽
      setIsDragging(true);
      setZIndex(999);
      // 记录开始的位置
      startY = ev.clientY;
    }
    el.addEventListener("mousedown", mouseDown);
  }, []);
  return (
    <>
      <div
        ref={ref}
        style={{
          border: "1px solid black",
          padding: "10px",
          background: "white",
          transform: isDragging ? `scale(1.01)` : `scale(1)`,
          top: `${top}px`,
          transition: "transform .2s, box-shadow .2s",
          position: "relative",
          width: "100%",
          boxShadow: isDragging ? "0 0 10px 2px rgba(0,0,0,0.5)" : "0 0 0 0 rgba(0,0,0,0.5)",
          zIndex: zIndex.toString(),
        }}
      >{ children }</div>
    </>
  )
}

export default function Sortable({ lists, setLists }) { 
  console.log('---lists---',lists)
  return (
    <div>
      {
        lists && lists.length && lists.map((child, index) => { 
          return <Item
            key={child.key}
            // 元素索引
            index={index}
            // 列表长度
            listsLength={lists.length}
            // 更新列表
            onMove={(prevIndex, nextIndex) => {
              const newList = [...lists];
              // 将对应的元素插入到列表中新的位置
              newList.splice(nextIndex, 0, newList.splice(prevIndex, 1)[0]);
              // 更新列表状态
              setLists(newList);
            }}
          >
            { child.children }
          </Item>
        })
      }
    </div>
  )
}
```
  如上代码， 我们首先实现的是能让列表元素可以上下拖动，因此我们需要监听 mousedown，mousemove，mouseup等事件。
  mousedown 当鼠标指针移动到元素上方,并按下鼠标按键(左、右键均可)时,会发生mousedown事件.
  mousemove 是指鼠标移动发生的事件。
  mouseup: 当鼠标指针移动到元素上方，并松开鼠标左键时，会发生 mouseup 事件

  因此如上代码，当我们鼠标按下后开始拖动，鼠标移动时计算移动的差值并计算元素的top值。现在我们的列表元素可以上下拖动了，但是拖动后松开鼠标会瞬间回到原来的位置。

#### 拖动修改元素的位置

  现在我们需要通过计算，在达到元素交换条件时交换对应的元素。主要在mousemove监听器回调中实现。

  代码如下：
```
import React, { useState, useRef, useEffect } from 'react';

function Item({ children, index, onMove, listsLength }) { 
  const [top, setTop] = useState(0); // 设置top的值 默认为0
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖动，默认为false
  const [zIndex, setZIndex] = useState(0); // 当前的层级index，默认为0

  const ref = useRef(); // dom元素的引用
  const prevRectRef = useRef(null);
  const indexRef = useRef(index);
  const onMoveRef = useRef(onMove);
  const listLengthRef = useRef(listsLength);
  const animationRef = useRef(null);
  
  useEffect(() => {
    // 始终保持最新状态Ref引用
    indexRef.current = index;
    onMoveRef.current = onMove;
    listLengthRef.current = listsLength;
  }, [index, onMove, listsLength]);

  // 执行一次
  useEffect(() => {
    const el = ref.current; // 当前的dom元素

    // 存储起始位置
    let startY = 0;

    let delayedSetZIndexTimeoutId;

    // 拖动
    const mouseMove = (ev) => { 
      ev.preventDefault();

      // 获取元素 Rect 并更新 Ref
      const rect = el.getBoundingClientRect();
      prevRectRef.current = rect;

      // 计算最新的top位置
      let latestTop = ev.clientY - startY;
      // 检查是否需要更新元素位置
      if (latestTop > rect.height && indexRef.current < listLengthRef.current - 1) {
        // move down 通知父组件修改列表
        onMoveRef.current(indexRef.current, indexRef.current + 1);
        // 因为DOM位置被改变了，需要同步计算最新位置
        // 可以理解为计算出来的值就是元素发生交换后，松开速表再按住鼠标时相关变量的值
        latestTop -= rect.height;
        // 开始位置也要更新
        startY += rect.height;
      } else if (latestTop < -rect.height && indexRef.current > 0) { 
        // move up
        onMoveRef.current(indexRef.current, indexRef.current - 1);
        latestTop += rect.height;
        startY -= rect.height;
      }
      setTop(latestTop);
    }
    // 松开
    const mouseUp = (ev) => {
      ev.preventDefault();
      document.removeEventListener('mousemove', mouseMove);
      // 重置Top
      setTop(0);
      // 结束拖拽
      setIsDragging(false);
      delayedSetZIndexTimeoutId = setTimeout(() => {
        // 延迟设置zIndex, 否则一结束拖拽元素就会被盖到其他元素下面
        setZIndex(0);
      }, 200)
    };
    const mouseDown = (ev) => { 
      ev.preventDefault();
      clearTimeout(delayedSetZIndexTimeoutId);
      // 注册事件
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp, { once: true });
      // 开始拖拽
      setIsDragging(true);
      setZIndex(999);
      // 记录开始的位置
      startY = ev.clientY;
    }
    el.addEventListener("mousedown", mouseDown);
  }, []);
  
  return (
    <>
      <div
        ref={ref}
        style={{
          border: "1px solid black",
          padding: "10px",
          background: "white",
          transform: isDragging ? `scale(1.01)` : `scale(1)`,
          top: `${top}px`,
          transition: "transform .2s, box-shadow .2s",
          position: "relative",
          width: "100%",
          boxShadow: isDragging ? "0 0 10px 2px rgba(0,0,0,0.5)" : "0 0 0 0 rgba(0,0,0,0.5)",
          zIndex: zIndex.toString(),
        }}
      >{ children }</div>
    </>
  )
}

export default function Sortable({ lists, setLists }) { 
  console.log('---lists---',lists)
  return (
    <div>
      {
        lists && lists.length && lists.map((child, index) => { 
          return <Item
            key={child.key}
            // 元素索引
            index={index}
            // 列表长度
            listsLength={lists.length}
            // 更新列表
            onMove={(prevIndex, nextIndex) => {
              const newList = [...lists];
              // 将对应的元素插入到列表中新的位置
              newList.splice(nextIndex, 0, newList.splice(prevIndex, 1)[0]);
              // 更新列表状态
              setLists(newList);
            }}
          >
            { child.children }
          </Item>
        })
      }
    </div>
  )
}
```
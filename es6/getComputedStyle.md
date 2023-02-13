
### getComputedStyle的用法

  getComputedStyle() 这个方法来获取元素当前的样式。该方法是window的方法，我们可以直接使用。该方法需要两个参数：
```
1）第一个：要获取样式的元素。
2）第二个：可以传递一个伪元素，一般都传递null。
```
语法基本结构：
```
window.getComputedStyle(element, [pseudoEit]);
```
参数解析：
```
1）element: 必须，要获取样式值的元素对象。
2）pseudoEit：可选，表示指定节点的伪元素（:before, :after, :first-line, :first-letter等）。
```
浏览器支持：
```
1）IE9+ 浏览器支持此方法。
2）edge 浏览器支持此方法。
3）谷歌浏览器支持此方法。
4）opera浏览器支持此方法。
5）火狐浏览器支持此方法。
6）safria浏览器支持此方法。
```
在实际项目中，我们可能要获取元素的css样式属性值，我们经常会使用style来获取元素的样式值。如下代码：
```
import React from "react";

export default class Home extends React.Component { 
  constructor(props) { 
    super(props)
  }
  componentDidMount() { 
    const first = document.getElementById("first");
    const second = document.getElementById("second");
    console.log('--first---', first.style.backgroundColor); // 打印 为空
    console.log('---second---', second.style.backgroundColor); // 打印：blue
  }
  render() { 
    return (<div>
      <div id="first"></div>
      <div id="second" style={{backgroundColor: 'blue'}}></div>
    </div>)
  }
}
```
  如上代码，第一个元素没有设置样式，然后我们获取该样式，没有获取到，第二个元素能获取到样式了。但是我们可以使用 getComputedStyle方法就可以获取到指定元素对应的css属性的最终计算值。代码如下：
```
import React from "react";

export default class Home extends React.Component { 
  constructor(props) { 
    super(props)
  }
  componentDidMount() { 
    const first = document.getElementById("first");
    const second = document.getElementById("second");
    console.log('--first---', window.getComputedStyle(first, null).backgroundColor); // 打印 --first--- rgba(0, 0, 0, 0)
    console.log('---second---', window.getComputedStyle(second, null).backgroundColor); // 打印：---second--- rgb(0, 0, 255)
  }
  render() { 
    return (<div>
      <div id="first"></div>
      <div id="second" style={{backgroundColor: 'blue'}}></div>
    </div>)
  }
}
```
#### 获取伪元素的样式

  下面我们来演示下获取伪元素的样式，基本代码如下：

  index.less 代码如下：
```
#first{background-color:red}
#first::before{
  content:"添加的内容";
  color:#0000ff;
}
```
react代码如下：
```
import React from "react";
import './index.less';

export default class Home extends React.Component { 
  constructor(props) { 
    super(props)
  }
  componentDidMount() { 
    const first = document.getElementById("first");
    console.log('--first---', window.getComputedStyle(first, null).backgroundColor); // 打印 --first--- rgb(255, 0, 0)
    console.log("---获取first的伪元素的样式----", window.getComputedStyle(first, ":before").color); // ---获取first的伪元素的样式---- rgb(0, 0, 255)
  }
  render() { 
    return (<div>
      <div id="first"></div>
    </div>)
  }
}
```



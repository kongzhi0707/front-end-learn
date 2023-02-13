
### JS 修改 CSS 变量
```
1) 获取css变量的值 getPropertyValue.
2) 设置css变量的值 setProperty
```
  index.less 代码如下：
```
// 定义颜色变量
:root {
  --money-color: red;
}

.price{
  color: var(--money-color);
}
```
  react 代码如下：
```
import React from "react";
import './index.less';

export default class Home extends React.Component { 
  constructor(props) { 
    super(props)
  }
  componentDidMount() { 
    const root = document.querySelector(":root");
    // 获取 :root 上 --money-color 变量的值
    const color = getComputedStyle(root).getPropertyValue('--money-color').trim();
    // 设置 :root 上 --money-color 变量的值
    root.style.setProperty('--money-color', color === 'red' ? 'blue' : 'red');
  }
  render() { 
    return (<div>
      <span className="price">100</span>
    </div>)
  }
}
```
  在页面显示字体会变为蓝色。
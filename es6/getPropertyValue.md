
### css声明变量:root伪类及getPropertyValue方法

  :root 选择器用匹配文档的根元素，在HTML中根元素始终是html元素，但是 :root 的权重高于 html。
  声明css变量，一般声明在 :root 根元素上，这样文档全局都可以获取到。
  声明的变量以 --开头的，比如 --text-color. 
  在其他css样式中引用变量可以使用 var(--text-color)

  相同的css变量，子级会覆盖 :root 级，换句话说，当某个元素获取css变量时，会找最近的声明变量的元素。

  index.less 代码如下：
```
:root {
  // 在页面中html中会显示此属性
  background-color: #00c9db;
  // 声明css变量，一般声明在:root跟元素上，这样文档全局都可以取到
  --text-color: orange;
  --font-size: 50px;
}

* {
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
html {
  // :root 权重高，此html的背景色会被:root 的属性覆盖
  background-color: #0f6674;
}

.box {
  // 相同的css变量，子级会覆盖:root级，也就是说，当某个元素取css变量时，会找最近的声明变量的元素
  --font-size: 30px;
  height: 400px;
  width: 700px;
  background-color: red; // 显示的背景颜色是红色
  margin: 30px auto;
}
.box > div {
  font-size: var(--font-size); // 显示的是30px
  color: var(--text-color); // 显示的颜色是 orange;
}
.box1 {
  font-size: var(--font-size); // 显示的50px
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
    
  }
  render() { 
    return (<div>
      <div class="box">
        box
        <div>
          inner
        </div>
      </div>
      <div class="box1">
        box1
      </div>
    </div>)
  }
}
```
#### 获取元素的css属性值方法如下：
```
getPropertyValue: 获取元素的某个css属性值。
setProperty: 设置元素的css属性值。
removeProperty: 删除元素的css属性值。
```
比如：
```
document.documentElement.style.getPropertyValue('font-size') //获取字体大小js
document.documentElement.style.getPropertyValue('--font-size') //也可以是css变量
// 这种方式只能获得内联样式，如果无内联样式则获取到的值为空，与document.documentElement.style.fontSize相同，都是只能获取内联样式属性值

getComputedStyle(node) // 此方法获取元素的所有样式表，是一个大对象

// 如果getPropertyValue方法用在此处则可以获取到元素的真实样式
//（即哪个样式的权重高，生效的样式，获取的就是那个值）
getComputedStyle(document.documentElement).getPropertyValue()
```
#### 总结 
```
1.document.querySelector(':root') === document.documentElement
2.优先级： js设置值>内联样式>:root选择器>html选择器
3.document.documentElement.style.getPropertyValue 只能获取内联样式的值
4.getComputedStyle(document.documentElement).getPropertyValue 获取到的始终是实际的值
```
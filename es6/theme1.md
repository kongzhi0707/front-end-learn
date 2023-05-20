
### 前端主题切换方案

什么是主题？简单的来说，就是应用的UI风格，比如最常见的亮色 Light Mode 和 暗色 Dark Mode 主题，为了用户的阅读体验，如果背景是白色，文字就要深色；反之如果背景是深色，文字就要浅色。

#### 1）方案1: link标签动态引入

思路：提前准备好几套css主题样式文件，在需要的时候，创建link标签动态加载到head标签中，或是动态改变link标签的href属性。

#### 优点：

实现了按需加载，提高了首屏加载时的性能。

#### 缺点：

1）动态加载样式文件，如果文件过大网络情况不佳的情况下可能会有加载延迟，导致样式切换不流畅。
2）如果主题样式表内定义的顺序不对，会有优先级的问题。
3）各个主题样式是写死的，后续针对某一主题样式修改或者新增主题很麻烦。

#### 2）方案2: 提前引入所有主题样式，做类名切换

该方案和上面的方案类似，为了解决反复加载样式文件问题提前将样式全部引入，在需要切换主题的时候将指定的根元素的类名更换，也就是说进行了样式覆盖。
基本的方法如下：
```
/* light 样式主题 */
body.light .box {
  color: #f90;
  background: #fff;
}

/* dark样式主题 */
body.dary .box {
  color: #eee;
  background: #333;
}

<div class="box">
  <p>hello</p>
</div>
<div>
  选择样式：
  <button onclick="change('light')">light</button>
  <button onclick="change('dark')">dark</button>
</div>

function change(theme) {
  document.body.className = theme;
}
```
优点：

不用重新加载样式文件，在样式切换时不会有卡顿。

缺点：
```
1）首屏加载时会牺牲一些时间加载样式资源。
2）如果主题样式表内定义顺序不对，那么样式会有优先级问题。
3）各个主题样式是写死的，后续针对某一主题样式表修改或新增主题也比较麻烦。
```
#### 3）方案三：CSS变量 + 类名切换

思路：和方案2类似的，依然是提前将样式文件载入，切换时将指定的根元素类名更换，不过这里相对灵活的时，默认在根作用域下定义好css变量，只需要在不同的主题下更改css变量对应的取值即可。

实现方案如下：
```
/* 定义根作用域下的变量 */

:root {
  --theme-color: #333;
  --theme-background: #eee;
}

/* 更改dark类名下变量的取值 */

.dark {
  --theme-color: #eee;
  --theme-background: #333;
}

/* 更改pink类名下变量的取值 */
.pink {
  --theme-color: #fff;
  --theme-background: pink;
}

.box {
  // 使用变量
  color: var(--theme-color);
  background: var(--theme-background);
}

<div class="box">
  <p>hello</p>
</div>
<div>
  选择样式：
  <button onclick="change('default')">default</button>
  <button onclick="change('pink')">pink</button>
  <button onclick="change('dark')">dark</button>
</div>

function change(theme) {
  document.body.className = theme;
}
```
优点：
```
1）不用重新加载样式文件，在样式切换时不会有卡顿。
2）在需要切换主题的地方利用var()绑定的变量即可，不存在优先级的问题。
3）新增或修改主题方便灵活，仅需新增或修改css变量即可，在var()绑定的样式变量的地方就会自动更换。
```
缺点：

首屏加载时会牺牲一些时间加载样式资源。

#### 4）方案四： css变量 + 动态 setProperty

该方案适用于由用户根据颜色面板自行设定各种颜色主题。这种是主题颜色不确定的情况，我们上面几种方案更适用于定义预设的几种主题。

实现思路：只需在全局中设置好预设的全局css变量样式，无需单独为每一个主题类名下重新设定css变量值。

代码如下：
```
:root {
  --theme-color: #333;
  --theme-background: #eee;
}
```
我们可以定义一个工具类方法，用于修改指定的css变量值。代码如下：
```
export const setCssVar = (prop: string, val: any, dom=document.documentElement) => {
  dom.style.setProperty(prop, val);
}
```
在样式要发生改变时可以调用如下方法即可：
```
setCssVar('--theme-color', '#fff');
```
优点：

1）不用重新加载样式文件，在样式切换时不会有卡顿。
2）需要切换主题的地方只用在 :root 上动态更改css变量值即可。不存在优先级问题。
3）新增或修改主题方便灵活。

缺点：

首屏加载时会牺牲一些时间加载样式资源。




### HTML5元素拖拽drag与拖放drop

  一：元素拖拽

  在HTML5中，浏览器默认可以允许 拖拽图像, 文本 及 链接。 但是如果其他标签元素也想实现拖动的话，只需要在元素标签上添加一个属性 draggable="true" 即可，比如如下div元素设置了 draggable="true" 即可实现拖动。

  拖放API除了提供基本的拖放功能接口外，还可以在拖放之外提供选择，用来自定义行为，比如：可以修改拖放元素的css样式，或者我们不移动元素，拖动的时候，复制一个副本，拖放结束后，我们就会多了一个同样的元素。
```
<div draggable="true" id="container">元素可以被拖动</div>
```
#### 注意：IE9以下浏览器可以使用mousedown, mousemove, mouseup 做兼容，但是IE9以下的浏览器这里不考虑。

#### 拖拽事件

  拖拽事件分为两类，一类是：被拖拽元素触发的事件，另一类是：拖放到目标元素中触发的事件。

  1.1) 拖拽元素会依次触发 dragstart, drag, 和 dragend 这3个事件。

  dragstart: 当鼠标点中元素并且开始移动时，就会触发 dragstart 事件。类似于mousedown事件。
  drag: 拖拽元素的过程中会持续不断的触发drag事件，类似于mousemove事件。
  dragend: 松开鼠标取消拖拽时就会触发dragend事件，类似于 mouseup事件。
```
<div draggable="true" id="container">元素可以被拖动</div>

const container = document.getElementById('container');
container.ondragstart = function(event) {
  const e = event || window.event;
  console.log('开始拖拽元素');
}
container.ondrag = function () {
  console.log('拖拽中');
}
container.ondragend = function() {
  console.log('拖拽结束');
}
```
  如上代码，我们运行了就可以看到打印的信息了。

#### 1.2) 拖拽元素到目标元素中

  当拖拽的元素到一个目标元素上时，目标元素会触发如下事件：

  dragenter: 拖拽元素到目标上，就会触发dragenter事件，类似于 mouseover事件。
  dragover:  当拖动元素在目标元素范围内移动时，就会持续触发 dragover事件。
  dragleave: 如果元素被拖出了目标元素时，就会触发 dragleave事件，类似于mouseout事件。
  drop: 如果元素被放到了目标元素中，就会触发drop事件。

  基本代码如下：
```
<div draggable="true" id="container" style= "width: 100px; height: 30px; background: blue;">被拖动元素</div>
<div draggable="true" id="target" style="width: 200px; height: 200px; background: red;">拖放目标</div>

const container = document.getElementById('container');
const target = document.getElementById('target');
container.ondragstart = function(event) {
  const e = event || window.event;
  console.log('开始拖拽元素');
}
container.ondrag = function () {
  console.log('拖拽中');
}
container.ondragend = function() {
  console.log('拖拽结束');
}

target.ondragenter = function() {
  console.log('有元素进入目标区域');
}
target.ondragover = function(event) {
  var event = event || window.event;
  console.log('元素已进入了');
  // 元素默认不会执行 ondrop 事件，只有取消默认事件才会执行
  event.preventDefault();
}
target.ondragleave = function() {
  console.log('元素已经离开目标区域');
}
target.ondrop = function() {
  console.log('元素已经落在目标区域');
}
```
  如上代码执行下就可以知道基本原理了。

#### 注意：元素默认是不能落在目标区域的，也就是说默认不会监听到 "ondrop" 事件的，只有我们在目标元素上的 ondragover 事件中阻止默认事件才行。

#### 理解dataTransfer对象

  为了在拖放操作时实现数据交换，引入了 dataTransfer对象，它是事件对象的一个属性，用于从被拖动元素向放置目标传递字符串格式的数据。
dataTransfer对象的两个核心方法是 setData() 和 getData(). setData()用于设置数据，getData()用于接收数据。

  如下代码：
```
<div draggable="true" id="container" style= "width: 100px; height: 30px; background: blue;">被拖动元素</div>
<div id="target" style="width: 200px; height: 200px; background: red;">拖放目标</div>

const container = document.getElementById('container');
const target = document.getElementById('target');

container.ondragstart = function(event) {
  const e = event || window.event;
  console.log('开始拖拽元素');
  // 设置数据
  e.dataTransfer.setData('text', e.target.id);
}
target.ondragover = function(event) {
  var event = event || window.event;
  console.log('元素已进入了');
  // 元素默认不会执行 ondrop 事件，只有取消默认事件才会执行
  event.preventDefault();
}
target.ondragleave = function() {
  console.log('元素已经离开目标区域');
}
target.ondrop = function(event) {
  console.log('元素已经落在目标区域');
  var e = event || window.event;
  var data = e.dataTransfer.getData('text');
  e.target.appendChild(document.getElementById(data));
}
```
  页面初始化是如下这个样子：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/58.jpg" /> <br />

  当我们对元素进行拖动的时候，并且把元素放置到目标div上时，结果变成如下这个样子：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/59.jpg" /> <br />

#### 拖拽设置

  利用dataTransfer对象，不仅可以传输数据，还能通过它来确定被拖动的元素及作为放置目标的元素能够接收什么操作。因此 dataTransfer对象提供了两个属性，
dropEffect 和 effectAllowed。

  dropEffect: 该属性值为字符串，表示被拖动元素可以执行哪一种放置行为，要使用这个属性，必须在 dragenter 事件处理函数中设置。它有如下属性值：
```
none：不能把元素拖放至此 (除文本框外全部元素的默认值)。
move：移动到目标
copy：复制到目标
link：目标打开拖动元素（拖动元素必须是链接并有url）。
```
  effectAllowed: 该属性值也是字符串，表示允许拖动元素那种dropEffect，dropEffect属性只有搭配effectAllowed属性才能使用。

  effectAllowed属性可能的值如下：
```
"uninitialized": 没有给被拖动的元素设置任何放置行为。
"none": 被拖动的元素不能有任何行为。
"copy": 只允许值为 "copy" 的dropEffect。
"link": 只允许值为 "link" 的dropEffect。
"move": 只允许值为 "move" 的dropEffect。
"copyLink": 允许值为"copy"和"link"的dropEffect
"copyMove": 允许值为"copy"和"move"的dropEffect
"linkMove": 允许值为"link"和"move"的dropEffect
"all": 允许任意dropEffect
```
#### 注意 必须在ondragstart事件处理程序中设置effectAllowed属性

  基本的demo代码如下：
```
<div id="dragme" draggable="true" style ="width:200px;border:1px solid;border-color:gray">请拖放</div>
<div id="text" style="width:200px;height:200px;border:1px solid;border-color:gray"></div>
<script>
  var source = document.getElementById("dragme");
  var dest = document.getElementById("text");
  source.addEventListener("dragstart", function (e) {
    var dt = e.dataTransfer;
    dt.effectAllowed = 'copy';
    dt.setData("text/plain", "你好");
  }, false);
  dest.addEventListener("dragover", function (e) {
    e.preventDefault();
  }, false);
  dest.addEventListener("drop", function (e) {
    var dt = e.dataTransfer;
    var text = dt.getData("text/plain");
    dt.dropEffect = 'copy';
    dest.textContent += text;
    e.preventDefault();
    e.stopPropagation;
  }, false);
</script>
```
  当我们拖动源目标到目标元素时候，会把 你好 这样到文本 复制进去。

详细文档，请看官方文档（https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API#Examples_and_demos）





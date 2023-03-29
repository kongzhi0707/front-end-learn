
### 理解css中的 flex-grow/flex-shrink/flex-basis

在使用flex布局的时候，我们会使用到 flex-grow, flex-shrink, flex-basis 几个属性，下面我们分别来介绍这几个属性的作用。

#### 1) flex-basis

flex-basis 用于设置子项的占用空间。如果设置了值，则子项占用的空间为设置的值，如果没有设置或者为auto，那子项的空间为 width/height 的值。

代码如下：
```
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>

.container {
  display: flex;
  width: 400px;
  height: 50px;
  background-color: #eee;
}
.item {
  height: 50px;
}

.item:nth-child(1) {
  background: red;
}
.item:nth-child(2) {
  width: 70px;
  flex-basis: auto;
  background: grey;
}

.item:nth-child(3) {
  width: 50px;
  flex-basis: 100px;
  background: yellow;
}
```
  对于第一个子项，flex-basis 如果设置默认是 auto，子项占用的宽度就使用 width 的宽度，如果 width 也没有设置的话或为auto的话，子项占用空间由内容决定的。
  对于第二个子项，flex-basis 为 auto，子项占用宽度使用 width 的宽度，width 为 70px, 所以第二个子项占用的空间为 70px;
  对于第三个子项，flex-basis 为100px，覆盖 width 的宽度，因此第三个子项的占用空间为 100px;

#### 2) flex-grow

用来 "瓜分" 父容器的 "剩余空间"。

HTML 代码如下：
```
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```
CSS 代码如下：
```
.container {
  display: flex;
  width: 400px;
  height: 50px;
  background-color: #eee;
}
.item {
  height: 50px;
}

.item:nth-child(1) {
  width: 50px;
  background: red;
}
.item:nth-child(2) {
  width: 70px;
  flex-basis: auto;
  flex-grow: 2;
  background: grey;
}

.item:nth-child(3) {
  width: 50px;
  flex-basis: 100px;
  flex-grow: 1;
  background: yellow;
}
```
如上，容器的宽度为400px，第一个子项占用的宽度为50px，第二个子项占用的宽度是70px; 第三个子项占用的空间是100px，因此 剩余空间 = 400 - 50 -70 - 100 = 180px; 其中第一个子项的 flex-grow: 0; 第二个子项 flex-grow: 2; 第三个子项的 flex-grow 等于1；因此剩余空间的宽度分成了3份。第二个子项占 2/3，也就是
120px；第三个子项占用 1/3, 也就是60px，所以子项1的宽度为 50px；第二个子项的占用空间是 70 + 120 = 190px, 第三个子项占用的空间是 100 + 60 = 160px;

如下图可以看的到：

第二个子项的宽度请看如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/css1.png" /> <br />

第三个子项的宽度请看如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/css2.png" /> <br />

#### 3）flex-shrink

用来 "吸收" 超出的空间

HTML 代码如下：
```
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```
CSS 代码如下：
```
.container {
  display: flex;
  width: 400px;
  height: 50px;
  background-color: #eee;
}
.item {
  height: 50px;
}

.item:nth-child(1) {
  width: 250px;
  background: red;
}
.item:nth-child(2) {
  width: 150px;
  flex-basis: auto;
  flex-shrink: 2;
  background: grey;
}

.item:nth-child(3) {
  width: 50px;
  flex-basis: 100px;
  flex-shrink: 2;
  background: yellow;
}
```
容器的宽度为 400px; 第一个子项占用的基准空间为 250px; 第二个子项占用的基准空间为 150px; 第三个子项占用的宽度为 100px; 总宽度为 250 + 150 + 100 = 500px; 容器放不下，多出来的空间需要被每个子项根据自己设置的 flex-shrink 进行吸收，第一个子项的 flex-shrink: 1(未设置默认为1)，第二个子项 flex-shrink： 2；第三个子项 flex-shrink = 2；因此第一个子项需要被吸收的空间是 250 * 1 / (250*1+150*2+100*2) * 100 = 33.33px; 因此第一个子项占用的宽度为 250 - 33.33 = 216.67px; 同理第二个子项占用的空间为 (150*2) / (250*1+150*2+100*2) * 100 = 40px; 因此第二个子项占用的空间为 150 - 40 = 110px; 第三个子项吸收的空间为 100 * 2 / (250*1+150*2+100*2) * 100 = 26.67px; 因此第三个子项占用的空间为 100 - 26.67 = 73.33px.

如下图所示：

第一个子项占用的宽度为：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/css3.png" /> <br />

第二个子项占用的宽度为：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/css4.png" /> <br />

第三个子项占用的宽度为：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/css5.png" /> <br />
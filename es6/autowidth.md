
### 使用 Flexbox 布局可以轻松实现换行自适应宽度

实现步骤如下：
```
1）为父元素设置 display: flex 属性，使其成为 Flex 容器。
2）设置 flex-wrap: wrap 属性，以允许子元素在必要时换行。
3）设置父元素的 flex-direction 属性为 row，以确保子元素在同一行并沿着水平方向排列。
4）为子元素设置 flex-basis 属性，以控制它们的宽度。
```
HTML 代码如下：
```
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
  <div class="item">Item 4</div>
  <div class="item">Item 5</div>
</div>
```
css 代码如下：
```
.container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.item {
  flex-basis: 20%;
}
```
在此示例中，子元素的宽度设置为父元素宽度的 20%，当父元素宽度不足以容纳所有子元素时，它们将自动换行。当然我们也可以不设置 子元素的宽度， 让其自适应即可。


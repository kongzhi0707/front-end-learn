
### css实现箭头

#### 1) css实现实心箭头

html 代码结构如下：
```
<div className="box">
  <p>向上箭头</p>
  <div className="top"></div>
  <p>向左箭头</p>
  <div className="left"></div>
  <p>向右箭头</p>
  <div className="right"></div>
  <p>向下箭头</p>
  <div className="bottom"></div>
</div>
```
css 代码如下：
```
.box {
  width: 400px;
  height: 100px;
  margin: 50px auto;
}

.top {
  width: 0;
  height: 0;
  border-bottom: 30px solid #f0f;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
}

.bottom {
  width: 0;
  height: 0;
  border-top: 30px solid #f0f;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
}

.left {
  width: 0;
  height: 0;
  border-right: 30px solid #f0f;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
}

.right {
  width: 0;
  height: 0;
  border-left: 30px solid #f0f;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
}
```
实现效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/arrow1.png" /> <br />

#### 2) css实现空心箭头

HTML 结构如下：
```
<div className="box">
  <p>向上箭头</p>
  <div className="top"></div>
  <p>向左箭头</p>
  <div className="left"></div>
  <p>向右箭头</p>
  <div className="right"></div>
  <p>向下箭头</p>
  <div className="bottom"></div>
</div>
```
CSS代码如下：
```
.box {
  width: 400px;
  height: 100px;
  margin: 50px auto;
}

.top {
  position: relative;
  width: 0;
  height: 0;
  border: 30px solid transparent;
  border-bottom-color: red;
}
.top:after {
  position: absolute;
  content: '';
  display: block;
  top: -29px;
  margin-left: -30px;
  border: 30px solid transparent;
  border-bottom-color: white;
}

.bottom {
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-top-color: red;
  border-width: 30px;
  position: relative;
}
.bottom:after {
  position: absolute;
  content: '';
  display: block;
  top: -31px;
  margin-left: -30px;
  border-color: transparent;
  border-style: solid;
  border-top-color: white;
  border-width: 30px;
}

.left {
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-right-color: red;
  border-width: 30px;
  position: relative;
  margin-left: -30px;
}
.left:after {
  position: absolute;
  content: '';
  display: block;
  top: -30px;
  margin-left: -29px;
  border-color: transparent;
  border-style: solid;
  border-right-color: white;
  border-width: 30px;
}


.right {
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-left-color: red;
  border-width: 30px;
  position: relative;
}
.right:after {
  position: absolute;
  content: '';
  display: block;
  top: -30px;
  margin-left: -31px;
  border-color: transparent;
  border-style: solid;
  border-left-color: white;
  border-width: 30px;
}
```
实现效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/arrow2.png" /> <br />


### css in JS 模块化方案

#### 1）概念

css-in-js 是一种技术，它是将应用的css样式写到javascript文件里面，而不是独立的一些css，scss或less这类的文件。因此我们可以在css中使用一些属于js的如模块声明，变量定义，函数调用和条件判断等语言特性提供灵活的可扩展的样式定义。

优势：
```
1）支持一些js的特性 (继承/变量/函数)。
2）支持框架的特性 (传值特性)。
```
它和传统的css有哪些区别？css尚不具备现代前端组件化开发所需要的部分领域和知识能力。因此我们需要css in js 来弥足这些知识点，主要包括如下几种：
```
1）组件样式的作用域需要控制在组件级别。
2）组件样式与组件需要在源码和构建层面建立更强的关联；
3）组件样式需要响应组件数据的变化。
4）组件样式需要有以组件为单位的复用和扩展能力。
```
#### 2）styled-components

styled-components 是 css-in-js 最热门的一个库，通过 styled-components，我们可以使用 ES6 的标签模板字符串语法，为 styled的component定义一系列css属性。当该组件的js代码被解析执行的时候，styled-components 会动态生成一个css选择器, 并把对应的css样式通过style标签的形式插入到head标签里面。动态生成的
css选择器会有一小段的哈希值来保证全局唯一性来避免样式发生冲突。
```
1）通过ES6里面的模版字符串形式写css样式.
2) 每个样式选择器都会在编译之后自动被添加一个hash值(全局唯一性)。
```
#### 2.1）安装 

使用styled-components前需要安装，安装命令如下：
```
npm i -S styled-components
```
#### 2.2) 基本使用

1）内部文件写法 (给页面文字添加样式)
```
import React, { Component } from 'react';

// 导入样式组件
import styled from 'styled-components';

class App extends Component { 
  render() { 
    return (<div>
      <Ha>内部文件写法</Ha>
    </div>)
  }
}

const Ha = styled.div`
  font-size: 30px;
  color: red;
`

export default App;
```
实现效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/9.png" /> <br />

2）外部文件写法（给页面文字添加样式）
```
// App.js 文件代码如下：

import React, { Component } from 'react';

// 导入样式文件
import { BigText } from './style';

class App extends Component { 
  render() { 
    return (<div>
      <BigText>外部文件写法</BigText>
    </div>)
  }
}

export default App;

// style.js 文件代码如下：

import styled from 'styled-components';

// const 标签名 (首字母大写) = styled.HTML标签名`css样式`

export const BigText = styled.div`
  font-size: 30px;
  color: green;
`
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/10.png" /> <br />

#### 2.3）样式继承

在 styled-components 中也可以使用样式的继承。其继承的思想和react的组件继承相似。
```
// style.js 文件样式代码如下：

import styled from 'styled-components';

// const 标签名 (首字母大写) = styled.HTML标签名`css样式`

const Parent = styled.div`
  font-size: 30px;
  color: green;
`

// 子继承父
// 继承：color 子没有，会使用父的
// 重载，font-size 两者都有，子会覆盖父的

const Child = styled(Parent)`
  font-size: 50px;
`

export { 
  Parent,
  Child,
}

// App.js 文件代码如下：

import React, { Component } from 'react';

// 导入样式文件
import { Parent, Child } from './style';

class App extends Component { 
  render() { 
    return (<div>
      <Parent>原先的样式</Parent>
      <Child>现在的样式</Child>
    </div>)
  }
}

export default App;
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/11.png" /> <br />

#### 2.4）属性传递
```
1）属性传递：样式值的动态传参 (组件传值)
2）基于 css-in-js 的特性，在 styled-components 中允许我们使用 props (父传子)。 我们可以对部分需要的样式进行传参，方便动态控制样式的改变。
```
```
// style.js 代码如下：

import styled from 'styled-components';

// 动态属性传递样式的值
// 没有传递值就是默认值 green，传了值就是值的属性

const Bgm = styled.div`
  background: ${(props) => props.bgColor || 'green'};
  font-size: ${(props) => props.Size || '20px' };
`

export { Bgm };

// App.js 代码如下：

import React, { Component } from 'react';

// 导入样式文件
import { Bgm } from './style';

class App extends Component { 
  render() { 
    return (<div>
      <Bgm>原先的样式</Bgm>
      <Bgm bgColor={ 'yellow' } Size="30px">传值的样式</Bgm>
    </div>)
  }
}

export default App;
```
效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/12.png" /> <br />

#### 2.5) 普通样式

我们使用过vue，在 .VUE 文件中有个style标签，我们只要加上了 scoped 就可以进行样式隔离，而 styled-components 其实也可以具有 vue 的style标签的能力，
我们只需要在外面包一层，就可以实现vue中样式隔离的效果。

import React, { Component } from 'react';
import styled from 'styled-components';

const AppStyle = styled.div`
  .box {
    width: 100px;
    height: 100px;
    background-color: red;
  }
`;

class App extends Component { 
  render() { 
    return (<AppStyle>
      <div className="box" />
    </AppStyle>)
  }
}

export default App;

实现效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/css/images/13.png" /> <br />


#### 3） Css in JS 与 css 预处理器 (比如Less，Sass，PostCss) 有什么区别？

CSS in JS 使用 javaScript的语法，是Javascript脚本的一部分，不用从头学习一套API，也不会多一道编译步骤，但是会在运行时动态生成css，造成一定运行时的开销。

##### 优缺点分析

##### 优点

1）没有无作用域样式污染问题。

通过唯一的css选择器或行内样式解决。

2）没有无用的css样式堆积问题。

css-in-js 会把样式和组件绑定在一起，当这个组件要被删除的时候，直接把这些代码删掉就好了，不用担心删掉的样式代码会对项目的其他组件样式产生影响。
并且css是写到javascript里面的，我们还可以利用js显示的变量定义，模块引用等语言特性来追踪样式的使用情况。这大大方便了我们对样式代码的更改或重构。

3）更好的基于状态的样式定义

css-in-js 会直接将css样式写到JS文件里面，所以样式复用以及逻辑判断都十分方便。

##### 缺点

1）运行时消耗时间

由于大多数的 css-in-js 的库都是在动态生成css的。这会有两方面的影响。首先我们发送到客户端的代码会包括使用到的 css-in-js 运行时（runtime）代码，这些代码
一般都不是很小，比如 styled-components 的runtime大小时 12.42KB min+gzip，如果我们希望首屏加载的代码很少，需要考虑这个问题。
其次大多数 css-in-js 实现都是在客户端动态生成的css，这就意味着会有一定的性能代价。









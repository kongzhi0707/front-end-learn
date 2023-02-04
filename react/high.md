
### React高阶组件及应用场景
<div id="back"></div>

- [x] [一：什么是高阶组件？](#id1)<br />
- [x] [二） 了解 extends 模式](#id2) <br />
- [x] [三）高阶组件产生的初衷](#id3)<br />
- [x] [四）高阶组件使用和编写结构](#id4) <br />
  - [x] 4.1) 装饰器模式和函数包裹模式 <br />
  - [x] 4.2) 嵌套HOC <br />
- [x] [五）React中的高阶组件](#id5)<br />
  - [x] 5.1）正向属性代理（Props Proxy） <br />
  - [x] 5.2）反向继承 <br />
- [x] [六）如何编写高阶组件？](#id6) <br />
  - [x] 6.1）强化props <br />
  - [x] 6.2) 抽离state控制更新 <br />
  - [x] 6.3) 控制渲染 <br />
  - [x] 6.4）节流渲染 <br />
- [x] [七）赋能组件](#id7)<br />

#### <div id="id1">一：什么是高阶组件？<a href="#back">回到顶部</a></div>

我们先来理解下什么是高阶函数，高阶函数的定义是：如果一个函数 接收一个或多个函数作为参数，然后返回一个函数，我们称之为：高阶函数。

下面就是一个简单的高阶函数：

function highFunc(greeting = () => {}) {
  return greeting;
}

高阶组件的定义和高阶函数是类似的，高阶组件的定义：如果一个函数接收一个或多个组件作为参数并且返回一个组件，我们可以称之为：高阶组件。

下面就是一个简单的高阶组件：

function HigherOrderComponent(WrappedComponent) {
  return <WrappedComponent />;
}

#### <div id="id2">二） 了解 extends 模式<a href="#back">回到顶部</a></div>

在class 组件盛行之后， 我们可以通过继承的方式进一步强化我们的组件， 这种模式的好处在于， 可以封装基础功能组件，然后根据需要去 extends 我们的基础组件，按需强化我们的组件。

比如如下代码， 我们编写一个基础组件 Base, src/inputComp.jsx 代码如下：

import React from 'react';

class Base extends React.Component { 
  constructor() { 
    super();
    this.state = {
      name: 'kongzhi'
    }
  }
  say() { 
    console.log('---base--components');
  }
  render() { 
    return <div>hello world <button onClick={ this.say.bind(this) }>点击</button></div>
  }
}

export default Base;

然后我们的 src/App.jsx 调用上面的Base组件代码如下：

import React from 'react';

import Base from './InputComp';

class Index extends Base { 
  componentDidMount() { 
    console.log('---this.state.name---', this.state.name); // 打印出 kongzhi
  }
  say() { // 会覆盖Base类中的say
    console.log('---extends---components--');
  }
}

export default Index;

如上代码就可以调用了， 在我们的 Index 组件的 say 方法就会覆盖 Base组件中的say方法。

#### <div id="id3">三）高阶组件产生的初衷 <a href="#back">回到顶部</a></div>

组件是把prop渲染成UI，而高阶组件是将组件转换成另外一个组件。但是我们要注意的是，经过包装后的组件，获得了哪些强化，节省了多少逻辑，或解决了原有组件的那些缺陷？这就是我们高阶组件的意义。高阶组件有如下优势：

1）复用逻辑： 高阶组件更像是一个加工 react 组件的工厂，批量对原有组件进行加工，包装处理，我们可以根据业务需求定制化专属的HOC，这样可以解决复用逻辑。

2）强化props： 高阶组件返回的组件，可以劫持上一层传递过来的props， 然后混入新的 props， 来增强组件的功能。 代表作有 react-router 中的 withRouter.

3) 赋能组件： HOC有一项独特的特性，就是可以被HOC包裹的业务组件，提供一些拓展功能，比如说额外的生命周期，额外的事件，但是这种HOC，可能需要和业务组件紧密结合。典型案例react-keepalive-router中的 keepaliveLifeCycle就是通过HOC方式，给业务组件增加了额外的生命周期。

4）控制渲染：劫持渲染是HOC的一个特性，在 wrapComponent 包装组件中，可以对原来的组件，进行条件渲染，节流渲染，懒加载等功能。

#### HOC 模式

我们来简单的看一个HOC的demo代码如下：

import React from 'react';

function HOC(Component) { 
  return class wrapComponent extends React.Component { 
    constructor() { 
      super();
      this.state = {
        name: 'kongzhi'
      }
    }
    render() { 
      return (
        <Component {...this.props} {...this.state} />
      )
    }
  }
}

@HOC
class Index extends React.Component { 
  say() { 
    const { name } = this.props;
    console.log('---name---', name); // 打印出 kongzhi
  }
  render() { 
    return (
      <div>hello, world <button onClick={ this.say.bind(this)}>点击</button></div>
    )
  }
}

export default Index;

#### <div id="id4">四）高阶组件使用和编写结构<a href="#back">回到顶部</a></div>

HOC 使用比较简单，只需要将我们的组件进行包裹就可以了。

#### 4.1) 装饰器模式和函数包裹模式

对于class声明的有状态组件，我们可以用装饰器模式，对类组件进行包裹。

@withStyles(styles)
@withRouter
@keepaliveLifeCycle
class Index extends React.Component {
  // ... 更多代码
}

上面装饰器模式，越靠近Index组件的，就是越内层的HOC，离组件Index也就越近。

对于无状态组件（函数声明），我们可以这样写：

function Index() {
  //...
}
export default withStyles(styles)(withRouter( keepaliveLifeCycle(Index) ))

#### 4.2) 嵌套HOC

对于不需要传递参数的HOC，我们编写模型我们只需要嵌套一层就可以了，比如 withRouter

function withRouter() {
  return class wrapComponent extends React.Component {
    // 编写逻辑代码
  }
}

对于需要参数的HOC，我们需要一层代理， 代码如下：

function connet(mapStateToProps) {
  // 接收一个参数
  return function connectAdvance(WrapComponent) {
    // 接收组件
    return class WrapComponent extends React.Component {
      // 代码
    }
  }
}

#### <div id="id5">五）React中的高阶组件<a href="#back">回到顶部</a></div>

React中的高阶组件主要有两种形式：正向属性代理 和 反向组件继承。

#### 5.1）正向属性代理（Props Proxy）

所谓正向属性代理，就是使用组件包裹一层代理组件，在代理组件上，我们可以做一些对源组件的代理操作，我们可以理解为父子组件的关系，父组件对子组件进行一系列强化操作。

最简单的属性代理实现代码如下：

// 无状态
function HigherOrderComponent(WrappedComponent) {
  return props => <WrappedComponent {...props} />;
}

// 有状态
function HigherOrderComponent(WrappedComponent) {
  return class extends React.Component {
    state = {
      name: 'kongzhi'
    }
    render() {
      return <WrappedComponent {...this.props} {...this.state} />
    }
  }
}

如上代码可以看到，正向属性代理其实就是一个函数接收一个 WrappedComponent 组件作为参数传入，并且返回了一个继承了 React.Component 组件的类，且在该类的 render() 方法中返回被传入的 WrappedComponent 组件。

#### 优点：

1）正向属性代理可以和业务组件低耦合，零耦合，对于 条件渲染 和 props属性增强，只负责控制子组件渲染和传递额外的props就可以了。所以无需知道业务组件
做了些什么。所以正向属性代理 更适合做一些开源项目的HOC，目前开源的HOC基本通过这个模式实现的。

2）同样适用于class声明组件 和 fuction 声明的组件。

3）可以完全隔离业务组件的渲染，相比反向继承， 属性代理这种模式，可以完全控制业务组件渲染与否，可以避免 反向继承 带来一些副作用。比如声明周期的执行。

4）可以嵌套使用，多个HOC是可以嵌套使用的，而且一般不会限制包装 HOC 的先后顺序。

#### 缺点

1）一般无法直接获取业务组件的状态，如果想要获取，需要 ref 获取组件的实例.
2) 无法直接继承静态属性。如果需要继承需要手动代理，或者引入第三方库。

Demo 代码如下：

import React from 'react';

class Index extends React.Component { 
  render() { 
    return <div>hello world</div>
  }
}

Index.say = function () { 
  console.log('my name is kongzhi');
}

function HOC(Component) { 
  return class wrapComponent extends React.Component { 
    render() { 
      return <Component {...this.props} {...this.state} />
    }
  }
}

const newIndex = HOC(Index);
console.log(newIndex.say); // 打印 undefined

export default Index;

#### 5.2）反向继承

反向继承 和 属性代理 有一定的区别，在于包装后的组件继承了业务组件本身，所以我们无须在去实例化我们的业务组件。类似于组件的强化。代码演示如下：

import React from 'react';

class Index extends React.Component { 
  render() { 
    return <div>hello world2</div>
  }
}

function HOC(Component) { 
  return class wrapComponent extends Component { // 直接继承需要包装的组件

  } 
}

export default HOC(Index);

#### 优点

1）方便获取组件内部的状态，比如state，props，生命周期，绑定的事件函数等。
2）es6继承可以良好继承静态属性。我们无须对静态属性和方法进行额外的处理。

演示代码如下：

import React from 'react';

class Index extends React.Component { 
  render() { 
    return <div>hello world2</div>
  }
}
Index.say = function () { 
  console.log('---my name is kongzhi---');
}
function HOC(Component) { 
  return class wrapComponent extends Component { // 直接继承需要包装的组件

  } 
}
const newIndex = HOC(Index);
console.log(newIndex.say()); // 打印出：---my name is kongzhi---
export default Index;

#### 缺点

1）无状态组件无法使用。
2）和被包装的组件强耦合，需要知道被包装的组件的内部状态，具体是做什么的？
3）如果多个反向继承hoc嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的。比如说有多个 componentDidMount, 当前的 componentDidMount 会覆盖上一个 componentDidMount。 这样副作用会比较大。

#### <div id="id6">六）如何编写高阶组件？<a href="#back">回到顶部</a></div>

#### 6.1）强化props

1）混入props

这是高阶组件最常用的功能，承接上层的props，再混入自己的props，来强化组件。

##### 有状态组件（属性代理）

import React, { useEffect }  from 'react';

function HOC(WrapComponent) { 
  return class Index extends React.Component { 
    state = {
      name: 'kongzhi'
    }
    componentDidMount() { 
      console.log('---hoc---'); // 会打印信息
    }
    render() { 
      return <WrapComponent {...this.props} {...this.state} />
    }
  }
}

function Index(props) { 
  const { name } = props;
  useEffect(() => { 
    console.log('---index----'); // 会打印信息
  }, [])
  return <div>hello world, my name is { name } </div>
}

export default HOC(Index);

如上代码， 我们也适用于无状态组件， 演示代码如下：

import React, { useEffect, useState }  from 'react';

function HOC(WrapComponent) { 
  return function Index(props) { 
    const [state, setState] = useState({ name: 'kongzhi' });
    return <WrapComponent {...props} {...state} />
  }
}

function Index(props) { 
  const { name } = props;
  useEffect(() => { 
    console.log('---index----'); // 会打印信息
  }, [])
  return <div>hello world, my name is { name } </div>
}

export default HOC(Index);

#### 6.2) 抽离state控制更新

高阶组件可以将 HOC 的state的配合起来，控制业务组件的更新。我们可以将上面的代码进行改造成如下代码：

import React, { useEffect, useState }  from 'react';

function classHOC(WrapComponent) { 
  return class Index extends React.Component { 
    constructor() { 
      super();
      this.state = {
        name: 'kongzhi'
      };
    }
    changeName(name) { 
      this.setState({
        name,
      })
    }
    render() { 
      return <WrapComponent {...this.props} {...this.state} changeName={ this.changeName.bind(this)} />
    }
  }
}

function Index(props) { 
  const [value, setValue] = useState(null);
  const { name, changeName } = props;
  return <div>
    <div> hello world, my name is {name} </div>
    改变name <input onChange={(e) => setValue(e.target.value)} />
    <button onClick={ () => changeName(value)}>确定</button>
  </div>
}

export default classHOC(Index);

#### 6.3) 控制渲染

控制渲染是高阶组件的一个很重要的特性。

#### 1）条件渲染

对于属性代理的高阶组件，虽然不能在内部操控渲染状态，但是可以在外层控制当前组件是否渲染，这种情况适用于：权限隔离，懒加载，延时加载等场景。

##### 实现一个动态挂载组件的HOC

import React from 'react';

function classHOC(WrapComponent) { 
  return class Index extends React.Component { 
    constructor(props) { 
      super(props)
      this.state = { visible: true }
    }
    setVisible() { 
      this.setState({ visible: !this.state.visible })
    }
    render() { 
      const { visible } = this.state;
      return <div className='box'>
        <button onClick={this.setVisible.bind(this)}>挂载组件</button>
        {
          visible ? <WrapComponent {...this.props} setVisible={ this.setVisible.bind(this)} /> : <div>111</div> 
        }
      </div>
      
    }
  }
}

class Index extends React.Component { 
  render() { 
    const { setVisible } = this.props;
    return <div className='box'>
      <p>hello, my name is kongzhi</p>
      <button onClick={ () => setVisible()}>卸载当前组件</button>
    </div>
  }
}

export default classHOC(Index);

如上代码，当我们点击 "卸载当前组件" 按钮后，我们把组件隐藏了， 当我们点击挂载组件， 组件显示了。 也就是在 Index 组件， 我们可以控制是否渲染该组件。

#### 2）分片渲染

实现一个懒加载功能的HOC，可以实现组件的分片渲染， 用于分片渲染页面，不至于一次渲染大量组件造成白屏效果。

import React, { useState, useEffect } from 'react';

const renderQueue = [];
let isFirstRender = false;

const tryRender = () => { 
  const render = renderQueue.shift();
  if (!render) return;
  setTimeout(() => {
    render(); // 执行下一段渲染
  }, 300);
}

// HOC
function renderHOC(WrapComponent) { 
  return function Index(props) { 
    const [isRender, setRender] = useState(false);
    useEffect(() => { 
      renderQueue.push(() => { // 放入待渲染的对列中
        setRender(true);
      })
      if (!isFirstRender) { 
        tryRender();
        isFirstRender = true;
      }
    }, [])
    return isRender ? <WrapComponent tryRender={tryRender} {...props} /> : <div>1111</div>  
  }
}

// 业务组件
class Index extends React.Component { 
  componentDidMount() { 
    const { name, tryRender } = this.props;
    // 上一部分渲染完毕，进行下一部分渲染
    tryRender();
    console.log('----渲染----', name + '渲染');
  }
  render() { 
    return <div><img src="xx.jpg" /></div>
  }
}

// 高阶组件包裹
const Item = renderHOC(Index);

export default () => { 
  return <React.Fragment>
    <Item name="组件一" />
    <Item name="组件二" />
    <Item name="组件三" />
  </React.Fragment>
}

流程：初始化的时候，HOC中将渲染真正组件的渲染函数，放入 renderQueue 队列中，然后初始化渲染一次，接下来，每一个项目组件，完成didMounted状态后，会从队列中取出下一个渲染函数，渲染下一个组件，一直到所有的渲染任务全部执行完毕，渲染对列清空，有效的进行分片渲染。这种方式对海量数据显示。

#### 3）反向继承 --- 渲染劫持

HOC反向继承模式，可以实现颗粒化的渲染劫持，也就是可以控制基类组件的render函数，还可以篡改props，或者是 children。

const HOC = (WrapComponent) => 
  class Index extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>暂无数据</div>
      }
    }
  }

#### 4）反向继承 --- 修改渲染树

修改渲染状态（劫持render替换子节点）

import React, { useState, useEffect } from 'react';

class Index extends React.Component { 
  render() { 
    return <div>
      <ul>
        <li>react</li>
        <li>vue</li>
        <li>angular</li>
      </ul>
    </div>
  }
}

function HOC(Component) { 
  return class Index extends Component { 
    render() { 
      console.log('---super---', super.render());
      const element = super.render();
      const otherProps = {
        name: 'kongzhi'
      };
      // 替换 Angular 元素节点
      const appendElement = React.createElement('li', {}, `hello world, my name is ${otherProps.name}`);
      const newChild = React.Children.map(element.props.children.props.children, (child, index) => {
        if (index === 2) return appendElement;
        return child;
      });
      return React.cloneElement(element, element.props, newChild);
    }
  }
}

export default HOC(Index);

如上代码，我们用劫持渲染的方式，来操纵 super.render()后的 React.element 元素，然后配合 createElement, cloneElement, React.Children
等api操作。

#### 6.4）节流渲染

hoc 除了可以进行条件渲染，渲染劫持功能外，还可以进行节流渲染，可以优化我们的性能。

#### 1）节流原理

hoc 可以配合 hooks 的 useMemo 等API配合使用，可以实现对业务组件的渲染控制，减少渲染次数，从而达到优化性能的效果。如下demo代码，我们期望当num改变的时候，渲染组件。我们可以如下代码编写我们的HOC。

import React, { useState, useEffect, useMemo } from 'react';

function HOC(Component) { 
  return function renderWrapComponent(props) { 
    const { num } = props;
    const RenderElement = useMemo(() => <Component {...props} />, [num])
    return RenderElement;
  }
}

class Index extends React.Component { 
  render() { 
    console.log(`当前组件是否渲染`, this.props);
    return <div>hello, world, my name is kongzhi</div>
  }
}

const IndexHoc = HOC(Index);

export default () => { 
  const [num, setNumber] = useState(0);
  const [num1, setNumber1] = useState(0);
  const [num2, setNumber2] = useState(0);
  return <div>
    <IndexHoc num={num} num1={num1} num2={num2} />
    <button onClick={() => setNumber(num + 1)}>num++</button>
    <button onClick={() => setNumber1(num1 + 1)}>num1++</button>
    <button onClick={ () => setNumber2(num2 + 1)}>num2++</button>
  </div>
}

如上代码，当我们只有点击了 num++ 的时候，才会重新渲染子组件，点击其他按钮，只是负责传递了 props， 达到了期望的效果。

#### 2）定制化渲染流

上述节流我们只是简单的实现了，但是我们需要针对不同的props变化，要写不同的HOC组件，这样不能真正体现HOC的用途，因此我们需要针对上面的hoc进行改造升级，组件可以根据我们的定制化方向去渲染组件。也就是HOC生成的时候，按照某种契约去进行渲染。

实现代码如下：

import React, { useState, useEffect, useMemo } from 'react';

function HOC(rule) { 
  console.log('---rule---', rule);
  return function (Component) { 
    return function renderWrapComponent(props) { 
      const dep = rule(props);
      const RenderElement = useMemo(() => <Component {...props} />, [dep]);
      return RenderElement;
    }
  }
}

// 只有props中num变化，渲染组件
@HOC((props) => props['num'])
class IndexHoc extends React.Component { 
  render() { 
    console.log('---组件一渲染---', this.props);
    return <div>组件一: hello,world</div>
  }
}

// 只有props中的num1变化，渲染组件
@HOC((props) => props['num1'])
class IndexHoc1 extends React.Component { 
  render() { 
    console.log('组件二渲染--', this.props);
    return <div>组件二: my name is kongzhi2</div>
  }
}

export default () => { 
  const [num, setNumber] = useState(0);
  const [num1, setNumber1] = useState(0);
  const [num2, setNumber2] = useState(0);
  return <div>
    <IndexHoc num={num} num1={num1} num2={num2} />
    <IndexHoc1 num={num} num1={num1} num2={num2} />
    <button onClick={() => setNumber(num + 1)}>num++</button>
    <button onClick={() => setNumber1(num1 + 1)}>num1++</button>
    <button onClick={ () => setNumber2(num2 + 1)}>num2++</button>
  </div>
}

如上代码，当num或num1发生改变时候，都会重新渲染组件。

#### <div id="id7">七）赋能组件 <a href="#back">回到顶部</a></div>

高阶组件除了上面功能之外，还可以赋能组件，比如一些额外的生命周期，劫持事件，监控日志等。

#### 7.1）劫持原型链-劫持生命周期，事件函数

##### 1）属性代理实现

import React, { useState, useEffect, useMemo } from 'react';

function HOC(Component) { 
  const proDidMount = Component.prototype.componentDidMount;
  Component.prototype.componentDidMount = function () { 
    console.log('劫持生命周期：componentDidMount'); // 1. 第一步先打印信息
    proDidMount.call(this);
  }
  return class wrapComponent extends React.Component { 
    render() { 
      return <Component {...this.props} />
    }
  }
}

@HOC
class Index extends React.Component { 
  componentDidMount() { 
    console.log('----didMounted----'); // 2. 第二步打印该信息
  }
  render() { 
    return <div>hello world</div>
  }
}

export default Index;

#### 2）反向继承实现

反向继承，因为在继承原有组件的基础上，可以对原有组件的生命周期或事件进行劫持，甚至是替换。

import React, { useState, useEffect, useMemo } from 'react';

function HOC(Component) { 
  const proDidMount = Component.prototype.componentDidMount;
  return class wrapComponent extends Component { 
    componentDidMount() { 
      console.log('---劫持生命周期---');
      if (proDidMount) { 
        proDidMount.apply(this);
      }
    }
    render() { 
      return super.render();
    }
  }
}

@HOC
class Index extends React.Component { 
  componentDidMount() { 
    console.log('----didMounted----'); // 2. 第二步打印该信息
  }
  render() { 
    return <div>hello world</div>
  }
}

export default Index;

#### 7.2) 事件监控

HOC 还可以对原有组件进行监控，比如对一些 事件监控，错误监控，事件监听等操作。

#### 1）组件内的事件监听

下面我们做一个HOC只对组件内的点击事件做一个监听效果。

import React, { useState, useEffect, useRef } from 'react';

function ClickHOC(Component) { 
  return function Wrap(props) { 
    const dom = useRef(null);
    useEffect(() => { 
      const handerClick = () => console.log('发生点击事件');
      console.log('---dom.current---', dom.current); // 组件内部的元素
      dom.current.addEventListener('click', handerClick);
      return () => dom.current.removeEventListener('click', handerClick);
    }, [])
    return <div ref={dom}><Component {...props}/></div>
  }
}

@ClickHOC
class Index extends React.Component { 
  render() { 
    return <div>
      <p>hello world</p>
      <button>组件内部点击</button>
    </div>
  }
}

export default () => { 
  return <div>
    <Index />
    <button>组件外部点击</button>
  </div>
}

如上代码， 只有组件内部点击才会触发函数， 打印信息， 组件外部点击没有任何效果。


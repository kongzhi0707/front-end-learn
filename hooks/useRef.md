
### 理解React中的useRef的基本用法

  我们不管使用vue或react时候，我们想获取组件实列对象或DOM对象的话，我们都会对组件使用ref来做组件的一个引用，然后我们通过 this.refs.ref 这样就能
获取组件的实列对象了。今天我们可以来理解下 React中Hook的 useRef 这个用法，useRef除了有传统的ref功能之外，它还可以 "跨渲染周期" 来保存数据。

  我们可以先看下如下代码：
```
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    console.log(12);
    return 2 * count;
  }, [count]);

  const ref1 = useRef(null);
  useEffect(() => {
    console.log(`the value is ${count}`);
    console.log(ref1.current);
  }, [count]);

  return (
    <React.Fragment>
      <button ref={ref1} onClick={() => { setCount(count + 1)}}>
        Count: {count},
        double: {doubleCount}
      </button>
    </React.Fragment>
  );
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  如上代码，当我们第一次刷新页面的时候，首先 count初始值 = 0; 因此第一次会渲染页面，因此 Count: 0, double也会执行 doubleCount，因此double等于0. 等页面渲染完成后，就会执行 useEffect 这个副作用函数，因此会打印信息："the value is 0", 然后打印 "button对象的引用"; 

  如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/4.jpg" /> <br />

  当我们点击按钮的时候，我们通过 setCount方法重新对count值发生改变，因此会重新渲染页面，渲染完成页面后，同样会执行 useEffect 函数，最后打印 
"the value is 1"; 还会打印 "button" 对象。

  如下图：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/5.jpg" /> <br />

  如上代码，我们使用来 useRef创建来 ref1对象，如代码：const ref1 = useRef(null); 最后将值 ref1 赋值给来 button 的ref属性。因此如果我们要访问button对象的话，我们需要使用 ref1.current 就可以访问得到。

  我们可以再来理解使用 useRef 跨渲染周期是什么含义？ 简单的来讲就是说我们的组件被多次渲染之后属性值不会发生改变。state它可以的，组件中的state可以在多次渲染之后值可以依旧不变，但是state的值我们通过setSate改变后，组件会重新渲染。因此useRef就可以实现跨域渲染周期来存储数据，并且对它的修改也不会引起组件重新渲染。

  比如如下代码：
```
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    console.log(12);
    return 2 * count;
  }, [count]);

  const ref1 = useRef(null);

  useEffect(() => {
    ref1.current = setInterval(() => {
      setCount(count => count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count > 10) {
      clearInterval(ref1.current);
    }
  })

  return (
    <React.Fragment>
      <button ref={ref1} onClick={() => { setCount(count + 1)}}>
        Count: {count},
        double: {doubleCount}
      </button>
    </React.Fragment>
  );
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  如上代码，我们使用ref对象的current属性来存储定时器ID，当我们每次定时器使用 setCount方法对count值发生改变时候，会重新渲染页面，但是定时器 ref1.current 会依旧保存之前的值，因此当count大于10的时候，我们就可以使用定时器清空该  ref1.current 了。

#### 总结：使用 const ref1 = useRef(null); 创建了ref对象之后，我们在组件中 <Component ref = {ref1} /> 这样就能对组件获取到一个引用，我们想要获取组件的引用使用 ref1.current。 并且当函数组件中我们使用 setCount 方法改变 count值的时候，会重新渲染页面，但是 ref1.current 保存的值且依旧不变，因此它可以 跨渲染周期来保存数据来。
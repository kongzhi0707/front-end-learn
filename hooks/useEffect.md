### 理解 useEffect 的用法

  我们上面已经介绍了 useState的使用，在class中，我们可以通过在构造函数中设置 this.state = { count: 0 }; 来初始化 count 的state为0.比如如下代码：
```
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    }
  }
}
```
  但是在函数组件中，我们没有this，因此我们不能直接使用 this.state 来读取值。因此我们可以在函数中使用 useState Hook; 来做这件事。 基本的代码如下：
```
import React, { useState } from 'react';
export default function() {
  console.log(111)
  const [ on, setOn ] = useState(false);
  const lightOn = () => setOn(true);
  const lightOff = () => setOn(false);
  return (
    <React.Fragment>
      <div className={ on ? 'on' : 'off' }>11222333</div>
      <button onClick={lightOn}>使class变为on</button>
      <button onClick={lightOff}>使class变为off</button>
    </React.Fragment>
    
  )
}
```
  如上就是我们之前的useState的作用，那么useEffect也是类似的。在函数组件中没有react中的生命周期，因此我们可以使用 useEffect来替代。我们可以把 useEffect Hook看做是 componentDidMount、componentDidUpdate 和 componentWillUnmount 这三个函数的组合。

  比如在React中代码如下：
```
import React, { useReducer } from 'react';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  // 页面渲染完成后，会自动调用 componentDidMount 生命周期
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    console.log('componentDidMount');
    console.log(document.title);
  }
  // 当state值发生改变的时候，调用render()生命周期后，该生命周期 componentDidUpdate 也会被调用 
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
    console.log('componentDidUpdate');
    console.log(document.title);
  }
  clickFunc = () => {
    this.setState({
      count: this.state.count + 1
    });
  }
  render() {
    console.log(this.state.count);
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.clickFunc}>click me</button>
      </div>
    )
  }
}

export default Example;
```
  如上在react中，刷新页面后，首先会调用render()生命周期，然后 再调用 componentDidMount()  生命周期，当我们每次点击的时候，使用setState()方法设置值的时候，会重新调用 render()生命周期函数，接着就会调用 componentDidUpdate() 生命周期函数。

  现在我们想使用 useEffect 在函数里面实现类似的事情。如下代码：

```
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(`You clicked ${count} times`);
  });
  return (
    <div>
      <p>You clicked {count} times;</p>
      <button onClick={() => setCount(count + 1)}>click me</button>
    </div>
  );
}

export default Example;
```
  如上代码，当我们刷新页面的时候，就会调用 useEffect方法，进行打印数据，当我们每次点击的时候，同样也会调用 useEffect 方法打印出数据。也就是说，在默认情况下，它在第一次渲染之后和每次更新之后useEffect中的代码都会被执行。并且当我们每次执行 useEffect 中的代码时候，DOM都已经是加载完毕了。

##### useEffect运行时机

  1. useEffect 在页面被渲染的时候会执行一次。
  2. 有没有第二个参数。useEffect hook 它接收2个参数，第一个是要执行的代码，第二个是一个数组，指定一组依赖的变量，其中任何一个变量发生变化时，此effect都会重新再执行一次。
  3. 如果我们想要在useEffect中只执行一次，我们可以让第二个参数为 [], 这样的话，当有state值发生变化的时候，useEffect内部的代码也不会被执行，因为它不依赖与任何参数，因此如果我们有这样的需求的话，比如说页面刷新后，我想让代码只执行一次，我们可以这样操作，它就好比我们的 react中的 componentDidmount 生命周期一样，在页面初始渲染完成后只执行一次，如果每次通过setState改变state值的话，我们可以在 componentDidupdate 生命
  周期中渲染。
  4. 有没有返回值。useEffect的执行代码中可以返回一个函数。在每一次新的render进行前或者组件unmount之时，都会执行此函数，进行清理工作。

  下面我们把代码继续改成如下，继续来理解下 useEffect 的效果。
  ```
  |--- index.jsx
  |--- hello.jsx
  ```
  index.jsx 代码如下：
```
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PostList from './hello';

function App() {
  const [showList, setShowList] = useState(false);
  const [postCount, setPostCount] = useState(5);

  return (
    <div className="app">
      <button onClick={() => setShowList(!showList)}>
        {showList ? '隐藏' : '显示'}
      </button>
      <button onClick={() => setPostCount(postCount => postCount + 1)}>增加数量</button>
      { showList && <PostList count={postCount} /> }
    </div>
  );
}

// 创建一个组件实列，将组件挂载到元素上
ReactDOM.render(<App />, document.getElementById('app'));
```
  hello.jsx 代码如下：
```
import React, { useState, useEffect } from 'react';

function PostList({ count = 5 }) {
  useEffect( () => {
    console.log(11222333);
    console.log(count);
    let p = document.createElement('p');
    p.innerHTML = `当前文章数量：${count}`;
    document.body.append(p);
  });
  return (
    <ul>
      {
        new Array(count).fill("文章标题").map((value, index) => {
          return (
            <li key={index}>
              {value}
              {index + 1}
            </li>
          )
        })
      }
    </ul>
  );
}

export default PostList;
```
  在如上 index.jsx 中，showList被初始化为false，因此PostList组件是不显示的。页面只显示：'显示' 和 '增加数量' 按钮。当我点击 显示按钮的 时候，页面效果如下：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/1.jpg" /> <br />

  可以看到，showList 为 true，会显示 PostList 组件，并且此时 count 值为初始化的 5。因此会调用 子组件 PostList 函数。然后执行 遍历：new Array(count).fill('文章标题') 这样的代码，当执行完成后，就会调用 useEffect 函数。此时会插入数据到页面body最后面去。如上就是一个执行先后顺序。

  现在当我们点击 增加数量 按钮的时候，postCount值为6. 我们可以看到页面及打印信息如下：
<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/2.jpg" /> <br />

  useEffect 的执行顺序和上面是一样的。唯一不同的是，每次点击按钮的时候都会往页面插入p元素。这有可能就会造成内存泄漏的问题产生。当我们每次点击按钮的时候，p元素都会被在页面中追加一次。为了解决这个问题，我们可以使用 useEffect 添加一个返回值，并且在返回函数内部删除我们追加的p元素即可。如下代码:

  hello.jsx 代码如下：
```
import React, { useState, useEffect } from 'react';

function PostList({ count = 5 }) {
  useEffect( () => {
    console.log(11222333);
    console.log(count);
    let p = document.createElement('p');
    p.innerHTML = `当前文章数量：${count}`;
    document.body.append(p);
    
    // 新增的代码
    return () => {
      p.remove();
    }
  });
  return (
    <ul>
      {
        new Array(count).fill("文章标题").map((value, index) => {
          return (
            <li key={index}>
              {value}
              {index + 1}
            </li>
          )
        })
      }
    </ul>
  );
}

export default PostList;
```
  最后执行点击按钮后的效果如下：
<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/3.jpg" /> <br />

#### 2) useEffect 异步处理

  基本代码可以参考如下：
```
import React, { useState, useEffect } from 'react';

const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);

function PostList({ count = 5 }) {
  useEffect( () => {
    const loadPosts = async () => {
      setLoading(true);
      const response = await fetch(
        `https://xxxxxxxxxx.com?limit=${count}`
      );
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, [count]);
  if (loading) {
    return (<div>loading...</div>);
  }
  return (
    <ul>
      {
        posts.slice(0, count).map((post, index) => {
          return <li key={post.id}>{post.title}</li>;
        })
      }
    </ul>
  );
}
export default PostList;
```

#### 3) useEffect 第二个参数

  如果我们给 useEffect 传递第二个参数的话，并且把 第二个参数count作为依赖值，每次当count值变化的时候，此时effect都会被重新执行一次，然后会去加载新的数据。

  比如如下代码：
```
import React, { useState, useEffect } from 'react';

function PostList({ count = 5 }) {
  useEffect( () => {
    console.log(11222333);
    console.log(count);
    let p = document.createElement('p');
    p.innerHTML = `当前文章数量：${count}`;
    document.body.append(p);
    
    // 新增的代码
    return () => {
      p.remove();
    }
  }, [count]);
  return (
    <ul>
      {
        new Array(count).fill("文章标题").map((value, index) => {
          return (
            <li key={index}>
              {value}
              {index + 1}
            </li>
          )
        })
      }
    </ul>
  );
}

export default PostList;
```
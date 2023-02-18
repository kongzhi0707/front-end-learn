
### 避免React Context导致的重复渲染

React Context 的基本使用， 可以看我之前的 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/es6/context.md">这篇文章</a>. 

首先我们来看如下的demo。 代码如下：
```
|--- context.jsx
|--- App.jsx
```
context.jsx 代码如下：
```
import React from 'react';
const Context = React.createContext();
export default Context;
```
App.jsx 代码如下：
```
import React, { Component, useContext } from 'react';
import Context from './context';

const redTheme = {
  color: 'red',
};

const greenTheme = {
  color: 'green',
};

function Content() { 
  const { theme, switchTheme } = useContext(Context);
  return (
    <>
      <h1 style={theme}>hello world</h1>
      <button onClick={() => switchTheme(redTheme)}>Red Theme</button>
      <button onClick={ () => switchTheme(greenTheme)}>Green Theme</button>
    </>
  )
}

function Header() { 
  console.log('---header组件被渲染了----');
  return <h1>hello Header</h1>
}

class App extends React.Component { 
  state = {
    theme: redTheme,
  }
  switchTheme = (theme) => { 
    this.setState({
      theme,
    })
  }
  render() { 
    console.log('---我被渲染了---');
    return (
      <Context.Provider value={{theme: this.state.theme, switchTheme: this.switchTheme}}>
        <div className="App">
          <Header />
          <Content />
        </div>
      </Context.Provider>
    )
  }
}

export default App;
```
  如上App的组件是应用的最顶层组件，使用了 Context.Provider 传值给 子组件 Content. App组件的state保存当前主题，给Provider的value里。除了包含了当前的主题，还给一个函数 switchTheme， 当我们点击 Content 函数中的 Red Theme 就会切换成红色， 点击 Green Theme 就会切换成绿色。

  那么整个过程如下：
```
1）点击了按钮，调用了 Context value 中的 switchTheme 函数；
2）switchTheme 函数调用了顶层组件App中的setState，修改了state中的theme；
3）因为App的状态被改变了，所以App被重新渲染了；
4）App重新渲染，Context.Provider 被重新渲染。
5）Context.Provider 被重新渲染，发现value和上次的不同，所以会引发所有的 Consumer 被重新渲染。
6）Content组件作为一个 Consumer，被重新渲染，用新的 Context value 主题重绘。
```
  如上就是我们的被渲染的整个过程，当 Context.Provider 重新渲染的时候，它所有的子组件都被重新渲染了，比如上面列子中的组件有 Header 和 Content，Content作为Consumer被重新渲染没有任何问题，但是Header不需要重新渲染的， 但是也被渲染了，这是我们不想要的。

如下代码：
```
<Context.Provider value={{theme: this.state.theme, switchTheme: this.switchTheme}}>
  <div className="App">
    <Header />
    <Content />
  </div>
</Context.Provider>
```
  它每次value发生改变的时候，都会重新渲染 Context.Provider，它重新渲染之后，内部代码的JSX会被转译成 React.CreateElement, 如下代码：
```
React.createElement(Context.Provider, {value: ...},
  React.createElement('div', {className: ...},
    React.createElement(Header),
    React.createElement(Content),
  )
)
```
  因此，当我们每次渲染的时候都调用 React.createElement, 所以每一次渲染产生的子组件都是不一样的。因此我们需要对我们上面的代码进行改造下，
  思路是：建一个独立的组件来管理state和Provider，把子组件的JSX写到这个组件之外。

下面我们来改造下代码，我们制造一个 ThemeProvider， 代码如下：
```
｜--- Context.jsx
｜---App.jsx
```
context.jsx 代码如下：
```
import React from 'react';
const Context = React.createContext();
export default Context;
```
App.jsx 代码如下：
```
import React, { useContext } from 'react';
import Context from './context';

const redTheme = {
  color: "red"
};

const greenTheme = {
  color: "green"
};

function Content() { 
  const { theme, switchTheme } = useContext(Context);
  return (
    <>
      <h1 style={theme}>Hello world</h1>
      <button onClick={() => switchTheme(redTheme)}>Red Theme </button>
      <button onClick={ () => switchTheme(greenTheme)}>Green Theme </button>
    </>
  )
}

function Header() { 
  console.log('---header 被渲染了吗？ ----');
  return <h1>header hello</h1>;
}

class ThemeProvider extends React.Component { 
  state = {
    theme: redTheme
  };
  switchTheme = theme => { 
    this.setState({
      theme,
    });
  }
  render() { 
    console.log('---ThemeProvider-组件被渲染了----'); // 会一直被执行
    return (
      <Context.Provider value={{ theme: this.state.theme, switchTheme: this.switchTheme }}>
        { this.props.children }
      </Context.Provider>
    )
  }
}

function App() { 
  console.log('---render App---');
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Content />
      </div>
    </ThemeProvider>
  )

}

export default App;
```
  如上代码， App成了一个无状态组件，只渲染一次，因此state改为 ThemeProvider 组件来管理，每次当 ThemeProvider 的state 被 switchTheme 改变而重新渲染的时候，它看到的子组件 是 { this.props.children } 是App传递给他的，就不需要重新使用 React.createElement 重新渲染，所以 this.props.children 是不变的，因此 Context.Provider 也就不会让 this.props.children 重新渲染了。


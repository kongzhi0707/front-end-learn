
### 使用 React + TypeScript 开发

#### 1) 基础类型的定义
```
type BasicProps = {
  message: string;
  count: number;
  disabled: boolean;
  /* 数组类型 */
  names: string[];
  /* 用 [联合类型] 限制下面两种 字符串字面量的类型 */
  status: "waiting" | "success"
};
```
#### 2) 对象类型
```
type ObjectOrArrayProps = {
  // 如果我们不需要用到具体的属性, 可以像下面这样规定是个对象, 但是不推荐使用
  obj: object;
  obj2: {}; // 同上
  // 拥有具体属性的对象类型 推荐使用
  obj3: {
    id: string;
    title: string;
  };
  // 对象数组
  objArr: {
    id: string;
    title: string;
  }[];
  // key 可以为任意string, 
  dict1: {
    [key: string]: any;
  };
};
```
#### 3) 函数类型
```
type FunctionProps = {
  // 没有参数的函数, 不需要返回值
  onClick: () => void;

  // 带函数的参数,
  onChange: (id: number) => void;

  // 另一种函数语法, 参数是 React的函数事件, 比较常用
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;

  // 可选参数类型
  optional?: OptionalType;
};
```
#### 4) React 相关类型
```
export declare interface AppProps {
  children1: JSX.Element; // 不推荐, 没有考虑数组
  children2: JSX.Element | JSX.Element[]; // 不推荐, 没有考虑字符串 children
  children3: React.ReactChild[]; // 没有考虑null, 比上面两种好一点
  children: React.ReactNode; // 包含所有 children 的情况
  functionChildren: (name: string) => React.ReactNode; // 返回React节点的函数
  style?: React.CSSProperties; // 推荐, 在内联 style 时使用
}
```
#### 函数式组件

最简单的如下:
```
interface AppProps = { message: string };

const App = ({ message }: AppProps) => <div>{message}</div>;
```
  上面是基本的函数, 但是如果我们利用 React.FC 内置类型的话, 不仅仅会包含我们定义的 AppProps, 还会自动加上一个 children 的类型, 以及其他组件上会出现的类型: 

  React.FC 内置类型 等同于 如下代码:
```
AppProps & {
  children: React.ReactNode
  propTypes?: WeakValidationMap<P>;
  contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<P>;
  displayName?: string;
}

// 使用demo如下

interface AppProps = { message: string };

const App: React.FC<AppProps> = ({ message, children }) => {
  return (
    <>
      {children}
      <div>{message}</div>
    </>
  )
}
```
#### React + TypeScript demo 实践

新建项目, 命令如下: 
```
npx create-react-app hook-ts-demo --template typescript
```
  在 src/example.tsx 编写我们的组件, 代码如下:
```
import React from 'react';

type UserInfo = {
  name: string,
  age: number,
};

export const User = ({ name, age }: UserInfo) => {
  return (
    <div className="app">
      <p>{ name }</p>
      <p>{ age }</p>
    </div>
  )
}
```
  在 src/App.tsx 内引用我们的组件, 代码如下:
```
import { User } from './example';

function App() {
  return (
    <div className="App">
      <User name="kongzhi" age={34} />
    </div>
  );
}

export default App;
```
  如上是函数式组件的使用, 我们也可以通过使用有类型约束的函数式组件, src/example.tsx 代码改为如下:
```
import React from 'react';

type UserInfo = {
  name: string,
  age: number,
};

export const User:React.FC<UserInfo> = ({ name, age }) => {
  return (
    <div className="user">
      <p>{name}</p>
      <p>{age}</p>
    </div>
  )
}
```
如上代码中不同之处在于:
```
export const User = ({ name, age }: UserInfo)  => {}
export const User:React.FC<UserInfo> = ({ name, age }) => {}
```
  使用函数式组件时需要将组件申明为 React.FC 类型, 也就是 Functional Component. 使用 React.FC 的方式创建我们的有类型约束的函数式组件, 它支持children的传入, 代码如下:

  src/example.tsx 代码如下:
```
import React from 'react';

type UserInfo = {
  name: string,
  age: number,
  children: any,
};

export const User:React.FC<UserInfo> = ({ name, age, children }) => {
  return (
    <div className="user">
      <p>{name}</p>
      <p>{age}</p>
      <p>{children}</p>
    </div>
  )
}
```
  src/App.tsx 代码如下:
```
import { User } from './example';

function App() {
  return (
    <div className="App">
      <User name="kongzhi" age={34}>I am children text!</User>
    </div>
  );
}

export default App;
```
#### 1) useState

  useState 函数式组件可以拥有状态管理特性, 类似与class组件中的 this.state 和 this.setState, 但是使用 useState 更加的简洁.

  怎么使用 useState ?
```
const [count, setCount] = useState<number>(0);
```
#### 1) 参数为基本类型时

  src/example.tsx 代码如下:
```
import React, { useState } from 'react';

const Counter:React.FC<{ initial: number }> = ({ initial = 0}) => {
  const [count, setCount] = useState<number>(initial)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>加</button>
      <button onClick={() => setCount(count - 1)}>减</button>
    </div>
  ) 
}

export default Counter;
```
src/App.tsx 代码调用如下:
```
import React from 'react';
import Counter from './example';

function App() {
  return (
    <div className="App">
      <Counter initial={10} />
    </div>
  );
}

export default App;
```
#### 2) 参数为对象类型时的使用

src/example.tsx 代码如下:
```
import React, { useState } from 'react';

type ArticleInfo = {
  title: string,
  content: string,
};

const Article:React.FC<ArticleInfo> = ({title, content}) => {
  const [article, setArticle] = useState<ArticleInfo>({title, content});
  return (
    <div>
      <p>Title: {article.title}</p>
      <p>{article.content}</p>
      <button onClick={() => setArticle({
        title: '下一篇',
        content: '下一篇内容',
      })}>下一篇</button>
    </div>
  )
}

export default Article;
```
src/App.tsx 调用代码如下:
```
import React from 'react';

import Article from './example';

function App() {
  return (
    <div className="App">
      <Article  title = 'kongzhi' content = 'xxxx' />
    </div>
  );
}

export default App;
```
在我们上面的参数为对象类型时, setXxx 并不会像 this.setState 合并旧的状态, 它是完全替代了旧的状态, 所以我们要实现合并, 我们可以这样写:
```
setArticle({
  title: '下一篇',
  content: '下一篇内容',
  ...article
});
```
#### 2) useEffect

  useEffect 的作用我们可以看作是 componentDidMount, componentDidUpdate 和 componentWillUnmount 这三个函数的组合.

#### 2.1) 每当状态改变时, 都要重新执行 useEffect 的逻辑

  src/example.tsx 代码如下:
```
import React, { useState, useEffect } from 'react';

let switchCount: number = 0;

const User = () => {
  const [name, setName] = useState<string>('');
  useEffect(() => {
    switchCount += 1; // 每次name值发生改变时候, switchCount 在原来基础上增加1
  })
  return (
    <div>
      <p>Current Name: { name }</p>
      <p>switchCount: { switchCount }</p>
      <button onClick={() => setName('Jack')}>Jack</button>
      <button onClick={() => setName('Marry')}>Marry</button>
    </div>
  )
}

export default User;
```
src/App.tsx 代码如下:
```
import React from 'react';
import logo from './logo.svg';
import './App.css';

import User from './example';

function App() {
  return (
    <div className="App">
      <User />
    </div>
  );
}

export default App;
```
#### 2.2) 即使每次状态都改变, 也只执行第一次 useEffect 的逻辑
```
useEffect(() => {
  switchCount += 1;
}, []);
```
#### 2.3) 根据某个状态是否变化来决定要不要重新执行

  src/example.tsx 代码如下:
```
const [name, setName] = useState<string>('I never change');
useEffect(() => {
  switchCount += 1; // 每次name值发生改变时候, switchCount 在原来基础上增加1
}, [name]);
```
因为name我们不会去任何地方改变它的值,所以末尾添加了 [name] 后, useEffect 内的逻辑也只会执行第一次.

#### 2.4) 组件卸载时处理一些内存问题, 比如清除定时器, 清除事件监听.
```
useEffect(() => {
  const handler = () => {
    document.title = Math.random().toString()
  }

  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('resize', handler)
  }
}, []);
```
#### 3) typescript 定义对象/数组/函数

#### 3.1) 对象
```
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
};
```
#### 可选属性:
```
interface Person {
  name: string;
  age?: number;
}

let tom: Person = {
  name: 'Tom'
};
```
#### 任意属性
```
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: 'tom',
  gender: 'male'
};
```
#### 注意: 一旦我们定义了任意属性, 那么确定属性和可选属性的类型都必须是它的类型的子集.
```
interface Person {
  name: string;
  age?: number;
  [propName: string]: string; // 任意属性只包含了string的类型
}

let tom: Person = {
  name: 'Tom',
  age: 25, // age 的number 属性不存在任意属性 string 内, 会报错
  gender: 'male',
};
```
#### 只读属性
```
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  id: 111,
  name: 'Tom',
  gender: 'male'
};

tom.id = 222; // 该属性只读, 赋值操作会报错
```
#### 3.2) 数组类型

[类型 + 方括号] 表示法:
```
let fib: number[] = [1, 2, 3, 4];
```
使用数组范型表示法如下:
```
let fib: Array<number> = [1, 2, 3, 4];
```
使用接口表示数组如下:
```
interface NumberArray {
  [index: number]: number;
}

let fib: NumberArray = [1, 2, 3, 4];
```
#### 4) 函数类型

传统的定义函数的输入与输出
```
// 函数声明的写法

function sum(x: number, y: number): number {
  return x + y;
}

用接口定义函数的输入与输出

interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(source: string, subString: string) {
  return source.search(subString) !== -1;
}
```











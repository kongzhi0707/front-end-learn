### React 自定义 hook

<div id="back"></div>

- [x] [1) 什么是 hook](#id1)<br />
- [x] [2）自定义 hook](#id2) <br />
- [x] [3) 数据获取](#id3) <br />
- [x] [4) 定义 "计数器" 钩子函数](#id4) <br />
- [x] [5) 获取窗口宽高的变化](#id5) <br />
- [x] [6) 获取滚动偏移量变化](#id6) <br />
- [x] [7) 自动同步至 localStorage](#id7) <br />
- [x] [8) useStorage](#id8) <br />

#### <div id="id1"> 1) 什么是 hook？<a href="#back"> 回到顶部</a></div>

hook 是 React 16.8 的新增特性。它通常和函数式组件同时使用，可以使函数式组件在不编写 class 的情况下，可以拥有 class 组件的状态，生命周期，等功能。

#### <div id="id2"> 2）自定义 hook <a href="#back"> 回到顶部</a></div>

自定义 Hook 是使用 React Hook 函数封装和共享 有状态 逻辑的函数。自定义 Hook 可以抽象出复杂的逻辑。从而让不同的组件之间重用代码变得更加容易。
自定义 Hook 遵循特定的命名约定：必须以单词 use 开头，后跟描述性名称。比如 useFetch(用于请求 API 的自定义 hook)，或 useWindowWidth(用于获取窗口大小的自定义 Hook)。这样的约定很重要，因为它向其他开发人员表明该函数是一个 Hook。可以在其他组件中复用。同时，这种命名也让 自定义 Hook 与 普通函数实现区分。让 React 知道，这不是一个普通的函数，而是一个包含 Hook 状态的特殊函数。

遵循以下规则：

```
1）自定义Hook必须以 use 开头。
2）自定义Hook必须是一个函数，函数内部可以使用 React 的Hook。
3）自定义Hook必须返回数据或方法。
```

#### 3）自定义 Hooks 的使用场景

#### <div id="id3"> 1）数据获取 <a href="#back"> 回到顶部</a></div>

自定义 Hook 可用于从 API 获取数据并管理数据的状态。它可以帮助我们避免在必须获取相同数据的组件之间重复编写代码。

我们现在对 useFetch 的 Hook 进行封装代码如下：

```
import React, { useState, useEffect } from 'react';

const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null) as any;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [url]);
  return { data, isLoading, error };
}

export default useFetch;
```

在如上代码，首先定义了一个名为 "useFetch" 的新函数，它接收一个参数，即请求的 API 的 URL 路径，在函数内部，使用 useState Hook 来管理数据状态，isLoading 表示是否在请求中，error 表示是否出现错误，data 则用来保存请求的数据。函数中还使用了 useEffect Hook 以实现从 API 获取数据并在 URL 更改时更新状态。

#### 使用 useFetch Hook

上面我们已经定义了 useFetch Hook，接下来可以在组件内部使用它了。现在我们创建一个名为 UserList 的新组件，并使用 useFetch Hook 从 API 获取数据并在列表中显示。

```
import useFetch from './useFetch';

const UserList = () => {
  const { data, isLoading, error } = useFetch('https://xxxx');
  if (isLoading) {
    return <p>Loading....</p>
  }
  if (error) {
    return <p>{error.message}</p>
  }
  return (
    <ul>
      {
        data.map((user) => {
          <li key={user.id}>{user.name}</li>
        })
      }
    </ul>
  )
}

export default UserList;
```

在如上代码中，我们首先引入了 useFetch Hook，并在 UserList 组件内部使用它来从 API 获取数据，然后通过检查 isLoading 和 error 的状态来处理数据获取的不同状态，最后，通过遍历数据数组，并在列表中显示每个用户的名称。

#### <div id="id4"> 2) 定义 "计数器" 钩子函数 <a href="#back"> 回到顶部</a></div>

要将计数器的逻辑用到自定义 Hook 中，这个钩子函数有以下能力；

```
1）可以获取当前计数器的值。
2）能通过钩子函数给计数器增加值；
3）能通过钩子函数给计数器减少值。
```

根据如上三个需求，我们可以实现下面的自定义 Hook。

```
import { useState } from 'react';
// 定义自定义Hook的返回值类型
type UseCounterReturnType = [count: number, increment: () => void, decrement: () => void];

// 定义自定义 Hook

export default function useCounter(initialCount: number = 0): UseCounterReturnType {
  // 使用 useState 来初始化 count 状态 和 setCount 函数
  const [count, setCount] = useState(initialCount);

  // 定义 increment 函数， 用于增加计数器的值
  const increment = () => {
    setCount(count + 1);
  }
  // 定义 decrement 函数，用于减少计数器的值
  const decrement = () => {
    setCount(count - 1);
  }
  // 返回 count, increment, decrement 函数作为自定义Hook的返回值
  return [count, increment, decrement];
}
```

我们一般会把自定义的 Hook 方法放到一个单独的文件中维护，上面的 demo 代码是由 TS 实现一个 useCounter 函数。自定义 Hook 的函数名必须是 use 开头的。该自定义函数中，定义了一个状态 Count 用来记录计数器的值，同时定义了两个函数用来增加计数器的值和减少计数器的值。在函数最后，将他们放在一个数组中返回出去。

#### 使用 "计数器" 钩子函数

要使用上面的 useCounter ,只需要像使用其他 Hook 一样调用即可。

```
import useCounter from "./useCounter";

function MyComponent(): JSX.Element {
  const [count, increment, decrement] = useCounter(10);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>increment</button>
      <button onClick={ decrement}>decrement</button>
    </div>
  )
}

export default MyComponent;
```

如上代码，我们在调用 useCounter 时给计数器设置了一个默认值 10，当我们点击页面上的 increment 按钮时，计数器加 1，点击页面上的 decrement 按钮时，计数器减 1.

#### <div id="id5"> 3）获取窗口宽高的变化 <a href="#back"> 回到顶部</a></div>

通过 useWindowSize() 来实时获取窗口的宽高

新建一个 hook 文件 useWindowSize.ts, 代码如下：

```
import { useEffect, useState } from "react";

// 定义size对象
interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = () => {
  const [size, setSize] = useState<WindowSize>({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  })
  useEffect(() => {
    const func = () => {
      setSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      })
    }
    window.addEventListener('resize', func);
    return () => {
      window.removeEventListener('resize', func);
    }
  }, []);
  return size;
}

export default useWindowSize;
```

组件如下调用即可：

```
import useWindowSize from "./useWindowSize";

function App() {
  const size = useWindowSize();
  return (
    <div>
      <div>页面的宽度: {size.width} </div>
      <div>页面高度: { size.height}</div>
    </div>
  )
}

export default App;
```

在浏览器窗口缩放的时候，页面上的数据可随时获取新的数据。

#### <div id="id6"> 4）获取滚动偏移量变化 <a href="#back"> 回到顶部</a></div>

目标，自定义 useWindowScroll() 来实时获取页面的滚动偏移量。

新建一个 useWindowScroll.ts 文件，代码如下：

```
import { useEffect, useState } from "react";

// 定义偏移量对象

interface ScrollOffset {
  x: number,
  y: number,
}

const useWindowScroll = () => {
  const [off, setOff] = useState<ScrollOffset>({
    x: window.scrollX,
    y: window.screenY
  });
  useEffect(() => {
    const func = () => {
      setOff({
        x: window.scrollX,
        y: window.scrollY,
      })
    }
    // 监听
    window.addEventListener('scroll', func);
    return () => {
      // 移除监听
      window.removeEventListener('scroll', func);
    }
  })
  return off;
}

export default useWindowScroll;
```

组件中如下调用：

```
import useWindowScroll from "./useWindowScroll";

function App() {
  const offset = useWindowScroll();
  return (
    <div style={{ height: '10000px', width: '10000px' }}>
      <div>滚动X: { offset.x}</div>
      <div>滚动Y: { offset.y}</div>
    </div>
  )
}

export default App;
```

#### <div id="id7"> 5）自动同步至 localStorage <a href="#back"> 回到顶部</a></div>

目标：通过 const [value, setValue] = useLocalStorage('key', 'value'), 可以传入默认的初始 value 和 key，且每次修改 value 可以自动同步到 localStorage 中。

新建一个 useLocalStorage.ts 文件， 代码如下：

```
import React, { useState, useEffect } from "react";

const useLocalStorage = (key: string, defaultValue: string): ([string, React.Dispatch<React.SetStateAction<string>>]) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [key, value])
  return [value, setValue];
}

export default useLocalStorage;
```

组件使用如下：

```
import useLocalStorage from "./useLocalStorage";

function App() {
  const [value, setValue] = useLocalStorage('key', 'react');
  return (
    <div>
      <button onClick={() => {
        setValue('vue');
      }}>点击</button>
      <div>{ value }</div>
    </div>
  )
}

export default App;
```

#### <div id="id8"> 6）useStorage <a href="#back"> 回到顶部</a></div>

前端数据存储离不开 localStorage 和 sessionStorage，那么现在可以把他们写成一个自定义 Hook。

useStorage.ts 代码如下：

```
import { useCallback, useState, useEffect } from "react";

export function useLocalStorage(key: string, defaultValue: any) {
  return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage(key: string, defaultValue: any) {
  return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage(key: string, defaultValue: any, storageObject: any) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue !== null) return JSON.parse(jsonValue);

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return defaultValue;
    }
  })
  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value))
  }, [key, value, storageObject]);

  return [value, setValue];
}
```

使用方式如下：

```
import useLocalStorage from "./useLocalStorage";

export default function StorageComponent() {
  const [age, setAge] = useLocalStorage("age", '26');
  return (
    <div>
      <div>{ age }</div>
      <button onClick={() => setAge('40')}>Set Age</button>
    </div>
  )
}
```

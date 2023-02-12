
### 理解useLayoutEffect的用法

useLayoutEffect 与 useEffect 名字很像，用法也大致类似，但是两者执行时机不同：
```
1）useEffect 是异步执行的，而useLayoutEffect是同步执行的。
2）useEffect的函数会在组件渲染到屏幕之后执行，useLayoutEffect 则是在DOM结构更新后，渲染前执行，相当于可以防抖效果。
```
根据上面特性，如果我们在useEffect中瞬时连续更新某个状态，那么页面会发生多次渲染。如下代码：
```
import React, { useState, useEffect, useLayoutEffect } from 'react';

export default function App() { 
  const [value, setValue] = useState(0);

  useEffect(() => { 
    if (value === 0) { 
      setValue(10 + Math.random() * 200);
    }
  }, [value]);
  console.log('--render---', value);
  return (
    <div onClick={() => setValue(0)}>value: { value }</div>
  )
}
```
  当我们点击div的时候，将value设为0，但是在Effect中又将其设置为一个随机值，这样就相当于value这个状态快速连续更新了两次，我们可以在控制台中看到打印了二次。也就是说value连续变更了2次。在观察页面的时候，这个div是有闪动的。这在交互和性能上需要避免的。该demo的执行顺序如下：
```
1）click setState(value)
2) 虚拟DOM设置到真实DOM上。
3）渲染
4）执行useEffect的回调。
5）setState（value）
6) 虚拟DOM设置到真实DOM上。
7）渲染
```
  我们可以再使用 useLayoutEffect 做如下demo， 代码如下：
```
import React, { useState, useEffect, useLayoutEffect } from 'react';

export default function App() { 
  const [value, setValue] = useState(0);

  useLayoutEffect(() => { 
    if (value === 0) { 
      setValue(10 + Math.random() * 200);
    }
  }, [value]);
  console.log('--render---', value);
  return (
    <div onClick={() => setValue(0)}>value: { value }</div>
  )
}
```
  这里也打印了2次，和上面的一样，但是页面没有出现闪动，是正常渲染的。这是两者最主要区别。

  该组件的执行顺序如下：
```
1）click setState(value)
2) 虚拟DOM设置到真实DOM上。
3）执行useLayoutEffect回调。
4）setState(value)
5) 虚拟DOM设置到真实DOM上。
6）渲染。
```
  只会执行一次页面渲染。

  我们可以看如下demo，效果更明显， 默认页面渲染为 hello world，当我点击下后，会变为 world hello. 再继续点击， 先变成 hello world，再变成 world hello， 有一个闪动的过程。如下代码：
```
import React, { useState, useEffect, useLayoutEffect } from 'react';

export default function App() { 
  const [value, setValue] = useState("hello world");

  useEffect(() => {
    let i = 0;
    while(i <= 100000000) {
      i++;
    };
    setValue("world hello");
  }, [value]);

  console.log('--render---', value);
  return (
    <div onClick={() => setValue("hello world")}>value: { value }</div>
  )
}
```
  下面我们把代码改成使用 useLayoutEffect ，页面就没有闪动的效果， 如下代码：
```
import React, { useState, useEffect, useLayoutEffect } from 'react';

export default function App() { 
  const [value, setValue] = useState("hello world");

  useLayoutEffect(() => {
    let i = 0;
    while(i <= 100000000) {
      i++;
    };
    setValue("world hello");
  }, [value]);

  console.log('--render---', value);
  return (
    <div onClick={() => setValue("hello world")}>value: { value }</div>
  )
}
```
  如上的demo， 效果很明显。因为 useEffect 是渲染完之后异步执行的，所以会导致 hello world 先渲染到屏幕上，再变成 world hello, 就会出现闪烁现象。而 useLayoutEffect 是渲染之前同步执行的，所以会等到执行完再渲染上去，就避免了闪烁现象。也就是我们最后把操作dom的相关操作放在 useLayoutEffect中去，可以避免闪烁。

  但是 useLayoutEffect 是不会再服务器端执行的，所以会导致ssr渲染出来的内容和实际的首屏的内容不一致，我们解决这个问题也很简单：
```
1）放弃使用 useLayoutEffect， 使用 useEffect 代替。
2）如果我们知道 useLayoutEffect 对首屏渲染并没有什么影响，但是后续会需要，我们可以这样写代码：
```
```
import { useEffect, useLayoutEffect } from 'react';
export const useCustomLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```








### 理解 Render Props

搭建React环境。使用命令：
```
$: npx create-react-app demo1
$ cd demo1
```
目录结构如下：
```
|--- demo1
| |--- src
| | |--- App.js
| | |--- Toggle.js
```
src/Toggle.js 代码如下：
```
import React, { useState } from 'react';

export const Toggle = props => { 
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  return (
    <div>
      {on && <h1>{props.children}</h1>}
      <button onClick={ toggle }>show/hide</button>
    </div>
  )
}

export default Toggle;
```
src/App.js 代码如下：
```
import React from 'react';
import Toggle from './Toggle';

function App() {
  return (
    <div>
      <Toggle>Hello World</Toggle>
    </div>
  )
}

export default App;
```
  如上 Toggle 组件，是用来切换 h1 的显示和隐藏的。点击button来显示和隐藏的。App.js 是父组件， Toggle.js 是子组件。
  那如果能把 on 和 toggle 传递给父组件的话，子组件在里面用，子组件提供食材，那么 render prop 就生成了。

  比如如下的函数组件，有如下两种方式来调用渲染：
```
function Render = ({on, toggle}) => {
  return (
    <div>Hello World</div>
  );
}

// 1. 函数调用
Render({ on, toggle }); // props 通过对象传参

// 2. jsx 的方式
<Render on={on} toggle={toggle} />
```
  有了如上两种方式的调用思路，我们可以把代码稍微改造下，

Toggle.js 代码改为如下：
```
import React, { useState } from 'react';

export const ToggleRenderProps = props => { 
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  const { Render } = props;
  return (
    <div>
      {
        Render({on, toggle})
      }
      <Render on={on} toggle={toggle} />
    </div>
  )
}

export default ToggleRenderProps;
```
App.js 改为如下：
```
import React from 'react';
import Toggle from './Toggle';

const Child = ({ on, toggle }) => (
  <>
    {on && <nav>Hello World</nav>}
    <div onClick={toggle}>click me</div>
  </>
)
function App() { 
  return (
    <div>
      <Toggle Render={ Child } />
    </div>
  )
}

export default App;
```
  如上代码，在App.js 中给 Toggle子组件传递了一个 Child的函数组件，然后子组件Toggle拿到这个函数组件，来渲染这个函数组件，函数调用和JSX调用的两种方式都可以的，那为什么这种模式叫 render props 呢？通过一个名叫 render 的 prop 传一个函数给子组件，叫子组件来渲染这个函数。而 函数 中 的 on 和 toggle 参数是哪里来的呢？这是子组件 toggle 传递过来的。

  我们可以利用 React 自带的 props.children 属性来进行改造代码，如下：

  我们上面是 props.render = 一个函数组件, 现在我们可以改造成 props.children = 一个函数组件。

  Toggle.js 代码改为如下：
```
import React, { useState } from 'react';

export const ToggleRPC = props => { 
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  const { children } = props;
  return children({
    on,
    toggle
  });
}

export default ToggleRPC;
```
  App.js 代码改为如下：
```
import React from 'react';
import ToggleRPC from './Toggle';

function App() { 
  return (
    <div>
      <ToggleRPC>
        {
          ({ on, toggle }) => (
            <div>
              {on && <h1>Show me</h1>}
              <button onClick={ toggle }>Show / Hide</button>
            </div>
          )
        }
      </ToggleRPC>
    </div>
  )
}

export default App;
```
  然后页面可以实现一样的效果。





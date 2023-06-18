
### 组件开发方式

<div id="back"></div>

- [1) 样式型组件](#id1) <br />
- [2) 结构型组件](#id2) <br />
- [3）组合型组件](#id3) <br />
- [4. 表单非受控组件](#id4) <br />
- [5）表单受控组件](#id5) <br />

基于React的组件化开发方式, 社区逐渐形成了稳定的组件规范, 从API层面上归纳出6种组件类型. 分析其优缺点和适用场景, 然后结合自己的组件选择一种组件类型进行开发. 6种类型分别为 结构型类型/样式型类型/组合型类型/配置型类型/受控型组件/非受控组件.

#### <div id="id1">1) 样式型组件 <a href="#back"> 回到顶部</a></div>

样式型组件 确定了组件的结构细节,外部只需传递参数即可渲染预期样式. 样式型组件是较为常用的组件类型, 一般我们都是根据设计稿来完成对应的功能和展示的. 缺点是:
样式组件在复用性和拓展性比较偏弱. 它只会根据目前的设计稿来实现对应的功能, 开发者不会根据设计稿改变推断组件未来的改动. 优点是：样式型组件固定的API可以减低使用成本。

样式型组件确定了组件结构细节，要展示的数据作为props。如下：
```
class Test extends React.Component {
  render() {
    return <Child title="this is a title" description="description..." />
  }
}

class Child extends React.Component {
  render() {
    const { title, description } = this.props;
    return (
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div>other content...</div>
      </div>
    )
  }
}

export default Test;
```
#### <div id="id2">2) 结构型组件 <a href="#back"> 回到顶部</a></div>

结构型组件定义了组件大体结构。结构的具体实现由外部传递。比如 Modal 弹窗等应抽象出结构型组件。
```
interface ModalProps {
  title: React.ReactNode;
  content: React.ReactNode;
}

<Modal title={<h2>Title</h2>} content={<input type="text"/>} />
```
结构型组件可以显著降低业务方的沟通成本与接入风险。结构型组件弹性的API设定可以提供扩展性。

比如设计页面头部组件，组件结构如下：左右两栏；左侧是标题，右侧是操作区，代码如下：

抽象出组件之前：
```
<div className="page-header">
  <span className="page-header-title">title</span>
  <span className="page-header-extra">
    <Button>btn1</Button>
    <Button>btn2</Button>
  </span>
</div>
<div className="page-header">
  <span className="page-header-title">
    <Avatar icon={<UserAddOutlined />} />
  </span>
  <span className="page-header-extra">
    <Checkbox>demo1</Checkbox>
  </span>
</div>
```
如果多个页面使用页面头部则需要写多份样式代码，结构部分也要写多份，因此我们可以将 页头部分 抽象成 公共组件：
```
class PageHeader extends React.Component {
  render() {
    const { title, extra } = this.props;
    return (
      <div className="page-header">
        <span className="page-header-title">{title}</span>
        <span className="page-header-extra">{extra}</span>
      </div>
    )
  }
}
```
PageHeader 组件的使用：
```
<PageHeader title="title" extra={[<Button>btn1</Button>, <Button>btn2</Button>]} />
<PageHeader title={<Avatar icon={<UserAddOutlined />} />} extra={<Checkbox>demo1</Checkbox>} />
```
这样 PageHeader 组件抽象出公共组件实现了结构和样式的复用。

#### <div id="id3">3）组合型组件<a href="#back"> 回到顶部</a></div>

通过组件间嵌套，多用于通用组件库。组合型组件以JSX为主体，通过组件间的嵌套组合描述业务逻辑。组合型组件结构清晰，扩展性高，组件使用者通过阅读 JSX 的 render函数即可了解业务逻辑，但是组件间的联系微弱，ref引用相互隔离，难以构建复杂的交互组件。
```
/* 组合型组件 */
<Select defaultValue="xxx">
  <Select.Option value="yyy">yyy</Select.Option>
  <Select.Option value="zzz">zzz</Select.Option>
</Select>
```
举列来说，比如Tabs组件，它是由 Tab 和 TabItem 组成，点击每个TabItem，该 TabItem 会高亮，那么Tab 和 TabItem 自然要进行沟通。写法可能会像如下这样的：
```
<TabItem active={true} onClick={this.onClick}>One</TabItem>
<TabItem active={false} onClick={this.onClick}>Two</TabItem>
<TabItem active={false} onClick={this.onClick}>Three</TabItem>
```
缺点有如下：

1）每次使用 TabItem 都要传递一堆 props。
2）每增加一个新的 TabItem, 都要增加对应的 props。

我们希望像如下使用：
```
<Tabs>
  <TabItem>One</TabItem>
  <TabItem>Two</TabItem>
  <TabItem>Three</TabItem>
</Tabs>
```
组件之间通过隐秘的方式进行通信，这里的隐秘实际上是对props的操作在一个地方进行管理。

#### 实现

TabItem 组件有两个关键的props：active(表明当前是否应该高亮)，onTabClick(自己被点击时调用的回调函数)，TabItem 由于是每个Tab页面的容器，它只负责把 
props.children渲染出来。所以用函数式组件即可：
```
export const TabItem = props => {
  const { active, onTabClick, children } = props;
  const style = {
    color: active ? 'red' : 'green',
    cursor: 'pointer'
  };
  return <>
    <h1 style={style} onClick={onTabClick}>{children}</h1>
  </>
}
```
使用组件时要避免传递props的缺点，因此我们需要在Tabs组件进行传递，代码如下：
```
class Tabs extends React.Component {
  state = {
    activeIndex: 0
  }
  render() {
    const { activeIndex } = this.state;
    const newChildren = React.Children.map(this.props.children, (child, index) => {
      if (child.type) {
        // 复制并修改 children
        return React.cloneElement(child, {
          active: activeIndex === index,
          onTabClick: () => this.setState({ activeIndex: index })
        })
      } else {
        return child;
      }
    })
    return <div className="tabs">{newChildren}</div>
  }
}
```
React.Children.map: 是对 props.children 进行遍历。
React.cloneElement：可以复制某个元素，第一个参数是被复制的元素，第二个参数我们可以把想传入的props加进去。因此我们将 active 和 onTabClick 传入，最终实现效果。

#### <div id="id4">4. 表单非受控组件 <a href="#back"> 回到顶部</a></div>

什么是非受控组件呢？

官方定义是：要编写一个非受控组件，而不是为每个状态更新都编写数据处理函数。我们可以使用 ref 来从DOM节点中获取表单数据。

我们可以用ref来获取DOM元素中的值，比如input标签绑定ref通过ref给值赋值，这个是不可控的。

1）非受控组件即不受状态的控制，获取数据就是相当于操作DOM。
2）非受控组件的好处是很容易和第三方组件结合。

#### 第一种方式是函数

在虚拟DOM节点上使用ref，并使用函数，将函数的参数挂载到实例的属性上。

代码可以看如下：
```
export default class App extends React.Component {
  handleSubmit = (e) => {
    // 阻止原生默认事件的触发
    e.preventDefault();
    console.log(this.username.value); // 输出值
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {
          /* 将真实的DOM，username是输入框中输入的值赋值给组件实例上
             这样，在页面表单提交的时候就可以通过this.username.value获取到输入框输入的值
          */
        }
        用户名: <input name="username" type="text" ref={username => this.username=username}>
      </form>
    )
  }
}
```
#### 第二种方式：通过构造函数声明方式

实现方式如下：
```
1）实列的构造函数 constructor 这创建一个引用。
2）在虚拟DOM节点上声明一个ref属性，并且将创建好的引用赋值给这个ref属性。
3）react会自动将输入框中输入的值放在实例属性上。
```
基本代码演示如下：
```
export default class App extends React.Component {
  constructor() {
    super();
    // 在构造函数中创建一个引用
    this.ref = React.createRef();
  }
  handleSubmit = (e) => {
    // 阻止原生默认事件的触发
    e.preventDefault();
    console.log(this.ref.current.value); // 打印出值
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        密码<input name="password" type="text" ref={this.ref} />
      </form>
    )
  }
}
```
#### <div id="id5">5）表单受控组件 <a href="#back"> 回到顶部</a></div>
```
1）表单元素依赖于状态，表单元素需要默认值实时映射到状态的时候，就是受控组件，和vue中的数据双向绑定效果类似。
2）受控组件只有继承 React.Component 才会有状态。
3）受控组件必须要在表单上使用 onChange事件来绑定对应的事件
```
代码如下：
```
class App extends React.Component {
  state = {
    username: 'kongzhi',
    pwd: "123456"
  }
  // e 为原生的事件绑定对象
  handleChange = (e) => {
    // 获取原生对象上的属性
    let name = e.target.name;
    // 根据表单元素的name名称进行匹配，比如用户名的name是username，那新输入的值将更新原来的值
    this.setState({
      [name]: e.target.value
    })
  }
  render() {
    return (
      <div>
        <p>{this.state.username}</p>
        用户名: <input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
        <p>{this.state.pwd}</p>
        密码: <input name="pwd" type="text" value={this.state.pwd} onChange={this.handleChange} />
      </div>
    )
  }
}
```
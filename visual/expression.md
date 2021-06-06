
### 实现表达式计算 逻辑思路

要实现如下表达式计算功能，我们要该如何做？默认情况下，如下图：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606160346253-1427486551.jpg" />

我们进行左侧树形菜单拖动到右侧文本域中，进行表达式计算，如下图：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606160508852-1323531022.jpg" />

demo的目录结构如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606160556574-643137628.jpg" />

#### 注意，我这边只是做demo，没有过多的去组织目录结构。

大致的目录结构如下：
```
|--- components
| |--- datas 目录，             # 该目录是存放模拟接口返回的json数据的
| |--- deviceTypeNodes         # 该目录是左侧树形菜单的代码
| |--- monitorItemExpression   # 该目录是处理表达式的主要功能
| | ｜--- index.js
| |--- arithmetic.js           # 封装算术表达式功能
| |--- relations.js            # 封装关系表达式的功能
| |--- logic.js                # 封装逻辑表达式的功能
| |--- dragSource.js           # 封装拖动源目标
| |--- baseExp.js              # 生成拖动源的html的内成运算符的html的元素
| |--- container.jsx           # 被拖动源的html标签元素
| |--- contentEditable.jsx     # 生成文本框的标签html元素
| |--- parse.js                # 对接口返回数据进行解析的js方法
| |--- utils.js                # 公用的一些方法
| |--- connectDragSource.js    # 链接拖动源
| |--- connectDropTarget.js    # 拖动的目标是否能被放置，可以理解为放置目标元素上
```
实现上述功能最主要使用到的技术是：react-dnd 拖动API，及 babel 抽象语法树 转换。
react-dnd 使用介绍，看<a href="https://github.com/kongzhi0707/front-end-learn/blob/master/visual/react-dnd.md">这篇文章</a>

#### 渲染html元素

1. 首先我们看下拖动到目标框在页面中渲染的html元素如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606160634793-1984797686.jpg" />

2. 其次我们看下，算数表达式/关系表达式/逻辑表达式分别渲染的html元素如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606160703846-1784840642.jpg" />

我们想要实现上述功能，我们需要实现最基本的结构。因此在我项目中的入口文件index.jsx，添加如下代码：
```
export default class Index extends Component {
  render() {
    const { expression, saveExpression, callbackItemDefinitions } = this.state;
    return (
      <div>
        <DragDropContextProvider backend={HTML5Backend}>
          <div>
            <DeviceTypeNodes
              sourceName="label"
              fromIt={false}
              deviceType={undefined}
              subjectType={undefined}
            >
            </DeviceTypeNodes>
            <div className="config-context">
              <Button type="primary" className="new-add-or-btn" onClick={this.handleAddMonitor}>
                新增表达式
              </Button>
              <div className="local-expression">
                <MonitorItemExpression 
                  expressionItem = { expression }
                  parentHandler = { this.parentHandler }
                  saveExpression = { saveExpression }
                  callbackItemDefinitions = { callbackItemDefinitions }
                />
              </div>
              <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px', marginLeft: '45%'}}>保存</Button>
            </div>
          </div>
        </DragDropContextProvider>
        
      </div>
    );
  }
}
```
  DeviceTypeNodes 组件是左侧树形菜单功能代码不用看。这个树形菜单用一些ui组件弄下很简单，只要满足树形菜单的数据格式就会渲染出来。
  MonitorItemExpression 组件就是我们需要处理的表达式主要功能代码。

页面上有个按钮，新增表达式，点击该按钮就会新增一项，会调用页面中 handleAddMonitor 方法。该方法大致的实现代码如下：
```
import _ from 'lodash';
// 新增或操作
handleAddMonitor = () => {
  console.log('----向上或向下----', this.state);
  const { defaultExpression } = this.state;
  this.state.expression.push({
    data: [_.cloneDeep(defaultExpression)],
    conditon_type: '',
    conditon_type_value: '',
    conditon_deviceName: '',
    conditon_deviceName_value: '',
  });
  this.setState({
    expression: this.state.expression,
  });
}
// 子组件调用父组件的方法
parentHandler = (expression, saveExpression) => {
  this.setState({
    expression: _.cloneDeep(expression),
    // saveExpression: _.cloneDeep(saveExpression)
  });
}
```
新增多项就是存入数组expression里面去，然后重新渲染MonitorItemExpression组件，就会在该组件下渲染出多项。

MonitorItemExpression组件大致的代码如下：
```
export default class MonitorItemExpression extends Component {
  render() {
    const { expressionItem } = this.props;
    return <div className="expression-div">
      {
        expressionItem.map((pItem, pIndex) => {
          const isAllRemove = pItem.isAllRemove;
          return (
            <div className="monitor-subItem" style={{ display: isAllRemove ? "none" : "block" }}>
              <div className="expression-left">
                <Form>
                  <Form.Item>
                    <Select placeholder="请选择关联项"
                      style={{ width: 160 }}
                      dataSource={relationshipItemArrs}
                      value={pItem.conditon_type_value}
                      onChange={ (value, item) => {
                        this.conditonType(item, pIndex);
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Combobox
                      placeholder="请选择"
                      style={{ width: 160 }}
                      dataSource={ pItem.deviceTypeLists }
                      value={ pItem.conditon_deviceName && pItem.conditon_deviceName.split(',') }
                      multiple
                      onChange = { (value, item) => {
                        this.conditonValue(item, pIndex);
                      }}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className="expression-right">
                {
                  pItem && pItem.data && pItem.data.map((item, index) => {
                    let curItem = item;
                    if (item) {
                      if (item.conditionDefinition || item.definition) {
                        curItem = item.definition || item.conditionDefinition;
                      }
                    }
                    const isShow = !curItem || (curItem && !curItem.isDeleted && !curItem.isAlreadyRemove);
                    return (
                      <div className="r-container" style={{ display: isShow ? 'block' : 'none' }}>
                        <DropTarget primaryKey={['root']}>
                          <Container onClear={() => {
                            this.handleClear(pIndex, index);
                            }} className="next-input next-input-multiple drop-container" hasClear value={<BaseExp value={curItem} onChange={this.handleChange} index={pIndex} subIndex={index} />}
                            style={{ marginRight: '20px', display: 'block', width: 'auto' }} placeholder="请从左侧引用测点，下方拖动表达式进行编辑" onChange={this.handleChange} index={pIndex} subIndex={index} />
                        </DropTarget>
                        <Icon type="ashbin-o" size="small" onClick={() => {
                          this.removeSubItem(pIndex, index)
                        }}></Icon>
                        {
                          index === 0 && (index === pItem.data.length - 1) ? '' : (index === 0 ? <Icon type="shebeishangxian" size="small" onClick={() => {
                            this.moveDown(pIndex, index)
                          }} /> : (index === pItem.data.length - 1 ? <Icon type="shebeixiaxian" size="small" onClick={() => {
                            this.moveUp(pIndex, index)
                          }} /> : <span><Icon type="shebeixiaxian" size="small" onClick={() => {
                            this.moveUp(pIndex, index)
                          }} /><Icon type="shebeishangxian extra-direction" size="small" onClick={() => {
                            this.moveDown(pIndex, index)
                          }} /></span>))
                        }
                        {
                          index === pItem.data.length - 1 ? <Icon type="add-circular" className={index === 0 && (index === pItem.data.length - 1) ? 'add-circular2' : ''} size="small" onClick={() => {
                            this.addItem(pIndex, index)
                          }} /> : ''
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
      <div style={{ marginTop: 4 }} className="flex symbols">
        <Arithmetic />
        <Relation />
        <Logic />
      </div>
    </div>
  }
}
```
代码大致的意思是：

1. 通过遍历父组件传进来的expressionItem参数，来渲染页面中多项表达式的功能。但是某一项表达式又可能有多项子表达式，因此我们需要构造
多维数组的形式，比如如下的数据结构：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161050413-1525943216.jpg" />

也就是说新增多项的话，如果是全局新增多项的话。那么json数组可能会构造成如下数据结构：
```
[
  {
    conditon_deviceName: '',
    conditon_deviceName_value: '',
    conditon_type: '',
    conditon_type_value: '',
    data: [null, null]
  },
  {
    conditon_deviceName: '',
    conditon_deviceName_value: '',
    conditon_type: '',
    conditon_type_value: '',
    data: [null]
  }
]
```
如上 conditon_deviceName/conditon_deviceName_value/conditon_type/conditon_type_value 几个值不用管，这几个值就是保存
左侧下拉框的值。如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161127672-367070599.jpg" />

最主要是data里面的数据。目前只是新增多项表达式输入框，并没有在输入框内部拖动元素，所以页面初始化的数据结构data数组
的值为 null, 这样的，因此在 MonitorItemExpression组件 遍历数据的时候，会遍历data数组，如果有多项的话，说明某一项表达式中又有
多项子表达式。

#### 运算符如何渲染？

如上看完这些后，了解基本的渲染后，我们再来看下 算术表达式/关系表达式/逻辑表达式 他们是如何分别渲染的。针对该三个表达式，我分别使用
了三个js抽离出来。分别为 arithmetic.js(算术表达式)/relations.js(关系表达式)/logic.js(逻辑表达式)。

#### arithmetic.js(算术表达式) 代码如下：
```
import React, { Component } from 'react';
import { Card, Button } from 'xxx'; // xxx 代表的是某UI框架
import Source from '@components/dragSource';
import ConnectDragSource from '@components/connectDragSource';

const dragSource = canDropIn => ConnectDragSource(Source, canDropIn);
const DragSource = dragSource('root');
const BlankDragSource = dragSource('blank');
const TextDragSource = dragSource('text');

export const regularExp = symbol => {
  return {
    value: (left, right) => {
      return `${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`
    },
    type: 'arithExp'
  }
}

export const bracketsExp = () => {
  return {
    value: () => `(BLANK$)`,
    type: 'bracketsExp'
  }
}

export const textExp = () => {
  return {
    value: () => `TEXT$`,
    type: 'text'
  }
}

export default class Arithmetric extends Component {
  render() {
    return <Card title={"算术表达式"}>
      <DragSource value={regularExp('+')}>
        <Button size="small" type="primary">+</Button>
      </DragSource>
      <DragSource value={regularExp('-')}>
        <Button size="small" type="primary">-</Button>
      </DragSource>
      <DragSource value={regularExp('*')}>
        <Button size="small" type="primary">*</Button>
      </DragSource>
      <DragSource value={regularExp('/')}>
        <Button size="small" type="primary">/</Button>
      </DragSource>
      <BlankDragSource value={bracketsExp()}>
        <Button size="small" type="primary"><span>()</span></Button>
      </BlankDragSource>
      <TextDragSource value={textExp()}>
        <Button size="small" type="primary"><span>number</span></Button>
      </TextDragSource>
    </Card>
  }
}
```
如上代码就会渲染算术表达式的结构，如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161159393-1855244293.jpg" />

#### +, -, *, / 运算符渲染值

如上我们可以看到，+, -, *, / 等这些运算符的值使用了regularExp这个方法来渲染。因为当我们拖动这四个运算符的时候，当页面没有运算符的时候，第一次
拖动的时候会渲染左右运算符，因为 +，-，*，/ 等肯定是两个元素进行运算的。第一次会渲染如下图所示的界面。如下图：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161227243-2104655219.jpg" />

最后返回的值就是这种的：`${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`

#### () 运算符渲染值

我们再看 () 括号运算符渲染，使用 bracketsExp 这个方法进行渲染的，因此会返回 `(BLANK$)` 这样的值。

#### number 运算符渲染值

我们再来看数字运算符来渲染值，如上使用 textExp方法来会渲染一个文本输入框，最后会渲染的值为 `TEXT$`, 这种类型格式的。

#### 注意：上面分别定义的 type: 'arithExp' / type: 'bracketsExp' / type: 'text' 我们会在 baseExp.js 中会对类型进行判断的，然后分别渲染不同的标签的。这个先这样理解就行了，后面会使用到的。

然后上面代码使用了 @components/dragSource 这个组件代码 和  @components/connectDragSource 及 @components/config。分别
对应的js文件为 dragSource.js / connectDragSource.js / config.js.

#### dragSource.js 最主要做的事情是渲染被拖动的目标源html元素，基本代码如下：
```
import React, { Component } from 'react'

export default class Source extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { isDragging, connectDragSource, children } = this.props;
    const opacity = isDragging ? 0.25 : 1;
    return connectDragSource(<span style={{ opacity, cursor: 'move', display: 'inline-block' }}>{children}</span>)
  }
}
```
#### connectDragSource.js 

该js文件代码封装为链接拖动源，判断该元素是否能拖动。
```
import { DragSource } from 'react-dnd'

const source = {
  beginDrag(props, monitor, component) {
    if (!component) {
      return;
    }
    return {
      ...props,
    }
  }
}

export default (Component, type) => DragSource(type || 'aisc', source, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
})(Component)
```
如上就是 arithmetic.js(算术表达式) 的基本代码。下面也可以简单的看下 关系表达式/逻辑表达式的简单代码，其实这两个js文件代码和算术表达式的代码
基本上类似的。

#### relations.js(关系表达式)代码如下：
```
import React, { Component } from 'react';
import { Card, Button } from 'xxx'; // 某UI组件
import Source from '@components/dragSource';
import ConnectDragSource from '@components/connectDragSource';

const dragSource = canDropIn => ConnectDragSource(Source, canDropIn)
const DragSource = dragSource('root');

export const relationExp = symbol => {
  return {
    value: (left, right) => {
      return `${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`
    },
    type: 'relationExp'
  }
}

export default class Relation extends Component {
  render() {
    return <Card title="关系表达式">
      <DragSource value={relationExp('==')}>
        <Button size="small" type="primary"><span>{"=="}</span></Button>
      </DragSource>
      <DragSource value={relationExp('!=')}>
        <Button size="small" type="primary"><span>{"!="}</span></Button>
      </DragSource>
      <DragSource value={relationExp('>=')}>
        <Button size="small" type="primary"><span>{">="}</span></Button>
      </DragSource>
      <DragSource value={relationExp('<=')}>
        <Button size="small" type="primary"><span>{"<="}</span></Button>
      </DragSource>
      <DragSource value={relationExp('>')}>
        <Button size="small" type="primary"><span>{">"}</span></Button>
      </DragSource>
      <DragSource value={relationExp('<')}>
        <Button size="small" type="primary"><span>{"<"}</span></Button>
      </DragSource>
      <DragSource value={relationExp('&&')}>
        <Button size="small" type="primary"><span>{"&&"}</span></Button>
      </DragSource>
      <DragSource value={relationExp('||')}>
        <Button size="small" type="primary"><span>{"||"}</span></Button>
      </DragSource>
    </Card>
  }
}
```
如上代码类似的，对于运算符 "==" 或 "!=" 或 ">=" 或 "<=" 或 ">" 或 "<" 或 "&&" 或 "||" 等等这些运算符，如果是第一次拖动的话，一样也会渲染出 左右输入框，否则话，只会渲染出右侧的输入框。 然后返回的值和算术表达式中的 "+", "-", "*", "/"等运算符是一样的。返回值如下：
`${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`. 

#### logic.js(逻辑表达式)
```
import React, { Component } from 'react'
import { Card, Button } from 'xxx'; // 某UI组件
import Source from '@components/dragSource';
import ConnectDragSource from '@components/connectDragSource';

const dragSource = canDropIn => ConnectDragSource(Source, canDropIn)
const RegDragSource = dragSource('root')

export const regularExp = symbol => {
  return {
    value: () => `${symbol}(L$${symbol})`,
    type: 'logicExp'
  }
}

export default class Logic extends Component {
  render() {
    return <Card title="逻辑表达式">
      <RegDragSource value={regularExp('sum')}>
        <Button size="small" type="primary"><span>sum</span></Button>
      </RegDragSource>
      <RegDragSource value={regularExp('avg')}>
        <Button size="small" type="primary"><span>avg</span></Button>
      </RegDragSource>
      <RegDragSource value={regularExp('max')}>
        <Button size="small" type="primary"><span>max</span></Button>
      </RegDragSource>
      <RegDragSource value={regularExp('min')}>
        <Button size="small" type="primary"><span>min</span></Button>
      </RegDragSource>
      <RegDragSource value={regularExp('count')}>
        <Button size="small" type="primary"><span>count</span></Button>
      </RegDragSource>
    </Card>
  }
}
```
对于逻辑表达式 'sum', 'avg', 'max', 'min', 'count' 等运算符返回的值略有不同，返回的值为如下：`${symbol}(L$${symbol})`; 

#### 注意：记住上面这些返回值及type，后面我们进行拖动元素的时候会使用到该值及type判断的。

#### 理解运算符如何拖动到输入框里面去

在上面的 MonitorItemExpression 组件中，有拖动到输入框的代码，基本代码如下：
```
import Target from '@components/target';
const DropTarget = function (props) {
  let P = ConnectDropTarget(Target, props.primaryKey)
  return <P {...props}>{props.children}</P>
};

<DropTarget primaryKey={['root']}> 
  <Container onClear={() => {
    this.handleClear(pIndex, index);
    }} className="next-input next-input-multiple drop-container" hasClear value={<BaseExp value={curItem} onChange={this.handleChange} index={pIndex} subIndex={index} />}
    style={{ marginRight: '20px', display: 'block', width: 'auto' }} placeholder="请从左侧引用测点，下方拖动表达式进行编辑" onChange={this.handleChange} index={pIndex} subIndex={index} />
</DropTarget>
```
其中 target.js 代码如下：
```
import React, { PureComponent } from 'react';

const Clone = function (obj, options) {
  if (obj !== void (0) && obj.$$typeof === Symbol.for('react.element')) {
    return React.cloneElement(obj,
      { ...options }
    )
  }
  return obj;
};

export default class Target extends PureComponent {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      canDrop, isOver, connectDropTarget, children,
      className = '', onChange = e => e
    } = this.props;
    const border = canDrop && isOver ? '1px solid #2e85ff' : ''
    const transition = '0.3s border';
    return connectDropTarget(<span className={`${canDrop && isOver ? 'hover ' : ''}${className}`}>
      {
        Clone(children, {
          style: { border, transition, ...children.props.style }
        })
      }
    </span>)
  }
}
```
首先我们看到 <DropTarget primaryKey={['root']}> 这句代码的 primaryKey={['root']} 说明了什么？说明了只有 拖动源的type为root才能拖动到框里面来，其他的类型是拖动不过来的。我们再回来来看下算术表达式/关系表达式/逻辑表达式，那些运算符可以拖动过来。如下图所示：

算术表达式截图如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161707503-1418006069.jpg" />

关系表达式截图如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161731881-992080290.jpg" />

逻辑表达式截图如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161757631-2016040620.jpg" />

从上面代码，我们可以看到，只有小括号运算符 () 及 number 运算符是不能直接拖动到输入框来的。其他的运算符是可以直接拖动过来的。

拖动运算符后会对子节点进行一次克隆操作。上面代码中的 <DropTarget primaryKey={['root']}>  的子节点就是 <Container onClear={() => {}>
这代码。

container.js 代码如下：
```
import React, { Component } from 'react'
import { Icon } from '@alife/aisc';

export default class Container extends Component {
  handleClear = () => {
    this.props.onClear()
  }
  render() {
    const { style, placeholder, hasClear, className = '', onChange, value, origin, disabled } = this.props
    return <label data-v={origin} className={`${className}${hasClear ? ' clear' : ''}${disabled ? ' disabled' : ''}`} style={{ ...style, position: 'relative' }}>
        <span placeholder={placeholder}>{value}</span>
        {
          !disabled && hasClear ? <Icon type="delete-filling" onClick={this.handleClear} className="clear-icon" /> : ''
        }
      </label>
  }
}
```
如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161827249-324777019.jpg" />

#### 理解 拖动handleChange事件代码

基本代码如下：
```
handleChange = (val, component, start, end, index, subIndex) => {
  console.log('---xxx----进来了');
  index = index || 0; // 父列表索引
  subIndex = subIndex || 0; // 子列表索引
  let { expressionItem, parentHandler, saveExpression } = this.props;
  let currentCode = '';
  let expressionSingleItem = null;
  if (expressionItem[index].data[subIndex] && expressionItem[index].data[subIndex].conditionDefinition) {
    expressionSingleItem = expressionItem[index].data[subIndex].conditionDefinition;
  } else {
    expressionSingleItem = expressionItem[index].data[subIndex];
  }
  let preCode = $generate(expressionSingleItem);  
  if (typeof val === 'string') {
    currentCode = preCode.slice(0, start) + `TEXT$${val}` + preCode.slice(end, preCode.length);
  } else if (val.isLabel) {
    currentCode = preCode.slice(0, start) + `LABEL$${val.customName}$${val.customId}` + preCode.slice(end, preCode.length)
  } else {
    switch (val.type) {
      case 'arithExp':
      case 'relationExp':
        currentCode = expressionItem[index] && expressionItem[index].data[subIndex] && !component.props.empty ? val.value(false, true) : val.value(true, true);
        if (start || end) {
          currentCode = preCode.slice(0, start) + currentCode.slice(0, currentCode.length) + preCode.slice(end, preCode.length)
        } else {
          currentCode = preCode + currentCode
        }
        break
      case 'logicExp':
      case 'bracketsExp':
      case 'text':
        currentCode = val.value()
        if (start || end) {
          currentCode = preCode.slice(0, start) + currentCode.slice(0, currentCode.length) + preCode.slice(end, preCode.length)
        } else {
          currentCode = val.value()
        }
        break
      }
    }
    currentCode = charToChinese(currentCode);
    let t = babylon.parse(currentCode.replace(/\./g, 'Q'))
    t.tokens.map(o => {
      o.value = o.value ? chineseToChar(o.value) : null;
    })
    expressionItem[index].data[subIndex] = t;
    saveExpression[index].data[subIndex] = t;
    parentHandler(expressionItem, saveExpression);
}
```
如上 handleChange 事件就是我们拖动运算符及表达式的 onChange事件。那么这边第一次拖动表达式时候，返回的value值如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161855707-663457808.jpg" />

#### 算术表达式的运算符的值

因此 handleChange 的参数 val 的值如下：
```
{
  type: "arithExp",
  value: (left, right) => {
    return `${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`
  },
}
```
如上是对于算术运算符的值。

#### 关系表达式的运算符的值

如果是 关系表达式的运算符的话，那么返回的val的值就等于如下：
```
{
  value: (left, right) => {
    return `${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`
  },
  type: 'relationExp'
}
```
#### 逻辑表达式运算符的值
```
{
  return {
    value: () => `${symbol}(L$${symbol})`,
    type: 'logicExp'
  }
}
```
在 handleChange事件中使用了 index(父数组的索引) 和 subIndex(子数组的索引)。因为我们之前构造了 expressionItem 数组如下数据结构：
```
expressionItem = [{
  conditon_deviceName: ""
  conditon_deviceName_value: ""
  conditon_type: ""
  conditon_type_value: "",
  data: [null, null]
}];
```
因此会根据拖动到某一项的时候，就会对data里面的某一项添加对应的数据。

第一次进来的时候，肯定是没有值的，因此代码会进入else代码中的switch判断了，代码如下：
```
switch (val.type) {
   case 'arithExp':
   case 'relationExp':
     currentCode = expressionItem[index] && expressionItem[index].data[subIndex] && !component.props.empty ? val.value(false, true) : val.value(true, true)
    if (start || end) {
      currentCode = preCode.slice(0, start) + currentCode.slice(0, currentCode.length) + preCode.slice(end, preCode.length)
    } else {
      currentCode = preCode + currentCode
    }
    break
   case 'logicExp':
   case 'bracketsExp':
   case 'text':
     currentCode = val.value()
     if (start || end) {
       currentCode = preCode.slice(0, start) + currentCode.slice(0, currentCode.length) + preCode.slice(end, preCode.length)
     } else {
       currentCode = val.value()
     }
     break
}
```
由上可知，第一次拖动运算符的时候，expressionItem值为如下：
```
expressionItem = [{
  conditon_deviceName: ""
  conditon_deviceName_value: ""
  conditon_type: ""
  conditon_type_value: "",
  data: [null, null]
}];
```
然后算数运算符的值为如下：
```
{
  type: "arithExp",
  value: (left, right) => {
    return `${left ? `R$x` : ''}${symbol}${right ? `R$x` : ''}`
  },
}
```
因此，第一次拖动的时候，会调用 currentCode = val.value(true, true) 代码，因此 此时 currentCode = "R$x+R$x"; 继续代码往下执行，然后会对
一些特殊的字符处理，因为 babylon.parse 使用这个方法进行转换代码的时候，特殊字符会进行报错，因此需要对特殊字符进行一些转换，转换操作后，后面会进行
转换回来的。

let t = babylon.parse(currentCode.replace(/\./g, 'Q')); 执行这个代码的时候，就会生成如下的AST数据(抽象语法树)的。
```
t = {
  "type": "File",
  "start": 0,
  "end": 7,
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 7
    }
  },
  "program": {
    "type": "Program",
    "start": 0,
    "end": 7,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 7
      }
    },
    "sourceType": "script",
    "body": [
      {
        "type": "ExpressionStatement",
        "start": 0,
        "end": 7,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 7
          }
        },
        "expression": {
          "type": "BinaryExpression",
          "start": 0,
          "end": 7,
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 7
            }
          },
          "left": {
            "type": "Identifier",
            "start": 0,
            "end": 3,
            "loc": {
              "start": {
                "line": 1,
                "column": 0
              },
              "end": {
                "line": 1,
                "column": 3
              },
              "identifierName": "R$x"
            },
            "name": "R$x"
          },
          "operator": "+",
          "right": {
            "type": "Identifier",
            "start": 4,
            "end": 7,
            "loc": {
              "start": {
                "line": 1,
                "column": 4
              },
              "end": {
                "line": 1,
                "column": 7
              },
              "identifierName": "R$x"
            },
            "name": "R$x"
          }
        }
      }
    ],
    "directives": []
  },
  "comments": [],
  "tokens": [
    {
      "type": {
        "label": "name",
        "beforeExpr": false,
        "startsExpr": true,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null
      },
      "value": "R$x",
      "start": 0,
      "end": 3,
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 3
        }
      }
    },
    {
      "type": {
        "label": "+/-",
        "beforeExpr": true,
        "startsExpr": true,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": true,
        "postfix": false,
        "binop": 9,
        "updateContext": null
      },
      "value": "+",
      "start": 3,
      "end": 4,
      "loc": {
        "start": {
          "line": 1,
          "column": 3
        },
        "end": {
          "line": 1,
          "column": 4
        }
      }
    },
    {
      "type": {
        "label": "name",
        "beforeExpr": false,
        "startsExpr": true,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null
      },
      "value": "R$x",
      "start": 4,
      "end": 7,
      "loc": {
        "start": {
          "line": 1,
          "column": 4
        },
        "end": {
          "line": 1,
          "column": 7
        }
      }
    },
    {
      "type": {
        "label": "eof",
        "beforeExpr": false,
        "startsExpr": false,
        "rightAssociative": false,
        "isLoop": false,
        "isAssign": false,
        "prefix": false,
        "postfix": false,
        "binop": null,
        "updateContext": null
      },
      "start": 7,
      "end": 7,
      "loc": {
        "start": {
          "line": 1,
          "column": 7
        },
        "end": {
          "line": 1,
          "column": 7
        }
      }
    }
  ]
}
```
```
因此最后的 expressionItem = [
  {
    conditon_deviceName: ""
    conditon_deviceName_value: ""
    conditon_type: ""
    conditon_type_value: "",
    data: [Node], // data 里面包含的值就是上面的抽象语法树的值
  }
]
```
同样的道理，当我们第二次拖动运算符的时候，首先会判断该文本框中是否有值，没有值的话，就会执行 val.value(false, true) 这段代码，因此会生成右侧的
文本框，如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161634155-416710941.jpg" />

依次类推.... 

#### 理解baseExp.js代码

其中生成表达式的值 BaseExp 就是引用到 baseExp.js 代码了。

基本代码如下：
```
render() {
    const { value } = this.props
    if (!value) return null
    const { tokens } = value;

    return <div className="exp-context">
      {
        tokens && tokens.map(o => {
          if (o.type.label === 'eof') {
            return
          }
          let val = o.value && o.value.toString()
          if (/^[A-Z]+\$/.test(val)) {
            let temp = null;
            let splits = o.value.split('$');
            let type = splits[0];
            let key = splits[1];
            switch (type) {
              case 'BLANK':
                temp = <DropTarget empty primaryKey={['root', 'label', 'blank', 'relationExp', 'text']}>
                  <Container className="exp-container" onChange={this.handleChange(o.start, o.end)} />
                </DropTarget>
                break
              case 'A':
                temp = <DropTarget empty primaryKey={['root', 'label', 'blank', 'relationExp', 'text']}>
                  <Container className="exp-container" onChange={this.handleChange(o.start, o.end)} />
                </DropTarget>
                break
              case 'R':
                temp = <DropTarget empty  primaryKey={['root', 'label', 'blank', 'relationExp', 'text']}>
                  <Container className="exp-container" onChange={this.handleChange(o.start, o.end)} />
                </DropTarget>
                break
              case 'L':
                {
                  /* 先注释掉
                  if (key === 'count') {
                    temp = <DropTarget empty primaryKey={['relationExp', 'label', 'blank', 'text']}>
                      <Container className="exp-container" onChange={this.handleChange(o.start, o.end)} />
                    </DropTarget>
                    break
                  }
                  */
                }
                temp = <DropTarget primaryKey={['relationExp', 'label', 'blank', 'text', 'logicExp']}>
                  <Container className="exp-container" onChange={this.handleChange(o.start, o.end)} />
                </DropTarget>
                break
              case 'LABEL':
                temp = <DropTarget primaryKey="label">
                  <Container className="exp-container" value={key} onChange={this.handleChange(o.start, o.end)} />
                </DropTarget>
                break
              case 'TEXT':
                temp = <ContentEditable type="number" content={key.replace(/Q/, '.')} placeholder="值" onBlur={this.handleTextChange(o.start, o.end)} className="exp-container small" />
                break
            }
            return <span onClick={this.handleSelect} className="exp-tag" data-start={o.start} data-end={o.end}>{temp}</span>
          }
          return <span onClick={this.handleSelect} data-start={o.start} data-end={o.end}>{o.value || o.type.label}</span>
        })
      }
    </div>
}
```
如上代码，就是对tokens进行遍历判断，由之前我们知道，如果对于算术运算符的话，那么它的值就返回 "R$x运算符R$x"; 关系表达式 也是 "R$x运算符R$x";
逻辑表达式返回的是：${运算符}(L$${运算符})

如上会进行tokens遍历，获取type值如下：
```
let splits = o.value.split('$');
let type = splits[0];
```
如果返回的值："R$x运算符R$x"; 这种的话，那么token的值就分别为 R$x，运算符，R$x; 因此 type就等于R，因此会渲染R条件项生成对应的HTML元素。
如果返回值为 ${运算符}(L$${运算符}。也就是逻辑运算符，那么就会获取 type = L; 就会执行L这项生成对应的HTML元素结构。
如果返回的是：BLANK$; 说明是括号运算符，就会 执行 type = 'BLANK' 这个条件项，生成对应的HTML元素。
对于文本框类型，text，我们会生成 ContentEditable 这个组件的。该组件就是一个div，允许可编辑的；如下代码：
```
render() {
  const { content, className, style, type, placeholder } = this.props;
  return (
    <div
      ref={ref => this.element = ref}
      className={className}
      style={{ whiteSpace: 'pre-wrap', style, borderRadius: 2 }}
      contentEditable={true}
      onBlur={this.onBlur}
      onInput={this.onChange(type)}
      onPaste={this.onPaste}
      onFocus={this.onFocus}
      placeholder={placeholder}
    >{content}</div>
  )
}
```
没有控制那么严格，任意字符都可以输入。不仅仅是数字类型。

以此类推....

注意：在 DropTarget 组件中，我们有 primaryKey 这个属性，含义是能被放置的目标源的值，只有等于这些目标值的源才能被放置进来，否则话是不允许放置的。

最后这么复杂的数据，就会生成如下html结构，如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161601654-1511240929.jpg" />

#### 新增数据提交

对于新增数据提交的时候，我们需要组装数据给java开发。
```
[
  {
    "id": null,
    "deleted": 0,
    "conditonType": 1,
    "conditonValue": "",
    "definitionOrder": 0,
    "definition": "([60002_1002+60002_1003])+([60002_1004+60002_1005])==sum([60002_1002])"
  },
  {
    "id": null,
    "deleted": 0,
    "conditonType": 1,
    "conditonValue": "",
    "definitionOrder": 1,
    "definition": "(max([60002_1002])-min([60002_1003]))-(max([60002_1004])-min([60002_1005]))!=avg([60002_1004])"
  }
]
```
如下所示：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161532616-851609377.jpg" />

开发需要如上的数据，但是我们提交的时候，我们的 表达式数据是一个 AST(抽象语法树)的数据，因此我们需要把抽象语法树的数据转换成我们需要的数据。如下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161504492-266296214.jpg" />

因此我使用了 retExpressionFunc 这个函数来处理开发需要的数据，如下代码：
```
function replaceDefinition(str) {
  if (!str) return;
  str = str.replace(/[\[\]]/g, '')
  str = str.replace(/([a-z]*)\(([^()]*)\)/g, '$1([$2])')
  str = str.replace(/Q/g, '.')
  return str
}
// 抽象语法树转换成字符串
function ast2Str(ast) {
  if (!ast) return '';
  if (ast.conditionDefinition) {
    ast = ast.conditionDefinition;
  }
  let t = ast.tokens && ast.tokens.map(o => {
    if (o.type.label === 'eof') return ''
    if (o.value) {
      if (/LABEL\$(.*)\$[0-9_]/.test(o.value)) {
        return o.value.split('$')[2];
      } else if (/TEXT\$(.*)/.test(o.value)) {
        return o.value.split('$')[1];
      } else {
        return o.value;
      }
    }
    return o.type.label
  }).join('');
  if (/(\(\S*-\S*\))/.test(t)) {
    t = t.replace(/LABEL\$\S*\$/, '')
  }
  return t
}

retExpressionFunc = () => {
  const { saveExpression } = this.state;
  const metricLibraryItemDefinitions = [];
  /*
   * 后端开发需要如下表达式的值
   * const metricLibraryItemDefinitions = [
   *   {
   *     id: '', // 新增时为null
   *     gmt_create: '', // 创建时间
   *     gmt_modified: '', // 修改时间
   *     definition: '', // 指标库计算表达式
   *     deleted: '', // 是否是删除，如果新增页面传递 0，如果是修改页面，开发返回原有的数据，就传递时间戳
   *     conditon_type: '', // 设备类型，默认是：1， 设备类型为：2
   *     conditon_value: '', // 判断值，如果为默认的话，值为空，否则的话，多个值使用逗号隔开。
   *     definition_order: '', 表达式优先级顺序，0 是最高，以此类推。。。。
   *   }
   * ];
  */
  if (saveExpression && saveExpression.length) {
    let num = -1;
    for (let j = 0, jlen = saveExpression.length; j < jlen; j++) {
      const { data } = saveExpression[j];
      if (data && data.length) {
        for (let k = 0, klen = data.length; k < klen; k++) {
          if (data[k] && !data[k].isAlreadyRemove) {
            num++;
            metricLibraryItemDefinitions.push({
              id: data[k] && data[k].id || null,
              deleted: data[k] && data[k].deleted || 0,
              conditonType: saveExpression[j] && saveExpression[j].conditon_type_value,
              conditonValue: saveExpression[j] && saveExpression[j].conditon_deviceName_value,
              definitionOrder: num,
              definition: data[k] && !data[k].deleted ? data[k] && replaceDefinition(ast2Str(data[k])) : (data[k] && data[k].conditionDefinition || ''),
            });
          }
        }
      }
    }
  }
  return metricLibraryItemDefinitions;
}
```
最后提交后就是后端需要的数据了。但是提交的时候还有一种情况，就是编辑的时候，修改页面的时候，后端本来有返回的数据，但是不小心或业务的需求，被删除了，那么这个时候，我也需要把这条数据的id带过去，只是说这个deleted为时间戳，后端根据这个时间戳进行判断该条数据是否被删除了。

这个先等下面编辑的时候再讨论。那么新增的提交的数据就已经解决了。下面再来看编辑的时候，提交的数据。

#### 编辑时候提交数据

进入编辑页面，后端开发返回的数据是如下这个样子的：
```
const metricLibraryItemDefinitions = [
  [
    {
      "deleted": 0,
      "conditonType": 2,
      "conditonValue": "2,1,3,4",
      "definitionOrder": 0,
      "definition": "(sum([60002_1002])+avg([60002_1003]))&&(max([60002_1004])-min([60002_1005]))*(sum([60002_1002]))/(avg([60002_1003]))==count([60002_1004])"
      id: 1
    },
    {
      "deleted": 0,
      "conditonType": 2,
      "conditonValue": "2,1,3,4",
      "definitionOrder": 1,
      "definition": "((min([60002_1002])+count([60002_1003]))>=(avg([60002_1004])-max([60002_1005])))||(sum([60002_1002])*avg([60002_1003]))!=max([60002_1004])"
      id: 2
    }
  ],
  [
    {
      "deleted": 0,
      "conditonType": 2,
      "conditonValue": "1,2",
      "definitionOrder": 2,
      "definition": "(sum([60002_1002])+max([60002_1003]))<=(avg([60002_1004])-sum([60002_1005]))==count([1122333])"
      id: 3
    }
  ]
];
```
会根据上面的数据，渲染成如下的页面。如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161432318-1405473855.jpg" />

因此我这边编辑的时候，对页面做了如下数据处理，需要把表达式字符串渲染成AST抽象语法树格式的。简单的代码如下：
```
if (metricLibraryItemDefinitions && metricLibraryItemDefinitions.length) {
  const arrs = [];
  Parse(metricLibraryItemDefinitions, customMetricItems).then(res => {
    const { definitions } = res;
    definitions && definitions.length && definitions.forEach(item => {
      arrs.push({
        data: item,
        conditon_type_value: item[0].conditonType,
        conditon_deviceName_value: item[0].conditonValue,
        conditon_deviceName: item[0].conditonValueName
      });
    });
    this.setState({
      expression: arrs,
      saveExpression: _.cloneDeep(arrs),
      defaultExpression: null,
      callbackItemDefinitions: _.cloneDeep(metricLibraryItemDefinitions),
    });
  });
}
```
如上，我们就需要引入 parse.js 代码进来了。大致的代码如下：
```
export default async function parse(metricLibraryItemDefinitions, customMetricItems) {
  console.log('-----请求进来了-----', customMetricItems);
  console.log('----metricLibraryItemDefinitions----', metricLibraryItemDefinitions);
  const rets = [];
  metricLibraryItemDefinitions.forEach(item => {
    const arrs = [];
    if (item && item.length) {
      item.forEach(citem => {
        if (citem.definition) {
          arrs.push({
            conditonType: citem.conditonType,
            conditonValue: citem.conditonValue,
            conditonValueName: citem.conditonValueName,
            deleted: citem.deleted,
            id: citem.id,
            definitionOrder: citem.definitionOrder,
            conditionDefinition: valueParse(replaceDefinition(citem.definition), customMetricItems),
          });
        }
      });
    }
    if (arrs.length) {
      rets.push(arrs);
    }
  });
  return {
    definitions: rets,
  }
}
```
第一个参数metricLibraryItemDefinitions就是后端返回的数据。第二个参数 customMetricItems 就是左侧树形菜单的json数据。我们会根据后端返回
的数据进行解析生成一个新的json数组，根据树形菜单的id解析到他们的中文名称，因为后端返回的数据是id，我们要根据它的id拿到名称。最后返回数组进行
渲染了。具体的要看代码，这里只是简单的提下一些代码流程。

我们再来说下提交的时候，提交的时候 如果是编辑页面，那么开发肯定返回数据，如果这个时候我们把编辑本来就有的数据删除了，那么这个时候，就需要把该条
数据传给开发，并且deleted为一个时间戳。那么我这里就有两种情况，第一种是 点击清除按钮，然后再填写新数据，还有一种情况是直接点击右侧的删除按钮。那么这两种情况，我都会把它当作删除了这条数据的。如下图理解下：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161402393-51172414.jpg" />

下面我们删除一条数据，如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202106/561794-20210606161330573-235491833.jpg" />

那么现在我们的数据要怎么处理呢？首先我们开发返回的数据保存到 callbackItemDefinitions 变量里面去。然后在提交的时候，提交的数据和开发返回的数据
进行比较，如果开发返回的数据在提交的数据找不到的话，说明这条数据已经被删除了，因此我们代码需要被处理下。基本逻辑就这些了。

其他的就是一些新增一项和删除一项。这些都是前端一些最基本的东西就没有什么好讲的。




































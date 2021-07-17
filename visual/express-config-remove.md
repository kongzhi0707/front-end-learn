
### 表达式计算添加 "删除" 功能

<a href="https://kongzhi0707.github.io/express-config/index.html">效果预览点击查看</a>

实现的效果如下这个样子：

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717142945186-1575990369.jpg" />

需求背景：拖曳表达式计算功能，当用户拖动很多项的时候，突然发现某项功能并不是自己想要的，如果让用户重新拖曳操作的话，那么用户体验肯定不好，因此我们需要添加一个删除功能，鼠标移动到某个表达式上面时候，能有个浮框，提示用户可以进行删除操作。因此需要对表达式进行优化操作。

这个功能看起来不难，但是做起来挺复杂的，因为这不是一般常见的浮框删除操作，因为这边涉及到很多场景及要考虑的问题。比如最常见的需求：

a + b = c; 这个简单的表达式计算，那么当我们删除字符 "a" 的时候，我们需要把后面的运算符 + 号也删除掉，同理当用户删除 字符 b 的时候，那么就需要把前面的运算符也删除掉，这只是一个简单的问题，那如果稍微复杂的表达式呢？ 比如 sum(a) + max(b) - (min(c) + avg(d) - count(1+2)) 这样的呢？或者更复杂的小括号里面嵌套小括号，小括号里面又有表达式计算，表达式计算里面又有小括号，那么这种情况下，要如何正确的删除呢？

那么要实现这么一个功能，首先我们需要对AST抽象语法树熟悉，然后操作AST数据，但是仅仅了解这些还不够，还需要自己理清逻辑，我写这个功能，折腾了一个星期多的时间，写了三遍代码，刚开始写着写着发现不对劲，因为有很多业务场景没有考虑进去。

#### 注意：拖曳表达式计算功能使用了Babel底层操作，对字符串进行AST转换操作。

#### 一：理解使用场景

#### 1）使用场景1  

#### 1.1) __ + __ + __ 

(无数据时)，如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143023174-1605449080.jpg" />

那么它返回的AST(抽象语法树)大致代码如下：
```
[
  { "value": "R$x", "start": 0, "end": 3 },
  { "value": "+", "start": 3, "end": 4 },
  { "value": "R$x", "start": 4, "end": 7 },
  { "value": "+", "start": 7, "end": 8 },
  { "value": "R$x", "start": 8, "end": 11 },
  { "value": null, "start": 11, "end": 11}
]
```
#### 1.2) ___ + ___ + ___ 

(有数据) 如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143055232-1008092865.jpg" />
```
[
  { "value": "LABEL$测试温度1$60002_1002", "start": 0, "end": 22 },
  { "value": "+", "start": 22, "end": 23 },
  { "value": "LABEL$测试温度2$60002_1003", "start": 23, "end": 45 },
  { "value": "+", "start": 45, "end": 46 },
  { "value": "LABEL$测试温度3$60002_1004", "start": 46, "end": 68 },
  { "value": null, "start": 68, "end": 68 }
]
```
#### 1.3）( __ + __ + __) + __  

  前面带小括号的 (无数据) 如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143125398-570999760.jpg" />
```
[
  { "value": null, "start": 0, "end": 1 },
  { "value": "R$x", "start": 1, "end": 4 },
  { "value": "+", "start": 4, "end": 5 },
  { "value": "R$x", "start": 5, "end": 8 },
  { "value": "+", "start": 8, "end": 9 },
  { "value": "R$x", "start": 9, "end": 12 },
  { "value": null, "start": 12, "end": 13 },
  { "value": "+", "start": 13, "end": 14 },
  { "value": "R$x", "start": 14, "end": 17 },
  { "value": null, "start": 17, "end": 17 }
]
```
#### 1.4）( _a_ + _b_ + _c_ ) + __  

(有数据) 如下图所示：

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143220645-1264943434.jpg" />
```
[
  { "value": null, "start": 0, "end": 1 },
  { "value": "LABEL$测试温度1$60002_1002", "start": 1, "end": 23 },
  { "value": "+", "start": 23, "end": 24 },
  { "value": "LABEL$测试温度2$60002_1003", "start": 24, "end": 46 },
  { "value": "+", "start": 46, "end": 47 },
  { "value": "LABEL$测试温度3$60002_1004", "start": 47, "end": 69 },
  { "value": null, "start": 69, "end": 70 },
  { "value": "+", "start": 70, "end": 71 },
  { "value": "R$x", "start": 71, "end": 74 },
  { "value": null, "start": 74, "end": 74 }
]
```
#### 1.5）( __ + __ + __ ) + ( __ + __ + __ ) + ( __ + __ + __ ) 

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143248004-139403817.jpg" />

返回的AST数据如下：
```
[
  { "value": null, "start": 0, "end": 1 },
  { "value": "R$x", "start": 1, "end": 4 },
  { "value": "+", "start": 4, "end": 5 },
  { "value": "R$x", "start": 5, "end": 8 },
  { "value": "+", "start": 8, "end": 9 },
  { "value": "R$x", "start": 9, "end": 12 },
  { "value": null, "start": 12, "end": 13 },
  { "value": "+", "start": 13, "end": 14 },
  { "value": null, "start": 14, "end": 15 },
  { "value": "R$x", "start": 15, "end": 18 },
  { "value": "-", "start": 18, "end": 19 },
  { "value": "R$x", "start": 19, "end": 22 },
  { "value": "-", "start": 22, "end": 23 },
  { "value": "R$x", "start": 23, "end": 26 },
  { "value": null, "start": 26, "end": 27 },
  { "value": "+", "start": 27, "end": 28 },
  { "value": null, "start": 28, "end": 29 },
  { "value": "R$x", "start": 29, "end": 32 },
  { "value": "*", "start": 32, "end": 33 },
  { "value": "R$x", "start": 33, "end": 36 },
  { "value": "*", "start": 36, "end": 37 },
  { "value": "R$x", "start": 37, "end": 40 },
  { "value": null, "start": 40, "end": 41 },
  { "value": null, "start": 41, "end": 41 }
]
```
#### 1.6）如下图所示

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143315103-986800709.jpg" />

返回的AST数据如下
```
[
  { "value": null, "start": 0, "end": 1 },
  { "value": "sum", "start": 1, "end": 4 },
  { "value": null, "start": 4, "end": 5 },
  { "value": "LABEL$测试温度1$60002_1002", "start": 5, "end": 27 },
  { "value": null, "start": 27, "end": 28 },
  { "value": "+", "start": 28, "end": 29 },
  { "value": "avg", "start": 29, "end": 32 },
  { "value": null, "start": 32, "end": 33 },
  { "value": "LABEL$测试温度2$60002_1003", "start": 33, "end": 55 },
  { "value": null, "start": 55, "end": 56 },
  { "value": "+", "start": 56, "end": 57 },
  { "value": "max", "start": 57, "end": 60 },
  { "value": null, "start": 60, "end": 61 },
  { "value": "L$max", "start": 61, "end": 66 },
  { "value": null, "start": 66, "end": 67 },
  { "value": null, "start": 67, "end": 68 },
  { "value": "+", "start": 68, "end": 69 },
  { "value": null, "start": 69, "end": 70 },
  { "value": "sum", "start": 70, "end": 73 },
  { "value": null, "start": 73, "end": 74 },
  { "value": "L$sum", "start": 74, "end": 79 },
  { "value": null, "start": 79, "end": 80 },
  { "value": "-", "start": 80, "end": 81 },
  { "value": "max", "start": 81, "end": 84 },
  { "value": null, "start": 84, "end": 85 },
  { "value": "L$max", "start": 85, "end": 90 },
  { "value": null, "start": 90, "end": 91 },
  { "value": "-", "start": 91, "end": 92 },
  { "value": "count", "start": 92, "end": 97 },
  { "value": null, "start": 97, "end": 98 },
  { "value": "L$count", "start": 98, "end": 105 },
  { "value": null, "start": 105, "end": 106 },
  { "value": null, "start": 106, "end": 107 },
  { "value": "-", "start": 107, "end": 108 },
  { "value": null, "start": 108, "end": 109 },
  { "value": "max", "start": 109, "end": 112 },
  { "value": null, "start": 112, "end": 113 },
  { "value": "L$max", "start": 113, "end": 118 },
  { "value": null, "start": 118, "end": 119 },
  { "value": "*", "start": 119, "end": 120 },
  { "value": "min", "start": 120, "end": 123 },
  { "value": null, "start": 123, "end": 124 },
  { "value": "L$min", "start": 124, "end": 129, },
  { "value": null, "start": 129, "end": 130 },
  { "value": "*", "start": 130, "end": 131 },
  { "value": "count", "start": 131, "end": 136 },
  { "value": null, "start": 136, "end": 137 },
  { "value": "L$count", "start": 137, "end": 144 },
  { "value": null, "start": 144, "end": 145 },
  { "value": null, "start": 145, "end": 146 },
  { "value": null, "start": 146, "end": 146 }
]
```
#### 1.7）如下图：

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143343552-526908643.jpg" />

```
[
  { "value": null, "start": 0, "end": 1 },
  { "value": "R$x", "start": 1, "end": 4 },
  { "value": "+", "start": 4, "end": 5 },
  { "value": null, "start": 5, "end": 6 },
  { "value": "R$x", "start": 6, "end": 9 },
  { "value": "==", "start": 9, "end": 11 },
  { "value": "R$x", "start": 11, "end": 14 },
  { "value": null, "start": 14, "end": 15 },
  { "value": null, "start": 15, "end": 16 },
  { "value": "+", "start": 16, "end": 17 },
  { "value": null, "start": 17, "end": 18 },
  { "value": "R$x", "start": 18, "end": 21 },
  { "value": "/", "start": 21, "end": 22 },
  { "value": null, "start": 22, "end": 23 },
  { "value": "R$x", "start": 23, "end": 26 },
  { "value": "!=", "start": 26, "end": 28 },
  { "value": "R$x", "start": 28, "end": 31 },
  { "value": null, "start": 31, "end": 32 },
  { "value": null, "start": 32, "end": 33 },
  { "value": "+", "start": 33, "end": 34 },
  { "value": null, "start": 34, "end": 35 },
  { "value": null, "start": 35, "end": 36 },
  { "value": "R$x", "start": 36, "end": 39 },
  { "value": "/", "start": 39, "end": 40 },
  { "value": "R$x", "start": 40, "end": 43 },
  { "value": null, "start": 43, "end": 44 },
  { "value": "*", "start": 44, "end": 45 },
  { "value": null, "start": 45, "end": 46 },
  { "value": "R$x", "start": 46, "end": 49 },
  { "value": "-", "start": 49, "end": 50 },
  { "value": "R$x", "start": 50, "end": 53 },
  { "value": null, "start": 53, "end": 54 },
  { "value": null, "start": 54, "end": 55 },
  { "value": null, "start": 55, "end": 55 }
]
```

#### 1.8）如下图

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210717143412076-901882731.jpg" />

返回的AST数据如下：
```
[
  { "value": "sum", "start": 0, "end": 3 },
  { "value": null, "start": 3, "end": 4 },
  { "value": "LABEL$测试温度1$60002_1002", "start": 4, "end": 26 },
  { "value": null, "start": 26, "end": 27 },
  { "value": "+", "start": 27, "end": 28 },
  { "value": "avg", "start": 28, "end": 31 },
  { "value": null, "start": 31, "end": 32 },
  { "value": "L$avg", "start": 32, "end": 37 },
  { "value": null, "start": 37, "end": 38 },
  { "value": "-", "start": 38, "end": 39 },
  { "value": "max", "start": 39, "end": 42 },
  { "value": null, "start": 42, "end": 43 },
  { "value": "L$max", "start": 43, "end": 48 },
  { "value": null, "start": 48, "end": 49 },
  { "value": "*", "start": 49, "end": 50 },
  { "value": "min", "start": 50, "end": 53 },
  { "value": null, "start": 53, "end": 54 },
  { "value": "LABEL$测试温度3$60002_1004", "start": 54, "end": 76 },
  { "value": null, "start": 76, "end": 77 },
  { "value": null, "start": 77, "end": 77 }
]
```
因此我们需要根据上面这些数据进行操作。

比如我们上面第一种情况：__ + __ + __ 这样的表达式，返回的AST数据如下：
```
[
  { "value": "R$x", "start": 0, "end": 3 },
  { "value": "+", "start": 3, "end": 4 },
  { "value": "R$x", "start": 4, "end": 7 },
  { "value": "+", "start": 7, "end": 8 },
  { "value": "R$x", "start": 8, "end": 11 },
  { "value": null, "start": 11, "end": 11}
]
```
当我们删除第一项的时候，首先我们可以获取到被删除元素的索引index到，那么逻辑就需要把上面数组中的 第一条 和 第二条数据 进行删除操作即可。删除完成后，我们
还需要考虑一个问题是：我们需要重新对 上面数据中的 start 和 end 值重新计算。如果不这样做的话，当我们手动拖拽数据到文本框中会报错，因为拖拽操作时候，我们需要用到 start 和 end。并且babel底层代码解析的时候，如果对不上的话也会报错。

#### 二：代码要如何编写：

#### 注意：下面代码tokens数据就是上面的AST抽象语法数生成的。如下这样的：
```
[
  { "value": "R$x", "start": 0, "end": 3 },
  { "value": "+", "start": 3, "end": 4 },
  { "value": "R$x", "start": 4, "end": 7 },
  { "value": "+", "start": 7, "end": 8 },
  { "value": "R$x", "start": 8, "end": 11 },
  { "value": null, "start": 11, "end": 11}
]
```
当然除了这些字段外，还有type，loc等等字段。

#### 2.1）重新设置tokens中的start和end的value

因此我们首先需要考虑的问题是，重新设置tokens中的start和end的value。
我们可以观察上面的AST数据可以了解到如下信息：

1）如果数据 value 是 null值，那么start 和 end 值相差1，
2）如果数据 value 不是 null值，那么end的长度就等于 start 的长度 + value.length;

比如我们可以观察下面的数据：
```
[
  { "value": "R$x", "start": 0, "end": 3 },
  { "value": "+", "start": 3, "end": 4 },
  { "value": "R$x", "start": 4, "end": 7 },
  { "value": "+", "start": 7, "end": 8 },
  { "value": "R$x", "start": 8, "end": 11 },
  { "value": null, "start": 11, "end": 11}
]
```
第一条value不是null，因此 第一条 start 肯定是0，然后 end = start + value.length; 其他的也一样。因此代码编写如下：
```
/*
 * 重新设置tokens中的start和end的值
 * 当删除元素后，需要重新设置 start 和 end 的值
 * 解决方法: 遍历数组。如果是 null值或运算符的值，那么start 和 end 值相差1，
 * 否则的话，那么end的长度就等于 start 的长度 + value.length;
*/
const setStartAndEndValue = function () {
  if (tokens.length > 0) {
    for (let i = 0; i < tokens.length; i++) {
      const { value } = tokens[i];
      if (i === 0) {
        if (value === null) {
          tokens[0].start = 0;
          tokens[0].end = 1;
        } else {
          tokens[0].start = 0;
          tokens[0].end = tokens[0].start + tokens[0].value.length;
        }
      } else {
        // 如果不是第一个元素，
        // 如果值是null
        if (value === null) {
          // 1. 获取该元素的上一个元素的end值当作该元素的start值
          // 2. end 值 在当前元素的start值加1
          const prevIndex = i - 1;
          tokens[i].start = tokens[prevIndex].end;
          tokens[i].end = tokens[i].start + 1;
        } else {
          // 如果值不等于null的话
          // 1. 获取该元素的上一个元素的end值当作该元素的start值
          // 2. end 值 在当前元素的start值 + 当前字符串的长度
          const prevIndex = i - 1;
          tokens[i].start = tokens[prevIndex].end;
          tokens[i].end = tokens[i].start + tokens[i].value.length;
        }
      }
    }
  }
};
```
#### 2.2）判断当前被删除的表达式是否在小括号内部

那么我们点击删除某个表达式的时候，我们肯定能获取到当前表达式的索引index的到的。

判断方法：在当前元素位置下，使用递归方式，依次向上逐个元素查找是否有 左括号，如果有的话，返回左括号所在位置，否则返回-1。
因此我代码会写这么一个方法，如下代码：
```
/**
 * 获取左括号的索引
 * 首先在当前元素位置下，使用递归方式，依次向上逐个元素查找是否有 左括号，如果有的话，返回左括号所在位置，否则返回-1
*/
const getLeftParenthesisIndex = function(curElemIndex) {
  /*
   * 判断当前的值是否是左边小括号，判断规则：
   * 1) 判断该值是否等于null，且 该项的end值 - start 值 是否等于1，
   * 2）判断该项 type.label = '('
   * 除了上面条件以外，还需要考虑逻辑运算符的存在，比如上个运算符是否有 sum()/avg()/max()/min()/count() 这些外
   */
  const func = function(curElemIndex) {
    const { value, start, end, type } = tokens[curElemIndex];
    if (value === null && (end - start === 1) && (type.label === '(')) {
      // 还需要过滤掉 逻辑运算符的左边小括号
      let flag = false;
      if (curElemIndex - 1 >= 0) {
        const { value } = tokens[curElemIndex - 1];
        flag = (value === 'sum') || (value === 'max') || (value === 'min') || (value === 'count') || (value === 'avg') ? true : false;
      }
      if (!flag) {
        return curElemIndex;
      } else {
        if (curElemIndex > 0) {
          const index = curElemIndex - 1;
            return func(index);
          } else {
            return -1;
          }
        }
      } else {
        if (curElemIndex > 0) {
          const index = curElemIndex - 1;
          return func(index);
        } else {
          return -1;
        }
     }
   };
   return func(curElemIndex);
};

// 获取右括号的索引
const getRightParenthesisIndex = function(curElemIndex) {
  /*
   * 除了下面这些条件外，我们还需要考虑逻辑运算符 sum()/max()/min()/avg()/count() 这些。
   */
  const func = function(curElemIndex) {
    // 获取当前被删除元素的 value/start/end/type 
    const { value, start, end, type } = tokens[curElemIndex];
    if (value === null && (end - start === 1) && (type.label === ')')) {
      // 还需要过滤掉逻辑运算符右边的小括号
      let flag = false;
      if (curElemIndex - 3 > 0) { // 判断前3个元素的值是否是逻辑运算符
        const { value } = tokens[curElemIndex - 3];
        flag = (value === 'sum') || (value === 'max') || (value === 'min') || (value === 'count') || (value === 'avg') ? true : false;
          }
        if (!flag) {
          return curElemIndex;
        } else {
          if (curElemIndex < tokens.length - 1) {
            const index = curElemIndex + 1;
            return func(index);
          } else {
            return -1;
          }
        }
      }
    if (curElemIndex < tokens.length - 1) {
      const index = curElemIndex + 1;
      return func(index);
    } else {
      return -1;
    }
  };
  return func(curElemIndex);
};
```
#### 2.3）判断当前被删除的元素是 第一个表达式/中间的表达式/尾部的表达式

判断规则，在当前元素中使用递归方式，向上查找运算符，如果没有找到，说明是第一个表达式。如果向上找到运算符，且向下也找到运算符，说明是中间的表达式。
否则的话，就是尾部的表达式。

#### 注意：下面注释写的，首元素 === 第一个表达式。中间元素 === 中间的表达式。尾部元素 === 尾部表达式。含义是一样的。

比如 a + b + c 这样的表达式，那么 a 我们可以认为这是 第一个表达式项，b 项，向上 和 向下 都有 加号运算符，我们可以认为它是 中间表达式项。c就是尾部表达式项了。

因此我们需要编写代码如下：
```
/**
 * 是否有运算符
 * @param { index } curElemIndex 当前被删除元素的索引 
 * @param { String } dir 方向，代表是向上查找 还是 向下查找
*/
const isHasChar = function(curElemIndex, newArrs, dir) {

  if (curElemIndex > newArrs.length - 1) {
    return false;
  }
  const { value } = newArrs[curElemIndex];
  if (chars.indexOf(value) > -1) {
    return true;
  }
  if (dir === 'prev' && (curElemIndex === 0)) {
    return false;
  }
  if (dir === 'next' && (curElemIndex === newArrs.length -1)) {
    return false;
  }
  if (dir === 'prev' && (curElemIndex > 0)) {  // 向上查找---使用递归方式
    return isHasChar(curElemIndex - 1, newArrs, dir);
  } else {
    if (curElemIndex < newArrs.length - 1) {
      return isHasChar(curElemIndex + 1, newArrs, dir);
    }
  }
  return false;
};
/*
 * 获取元素的是否是 首元素/中间元素/尾部元素
 * 判断规则，在当前元素中使用递归方式，向上查找运算符，如果没有找到，说明是首元素。如果向上找到运算符，且向下也找到运算符，说明是中间元素。
 * 否则的话，就是尾部元素了。
 * @param { Number } curElemIndex 当前被删除元素的索引
 * @param { Array } newArrs 在某块范围内查找
 * @return { Number } index 返回值有 0/1/2/3, 如果等于0的话，说明是首元素，如果等于1的话，说明是中间元素，如果等于2的话，说明是尾部元素,
 * 如果等于3的话，说明是最后一个元素
 */
const getElemPos = function(curElemIndex, newArrs) {
  const isPrevChar = isHasChar(curElemIndex, newArrs, 'prev');
  const isNextChar = isHasChar(curElemIndex, newArrs, 'next');

  if (isPrevChar && isNextChar) { // 说明是中间元素 
    return 1;
  } else if (!isPrevChar && isNextChar) { // 说明是首元素
    return 0;
  } else if (isPrevChar && !isNextChar){ // 说明是尾部元素
    return 2;
  } else if (!isPrevChar && !isNextChar) { // 说明是最后一个元素
    return 3;
  }
};
```
#### 2.4）查找上一个运算符的位置/下一个运算符的位置索引
```
// 从当前被删除元素开始查找上一个运算符的位置
const getPrevCharPos = function(curElemIndex) {
  const chars = ['+', '-', '*', '/', '==', '!=', '>=', '<=', '>', '<', '&&', '||'];
  const { value } = tokens[curElemIndex];
  if (chars.indexOf(value) > -1) {
    return curElemIndex;
  }
  if (curElemIndex - 1 >= 0) {
    return getPrevCharPos(curElemIndex - 1);
  }
  return -1;
};
// 获取下一个运算符的位置
const getNextCharPos = function(curElemIndex) {
  const { value } = tokens[curElemIndex];
  const chars = ['+', '-', '*', '/', '==', '!=', '>=', '<=', '>', '<', '&&', '||'];
  if (chars.indexOf(value) > -1) {
    return curElemIndex;
  }
  if (curElemIndex < tokens.length -1) {
    return getNextCharPos(curElemIndex + 1);
  }
  return -1;
};
```
#### 2.5）判断当前被删除元素中的左边括号是否和右边括号是否相同

什么意思呢？比如 ((max(___)) - (min(___))) 这样的，当我删除 max(__) 的时候，我需要判断它 max(__) 右边有几个 右括号，左边有几个左括号，比如：

((max(___)) 这个，那么它左边有 2个 左括号，右边有一个小括号，因此当我删除的 max(__) 的时候，我只需要把 (max(__)) 和 运算符 - 删除掉即可。最后留下的就是 ((min(__))) 这样的了，当我继续删除 min(__)的时候，我会继续判断该元素的左边小括号 是否 和 右边小括号是否相同，如果相同的话，就把它当作一个整体一起删除掉。因此我们需要编写这么一个方法。
```
/**
 * 判断当前被删除元素中的左边括号是否和右边括号是否相同。((max(___)) - (min(___))) 这样的
 * 1）获取上/下一个运算符的的索引位置，向下/向上递归，获取左括号/右括号的数量
 * 2）判断两者是否相等
 * @param { Number } curElemIndex 当前被删除元素的索引
 * @param { String } dir 当前的方向。如果 dir === 'prev' 是从上逐渐遍历搜索，dir === 'next' 是从下逐渐遍历搜索
 * @return { Object } { leftCount, rightCount } 左括号的数量 / 右括号的数量
 */
 const getLeftAndRightCount = function(curElemIndex, dir) {     
   let leftCount = 0; // 左边括号的数量
   let rightCount = 0; // 右边括号的数量
    // 使用递归的方式 向上/向下查找
    const func = function(curElemIndex, dir) {
      const { value, start, end, type } = tokens[curElemIndex];
      if (value === null && (end - start === 1) && (type.label === ')')) {
        let flag = false;
        if (curElemIndex - 3 > 0) { // 判断前3个元素的值是否是逻辑运算符
          const { value } = tokens[curElemIndex - 3];
          flag = (value === 'sum') || (value === 'max') || (value === 'min') || (value === 'count') || (value === 'avg') ? true : false;
        }
        if (!flag) {
          rightCount++;
        }
      }
      if (value === null && (end - start === 1) && (type.label === '(')) {
        let flag = false;
        if (curElemIndex - 1 > 0) { // 判断前一个元素的值是否是逻辑运算符
          const { value } = tokens[curElemIndex - 1];
          flag = (value === 'sum') || (value === 'max') || (value === 'min') || (value === 'count') || (value === 'avg') ? true : false;
        }
        if (!flag) {
          leftCount++;
        }
      }
      if (dir === 'prev') {
        if (curElemIndex > 0) {
          const index = curElemIndex - 1;
          return func(index, dir);
        }
      } else if (dir === 'next') {
        if (curElemIndex < tokens.length - 1) {
          const index = curElemIndex + 1;
          return func(index, dir);
        }
      }
      return {
        leftCount,
        rightCount
      };
    };
    /*
      ((max(__)) - (min(__))) 
      1. 如果我删除max项，因此我需要获取 下个运算符的位置，然后 往上逐渐查找 左右括号数量是否相同。
      2. 如果我删除min项，我需要获取上个运算符的位置，然后逐渐往下查找 左右括号数量是否相同。
    */
    if (dir === 'prev') { // 向上查找, 应该获取下一个运算符的索引，从下一个运算符的位置开始逐渐向上递归查找
      const nextCharIndex = getNextCharPos(curElemIndex); // 保存下一个运算符的索引
      return func(nextCharIndex, dir);
    } else if (dir === 'next') { // 向下查找 应该获取上一个运算符的索引，从上一个运算符位置开始逐渐向下递归查找
      const prevCharIndex = getPrevCharIndex(curElemIndex); // 保存上一个运算符的索引
      return func(prevCharIndex, dir);
    } else {
      console.log('---------参赛传递有误，需要传入第二个参数方向----');
    }
  };

// 获取在数组内下一个运算符的位置索引
const getNextCharIndex = function(curElemIndex) {
  let count = 0; 
  // 点击某个元素时候，获取该值，如果该值是逻辑运算符的话，那么设置该变量为true
  let isLogic = false;
  if (curElemIndex - 3 > 0) { // 为什么减去3呢？因为 sum() 这样的 当是右边括号时候，判断sum的位置就是前面3个
    const { value } = tokens[curElemIndex - 3];
    for (let k = 0; k <= logicChars.length - 1; k++) {
      if (logicChars[k].indexOf(value) > -1) {
        isLogic = true;
        break;
      }
    }
  }
  const func = function(curElemIndex) {
    // 还是一样，使用递归的方式 向下查找对应的最近的运算符
    const { value, start, end, type } = tokens[curElemIndex];
    if (value === null && (end - start === 1) && (type.label === '(')) {
      if (!isLogic) {
        count++;
      }
    }
    const flag = chars.some(item => {
      return item.indexOf(value) > -1;
    });
    if (flag) {
      return curElemIndex - count;
    } else {
      if (curElemIndex < tokens.length - 1) {
        return getNextCharIndex(curElemIndex + 1);
      }
    }
    return -1;
  }
  return func(curElemIndex);
};
// 获取在数组内上一个运算符的位置索引
const getPrevCharIndex = function(curElemIndex) {
  let count = 0; 
  var prevFlag = true;
  const func = function(curElemIndex) {
  const { value, start, end, type } = tokens[curElemIndex];
  // 向上递归，如果中间碰到 左括号的话，那么计数器就加1，但是要过滤掉逻辑运算符中的 左括号
  if (curElemIndex - 1 > 0) {
    const prevValue = tokens[curElemIndex - 1].value;
    prevFlag = logicChars.indexOf(prevValue) > -1 ? false : true;
  }
  if (value === null && (end - start === 1) && (type.label === '(') && prevFlag) {
    count++;
  }
  const flag = chars.some(item => {
    return item.indexOf(value) > -1;
  });
  if (flag) {
    return curElemIndex + count;
  } else {
    if (curElemIndex - 1 >= 0) {
      return getPrevCharIndex(curElemIndex - 1);
    }
  }
  return -1;
};
  return func(curElemIndex);
};
```
#### 2.6）最后就是删除代码逻辑操作了
```
const deleteValue = function(curElemIndex) {
  const leftIndex = getLeftParenthesisIndex(curElemIndex);
  const rightIndex = getRightParenthesisIndex(curElemIndex);
  if (leftIndex > -1 && rightIndex > -1) { // 说明当前元素在小括号范围内
    // 1) 获取小括号的所有元素 rightIndex + 1 是因为包括最后一个右边小括号
    let newArrs = tokens.slice(leftIndex, rightIndex + 1);

    // 2）判断小括号内的当前被删除的元素是 首元素/中间元素/尾部元素
    const curElemPos = getElemPos(curElemIndex, tokens);
    let startPos = 0; // 保存开始位置索引
    let endPos = 0; // 保存结束位置索引

    if (curElemPos === 0) { // 首元素
      /*
        如果是首元素的话，同样需要判断几种情况，第一种是 (__) + __; 第二种是 (__ + ___) + ___, 第三种是：((___)) + ___
        第四种情况是：((max(__)) - (min(__))) 
        1）对于第一种情况下，删除数据的时候，startPos = leftIndex; 
        2）对于第二种情况下，如果在小括号内，不止一个元素的话，那么我们就不能把前面的小括号删除掉，因此需要从 leftIndex + 1 开始。
        所以我们需要判断在 小括号范围内 当前元素的下一个元素是否有运算符，如果有的话，就是第二种情况，否则的话，就是第一种情况。
      */
      const isNextChar = isHasChar(curElemIndex, newArrs, 'next'); // 在当前小括号中查找下一个运算符
      const isNextChar2 = isHasChar(curElemIndex, tokens, 'next'); // 在tokens数组中查找下一个运算符，针对的是第三种情况
      if (isNextChar) {
        startPos = leftIndex + 1;
      } else {
        if (isNextChar2) {
          // 这里还需要判断 下一个运算符之前的右括号的数量 是否 和 左边的左括号数量是否相等，如果不想等的话，说明后面还有运算操作
          const rets = getLeftAndRightCount(curElemIndex, 'prev');
          const { leftCount, rightCount } = rets;
          if (leftCount === rightCount) { // 如果左边和右边括号相同的话，说明后面没有内容，是一个整体，可以把整体一起删除掉
            startPos = 0;
          } else if (leftCount > rightCount) {
            startPos = leftCount - rightCount;
          }
        } else {
          startPos = leftIndex;
        }
      }
      // 结束位置判断方法：从 newArrs 数组内查找，从当前 索引 curElemIndex 查找下一个运算符的位置
      endPos = getNextCharIndex(curElemIndex) + 1; // 因为要把下个运算符删除掉，所以加1
      tokens.splice(startPos, endPos - startPos); // 截取掉tokens值
    } else if (curElemPos === 1) { // 中间元素
        /*
         * 这里的中间元素，指在tokens数组中 有上个运算符 和 下个运算符，那么也分为几种情况。
         * 比如说 第一种 1）___ + (___ + ___ - ___) 当我删除小括号中 第一个元素或第二个元素的话，他也是中间元素
         * 第二种 2) ___ + (___) + ___  当我删除小括号的话，它也属于中间元素。
         * 因此针对这几种情况，我们也需要判断下
         * 1）如果在小括号范围之内，没有上个运算符，有下个运算符，说明是在小括号中是首元素。
         * 2）如果在小括号范围之内，有上个运算符，也有下个运算符，说明是中间元素。
         * 3）如果在小括号范围内，没有上个运算符，也没有下个运算符，类似第二种情况，因此我们需要把整个小括号删除掉，并且把前面的运算符也删除掉。
         * 针对上面几种情况，我们需要做如下处理：
         * 1）针对小括号中 首元素，我们只需要把 首元素 和 后面的运算符一起删除掉。
         * 2）针对小括号的中间元素，我们需要中 中间元素 和 前面的运算符一起删除掉。
         * 3）针对第三种情况，我们需要把 小括号的所有删除掉，且需要把前面的运算符也删除掉
        */  
        // 1）首先我们需要判断的是，在小括号中，当前元素是否有上个运算符 / 下个运算符
        const isPrevChar = isHasChar(curElemIndex - leftIndex, newArrs, 'prev');
        const isNextChar = isHasChar(curElemIndex - leftIndex, newArrs, 'next');
        if (!isPrevChar && isNextChar) { // 小括号中的首元素
          startPos = leftIndex + 1; // 从小括号中第一个字符截取, 所以加1
          endPos = getNextCharIndex(curElemIndex) + 1; // 因为要把下个运算符删除掉，所以加1
          tokens.splice(startPos, endPos - startPos);

        } else if (isPrevChar && isNextChar) { // 小括号中的中间元素
          startPos = getPrevCharIndex(curElemIndex); // 从上个运算符索引开始删除
          /*
           * 获取结束位置，也要分为两种情况，第一种是正常内容，第二种是带有逻辑表达式的，比如 __+ sum(__) + __ 这样的， 
           * 当我删除逻辑表达式时，因为逻辑表达式后面还有一个小括号，需要把小括号算上。
           * 否则的话，就是当前被删除的索引 curElemIndex + 1; 
          */
          const { value } = tokens[curElemIndex];
          const flag = (value === 'L$sum') || (value === 'L$max') || (value === 'L$min') || (value === 'L$count') || (value === 'L$avg') ? true : false; 
          if (flag) {
            endPos = getNextCharIndex(curElemIndex); // // 获取下个运算符的索引当作结束位置
            tokens.splice(startPos, endPos - startPos); // 把当前被删除的索引 - 上个运算符索引
          } else {
            endPos = getNextCharIndex(curElemIndex); // 获取当前的索引
            tokens.splice(startPos, endPos - startPos); // 下个运算符索引 - 上个运算符索引
          }
        } else if (isPrevChar && !isNextChar) { // 小括号的尾部元素
          // 有上个运算符，没有下个运算符，说明元素在小括号尾部
          // 1）获取上个运算符的位置，从上个运算符位置开始删除元素
          startPos = getPrevCharIndex(curElemIndex);
          // 2）获取右边小括号的位置，
          endPos = getRightParenthesisIndex(curElemIndex);
          tokens.splice(startPos, endPos - startPos);
        } else if (!isPrevChar && !isNextChar) { // 针对第二种情况
          /*
           * 这里也要考虑两种情况，比如上个字符不是运算符的话，那么我不能把上个字符删除掉了。比如 __ + ((__)+(__)) 多个嵌套小括号的。
           * 第二种情况小括号前面 上个字符是运算符的话，那么我们需要把它删除掉
          */
          const { value } = tokens[leftIndex - 1];
          const flag = chars.some(item => {
            return item.indexOf(value) > -1;
          });
          if (!flag) {
            startPos = leftIndex; // 前面不是运算符的话，不减去1
            endPos = getNextCharIndex(curElemIndex) + 1 - startPos;
            tokens.splice(startPos, endPos); 
          } else {
            startPos = getPrevCharIndex(curElemIndex); // 获取上个运算符的索引
            endPos = rightIndex;
            tokens.splice(startPos, endPos - startPos + 1); 
          }
        }
    } else if (curElemPos === 2) { // 如果是小括号中尾部元素
      startPos = getPrevCharIndex(curElemIndex);
      /*
       * 1）从尾部删除掉
       * 如果是小括号中尾部元素，又分为两种情况
       * 第一种是： __ + (__ + ___)
       * 第二种是： __ + (___)
       * 第三种就是 count这种 count 逻辑表达式允许：count(___ / (___)) 
       * 如果对于第一种的话，当我删除括号中最后一个元素的时候，我们需要把 + 运算符 和 最后那个元素一起删除掉，因此我们这边需要判断该删除
       * 的元素前面是否有运算符，如果有运算符的话，说明是删除小括号中的最后一个字符。否则的话，就是第二种情况，把整个小括号内容删除掉，并且还需要
       * 把前面的运算符 + 号删除掉。
       * curElemIndex - leftIndex 的含义是，首先 newArrs 这个数组是从 小括号中 左括号 到 右括号 截取的数据。但是左小括号前面还有很多表达式的，
       * curElemIndex的索引是从tokens数组里面的索引的，因此我们需要减掉 前面的表达式索引，前面有多少个表达式，可以根据左括号的索引判断，所以减去
       * 左括号的索引即可得到正确的索引
      */
      const isPrevChar = isHasChar(curElemIndex - leftIndex, newArrs, 'prev');
      // 在tokens数组中查找上一个运算符，针对的是第三种情况, 
      // 当我删除 count(___ / (___))  最后一个元素的时候，我需要在tokens判断是否有运算符
      const isPrevChar2 = isHasChar(curElemIndex , tokens, 'prev');
      if (isPrevChar) {
        endPos = rightIndex;
        // tokens.splice(startPos, endPos - startPos + 1); 
        tokens.splice(startPos, endPos - startPos); 
      } else {
        if (isPrevChar2) {
          // 获取下个小括号的索引
          endPos = rightIndex -startPos + 1; // 因为要加上前面的运算符
          tokens.splice(startPos, endPos);
        } else {
          tokens.splice(startPos);
        }
      }   
    } else if (curElemPos === 3) { // 最后一个元素
      startPos = 0;
      tokens.splice(startPos);
    }
  } else { // 说明当前元素不在小括号范围内
    let startPos = 0; // 保存开始位置索引
    let endPos = 0; // 保存结束位置索引
    // 是否有 count 字符
    const isHasCount = function() {
      let flag = false;
      for (let i = 0; i < tokens.length; i++) {
        const { value } = tokens[i];
        if (value === 'count') {
          flag = true;
          break;
        }
      }
      return flag;
    };
    // 判断当前被删除的元素是 首元素/中间元素/尾部元素
    const curElemPos = getElemPos(curElemIndex, tokens);
    if (curElemPos === 0) { // 首元素
      // 这里一样要判断是否有count 比如 像 count(__ / ___) 这种
      const val = tokens[curElemIndex].value;
      const flag = isHasCount();
      if (val !== 'L$count' && flag) {
        startPos = curElemIndex;
        endPos = getNextCharIndex(curElemIndex) + 1;
        tokens.splice(startPos, endPos - startPos);
      } else {
        // 如果是首元素的话，我需要删除 从 0 开始，到下个运算符结束位置，包括运算符索引
        startPos = 0;
        endPos = getNextCharIndex(curElemIndex) + 1;
        tokens.splice(startPos, endPos);
      }
    } else if (curElemPos === 1 || curElemPos === 2) { // 中间元素 或 尾部元素
      // 如果是 中间元素 或 尾部元素 则需要删除上一个运算符 加 当前的元素
      startPos = getPrevCharIndex(curElemIndex);
      endPos = getNextCharIndex(curElemIndex);
      if (endPos === -1) {
        // 这里还需要判断 像 count(__ / ___) 这种，如果我删除最后一个的话，就不需要把最后小括号删除掉
        // 这里我们还需要判断前面有没有运算符，如果前面有运算符的话，我们只需要截取掉 运算符 + 被删除的元素即可
        const val = tokens[curElemIndex].value;
        const flag = isHasCount();
        if (val !== 'L$count' && flag) {
          endPos = curElemIndex - startPos + 1; // 因为需要把前面运算符一起删除，因此加1
          tokens.splice(startPos, endPos);
        } else {
          tokens.splice(startPos); // 截取掉tokens值
        }
      } else {
        tokens.splice(startPos, endPos - startPos); // 截取掉tokens值
      }
   } else if (curElemPos === 3) { // 最后元素
      startPos = 0;
      endPos = tokens.length;
      tokens.splice(startPos, endPos); // 截取掉tokens值
     }
   }
};
```














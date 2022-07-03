
### 理解yaml配置

  YAML 是一种 "数据序列化语言", 可以配合目前大多数编程语言使用。

  YAML语法比较简洁直观，可以使用空格来表达层次结构，最大的优点是 数据结构方面的书写，因此 YAML 更多应用于 编写配置文件。文件后缀一般以 .yml 作为后缀文件。

#### 一) 基本语法

  1）大小写敏感
```
One: 1
one: 2
```
#### 1) 使用缩进表示层级关系

  1）缩进只能使用空格，不能使用 TAB 字符
  2）缩进的空格数量不重要，但是同一层级的元素左侧必须对齐。
```
# YAML
one:
  two: 2
  three: 
    four: 4
    five: 5

// 上面的内容转换成 JSON 后 是如下json数据

"one": {
  "two": 2,
  "three": {
    "four": 4,
    "five": 5
  }
}
```
#### 2) 用 # 表示注释

  只支持单行注释
```
# 我是注释
```
#### 3）一个文件中可以包含多个文件内容

  1）使用 '---' 即三个破折号 表示一份内容的开始
  2）使用 '...' 即三个小数点表示一份内容的结束 (非必需)
```
---
# 这是第一份内容
one: 1
# 其他内容...
...

---
# 这是第二份内容
two: 2
# 其他内容...

```

#### 二）数据结构类型

#### 1）对象 (Mapping)

#### 1.1) 表示以键值对(key:value) 形式出现的数据。
```
# YAML
key: value

// 转换成JSON变为如下
"key": "value"
```
#### 1.2) 支持多层嵌套 (用缩进表示层级关系)
```
# YAML
key:
  child-key1: value1
  child-key2: value2

// 转换成JSON变为如下
"key": {
  "child-key1": "value1",
  "child-key2": "value2",
}
```
#### 1.3) 支持 流式风格 的语法。(用花括号包裹，用逗号加空格分割)
```
# YAML
key: { child-key1: value1, child-key2: value2 }

// 转换成JSON，变为如下
"key": { "child-key1": "value1", "child-key2": "value2" }
```
#### 2）数组

#### 1) 一组以 区块格式 (即 "破折号+空格") 开头的数据组成一个数组
```
# YAML
values:
  - value1
  - value2
  - value3

// 转换成JSON数据如下
"values": [ "value1", "value2", "value3" ]
```
#### 2) 同时也支持 内联格式 来表达 (用方括号包裹，逗号加空格分割)
```
# YAML
values: [value1, value2, value3]

// 转换成JSON数据如下
"values": [ "value1", "value2", "value3" ]
```
#### 3) 支持多维数组 (用缩进表示层级关系)
```
# YAML
values:
  -
    - value1
    - value2
  -
    - value3
    - value4

// 转换成JSON数据变为如下
"values": [ ["value1", "value2"], ["value3", "value4"] ]
```
#### 3) 标量

#### 1) 字符串

  字符串一般不需要用引号包裹，但是如果字符串中使用了 反斜杆 "\" 开头的转义字符就必需使用引号包裹。
```
# YAML
strings:
  - Hello without quote # 不用引号包裹
  - Hello
  world # 折成多行后会自动在中间添加空格
  - 'Hello with single quotes' # 单引号包裹
  - "Hello with double quotes" # 双引号包裹
  - "I am fine. \u263A" # 使用双引号包裹时支持 Unicode 编码
  - "\x0d\x0a is \r\n" # 使用双引号包裹时还支持 Hex 编码
  - 'He said: "Hello!"' # 单双引号支持嵌套

// 转换成JSON数据变为如下

"strings": 
  [ "Hello without quote",
    "Hello world",
    "Hello with single quotes",
    "Hello with double quotes",
    "I am fine. ☺",
    "\r\n is \r\n",
    "He said: 'Hello!'"
  ]
```
  对于多行的文字，YAML 提供了两种特殊的语法支持

  #### 保留换行

  使用 竖线符 "|" 来表示该语法，每行的缩进和行尾空白都会被去掉，而额外的缩进会被保留
```
  # YAML
  lines: |
    我是第一行
    我是第二行
      我是空智
        我是第四行
      我是第五行

// 转换成JSON数据如下

"lines": "我是第一行\n我是第二行\n  我是空智\n    我是第四行\n我是第五行"
```
#### 折叠换行

  使用 右尖括号 ">" 来表示该语法，只有空白行才会被识别为换行，原来的换行符都会被转换成空格
```
# YAML

lines: >
  我是第一行
  我也是第一行
  我仍是第一行
  我依旧是第一行

  我是第二行
  这么巧我也是第二行

// 转换成数据格式如下

"lines": "我是第一行 我也是第一行 我仍是第一行 我依旧是第一行\n我是第二行 这么巧我也是第二行"
```
#### 2）布尔值

  "true", "True", "TRUE", "yes", "Yes" 和 "YES" 都为真。
  "false", "False", "FALSE", "no", "No", 和 “NO” 都为假
```
# YAML

boolean:
  - true # True 或 TRUE
  - yes # Yes 或 YES
  - false # False 或 FALSE
  - no # No 或 NO

// 转换成JSON数据格式如下

"boolean": [ true, true, false, false ]
```
#### 3) 整数
```
# YAML
int: 
  - 666
  - 0001_0000 # 也支持二进制

// 转换成JSON数据格式如下

"int": [666, 4096]
```
#### 4) 浮点数
```
# YAML
float: 
  - 3.14
  - 6.8523015e+5 # 使用科学计数法

// 转换成JSON数据格式如下
"float": [3.14, 685230.15]
```
#### 5) 空

  "null", "Null" 和 "~" 都是空，不指定值默认也是空
```
# YAML
nulls:
  - null
  - Null
  - ~
  -

// 转换成JSON数据如下
"nulls": [ null, null, null, null ]
```
#### 6) 时间戳

  YAML 也支持 ISO 8601 格式的时间数据
```
# YAML
date1: 2020-05-26
date2: 2020-05-26T01:00:00+08:00
dete3: 2020-05-26T02:00:00.10+08:00
date4: 2020-05-26 03:00:00.10 +8

// 转换成JS 数据如下
date1: Tue May 26 2020 08:00:00 GMT+0800 (中国标准时间),
date2: Tue May 26 2020 01:00:00 GMT+0800 (中国标准时间),
dete3: Tue May 26 2020 02:00:00 GMT+0800 (中国标准时间),
date4: Tue May 26 2020 03:00:00 GMT+0800 (中国标准时间)
```
#### 数据重用与合并

  为了保持内容的简洁，避免过多重复的定义，YAML 提供了由 锚点标签“&” 和 引用标签“*” 组成的语法，利用这套语法可以快速引用相同的一些数据...
```
// YAML
a: &anchor # 设置锚点
  one: 1
  two: 2
  three: 3
b: *anchor # 引用锚点

// 转换成JSON数据如下
"a": {
  "one": 1,
  "two": 2,
  "three": 3
},
"b": {
  "one": 1,
  "two": 2,
  "three": 3
}
```
  配合 合并标签“<<” 使用可以与任意数据进行合并，你可以把这套操作想象成面向对象语言中的继承...
```
# YAML
human: &base # 添加名为 base 的锚点
    body: 1
    hair: 999
singer:
    <<: *base # 引用 base 锚点，实例化时会自动展开
    skill: sing # 添加额外的属性
programer:
    <<: *base # 引用 base 锚点，实例化时会自动展开
    hair: 6 # 覆写 base 中的属性
    skill: code # 添加额外的属性

// 转换成JSON数据如下
"human": { "body": 1, "hair": 999 },
"singer": { "body": 1, "hair": 999, "skill": "sing" },
"programer": { "body": 1, "hair": 6, "skill": "code" }
```

  






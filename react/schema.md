
### JSON Schema入门和应用

#### 一 什么是JSON Schema？

  JSON 数据格式对于前端来说比较熟悉，我们在平时开发中离不开它，比如对象序列化，webpack配置文件等都是以JSON格式定义和存储的。它以简单易懂的结构，体积小的优点在各类语言编程中流行。

  JSON Schema 是一套用来规范前后端的JSON数据格式的一种约定方案。是对JSON格式的一种约束，更明确地定义数据的类型和结构。比如我们的javascript，然后
有typeScript 来约束我们的js代码， 其实json 和 json Schema 也是类似的这种。

  比如我们要描述一个人的信息，我们可以使用JSON来描述：
```
{
  "name": "kongzhi",
  "birthday": "February 22, 1732",
  "address": "abcd"
}
```
  那JSON Schema 是什么呢？JSON Schema 主要用于描述 JSON 数据的，我们可以看到上面的JSON中不同的key-value数值，有string类型，也有date类型。针对不同的应用场景，我们想约定JSON的数据所包含的字段，字段值的类型甚至依赖关系，因此我们就需要有个规范来描述这些约束关系。因此 JSON Schema就出来了。

  下面表示一个JSON Schema，用于描述JSON数据的，我们可以很明显看到 JSON Schema 本身也是使用JSON编写的。
```
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "birthday": { "type": "string", "format": "date" },
    "address": { "type": "string"}
  }
}
```
  我们可以举个简单的列子，来了解JSON Schema的作用，假如有两个对象a，b, 唯一的区别是对象里的属性的类型不同，当我们想指定对象属性的类型时，假如我们只想要字符串类型的话，我们可以使用 JSON Schema 来进行如下定义：
```
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    }
  }
}
```
```
// a 对象定义是正确的
var a = {
  title: "123"
};

// b 对象是错误的
var b = {
  title: 123
};
```
  如上是简单的使用 JSON Schema 对象的定义，从上面我们可以了解到 定义的变量类型是对象，而这个变量对象里有title属性，title属性的类型是string类型。

  JSON Schema 核心定义主要有以下这些数据类型，通过type来指定JSON的数据类型。

  string, number, object, array, boolean, null 等类型。

#### 数据类型

在JSON Schema 中使用最多的是 type 关键字，它包含了 JSON格式的基本类型。
```
string: 字符串类型
number：数字型，包括整型(int)和浮点整型(float)
boolean: 布尔型，true或false
object：对象型，无序的键:值对集合
array: 数组型，有序的值序列。
null: 空型。
```
### 关键字

以Object类型为列，列举在 JSON Schema 所经常使用到的关键字
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "$id": "https://example.com/schemas/person",
  "title": "base info",
  "description": "base information about person",
  "type": "object",
  "required": ["name", "age", "phone"],
  "definitions": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 10
    }
  },
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 10
    },
    "age": {
      "type": "number",
      "minimum": 18,
      "exclusiveMinimum": true,
      "maximum": 65,
      "exclusiveMaximum": true
    },
    "phone": {
      "type": "string",
      "pattern": "^1\\d{10}$"
    },
    "parents": {
      "type": "array",
      "items": [{ "$ref": "#/definitions/name" }],
      "minItems": 1,
      "maxItems": 2,
      "uniqueItems": true
    },
    "address": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "enum": ["guangzhou", "beijing"]
        }
      }
    }
  }
}
```
```
$schema: 声明此JSON片段属于JSON Schema，并遵循所声明的JSON Schema版本规范。
$id: 为JSON Schema 声明一个统一资源标识符，使解析 $ref 时能够引用片段。
title: 为JSON Schema 文件提供标题。
description: 为JSON Schema文件提供描述信息。
definitions: 声明子schema，使解析 $ref 能够引用该片段。
$ref: 引用JSON Schema片段
required: 定义对象类型 properties 所声明的字段是否必须，值必须是数组，数组中的元素必须是字符串类型且唯一。
type: 定义元素的类型。
properties：定义对象类型里的属性(键值对)，每个字段的值都是一个有效的schema片段，用来限制每个字段的格式
minimum：约束取值范围，标识取值范围应该大于或等于minimum
exclusiveMinimum：假若minimum或exclusiveMinimum同时存在，且exclusiveMinimum为true，则取值范围大于minimum
maximum：约束取值范围，标识取值范围应该小于或等于maximum
exclusiveMaximum：假若maximum或exclusiveMaximum同时存在，且exclusiveMaximum为true，则取值范围小于maximum
minLength：字符串类型数据的最小长度
maxLength：字符串类型数据的最大长度
pattern：使用正则表达式约束字符串类型数据
items：用来定义数组类型的子元素，值必须为数组，且是一个有效的schema片段
minItems: 定义数组类型大小的最小长度
maxItems: 定义数组类型大小的最大长度
uniqueItems: 定义数组类型子元素是否必须唯一
enum: 用来限制值的范围，值必须在enum所指定的集合里面
```
#### Ajv 校验

如果我们写好了 JSON Schema的话，如果想要验证是否写对了，可以使用 ajv 来做校验，因此我们可以写一个简单的 ajv 校验函数。
```
const Ajv = require('ajv');
const ajv = new Ajv();

function ajvValidate(schema, data) { 
  const vaild = ajv.validate(schema, data);
  if (!vaild) { 
    return ajv.errors;
  }
  return "passed!";
}

module.exports = {
  ajvValidate,
};
```

#### 一 字符串

#### 1) type 为字符串类型

const schema = {
  type: "boolean"
};

#### 2) type 是字符串数组

const { ajvValidate } = require('./ajv');

const schema = {
  type: ["string", "number"],
};

const data2 = "happy";
const data3 = false; 
    
console.log('---schema---', ajvValidate(schema, data2)); // passed

console.log('--schema2----', ajvValidate(schema, data3)); // 报错提示如下
/*
  [
    { "instancePath": "", "schemaPath": "#/type", "keyword": "type",
      "params": { "type": [ "string", "number" ]},
      "message": "must be string,number"
    }
  ]
*/

#### 二 对象

属性：使用关键字 properties

const { ajvValidate } = require('./ajv');

const schema = {
  type: 'object',
  properties: {
    background: {
      type: "string",
    },
    width: {
      type: 'number',
    },
    height: {
      type: 'number',
    },
  },
};
const data1 = {}; // passed
const data2 = {
  background: "red",
  width: 100,
  height: 100,
}

console.log('---schema-11--', ajvValidate(schema, data1)); // passed
console.log('---schema--22-', ajvValidate(schema, data2)); // passed

此外，我们可以使用 enum 为属性指定可选的属性值 "集合"。这样，属性值只能是 enum 集合中的某个值。

const schema = {
  type: 'object',
  properties: {
    color: {
      type: 'string',
      enum: ['red', 'blue', 'black'],
    },
  },
};
const data = {
  color: '#999'
};
const data2 = {
  color: 'blue',
}
console.log('---schema-11--', ajvValidate(schema, data)); // 报错 must be equal to one of the allowed values
console.log('---schema--22-', ajvValidate(schema, data2)); // passed

#### 2.1) 模式属性

使用关键字 patternProperties

也就是属性名使用正则来匹配，如果某个属性名匹配到了这个正则模式，那就使用这个正则模式属性的约束。

// 正则模式属性
const schema = {
  type: "object",
  patternProperties: {
    "^A_": {
      type: "number",
    },
    Z_: {
      type: "string",
    },
  }
};
const data = {
  A_A: 991,
  Z_Z: "hhh",
};
console.log('---schema--22-', ajvValidate(schema, data)); // passed

#### 2.2) 额外属性

使用关键字 additionalProperties

在没指定 additionalProperties 的时候，默认情况下, 写上 properties 和 patternProperties 以外的属性也是可以的，但是如果将 additionalProperties 设置为false的话，那便是不能添加额外的属性了。

// 额外属性
const schema = {
  type: "object",
  properties: {
    width: { type: "number" },
    height: { type: "number" },
  },
  additionalProperties: false,
};
const data = { color: "blue" }; 
console.log(ajvValidate(schema, data)); //  must NOT have additional properties

还有一种情况，可以通过 type 指定 additionalProperties 的类型， 只有符合type的属性才能被加进来。

#### 2.3) 必须属性

使用关键字 required, required 是一个数组。

// 额外属性
const schema = {
  type: "object",
  properties: {
    width: { type: "number" },
    height: { type: "number" },
  },
  additionalProperties: {
    type: 'string',
  },
  required: ['width', 'height'],
};
const data = { color: "blue" }; 
console.log(ajvValidate(schema, data)); //  must have required property 'width'

我们如上代码 必须属性有 width 和 height 两个属性，但是报错信息只提示了 width 是必须的。 没有两个一起提示。

#### 2.4）属性数量

使用关键字 minProperties, maxProperties 

可以使用属性数量关键字来限制属性个数，minProperties, maxProperties 必须是正整数或0.


#### 三）number 类型

支持的格式包括：正负整数 (1, -1等)， 浮点数(5.7, 2.333等)，
















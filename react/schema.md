
### JSON Schema入门和应用

#### 一 什么是JSON Schema？

JSON 数据格式对于前端来说比较熟悉，我们在平时开发中离不开它，比如对象序列化，webpack配置文件等都是以JSON格式定义和存储的。它以简单易懂的结构，体积小的优点在各类语言编程中流行。

JSON Schema 是一套用来规范前后端的JSON数据格式的一种约定方案。是对JSON格式的一种约束，更明确地定义数据的类型和结构。比如我们的javascript，然后
有typeScript 来约束我们的js代码， 其实json 和 json Schema 也是类似的这种。

比如我们要描述一个人的信息，我们可以使用JSON来描述：

{
  "name": "kongzhi",
  "birthday": "February 22, 1732",
  "address": "abcd"
}

那JSON Schema 是什么呢？JSON Schema 主要用于描述 JSON 数据的，我们可以看到上面的JSON中不同的key-value数值，有string类型，也有date类型。针对不同的应用场景，我们想约定JSON的数据所包含的字段，字段值的类型甚至依赖关系，因此我们就需要有个规范来描述这些约束关系。因此 JSON Schema就出来了。

下面表示一个JSON Schema，用于描述JSON数据的，我们可以很明显看到 JSON Schema 本身也是使用JSON编写的。

{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "birthday": { "type": "string", "format": "date" },
    "address": { "type": "string"}
  }
}

我们可以举个简单的列子，来了解JSON Schema的作用，假如有两个对象a，b, 唯一的区别是对象里的属性的类型不同，当我们想指定对象属性的类型时，假如我们只想要字符串类型的话，我们可以使用 JSON Schema 来进行如下定义：

{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    }
  }
}

// a 对象定义是正确的
var a = {
  title: "123"
};

// b 对象是错误的
var b = {
  title: 123
};

如上是简单的使用 JSON Schema 对象的定义，从上面我们可以了解到 定义的变量类型是对象，而这个变量对象里有title属性，title属性的类型是string类型。

JSON Schema 核心定义主要有以下这些数据类型，通过type来指定JSON的数据类型。

string, number, object, array, boolean, null 等类型。

#### 数据类型

在JSON Schema 中使用最多的是 type 关键字，它包含了 JSON格式的基本类型。

string: 字符串类型
number：数字型，包括整型(int)和浮点整型(float)
boolean: 布尔型，true或false
object：对象型，无序的键:值对集合
array: 数组型，有序的值序列。
null: 空型。

### 关键字

以Object类型为列，列举在 JSON Schema 所经常使用到的关键字

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














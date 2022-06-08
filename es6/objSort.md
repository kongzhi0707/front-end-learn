
### JS中的数组对象排序

#### 一：普通数组排序

  js中有方法 sort() 可以为数组排序，但是可以接收一个可选参数，用来确定元素顺序的函数。如果该参数被省略了，那么数组中的元素将按照ASCII字符顺序进行排序。比如如下代码：
```
var arr = ["a", "b", "A", "B"];
arr.sort();
console.log(arr); // 打印：["A", "B", "a", "b"]
```
  大写字母A，B的ASCII值分别为65，66，其他大写字符值以此类推.... 小写 a, b 的值分别是97，98, 也一样以此类推.... 因此上面的结果是 ["A", "B", "a", "b"]; 

  如果数组元素是数字的话，比如如下:
```
var arrs = [15, 8, 25, 3];
arrs.sort();
console.log(arrs); // 打印：[15, 25, 3, 8];
```
  其实数字1的ASCII值为49,其他数字值以此类推..., 因此 15 和 3 比较的ASCII值，它首先比较的15中的1的ASCII值为49， 3 的ASCII值为51，因此 3 > 15 的ASCII值。会先比较第一位，第一位如果值小于的话，就直接返回结果。其他的也是依次类推的含义，因此最后打印 [15, 25, 3, 8];

  比较函数接收两个参数，如果第一个参数位于第二个之前则返回一个负数，如果两个参数相等则返回0，如果第一个参数位于第二个之后则返回一个正数。

  比如如下代码：
```
var arrs = [23, 9, 4, 78, 3];
var compare = function(x, y) {
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
}
console.log(arrs.sort(compare)); // [3, 4, 9, 23, 78]
```
  如果我们按照降序排序的话，比较函数写成如下这样：
```
var arrs = [23, 9, 4, 78, 3];
var compare = function(x, y) {
  if (x < y) {
    return 1;
  } else if (x > y) {
    return -1;
  } else {
    return 0;
  }
}
console.log(arrs.sort(compare)); // [78, 23, 9, 4, 3]
```
#### 二：数组对象排序

  如果数组是对象，我们需要根据数组中的某个属性对数组进行排序。那么代码需要写成如下：
```
var arrs = [{name: 'zl', age: 24}, {name: 'wl', age: 25}];
var compare = function(obj1, obj2) {
  var val1 = obj1.name;
  var val2 = obj2.name;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
};
console.log(arrs.sort(compare)); // 打印：[ {name: 'wl', age: 25}, {name: 'zl', age: 24} ]
```
  如上排序也是按照字母的ASCII编码值来进行排序的，因为字母 w 排在 字母 z 前面，因此从小到大排序。

  如果上面我们要按照 age 进行排序呢？我们能不能写一个通用的函数出来呢？那么如果按照数字排序的话，需要考虑该数字是不是字符串。因此我们函数变成如下了：
```
var arrs = [{name: 'wl', age: '30'}, {name: 'zl', age: 24}, {name: 'wl', age: '25'}];
var compare = function(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}
/**
 * 下面打印的结果为：[{name: 'zl', age: 24}, {name: 'wl', age: '25'}, {name: 'wl', age: '30'}] 
*/
console.log(arrs.sort(compare('age')));

/**
 * 下面打印的结果为：[ {name: 'al', age: '25'}, {name: 'wl', age: '30'}, {name: 'zl', age: 24}] 
*/
console.log(arrs.sort(compare('name')));
```
  如上比较函数中，先把比较的属性值转化为数字 Number(var1), 再通过 !isNaN(Number(var1)) 判断转换后的值是不是数字，如果转换后的值是数字的话，
则比较转换后的值。

#### 三：一个数组对象根据另一个数组排序
```
var list = [
  { name:'上海', code:'shanghai' },
  { name:'西安', code:'xian' },
  { name:'深圳', code:'shenzhen' },
  { name:'北京', code:'beijing' }
];
list.sort((a,b)=>{
  let order=['beijing','xian','shanghai','shenzhen'];
  // 根据在排序数组的index位置进行比较排序
  return order.indexOf(a.code)-order.indexOf(b.code);
});
console.log(list);
/*
 * 排序后的结果
[
  { name: "北京", code: "beijing" },
  { name: "西安", code: "xian" },
  { name: "上海", code: "shanghai" } ,
  { name: "深圳", code: "shenzhen" }
]
*/
```
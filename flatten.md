
### JS扁平化(flatten)数组

JS扁平化分类

1. 对象扁平化 （深度很深的对象，经过偏平化编程深度为1的对象）
2. 数组扁平化 （多维数组经过偏平变成一维数组）

  假如我们有一个数组 var arrs = [1, [2, 3, [4]]]. 我们怎么样能把 arrs变成 [1, 2, 3, 4]呢？即让多维数组降维，转换为只有一层的数组。

#### 1）使用递归方法

取出数组中的值然后递归判断。代码如下：
```
function flatten(arr) {
  var results = [];
  if (Array.isArray(arr)) {
    // 遍历
    for (let i = 0; i < arr.length; i++) {
      results = results.concat(flatten(arr[i]));
    }
  } else {
    results.push(arr);
  }
  return results;
}
var arrs = [1, [2, 3, [4]]];
console.log(flatten(arrs)); // 打印 [1, 2, 3, 4]
```
#### 2) 利用reduce实现

代码如下：
```
function flatten(arr) {
  return arr.reduce(function(prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
var arrs = [1, [2, 3, [4]]];
console.log(flatten(arrs)); // 打印 [1, 2, 3, 4]
```

### 数组扁平化

数组扁平化是将 [1, [2, [3]]] 这种多层的数组变成一维数组 [1, 2, 3]; 我们可以使用 Array.prototype.flat 可以直接将多维数组转化成一维数组。
```
[1, [2, [3]]].flat(2); // [1, 2, 3]
```
1) 使用递归

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
2) 利用reduce实现
```
function flatten(arr) {
  return arr.reduce(function(prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
var arrs = [1, [2, 3, [4]]];
console.log(flatten(arrs)); // 打印 [1, 2, 3, 4]
```
3）ES6实现
```
function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
var arrs = [1, [2, 3, [4]]];
console.log(flatten(arrs)); // 打印 [1, 2, 3, 4]
```
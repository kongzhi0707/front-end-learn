
### 冒泡排序

  原理：数组中有n个数，比较每相邻的两个数，如果前者大于后者，就把两个数交换位置。因此，第一次循环后就可以选出一个最大的数放在后面；那么经过 n-1次，就完成了所有数的排序。
```
var arrs = [3, 4, 1, 2];
// 遍历该数组
for (let i = 0, ilen = arrs.length - 1; i < ilen; i++) {
  // 如果前面一个数 大于 后面的一个数，就交换两个数的位置
  if (arrs[i] > arrs[i+1]) {
  	const temp = arrs[i];
  	arrs[i] = arrs[i+1];
  	arrs[i+1] = temp;
  }
}
console.log(arrs); // 打印：[3, 1, 2, 4]
```
  如上我们就可以找到数组中的最大的数，放到最后，如果我们继续重复 arrs.length - 1 次的话，便可以实现数组从小到大的排序。

  代码如下：
```
var arrs = [3, 4, 1, 2];
// 遍历该数组
for (let j = 0, jlen = arrs.length - 1; j < jlen; j++) {
  for (let i = 0, ilen = arrs.length - 1; i < ilen; i++) {
    // 如果前面一个数 大于 后面的一个数，就交换两个数的位置
    if (arrs[i] > arrs[i+1]) {
      const temp = arrs[i];
      arrs[i] = arrs[i+1];
      arrs[i+1] = temp;
     }
  }
}
console.log(arrs); // 打印：[1, 2, 3, 4] 
```
  如上代码实现了冒泡排序，但是内层for循环写成了 i < arrs.length - 1 是不是不合适呢？
因为当我们第一次找到最大的数后，会把最大的数放到最后，因此它不会再循环中出现，所以内层循环需要改成 i < arrs.length - 1 - j. 如下代码：
```
var arrs = [3, 4, 1, 2];
// 遍历该数组
for (let j = 0, jlen = arrs.length - 1; j < jlen; j++) {
  for (let i = 0, ilen = arrs.length - 1 - j; i < ilen; i++) {
    // 如果前面一个数 大于 后面的一个数，就交换两个数的位置
    if (arrs[i] > arrs[i+1]) {
      const temp = arrs[i];
      arrs[i] = arrs[i+1];
      arrs[i+1] = temp;
     }
  }
}
console.log(arrs); // 打印：[1, 2, 3, 4]
```
#### 排序优化

  我们有这么一种情况，当原数组是 arrs = [1,2,4,3]; 在经过我们第一轮排序之后，数组就变成了
arrs = [1,2,3,4]; 那么这个时候数组已经排序完成了，但是如果我们不优化的话，数组还会继续
循环，因此我们可以加个标志位，如果数组某次循环完成后，没有任何数需要进行交换，那么就可以让
最外层的循环提前结束。这样就可以减少外层循环的次数。提高性能。因此我们代码需要改成如下：
```
var arrs = [3, 4, 1, 2];
function testFunc(arrs) {
  // 遍历该数组
  for (let j = 0, jlen = arrs.length - 1; j < jlen; j++) {
    let done = true;
    for (let i = 0, ilen = arrs.length - 1 - j; i < ilen; i++) {
      // 如果前面一个数 大于 后面的一个数，就交换两个数的位置
      if (arrs[i] > arrs[i+1]) {
        const temp = arrs[i];
        arrs[i] = arrs[i+1];
        arrs[i+1] = temp;
        done = false;
       }
    }
    if (done) {
       break;
     }
  }
  return arrs;
}
console.log(testFunc(arrs)); // 打印：[1, 2, 3, 4]
```
#### 性能

时间复杂度：平均时间复杂度o(n*n), 最好情况是o(n), 最差的情况o(n*n);
空间复杂度：o(1);

时间复杂度是指一个算法执行所耗费的时间。
空间复杂度指运行一个程序所需内存的大小。






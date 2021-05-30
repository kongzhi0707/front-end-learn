
### 快速排序

在我们平均状况下，排序n个项目要O(n)次比较，在最坏的状况下则需要O(n的平方比较)。因此排序我们使用快速来排序。

快速排序的3个基本步骤：
```
1. 从数组中选择一个元素作为基准点。
2. 排序数组，所有比基准值小的的元素摆放在左边，大于基准值的摆放在右边。
3. 最后利用递归，将摆放在左边的数组和右边的数组再进行一次上述的1和2操作。
```
快速排序方法一：
```
var quickSort = function(arrs) {
  if (arrs.length < 1) {
	return arrs;
  }
  var middleIndex = Math.floor(arrs.length / 2);
  var value = arrs.splice(middleIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arrs.length; i++) {
	if (arrs[i] < value) {
	  left.push(arrs[i]);
	} else {
	  right.push(arrs[i]);
	}
  }
  return quickSort(left).concat([value], quickSort(right));
}
console.log(quickSort([7, 3, 2, 12, 15]));
```
  如上代码实现：选择一个中间的数字作为基准点，用两个数组分别是保存比基准数小的值，和比基准数大的值，最后递归左边的数组和右边的数组，使用concat去做一个数组的合并。

缺点：
1. 首先我们使用了两个数组空间，产生了空间复杂度。
2. concat操作会对数组进行一次拷贝，它的复杂度也会是O(n)。
3. 获取基准点使用了一个splice操作，在js中splice会对数组进行一次拷贝操作。最差的情况复杂度为O(N).

优点：

1. 代码简单明了，可读性强，易于理解。


下面是我们使用的第二种方法：

基本原理：

1. 初始化 i = -1;
2. 循环数组，找到比支点小的数就将i向右移动一个位置，同时与下标i交换位置。
3. 循环结束后，最后将支点与i+1位置的元素进行交换位置。

下面是代码实现：
```
function swap(A, i, j) {
  const t = A[i];
  A[i] = A[j];
  A[j] = t;
}
/*
* @param A 数组
* @param p 起始下标
* @param r 结束下标
*/
function dvide(A, p, r) {

  // 基准点, 使用最后一个元素作为基准点
  const pivot = A[r-1];

  // i 初始化是-1，也就是起始下标的前一个
  let i = p - 1;

  // 循环
  for (let j = p; j < r-1; j++) {
	// 如果比基准点小就i++; 然后交换元素位置
	if (A[j] <= pivot) {
	  i++;
	  swap(A, i, j);
	}
  }
  // 最后将基准点插入到 i+1的位置
  swap(A, i+1, r-1);
  // 返回最终指针i的位置
  return i+1;
}
/*
* @param A 数组
* @param p 起始下标
* @param r 结束下标
*/
function qsort(A, p, r) {
  if (p < r-1) {
	const q = dvide(A, p, r);
	qsort(A, p, q);
	qsort(A, q+1, r);
  }
  return A;
}
const arrs = [7, 3, 2, 12, 15];
console.log(qsort(arrs, 0, arrs.length))
```
第二种方法比第一种方法理解起来复杂点，但是性能上得到提升了。减少了两个o(n)的操作。第一种方法在处理
非常大的数据时候性能上可能会慢一点。

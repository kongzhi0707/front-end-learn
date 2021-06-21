
### js归并排序

思路看这篇文章：<a href="https://www.jianshu.com/p/e3cb5423f89c">归并排序</a>

代码如下：
```
function mergeSort(array) {
  let len = array.length;
  if (len <=1) {
  	return array;
  }
  let num = Math.floor(len/2);
  let left = mergeSort(array.slice(0, num));
  let right = mergeSort(array.slice(num, array.length));
  return merge(left, right);

  function merge(left, right) {
  	let [l, r] = [0, 0];
  	let results = [];
  	while(l < left.length && r < right.length) {
  	if (left[l] < right[r]) {
  	  results.push(left[l]);
  	  l++;
  	} else {
  	  results.push(right[r]);
  	  r++;
  	}
  }
  results = results.concat(left.slice(l, left.length));
  results = results.concat(right.slice(r, right.length));
  return results;
 }
}
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10])); // [3, 9, 10, 27, 38, 43, 82]
```
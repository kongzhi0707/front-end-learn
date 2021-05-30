
### 选择排序

  原理：首先从源数组中找到最小的元素，并把该元素放在数组的最前面，然后再从剩下的元素中寻找最小的元素，放在之前最小元素的后面。依次类推，直到排序完成。

  代码如下：
```
var arrs = [4, 3, 1, 2];
function testFunc(arrs) {
  for(let i = 0; i < arrs.length; i++) {
  	var minIndex = i;
  	for (j = i+1; j < arrs.length; j++) {
  	  if (arrs[j] < arrs[minIndex]) {
  	  	minIndex = j;
  	  }
  	}
  	var temp = arrs[minIndex];
  	arrs[minIndex] = arrs[i];
  	arrs[i] = temp;
  }
  return arrs;
}
console.log(testFunc(arrs)); // 打印：[1, 2, 3, 4] 
```

  如上代码，首先循环数组 arrs，先赋值0给minIndex参数索引，然后我们再循环该数组，从第二项开始循环，因此 j = i + 1;判断 如果后面一项的值小于前面的一项值的话，就把后面的索引赋值给 minIndex；比如 minIndex = 1; 然后使用临时变量 temp = arrs[minIndex] 保存后面项的值，然后第二项的值 arrs[minIndex] = arrs[i]; 就把第一项的值赋值给第二项。然后把第二项临时变量小的值赋值给第一项 arrs[i] = temp; 依次类推... 最后返回数组。

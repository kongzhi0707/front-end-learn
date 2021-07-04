
### js数组去重

#### 1) 利用ES6 Set去重
```
var arr = [1, 1, 8, 8, 12, 12, 15, 15, 16, 16];
function unique (arr) {
  return Array.from(new Set(arr))
}
console.log(unique(arr)); // [1,8,12,15,16]
```
#### 2) 利用for嵌套for，然后splice去重
```
var arr = [1, 1, 8, 8, 12, 12, 15, 15, 16, 16];
function unlink(arr) {
  for (var i = 0; i < arr.length; i++) {    // 首次遍历数组
    for (var j = i + 1; j < arr.length; j++) {   // 再次遍历数组
      if (arr[i] == arr[j]) {          // 判断连个值是否相等
        arr.splice(j, 1);           // 相等删除后者
        j--;
      }
    }
  }
  return arr
}
console.log(unlink(arr)); // [1, 8, 12, 15, 16]
```
#### 3）利用indexOf去重
```
var arr = [1, 1, 8, 8, 12, 12, 15, 15, 16, 16];
function unlink(arr) {
  if (!Array.isArray(arr)) {
    console.log('错误！')
    return
  }
  var array = [];
  for (var i = 0; i < arr.length; i++) {    // 首次遍历数组
    if (array.indexOf(arr[i]) === -1) {   // 判断索引有没有等于
      array.push(arr[i])
    }
  }
  return array
}
console.log(unlink(arr)); // [1, 8, 12, 15, 16]
```
#### 4）利用includes
```
var arr = [1, 1, 8, 8, 12, 12, 15, 15, 16, 16];
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array =[];
  for(var i = 0; i < arr.length; i++) {
    if( !array.includes( arr[i]) ) {//includes 检测数组是否有某个值
      array.push(arr[i]);
    }
  }
  return array;
}
console.log(unique(arr)); // [1, 8, 12, 15, 16]
```
#### 5、利用filter
```
var arr = [1, 1, 8, 8, 12, 12, 15, 15, 16, 16];
function unlink(arr) {
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
  });
}
console.log(unlink(arr)); // [1, 8, 12, 15, 16]
```

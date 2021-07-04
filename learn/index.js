
var arr = [1, 1, 8, 8, 12, 12, 15, 15, 16, 16];
function unlink(arr) {
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index;
  });
}
console.log(unlink(arr)); // [1, 8, 12, 15, 16]

### 全排列组合算法

比如给一个数组 datas = [a, b, c, d] 进行全排列组合，则组合的结果为: ["a", "b", "ab", "c", "ac", "bc", "abc", "d", "ad", "bd", "abd", "cd", "acd", "bcd", "abcd"];

实现思路: 
```
1. datas是原数组，在函数内，我们定义一个新数组arrs来保存原数组中的某个值。
2. groups是返回的新数组。如果返回的新数组有长度的话，我们需要遍历该数组，然后和原来的数组取出来的某个值合并。
3. groups数组和arrs数组合并。
4. 最后判断 index + 1索引是否大于datas的长度，如果大于或等于直接返回groups新数组，否则递归函数。
```
```
function getValues(datas, index = 0, groups = []) {
  // 依次取出原数组的一个值，存入新数组arrs中
  const arrs = [];
  arrs.push(datas[index]);
  // 遍历groups数组，组合数据
  if (groups.length) {
    for (let i = 0; i < groups.length; i++) {
        arrs.push(groups[i] + datas[index]);
    }
  }
  // 合并groups 和 arrs 数组
  groups = groups.concat(arrs);
  // 判断当前的索引 index + 1 是否大于 datas.length ，如果大于 直接返回 groups数组，否则递归函数
  if (index + 1 >= datas.length) {
    return groups;
  } else {
    return getValues(datas, index + 1, groups);
  }
}
const datas = ['a', 'b', 'c', 'd'];
// 返回 ["a", "b", "ab", "c", "ac", "bc", "abc", "d", "ad", "bd", "abd", "cd", "acd", "bcd", "abcd"]
console.log(getValues(datas))
```
2. 给定一个 没有重复 数字的序列，返回其所有可能的全排列。
```
输入: [1, 2, 3]
输出: [
  [1, 2, 3],
  [1, 3, 2],
  [2, 1, 3],
  [2, 3, 1],
  [3, 1, 2],
  [3, 2, 1]
];
```
```
const nums = [1,2,3];
var permute = function(nums) {
  let rets = nums.sort((m, n)=> m - n);
  let res = []; // 保存最终返回的数组值
  function def(arrs, path) {
    for (let i = 0; i < arrs.length; i++) {
      let curPath = [...path, arrs[i]];
      let copy = [...arrs]; // 克隆一份外侧数组，防止污染外层变量
      copy.splice(i, 1);
      if (curPath.length === rets.length) {
        res.push(curPath);
      };
      if (copy.length > 0) {
        def(copy, curPath);
      };
    }
  }
  def(rets, []);
  return res;
};
console.log(permute(nums));
```
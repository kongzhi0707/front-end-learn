
### 最长公共前缀

  编写一个函数来查找字符串数组中的最长公共前缀，如果不存在公共前缀，返回空字符串。

  比如：输入：["flower", "flow", "flight"]; 那么结果输出："fl"

  比如：输入：["dog", "racecar", "car"]; 那么结果输出："";

  说明：所有输入只包含小写字母 a-z.

  代码实现如下：
```
var arrs = ["flower", "flow", "flight"];
var longestCommonPrefix = function(strs) {

  // 判断空数组情况，并直接将第一位元素作为参照物
  let re = strs[0] || '';

  // 注意，这里遍历是从1开始，因为第一位被我们拿来当参照物了
  for (let i = 1, ilen = strs.length; i < ilen; i++) {

    // 注意这里的正则加了^，表示从字符开始位置开始匹配
    var regex = new RegExp('^' + re);

    // 比较其它字符看是否符合，若不符合让正则条件的字符递减
    while (re.length && !regex.test(strs[i])) {
      re = re.slice(0, re.length - 1);
      regex = new RegExp('^' + re);
    }
  }
  return re;
};
console.log(longestCommonPrefix(arrs));
```







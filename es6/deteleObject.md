
### js 去掉数组对象中的重复对象
```
/**
  * 实现思路非常简单，就是把 对象当作key，值设置为true，放入对象里面去，然后判断该对象不为true的话，就把该对象
  * 存入数组里面去。这样就实现了数组对象的过滤。
  * 比如 { name: 'kongzhi1', url: 'a'}, 这样的，我们把 它变成对象的key， 因此转换成:
  * obj = { "namekongzhiurla": true }, 然后判断 obj["namekongzhiurla"] 是否等于true， 不等于true， 就把该
  * 对象存入新数组里面去了， 因此最后就会过滤掉相同的key， 也就过滤掉数组中相同的对象。
  */
function deleteObject(obj) {
  var uniques = [];
  var stringify = {};
  for (let i = 0; i < obj.length; i++) {
    let keys = Object.keys(obj[i]);
    keys.sort(function(a, b) {
      return Number(a) - Number(b);
    });
    var str = '';
    for (let j = 0; j < keys.length; j++) {
      str += JSON.stringify(keys[j]);
      str += JSON.stringify(obj[i][keys[j]]);
    }
    if (!stringify.hasOwnProperty(str)) {
    uniques.push(obj[i]);
    stringify[str] = true;
    }
  }
  return uniques;
}
const obj = [
  { name: 'kongzhi1', url: 'a'},
  { name: 'kongzhi1', url: 'a'},
  { name: 'kongzhi2', url: 'a'},
  { name: 'kongzhi2', url: 'a'},
  { name: 'kongzhi3', url: 'a'},
  { name: 'kongzhi3', url: 'a'},
];

/**
 * 打印的值为：
 * [{name: 'kongzhi', url: 'a'}, {name: 'kongzhi2', url: 'a'}, {name: 'kongzhi3', url: 'a'}]
*/
console.log(deleteObject(obj));
```
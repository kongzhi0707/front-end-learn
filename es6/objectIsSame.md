
### JS 判断两个对象是否相同

#### 一：把两个对象转换成字符串进行对比
```
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const obj3 = { a: 1, b: 3 };

console.log(JSON.stringify(obj1) === JSON.stringify(obj2)); // 打印 true
console.log(JSON.stringify(obj1) === JSON.stringify(obj3)); // 打印 false
```
#### 二：Object.keys()
```
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const obj3 = { a: 1, b: 3 };

function compareObj(obj1, obj2) {
  const obj1Key = Object.keys(obj1);
  const obj2Key = Object.keys(obj2);
  if (obj1Key.length !== obj2Key.length) {
    return false;
  }
  for (let i = 0; i < obj1Key.length; i++) {
    let key = obj1Key[i];
    if (!obj2Key.includes(key)) {
      return false;
    }
    if (obj2[key] !== obj1[key]) {
      return false;
    }
  }
  return true;
}
console.log(compareObj(obj1, obj2)); // true
console.log(compareObj(obj1, obj3)); // false
```
#### 三：Object.entries
```
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };
const obj3 = { a: 1, b: 3 };

console.log(Object.entries(obj1).toString() === Object.entries(obj2).toString()); // true
console.log(Object.entries(obj1).toString() === Object.entries(obj3).toString()); // false
```


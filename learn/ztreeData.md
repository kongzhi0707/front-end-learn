
### JS树形数据操作

#### 1. 给树形菜单添加一个唯一标识

比如给嵌套循环树形菜单添加一个customId字段的唯一标识。代码如下：

```
function renderTreeFunc(data) {
  let arrs = [];
  let i = 1;
  const loopFunc = function(data) {
    const rets = [];
    let obj = {};
    if (data.length > 0) {
      data.forEach(item => {
      const temp = { ...item };
      const { nodeName, nodeType } = item;
      obj = {
        'nodeName': nodeName,
        'nodeType': nodeType,
        'customId': i++,
      };
      if (temp.children && temp.children.length) {
        temp.children = loopFunc(temp.children);
        obj['children'] = temp.children;
      }
        rets.push(obj);
      })
    }
    return rets;
  }
  if (data && data.length) {
    arrs = loopFunc(data);
  }
  return arrs;
}
const rets = renderTreeFunc(data);
console.log('-----rets----', rets);
```

#### 2. 根据id获取该节点的所有父节点的对象

```
function getParentsId(list, id) {
  for (let i in list) {
    if (list[i].customId == id) {
      return [list[i]];
    }
    if (list[i].children) {
      let node = getParentsId(list[i].children, id);
      if (node !== undefined) {
        return node.concat(list[i]);
      }
    }
  }
}
const newArrs = getParentsId(rets, 3);
console.log('----newArrs---', newArrs);
```

#### 3. 树形菜单添加序号，比如 1.1/1.1.1/1.1.2 这样的。

```
const setIndex = (data) => {
  console.log('----初始化数据----', data);
  let queue = [...data];
  let loop = 0;
  while (queue.length > 0) {
    loop++
    [...queue].forEach((child, i) => {
      queue.shift()
      if (loop == 1) {
        child.customIndex = i + 1 + "";
      }
      if (child.children && child.children.length > 0) {
        for (let ci = 0; ci < child.children.length; ci++) {
          child.children[ci].customIndex = child.customIndex + "." + (ci + 1)
        }
        queue.push(...child.children)
      }
    })
  }
  console.log('---------组装后的数据-----', data);
  return data;
}
```
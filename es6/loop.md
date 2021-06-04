### js树形菜单递归数组及优化

#### 1. 根据原数组数据结构，返回新字段数组。

  有时候会有树形菜单这么一个复杂的数据结构需求，但是后端返回所有数据回来，我们要根据返回回来的数据进行过滤，且更改数据结构中的key字段。组成一个新的数组来满足树形菜单的需求。

  比如如下是一个复杂的json数据如下：
```
const json = [
  {
    "id": 64,
    "code": "565",
    "name": "共和国",
    "label": "共和国",
    "parentId": 0,
    "type": 2,
    "seq": 0,
    "url": "/public",
    "description": "同意",
    "children": []
  },
  {
    "id": 1,
    "code": "sys_mgnt",
    "name": "系统管理",
    "label": "系统管理",
    "parentId": 0,
    "type": 1,
    "url": "/system",
    "seq": 1,
    "description": "aaa",
    "children": [
      {
        "id": 28,
        "name": "测试二级菜单1",
        "label": "测试二级菜单1",
        "parentId": 1,
        "type": 1,
        "url": "/add",
        "seq": 1,
        "description": "测试二级菜单的描述",
        "children": [
          {
            "id": 288,
            "name": "三级菜单1",
            "label": "三级菜单1",
            "parentId": 11,
            "type": 1,
            "url": "/add1",
            "seq": 1,
            "description": "三级菜单1的描述",
            "children": []
          }
        ]
      },
      {
        "id": 30,
        "name": "新增角色管理",
        "label": "新增角色管理",
        "parentId": 1,
        "type": 2,
        "seq": 1,
        "description": "新增角色管理的描述",
        "children": []
      },
      {
        "id": 31,
        "name": "add角色管理",
        "label": "add角色管理",
        "parentId": 1,
        "type": 1,
        "seq": 1,
        "description": "add角色管理的描述",
        "children": []
      },
      {
        "id": 3,
        "code": "ro_mgnt",
        "name": "角色管理",
        "label": "角色管理",
        "parentId": 1,
        "type": 1,
        "url": "",
        "seq": 2,
        "children": [
          {
            "id": 32,
            "name": "可以成功",
            "label": "可以成功",
            "parentId": 3,
            "type": 2,
            "url": "/ctrl",
            "seq": 1,
            "description": "能成功吗的描述",
            "children": []
          }
        ]
      }
    ]
  }
]
```
  我们树形菜单需要如下的数据结构，如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/29.jpg" /> <br />

  因此我们需要使用递归循环，来判断是否有子节点children，有子节点的话，继续递归循环，基本代码如下：
```
function renderTreeFunc(data) {
  let arrs = [];
  const loopFunc = function(data) {
    const rets = [];
    let obj = {};
    if (data.length > 0) {
      data.forEach(item => {
        const temp = { ...item };
        console.log(temp);
        const { id, label } = item;
        obj = {
          'text': label,
          'value': id,
        };
        if (temp.children && temp.children.length) {
          temp.children = loopFunc(temp.children);
          obj['children'] = temp.children;
        }
        rets.push(obj);
      });
    }
    return rets;
  }
  if (data && data.length) {
    arrs = loopFunc(data);
  }
  return arrs;
}
console.log(renderTreeFunc(json));
```
#### 2. js树形结构中根据条件查找节点，如果找到对应的节点，就返回该节点的对应的数据。

  在树形菜单中，有时候我们会有这么一个需求，当我们点击树形节点的时候，我们能获取到该节点的id，但是我们需要根据该节点id去获取该节点下其他一些信息。

  基本代码如下：
```
function getParamsById(nodeId, jsonDatas) {
  let obj = {}; // 保存过滤后的结果
  const getNodeFunc = function(datas) {
    if (datas && datas.length) {
      datas.forEach(node => {
        if (node.id === nodeId) {
          obj = node;
          return;
        }
        if (node.children) {
          getNodeFunc(node.children);
        }
      });
    }
  }
  getNodeFunc(jsonDatas);
  return obj;
}
console.log(getParamsById(32, json));
```
  打印效果如下：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/30.jpg" /> <br />


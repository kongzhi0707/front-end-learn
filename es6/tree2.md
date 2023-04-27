
### js递归树形数据查询该节点的所有父级节点，查询该节点的所有子节点，及当前节点所有兄弟节点

#### 1）根据value获取该节点的所有父节点对象

代码如下：
```
const list = [
  {
    "value": 192,
    "label": "技术部",
    "children": [
      {
        "value": 193,
        "label": "软件组",
        "children": [
          {
            "value": 195,
            "label": "软件一组"
          },
          {
            "value": 196,
            "label": "软件二组"
          }
        ]
      },
      {
        "value": 198,
        "label": "运维组"
      }
    ]
  },
  {
    "value": 200,
    "label": "财务部",
    "children": [
      {
        "value": 201,
        "label": "会计"
      },
      {
        "value": 203,
        "label": "出纳"
      }
    ]
  },
  {
    "value": 300,
    "label": "人资部",
    "children": [
      {
        "value": 301,
        "label": "行政"
      },
      {
        "value": 302,
        "label": "人资"
      }
    ]
  }
]
function getParentId(list, value) { 
  for (let i = 0; i < list.length; i++) { 
    if (list[i].value == value) { 
      return [list[i]];
    }
    if (list[i].children) { 
      let node = getParentId(list[i].children, value);
      if (node !== undefined) { 
        return node.concat(list[i]);
      }
    }
  }
}
const datas = getParentId(list, 192);
console.log('---datas---', datas); // 输出如下
/*
[
  {
    "value": 192,
    "label": "技术部",
    "children": [
      {
        "value": 193,
        "label": "软件组",
        "children": [
          {
            "value": 195,
            "label": "软件一组"
          },
          {
            "value": 196,
            "label": "软件二组"
          }
        ]
      },
      {
        "value": 198,
        "label": "运维组"
      }
    ]
  }
]
*/

const datas2 = getParentId(list, 195);
console.log('---datas-2--', datas2); // 输出如下

/*
  [
    {
      "value": 195,
      "label": "软件一组"
    },
    {
      "value": 193,
      "label": "软件组",
      "children": [
        {
          "value": 195,
          "label": "软件一组"
        },
        {
          "value": 196,
          "label": "软件二组"
        }
      ]
    },
    {
      "value": 192,
      "label": "技术部",
      "children": [
        {
          "value": 193,
          "label": "软件组",
          "children": [
            {
              "value": 195,
              "label": "软件一组"
            },
            {
              "value": 196,
              "label": "软件二组"
            }
          ]
        },
        {
          "value": 198,
          "label": "运维组"
        }
      ]
    }
  ]
*/
```

#### 2) 根据value获取该节点的对象
```
const list = [
  {
    "value": 192,
    "label": "技术部",
    "children": [
      {
        "value": 193,
        "label": "软件组",
        "children": [
          {
            "value": 195,
            "label": "软件一组"
          },
          {
            "value": 196,
            "label": "软件二组"
          }
        ]
      },
      {
        "value": 198,
        "label": "运维组"
      }
    ]
  },
  {
    "value": 200,
    "label": "财务部",
    "children": [
      {
        "value": 201,
        "label": "会计"
      },
      {
        "value": 203,
        "label": "出纳"
      }
    ]
  },
  {
    "value": 300,
    "label": "人资部",
    "children": [
      {
        "value": 301,
        "label": "行政"
      },
      {
        "value": 302,
        "label": "人资"
      }
    ]
  }
]
function getNodeObject(list, value) { 
  for (let i = 0; i < list.length; i++) { 
    if (list[i].value === value) { 
      return [list[i]];
    }
    if (list[i].children && list[i].children.length) { 
      let node = getNodeObject(list[i].children, value);
      if (node !== undefined) { 
        return node;
      }
    }
  }
}
const obj = getNodeObject(list, 195);
console.log('---obj----', obj);
/**
  * 输出如下：
  * [
      { "value": 195, "label": "软件一组" }
    ]
*/
```
#### 3）根据value获取所有子节点的对象

先使用上面的方法 getNodeObject 把该节点对象找出来，如下代码：
```
const list = [
  {
    "value": 192,
    "label": "技术部",
    "children": [
      {
        "value": 193,
        "label": "软件组",
        "children": [
          {
            "value": 195,
            "label": "软件一组"
          },
          {
            "value": 196,
            "label": "软件二组"
          }
        ]
      },
      {
        "value": 198,
        "label": "运维组"
      }
    ]
  },
  {
    "value": 200,
    "label": "财务部",
    "children": [
      {
        "value": 201,
        "label": "会计"
      },
      {
        "value": 203,
        "label": "出纳"
      }
    ]
  },
  {
    "value": 300,
    "label": "人资部",
    "children": [
      {
        "value": 301,
        "label": "行政"
      },
      {
        "value": 302,
        "label": "人资"
      }
    ]
  }
]
function getNodeObject(list, value) { 
  for (let i = 0; i < list.length; i++) { 
    if (list[i].value === value) { 
      return [list[i]];
    }
    if (list[i].children && list[i].children.length) { 
      let node = getNodeObject(list[i].children, value);
      if (node !== undefined) { 
        return node;
      }
    }
  }
}
const obj = getNodeObject(list, 192);
console.log('---obj----', obj);
/**
  * 输出如下：
  [
    {
      "value": 192,
      "label": "技术部",
      "children": [
        {
          "value": 193,
          "label": "软件组",
          "children": [
            {
              "value": 195,
              "label": "软件一组"
            },
            {
              "value": 196,
              "label": "软件二组"
            }
          ]
        },
        {
          "value": 198,
          "label": "运维组"
        }
      ]
    }
  ]
  */
```
  然后根据当前的节点再去获取所有的子节点的对象， 代码如下：
```
function getChildNode(list, newNodeId = []) { 
    for (let i = 0; i < list.length; i++) { 
      newNodeId.push(list[i]);
      if (list[i].children && list[i].children.length) { 
        getChildNode(list[i].children, newNodeId);
      }
    }
    return newNodeId;
  }
  let childs = getChildNode(obj);
  /*
    [
      {
        "value": 192,
        "label": "技术部",
        "children": [
          {
            "value": 193,
            "label": "软件组",
            "children": [
              { "value": 195, "label": "软件一组" },
              { "value": 196, "label": "软件二组" }
            ]
          },
          {
            "value": 198,
            "label": "运维组"
          }
        ]
      },
      {
        "value": 193,
          "label": "软件组",
          "children": [
            {
              "value": 195,
              "label": "软件一组"
            },
            {
              "value": 196,
              "label": "软件二组"
            }
          ]
      },
      {
        "value": 195,
        "label": "软件一组"
      },
      {
        "value": 196,
        "label": "软件二组"
      },
      {
        "value": 198,
        "label": "运维组"
      }
    ]
  */
  console.log('----childs---', childs);
```

#### 4）根据value获取某个节点的所有的兄弟节点
```
const list = [
  {
    "value": 192,
    "label": "技术部",
    "children": [
      {
        "value": 193,
        "label": "软件组",
        "children": [
          {
            "value": 195,
            "label": "软件一组"
          },
          {
            "value": 196,
            "label": "软件二组"
          },
          {
            "value": 197,
            "label": "软件三组"
          }
        ]
      },
      {
        "value": 198,
        "label": "运维组"
      }
    ]
  },
  {
    "value": 200,
    "label": "财务部",
    "children": [
      {
        "value": 201,
        "label": "会计"
      },
      {
        "value": 203,
        "label": "出纳"
      }
    ]
  },
  {
    "value": 300,
    "label": "人资部",
    "children": [
      {
        "value": 301,
        "label": "行政"
      },
      {
        "value": 302,
        "label": "人资"
      }
    ]
  }
]

function getBrotherNodes(list, value) {
  for(let i in list) {
    if(list[i].value === value) {
      return list.filter(v => v.value !== value)
    }
    if(list[i].children?.length > 0) {
      let node = getBrotherNodes(list[i].children, value)
      if(node) return node.filter(v => v.value !== value)
    }
  }
}

const ids2 = getBrotherNodes(list, 195);
console.log('---ids2----', ids2);
/**
  * [
      {
        "value": 196,
        "label": "软件二组"
      },
      {
        "value": 197,
        "label": "软件三组"
      }
    ]
  */
  ```
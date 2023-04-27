
### js递归遍历树，查找符合条件的子项

假设数据源树型数据如下：
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
];
```
  目标：给定一个value=300, 查找出list中value=300的对象。

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
/**
  * 递归函数
  * @param datas 树型数据
  * @param value, 查找的值
  */
function getItem(datas, value) { 
  let items = null;
  if (datas.length < 1) { 
    return items;
  }
  for (let i = 0; i < datas.length; i++) { 
    if (datas[i].value === value) { 
      items = datas[i];
      break;
    }
    // 递归循环
    if (datas[i].children && (datas[i].children.length > 0)) { 
      getItem(datas[i].children, value);
    }
  }
  return items;
}
const items = getItem(list, 300);
/**
  * 输出 { label: '人资部', value: 300, children: []}
  */
console.log('---items---', items);
```
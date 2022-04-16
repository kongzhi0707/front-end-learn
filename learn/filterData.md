
### JS树形数据递归过滤

#### 场景

树形数据过滤，保留原有数据结构不变，如果有子节点被搜索到，那么父级要保留

#### 思路

1. 对数据循环处理，根据过滤标识对匹配的数据添加一个标识，比如 visible: true.
2. 对有标识的 visible: true 的子元素，只要子元素有一个为true，那么它的父节点就有true。
3. 根据visible: true 标识对数据进行过滤，最后就是我们得到的数据。

#### 代码
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1,minimum-scale=1,user-scalable=no">
    <title>搭建一个React脚手架</title>
  </head>
  <body>
    <script>
       /**
        * 对树形结构数据进行过滤
        * @param { Array } data 树形数据数组
        * @param { String } filterParam 根据该值进行过滤
        * @param { String } filterType 用户通过那个字段值 和 filterParam 进行匹配
        */
       function filterData(data, filterParam, filterType) {
         const loopfunc = data => {
           data.forEach(child => {
             
             child.visible = filterMethod(filterParam, child, filterType);
             if (child.children && child.children.length) {
               loopfunc(child.children);
             }
             
             // 这里是判断，如果它的子节点有一个visible 为true的话，那么父节点就为true, 依次递归。
             if (!child.visible && child.children?.length) {
               let visible = !child.children.some(child => child.visible);
               child.visible = visible === false;
             }

           });
         }
         loopfunc(data);
         console.log('---data--data---', data);
         return filterDataByVisible(data);
       }
       // 根据传入的值进行数据匹配，并返回匹配结果
       function filterMethod(filterParam, child, filterType) {
         return child[filterType].includes(filterParam);
       }
       // 递归过滤符合条件的数据，如果返回true 数据保留，否则去掉。
       function filterDataByVisible(data) {
         return data.filter(item => {
           if (item.children) {
             item.children = filterDataByVisible(item.children);
           }
           if (item.visible) {
             return true;
           }
         });
       }

       // 模拟数据
       let mockData = [
         {
           id: 1,
           name: '测试1',
           children: [
             {
               id: 11,
               name: '测试哈哈',
               children: [
                 {
                   id: 111,
                   name: '我是子节点测试哈哈11'
                 },
                 {
                   id: 112,
                   name: '我是子节点12'
                 }
               ]
             },
             {
               id: 11,
               name: '测试xxx'
             },
             {
               id: 11,
               name: '测试yy'
             }
           ]
         },
         {
           id: 2,
           name: '测试2',
           children: [
             {
               id: 21,
               name: '测试休息'
             }
           ]
         }
       ];
       // 调用测试
       let myTree = filterData(mockData, '测试哈哈', 'name');
       console.log('---myTree---', myTree);
    </script>
  </body>
</html>
```
如下图打印

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/learn/images/1.png"/>


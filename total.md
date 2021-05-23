
### 路径总和

  给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有
节点值相加等于目标和。

  比如：给定如下二叉树，以及目标和sum=22.
```
           5
          / \
          4  8
         /   /\
        11  13 4
        / \     \ 
        7  2    1
```
 #### 广度优先遍历

   使用广度优先搜索，记录根节点到当前节点的路径和，BFS使用队列保存遍历每个节点时的路径和，如果该节点恰好是叶子节点，并且路径和正好等于sum，说明找到了。

   如上二叉树数据结构可以使用如下数据表示：
```
var node9 = { left: null, right: null, val: 1 };
var node8 = { left: null, right: node9, val: 4 };
var node7 = { left: null, right: null, val: 13 };
var node6 = { left: null, right: null, val: 2 };
var node5 = { left: null, right: null, val: 7 };
var node4 = { left: node5, right: node6, val: 11 };
var node3 = { left: node7, right: node8, val: 8 };
var node2 = { left: node4, right: null, val: 4 };
var node1 = { left: node2, right: node3, val: 5 };
```
  我们可以再转化为如下数据：
```
var node1 = {
  left: {
    left: {
      left: {
        left: null,
        right: null,
        val: 7
      },
      right: {
        left: null,
        right: null,
        val: 2
      },
      val: 11
    },
    right: null,
    val: 4
  },
  right: {
  	left: {
  	  left: null,
  	  right: null,
  	  val: 13
    },
  	right: {
  	  left: null,
  	  right: {
  	  	left: null,
  	  	right: null,
  	  	val: 1
  	  },
  	  val: 4
    },
  	val: 8
  },
  val: 5
};
```
  JS实现代码如下：
```
const hasPathSum = (root, sum) => {
  if (root === null) return false;
  if (root.left === null && root.right === null) {
    return sum - root.val === 0;
  }
  return hasPathSum(root.left, sum - root.val) || 
  hasPathSum(root.right, sum - root.val);
};
console.log(hasPathSum(node1, 22));
```
如上代码使用的是递归循环。


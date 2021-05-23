
### 二叉树的所有路径

给定一个二叉树，返回所有从根节点到叶子节点的路径。
说明：叶子节点是指没有子节点的节点。

比如输入：

    1
   / \ 
   2  3
   \
    5

输出：["1->2->5", "1->3"]

#### 深度优先搜索

思路：
1. 如果当前节点不是叶子节点，则在当前路径末尾添加该节点，并继续递归该节点的每一个
子节点。
2. 如果当前节点是叶子节点，则在当前路径末尾添加该节点后，我们就得到了一条从根节点到叶子
节点的路径。

代码实现如下：

var binaryTreePaths = function(root) {
  let paths = [];
  const func = function(root, path) {
    if (root) {
      path += root.val.toString();
      // 如果当前节点是叶子节点，则在当前路径末尾添加该节点后
      if (!root.left && !root.right) {
        paths.push(path);
      } else {
        // 如果当前节点不是叶子节点，则在当前路径末尾添加该节点，并继续递归该节点的每一个子节点。
        path += '->';
        func(root.left, path);
        func(root.right, path);
      }
    }
  }
  func(root, '');
  return paths;
};
var node4 = { left: null, right: null, val: 5 };
var node3 = { left: null, right: null, val: 3 };
var node2 = { left: node4, right: null, val: 2 };
var node1 = { left: node2, right: node3, val: 1 };
console.log(binaryTreePaths(node1));











 

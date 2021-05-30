
### js实现单向链表

js中的数组大家挺熟悉的，数组其实是一种线性表的顺序存储结构，它的特点是用一组地址连续的存储单元依次存储数据元素。而它的缺点也是因为其特点所造成的。比如对数组做删除元素或插入元素的时候，可能需要移动大量的元素。那么插入或删除都有可能会是一个O(n)的操作。因此我们可以学习使用链表来解决这个问题，链表不要求逻辑上相邻的元素在物理位置上也相邻，因此它没有顺序结构所具有的特点。

#### 单向链表的特点
```
1. 用一组任意的内存空间去存储数据元素(内存空间可以是连续的，也可以是不连续的)。
2. 每个节点(node)都由数据本身和一个指向后续节点的指针组成。
3. 整个链表的存取必须从头指针开始，头指针指向第一个节点。
4. 最后一个节点的指针指向Null。
```
如下图所示：

<img src="../images/1.png" /> <br />

对单链表的操作有如下：
```
find(item); // 在单链表中寻找item元素
insert(element, item); // 向单链表中插入元素
remove(item); // 在单链表中删除一个节点
append(element); // 在单链表的尾部添加元素
findLast(); // 获取单链表的最后一个节点
isEmpty(); // 判断单链表是否为空
show(); // 显示当前节点
getLength(); // 获取单链表的长度
advance(n, curNode); // 从当前节点向前移动n个位置
display(); // 单链表的遍历显示
clear(); // 清空单链表
```
只要我们实现上面这些方法，那么一个基本的单链表结构就实现了。

将如上这些方法放在单链表类中，就形成了单链数据结构的大概框架了。
```
class Node {
  constructor(data) {
  	this.data = data;
  	// this.prev = null;
  	this.next = null;
  }
}
export default class SingleList {
  constructor() {
  	this.size = 0; // 单链表的长度
  	this.head = new Node('head'); // 表头节点
  	this.curNode = ''; // 当前节点的指向
  }
  // 在单链表中寻找item元素
  find(item) {
  	let curNode = this.head;
  	while(curNode && (curNode.data !== item)) {
  	  curNode = curNode.next;
  	}
  	return curNode;
  }
  /*
   * 在单链表中插入元素
   * @param {item} item是单链表中已经存在的节点值，要插入的新节点的位置位于item之后
   * 插入元素 我们需要将节点的next指针指向item的下一个元素，再将item的next的指针指向新的元素即可。
  */
  insert(item, element) {
  	let itemNode = this.find(item);
  	// 如果item元素不存在
  	if (!itemNode) {
  	  return;
  	}
  	let newNode = new Node(element);
  	newNode.next = itemNode.next;
  	itemNode.next = newNode;
  	this.size++;
  }
  /*
   * 在单链表中删除一个节点 分为如下几种情况：
     1. 要删除的节点不存在，该情况下直接返回。
     2. 要删除的是head节点。如果删除头节点的话，需要判断如果链表的长度不为0时，应该直接返回，因为
     如果删除了头节点，单链表就找不到入口了。第二种情况是：如果在删除时单链表的长度为0时，那么直接将
     头节点的next指针置空即可。
     3. 删除元素
  */
  remove(item) {
  	// item元素在单链表中不存在
  	if (!this.find(item)) { 
  	  return; 
  	}
  	// 删除头节点
  	if (item === 'head') {
  	  if (!(this.isEmpty())) {
  	  	return;
  	  } else {
  	  	this.head.next = null;
  	  	return;
  	  }
  	}
  	let curNode = this.head;
  	while (curNode.next.data !== item) {
  	  // 如果删除不存在的节点
  	  if (!curNode.next) {
  	  	return;
  	  }
  	  curNode = curNode.next;
  	}
  	curNode.next = curNode.next.next;
  	this.size--;
  }
  /*
   * 在单链表的尾部添加元素
   * 在单链表的尾部添加元素时，只要将新元素赋值给单链表的最后一个元素的next指针即可。
  */
  append(element) {
  	let newNode = new Node(element);
  	// 获取最后一个节点
  	let lastNode = this.findLast();
  	lastNode.next = newNode;
  	this.size++;
  }
  /*
   * 获取单链表的最后一个节点
   * 只要当前节点的next指针不为空就一直向下遍历，直到当前节点的next为空时就是最后一个节点
  */
  findLast() {
  	let curNode = this.head;
  	while(curNode.next) {
  	  curNode = curNode.next;
  	}
  	return curNode;
  }
  // 判断单链表是否为空
  isEmpty() {
  	return this.size === 0;
  }
  // 显示当前节点
  show() {
  	console.log('----显示当前节点---', this.curNode.data);
  }
  // 获取单链表的长度
  getLength() {
  	return this.size;
  }
  /*
   * 从当前节点向前移动n个位置
  */
  advance(n, curNode) {
  	curNode = this.head;
  	this.curNode = curNode;
  	while((n--) && this.curNode.next) {
  	  this.curNode = this.curNode.next;
  	}
  	return this.curNode;
  }
  // 单链表的遍历显示
  display() {
  	let result = '';
  	let curNode = this.head;
  	while(curNode) {
  	  result += curNode.data;
  	  curNode = curNode.next;
  	  if (curNode) {
  	  	result += '->';
  	  }
  	}
  	console.log('----result---', result);
  }
  // 清空单链表
  clear() {
  	this.head.next = null;
  	this.size = 0;
  }
}
```
#### 单链表的测试
```
const myList = new SingleList();
const arrs = [3,4,5,6,7,8,9];
for (let i = 0; i < arrs.length; i++) {
  myList.append(arrs[i]);
}
myList.display(); // ----result--- head->3->4->5->6->7->8->9

/*
 {
   data:4,
   next: {
     data:5, 
     next: {
       data: 6, 
       next: {
         data: 7,
         next: {
           data: 8,
           next: {
             data: 9,
             next: null
           }
         }
       }
     }
    }
  }
*/
console.log(myList.find(4)); 

myList.insert(9, 9.1); 
myList.insert(3, 3.1);

// 输出：----result--- head->3->3.1->4->5->6->7->8->9->9.1
myList.display(); 

myList.remove(9.1);
myList.remove(3);

// 输出：----result--- head->3.1->4->5->6->7->8->9
myList.display();

console.log(myList.findLast()); // { data: 9, next: null }

/*
 {
   data: 6,
   next: {
     data: 7,
     next: {
       data: 8,
       next: {
         data: 9,
         next: null
       }
     }
   }
 }
*/
console.log(myList.advance(4)); 


console.log(myList.getLength()); // 输出 7

myList.clear(); 
myList.display(); // ----result--- head

```






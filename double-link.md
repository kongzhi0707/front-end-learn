
### JS实现双向链表

在上一篇我们学过单链表。也介绍过单链表的特点及和数组之间的优点。基本代码如下：
```
class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

// 单链表
class SingleList {
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

// 测试代码
var myList = new SingleList();
var arrs = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

arrs.forEach(item => myList.append(item));

console.log(myList.display());
```
### 实现单向循环链表

现在我们需要在如上单链表基础之上实现 "单向循环链表" 其数据结构如下所示：

<img src="https://pic2.zhimg.com/80/v2-a8fdc700c9955a02a0ea62e59d448e65_1440w.jpg" />

如上将head节点当作此单向循环链表的头节点。将A节点当作此单向循环链表的一个节点。C节点当作此单向循环链表的最后一个节点。

代码框架如下：
```
class CirSingleList extends SingleList {
  constructor() {
    super();
  }
  // 在循环链表中寻找最后一个节点
  findLast() {}

  // 在单循环链表中寻找数据
  find(item) {}

  // 在数据为item的节点后面插入数据为element元素的节点
  insert(item, element) {}

  remove(item) {}

  display() {}

  // 在尾部添加数据
  append(element) {}
}
```
#### 1. findLast() 在循环链表中寻找最后一个节点

findLast()方法用于寻找单向循环链表的最后一个节点。如上图的C节点。 
我们可以使用 count 来标记已经寻找过的节点数目，如果count和单向循环链表长度相等时，说明找到了最后一个节点。
```
// 在循环链表中寻找最后一个节点
findLast() {
  let curNode = this.head;
  let count = 0;
  while (count++ !== this.size) {
    curNode = curNode.next;
  }
  return curNode;
}
```
#### 2. find() 在单循环链表中寻找数据

find()方法 和 单链表的find()方法不同的是：从单向循环链表中查找数据时，当要查找的数据不存在于单向循环链表中时，由于单向循环链表是循环的，在遍历了一次链表后如果不能及时返回，就会陷入无限循环当中。此时我们可以判断当前节点是不是最后一个节点，如果是则结束循环。
```
// 在单循环链表中寻找数据
find(item) {
  let curNode = this.head;
  let lastNode = this.findLast(); // 获取最后一个节点
  while (curNode.data !== item) {
    if (curNode === lastNode) {
      // 判断当前节点是不是最后一个节点
      curNode = null;
      break;
    }
    curNode = curNode.next;
  }
  return curNode;
}
```
#### 3. insert() 在向单向循环链表插入节点时

在单向循环链表插入节点时，需要考虑如下几种情况：

1. 如果这个单向循环链表是空的，那么直接将新的节点插入到head节点后面，再让新的节点指向自身就可以了。如下图所示：

<img src="https://pic2.zhimg.com/80/v2-34f2fc274d4596f93359d26bd6f171a1_1440w.jpg" />

2. 如果要插入的位置处于单向链表中间的位置，n节点是新的要插入的节点，只需要将n节点的next指针指向C节点，再将B节点的next指针指向新节点n就可以了。如下图所示：

<img src="https://pic3.zhimg.com/80/v2-2005220be943e44fa968355c8cb70186_1440w.jpg" />

3. 如果要插入的位置处于单向循环链表表头节点后面，第一个节点之前。n节点表示新的节点。需要做如下处理：
  1. 将n节点的next指针指向头节点后面的第一个节点A。
  2. 将头节点的next指针指向n节点。
  3. 最后将这个单向循环链表的最后一个节点C的next指针指向n节点.

如下图所示：

<img src="https://pic1.zhimg.com/80/v2-b4ccd893e48dee40855bd421bb9d3578_1440w.jpg" />

代码如下：
```
// element 为新节点的数据，item为单向循环链表中已经存在的节点，新的节点插入到item的后面
insert(item, element) {
  let itemNode = this.find(item);
  let newNode = new Node(element);
  // 如果item在单循环链表中不存在
  if (!itemNode) {
    return;
  }
  // 插入的位置处于头节点之后，第一个节点之前
  if (item === 'head') {
    // 当单循环链表为空时 那么直接将新的节点插入到head节点后面，再让新的节点指向自身就可以了。
    if (this.size === 0) { 
      this.head.next = newNode;
      newNode.next = this.head.next;
    } else {
      /*
       当单循环链表不为空时, 直接将新的节点插入到head节点后面, 插入的位置处于单向循环链表表头节点后面，第一个节点之前。
      */ 
      let lastNode = this.findLast();
      newNode.next = this.head.next;
      this.head.next = newNode;
      lastNode.next = newNode;
    }
    this.size++;
    return;
  }
  // 如果处于链表中间位置时, 
  /* newNode 插进 A 到 B 中间去
   * 比如 A -> B 
   因此 newNode.next = A.next; itemNode.next = newNode;
  */
  newNode.next = itemNode.next;
  itemNode.next = newNode;
  this.size++;
}
```
#### 4. remove(item) {} 删除节点

1. 当待删除的节点是第一个节点时，如果此时单向循环链表只有一个节点，直接将此单向循环链表置空即可。
2. 当待删除的节点是第一个节点时，且此时单向循环链表不仅只有一个节点时，此时将头节点的next指针指向待删除节点的下一个节点，并将最后一个节点指向待删除节点的下一个节点。
如下图所示：

<img src="https://pic4.zhimg.com/80/v2-4881e199216133e73644412efc3bc3a3_1440w.jpg" />

3. 除了上面两种情况之外，只要将待删除节点的前一个节点next指针指向待删除节点的后一个节点即可。

如下代码所示：
```
remove(item) {
  let curNode = this.find(item); // 找到待删除的节点
  let lastNode = this.findLast(); // 找到最后一个节点
  let preCurNode = this.head;
  // 找到待删除节点的前一个节点
  while(preCurNode.next !== curNode) {
    preCurNode = preCurNode.next;
  }
  // 如果当前的节点是第一个节点
  if (curNode === this.head.next) {
    if (this.size === 1) { // 如果此时单向循环链表只有一个节点，直接将此单向循环链表置空即可。
      this.head.next = null;
    } else {
      // 还有其他节点
      // 将头节点的next指针指向待删除节点的下一个节点，并将最后一个节点指向待删除节点的下一个节点
      this.head.next = curNode.next;
      lastNode.next = curNode.next;
    }
  } else {
    // 其他情况
    preCurNode.next = curNode.next;
  }
  this.size--;
}
```
#### 5）display() 方法，用于遍历此链表

如下代码：
```
display() {
  let result = 'head';
  let curNode = this.head;
  let lastNode = this.findLast();
  while(curNode !== lastNode) {
    curNode = curNode.next;
    result += `-> ${curNode.data}`;
  }
  console.log('------result-----', result);
}
```
#### 6）append()方法，在单向循环链表的尾部添加数据。

在单向链表的尾部添加数据，使用 findLast()方法，找到最后一个节点，然后将最后一个节点next指针指向新的节点。
再将新的节点指向此链表的第一个节点即可。

代码如下：
```
append(element) {
  let lastNode = this.findLast();
  let newNode = new Node(element);
  lastNode.next = newNode;
  newNode.next = this.head.next;
  this.size++;
}
```
### JS双向链表

双向链表继承上面的实现的的单向循环链表，而单向循环链表又继承自上面的单链表。

代码框架如下：
```
// 双向链表
class DbList extends CirSingleList {
  constructor() {
    super();
  }
  // 在item后添加newElement
  insert(item， newElement) {}

  // 从双向链表中移除item节点
  remove(item) {}

  // 反向遍历
  reverseDisplay() {}

  // 在尾部添加数据
  append(element) {}
}
```
#### 1) insert()，该方法向双向链表中插入数据

在插入节点时，分为两种情况：插入的位置在中间和结尾。

1. 插入节点的位置在中间时，如下图所示：
<img src="https://pic1.zhimg.com/80/v2-911eb25803bf9690e9a1bea4381c5520_1440w.jpg" />

第一步将n节点的next指针指向B节点，再将B节点的prev指针指向n节点。第二步将A节点的next指针指向n节点，再将n节点的prev指针指向A节点就可以了。
2. 插入节点的位置在末尾：只要将最后一个节点的next指针指向新的节点，再将新节点的prev指针指向之前的最后一个节点即可。

代码如下：
```
insert(item, newElement) {
  let curNode = this.find(item);
  let newNode = new Node(newElement);
  // 插入的位置在中间
  if (curNode.next) {
    // 1. 将新节点next指针指向B节点
    newNode.next = curNode.next;
    // 2. 将B节点的prev指针指向n节点
    curNode.next.prev = newNode;
    // 3. 将A节点的next指针指向n节点
    curNode.next = newNode;
    // 4. 将n节点的prev指针指向A节点
    newNode.prev = curNode;
   } else {
    // 插入的位置在末尾
    // 1. 将最后一个节点的next指针指向新的节点
    curNode.next = newNode;
    // 2. 将新节点的prev指针指向之前的最后一个节点
    newNode.prev = curNode;
  }
  this.size++;
}
```
#### 2. remove(item) {} 删除节点

删除节点，也分为好几种情况：

1. 当传入的参数item为head时，约定将此链表清空。
2. 当节点值为item节点存在于该链表中时，如果此时要删除的节点恰好是最后一个节点，则只要直接将最后一个节点删除即可。
3. 当节点值为item的节点存在，且处于链表中间位置时，如下图所示：

<img src="https://pic3.zhimg.com/80/v2-7ec3be53858947d5d84f64907850b892_1440w.jpg" />

D 表示待删除的节点。此时只需要将A的next指针指向B节点。然后将B的prev指针指向A节点即可。

代码如下所示：
```
// 从双向链表中移除item节点
remove(item) {
  let curNode = this.find(item);
  let lastNode = this.findLast();
  // 如果删除的是头节点的话
  if (item === 'head') {
    this.head.next = null;
    this.head.prev = null;
    this.size = 0;
    return;
  }
  // 如果存在item节点
  if (curNode) {
    // 如果此时要删除的节点恰好是最后一个节点，则只要直接将最后一个节点删除即可。
    if (curNode === lastNode) {
      curNode.prev.next = null;
    } else {
      curNode.prev.next = curNode.next;
      curNode.next.prev = curNode.prev;
    }
    curNode = null;
    this.size--;
  }
}
```
#### 3. reverseDisplay() 反向遍历

从最后一个节点向前遍历， 如下代码：
```
reverseDisplay() {
  let result = '';
  let lastNode = this.findLast();
  while(lastNode.data !== 'head') {
    result += `${lastNode.data}->`;
    lastNode = lastNode.prev;
  }
  result += `head`;
  console.log('----result----', result);
}
```
#### 4）append(elemnt) 在链表尾部添加一个元素

代码如下：
```
/*
 * 在链表尾部添加一个元素
 */
append(element) {
  let newNode = new Node(element);
  let lastNode = this.findLast();
  lastNode.next = newNode;
  newNode.prev = lastNode;
  this.size++;
}
```
### 因此双向链表的所有代码如下：
```
class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}
// 单链表
class SingleList {
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
// 单向循环链表
class CirSingleList extends SingleList {
  constructor() {
    super();
  }
  // 在循环链表中寻找最后一个节点
  findLast() {
    let curNode = this.head;
    let count = 0;
    while (count++ !== this.size) {
      curNode = curNode.next;
    }
    return curNode;
  }
  /*
   * 在单循环链表中寻找数据
   find()方法 和 单链表的find()方法不同的是：从单向循环链表中查找数据时，当要查找的数据不存在于单向循环链表中时，
   由于单向循环链表是循环的，在遍历了一次链表后如果不能及时返回，就会陷入无限循环当中。此时我们可以判断当前节点是不是
   最后一个节点，如果是则结束循环。
  */
  find(item) {
    let curNode = this.head;
    let lastNode = this.findLast(); // 获取最后一个节点
    while (curNode.data !== item) {
      if (curNode === lastNode) {
        // 判断当前节点是不是最后一个节点
        curNode = null;
        break;
      }
      curNode = curNode.next;
    }
    return curNode;
  }
  /*
   * 在数据为item的节点后面插入数据为element元素的节点
   在单向循环链表插入节点时，需要考虑如下几种情况：
   1. 如果这个单向循环链表是空的，那么直接将新的节点插入到head节点后面，再让新的节点指向自身就可以了。
   2. 如果要插入的位置处于单向链表中间的位置，n节点是新的要插入的节点，只需要将n节点的next指针指向C节点，再将B节点的next指针指向
   新节点n就可以了。
   3. 如果要插入的位置处于单向循环链表表头节点后面，第一个节点之前。n节点表示新的节点。需要做如下处理：
      1. 将n节点的next指针指向头节点后面的第一个节点A。
      2. 将头节点的next指针指向n节点。
      3. 最后将这个单向循环链表的最后一个节点C的next指针指向n节点
  */
  // element 为新节点的数据，item为单向循环链表中已经存在的节点，新的节点插入到item的后面
  insert(item, element) {
    let itemNode = this.find(item);
    let newNode = new Node(element);
    // 如果item在单循环链表中不存在
    if (!itemNode) {
      return;
    }
    // 插入的位置处于头节点之后，第一个节点之前
    if (item === 'head') {
      // 当单循环链表为空时 那么直接将新的节点插入到head节点后面，再让新的节点指向自身就可以了。
      if (this.size === 0) { 
        this.head.next = newNode;
        newNode.next = this.head.next;
      } else {
        /*
         当单循环链表不为空时, 直接将新的节点插入到head节点后面, 插入的位置处于单向循环链表表头节点后面，第一个节点之前。
        */ 
        let lastNode = this.findLast();
        newNode.next = this.head.next;
        this.head.next = newNode;
        lastNode.next = newNode;
      }
      this.size++;
      return;
    }
    // 如果处于链表中间位置时, 
    /*     newNode 插进 A 到 B 中间去
     * 比如 A -> B 
     因此 newNode.next = A.next; itemNode.next = newNode;
    */
    newNode.next = itemNode.next;
    itemNode.next = newNode;
    this.size++;
  }
  /*
   * 1. 当待删除的节点是第一个节点时，如果此时单向循环链表只有一个节点，直接将此单向循环链表置空即可。
   * 2. 当待删除的节点是第一个节点时，且此时单向循环链表不仅只有一个节点时，此时将头节点的next指针指向待删除节点的下一个节点，并将最后一个
   * 节点指向待删除节点的下一个节点。
   * 3. 除了上面两种情况之外，只要将待删除节点的前一个节点next指针指向待删除节点的后一个节点即可。
  */
  remove(item) {
    let curNode = this.find(item); // 找到待删除的节点
    let lastNode = this.findLast(); // 找到最后一个节点
    let preCurNode = this.head;
    // 找到待删除节点的前一个节点
    while(preCurNode.next !== curNode) {
      preCurNode = preCurNode.next;
    }
    // 如果当前的节点是第一个节点
    if (curNode === this.head.next) {
      if (this.size === 1) { // 如果此时单向循环链表只有一个节点，直接将此单向循环链表置空即可。
        this.head.next = null;
      } else {
        // 还有其他节点
        // 将头节点的next指针指向待删除节点的下一个节点，并将最后一个节点指向待删除节点的下一个节点
        this.head.next = curNode.next;
        lastNode.next = curNode.next;
      }
    } else {
      // 其他情况
      preCurNode.next = curNode.next;
    }
    this.size--;
  }

  display() {
    let result = 'head';
    let curNode = this.head;
    let lastNode = this.findLast();
    while(curNode !== lastNode) {
      curNode = curNode.next;
      result += `-> ${curNode.data}`;
    }
    console.log('------result-----', result);
  }

  /*
   * 在单向链表的尾部添加数据，使用 findLast()方法，找到最后一个节点，然后将最后一个节点next指针指向新的节点。
   * 再将新的节点指向此链表的第一个节点即可。
  */
  append(element) {
    let lastNode = this.findLast();
    let newNode = new Node(element);
    lastNode.next = newNode;
    newNode.next = this.head.next;
    this.size++;
  }
}

// 双向链表
class DbList extends CirSingleList {
  constructor() {
    super();
  }
  /*
   * 在item后添加newElement
   * 在插入节点时，分为两种情况：插入的位置在中间和结尾。
   * 1. 插入节点的位置在中间时：
   * 第一步将n节点的next指针指向B节点，再将B节点的prev指针指向n节点。第二步将A节点的next指针指向n节点，再将n节点的prev指针指向A节点就可以了。
   * 2. 插入节点的位置在末尾：只要将最后一个节点的next指针指向新的节点，再将新节点的prev指针指向之前的最后一个节点即可。
  */
  insert(item, newElement) {
    let curNode = this.find(item);
    let newNode = new Node(newElement);
    // 插入的位置在中间
    if (curNode.next) {
      // 1. 将新节点next指针指向B节点
      newNode.next = curNode.next;
      // 2. 将B节点的prev指针指向n节点
      curNode.next.prev = newNode;
      // 3. 将A节点的next指针指向n节点
      curNode.next = newNode;
      // 4. 将n节点的prev指针指向A节点
      newNode.prev = curNode;
    } else {
      // 插入的位置在末尾
      // 1. 将最后一个节点的next指针指向新的节点
      curNode.next = newNode;
      // 2. 将新节点的prev指针指向之前的最后一个节点
      newNode.prev = curNode;
    }
    this.size++;
  }
  /*
   删除节点，也分为好几种情况：
   1. 当传入的参数item为head时，约定将此链表清空。
   2. 当节点值为item节点存在于该链表中时，如果此时要删除的节点恰好是最后一个节点，则只要直接将最后一个节点删除即可。
   3. 当节点值为item的节点存在，且处于链表中间位置时。
   D 表示待删除的节点。此时只需要将A的next指针指向B节点。然后将B的prev指针指向A节点即可。
   */
  // 从双向链表中移除item节点
  remove(item) {
    let curNode = this.find(item);
    let lastNode = this.findLast();
    // 如果删除的是头节点的话
    if (item === 'head') {
      this.head.next = null;
      this.head.prev = null;
      this.size = 0;
      return;
    }
    // 如果存在item节点
    if (curNode) {
      // 如果此时要删除的节点恰好是最后一个节点，则只要直接将最后一个节点删除即可。
      if (curNode === lastNode) {
        curNode.prev.next = null;
      } else {
        curNode.prev.next = curNode.next;
        curNode.next.prev = curNode.prev;
      }
      curNode = null;
      this.size--;
    }
  }
  /*
   * 反向遍历
   从最后一个节点向前遍历
   */
  reverseDisplay() {
    let result = '';
    let lastNode = this.findLast();
    while(lastNode.data !== 'head') {
      result += `${lastNode.data}->`;
      lastNode = lastNode.prev;
    }
    result += `head`;
    console.log('----result----', result);
  }
  /*
   * 在链表尾部添加一个元素
   */
  append(element) {
    let newNode = new Node(element);
    let lastNode = this.findLast();
    lastNode.next = newNode;
    newNode.prev = lastNode;
    this.size++;
  }
}

// 测试 insert 方法
let test = new DbList();
test.insert('head', 1);
test.display(); // 打印：head->1

test.insert(1, 2);
test.display(); // 打印：head->1->2

test.insert(1, 1.5);
test.display(); // 打印：head->1->1.5->2


// 测试remove方法

test.remove(2);
test.display(); // 打印：head->1->1.5

// 删除中间的节点
test.remove(1);
test.display(); // 打印：head->1.5

// 清空链表
test.remove('head');
test.display(); // 打印：head

// 整体测试
console.log('----------------------------');

let test2 = new DbList();

let arrs2 = [1, 2, 3, 4, 5, 6, 7];

for (let i = 0; i < arrs2.length; i++) {
  test2.append(arrs2[i]);
}

test2.display(); // 打印：head->1->2->3->4->5->6->7

test2.insert(7, 8); 
test2.display(); // 打印：head->1->2->3->4->5->6->7->8

test2.insert('head', 0.5);
test2.display(); // 打印: head->0.5->1->2->3->4->5->6->7->8

test2.reverseDisplay(); // 打印：8->7->6->5->4->3->2->1->0.5->head

test2.remove(0.5);
test2.display(); // 打印: head->1->2->3->4->5->6->7->8

test2.remove(8);
test2.display(); // 打印：head->1->2->3->4->5->6->7
```
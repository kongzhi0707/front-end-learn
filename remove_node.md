
### 删除链表的倒数第N个节点

给定一个链表，删除链表的倒数第n个节点，并且返回链表的头节点。

比如：给定一个链表 1->2->3->4->5 和 n = 2.

当删除了倒数第二个节点后，链表变为 1->2->3->5。

说明：给定的n保证是有效的。

实现思路：使用双指针实现，让快指针移动n步，然后快慢指针共同移动，直到快指针到尾部为止。
快指针为fast。慢指针为slow。两者初始值都为 head。
快指针fast先移动n步。之后快指针fast和慢指针slow共同移动。此时两者的距离为n。当fast指针到尾部时，slow指针位置恰好为倒数第n个节点因为要删除该节点，所以要移动到该节点的前一个才能删除。删除后返回head.next。为什么不直接返回head呢，因为head有可能是被删掉的点。
时间复杂度：o(n).
```
var removeNthFromEnd = function(head, n) {
  if (head === null || n === 0) {
    return head;
  }
  let fast = head;
  let slow = head;
  while (n > 0) {
    fast = fast.next;
    n--;
  }
  // 如果fast为空，删除首部head
  if (!fast) {
    return head.next; 
  }
  while(fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  // 删除节点
  slow.next = slow.next.next;
  return head;
}
let link = {
  data: 'head',
  next: {
    data: 3,
    next: {
      data: 4,
      next: {
        data: 5,
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
  }
}
/*
 * 返回结果为:
 {
    "data": "head",
    "next": {
      "data": 3,
      "next": {
        "data": 4,
        "next": {
          "data": 5,
          "next": {
            "data": 6,
            "next": {
              "data": 7,
              "next": {
                "data": 9,
                "next": null
              }
            }
          }
        }
      }
    }
  }
*/
console.log(removeNthFromEnd(link, 2));
```
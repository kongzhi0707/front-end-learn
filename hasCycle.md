
### 判断链表是否有环

思路：如果链表中存在环，那么快慢指针进入环之后，因为存在速度差，两个指针迟早会相遇，那么我们只需要判断两个指针的值是否相等即可。如果有相等的情况就存在环，否则不存在。
```
function hasCycle(head) {
  let fast = head; // 快指针
  let slow = head; // 慢指针
  while(fast && slow && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      return true;
    }
  }
  return false;
}
```
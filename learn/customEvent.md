### 发布订阅模式---自定义事件

首先我们先来了解下观察者模式和发布订阅模式的区别；最主要区别是发布订阅模式有个事件调度中心。

<img src="https://img2020.cnblogs.com/blog/561794/202107/561794-20210704220135260-1283155169.jpg" />

如上图，观察者模式中观察者和目标直接进行通信的，而发布订阅模式中是由调度中心统一进行处理的。订阅者和发布者互不干扰。这样就是代码进行了解藕。比如发布者发布了很多消息，但是不想所有的订阅者都接收到消息，那么就可以在调度中心做一些处理操作。
```
class EventEmitter {
  constructor() {
    this.handlers = {};
  }
  // 订阅事件
  on(eventType, handler) {
    if (!(eventType in this.handlers)) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
    return this;
  }
  // 发布事件
  emit(eventType) {
    var handlerArgs = Array.prototype.slice.call(arguments, 1);
    var length = this.handlers[eventType].length;
    if (length > 0) {
      for (var i = 0; i < length; i++) {
        this.handlers[eventType][i].apply(this, handlerArgs);
      }
    }
    return this;
  }
  // 移除订阅事件
  off (eventType, handler) {
    var currentEvent = this.handlers[eventType];
    var len = 0;
    if (currentEvent) {
      len = currentEvent.length;
      for (let i = len - 1; i >= 0; i--) {
        if (currentEvent[i] === handler) {
          currentEvent.splice(i, 1);
        }
      }
    }
    return this;
  }
}

// 订阅者
function Observe1(data) {
  console.log('订阅者1订阅了: ' + data);
}

function Observe2(data) {
  console.log('订阅者2订阅了: ' + data);
}

var eventEmitter = new EventEmitter();

// 订阅事件
eventEmitter.on('a', Observe1);
eventEmitter.on('b', Observe1);
eventEmitter.on('c', Observe2);

// 发布事件
eventEmitter.emit('a', '第一次发布a1事件'); // 打印：订阅者1订阅了: 第一次发布a1事件
eventEmitter.emit('b', '第一次发布b事件'); // 打印：订阅者1订阅了: 第一次发布b事件
eventEmitter.emit('a', '第二次发布a事件'); // 打印：订阅者1订阅了: 第二次发布a事件

// 移除事件
eventEmitter.off('a', Observe1);

// 再来触发事件
eventEmitter.emit('a', '第3次发布a事件'); // 不会打印信息
```



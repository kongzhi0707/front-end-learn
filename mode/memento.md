
### JS备忘录模式

1）什么是备忘录模式？

备忘录模式可以保存某个状态，并且在需要的时候直接获取，而不是重复计算。该模式最主要的任务就是对现有数据或者状态做缓存，为将来某个时刻使用或者恢复做准备。

#### 应用场景

1) 比如 "斐波那契数列"递归实现，如果不借助备忘录模式的话，数据很大的话，就容易爆栈。如果借助备忘录，算法的时间复杂度可以降低到 O(N).

2) 分页时的数据缓存。比如分页我们请求接口，那么我们每次切换分页都会重新请求一次，因此我们可以将请求后的分页数据缓存起来，当下次再切换到这一页的时候我们会先判断缓存对象中是否有该数据，如果有直接从缓存中读取。没有就发起请求，并且请求后将当前的数据存入到对应的缓存中。

3）用户撤销和前进操作。

#### 分页时的数据缓存

比如分页缓存数据代码可以如下：
```
const fetchData = (() => {
  // 备忘录 / 缓存
  const cache = {};
  return page => 
    new Promise(resolve => {
      // 如果页面数据已经被缓存，直接取出
      if (page in cache) {
        return resolve(cache[page]);
      }
      // 否则，异步请求页面数据
      setTimeout(() => {
        cache[page] = `内容是${page}`;
        resolve(cache[page]);
      }, 1000)
    })
})();

// 测试代码如下

const run = async () => {
  let start = new Date().getTime(),
      now;
   // 第一次 没有缓存
   await fetchData(1);
   now = new Date().getTime();
   console.log(`没有缓存, 耗时${now - start}ms`);

    // 第二次: 有缓存 / 备忘录有记录
    start = now;
    await fetchData(1);
    now = new Date().getTime();
    console.log(`有缓存, 耗时${now - start}ms`);
}

run();
```
#### 用户撤销和前进操作

```
// 备忘类
class Memento {
  constructor(content) {
    this.content = content;
  }
  gerContent() {
    return this.content;
  }
}

// 备忘列表
class CareTaker {
  constructor() {
    this.list = [];
  }
  add(memento) {
    this.list.push(memento);
  }
  get(index) {
    return this.list[index];
  }
}

// 编辑器
class Editor {
  constructor() {
    this.content = null;
  }
  setContent(content) {
    this.content = content;
  }
  gerContent() {
    return this.content;
  }
  saveContentToMemento() {
    return new Memento(this.content);
  }
  getContentFromMemento(memento) {
    this.content = memento.gerContent();
  }
}

// 测试代码
let editor = new Editor();
let careTaker = new CareTaker();

editor.setContent('111');
careTaker.add(editor.saveContentToMemento());

editor.setContent('222');
careTaker.add(editor.saveContentToMemento());

editor.setContent('333');
careTaker.add(editor.saveContentToMemento());

editor.setContent('444');

console.log(editor.gerContent()); // 打印：444

editor.getContentFromMemento(careTaker.get(2));
console.log(editor.gerContent()); /// 打印：333

editor.getContentFromMemento(careTaker.get(1));
console.log(editor.gerContent()); /// 打印：222

editor.getContentFromMemento(careTaker.get(0));
console.log(editor.gerContent()); // 打印：111
```

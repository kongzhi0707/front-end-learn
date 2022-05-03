
### jest 定时器测试

在 index.js 中写入一些待测试的demo。
```
export const timer1 = (callback) => { 
  setTimeout(() => {
    callback();
  }, 3000);
}

export const timer2 = (callback) => { 
  setTimeout(() => { 
    callback();
    setTimeout(() => { 
      callback();
    }, 3000)
  }, 3000)
}
```
#### 1) 使用done方法

在 index.test.js 中写入测试用例
```
import { timer1, timer2 } from "./index";

/**
 * 通过done对定时器进行测试
 */
// it 是 test 的别名

it('使用done，测试定时器', (done) => {
  timer1(() => { 
    expect(1).toBe(1);
    done();
  })
});
```
如上代码，虽然可以测试，但是有个缺点，如果定时器时间很长的话，那测试用例运行的时间也会很长。因此 我们有更好的写法。 其他方法暂时略。。。


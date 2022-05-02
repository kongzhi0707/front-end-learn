
### jest 自动化测试 --- matchers 匹配器

我们在上面中的 index.test.js 代码：
```
import { sum } from './index';

test('测试 sum', () => {
  expect(sum(1, 2)).toBe(3);
});
```
  test 方法 我们叫做测试用例，它提供两个参数，第一个参数是测试的名称，第二个参数是个函数，在函数内可以写一些测试逻辑。

  expect：从字面上意思就是 期望的含义，expect(sum(1, 2)).toBe(3); 意思是期望 sum(1, 2) 的返回值 和 3 相等。整体我们叫做 断言。

  toBe 就是一个匹配器，匹配 expect 的值是否和匹配器中的值相等。

##### 1) .toBe(value) 匹配值，相当于 ===

  如下代码：
```
const obj = {
  name: 'kongzhi'
};

test('has a sophisticated name', () => {
  expect(obj.name).toBe('kongzhi');
});
```
##### 注意：不能用于测试浮点数，比如 expect(0.1 + 0.2).toBe(0.3); 如果要测试浮点数，我们可以使用 toBeCloseTo 来测试，下面会介绍。

##### 2）.toEqual(value)

  匹配值，只匹配内容不匹配引用，可以用于引用类型的匹配。

  如下测试代码：
```
const test1 = {
  name: 'kongzhi',
  age: 33,
};

const test2 = {
  name: 'kongzhi',
  age: 33,
};

test('have all the same properties', () => {
  expect(test1).toEqual(test2);
});
```
##### 3) .toBeNull(); 匹配null
```
function bloop() {
  return null;
}

test('bloop returns null', () => {
  expect(bloop()).toBeNull();
});
```
##### 注意：.toBeNull() 和 .toBe(null)的作用是一样的。

##### 4）.toBeUndefined()：匹配undefined
```
test('test undefined', () => {
  let name
  let age = undefined
  expect(name).toBeUndefined()
  expect(age).toBeUndefined()
});
```
##### 注意：.toBeUndefined()和.toBe(undefined)的作用是一样的

##### 5）.toBeNaN()：匹配NaN
```
test('passes when value is NaN', () => {
  expect(NaN).toBeNaN();
});
```
##### 6）.toBeTruthy()：匹配结果为true的值
```
test('test true', () => {
  let name = 'Jsoning'
  let tag = true
  let age = 26
  let obj = {}
  expect(name).toBeTruthy()
  expect(tag).toBeTruthy()
  expect(age).toBeTruthy()
  expect(obj).toBeTruthy()
})
```
##### 注意：在js中false, 0, '', null, undefined, NaN都会被自动转换成false。

##### 7）.toBeFalsy()：匹配结果为false的值
```
test('test false', () => {
  let name = null
  let tag = false
  let age = 0
  let str = ''
  let und = undefined
  let nan = NaN
  expect(name).toBeFalsy()
  expect(tag).toBeFalsy()
  expect(age).toBeFalsy()
  expect(str).toBeFalsy()
  expect(und).toBeFalsy()
  expect(nan).toBeFalsy()
})
```
##### 注意：在js中false, 0, '', null, undefined, NaN都会被自动转换成false。

##### 8）.toBeDefined()：匹配已定义的值
```
test('test toBeDefined', () => {
  let name = ''
  let age = 26
  expect(name).toBeDefined()
  expect(age).toBeDefined()
})
```
##### 9）.not：对后续的匹配取反
```
test('test not', () => {
  let name = 'Jsoning'
  let n = null
  expect(name).toBe('Jsoning')
  expect(name).not.toBe('Json') //匹配值不为Json
  expect(n).toBeNull()
  expect(n).not.toBeUndefined() //匹配值不为undefined
})
```
##### 10）.toBeGreaterThan(number)：匹配大于number的数字
```
test('test toBeGreaterThan', () => {
  expect(10).toBeGreaterThan(9)
})
```
##### 11）.toBeGreaterThanOrEqual(number)：匹配大于等于number的数字
```
test('test toBeGreaterThanOrEqual', () => {
  expect(10).toBeGreaterThanOrEqual(9)
  expect(10).toBeGreaterThanOrEqual(10)
});
```
##### 12) .toBeLessThan(number)：匹配小于number的数字
```
test('test toBeLessThan', () => {
  expect(1).toBeLessThan(2)
});
```
##### 13) .toBeLessThanOrEqual(number)：匹配小于等于number的数字
```
test('test toBeLessThanOrEqual', () => {
  expect(1).toBeLessThanOrEqual(1)
  expect(1).toBeLessThanOrEqual(2)
})
```
##### 14) .toBeCloseTo(number, numDigits?)：匹配指定位数的浮点数
```
test('test toBeCloseTo', () => {
  // 0.1 + 0.2 = 0.30000000000000004
  expect(0.1+0.2).toBeCloseTo(0.3, 5) //匹配5位小数
})
```
##### 15) .toMatch(regexpOrString)：检查字符串是否匹配
```
test('test toMatch', () => {
  let str = 'abcdefg'
  expect(str).toMatch('ab')
  expect(str).toMatch(/[a-z]/)
})
```
##### 16) .toMatchObject(object)：匹配对象/数组是否属于子集
```
test('test toMatchObject', () => {
  let obj = {
    name: 'Jsoning',
    age: 24,
    area: 'bj'
  }

  let arr = [
    {
      foo: 'bar',
      name: 'Jsoning'
    },
    {
      baz: 1,
      age: 24
    }
  ]

  expect(obj).toMatchObject({
    name: 'Jsoning'
  })

  expect(obj).toMatchObject({
    name: 'Jsoning',
    age: 24,
    area: 'bj'
  })

  expect(arr).toMatchObject([
    {
      foo: 'bar'
    },
    {
      baz: 1
    }
  ])
})
```
##### 17) .toContain(item)：匹配数组/Set/字符串中是否包含item
```
test('test toContain', () => {
  let name = 'Jsoning'
  let arr = ['Jsoning', 'age']
  let set = new Set(arr)

  expect(name).toContain('Json')
  expect(arr).toContain('Jsoning')
  expect(set).toContain('age')
})
```
##### 注意：不能检查arr/set中的对象，比如[{ name: 'Jsoning' }]

##### 18）.toContainEqual(item)：和.toContain类似，必须完全匹配，但是可以匹配数组内对象
```
test('test toContainEqual', () => {
  let name = 'Jsoning'
  let arr = ['Jsoning', 'age', { name: 'Jsoning', age: 24 }]
  let set = new Set(arr)

  // expect(name).toContainEqual('Json') // 错误示例
  expect(arr).toContainEqual('Jsoning')
  expect(set).toContainEqual('age')
  //expect(set).toContainEqual({ name: 'Jsoning' }) // 错误示例
  expect(set).toContainEqual({ name: 'Jsoning', age: 24 })
})
```
##### 19）.toHaveLength(number)：判断对象是否有length属性，并检查是否匹配
```
test('test toHaveLength', () => {
  expect([1, 2, 3]).toHaveLength(3);
  expect('abc').toHaveLength(3);
})
```
##### 20）.toBeInstanceOf(Class)：匹配实例是否通过class构造函数实例出来
```
test('test toBeInstanceOf', () => {
  class A { }

  expect(new A()).toBeInstanceOf(A);
  expect(() => { }).toBeInstanceOf(Function);
  expect(new A()).toBeInstanceOf(Function); // throws
})
```
##### 21）.toThrow(error?)/.toThrowError(error?)：匹配异常
```
test('test toContainEqual', () => {
  function throwFun() {
    throw new Error('123abc')
  }
  expect(() => throwFun()).toThrow()
  expect(() => throwFun()).toThrow('123')
  expect(() => throwFun()).toThrow(/a/)
})
```
##### 注意：expect传入一个函数才可以匹配到异常

##### 22）.toHaveBeenCalled()/.toBeCalled()：检查函数是否被执行
```
function callback(fn) {
  fn()
}
test('test toHaveBeenCalled', () => {
  const fn = jest.fn(); //通过mock创建一个函数，后面教程会讲到
  callback(fn)
  expect(fn).toHaveBeenCalled();
  expect(fn).toBeCalled();
})
```
##### 23）.toHaveBeenCalledWith(arg1, arg2, ...)/.toBeCalledWith(arg1, arg2, ...)：检查调用函数传入值是否匹配
```
function callback(fn) {
  fn(123)
}
test('test toHaveBeenCalledWith', () => {
  const fn = jest.fn();
  callback(fn)
  expect(fn).toHaveBeenCalledWith(123);
  expect(fn).toBeCalledWith(123);
  expect(fn.mock.calls[0]).toEqual([123])
})
```
##### 24）.toHaveBeenLastCalledWith(arg1, arg2, ...)/.lastCalledWith(arg1, arg2, ...)：检查最后一次调用函数传入值是否匹配
```
function callback(fn, arg) {
  fn(arg)
}
test('test toHaveBeenLastCalledWith', () => {
  const fn = jest.fn();
  callback(fn, 123)
  callback(fn, 456)
  expect(fn).toHaveBeenLastCalledWith(456);
  expect(fn).lastCalledWith(456);
})
```
##### 25）.toHaveBeenNthCalledWith(nthCall, arg1, arg2, ....)/.nthCalledWith(nthCall, arg1, arg2, ...)：检查第nth次调用函数传入值是否匹配
```
function callback(fn, arg) {
  fn(arg)
}

test('test toHaveBeenLastCalledWith', () => {
  const fn = jest.fn();
  callback(fn, 123)
  callback(fn, 456)
  callback(fn, 789)
  expect(fn).toHaveBeenNthCalledWith(2, 456);
  expect(fn).nthCalledWith(2, 456);
})
```
##### 26）.toHaveBeenCalledTimes(number)/.toBeCalledTimes(number)：检查函数被调用次数是否匹配
```
function callback(fn, arg) {
  fn(arg)
}

test('test toHaveBeenCalledTimes', () => {
  const fn = jest.fn();
  callback(fn, 123)
  callback(fn, 123)
  callback(fn, 123)
  expect(fn).toHaveBeenCalledTimes(3);
  expect(fn).toBeCalledTimes(3);
})
```
##### 27）.toHaveReturned()/.toReturn()：检查函数是否有返回值
```
test('test toHaveReturned', () => {
  const fn = jest.fn(() => 123);
  fn()
  
  expect(fn).toHaveReturned();
  expect(fn).toReturn();
})
```
##### 28）.toHaveReturnedTimes(number)/.toReturnTimes(number)：检查函数返回值得次数
```
test('test toHaveReturnedTimes', () => {
  const fn = jest.fn(() => 123);
  fn()
  fn()

  expect(fn).toHaveReturnedTimes(2);
  expect(fn).toReturnTimes(2);
})
```
##### 29）.toHaveReturnedWith(value)/.toReturnWith(value)：检查函数返回值是否匹配
```
test('test toHaveReturnedWith', () => {
  const fn = jest.fn(() => 123);
  fn()

  expect(fn).toHaveReturnedWith(123);
  expect(fn).toReturnWith(123);
})
```
##### 30）.toHaveLastReturnedWith(value)/.lastReturnedWith(value)：检查最后一次函数返回值是否匹配
```
test('test toHaveLastReturnedWith', () => {
  const fn = jest.fn((arg) => arg);
  fn(123)
  fn(456)

  expect(fn).toHaveLastReturnedWith(456);
  expect(fn).lastReturnedWith(456);
})
```
##### 31）.toHaveNthReturnedWith(nthCall, value)/.nthReturnedWith(nthCall, value)：检查第nth次调用函数返回值是否匹配
```
test('test toHaveNthReturnedWith', () => {
  const fn = jest.fn((arg) => arg);
  fn(123)
  fn(456)

  expect(fn).toHaveNthReturnedWith(1, 123);
  expect(fn).nthReturnedWith(2, 456);
})
```





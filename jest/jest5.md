
### jest mock函数

  mock函数可以在测试代码的时候，捕获对函数的调用及参数和返回值等。可以用于数据的模拟。

  我们可以看下代码：
```
index.js 代码如下：

import axios from 'axios';

export function callbackFun(fn) { 
  return fn();
}

export function getData() { 
  // 这里接口路径随便写一个就可以了。本来就是mock数据
  return axios.get('/api').then(res => res.data);
}
```
index.test.js 代码如下：
```
import { callbackFun, getData } from './index';

test('测试 callbackFun,', () => {
  let fun = jest.fn();
  fun.mockReturnValueOnce('123') // 设置调用函数1次的返回值
  fun.mockReturnValueOnce('456') // 设置调用函数2次的返回值
  fun.mockReturnValue('666') // 设置每次调用函数的值都为666

  expect(callbackFun(fun)).toBe('123');
  expect(callbackFun(fun)).toBe('456');
  expect(callbackFun(fun)).toBe('666');
  expect(callbackFun(fun)).toBe('666');

  console.log(fun.mock);
});
```
如上：
```
jest.fn() 使用的jest模拟一个函数。
.mockReturnValueOnce() 设置调用一次函数的返回值，设置几个就是几次。
.mockReturnValue() 设置调用函数的返回值。
.mock 每个jest生成的函数都有mock属性，它里面包含了以下几个属性，如下所示：
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/7.png" />

#### 使用mock模拟接口数据

在实际开发项目中，测试接口我们不能直接请求接口，最好的方式是 模拟个mock数据。
```
import { callbackFun, getData } from './index';

// 这两句加在测试文件头部
import axios from 'axios';
jest.mock('axios');

test('测试 getData, 使用mock', async() => {
  // 模拟第一次接收到的数据
  axios.get.mockResolvedValueOnce({
    data: '123'
  });
  // 模拟每一次接收到的数据
  axios.get.mockResolvedValue({
    data: '456'
  })

  const data1 = await getData();
  const data2 = await getData();

  expect(data1).toBe('123');
  expect(data2).toBe('456');

  console.log('---data1--', data1); // 打印 ---data1--- 123
});
```
  如上代码，jest.mock('axios') 模拟axios请求数据，并不会发送真实请求, 这样我们就不会真的去发送接口请求，而是使用我们自己的数据结构。

#### 模拟异步数据代码提出

  如上已经模拟数据成功了，但是我们想更优雅的写代码，模拟的数据写到测试里面不太好，因此 jest 还给我们提供了另外一种方法。
```
1）将 index.test.js 内容删除
2）在根目录新建 __mocks__ 文件夹，在里面新建 index.js 并在里面写入内容。如下代码：
```
```
// 返回一个promise
export function getData() { 
  return new Promise(resolve => { 
    resolve({
      data: '测试数据'
    })
  })
}
```
  在 index.test.js 中写入以下测试用例
```
jest.mock('./index'); // 设置使用mock文件
import { getData } from "./index"; // 会去 __mocks__ 文件夹中寻找

// 设置 callbackFunc 方法会从源文件index中查找
const { callbackFun } = jest.requireActual('./index');

test('测试 getData, 使用 __mock__', async () => {
  const data = await getData();
  expect(data).toEqual({ data: '测试数据' });
});

test('测试 callbackFunc, 使用mockReturnValueOnce设置返回值', () => { 
  let fun = jest.fn();
  fun.mockReturnValueOnce('123');
  expect(callbackFun(fun)).toBe('123');
});
```
#### 注意如下几点：

##### 1）jest.mock('./index')会设置自动从__mocks__文件中找文件。
##### 2）设置后import拿的文件就是__mocks__中的，但是我们还需要测试其他方法，因此需要设置const { callbackFun } = jest.requireActual('./index'),从原本的index.js文件中找到方法，否则会提示callbackFun找不到。







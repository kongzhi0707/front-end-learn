
### jest 异步代码测试

在我们开发中，肯定会使用到异步请求，请求后台的接口数据，我们这里使用 axios 来请求数据。

#### 1）安装axios
```
npm install axios --save
```
#### 2) 在 index.js 编写异步代码
```
import axios from 'axios';

// 传入一个回调函数，获取数据后执行 
export function fetchData1(fn) {
  axios.get('https://bird.ioliu.cn/v2/?url=https://music.163.com/store/api/searchsuggest/get')
    .then(response => {
      fn(response.data)
    })
}

// 返回一个promise
export function fetchData2() { 
  return axios.get('https://bird.ioliu.cn/v2/?url=https://music.163.com/store/api/searchsuggest/get')
}

// 返回一个403接口
export function featchData3() {
  return axios.get('https://m10.music.126.net/20200114152235/1231231')
}
```
#### 3) 在 index.test.js 加入测试代码

下面有四种测试代码，按照自己的喜好，选择一种即可：

```
import { fetchData1, fetchData2, fetchData3 } from './index';

// 1. 第一种 使用done方法 测试用例会一直等到执行到done()方法才结束

test('测试 1-fetchData1', (done) => {
  fetchData1((data) => {
    expect(data).toMatchObject({
      code: 200
    });
    done();
  })
});

test('测试 1-fetchData2', (done) => {
  fetchData2().then(res => {
    expect(res.data).toMatchObject({
      code: 200
    })
    done();
  });
});

test('测试 1-fetchData3', (done) => {
  fetchData3().catch(e => {
    expect(e.toString()).toEqual('Error: Request failed with status code 403');
    done();
  })
});

// 2. 第二种 如果返回的是一个promise对象，可以直接使用 return 写法

test('测试 2-fetchData2', () => {
  return fetchData2().then(res => { 
    expect(res.data).toMatchObject({
      code: 200
    });
  })
});

test('测试2-fetchData3', () => {
  // 这里如果请求成功，就不会走catch， 但是测试依旧会通过 因此需要添加下面一句，只能执行一次 expect
  expect.assertions(1);

  return fetchData3().catch(e => { 
    expect(e.toString()).toEqual('Error: Request failed with status code 403');
  })
});

// 3. 第三种，如果返回的是一个promise对象，可以直接使用 return + resolves/reject 写法

test('测试 3-fetchData2', () => {
  return expect(fetchData2()).resolves.toMatchObject({
    data: {
      code: 200
    }
  })
});

test('测试 3-fetchData3', () => {
  return expect(fetchData3()).rejects.toThrow();
});


// 第四种：如果返回的是一个 promise对象，可以使用 async + await

test('测试4-fetchData2', async () => {
  const result = await fetchData2();
  expect(result.data).toMatchObject({
    code: 200
  })
});

test('测试4-fetchData3', async () => { 
  expect.assertions(1);
  try {
    await fetchData3()
  } catch (error) { 
    expect(error.toString()).toEqual('Error: Request failed with status code 403');
  }
})
```

在命令行中 运行 npm run test 后，执行效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/4.png"/>




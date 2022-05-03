
### jest snapshot快照测试

  在 index.js 中写入一些待测试方法：
```
export const data1 = () => { 
  return {
    name: 'kongzhi',
    age: 33,
    time: '2020.1.1'
  }
}

export const data2 = () => { 
  return {
    name: 'kongzhi',
    age: 33,
    time: new Date()
  }
}
```
  在 index.test.js 中写入一些测试实例；
```
import { data1, data2 } from "./index";

it('测试快照 data1', () => {
  expect(data1()).toMatchSnapshot({
    name: 'kongzhi',
    age: 33,
    time: '2020.1.1'
  })
});

it('测试快照 data2', () => { 
  expect(data2()).toMatchSnapshot({
    name: 'kongzhi',
    age: 33,
    time: expect.any(Date) // 用于声明是个时间类型，否则时间会一直改变，快照不通过
  })
})
```
  toMatchSnapshot 方法会将参数快照进行匹配。
  expect.any(Date) 用于匹配一个时间类型。

  当我们执行 npm run test 后会在项目的根目录下生成一个 __snapshots__ 文件夹，里面是生成的快照， index.test.js.snap. 内容如下：
```
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`测试快照 data1 1`] = `
Object {
  "age": 33,
  "name": "kongzhi",
  "time": "2020.1.1",
}
`;

exports[`测试快照 data2 1`] = `
Object {
  "age": 33,
  "name": "kongzhi",
  "time": Any<Date>,
}
`;
```
  当我们修改测试代码后，会提示我们，快照不匹配。

  下面 是改动 '测试快照 data1' 中的age 从33 改成 34.
```
it('测试快照 data1', () => {
  expect(data1()).toMatchSnapshot({
    name: 'kongzhi',
    age: 33,
    time: '2020.1.1'
  })
});
```
  然后在命令行中如下显示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/8.png" />

#### 注意：如果我们不想将快照生成一个文件。我们需要如下做：
```
1. 将 __snapshots__ 删除
2. npm install prettier --save 安装 prettier 模块，在行内生成快照依赖这个模块。
3. 编写测试用例 在 index.test.js 中写入
```
```
import { data1, data2 } from "./index";

it('测试快照 data1', () => {
  expect(data1()).toMatchInlineSnapshot({
    name: 'kongzhi',
    age: 33,
    time: '2020.1.1',
  })
});

it('测试快照 data2', () => { 
  expect(data2()).toMatchInlineSnapshot({
    name: 'kongzhi',
    age: 33,
    time: expect.any(Date) // 用于声明是个时间类型，否则时间会一直改变，快照不通过
  })
})
```
#### toMatchInlineSnapshot 在行内匹配快照， 当我们运行 npm run test 后，即可看到 在我们的 index.test.js 文件内部生成快照。

  index.test.js 代码变为如下：
```
import { data1, data2 } from "./index";

it("测试快照 data1", () => {
  expect(data1()).toMatchInlineSnapshot(
    {
      name: "kongzhi",
      age: 33,
      time: "2020.1.1",
    },
    `
    Object {
      "age": 33,
      "name": "kongzhi",
      "time": "2020.1.1",
    }
  `
  );
});

it("测试快照 data2", () => {
  expect(data2()).toMatchInlineSnapshot(
    {
      name: "kongzhi",
      age: 33,
      time: expect.any(Date), // 用于声明是个时间类型，否则时间会一直改变，快照不通过
    },
    `
    Object {
      "age": 33,
      "name": "kongzhi",
      "time": Any<Date>,
    }
  `
  );
});
```
#### 快照测试用于测试 UI 组件是非常有用的，防止项目中其他人误修改文件。





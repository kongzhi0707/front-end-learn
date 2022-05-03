
### jest钩子函数

  jest 中有4个钩子函数
```
1）beforeAll: 所有测试之前执行。
2）afterAll: 所有测试执行完之后。
3）beforeEach: 每个测试实例之前执行。
4）afterEach: 每个测试实例完成之后执行。
```
  在 index.js 加入如下代码：
```
export default class Demo { 
  constructor() { 
    this.count = 0;
  }
  addOne() { 
    this.count += 1;
  }
  addTwo() { 
    this.count += 2;
  }
  minusOne() { 
    this.count -= 1;
  }
  minusTwo() { 
    this.count -= 2;
  }
}
```
  index.test.js 加入如下代码：
```
import Count from './index';

const instance = new Count();

beforeAll(() => {
  console.log('----beforeAll---');
});

afterAll(() => {
  console.log('---afterAll----');
});

beforeEach(() => {
  console.log('---beforeEach-----');
});

afterEach(() => {
  console.log('----afterEach----');
});

test('测试 addOne', () => {
  instance.addOne();
  expect(instance.count).toBe(1);
});

test('测试 minusOne', () => {
  instance.minusOne();
  expect(instance.count).toBe(0);
});
```
  运行下 查看结果，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/5.png" />

  如上可以看到，测试用例全部通过，如上可以看钩子函数执行的顺序。

#### describe

  describe 相当于一个块，可以将测试用例放在一个块中。 

  index.test.js 代码改为如下：
```
import Count from './index';
let instance = null;

beforeAll(() => {
  console.log('----beforeAll---');
});

afterAll(() => {
  console.log('---afterAll----');
});

beforeEach(() => {
  instance = new Count();
  console.log('---beforeEach-----');
});

afterEach(() => {
  console.log('----afterEach----');
});

describe('测试加法111', () => {
  test('测试 addOne', () => {
    instance.addOne();
    expect(instance.count).toBe(1);
  });
  test('测试 addTwo', () => {
    instance.addTwo();
    expect(instance.count).toBe(2);
  });
});

describe('测试减法222', () => {
  test('测试 minusOne', () => {
    instance.minusOne();
    expect(instance.count).toBe(-1);
  });
  test('测试 minusTwo', () => {
    instance.minusTwo();
    expect(instance.count).toBe(-2);
  })
});
```
测试结果如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/6.png" />

  之前我们么有添加 describe，默认情况下，是有一个describe在外面包裹着，是可以省略的。
  describe方法内部也可以添加如上四个钩子函数的。因此我们可以在 describe 函数里面添加钩子函数，并查看他们的执行顺序。

index.test.js 代码改为如下：
```
import Count from './index';
let instance = null;

beforeAll(() => {
  console.log('----beforeAll---');
});

afterAll(() => {
  console.log('---afterAll----');
});

beforeEach(() => {
  instance = new Count();
  console.log('---beforeEach-----');
});

afterEach(() => {
  console.log('----afterEach----');
});

describe('测试加法111', () => {
  beforeAll(() => {
    console.log('---测试加法beforeAll---')
  })

  afterAll(() => {
    console.log('---测试加法afterAll---')
  })

  beforeEach(() => {
    instance = new Count();
    console.log('---测试加法beforeEach---')
  })

  afterEach(() => {
    console.log('---测试加法afterEach---')
  })

  test('测试 addOne', () => {
    instance.addOne();
    expect(instance.count).toBe(1);
  });
  test('测试 addTwo', () => {
    instance.addTwo();
    expect(instance.count).toBe(2);
  });
});

describe('测试减法222', () => {

  beforeAll(() => {
    console.log('---测试加法beforeAll---')
  })

  afterAll(() => {
    console.log('---测试加法afterAll---')
  })

  beforeEach(() => {
    instance = new Count();
    console.log('---测试加法beforeEach---')
  })

  afterEach(() => {
    console.log('---测试加法afterEach---')
  })

  test('测试 minusOne', () => {
    instance.minusOne();
    expect(instance.count).toBe(-1);
  });
  test('测试 minusTwo', () => {
    instance.minusTwo();
    expect(instance.count).toBe(-2);
  })
});
```


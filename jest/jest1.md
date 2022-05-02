
### jest 自动化测试 及 常用的命令行工具

##### 一：使用jest的优点？
```
1）零配置：在大部分项目中可以实现开箱即用，无需配置。
2）速度快：根据文件的修改进行测试，不会每次测试全部实例。
3) 快照功能：能够进行简单快速的测试。
4）隔离性好：不同的测试文件环境独立，不会相互影响。
5）api简单等等。
```

##### 二：安装配置

  1) 在对应的目录下，创建 jest-demo 文件夹。 
  2) 进入该文件夹，运行 npm init 初始化一个 package.json文件。
  3）安装 jest。 使用命令: npm install --save-dev jest
  4) 在该目录下，新建两个文件 index.js, index.test.js 文件。
  5） 在 index.js 中写入如下代码：
```
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```
  6. 在 index.test.js 中写入代码：
```
const sum = require('./index');

test('测试 sum', () => {
  expect(sum(1, 2)).toBe(3);
});
```
  7. 在 package.json中的script加入以下命令
```
{
  "scripts": {
    "test": "jest"
  },
}
```
  最后我们运行 npm run test 即可，出现下面这样，表示测试完成，如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/1.png"/>

  如上所示，我们的模块导出和导入都是使用 commonjs 的规范，在node环境是没有问题的，但是在实际开发中我们的代码是运行在浏览器中的，因此我们需要转换成浏览器能够识别的ES6模块方法。 因此我们可以借用babel来实现。

#### 使用babel让jest支持ES6模块导入和导出

  1. 安装babel模块
```
npm install --save-dev @babel/core @babel/preset-env
```
  2. 在项目的根目录下新建 .babelrc 文件，写入如下代码：
```
{
  "presets":[
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
```
  3. 将 index.js 和 index.test.js 内的导入和导出模块代码改成es6语法。

  index.js 代码：
```
export function sum(a, b) {
  return a + b;
}
```
  index.test.js 代码：
```
import { sum } from './index';

test('测试 sum', () => {
  expect(sum(1, 2)).toBe(3);
});
```
我们继续 运行 npm run test 后，即可看见测试成功的提示。

#### 三：学习常用的命令行工具

##### 1. --watchAll

我们可以使用 --watchAll 来监控所有文件的变化，比如在 package.json 文件的script配置如下：
```
"scripts": {
  "test": "jest --watchAll"
}
```
##### 2. --watch

这个和使用 --watchAll 后按下o键，是一样的效果，每次只重新测试修改过后的文件。
```
"scripts": {
  "test": "jest --watch"
}
```
##### 3. --init

生成一个jest基础配置文件

##### 4. --coverage

将测试覆盖率信息输出为报告，会生成测试覆盖率的详细信息。 会在我们项目中生成一个 coverage 的文件夹，打开其他的 index.html 可查看详细信息。
```
"scripts": {
  "test": "jest --coverage"
}
```
  运行 npm run test 完成后，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/2.png"/>

  在我们的项目的根目录下生成 coverage 文件夹。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/jest/images/3.png"/>

  更多一些命令，可以去<a href="https://jestjs.io/docs/cli">官网看看</a>

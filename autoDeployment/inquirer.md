### inquirer.js---命令行交互工具

  作用是：当我们需要做一个脚手架时，我们某些时候需要和用户进行交互，这个时候我们需要使用 inquirer.js---命令行交互工具。

  inquirer.js 主要的功能有如下：
```
1. 问一些问题。
2. 解析输入。
3. 验证答案。
4. 对错误答案的反馈。
5. 管理分层提示。
```
  官方文档(https://www.npmjs.com/package/inquirer)

  基本demo使用方式如下：
```
const inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'input', // 问题类型
    name: 'name',  // 数据属性名
    message: '名称', // 提示信息
    default: 'kongzhi', // 默认值
  }
]).then(answers => {
  // 处理结果
  console.log('你的名字:', answers.name);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    // ....
  } else {
    // ....
  }
});
```
  由于交互的问题不同，inquirer提供了很多配置项：

#### type: 表示提问的类型，包括: input, confirm, list, rawlist, expand, checkbox, password, editor; 默认为input。
#### name: 接受答案的key，当问题被回答，答案会以对象的形式返回。
#### message: 用于设置提问的问题(String|Function), 如果设置为Function，该Function的第一个参数为近期回答的答案对象。

  如下代码：
```
const inquirer = require('inquirer');
const promptList = [
  { 
    type: 'input',
    message: '请输入你的名字？',
    name: 'name',
    default: 'test_user' 
  },
  {
    type: 'input',
    name: 'age',
    message: function(e) {
      return `${e.name}, 请输入您的年龄？`
    }
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('你的名字:', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
      console.log('异常处理');
  }
});
```
  执行的返回结果如下样子：
```
? 请输入你的名字？ kongzhi
? kongzhi, 请输入您的年龄？ 31
你的名字: { name: 'kongzhi', age: '31' }
```
#### default: 默认值，如果用户没有回答，默认值存在则为该问题赋值的默认答案（String|Number|Boolean|Array|Function）,如果设置为function，该function的第一个参数为近期回答的答案构成的对象。

#### choices: 用于设置选项的列表（Array｜Function），如果设置为Function，该Function的第一个参数为近期回答的答案构成的对象；
```
const inquirer = require('inquirer');
const promptList = [
  { 
    type: 'list',
    message: '请选择性别',
    name: 'name',
    choices: ['男', '女'] 
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log(answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
      console.log('异常处理');
  }
});

执行结果如下：

? 请选择性别 (Use arrow keys)
❯ 男 
  女 

当我选择女时候，结果如下：

? 请选择性别 女
{ name: '女' }
```
#### validate: 用来校验输入的答案是否符合要求，类型为Function，该Function的第一个参数为近期回答的答案，通过返回boolean来判断是否校验通过，如果未通过则重新进入输入界面。
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'input',
    message: '请输入手机号',
    name: 'iphone',
    validate: function(val) {
      if (val.match(/^[1][2,3,5,6,7,8][0-9]{9}$/)) {
        return true;
      }
      return '您输入的电话号码格式不对，请重新输入';
    }
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('您输入的号码为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  执行结果如下：
```
? 请输入手机号 1234556678911
>> 您输入的电话号码格式不对，请重新输入

? 请输入手机号 13588741921
您输入的号码为： { iphone: '13588741921' }
```
#### filter: 对输入的答案进行处理后返回新的答案（Function），该Function的第一个参数为近期回答的答案。
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'checkbox',
    message: '请选择性别？',
    name: 'sex',
    choices: ['男', '女'], 
    filter: function(res) {
      console.log('结果为:' + res);
      let sex = '';
      res === '女' ? sex = 'woman' : sex = 'man';
      return sex;
    }
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('选择的结果为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  执行的结果为：
```
? 请选择性别？ (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ 男
 ◯ 女
```
  选择一项按回车键后，如下结果：
```
? 请选择性别？ 
选择的结果为： { sex: 'man' }
```
#### transformer: 对用户回答的显示效果进行处理(比如：修改回答的字体或背景颜色)。

#### when: 根据前面问题的回答，判断当前问题是否需要被回答（Function），返回Boolean，返回false表示忽略这个问题，该Function的第一个参数为近期回答的答案。
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'list',
    message: '请问您结婚了吗？',
    name: 'isMarry',
    choices: ['已结婚', '未结婚'],
  }, 
  {
    type: "input",
    message: '请问你有小孩吗？',
    name: 'child',
    default: '(Y/n)',
    when: function(res) {
      return res.isMarry === '已结婚';
    }
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('选择的结果为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  当我选择未结婚时，执行结果如下：
```
? 请问您结婚了吗？ (Use arrow keys)
❯ 已结婚 
  未结婚 

选择的结果为： { isMarry: '未结婚' }

当我选择已结婚时，执行的结果如下：

? 请问您结婚了吗？ (Use arrow keys)
❯ 已结婚 
  未结婚 

? 请问您结婚了吗？ 已结婚
? 请问你有小孩吗？ ((Y/n)) 

? 请问你有小孩吗？ n
选择的结果为： { isMarry: '已结婚', child: 'n' }
``` 
  如上我们可以看到，when的回掉函数中代码： res.isMarry === '已结婚'; 如果我们选择 '已结婚' 时候， 就返回true，才会执行该问题，否则的话，忽略该问题。

#### pageSize: 设置选择列表每页显示的可选项数目。
#### prefix: 给问题前面添加内容
#### suffix: 给问题后面添加内容

  代码如下：
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'string',
    message: '您输入的名字是？',
    name: 'name',
    prefix: '您好',
    suffix: '，这是后缀名字'
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('结果为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  执行结果如下：
```
您好 您输入的名字是？，这是后缀名字 tugenhua
结果为： { name: 'tugenhua' }
```
### 问题类型有如下：

#### 1. input输入
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'input',
    message: '地址',
    name: 'address',
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('结果为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  结果如下：
```
? 地址 浙江省杭州市
结果为： { address: '浙江省杭州市' }
```
#### 2. confirm 是否选择 （y/n）
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'confirm',
    message: '是否退出',
    name: 'out',
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('结果为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  执行结果如下：
```
? 是否退出 (Y/n) 

当我选择 Y 时候，结果如下：

? 是否退出 Yes
结果为： { out: true }

当我选择 n 的时候，结果如下：

? 是否退出 No
结果为： { out: false }
```
#### 3. list 选择列表
```
const inquirer = require('inquirer');
const promptList = [
  {
    type: 'list',
    message: '请选择手机品牌',
    name: 'phone',
    choices: [
      { name: '小米', value: 'mi' },
      { name: '华为', value: 'huawei' },
      { name: '苹果', value: 'apple' }
    ]
  }
];

// 设置问题 
inquirer.prompt(promptList).then(answers => {
  // 处理结果
  console.log('结果为：', answers);
}).catch(error => {
  // 异常的处理
  if (error.isTryError) {
    console.log(error.isTryError);
  } else {
    console.log('异常处理');
  }
});
```
  执行的结果为：
```
? 请选择手机品牌 (Use arrow keys)
❯ 小米 
  华为 
  苹果 

? 请选择手机品牌 小米
结果为： { phone: 'mi' }
```
#### 4. rawlist 带编号的选择列表
```
{
  type: 'rawlist',
  message: '编号',
  name: 'num',
  default: 2, // 默认值为列表项编号，起始为0
  choices: [
    { name: '小米', value: 'mi' },
    { name: '华为', value: 'huawei' },
    { name: '苹果', value: 'apple' }
  ]
}
```
执行结果：
```
? 编号 
  1) 小米
  2) 华为
  3) 苹果
  Answer: 

当我选择华为：

? 编号 huawei
结果为： { num: 'huawei' }
```





### GraphQL入门教程

#### 1. 什么是GraphQL?

  GraphQL 是FaceBook开发的一种开源查询语言，它为我们提供了一种更有效的设计，创建和使用API的方法。它是REST的替代品。

  GraphQL的特性有如下：
```
1. GraphQL查询的数据准确，返回的结果是可预测的。
2. GraphQL是强类型的，通过它我们可以在执行之前验证GraphQL类型系统中的查询，它能帮助我们构建强大的API。
3. 获取多个资源，只需要使用一个请求。可以通过一次请求获取我们应用需要的所有数据。
```
#### 2. 如何使用GraphQL

  1) 首先我们创建一个项目名称为 graphql-server, 在mac终端执行如下命令：
```
mkdir graphql-server
``` 
  2) 然后执行 npm init -y 来生成package.json文件。

  3) 安装 graphpack，执行如下命令：
```
sudo npm install --save-dev graphpack
```
  安装完 Graphpack之后，我们在package.json文件中的脚本，添加如下代码：
```
"scripts": {
  "dev": "graphpack",
  "build": "graphpack build"
},
```
  4) 在项目的根目录下创建src文件夹，在该文件夹中创建一个名为 schema.graphql 的文件，添加如下代码：
```
type Query {
  hello: String
}
```
  如上的 schema.graphql 文件是我们整个 GraphQL的模式(Schema).

  5）然后在 src 文件夹下创建文件 resolvers.js， 添加如下代码：
```
import { users } from './db';

const resolvers = {
  Query: {
    hello: () => "Hello World!"
  }
};

export default resolvers;
```
  resolvers.js 文件是我们提供 GraphQL操作转换为数据的指令的方式。

  6）在src文件夹下创建一个 db.js 文件，并写入以下代码：
```
export const users = [
  { id: 1, name: "kongzhi1", email: "kongzhi@qq.com", age: 31 },
  { id: 2, name: "kongzhi2", email: "kongzhi2@qq.com", age: 32 }
];
```
  如上我们的 db.js 将模拟数据库中的数据。

  因此我们的项目结构为如下：
```
｜--- graphql-server
｜ |--- node_modules
｜ |--- src
｜ | |--- db.js
｜ | |--- resolvers.js
｜ | |--- schema.graphql 
｜ |--- package.json
```
  7) 启动服务器

  运行如下命令： npm run dev
  我们可以看到如下信息：说明服务器启动成功：
```
DONE  Compiled successfully in 785ms                                                                                                        08:58:44

Server ready at http://localhost:4000/
```
  然后我们在浏览器打开：http://localhost:4000/ 会看到如下界面操作：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/82.jpg" /> <br />

  如上就是我们的 GraphQL IDE，可用于更好的开发工作流程。

#### 3）模式(Schema)

  如果我们用过MongoOSE，那么应该对Schema这个概念比较熟悉，翻译过来就是模式。
  它定义了字段的类型，数据结构，描述了接口数据请求的规则。

  GraphQL也有自己的语言类型，用于编写模式。我们也可以叫他规范或描述语言(SDL）。这种模式语言非常有用，因为它更直观的看出API有哪些类型。一看到API
我们就知道如何使用。


#### 4）类型(Type)

  类型是 GraphQL 最重要的特性之一，类型表示API外观的自定义对象。比如：如果我们构建一个社交媒体应用程序的话，那么我们的API应该具有 文章，用户，赞
，组等类型。

  类型它有字段，这些字段会返回特定类型的数据。比如我们现在要创建一个 User类型，那么它有 name，email 和 age字段。类型中的字段可以是任何类型，并且始终返回一种数据类型。

  比如我们现在编写我们的第一个Type，在 src/schema.graphql 文件中的内容改成如下：
```
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}
```
  每个用户都拥有一个ID，因此提供了ID类型，用户也会有一个name和email，因此给他一个字符串类型，及每个用户都有一个 age，因此给他一个Int类型。

  但是，如上代码，在每一行的结尾加一个 ! 呢？感叹号表示该字段不可为空。唯一可以为空的字段叫 age。

#### 在GraphQL中，有三个如下主要的概念：
```
1）query(查询) --- 从服务器获取数据的方式。
2）mutation(更改) --- 修改服务器上的数据并获取更新数据的方法(创建，更新，删除)。
3）subscription(订阅)--- 当希望数据更改时，可以进行消息推送。
```
#### 对象类型和标量类型

在GraphQL中，有对象类型和标量类型。
1. 对象类型：用户在schema中定义对type。
2. 标量类型：GraphQL中内置有一些标量类型：比如 String, Int, Float, Boolean, ID. 用户也可以自己定义自己对标量类型。

比如在 Schema中声明：

type User {
  name: String!
  age: Int
}

#### 4.1）query(查询)

  GraphQL中的查询是获取数据的方式。我们将在 GraphQL 中创建第一个类型的Query。我们所有的查询都将以此类型结束。因此，我们在文件 schema.graphql
文件中编写一个名为 Query的新类型。
```
type Query {
  users: [User!]!
}
```
  上面代码的含义是：用户查询将返回给我们一个或多个用户的数组。它不会返回null，因为我们放入来 !, 这意味的它是一个不可为空的查询，它总会返回一些数据。

  但是我们也可以返回特定的用户，比如我们创建一个名为user的新查询，在我们的 Query类型中，写入以下代码：
```
user(id: ID!): User!
```
  因此现在Query类型变成如下：
```
type Query {
  users: [User!]!
  user(id: ID!): User!
}
```
  如上我们可以看到，在使用 GraphQL中的查询，查询时候我们还可以传递参数，比如如上查询特定的用户，我们可以传递用户的id作为条件来查询。

  src/schema.graphql 中所有的代码如下：
```
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}

type Query {
  users: [User!]!
  user(id: ID!): User!
}
```
#### 解析函数 Resolver

  如上我们通过 GraphQL 中创建类型的Query，来查询数据，但是我们的数据是从哪里来呢？因此我们需要有一个 resolvers.js 文件，该文件是来告GraphQL 它将如何以及何处来获取数据的。

  我们接下来看我们之前创建的 src/resolvers.js，该文件里面会导入 db.js文件。现在我们把该文件的代码改成如下：
```
import { users } from './db';

const resolvers = {
  Query: {
    user: (parent, { id }, context, info) => {
      return users.find(user => user.id == id);
    },
    users: (parent, args, context, info) => {
      return users;
    }
  }
};

export default resolvers;
```
  如上代码，在每个查询解析器都有四个参数，在user函数中，我们将id作为参数传递，然后返回和传递的id匹配的特定user。
  在 users函数中，我们只是返回已经存在的users数组，这个数组存放的是所有的用户。
```
parent: 当前上一个解析函数的返回值。
args: 查询中传入的参数。
context: 提供给所有解析器的上下文信息。
info: 一个保存与当前查询相关的字段特定信息以及schema详细信息的值。
```
  解析函数的返回值可以是一个具体的值，也可以是Promise或Promise数组。
  现在我们将测试查询是否正常工作，我们再来看浏览器 http://localhost:4000/ 服务器下，输入以下代码：
```
query {
  users {
    id
    name
    email
    age
  }
}
```
  它会返回所有的用户给我们，如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/83.jpg" /> <br />

  如果我们想返回特定的用户，代码改成如下：
```
query {
  user(id: 1) {
    id
    name
    email
    age
  }
}
```
<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/84.jpg" /> <br />

#### 4.2) mutation (更改)

  在GraphQL中，更改是修改服务器上的数据并获取更新数据的方式。

  1）首先我们在 schema.graphql文件中编写一个名为 mutation的新类型。代码如下：
```
type Mutation {
  createUser (id: ID!, name: String!, email: String!, age: Int): User!
  updateUser (id: ID!, name: String!, email: String!, age: Int): User!
  deleteUser(id: ID!): User!
}
```
  如上定义三个修改数据的方法解析如下：
```
createUser: 传入需要创建用户的ID，name，email 和 age(非必填)，他们会返回一个新用户给我们。
updateUser: 传入需要修改用户的ID，name，email 和 age(非必填)，它会返回一个新用户给我们。
deleteUser：传入需要删除用户的ID，它会返回一个新用户给我们。
```
  因此 src/schema.graphql 所有的代码如下：
```
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}

type Query {
  users: [User!]!
  user(id: ID!): User!
}

type Mutation {
  createUser (id: ID!, name: String!, email: String!, age: Int): User!
  updateUser (id: ID!, name: String!, email: String!, age: Int): User!
  deleteUser(id: ID!): User!
}
```
  2）在 src/resolvers.js文件中 添加 mutation 对象，代码如下所示：
```
import { users } from './db';

const resolvers = {
  Query: {
    user: (parent, { id }, context, info) => {
      return users.find(user => user.id == id);
    },
    users: (parent, args, context, info) => {
      return users;
    }
  },
  Mutation: {
    createUser: (parent, { id, name, email, age }, context, info) => {
      const newUser = { id, name, email, age };
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      let newUser = users.find(user => user.id === id);
      newUser.name = name;
      newUser.email = email;
      newUser.age = age;
      return newUser;
    },
    deleteUser: (parent, { id }, context, info) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error("User not found.");
      const deleteUsers = users.splice(userIndex, 1);
      return deleteUsers[0];
    }
  }
};

export default resolvers;
```
  现在我们来测试下我们的 mutations 是否正常，在浏览器地址栏中访问 http://localhost:4000/ 输入如下代码：

#### 1.） 创建一个用户
```
mutation {
  createUser(id: 3, name: "kongzhi3", email: "kongzhi3@qq.com", age: 33) {
    id
    name
    email
    age
  }
}
```
  如下图所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/85.jpg" /> <br />

  然后我们再查询下所有的用户看数据是否创建成功了。
```
query {
  users {
    id
    name
    email
    age
  }
}
```
  如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/86.jpg" /> <br />

#### 2）更新用户：
```
mutation {
  updateUser(id: 3, name: "tugenhua", email: "tugenhua@qq.com", age: 33) {
    id
    name
    email
    age
  }
}
```
  执行如上命令后，我们再来查询下，结果如下，可以看到数据已经更新了。

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/87.jpg" /> <br />

#### 3) 删除用户
```
mutation {
  deleteUser(id: 3) {
    id
    name
    email
    age
  }
}
```
  同样的道理，执行上面的删除对应的用户的话，我们再来查询下所有用户的数据，如下所示：

<img src="https://raw.githubusercontent.com/tugenhua0707/react-collection/master/images/88.jpg" /> <br />

#### 4.3）subscription(订阅)

  订阅是与服务器保持实时链接的方式。这也就意味着无论何时服务器中发生事件，并且每当调用该事件时，服务器都会将对应的数据发送给客户端。
通过订阅，我们就可以让我们的应用在不同的用户之间保持数据更新操作。

待续～  

#### <a href="https://github.com/tugenhua0707/koa-graphql-mongodb/tree/master/graphql-server">源码请点击查看</a>
















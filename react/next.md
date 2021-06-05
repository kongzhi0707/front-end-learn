
### 使用Next.js构建React服务端渲染

  当我们使用React开发的时候，需要配置很多，比如webpack配置，Router配置和服务器配置等。当我们做服务器端渲染的时候，怎么样让服务器端和客户端渲染保持一致的话也是很麻烦的。Next.js 提供了一个很好的解决方案，能让开发人员可以将精力放在业务上。

  Next.js 有如下特性：
```
1）默认支持服务端渲染。
2）自动根据页面进行代码分割。
3）基于webpack的开发环境，支持热模块替换。
4）基于页面的客户端路由方案。
5）可以和Express或其他Node.js服务器端完美集成。
6）支持Babel和Webpack的配置项定制。
```
#### 一：创建项目并初始化
```
mkdir next-server-render

cd next-server-render

npm init
```
#### 1）安装next.js

  因为是创建React应用，所以我们也要安装 react 和 react-dom
```
npm install react react-dom next --save
```
  在项目的根目录下添加文件夹pages(一定要命名为pages，这是next强制约定的，否则路由会找不到页面的)。然后在package.json文件添加script用于启动项目。
```
{
  "scripts": {
    "dev": "next"
  },
}
```
#### 2）创建视图

  在pages文件夹下创建 index.js 文件，文件内容如下：
```
const Index = () => (
  <div>
    <p>Hello next.js</p>
  </div>
)

export default Index;
```
#### 3）运行命令
```
npm run dev
```
  然后在浏览器打开 http://localhost:3000/ 网页显示如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/68.jpg" /> <br />

#### 4) 前端路由

  next.js 前端路由非常简单，比如想要路由 /about 这样的，我们只需要在 pages 下新建 about.js，即可，我们在pages下新增about.js页面，如下代码：
```
const About = () => (
  <div>
    <p>this is About Page</p>
  </div>
)

export default About;
```
  当我们在浏览器中请求 http://localhost:3000/about 时，可以看到页面展示对应的内容。

#### 4.1）前端路由跳转

  前端路由跳转，我们可以使用传统的a标签在页面之间进行跳转，但是每次跳转，都需要去服务器端请求一次，因此为了不去服务器端请求，在next.js中，我们使用前端路由机制进行跳转。

  在next.js中使用 next/link 实现页面之间的跳转，用法如下, pages/index.js 代码改成如下：
```
import Link from 'next/link';
const Index = () => (
  <div>
    <Link href="/about">
      <a>About page</a>
    </Link>
    <p>Hello next.js</p>
  </div>
)

export default Index;
```
  这样我们点击index页面的About page链接就能跳转到about页面，当我们点击浏览器返回按钮也是通过前端路由进行跳转的。

#### 注意：前端路由跳转是不会发生网络请求的，但是第一次加载的时候会有一个about.js文件的请求，该请求来自页面内动态插入的script标签的，但是about.js只会请求一次，之后访问是不会请求的，我们可以自己操作试下就可以知道的。

  如下，刷新 http://localhost:3000/ 页面，然后点击进去about页面，结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/69.jpg" /> <br />

  然后当我点击后退按钮，后退页面，再点击 about 按钮进来，结果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/70.jpg" /> <br />

  如上可以看到，第二次进来当时候，没有请求about.js。

#### 注意：
##### 1. Link标签支持任意react组件作为子元素，不一定使用a标签。
##### 2. Link标签不支持添加style和className等属性，如果要给链接增加样式，需要在子元素标签上添加。

#### 二：理解Layout

  所谓Layout就是给不同的页面添加相同的 header，footer，navbar等通用的部分。同时又不需要写重复的代码，在next.js中可以通过共享某些组件来实现layout。
首先我们在项目的根目录下新建 components 文件夹，该文件夹存放所有的公共组件，如果是页面级的组件存放到pages中。因此我们首先在 components中新建header.js， 基本代码如下：
```
import Link from "next/link";

const listStyle = {
  marginRight: 15
};

const Header = () => {
  <div>
    <Link href="/">
      <a style={listStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={listStyle}>About</a>
    </Link>
  </div>
}

export default Header;
```
  然后我们在index和about页面中引入header组件，这样就实现来公共的layout的header；

  pages/index.js 代码改成如下：
```
import Header from "../components/Header";

const Index = () => (
  <div>
    <Header />
    <p>Hello next.js</p>
  </div>
)

export default Index;
```
  pages/about.js 代码改成如下：
```
import Header from "../components/header";

const About = () => (
  <div>
    <Header />
    <p>this is About Page</p>
  </div>
)

export default About;
```
  当然引入footer也可以按照header的方法实现。

  防止每个页面都要引入header.js 和 footer.js，我们可以实现一个整体的Layout组件，避免引入多个组件的麻烦，因此我们在 components 文件夹下新增 layout.js,
文件内容代码改成如下：
```
import Header from "./header";
import Footer from "./footer";

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: "1px solid #DDD"
};

const Layout = (props) => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
    <Footer />
  </div>
)

export default Layout;
```
  components/footer.js 代码如下：
```
const Footer = () => (
  <div>
    这是footer部分
  </div>
)

export default Footer;
```
  因此在我们的 pages/index.js 代码改成如下：
```
import Layout from "../components/layout";

const Index = () => (
  <Layout>
    <p>Hello next.js</p>
  </Layout>
)
export default Index;
```  
  pages/about.js 代码改成如下：
```
import Layout from "../components/layout";

const About = () => (
  <Layout>
    <p>this is About Page</p>
  </Layout>
)

export default About;
```
  因此当我们访问 http://localhost:3000/ 的时候，页面显示的效果如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/71.jpg" /> <br />

  当我们访问 http://localhost:3000/about 的时候，页面显示效果变成如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/72.jpg" /> <br />

  因此目前项目的整个目录架构如下所示：
```
｜--- next-server-render
｜ |--- components
｜ | |--- header.js
｜ | |--- footer.js
｜ | |--- navbar.js
｜ | |--- layout.js
｜ |--- node_modules
｜ |--- pages
｜ ｜ ｜--- index.js
｜ ｜ ｜--- aboute.js
｜ ｜--- package.json
```
#### 三：页面间传值

#### 3.1）通过url参数 (query string)

  next中的页面传值方式和传统网页一样也可以使用url参数来实现。

  下面我们将 pages/index.js 的内容替换成如下代码：
```
import Layout from "../components/layout";
import Link from "next/link";

const DetailLink = (props) => (
  <li>
    <Link href={`/detail?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);

const Index = () => (
  <Layout>
    <h1>My Blog</h1>
    <ul>
      <DetailLink title="Hello next.js"/>
      <DetailLink title="next.js is awesome"/>
      <DetailLink title="index.js 页面"/>
    </ul>
  </Layout>
)

export default Index;
```
  如上代码，我们通过在Link的href中添加title参数就可以实现传值。

  现在我们继续在 pages文件夹下新建detail.js。基本代码如下：
```
import { withRouter } from "next/router";
import Layout from "../components/layout";
import React from "react";

class Detail extends React.Component {
  render() {
    const props = this.props;
    return (
      <Layout>
        <h1>{props.router.query.title}</h1>
        <p>this is the blog detail content.</p>
      </Layout>
    )
  }
}
export default withRouter(Detail);
```
  如上代码我们通过 withRouter 将next的router作为一个prop注入到component中，实现对url参数的访问。

  因此当我们访问：http://localhost:3000/ 的时候，显示如下结果：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/73.jpg" /> <br />

  当我们点击其中的第一项的时候，进入详情页面，我们显示如下结果：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/74.jpg" /> <br />

  如上我们使用 query string 可以实现页面间的传值，但是使用这种方式会导致页面的url不太友好，尤其是当页面传递多个参数的时候。因此 next.js 提供了 Route Masking这个特性用于路由的美化。

#### 3.2）路由伪装 (Route Masking)

  路由伪装是指让浏览器地址栏显示的url和页面实际访问的url不一样。在next.js中通过Link组件的as属性 告诉浏览器href对应显示什么url即可；
  pages/index.js 代码改成如下：
```
import Layout from "../components/layout";
import Link from "next/link";

const DetailLink = (props) => (
  <li>
    <Link href={`/detail?title=${props.title}`} as={`/p/${props.id}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);

const Index = () => (
  <Layout>
    <h1>My Blog</h1>
    <ul>
      <DetailLink title="Hello next.js" id="111000" />
      <DetailLink title="next.js is awesome" id="222000" />
      <DetailLink title="index.js 页面" id="333000" />
    </ul>
  </Layout>
)

export default Index;
```
  如上代码我们点击 Hello next.js 项的时候就能进入 详情页 http://localhost:3000/p/111000 这样的地址了.
  如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/75.jpg" /> <br />

  当我们点击 next.js is awesome 的时候，我们也一样可以进入 详情页，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/76.jpg" /> <br />

  如上我们可以伪装 history 前进和后退很友好，但是当我们刷新页面的时候 结果发现页面 404了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/77.jpg" /> <br />

  这是因为刷新页面会直接向服务器请求这个url，而服务器端并没有该url对应的页面，所以报错。为了解决这个问题，需要使用到next.js提供的自定义服务接口。

#### 4）理解自定义服务接口

  自定义服务接口前我们需要创建服务器，安装Express。
```
npm install --save express
```
  然后在项目的根目录下创建 server.js 文件，代码如下：
```
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    server.get('*', (req, res) => {
      return handle(req, res);
    });
    server.listen(3000, (err) => {
      if (err) {
        throw err;
      }
      console.log('server on http://localhost:3000');
    });
  }).catch((e) => {
    console.error(e.stack);
    process.exit(1);
});
```
  然后将package.json里面的dev script改为：
```
{
  "scripts": {
    "dev": "node server.js"
  },
}
```
  然后我们运行命令 npm run dev 后项目和之前是一样的。打开 http://localhost:3000/ 地址后一样可以访问到页面。
  现在我们需要添加路由将被伪装过到url和真实的url匹配起来，在 server.js 添加如下代码：
```
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    // 处理localhost:3000/p/111000 路由的代码
    server.get("/p/:id", (req, res) => {
      const actualPage = "/detail";
      const queryParams = { title: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });
    
    server.get('*', (req, res) => {
      return handle(req, res);
    });
    server.listen(3000, (err) => {
      if (err) {
        throw err;
      }
      console.log('server on http://localhost:3000');
    });
  }).catch((e) => {
    console.error(e.stack);
    process.exit(1);
});
```
  然后我们再运行 npm run dev 的时候，进入详情页，再刷新页面，就会保留页面，并且渲染出页面对应的数据了。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/78.jpg" /> <br />

  但是这里有个小问题是：前端路由打开的页面和后端路由打开的页面的title不一样，这是因为后端路由传过去的是id，而前端路由页面显示的是title。该问题在实际项目中可以
避免的，因为在实际项目中我们一般会通过id来获取到title，然后再显示出来。

#### 注意：如果我们使用最新版的 next的话，那么 app.render(req, res, actualPage, queryParams); 这样传递参数就 传递不过去了。因此这里我改成 next "next": "^6.1.1", 这个版本的，可以7+版本以上改掉了传递参数的方式。

#### 5) 远程数据获取

  next.js 提供了一个标准的获取远程数据的接口：getInitialProps, 通过 getInitialProps 我们可以获取到远程数据并赋值给页面的props。getInitialProps 即可以使用在服务端，也可以使用在客户端。

  首先，我们安装isomorphic-unfetch，它是基于fetch实现的一个网络请求库：
```
npm install --save isomorphic-unfetch
```
  然后修改 pages/index.js 代码如下：
```
import Layout from "../components/layout";
import Link from "next/link";
import fetch from 'isomorphic-unfetch';

const Index = (props) => (
  <Layout>
    <h1>My Blog</h1>
    <ul>
      {
        props.shows.map(({show}) => {
          return (
            <li key={show.id}>
              <Link as={`/p/${show.id}`} href={`/detail?id=${show.id}`}>
                <a>{show.name}</a>
              </Link>
            </li>
          )
        })
      }
    </ul>
  </Layout>
);

Index.getInitialProps = async function () {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=marvel');
  const data = await res.json();
  return {
    shows: data
  }
}
export default Index;
```
  如上代码我们在 getInitialProps 中获取到数据并且返回，因此我们在Index的props就可以拿到数据了，再遍历渲染成列表。如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/79.jpg" /> <br />

  现在我们来看详情页，我们在 server.js 中的代码改成如下：
```
const server = express();
// 处理localhost:3000/p/111000 路由的代码
server.get('/p/:id', (req, res) => {
  // const queryParams = { title: req.params.id };
  const queryParams = { id: req.params.id };
  app.render(req, res, '/detail', queryParams);
});
```
  然后我们在详情页通过将id作为参数去获取数据，因此我们的 pages/detail.js 代码改成如下：
```
import fetch from "isomorphic-unfetch";
import Layout from "../components/layout";

const Detail = (props) => (
  <Layout>
    <h1>{props.show.name}</h1>
    <p>{props.show.summary && props.show.summary.replace(/<[/]?p>/g, '')}</p>
    <img src={props.show.image.medium} />
  </Layout>
);

Detail.getInitialProps = async function (context) {
  const { id } = context.query;
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const show = await res.json();
  return { show };
}

export default Detail;
```
  重启项目，从列表页进入详情页, 如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/80.jpg" /> <br />

#### 6）添加样式

  我们可以给我们的网站添加一些样式，让它变得更好看，添加样式主要有如下2种方式：

  1）使用传统的CSS文件（包括SASS，PostCSS等）
  2）在JS文件中插入css

  nextJS内部默认使用 styled-jsx框架向js文件中插入css，这种方式引入的样式在不同组件之间不会相互影响，甚至父子组件之间都不会相互影响。

#### styled-jsx

  现在我们看如何在我们的文件中使用 styled-jsx，将我们的 pages/index.js 内容改为如下：
```
import Layout from "../components/layout";
import Link from "next/link";
import fetch from 'isomorphic-unfetch';

const Index = (props) => (
  <Layout>
    <h1>My Blog</h1>
    <ul>
      {
        props.shows.map(({show}) => {
          return (
            <li key={show.id}>
              <Link as={`/p/${show.id}`} href={`/detail?id=${show.id}`}>
                <a>{show.name}</a>
              </Link>
            </li>
          )
        })
      }
    </ul>
    <style jsx>
      {`
        *{
          margin: 0;
          padding: 0;
        }
        h1 {
          color: red;
        }
      `}
    </style>
  </Layout>
);

Index.getInitialProps = async function () {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=marvel');
  const data = await res.json();
  return {
    shows: data
  }
}
export default Index;
```
  如上样式：<style jsx> 可以理解为我们内链样式，添加样式后，我们就可以看到我们的页面生效了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/81.jpg" /> <br />

  我们可以按照上面的方式添加更多的样式。

#### 6.2）添加全局样式

  要添加全局样式的话，我们只需要在 style-jsx标签上增加 global 关键词就行了，因此我们修改 components/layout.js 如下：
```
import Header from "./header";
import Footer from "./footer";

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: "1px solid #DDD"
};

const Layout = (props) => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
    <style jsx global>
      {`
        a {
          color: blue;
        }
      `}
    </style>
    <Footer />
  </div>
)

export default Layout;
```
  因此页面上所有a标签的颜色将会变成为蓝色。

#### 7）部署 next.js 应用

  部署之前我们首先需要为生产环境build项目，因此需要在package.json中添加script；如下：
```
"build": "next build"
```
  然后我们需要能启动项目来serve我们的build内容，因此在package.json中添加script；如下：
```
"start": "next start"
```
  然后依次执行：
```
npm run build
npm start
```
  build完成之后的内容会生成到 .next 文件夹内，npm start 之后，我们访问的实际上就是 .next文件夹的内容。

  script 打包命令如下：
```
"scripts": {
  "dev": "node server.js",
  "build": "next build",
  "start": "next start"
},
```

#### 8) 部署并使用自定义服务

  我们将start script修改为如下：
```
"start": "NODE_ENV=production node server.js"
```
  这样我们就解决了自定义服务的部署，重启项目后刷新详情页也是能够正常访问的了。

### 源码请查看 <a href="https://github.com/kongzhi0707/next-server-render">点击这里</a>





















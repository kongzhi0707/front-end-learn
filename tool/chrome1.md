
### 理解 chrome 扩展程序（一）

chrome 扩展（Chrome Extension）是指更底层浏览器功能扩展，可以为chrome浏览器定制小型软件程序，使用户可以根据个人需要或偏好来定制chrome功能和行为。它基于web技术（比如HTML，JavaScript和CSS）构建。他们在单独的沙盒执行环境中运行，并且和Chrome浏览器交互。

扩展程序主要有如下几部分组成：

1）Manifest(清单文件)。
2）Background Script （后台脚本）
3）UI Elements （页面元素）
4）Content Script （内容脚本）
5）Options Page

#### 一) manifest.json

扩展文件都会有一个 mainfest 清单文件，清单文件必须命名为 manifest.json， 为浏览器提供扩展程序的相关信息，比如使用了哪些文件和该扩展程序可以使用哪些功能。必须放在项目的根目录，其中 manifest_version，name，version 是必不可少的。

一个基本的 manifest 文件结构如下：

{
  "name": "extension", // 插件名字
  "description": "简单的Chrome扩展demo", // 插件描述
  "manifest_version": 3, // 使用版本，目前已经升级到 3
  "version": "1.0", // 插件版本
  // 图标，有时候偷懒全部用同一个尺寸也没有问题
  "icons": {
		"16": "img/icon.png",	// 扩展程序页面上的图标
		"32": "img/icon.png",	// Windows计算机通常需要此大小。提供此选项可防止尺寸失真缩小48x48选项。
		"48": "img/icon.png",	// 显示在扩展程序管理页面上
		"128": "img/icon.png"	// 在安装和Chrome Webstore中显示
	},
  "action": {
    "default_icon": "img/activeIcon.png", // 插件展示的图标
    "default_title": "Tool", // 插件展示标题
    "default_popup": "./html/popup.html",  // 可选, 点击插件展示的小窗口，也可以监听点击事件，渲染页面
  },
  // 注册后台脚本
  "background": {
    "page": "background/background.html",
		"scripts": ["background.js"],
		// 推荐
		"persistent": false
  },
  // 浏览器右上角图标设置，browser_action，page_action，app 必须三选一
  "browser_action": {
    "default_icon": "img/icon.png",	 // 特定于工具栏的图标，至少建议使用16x16和32x32尺寸，应为方形，
    "default_title": "悬浮在工具栏插件图标上时的tooltip内容",
		"default_popup": "popup.html"	
  },
  // 需要注入到页面的JS/css
  "content_scripts": [
    {
      "js": [ "contentScript.js" ], // 多个js按顺序注入
      "css": ["custom.css"],
      // 匹配
      "matches": [ "http://*/*", "https://*/*" ],
      // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
		  "run_at": "document_start"
    }
  ],
  // 插件需要申请的权限，重要
  "permissions": [
    "cookies", // cookie
    "background",
    "contextMenus", // 右键菜单
		"tabs", // 标签
    "notifications", // 通知
		"webRequest", // web请求
    "storage", // 插件本地存储
    "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
		"https://*/*" // 可以通过executeScript或者insertCSS访问的网站
  ],
  // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
  "web_accessible_resources": [ "dist/*", "dist/**/*" ],

  // 插件主页
	"homepage_url": "https://www.baidu.com",

  // 覆盖浏览器默认页面
	"chrome_url_overrides": {
		// 覆盖浏览器默认的新标签页
		"newtab": "newtab.html"
	},

  // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
	"omnibox": { "keyword" : "go" },

	// 默认语言
	"default_locale": "zh_CN",

  // devtools页面入口，注意只能指向一个HTML文件，不能是JS文件
	"devtools_page": "devtools.html"
}

#### 1）icons

extension 程序的图标，可以有一个或多个。
48x48 的图标用在extensions的管理界面(chrome://extensions)；
128x128 的图标用在安装extension程序的时候；
16x16 的图标当作 extension 的页面图标，也可以显示在信息栏上。
图标一般为PNG格式, 因为最好的透明度的支持，不过WebKit支持任何格式，包括BMP，GIF，ICO等。

#### 2）browser_action 与 page_action

浏览器按钮(browser_action) 和 页面按钮 (page_action)，许多扩展程序以 浏览器按钮 或 页面按钮 的形式向 Chrome 浏览器增加用户界面，每个扩展程序最多能有一个浏览器按钮或页面按钮。当扩展程序和大部分网页相关时选择使用浏览器按钮， 当扩展程序的图标显示还是消失取决于网页时选择使用页面按钮。 换句话说，浏览器按钮可以适用于任何页面，页面按钮只能作用于某一个页面。他们之间的区别是：浏览器按钮一般在右上角工具栏上。页面按钮可以控制显示还是隐藏。

如下图所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/tool/chrome/1.png" />

#### 3）default_popup

当用户点击扩展程序图标时，可以设置弹出一个popup页面，而这个页面中自然是可以有运行的js脚本的(比如叫popup.js)。它会在每次点击插件图标--popup页面弹出时，重新载入。

#### 4）permissions

在 background(后台脚本)里使用一些chrome api时，需要授权才能使用，比如使用 chrome.tabs.xxx 的api，就要在 permissions 引入 "tabs".

#### 5) web_accessible_resources

允许扩展外的页面访问的扩展内指定的资源。换句话说，扩展是一个文件夹A的，别人的网站是一个文件夹B，B要看A的东西，需要获得权限，而写在这个属性下的文件，就是授予了别人访问的权限。

#### 二）background script

background 可以理解为插件运行在浏览器中的一个后台网站/脚本。但是它与当前浏览的页面无关的。该配置对应 manifest.json 中的 background 配置项。
它有如下几个配置：

#### 1）page

page 可以理解为这个后台网站的主页，在这个主页中，有引用的脚本，一般会有一个专门来管理插件各种交互以及监听浏览器行为的脚本。我们一般给它起名为 background.js。

#### 2）scripts

该脚本其实和写在page里的html引入的脚本目的是一样的。page在html没有的情况下，那么脚本可以通过这个属性引入。如果page存在的话，一般在这里引入的脚本是专门为该插件服务的脚本，而其他的第三方脚本，比如jquery等一般是在 page里面引用比较好。

#### 3）persistent

所谓后台脚本，在chrome扩展中又可以分为两类，分别运行在后台页面(background page) 和 事件页面（event page）中。两者区别在于：

后台页面(background page)：持续运行，生成周期和浏览器相同，即从打开浏览器到关闭浏览器期间，后台脚本一直在运行，一直占据着内存等系统资源，因此 persistent设为true；

事件页面（event page）： 只在需要活动时运行，在完全不活动的状态持续几秒后，chrome将会终止其运行，从而释放其占据的系统资源，而在再次有事件需要后台脚本来处理时，重新载入它，persistent设为false；

#### 三）content script

这部分脚本，就是插入到网页中的脚本(虽然名为script，其实还可以包括css的)。借助 content-scripts 我们可以实现通过配置的方式轻松指定页面注入js和css。
如下配置：

// 需要注入到页面的JS/css
"content_scripts": [
  {
    "js": [ "js/jquery-1.8.3.js", "js/content-script.js" ], // 多个js按顺序注入
    "css": ["custom.css"],
    // 匹配 如果值为：["<all_urls>"] 表示匹配所有地址
    "matches": [ "http://*/*", "https://*/*" ],
    // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
    "run_at": "document_start"
  }
],

#### 注意：如果我们没有主动指定 run_at 为 document_start（默认为document_idle）， 下面这种代码是不会生效的：

document.addEventListener('DOMContentLoaded', function() {
	console.log('我被执行了！');
});

1）js/css: 要插入到页面里的脚本或css样式。
2）matches: 必须：匹配规则组成的数组，用来匹配页面的url的，符合条件的页面将会插入js的脚本。
3）run_at: js/css 配置项里的脚本如何插入到页面里的，该配置项用来控制插入时机。有如下三个选项：

document_start: 是指 style 样式加载好，dom渲染完成和脚本执行前。
document_end: dom渲染完成后，即 DOMContentLoaded 后马上执行。
document_idle: 在 DOMContentLoaded 和 window.load 之间，具体什么时刻，要看页面的复杂程度和加载时间。并针对页面加载速度进行了优化。

#### 开发第一个 Chrome 扩展程序

我们可以先做一个制定页面 (developer.chrome.com) 更换背景颜色的 chrome 扩展程序。

#### 1) 创建文件目录结构如下：

｜--- background.js
｜--- images
｜ |--- get_started128.png
｜ |--- get_started48.png
｜ |--- get_started32.png
｜ |--- get_started16.png
｜--- manifest.json
｜--- popup.html
｜--- popup.js

#### 2) 创建 manifest.json 清单文件

{
  "name": "Getting Started Example",
  "version": "1.0",
  "description": "Build an Extension!",
  "manifest_version": 3,
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  }
}

#### 3) 编写后台脚本

如上在 manifest.json 清单文件中添加了 background 字段中添加脚本文件的文件名为 background.js.

#### 3.1）注册监听事件

扩展程序会扫描注册文件中需要侦听的事件，在background.js 文件中加入 runtime.onInstalled onInstalled监听器，然后使用 storage API 再全局存储一个
color变量。

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
});

#### 3.2) 注册权限

因为我们使用了 storage API, 因此我们必须在 manifest.json  文件中注册后才能使用；

"permissions": ["storage"],

因此 manifest.json 文件变为如下：

{
  "name": "Getting Started Example",
  "version": "1.0",
  "description": "Build an Extension!",
  "manifest_version": 3,
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "permissions": ["storage"],
}

#### 四：引入用户界面

扩展程序可以有多种引入用户页面的方式，这里我们使用弹出窗 popup，在 mainfest.json 中的 page_action 字段中添加 "default_popup"字段和 default_icon 字段添加icon。 manifest.json 配置文件如下：

{
  "name": "Getting Started Example",
  "version": "1.0",
  "description": "Build an Extension!",
  "manifest_version": 3,
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "permissions": ["storage"],
  "page_action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/get_started16.png",
      "32": "images/get_started32.png",
      "48": "images/get_started48.png",
      "128": "images/get_started128.png"
    }
  },
}

popup.html 文件内容如下，最基础的一个html文件，只包含了一个button按钮。我们的目的是点击这个按钮，就能改变网页的背景颜色。

<!DOCTYPE html>
<html>
  <head>
    <style>
      button {
        height: 30px;
        width: 30px;
        outline: none;
      }
    </style>
  </head>
  <body>
    <button id="changeColor"></button>
  </body>
</html>

#### 五：增加弹出框展示规则

我们在后台脚本会增加一条展示规则：在 host 等于 developer.chrome.com 时展示 popup 的页面。因为我们使用了 declaractiveContent api， 因此我们还需要在脚本文件中注册权限。

在 background.js 代码变成如下：

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

重新加载后我们会发现，只有在 developer.chrome.com 的host图标是亮的，其他 host 下是置灰的。

#### 六：获取后台脚本存储的变量

我们需要获取从后台脚本文件中设置到 storage 中的 color 变量，更换 popup 中 button 的颜色，然后点击 button，更换当前页面的背景颜色。

因此我们需要创建一个 popup.js ，并且在 popup.html 引入，引入方式和正常网页开发一样引入即可：

'use strict';
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function (data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function (element) { 
  let color = element.target.value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { 
    console.log('color', color);
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: 'document.body.style.backgroundColor ="' + color + '"' }
    );
  })
}

我们使用了 chrome 的 tabs 的 api， 因此我们需要在 manifest.json 中获取 activeTab 的权限。





















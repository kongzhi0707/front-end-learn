### APP 与 H5 通信

#### 一）第一种方法 JsBridge

#### 背景

在移动开发领域，原生应用嵌入网页(H5)可以实现一套代码多端使用，原生应用 APP 和网页 H5 之间要如何通信呢？

JsBridge 作为一种实现此类通信的工具，用于实现原生应用和嵌入其中的网页之间的通信。

H5 和 native 交互

```
1）Javascript 调用 native 方法。
2）native 调用 JavaScript 方法。
```

#### JavaScript 调用 native 方法有两种方式：

1）注入: native 往 webview 的 window 对象中添加一些原生方法，h5 可以通过注入的方法来调用 app 的原生能力。
2）拦截: H5 通过与 native 之间的协议发送请求，native 拦截请求 再去调用 app 的原生能力。

实现方式：

1）初始化 WebViewJavascriptBridge 对象；

对于 Android，如果 WebViewJavascriptBridge 对象已经存在，则直接使用；如果不存在，则在 WebViewJavascriptBridgeReady 事件触发时获取 WebViewJavascriptBridge 对象。

对于 IOS，如果 WebViewJavascriptBridge 对象已经存在，直接使用，如果不存在，则创建一个隐藏的 iframe 来触发 WebViewJavascriptBridge 的初始化，并在初始化完成后通过 WVJBCallbacks 回调数组来获取 WebViewJavascriptBridge 对象。

2）注册事件：

提供了 callHandler 和 registerHandler 两个方法，分别用于在 js 中调用 APP 端的方法 和 注册供 APP 端调用的 JS 方法。

3）调用方法：

当 APP 或 JS 需要调用对方的方法时，只需调用 callHandler 和 registerHandler 方法即可。

基本的代码类似如下：

```
const { userAgent } = navigator;
const isAndroid = userAgent.indexOf('android');

// 与安卓交互
function androidFn(callback) {
  if (window.webViewJavascriptBridge) {
    callback(window.webViewJavascriptBridge);
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', () => {
      callback(window.webViewJavascriptBridge);
    }, false);
  }
}

// 与IOS交互
function iosFn(callback) {
  if (window.webViewJavascriptBridge) {
    return callback(window.webViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => { document.documentElement.removeChild(WVJBIframe); }, 0);
}

const setupWebViewJavascriptBridge = isAndroid ? androidFn : iosFn;

if (isAndroid) {
  setupWebViewJavascriptBridge((bridge) => {
    // 注册 H5 界面的默认接收函数（与安卓交互时，不注册这个事件无法接收回调函数）
    bridge.init((message, responseCallback) => {
      responseCallback('JS 初始化');
    });
  });
}

export default {
  // js调APP方法 （参数分别为:app提供的方法名  传给app的数据  回调）
  callHandler(name, params, callback) {
    setupWebViewJavascriptBridge((bridge) => {
      bridge.callHandler(name, params, callback);
    });
  },

  // APP调js方法 （参数分别为:js提供的方法名  回调）
  registerHandler(name, callback) {
    setupWebViewJavascriptBridge((bridge) => {
      bridge.registerHandler(name, (data, responseCallback) => {
        callback(data, responseCallback);
      });
    });
  },
};
```

#### H5 使用

h5 获取 app 返回的数据：

```
jsBridge.callHandler('getAppUserInfo', { title: '首页' }, (data) => {
  console.log('获取app返回的数据', data);
});
```

app 获取 h5 返回的数据:

```
jsBridge.registerHandler('getInfo', (data, responseCallback) => {
  console.log('打印***get app data', data);
  responseCallback('我是返回的数据');
});
```

两者都可通信，只要一方使用 registerHandler 注册了事件，另一方通过 callHandler 接收数据。

也可以看我之前的 <a href="https://www.cnblogs.com/tugenhua0707/p/4550228.html">webview 与 js 的交互文章</a>

#### 二）第二种方法使用 postMessage

原生 App 和 h5 直接可以使用 jsBridge 进行通信，也可以使用 postMessage 进行通信。

以安卓为列；

1. 接收 APP 消息：

```
// 安卓端
webView.loadUrl("javascript:window.postMessage('Hello H5 OnClick', '*');");


// H5 监听来自App的消息
window.addEventListener('message', (event) => {
  console.log('Received message from App:', event.data);
});
```

2. 发送消息到 APP：

```
// H5发送
const message = {
  data: 'h5 send',
};
const url = `/sendMsg/${encodeURIComponent(JSON.stringify(message))}`;
window.location.href = url;


// 安卓端
@Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
  LogUtils.e("shouldInterceptRequest", request.getUrl().toString());
  return super.shouldInterceptRequest(view, request);
}
```

注意：在使用 postMessage 时，需要指定消息的来源 origin，以确保安全性。另外，为了确保消息的接收方能够正确接收到消息，最好在发送消息之前确保目标窗口已经加载完成。

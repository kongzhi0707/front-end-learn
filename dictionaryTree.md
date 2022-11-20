
### js字典树-实现搜索

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/node1.png" /> <br />

  如上图， 想要实现百度这样的搜索引擎关键字提示功能，我们该要怎么做呢？我们可以使用一种数据结构 字典树来实现类似的功能。

  字典树结构如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/node2.png" /> <br />

  比如我们输入 hello hi her how see so 这些单词就会构成一颗字典树， 如上我们发现字典树是从第二层的根节点出发， 到每一个叶子节点的路径上面的字母就是一个单词。

  如下图详细过程：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/node3.png" /> <br />

  如上图，当我们加入某个单词的时候，我们从字典树的第一个字母的根节点出发，查询下一层是否存在这个字母，如果存在那么就会沿着这个节点往下走，并且处理下个字母，如果不存在，那么就会添加一个新的节点，并且沿着这个新节点继续处理下一个字母。

  字典树的优点是：字典树对于查询前缀相同的字符串十分高效。

  比如我们查询 前缀为 k 的字符时，从k到每个叶子节点就是一个单词，这就是我们搜索引擎的提示功能。比如我们输入k字符时，那么每一个节点就会存储两个东西。
```
1）当前节点的value。
2）一个数组(26位)， 因为每个节点最多会有26个字符(a-z), 因此我们可以使用下标0来存储a字符，25来存储z字符。
```
代码如下：
```
class NodeTree { 
  constructor(value) { 
    this.childNode = new Array(25).fill(null); // 初始化，假设我们输入的是小写字母
    this.value = value;
  }
}
export default class TrieTree { 
  constructor() { 
    this.root = new NodeTree('/'); // 假设以 / 开头的 Trie 树
  }
  getPos(ch) { 
    return ch.charCodeAt() - "a".charCodeAt();
  }
  // 被添加的字符串
  add(str) { 
    let curNode = this.root; // 获取node
    while (curNode !== null) { 
      let firstChar = str[0] || "";
      if (!firstChar || str === '') { // 说明已经插入完成了
        break;
      } else { 
        str = str.slice(1); // 当前的第一个字符已经插入到字典树了
        const pos = this.getPos(firstChar); // 获取存放的位置
        console.log('---pos----', pos);
        const newNode = new NodeTree(firstChar); // 生成新的节点
        if (!curNode.childNode[pos]) {
          curNode.childNode[pos] = newNode; // 如果当前节点不存在，将新节点挂上
          curNode = newNode;
        } else { // 如果当前节点有，那么就需要将 curNode = curNode.childNode[pos];
          curNode = curNode.childNode[pos];
        }
      }
    }
  }
  // 查询有多少个字符串以 prefixStr 为前缀
  findPrefix(prefixStr) { 
    let curNode = this.root;
    let firstChar = prefixStr[0];
    if (prefixStr === '') { 
      return [];
    }
    while (true) { 
      if (curNode === null) { 
        return []; // 匹配失败
      }
      curNode = curNode.childNode[this.getPos(firstChar)];
      prefixStr = prefixStr.slice(1);
      if (prefixStr === '') {  // 说明 prefixStr 已经全部匹配完成了
        break;
      }
      firstChar = prefixStr[0];
    }
    // 匹配成功，curNode.value 就是 prefixStr 的最后一个字符，因此 curNode.childNode 字符是我们想要的
    return curNode ? this.deepFind(curNode) : [];
  }
  // 深度优先搜索去查找所有的字符串
  deepFind(node, curStr = "", ans = []) { 
    let flag = false;
    for (const next of node.childNode) { 
      if (next !== null) { 
        flag = true; // 说明还有字符
        this.deepFind(next, curStr + next.value, ans);
      }
    }
    if (!flag) { // 表示此为叶子节点
      ans.push(curStr);
    }
    return ans;
  }
}
```
  react 代码调用如下：
```
import React from 'react';
import TrieTree from './Tree';

export default class Input extends React.Component { 
  constructor(props) { 
    super(props);
    this._trieTree = new TrieTree(); 
    this.state = {
      value: '',
      point: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange(ev) { 
    this.setState({
      value: ev.target.value
    }, () => { 
      this.setState({
        point: this._trieTree.findPrefix(this.state.value) // 将查询的结果保存下来
      })
    })
  }
  handleClick() { 
    this._trieTree.add(this.state.value); // 将查询的值保存
  }
  render() { 
    return (<div>
      <label htmlFor='input'>请输入查询内容</label>
      <input id="input" placeholder='请输入关键字' value={this.state.value} onChange={(ev) => { this.handleChange(ev) }} />
      <input type="submit" onClick={this.handleClick} />
      <ul>
        {
          this.state.point.map((item, index) => {
            return (<li key={index}>{ this.state.value + item}</li>)
          })
        }
      </ul>
    </div>)
  }
}
```
  当我们先输入kongzhi的时候，然后点击 submit 提交按钮， 当我们再输入 k 的时候， 如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/x1.png" /> <br />

  当我们输入 kxxx 的时候，点击submit按钮，当我们再输入 k 的时候，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/x2.png" /> <br />

  字典树虽然很好，但是它内存消耗非常大.








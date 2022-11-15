
### js字典树-实现搜索

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/node1.png" /> <br />

如上图， 想要实现百度这样的搜索引擎关键字提示功能，我们该要怎么做呢？我们可以使用一种数据结构 字典树来实现类似的功能。

字典树结构如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/node2.png" /> <br />

比如我们输入 hello hi her hoow see so 这些单词就会构成一颗字典树， 如上我们发现字典树是从第二层的根节点出发， 到每一个叶子节点的路径上面的字母就是一个单词。

如下图详细过程：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/images/node2.png" /> <br />

如上图，当我们加入某个单词的时候，我们从字典树的第一个字母的根节点出发，查询下一层是否存在这个字母，如果存在那么就会沿着这个节点往下走，并且处理下个字母，如果不存在，那么就会添加一个新的节点，并且沿着这个新节点继续处理下一个字母。

字典树的优点是：字典树对于查询前缀相同的字符串十分高效。

比如我们查询 前缀为 k 的字符时，从k到每个叶子节点就是一个单词，这就是我们搜索引擎的提示功能。比如我们输入k字符时，那么每一个节点就会存储两个东西。

1）当前节点的value。
2）一个数组(26位)， 因为每个节点最多会有26个字符(a-z), 因此我们可以使用下标0来存储a字符，25来存储z字符。








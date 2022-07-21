
### git init 和 git init --bare的区别

  git init 和 git init --bare 两个命令都是初始化一个空的git仓库。那么他们两者具体有什么区别呢？

#### git init

  我们初始化本地仓库时，使用 git init; 建立一个标准的Git仓库。
```
$ git init demo1
Reinitialized existing Git repository in /Users/tugenhua/个人/learn/git/demo1/.git/

$ cd demo1
$ cd .git
$ ls
```
执行完上面的命令后，看到该 .git 目录下有如下文件：
```
HEAD，config，description，hooks，info，objects，refs;
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/git/images/11.png" /> <br />

#### git init --bare 
```
$ git init --bare demo2
$ cd demo2
$ ls
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/git/images/12.png" /> <br />

如上可以看到，初始化的目录结构不一样，加了 bare 参数后不会在根目录下生成 .git 文件夹。而把 .git 下面的所有文件直接拿到根目录来了。

#### 功能差异

  加上bare参数创建的仓库一般叫 "裸仓库"。它里面没有工作区的概念。也就是说我们不能直接在该仓库下进行正常的git命令操作。反之，不加bare参数创建的仓库就可以直接在上面进行git操作。
```
  git init: 适用于本地仓库初始化，有完整的git命令，可以提交代码。
  git init --bare: 适用于远程仓库初始化，默认没有工作空间的。
```
  git init --bare 适用于远程仓库，没有工作空间，只提供版本管理的Git，但是如果我们远程初始化 裸仓库后，想看默认分支的工作空间具体项目文件该怎么办？ 我们可以配合git工具下的hook。


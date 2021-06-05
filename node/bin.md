### 理解package.json 中的 bin字段

  在package.json中有个bin字段配置，比如如下:
```
bin: {
  xx: './bin/index.js'
}
```
  xx中的 可执行文件 可以是js文件或无扩展名的文本文件，并且文件的开头第一行是 "#!/usr/bin/env node"; 是告诉系统使用node来进行解析。在安装对应的包时npm就会根据bin配置生成对应的脚本(bat或shell)。如果可执行文件的第一行不是 "#!/usr/bin/env node"; 则生成的脚本文件只是简单的指向bin配置的可执行文件。

#### 全局安装：如果我们是全局安装，npm将会使用符号链接把这些文件链接到 /usr/local/bin/ 中。因此我们可以执行使用命令 xx 来执行我们的代码; 
#### 本地安装：如果我们是本地安装，会被链接到本地的 ./node_modules/.bin/ 中。

  举个列子来说：

  1. 在项目的根目录下创建 package.json文件，并且配置bin字段。
  package.json 代码如下：
```
"bin": {
  "xx": "./bin/index.js"
},
```
  2. 在和package.json同级目录下创建bin目录，在bin目录下新增index.js 文件。基本代码如下：
```
#!/usr/bin/env node
console.log('hello world');
```
  3. 运行 sudo npm link 命令，可以将我们的任意位置的npm包链接到全局可执行环境中，从而在任意位置使用命令 xx 都可以直接运行该npm包。控制台就会输出 hello world。





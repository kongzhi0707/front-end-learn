
### 使用npm命令行更新版本号

#### 一) 使用npm命令行更新版本号

  优势: 我们平时做CI/CD工具时, 使用npm命令来更新版本号是非常有用的. 我们平时在发布的过程中,都是基于人手直接修改 package.json 文件中的 version 字段来实现版本的更新. 现在我们可以基于 npm 命令来实现自动化更新了. 执行如下命令会自动更新 package.json 中的version字段的版本号, 且会打出对应的 tag, 比如 v1.0.1这个的tag. 因此在自动化工具的时候, 我们可以使用该命令实现自动化打tag和版本号更新.

  前端目前的代码包管理工具npm, 本身就有提供命令工具帮助我们解决版本升级的工作, 下面是代码基本语法:
```
$ npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]
```
  使用的规则也是遵循语义化版本号公约而设计，npm官方实践的细节可看 sermver.

  下面关于版本选项的描述 (假如现在默认的版本是 0.2.0)

|  选项       | 描述                                   | 列子                    |  说明                                |
|------------|----------------------------------------|------------------------|-------------------------------------|
| major      | 重大更新版本                             | npm version major      | 0.2.0 -> 1.0.0                      |
| minor      | 主要更新版本                             | npm version minor      | 0.2.0 -> 0.3.0                      |
| patch      | 补丁更新版本                             | npm version patch      | 0.2.0 -> 0.2.1                      |
| premajor   | 重大更新预发布版本                        | npm version premajor   | 0.2.0 -> 1.0.0-0                    |
| preminor   | 主要更新预发布版本                        | npm version preminor   | 0.2.0 -> 0.3.0-0                    |
| prepatch   | 补丁更新预发布版本                        | npm version prepatch   | 0.2.0 -> 0.2.1-0                    |
| prerelease | 预发布版本                               | npm version prerelease | 当前版本不是预发布版本的会出错           |
| from-git   | 拿取git的tag作为版本号设置至 package.json  | npm version from-git   | git的tag标签没有设置的情况下，会抛出错误  |

#### 1.1) major: 主要目的升级主版本

比如我们现在的版本是 0.2.0, 当我们执行 npm version major 命令时, 版本号会从 0.2.0 升级到 1.0.0. 直接在主版本号加1, 其他位置都为0.

#### 1.2) minor: 主要目的是升级次要版本

比如我们现在的版本是 0.2.1, 当我们执行 npm version minor 命令时, 版本号会从 0.2.1 升级到 0.3.0, 直接在次版本号加1, 后面的版本号都为0.

#### 1.3) patch: 主要目的是升级补丁版本号

比如我们现在的版本号为 0.2.0, 当我们执行 npm version patch 命令时, 版本号会从 0.2.0 升级到 0.2.1, 布丁版本号加1.

#### 1.4) premajor: 直接升级主版本号, 次版本号 和 补丁版本号设置为0, 增加预发布号为0.

比如现在的版本号为 0.2.0, 那么当我们执行 npm version premajor 后, 版本号会从 0.2.0 升级到 1.0.0-0.

#### 1.5) preminor: 直接升级次版本号, 补丁版本设置为0, 增加预发版本号为0.

比如现在的版本号为 0.2.0, 那么当我们执行 npm version preminor 后, 版本号会从 0.2.0 升级到 0.3.0-0.

#### 1.6) prepatch: 直接升级补丁号, 增加预发布号为0.

比如现在的版本号为 0.2.0, 那么当我们执行 npm version prepatch 后, 版本号会从 0.2.0 升级到 0.2.1-0.

#### 1.7) prerelease

当我们只想 npm run prerelease 后, 如果没有预发布号, 则增加补丁版本号, 同时预发布号设置为0, 如果有 预发布号, 则 预发布号 增加1.
比如现在的版本是 0.2.0, 当我们执行 npm run prerelease 后, 则版本号就会变为 0.2.1-0; 当我们再次执行 npm run prerelease 后, 版本号就会变成为: 0.2.1-1. 以此类推....


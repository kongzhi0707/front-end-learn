
### React 搭建组件库

#### 1) 初始化项目

mkdir r-component-ui
cd r-component-ui
npm init -y
mkdir src && cd src && touch index.ts

#### 2) 代码规范

使用 <a href="https://github.com/umijs/fabric">@umijs/fabric</a> 的配置。

yarn add @umijs/fabric --dev

// 因为@umijs/fabric没有将prettier作为依赖 所以我们需要手动安装
yarn add prettier --dev 

##### .eslintrc.js

在项目的根目录下新建 .eslintrc.js，配置如下：

module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
};

##### .prettierrc.js

在项目的根目录下新建 .prettierrc.js，配置如下：

const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.prettier,
};

##### .stylelintrc.js

在项目的根目录新建 .stylelintrc.js，配置如下：

module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/stylelint')],
};

##### Commit Lint

进行 pre-commit 代码规范检测

yarn add husky lint-staged --dev

#### 进行 Commit Message 检测。

yarn add @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog --dev

在项目的根目录下 新增.commitlintrc.js写入以下内容：

module.exports = { extends: ['@commitlint/config-conventional'] };

##### package.json

package.json 写入如下内容：

{
  "scripts": {
    "commit": "git-cz",
  },
  "lint-staged": {
    "src/**/*.ts?(x)": [
      "prettier --write",
      "eslint --fix",
       "git add"
    ],
    "src/**/*.less": [
      "stylelint --syntax less --fix",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "lint-staged"
    }
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}

后面可以使用 yarn commit 代替 git commit 生成规范的 Commit Message。

#### 安装TypeScript

yarn add typescript --dev

在项目的根目录下新建 tsconfig.json，并添加如下配置：

{
  "compilerOptions": {
    "baseUrl": "./",
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react",
    "declaration": true,
    "declarationDir": "lib",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src", "typings.d.ts"],
  "exclude": ["node_modules"]
}

#### 新增组件

在 src 文件夹下 新建 alert 文件夹，目录结构如下：

｜--- src
｜ |--- alert
｜ | |--- index.tsx        # 源文件
｜ | |--- style
｜ | | |--- index.less     # 样式文件
｜ | | |--- index.ts       # 样式文件为什么存在 index.ts ，目的按需加载样式，管理样式依赖

安装 React 依赖

yarn add react react-dom @types/react @types/react-dom --dev # 开发时依赖，宿主环境一定存在
yarn add prop-types            # 运行时依赖，宿主环境可能不存在 安装本组件库时一起安装

src/alert/index.tsx 添加如下代码

import React from 'react';
import t from 'prop-types';

export interface AlertProps {
  kind?: 'info' | 'positive' | 'negative' | 'warning';
}

export type KindMap = Record<Required<AlertProps>['kind'], string>;

const prefixCls = 'happy-alert';

const kinds: KindMap = {
  info: '#5352ED',
  positive: '#2ED573',
  negative: '#FF4757',
  warning: '#FFA502',
};

const Alert: React.FC<AlertProps> = ({ children, kind = 'info', ...rest }) => (
  <div
    className={prefixCls}
    style={{
      background: kinds[kind],
    }}
    {...rest}
  >
    {children}
  </div>
);

Alert.propTypes = {
  kind: t.oneOf(['info', 'positive', 'negative', 'warning']),
};

export default Alert;














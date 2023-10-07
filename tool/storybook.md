### 理解 Storybook 组件库构建

#### 一) 什么是 Storybook ? 

Storybook 是一个开源的工具, 可以帮助前端开发者更好的构建, 测试和展示组件.
Storybook 可以做如下几件事情:
```
1) 为每个组件提供一个独立的页面, 可以快速展示或调试组件.
2) 管理多个组件, 按需展示和测试, 帮助开发者更好的理解和组织组件库.
3) 可以用各种状态(比如不同的 props 和 事件触发) 的快照测试组件, 保证在不同状态下组件的正确性.
4) 提供一些插件 (比如 addon-knobs) 可以方便的测试组件的可配置性.
5) 可以将组件的使用文档集成在一起, 让组件的使用者更好的理解组件的用法和API.
```
Storybook 是一个非常实用的工具, 它可以帮助前端开发者更好的管理和测试组件, 同时提高开发效率 和 代码质量.

#### 二) 项目搭建

本demo的项目搭建是基于 create-react-app 进行的搭建. 

1) 首先创建一个 React + Storybook 项目
```
npx create-react-app myapp --template typescript # 创建react项目
npx -p @storybook/cli sb init # 安装 storybook UI组件的开发环境
```
#### 三) Storybook 使用

Storybook 是UI 组件的开发环境, 它允许开发者浏览组件库, 查看每个组件的不同状态, 以及交互地开发和测试组件.
Storybook 在 app 之外运行, 这允许开发者独立地开发UI组件, 可以提高组件的重用性, 可测试性 和 开发速度. 可以快速构建, 而不必担心应用程序特定的依赖关系.

#### 安装
```
npx -p @storybook/cli sb init
```
构造完成后的文件夹主要有如下的改变:
```
|--- .storybook
| |--- main.ts      # 入口文件
| |--- preview.ts   # 页面展示, 全局资源配置
|
|--- src
| |--- stories               # 示列代码
| | |--- assets              # 静态资源文件
| | |--- buttion.css         # 按钮样式文件
| | |--- Button.tsx          # 按钮主文件
| | |--- Button.stories.ts   # 按钮文档页面
| | |--- Configure.mdx       # 欢迎介绍页面
```
上面的目录结构是自动生成的. 
如上, 当我们安装了 Storybook 后, 我们的src目录下会新增一个 stories 文件, 这个文件用来存放我们需要调试的组件, 以及本地生成文档的组件.

我们可以打开 src/stories/Button.stories.ts 文件可以看下源码, 
```
1) export default 导出当前组件的整个目录, title 为 menu 的名称, component 为当前的组件.
2) 一个文件中可以导出多个组件的类型, 比如还可以导出 Text;
3) export default 导出去的是一级目录, export 导出去的是二级目录.
```
#### storybook 常用插件介绍
```
1) @storybook/addon-actions 增加一个面板用于输出事件参数. 捕获组件事件, 将结果打印出来, 用来记录事件日志.
2) @storybook/addon-links: 页面跳转
3) @storybook/addon-info: 用于story信息展示, 包含当前展示的组件的代码.
4) @storybook/addon-knobs: 增加一个面板用于设置属性. 提供一套可以用来动态编辑展示组件属性的控件, 这样使用者可以在不改动代码的情况下学习组件使用.
5) @storybook/addon-storysource: 能够看到当前操作的组件对应的story代码(增加一个面板用于显示原本代码).
6) storybook-readme: 使用 markdown 文件 可以更加美观展示代码.
7) @storybook/addon-docs: 增加一个面板用于根据组件代码,注释, storybook 文件等整合为一个页面.
```
#### 核心文件

#### main.ts (该文件定义 Storybook 与编译相关的配置)
```
import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: [ // 组件 Stories 目录所在, -- Storybook 会载入配置路径下的指定文件渲染展示
    "../src/**/*.mdx", 
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [  // Storybook 所用插件, Storybook 功能增强
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: { // Storybook 所用的框架
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
};
export default config;
```
#### preview.ts (该文件引入全局依赖, 定义StoryBook渲染相关的配置)
```
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

#### 编写 stories

story 用于展示组件的某个状态,每个组件可以包含任意多个story, 用来测试组件的各种场景. 根据默认配置, 只需要在组件的文件夹中, 以 **.component.stories.ts 的格式创建即可.

story 语法

1) export default: 默认导出, 提供组件级别的配置信息, 比如以下配置会注明组件的归类, 并提供 Button 组件的信息, 以便渲染这个组件.
```
// Button.stories.ts

import { Button } from './Button';

export default {
  title: 'Example/Button',
  component: Button,
}
```
2) named export: 命名导出, 用以描述 story, 一个组件可以有多个story.
```
// Button.stories.ts

import { Button } from './Button';
// 创建一个模版, 方便在后续的 story 中复用
const Template = (args: Button) => ({
  props: args,
});

export const Primary = Template.bind({}); // 复制 Template
Primary.args = { background: '#ff0', label: 'Button' };
Primary.storyName = "主要状态"; // 自定义 story 名

export const Secondary = Template.bind({});
Secondary.args = {...Primary.args, label: 'xxxx' }; // 复用上一个 story 的配置

export const Third = Template.bind({});
Third.args = { ...Primary.args, label: 'yyyy' };
```
如上代码, 通过复制模版 function, 我们可以创建若干个story, 传入不同的参数, 就可以分别渲染出组件的不同状态.每个 story 的名字默认是 function
名, 也可以自定义.

#### Args (属性)

上面我们看到了怎么去写一个 Story 文件, 那么 上面的 args 是什么呢? 它代表组件的输入属性, 相当于 Vue/React 中的 props, 它有2个层级,方便灵活配置.

#### 1. story 层级
```
// Button.stories.ts
import { Button } from './Button';
const Template = (args: Button) => ({
  props: args,
});

// 在这个story中传入组件属性, 只会影响当前story
export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Primary',
};
```
#### 2. 组件层级
```
// Button.stories.ts

import { Button } from './Button';
// 组件层级(默认导出) 中传入组件属性
// 这个 Button 组件的所有 stories 的 primary 属性都会是true
export default {
  title: "Button",
  component: Button,
  args: {
    primary: true,
  }
}
```
#### 额外的配置项

除了组件写 story, 很多时候也会需要配置插件, 或给组件提供额外的功能.

#### Parameters (参数)

Parameters 用以配置 Storybook 和 插件, 具有全局, 组件, story 三个层级.

Story 拥有大量的插件, 下面是简单的 backgrounds 插件举列, 它用来控制组件容器的背景色.

1) 全局定义在根目录 .storybook/preview.ts 下, 会影响所有的 stories. 这样配置后, 每个 story 界面下 都可以选择 红/绿两色的背景;
```
// .storybook/preview.ts

export const parameters = {
  backgrounds: {
    values: [
      { name: 'red', value: '#f00' },
      { name: 'green', value: '#0f0' },
    ]
  }
}
```
2) 组件层级下定义, 会让这个组件的所有 stories 都可以选择指定的背景色
```
// Button.story.ts

export default {
  title: 'Button',
  component: Button,
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ]
    }
  }
}
```
3) story 层级下的定义只会影响当前story, 其他story就只能选择默认的颜色.
```
// Button.story.ts

import { Button } from './Button';
const Template = (args: Button) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
// 红绿背景只能在这个 story 下可以选择
Primary.parameters = {
  backgrounds: {
    values: [
      { name: 'red', value: '#f00' },
      { name: 'green', value: '#0f0' },
    ]
  }
}
```
Parameters 的配置是可以继承的, 同名的子级会覆盖父级的定义.

#### Decorators (装饰器)

每个 Decorator 也是 function, 用来包裹story, 保持原有的story不变的情况下, 额外给它添加额外的DOM元素, 引入上下文环境, 添加假数据等.

和 Parameters 一样, 它也可以定义在 全局/组件/story 三个层级中, 每个 Decorator 按定义顺序依次执行, 从全局到 story.

比如, 用一个额外的 <div> 包裹每个 story 的组件渲染.
```
// button.stories.ts

import { Meta, Story } from '@storybook/angular';
import { ListComponent } from './list.component';

export default {
  title: 'Example/List',
  component: ListComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="height: 60px">${story.template}</div>`,
      };
    }
  ]
} as Meta;
```
如上代码, 这个列表组件的所有 story, 都会展示出它在一个 60 像素高的容器内的呈现效果.

除了上面给组件包裹额外的元素, 还可以为复合组件添加组件依赖.
```
// List.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import List from './list.component';
import ListItem from './list-item.component'


// 给 list 组件添加它需要的组件和模块依赖
export default {
  title: 'List',
  component: List,
  decorators: [
    moduleMetadata({
      declarations: [ListItem],
      imports: [CommonModule],
    }),
  ],
};

const Template = (args: List) => ({
  component: List,
  props: args,
});
```
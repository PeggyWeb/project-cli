## 项目初始化工具

---

### Installation

```
create-tuju-project pName -t xxx

pName    项目名称下生成,默认走当前目录下生成tuju-project项目
-t xxx   指定生成template.js中的xxx模板,否则会有走提示让选择
```

### Options

配置自己的模板, config/template.js 配置的是对应项目的 github/gitlab 地址

> 注意权限问题,如果是私有的项目,则需要有 auth 验证

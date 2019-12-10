# gmanager-web

> 这是一个vue admin 管理后台。它包含了 菜单，角色，用户，机构，这些搭建后台必要的东西。
> 基于 ElementUI 和 vue 进行开发，参考了 PanJiaChen 的模板项目

## 项目使用

```bash
# 克隆项目
git clone https://github.com/goflyfox/gmanager-web

# 进入项目目录
cd gmanager-web

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:9529](http://localhost:9529)

## 打包发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```
## 功能模块

1. 登录、认证、登出
2. 组织机构管理
3. 用户管理
4. 角色管理
5. 菜单管理
6. 支持登录、登出、业务增删改操作记录

#### 感谢

1. vue-admin-template框架 [https://github.com/PanJiaChen/vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 

## License

[MIT](https://github.com/goflyfox/gmanager-web) license.

Copyright (c) 2019-present hanshuaibing

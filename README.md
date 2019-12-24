# gmanager-web

* 这是一个基于gmanager管理后台的前端页面。它包含了登录、认证、组织机构、用户帐号、角色权限、菜单、操作日志，这些搭建后台必要的东西。
* 基于 ElementUI 和 vue 进行开发，使用vue-admin-template模板

## 代码
* github地址： https://github.com/goflyfox/gmanager-web
* gitee地址： https://gitee.com/goflyfox/gmanager-web
* 服务端github地址： https://github.com/goflyfox/gmanager
* 服务端gitee地址： https://gitee.com/goflyfox/gmanager

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

## 部署截图
登录：
![image](https://raw.githubusercontent.com/goflyfox/gmanager/master/deploy/image/web1.png)

组织机构：
![image](https://raw.githubusercontent.com/goflyfox/gmanager/master/deploy/image/web2.png)

用户管理：
![image](https://raw.githubusercontent.com/goflyfox/gmanager/master/deploy/image/web3.png)

日志管理：
![image](https://raw.githubusercontent.com/goflyfox/gmanager/master/deploy/image/web4.png)

#### 感谢


1. vue-admin-template框架 [https://github.com/PanJiaChen/vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 


## License

[MIT](https://github.com/goflyfox/gmanager-web) license.

Copyright (c) 2019-present hanshuaibing

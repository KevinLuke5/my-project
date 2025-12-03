
## SRM系统

## 项目文档
* [功能迭代-tb](https://tb.joyoung.com/project/62da06c400ad37b937154756/story/section/645366cd889b670011e1a827)

## 技术栈
#### vue + vue-cli + vue-router + JYUI + Echarts + axios + es6

## 开发之前

开发前，请确保你已经学习过九阳官方组件库 [jyui组件库官网](https://jyui.joyoung.com/#/zh-CN/component/table) 和 [jyui原型工具配套](https://jyaiot.yuque.com/zfugpu/gyz7ur/bkrh62)以及[前端规范](https://jyaiot.yuque.com/zfugpu/abiaa7/sg507p)。

## 开发

### git仓库
> http://git.joyoung.com/ifms-fe/srm-pc.git

```bash
# 安装依赖
npm ci --registry=http://npm.dev.joyoung.com
# 开发启动
npm run dev
```

### 开发环境
```bash
# 修改host
127.0.0.1
http://localhost:8013/
```
### 测试环境
```bash
# 链接
https://scm-test.joyoung.com/srm-web/#/login

```
### 线上环境
```bash
# 链接
https://scm.joyoung.com/srm-web/#/login

```
### 代码提交
```bash
# 命令1
npm run cz
# 命令2
git push
```
### 菜单和接口资源配置
* [资源配置-测试](https://pangu-test.joyoung.com/auth/#/functionPermission/resource)
* [资源配置-正式](https://pangu.joyoung.com/auth/#/functionPermission/resource)
* [资源配置说明](https://jyaiot.yuque.com/staff-xx7vwd/hh7rls/hsivdsf23g9bgzyc)

### 发布
```bash
# Jenkins
http://172.31.11.41:8080/job/srm-web/
```
### 账号密码权限相关
联系人：尹海鑫
### 目录结构

```bash
# 命令生成tree（以下命令执行后在当前目录下生成 tree.txt 文件，具体需要输出什么层级请自行搜索tree命令）
* windows命令: tree /F > tree.txt
* Mac命令: tree -I 'node_modules|site-dist|dist' -L 3 -f > tree.txt
```

```
.
├── ./cz-config.js
├── ./editorconfig
├── ./env.develop   // 开发环境打包
├── ./env.development   // 本地开发环境
├── ./env.prod  // 正式环境打包
├── ./env.production
├── ./env.test  // 测试环境打包
├── ./eslintrc.js // eslint配置
├── ./babel.config.js
├── ./commitlint.config.js
├── ./package-lock.json
├── ./package.json
├── ./postcss.config.js
├── ./README.md
├── ./public
│   ├── ./public/favicon.ico
│   └── ./public/index.html
├── ./src
│   ├── ./src/App.vue
│   ├── ./src/api // 接口文件
│   ├── ./src/assets // 静态资源
│   ├── ./src/components  // 项目公用组件
│   ├── ./src/main.js
│   ├── ./src/setting.js  // 项目配置
│   ├── ./src/router // 路由文件
│   ├── ./src/utils  // 公用方法
│   └── ./src/views
│       ├── ./src/views/base // 基础模块
│       ├── ./src/views/supplier //供应商模块
│       ├── ./src/views/auth // 权限管理
│       ├── ./src/views/features
│       ├── ./src/views/login // 登录
│       ├── ./src/views/system
│       └── ./src/views/home.vue // 首页
└── ./vue.config.js // 工程配置文件
```

## 相关链接

* [意见反馈](https://git.joyoung.com/ifms-fe/srm-web/issues)

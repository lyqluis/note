/*
**************************************************
**************************************************
**************************************************
** hash & history
** 
*/

// 后端路由
// 输入url => 
// 请求发送到服务器 =>
// 服务器解析请求路径 =>
// 拿到对应数据和页面 =>
// 返回数据

// 前端路由
// 输入url =>
// js解析地址 =>
// 找到对应地址的页面 =>
// 执行页面生成的js =>
// 呈现页面

//hash
// - 从#开始就是hash的内容
// - 通过location.hash拿到当前hash内容
// - onhashchange监听hash改变

// history
// - 没有#，正常的路径，www.[xxx].com/sadf/sadf
// - location.pathname到当前histort地址
// - 用onpopstate监听history改变


/*
**************************************************
**************************************************
**************************************************
** vue-router 原理 
** 
*/

// vue-router 流程
// url改变 =>
// 触发url改变监听事件 =>
// 改变vue-router里的current变量 =>
// 监听current变量的监视者 =>
// 获取新的组件 =>
// render新的组件

// vue-router就是vue的插件
// import Router from 'vue-router'
// Vue.use(Router) //使用插件

// vue插件使用
// Vue.use(param)
// 执行param.install方法
// param可以是一个方法，也可以是个对象
// param是方法，直接执行param
// param是对象，必须拥有param.install方法
// 执行优先级param.install>param方法

// param.install 方法
// // 参数vue为vue构造类
// // 相当于import Vue from 'vue' 中的 Vue
// param.install = function (vue) {
//   // 使用vue.mixin接口
//   // 全局混入生命周期
//   vue.mixin({
//     created(){
//       // ...
//     }
//   })
// }

// vue底层函数
// vue内置方法自动响应化obj[key]数据，自动监听obj[key]
// vue.util.defineReactive(obj, key)
// 这样可以用来监听vue-router的current变量
// vue.uitl  https://www.kancloud.cn/diaoyundexia/text/181108


// // 附录
// vue高阶api
// Vue.extend([组件])
// https://cn.vuejs.org/v2/api/#Vue-extend
// 返回一个该组件的构造函数
// const Constructor = Vue.extend(component)
// vm = new Constructor().$mount()
// // 这样可以用单元测试还组件



/*
**************************************************
**************************************************
**************************************************
** vue-router 实现
**
*/

/* 
  单元测试流程
  最小的可测试单元

  
*/

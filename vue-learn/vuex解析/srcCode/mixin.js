export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  // vue 2.0+
  if (version >= 2) {
    // 混入
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    //vue 2.0-
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit() {
    // this => vue实例
    const options = this.$options
    // store injection
    if (options.store) {  // vue根实例才有options.store
      // 绑定this.$store => this.$options.store
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) { //其他子组件
      // this.$store => 当前组件父组件的$tore（父组件再指向父组件一直指到根实例）
      this.$store = options.parent.$store
    }
  }
}

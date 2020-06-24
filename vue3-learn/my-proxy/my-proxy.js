const baseHandler = {
  get(target, key) {
    const res = Reflect.get(target, key);
    // track 收集依赖
    track(target, key);
    // 返回该值，如果是对象，递归
    return typeof res === 'object' ? reactive(res) : res;
  },
  set(target, key, val) {
    const info = {
      oldVal: target[key],
      newVal: val
    }
    // 修改新值
    Reflect.set(target, key, val);
    // 通知变化
    trigger(target, key, info)
  }
}

// 创建全局的依赖图
let targetMap = new WeakMap()
// 用来存放effect的栈
const effectStack = [];
// 当前的effect
let activeEffect = null;

/*
** 收集依赖
** @param
** $target - 目标对象
** $key - 键
*/
// 在初始化以及computed等其他api中触发
function track(target, key) {
  // 所有响应式数据都是被封装的对象，保存在全局targetMap的weakMap中
  // 如果当前没有活动的effect，即当前的数据增减改查并没有涉及到需要响应式的函数，无需track
  if (!activeEffect) return;
  // 创建targetMap依赖图
  let depMap = targetMap.get(target, key);
  // 如果全局依赖图里不存在，则新增该对象的依赖Map
  if (!depMap) {
    depMap = new Map();
    // targetMap的key为响应式数据的对象
    targetMap.set(target, depMap);
  }
  // 为每个响应式数据target按key建立一个Set，用来保存target[key]所影响的effects
  let dep = depMap.get(key);
  // 如果target数据的依赖图里没有该key值，则新增该key值的依赖图
  if (!dep) {
    dep = new Set(); // set 自带去重
    depMap.set(key, dep);
  }
  // 新建依赖
  // 在全局依赖图中记录当前effect
  if (!dep.has(activeEffect)) {
    // 双向存储 方便查找优化
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

/*
** 通知更新
** 数据变化后，通知更新，执行相应的effect
** @target - 更新的数据对象
** @key - 更新的键
** @info - 更新的数据值信息 {oldVal: target[key], newVal: newValue}
**
*/
function trigger(target, key, info) {
  // 找的对应的数据依赖
  const depMap = targetMap.get(target);
  // 如果不存在，则该值未被track
  if (!depMap) return
  // 创建effect执行列表
  // 将普通effect与computed分开创建
  const effects = new Set();
  const computedRunners = new Set();
  // 创建add函数，@接收将要添加的effects的dep(Set格式)
  const add = effectsToAdd => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect.options.computed) {
          computedRunners.add(effect);
        } else {
          effects.add(effect);
        }
      })
    }
  }

  const deps = depMap.get(key);
  console.log(targetMap)
  if (key) add(deps);

  // 执行effect函数
  const run = effect => {
    effect();
  }
  // 执行普通effect和computed
  // 普通effect优先级高于computed
  // 因为computed可能会依赖普通effect
  effects.forEach(run);
  computedRunners.forEach(run);
}

/*
** 将对象变为响应式
** 这里只考虑普通对象，map等特殊对象暂时不考虑
** @params
** $target - 要变为响应式的数据
** @return 一个proxy代理实例
*/
function reactive(target) {
  // 用 proxy 劫持代理目标对象
  const observed = new Proxy(target, baseHandler);
  // 返回 proxy 代理后的对象
  return observed
}


/*
** 依赖函数 (watcher)
** 将api中的function或者computed api中的参数函数转化为响应式的effect函数
** 使参数函数中的响应式数据可追踪到这个effect实例
** @params
** $fn
** $options
** @return 一个封装后的effect实例方法
*/
function effect(fn, options = {}) {
  // 将fn重新封装成一个e函数
  let e = createReactiveEffect(fn, options);
  // 如果options中的lazy属性为false，则立即出发该函数
  // lazy 属性主要用于computed
  if (!options.lazy) e();
  return e
}

/*
** 封装effect中的参数fn
** createReactiveEffect是一个工厂方法，返回一个函数实例
** @params
** $fn - 同effect
** $options - 同effect
** @return 一个函数实例
*/
function createReactiveEffect(fn, options) {
  // 创建一个新的effect函数，并且给这个effect函数挂在一些属性，为后面做computed准备
  // 在reactiveEffect中将effect加入effectStack栈中
  // 这个effect函数里面调用run函数, 最后在返回出新的effect
  const effect = function reactiveEffect(...args) {
    // 如果全局effect栈没有包涵当前的effect实例
    // 虽然每次云从effect之前push进栈，结束后又pop出栈，effect是不会持续存在栈中的
    // 但是还是增加if判断!effectStack.includes(effect)是为了避免递归循环的
    // 比如在监听函数中，又改变了依赖数据，按正常逻辑是会不断的触发监听函数的。
    // 但通过effectStack.includes(effect)这么一个判断逻辑，自然而然就避免了递归循环
    if (!effectStack.includes(effect)) {
      try {
        // 将当前实例推入effect栈
        effectStack.push(effect);
        // 将当前effect变为全局的activeEffect
        activeEffect = effect;
        // 并执行当前实例
        return fn(...args)
      } finally {
        // 执行完毕，推出effect实例
        effectStack.pop();
        // 当前活动effect在栈中往前进一个
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  // effect的配置
  effect.deps = [];
  effect.options = options;
  return effect
}


/*
** 计算函数（实则依赖函数）
** @params
** $fn - 要变为响应式的数据
*/
function computed(fn) {
  const runner = effect(fn, {
    computed: true,
    lazy: true
  });
  return {
    effect: runner,
    get value() {
      return runner();
    }
  }
}

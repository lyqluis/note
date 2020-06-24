## vue3 响应式
Vue3的响应式系统是独立的模块，可以完全脱离 Vue 而使用
![](https://user-gold-cdn.xitu.io/2019/10/9/16dafca37b2e0534?imageslim)
*via [一张图理清 Vue 3.0 的响应式系统](https://juejin.im/post/5d9da45af265da5b8072de5d)*

`Vue3`的响应式可以分为`Reactive`，`Effect`两大模块
- `Reactive` 将数据变为响应式
- `Effect` 将函数包装成响应式的函数，当所涉及数据更新，自动触发更新

`Effect`模块又可以分为`effect`，`track`，`trigger`三大方法
- `effect` 返回一个可追踪的`effect`实例
- `track` 收集依赖，建立`数据-函数`依赖图
- `trigger` 触发数据对应的所有依赖函数

`Effect`模块是一个偏向于底层只有基础功能的模块，在`Vue3`中包括`watch API`，`computed API`，还有`组件更新`都是依赖`Effect`实现的；
然而这个模块没有对外暴露在`Vue api`，相比`Vue2`，这明显是一个好设计

### 大致流程

初始化阶段，`Reactive`对数据进行劫持，在对应的`getter`中添加`track`，`setter`中添加`tirgger`，为了之后的依赖建立和触发；

`Effect` 将函数重新包装，并执行一次，如果函数中涉及响应式数据，则会触发之前劫持的`getter`，从而触发`track`进行依赖收集；

当某个响应式数据发生辩护时，触发劫持的`setter`，从而触发`trigger`，并触发与之对应的所有依赖的函数


### 与 Vue2 的差异
回顾一下 `Vue2`的响应式，分为了`observer`，`watcher`，`dep`三大模块来实现，分别对应数据响应化，依赖（观察者），依赖列表；
总体思路：
[Vue2响应式原理 & 如何实现MVVM双向绑定](https://segmentfault.com/a/1190000021013153#item-4-5)



但`Vue3`与`Vue2`的差异主要其实就是在数据劫持上的差异造成的；
众所周知，`vue2`使用了`Object.defineProperty`，而`vue3`使用了`Proxy`；
`Object.defineProperty`的弊端在于必须对确定的`key`进行劫持处理：
```js
Object.defineProperty(obj, key, {
  get() {
    // ...劫持操作...
    return val
  },
  set(newVal) {
    val = newVal;
  },
})
```
可以看到如果原来的`obj`中没有`key`而新增`new key`，是无法触发`get()`中的劫持操作的；[more](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

反观`Proxy`
```js
let obj = new Proxy(obj, {
  get(target, key){...},
  set(target, key){...},
})
```
只要你定义`get`等相关方法，后续对于`obj`上任何属性的访问（哪怕是不存在的），
都会触发`get`的劫持；

## 自实现Vue3响应式
参考源码，自实现一个简易的响应式系统来理解`vue3`；

在项目根目录新建`index.html`以及`my_proxy.js`
```shell
.
├── index.html
└── my_proxy.js
```

在`html`中引入自己的`js`文件，并使用一些响应式`api`
```html
<body>
  <div id="app"></div>
  <button id="btn">+1</button>
  <script src="./my-proxy.js"></script>
  <script>
    const root = document.getElementById('app');
    const btn = document.getElementById('btn');
    const p = {
      name: 'tom',
      age: 1
    };
    
    const person = reactive(p);
    const double = computed(() => person.age * 2);

    effect(
      () => {
        root.innerHTML = `<h1>hello，${person.name}，${person.age}岁，乘以2是${double.value}</h1>`;
      }
    )

    btn.addEventListener('click', () => {
      person.age += 1;
    }, false)
  </script>
</body>
```
上面的`script`中`api`的使用与`Vue3`本身的大同小异，因为是独立出来的响应式系统，所以`effect`也作为`api`暴露出来，这样可以更好的理解`Vue3`响应式的内部逻辑

### 数据劫持
根据`script`中的代码，首先要先写出一个`reactive`函数，将`p`转为响应式的`person`；
这里我们使用`es6`的`proxy`来做数据劫持
#### proxy
前置知识
[es6-ryf-Proxy](https://es6.ruanyifeng.com/?search=proxy&x=0&y=0#docs/proxy)
[es6-ryf-Reflect](https://es6.ruanyifeng.com/?search=proxy&x=0&y=0#docs/reflect)
[Proxy 和 Reflect 概述](http://caibaojian.com/es6/proxy.html)

```js
function reactive(target) {
  // 用 proxy 劫持代理目标对象
  const observed = new Proxy(target, baseHandler);
  // 返回 proxy 代理后的对象
  return observed
}
```  
接收`target`为要变为响应式的数据，返回一个`proxy`代理的实例对象
*这里只考虑普通对象，map等特殊对象暂时不考虑*

同样，我们需要对`Proxy`中的`baseHandler`进行补充
```js
const baseHandler = {
  get(target, key) {
    const res = Reflect.get(target, key);
    // 返回该值，如果是对象，递归
    return typeof res === 'object' ? reactive(res) : res;
  },
  set(target, key, val) {
    // 修改新值
    Reflect.set(target, key, val);
  }
}
```
这里可以看到虽然是有个递归，但是相对于`Vue2`在初始化的时候就将所有深层数据进行递归拦截的操作，`Vue3`是根据当前的`key`的深度进行递归拦截，这样当只需获取表层`key`的数据时，就无需先递归一边所有深层数据，提高了性能

### 函数响应式
根据之前所说的，`effect`函数是将接收的`fn`转变为一个`effect`实例
```js
function effect(fn, options = {}) {
  // 将fn重新封装成一个e函数
  let e = createReactiveEffect(fn, options);
  // 如果options中的没有lazy属性，则立即触发该函数
  // lazy 属性主要用于computed
  if (!options.lazy) e();
  return e
}
```

由于`effect`函数需要在`computed`，`watch`等`api`中起到作用，所以在`createReactiveEffect`中，需要对`effect`对象挂在一些相应的属性以便后续的操作

参考源码，在`Vue3`中设立了一个全局的`effectStack`栈，用来保存当前执行以及之后需要执行的`effect`方法；在设立一个全局的`activeEffect`变量，用来判断当前的`effect`实例
```js
const effectStack = [];
let activeEffect = null;

function createReactiveEffect(fn, options) {
  // 创建一个新的effect函数，并且给这个effect函数挂在一些属性，为后面做computed准备
  // 在reactiveEffect中将effect加入effectStack栈中
  const effect = function reactiveEffect(...args) {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect;
        // 执行当前实例
        return fn(...args)
      } finally {
        // 执行完毕，推出effect实例
        effectStack.pop();
        // 当前活动effect在栈中往前进一个
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  // effect的挂载配置
  effect.deps = [];
  effect.options = options;
  return effect
}
```

### 收集依赖
首先要清楚，这个依赖图到底是个什么样结构，这样才可以更好地去把`track`写出来
本文开头的那张图中的依赖表已经很清楚的解释了依赖图的结构，根据我们的`html`内容，我们想要的依赖图大致如下：
```js
targetMap: {
  {name: 'tom', age: 1}: {
    "name": [effect1, effect2, ...],
    "age": [effect1, ...]
  }
}
```

所以我们需要一个全局的`Map`对象用来保存这个依赖图，为了数据的安全性，我们使用`weakMap`对象

```js
let targetMap = new WeakMap();
```
`track`主要就是建立当前数据的依赖
```js
function track(target, key) {
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
```
对`proxy`的`baseHandler`的`getter`也需要添加进该函数
```js
// ...
  get(target, key) {
    const res = Reflect.get(target, key);
+   track(target, key);
    return typeof res === 'object' ? reactive(res) : res;
  },
// ...
```
`Vue2`是每个数据各自都在闭包中维护`deps`对象，`Vue3`不同的是用一个全局的`Map`对象去保存响应式数据影响的`effect`，实现了模块的解耦

### 触发监听
`trigger`简单来说就是需要通过`key`来找到对应的所有依赖函数，并依次执行

```js
function trigger(target, key) {
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
  // 找到对应的依赖
  const deps = depMap.get(key);
  if (key) add(deps);

  // 执行effect函数
  const run = effect => {
    effect();
  }
  // 执行普通effect和computed
  effects.forEach(run);
  computedRunners.forEach(run);
}
```
在`trigger`中新建`effects`队列，用来收集找到的依赖函数；并对`computed`和普通`effect`作区分；最后一次执行`effects`队列里的所有的依赖函数；
*执行的时候普通`effect`优先级会高于`computed`，因为`computed`可能会依赖普通`effect`*

### 计算函数 computed
其实`computed`可以理解为一个特殊的`effect`，那么只需要将参数`fn`用`effect`函数包装一下就可以了，然后根据用法，返回一个`getter`的`value`方法
```js
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
```

## 本文源码
[github](https://github.com/xiannvjiadexiaogouzi/note/blob/master/vue3-learn/my-proxy/my-proxy.js)

## 参考
[Vue3 /packages/reactivity 源码](https://github.com/vuejs/vue-next/tree/cf2f278f48e21ff8e2a325c09eb0c7ab5bf5a1f4/packages/reactivity/src)
[一张图理清 Vue 3.0 的响应式系统](https://juejin.im/post/5d9da45af265da5b8072de5d)
[vue3响应式系统源码解析-Effect篇](https://zhuanlan.zhihu.com/p/88385908)
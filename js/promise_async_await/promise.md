## Promise
>Promise 是 ES6 中异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。Promise 是一个对象，提供统一的 API，各种异步操作都可以用同样的方法进行处理。 

- `Promise` 操作只会处在 3 种状态的一种：未完成态(`pending`)、完成态(`resolved`) 和失败态(`rejected`)
- `Promise` 的状态只会出现从未完成态向完成态或失败态转化
- `Promise` 的状态一旦转化，将不能被更改

[阮一峰 - Es6 Promise](https://es6.ruanyifeng.com/#docs/promise)

## 手动实现一个Promise
Promise 是由统一规范的，目的是为了让大家自己实现的 `promise` 更好的实现兼容，所以出现了 [**Promises/A+**](https://promisesaplus.com/)规范；接下来的`promise`都是根据[**Promises/A+**](https://promisesaplus.com/)这份规范来实现的

### Promise 类
因为是有三种状态，所以先声明三个常量来代表状态
```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```

写出一个 `Promise` 类
```
class Promise {
  constructor(executor) {
    // 形参校验
    if (typeof executor !== 'function') throw new TypeError(`Promise resolver ${executor} is not a function`)

    // 初始化
    this.status = PENDING; // 状态
    this.value = null; // 终值
    this.reason = null; // 拒因
    
    // 执行cb
    executor();
  }
}
```
然后我们需要为 `Promise` 的形参`executor` 增加 `resolve` 和 `reject` 两个形参函数；根据定义，他们是由 `JS引擎` 提供的，所以我们需要先提前定义好
```
class Promise {
  constructor(executor) {
    ...
    // 将 resolve 和 reject 中的 this 绑定到 Promise 实例
+   this.resolve = this.resolve.bind(this);
+   this.reject = this.reject.bind(this);
    
    // 执行cb
+   try {
+     executor(this.resolve, this.reject);
+   } catch (e) { this.reject(e) }
  }

  resolve(val) {
    // 判断当前状态，只有处于等待状态才可以执行
    if (this.status === PENDING) {
      this.status = FULFILLED; // 状态变化
      this.value = val; // 终值赋值
    }
  }

  reject(err) {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = err;
    }
  }
}
```
- 当 `promise` 实例调用内部函数 `resolve` 或者 `reject`时，他们被调用时实际上是一个匿名函数，无法取到函数中`this.status`的值，所以需要用 `bind` 提前绑定；
- 当 `promise` 实例的 `executor` 内部本身本身抛出异常时，`Promise` 是会将异常一并放入 `reject` 函数来处理的，所以增加`try{...}catch(e){...}` 来处理这种情况

### 初步实现 `then`
`then` 接收两个回调函数，`onFulfilled`是当 `promise` 实例状态变为 `fulfilled` 时调用的函数，`onRejected` 是实例状态变为 `rejected` 时调用的函数，并且 `then` 返回的是一个 新的 `promise` 实例；
这里用 `setTimeout` 来模拟 `Promise` 内部的微任务异步
```
class Promise {
  ...
  then(onFulfilled, onRejected) {
    // 参数校验 onFulfilled, onRejected 为可选形参
    onFulfilled = typeof onFulfilled !== 'function' ? val => val : onFulfilled;
    onRejected = typeof onRejected !== 'function' ? reason => { throw reason } : onRejected;

    if (this.status === FULFILLED) {
      // setTimeout 模拟微任务异步 
      // 只有异步后 才能在里面取到 new 好的 promise2
      setTimeout(() => {
        try { // 重新添加try-catch，settimeout 内为异步，无法被外层constructor中的try-catch捕获
          onFulfilled(this.value); // 以终值作为参数执行 onFulfilled 函数
        } catch (e) { reject(e) }
      })
    }

    if (this.status === REJECTED) {
      // 以拒因作为参数执行 onRejected 函数
      setTimeout(() => {
        try {
          onRejected(this.reason);
        } catch (e) { reject(e) }
      });
    }
  }
}
```
### `then` 的修改
根据上面的写法，如果我们的 `promise` 实例的 `executor` 中，`resolve` 是一个异步实现的话，那么 `then` 方法是无法实现原来的效果的
```
new Promise((resolve, reject) => {
  setTimeout(() => { resolve(1) })
}).then(
  val => console.log(val),
  err => console.log(err)
)
```
此时我们自己的 `promise` 实例无法正确输出 `1`，原因在于，当 `executor` 中状态改变（`resolve` / `reject`）是异步实现时，`then` 函数是同步被调用的，此时的 `promise` 的状态还处于 `pending` 状态，无法调用任何函数；
所以我们需要在 `then` 中添加对于 `pending` 状态的处理；采用订阅发布的模式来解决状态的异步改变
```
class Promise {
  constructor(executor) {
    ...
    // 初始化
    ...
+   this.onFulfilledCbs = []; // 成功回调函数队列
+   this.onRejectedCbs = []; // 失败回调函数队列
    ...
  }

  resolve(val) {
    if (this.status === PENDING) {
      ...
      // 一旦状态改变，遍历函数队列将终值作为形参触发队列中的函数
+     this.onFulfilledCbs.forEach(fn => fn(this.value));
    }
  }

  reject(err) {
    if (this.status === PENDING) {
      ...
+     this.onRejectedCbs.forEach(fn => fn(this.reason));
    }
  }

  then(onFulfilled, onRejected) {
    ...
    // 当状态处于pending时
+   if (this.status === PENDING) {
+     // 向函数队列添加微任务回调函数
+     this.onFulfilledCbs.push(value => {
+       setTimeout(() => {
+         try {
+           onFulfilled(value)
+         } catch (e) { reject(e) }
+       })
+     });
+     
+     this.onRejectedCbs.push((reason) => {
+       setTimeout(() => {
+         try {
+           onRejected(reason)
+         } catch (e) { reject(e) }
+       })
+     });
+   }
  }
}
```
这样当 `promise` 实例的异步改变状态时，`then` 方法也能正确的触发

### 链式调用
之前说了，`then` 方法会返回一个新的 `promise` 实例，并且这个实例的值可以随着 `then` 无限调用而无限传递下去，为了实现这个方法，我们需要在 `then` 中返回一个新的 `promise` 实例
```
then(onFulfilled, onRejected) {
  ...
  // 创建一个新promise实例
+ let promise2 = new Promise((resolve, reject) => {
    // 同步操作（最开始的状态改变为同步）
    if (this.status === Promise.FULFILLED) {
      ...
    }

    if (this.status === Promise.REJECTED) {
      ...
    }

    if (this.status === Promise.PENDING) {
      ...
    }
+ })
+ return promise2
}
```
那我们如何在新的 `promise2` 中去调用 `resolve` 和 `reject` ？
遇事不决，参考规范
![image](https://image-static.segmentfault.com/141/749/1417490189-5dde3629e73ff_articlex)
根据[**Promises/A+**](https://promisesaplus.com/)规范，我们将`onFulfilled(value)` 和 `onRejected(reason)` 的结果定义成 `x`，并将其和 `promise2` 传进一个新的函数 `resolvePromise` 进行处理；
这里我们将这个新的处理函数定义为常函数
```
// @params
// $pomise2 - 新promise常量
// $x - onFulfilled / onRejected 处理结果
// $resolve - promise2 中的resolve函数
// $reject - promise2 中的reject函数
const RESOLVEPROMISE = function (promise2, x, resolve, reject) { ... }
```
然后再对 `then` 方法进行改写
```
then(onFulfilled, onRejected) {
  ...
  // 返回一个新的实例来实现链式调用
  let promise2 = new Promise((resolve, reject) => {

    if (this.status === FULFILLED) {
      setTimeout(() => {
        try {
          // 以终值作为参数执行 onFulfilled 函数
+         let x = onFulfilled(this.value);
          // 分析执行结果 x 与 promise 的关系
+         RESOLVEPROMISE(promise2, x, resolve, reject);
        } catch (e) { reject(e) }
      })
    }

    if (this.status === REJECTED) {
      setTimeout(() => {
        try {
+         let x = onRejected(this.reason)
+         RESOLVEPROMISE(promise2, x, resolve, reject);
        } catch (e) { reject(e) }
      });
    }

    if (this.status === PENDING) {
      this.onFulfilledCbs.push(value => {
        setTimeout(() => {
          try {
+           let x = onFulfilled(value)
+           RESOLVEPROMISE(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        })
      });
      this.onRejectedCbs.push((reason) => {
        setTimeout(() => {
          try {
+           let x = onRejected(reason)
+           RESOLVEPROMISE(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        })
      });
    }
  })
  return promise2
}
```

这样可以理解为，每次`then`都是对上一次的`promise`实例的结果进行操作 *（无论这个`promise`实例是我们自己`new`的还是上一个`then`返回的）*  


#### 实现 `resolvePromise` 函数
根据规范，`resolvePromise` 规则大致如下：
- `promise2` 和 `x` 指向同一对象，抛出一个类型错误
- `x` 是一个 `Promise` 类，则接受它的状态，并对应执行其`resolve` 或者 `reject` 函数
- `x` 是一个函数或者对象
  - `x.then` 是一个函数，调用 `x.then` 方法，并且递归结果
  - `x.then` 不是函数，调用`resolve`
- 以上都不是，调用 `resolve`

```
const RESOLVEPROMISE = function (promise2, x, resolve, reject) {

  // x 与 promise2 相等 -> 报错
  if (promise2 == x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  let called; // 防止多次调用 成功 和 失败

   // x 是否是 promise 类
   if (x instanceof Promise) {
     x.then(value => {
       Promise.resolvePromise(promise2, value, resolve, reject);
     }, err => {
       reject(err)
     })

     // x 是函数或者对象
   } else if (x !== null && typeof x == 'object' || typeof x == 'function') {
    try { // 取 x.then 可能报错

      // 如果 x 有 then 方法
      let then = x.then;

      // 如果 then 是一个函数
      if (typeof then == 'function') {
        // 用 call 调用 then 方法指向 x，防止再次取 x.then 报错
        then.call(x, value => {
          if (called) return;
          called = true;
          Promise.resolvePromise(promise2, value, resolve, reject);
        }, err => {
          if (called) return;
          called = true;
          reject(err)
        })
      // then 不是一个函数
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // x 为基本类型值
    resolve(x);
  }
}
```
到这里，我们的 `Promise` 就基本实现了，`then` 方法以外的方法这里就不一一实现了；

### 检验
这边可以全局安装一个插件来检验自己实现的 `Promise` 文件是否符合规范
`npm install -g promises-aplus-tests`

然后在文件最后添加，引用插件的接口来检验
```js
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;
```

最后在终端里输入指令，对该文件进行检验
`promises-aplus-tests [[你的Promise文件名.js]]`

可以根据检验结果对代码进行调试直至最终全部通过
![image](https://image-static.segmentfault.com/228/430/2284301593-5dde3f48e388d_articlex)

## async / await
`promise`虽然解决了异步操作的地狱回调问题，但是如果有很多异步操作需要相互依赖进行，那么`promise`的链式调用可读性就不好了，而且不能轻易控制流程

```js
new Promise(resolve => {
  resolve(a)
})
  .then(res => {
    return b(res)
  })
  .then(res => {
    return c(res)
  })
```

`ES7`提出了`async`函数，最终解决了异步问题，配合`promise`将异步操作实现了同步的可读性  
上面的`promise`可以用`async/await`来解决
```js
(async () => {
  const resA = await Promise.resolve(a)
  const resB = await Promise.resolve(b(resA))
  const resC = await Promise.resolve(c(resB))
})()
```

`async/await`实际上是对`Generator（生成器）`的封装，是一个语法糖  

### Generator

>ES6 新引入了 `Generator` 函数，可以通过 `yield` 关键字，把函数的执行流挂起，通过`next()`方法可以切换到下一个状态，为改变执行流程提供了可能，从而为异步编程提供解决方案。

运行规则大致如下：  
- 1.执行生成器不会执行生成器函数体的代码，只是获得一个遍历器
- 2.一旦调用 `next`，函数体就开始执行，一旦遇到 `yield` 就返回执行结果，暂停执行
- 3.第二次 `next` 的参数会作为第一次 `yield` 的结果传递给函数体，以此类推，所以第一次 `next` 调用的参数没用

例子
无传参：  
```js
function* myGenerator() {
  yield '1'
  yield '2'
  return '3'
}

const gen = myGenerator();  // 获取迭代器
gen.next()  // {value: "1", done: false}
gen.next()  // {value: "2", done: false}
gen.next()  // {value: "3", done: true}
```

传参  
```js
function* myGenerator() {
  console.log(yield '1')
  console.log(yield '2')
  console.log(yield '3')
}

const gen = myGenerator(); // 获取迭代器
gen.next()
gen.next('test1') // test1
gen.next('test2') // test2
gen.next('test3') // test3
```

### 封装 generator => async / await

https://mp.weixin.qq.com/s/lUQGeVPiLEQDvUv6M90tRg

https://juejin.im/post/6844904096525189128#heading-13


`*/yield`和`async/await`很相似，都可以控制流程暂停过程，但有三点不同：  

- `async/await`自带执行器，不需要手动调用`next()`就能自动执行下一步
- `async`函数返回值是`Promise`对象，而`Generator`返回的是生成器对象
- `await`能够返回`Promise`的`resolve/reject`的值

手动执行`promise`的`generator`流程：  
```js
function* myGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}

// 手动执行迭代器
const gen = myGenerator()
gen.next().value.then(val => {
  console.log(val)  // 1
  gen.next().value.then(val => {
    console.log(val)  // 2
    gen.next().value.then(val => {
      console.log(val)  // 3
    })
  })
})
```

自动执行`next()`：  
```js

```

## 源码
欢迎移步本文[`myPormise`源码](./myPromise.js)  
[](./async.js)

## 最后
最后，一个 符合**Promise/A+**规范的 `Promise` 就实现了，希望能帮助大家更清楚的了解 `Promise`

感谢阅读
欢迎指正、探讨
😀 各位喜欢的看官，欢迎 star 🌟
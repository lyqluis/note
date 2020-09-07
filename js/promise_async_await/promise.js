class Promise {
  constructor(executor) {
    // 形参校验
    if (typeof executor !== 'function') throw new TypeError(`Promise resolver ${executor} is not a function`)
    // 初始化
    this.init();

    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e)
    }

  }

  // 初始化值
  init() {
    this.value = null; // 终值
    this.reason = null; // 拒因
    this.status = Promise.PENDING; // 状态
    this.onFulfilledCbs = []; // 成功回调
    this.onRejectedCbs = []; // 失败回调
    // 将 resolve 和 reject 中的 this 绑定到 Promise 实例
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(val) {
    // 成功后的一系列操作（状态改变，成功回调的执行）
    if (this.status === Promise.PENDING) {
      this.status = Promise.FULFILLED;
      this.value = val;
      this.onFulfilledCbs.forEach(fn => fn(this.value));
    }
  }

  reject(err) {
    // 失败后的一系列操作（状态改变， 失败回调的执行）
    if (this.status === Promise.PENDING) {
      this.status = Promise.REJECTED;
      this.reason = err;
      this.onRejectedCbs.forEach(fn => fn(this.reason));
    }
  }

  then(onFulfilled, onRejected) {
    // 参数校验 onFulfilled, onRejected 为可选形参
    onFulfilled = typeof onFulfilled !== 'function' ? val => val : onFulfilled;
    onRejected = typeof onRejected !== 'function' ? reason => { throw reason } : onRejected;

    // 返回一个新的实例来实现链式调用
    let promise2 = new Promise((resolve, reject) => {
      // 同步操作（最开始的状态改变为同步）
      if (this.status === Promise.FULFILLED) {
        // setTimeout 模拟微任务异步 
        // 只有异步后 才能在里面取到 new 好的 promise2
        setTimeout(() => {
          try { // 重新添加try-catch，settimeout 内为异步，无法被外层constructor中的try-catch捕获
            // 以终值作为参数执行 onFulfilled 函数
            let x = onFulfilled(this.value);
            // 分析执行结果 x 与 promise 的关系
            // resolve(x);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        })
      }

      if (this.status === Promise.REJECTED) {
        // 以拒因作为参数执行 onRejected 函数
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        });
      }

      // 异步操作（最开始状态改变为异步，如 settimeout 内包含 resolve）使用发布订阅
      if (this.status === Promise.PENDING) {
        this.onFulfilledCbs.push(value => {
          setTimeout(() => {
            try {
              let x = onFulfilled(value)
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e) }
          })
        });
        this.onRejectedCbs.push((reason) => {
          setTimeout(() => {
            try {
              let x = onRejected(reason)
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e) }
          })
        });
      }
    })

    return promise2
  }

}

Promise.PENDING = 'pending';
Promise.FULFILLED = 'fulfilled';
Promise.REJECTED = 'rejected';

Promise.resolvePromise = function (promise2, x, resolve, reject) {
  // x 与 promise2 相等 -> 报错
  if (promise2 == x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called; // 防止多次调用 成功 和 失败
  // // x 是否是 promise 类
  // if (x instanceof Promise) {
  //   x.then(value => {
  //     Promise.resolvePromise(promise2, value, resolve, reject);
  //   }, err => {
  //     reject(err)
  //   })
  //   // x 是函数或者对象
  // } else 
  if (x !== null && typeof x == 'object' || typeof x == 'function') {
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

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;

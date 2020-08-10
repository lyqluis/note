const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class myPromise {

  constructor(excutor) {
    this._status = PENDING
    this._value = null
    this._resolveQueue = []
    this._rejectQueue = []

    const _resolve = val => {
      const run = () => {
        if (this._status !== PENDING) return
        this._status = FULFILLED
        this._value = val
        this._resolveQueue.forEach(callback => callback(val))
      }
      setTimeout(run)
    }

    const _reject = err => {
      const run = () => {
        if (this._status !== PENDING) return
        this._status = REJECTED
        this._value = err
        this._rejectQueue.forEach(callback => callback(err))
      }
      setTimeout(run)
    }

    try {
      excutor(_resolve, _reject)
    } catch (e) {
      _reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled !== 'function' ? val => val : onFulfilled
    onRejected = typeof onRejected !== 'function' ? err => { throw err } : onRejected

    const promise2 = new myPromise((resolve, reject) => {

      const fulfilledFn = value => {
        setTimeout(() => {
          try {
            const x = onFulfilled(value)
            myPromise.resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }

      const rejectedFn = err => {
        setTimeout(() => {
          try {
            const x = onRejected(err)
            myPromise.resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }

      switch (this._status) {
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break
        case FULFILLED:
          fulfilledFn(this._value)
          break
        case REJECTED:
          rejectedFn(this._value)
          break
      }
    })

    return promise2
  }

  /* 
    @function catch
    @return 一个Promise，并且处理拒绝的情况
    其实就是执行一下then的第二个回调
  */
  catch(rejectFn) {
    return this.then(undefined, rejectFn)
  }

  /* 
    @function finally
    @return 一个Promise
    在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数
    在finally之后，还可以继续then，并且会将值原封不动的传递给后面的then
  */
  finally(callback) {
    return this.then(
      value => myPromise.resolve(callback()).then(() => value),
      err => myPromise.resolve(callback()).then(() => { throw err }))
  }

  static resolve(value) {
    return value instanceof myPromise ? value : new myPromise(resolve => resolve(value))
  }

  static reject(error) {
    return new myPromise((resolve, reject) => reject(error))
  }

}

myPromise.resolvePromise = function (promise2, x, resolve, reject) {
  // x 与 promise2 相等 -> 报错
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  let called;

  // x 是一个函数或者对象
  // - x.then 是一个函数，调用 x.then 方法，并且递归结果
  // - x.then 不是函数，调用resolve
  if (x !== null && typeof x === 'object' || typeof x === 'function') {
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          value => {
            if (called) return
            called = true
            myPromise.resolvePromise(promise2, value, resolve, reject)
          },
          err => {
            if (called) return
            called = true
            reject(err)
          })
      } else {
        if (called) return
        called = true
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}



myPromise.defer = myPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new myPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = myPromise;
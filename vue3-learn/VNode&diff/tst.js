const cache = [];

let fn = () => console.log('hello')

cache[1] = fn

let fn2 = cache[1]



console.log(fn2 === fn)
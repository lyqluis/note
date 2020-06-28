/*
**************************************************
**************************************************
**************************************************
** js 执行顺序 
** 宏任务，微任务
*/

// 1.面试题目
// 输出顺序
// setTimeout(() => {
//   console.log('set1');
// })

// new Promise((resolve, reject) => {
//   console.log('p1');
//   resolve();
// }).then(() => {
//   console.log('then1');
// })
// console.log('1')

// p1, 1, then1, set1

// 异步: 
// 微任务: Promise, process.nextTick
// 宏任务: 第一次执行js代码, 回调函数, setTimeout, setInterval
// 宏任务队列（回调队列）会等待微任务队列全部清空，再执行

// 1的分析：
// Pormise中的‘p1’为同步函数，异步为then后面的‘then1’

// 2. 题目 难度加深
// 输出顺序
// setTimeout(() => {
//   console.log('set1');
//   new Promise((resolve, reject) => {
//     console.log('p2');
//     resolve();
//   }).then(() => {
//     console.log('then2');
//   })
// })

// new Promise((resolve, reject) => {
//   console.log('p1');
//   resolve();
// }).then(() => {
//   console.log('then1');
//   setTimeout(() => {
//     console.log('set2');
//   });
// })
// console.log('1')

// 宏 set1, promise2, set2
// 微 then1, then2, 
// p1, 1, then1, set1, p2, then2, set2

///////
// // * async await 本身是语法糖，不是异步
// // * yield 相当于 async await 的前身
// new Promise(() => {
//   ajax();
// }).then(res => {
//   console.log(res);
// })

// // 上面等同于
// async function a() {
//   let res = await new Promise(() => {
//     ajax();
//   })
//   console.log(res);
// }

// // 使用场景
// [f1, f2, f3, f4];
// //一组方法中并存同步异步方法，要确保一组方法每一个都调用完成

// // 待思考
// // new Promise((resoleve, reject) => {
// //   f1();
// // }).then(res1 => {
// //   f2(res1);
// // }).then(res2 => {
// //   f3(res2);
// // }).then(res3 => {
// //   f4(res3);
// // }).then(res4 => {
// //   console.log(res4);
// // });
// 
// // async function a() {
// 
// // }

/*
**************************************************
**************************************************
**************************************************
** v8引擎 内存
** 
*/

// - 内存大小和操作系统相关
//   - 64位系统， 1.4g
//     - 新生代 - 64mb
//     - 老生代 - 1400mb
//   - 32位系统， 0.7g
//     - 新生代 - 16mb
//     - 老生代 - 700mb

// - 内存分配
//   - 新生代内存空间
//   - 老生代内存空间

// 内存大小设计
// - js 为浏览器脚本语言，只执行一次，执行完毕之后内存就释放掉了，所以 1.4g 够用了
// - v8 回收一次垃圾，3ms/100mb，回收的时候是中断所有代码执行，如果占用太多，因v8回收，代码会停滞很久

// 新生代，老生代回收机制
// 1. 新生代空间已经占用25%
// 2. 经历过一次内存回收的变量会转移入老生代空间

// 新生代回收思路
// 新生代的变量频繁经历内存回收的洗礼，所以要保证新生代执行要快
// 新生代空 划分了两部分
// - from
// - to
// 每次变量创建在一个分区内，当回收变量发生时，标记将当前分区的存活变量，并复制进入另一分区，然后清空当前分组所有变量；
// 这样只要经历一次复制的时间即可，保证了速度；
// 即牺牲了一般空间换取更快的执行速度

// 老生代回收思路
// 1. 先标记已死亡的变量，在回收已标记变量
// 因为内存的是连续存在的，这样势必会导致内存碎片的存在
// 类似于 删除数组[1,2,3,4,5]中的2和4，会使得内存变为[1, ,3, ,5]，2和4的位置出现了内存碎片;
// 这样势必导致无法写入其他同类型数据
// * 额外补充
// 数据结构
// 每一个元素必须同类型并且占用连续的内存
// 2. 整理剩下的变量，防止内存碎片的出现

// v8 内存回收
// - 内存接近快满的时候
//   - 全局变量，不回收
//   - 失去引用的局部变量，回收

// // 查看内存
// // 浏览器 - window.performance
// // node - process.memoryUsage()

function getMemory() {
  let memory = process.memoryUsage();
  let format = bytes => (bytes / 1024 / 1024).toFixed(2) + 'MB';
  console.log("heapTotal: " + format(memory.heapTotal) + ",  heapUsed: " + format(memory.heapUsed));
}

const size = 20 * 1024 * 1024;
let count = 0;
let arr = [];
function tst() {
  let arr1 = new Array(size);
  let arr2 = new Array(size);
  let arr3 = new Array(size);
  let arr4 = new Array(size);
  let arr5 = new Array(size);
}

tst();
getMemory();
let timer = setInterval(() => {
  count++;
  arr.push(new Array(size));
  getMemory();
  if (count == 15) clearInterval(timer);
}, 1000);

// // 容易引发内存使用不当的场景
// - 滥用全局变量
//   - 用完可以人为释放 `变量 = null`
// - 缓存不限制
//   - 对缓存对象大小进行限制 `限制arr的长度`
// - 操作大文件
//   - 断点续传
//   - js有相应的api

// // node操作大文件
// // 目前主流读取文件的api
// //一次性读取整个文件进入内存（100mb）
// fs.readFile(); 
// // 慢慢地传
// fs.createReadStream();
// fs.createWriteStream();


/*
**************************************************
**************************************************
**************************************************
** 性能监控 方案
** 
*/

// 性能监控方案
//   - Lighthouse
//     // - 谷歌插件，要梯子
//     // 看不到底层数据
//     // - 不用梯子方案
//     // 全局安装lighthouse
//     `npm i lighthouse -g`
//     // 使用
//     `lighthouse 网址 输出格式 输出路径`
//     // 例子
//     `lighthouse https://www.baidu.com --output=html -path ./`

//   - 回报代码
//     企业级项目
//     浏览器api
//       `window.performance`
//     // 功用页面模版上嵌入一段<script>代码
//     ```
//     <script>
//     window.onload = function () {
//       let tcptime = window.performance.connectEnd - window.performance.connectStart;
//       // 传回后台监控页面
//       $.ajax('');
//       // ...不太懂这边的
//     }
//     </script>
//     ```




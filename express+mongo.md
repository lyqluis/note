## Express

- vscode中通过REST Client插件来发起post请求，来调试api

安装
`npm i express`

`const express = require('express');`

创建实例
`const app = new express();`

监听端口
```
app.listen(3000, () => {
  console.log('is listening on port 3000!')
})
```

处理静态文件的托管
`app.use('/', express.static('./static'))`

开启json解析来处理提交json数据
`app.use(express.json())`


get命令, 异步操作
```
app.get('/product', async (req, res)=>{
  res.send(await Product.find());
})
```
*req - 客户端请求*
*res - server的回应*

post命令
```
app.post('/product', async (req, res)=>{
  let data = req.body;
  res.send(data);
})
```

put命令
```
app.put('/product/:id', async (req, res) => {
  let product = await Product.findById(req.params.id)
;   // 找到对应产品
  product.title = res.body.title; // 修改数据
  await product.save(); // 保存数据至数据库
  res.send (product); // 返回修改后产品
})
```

delete命令
```
app.delete('/product/:id', async (req, res) => {
  // 找到对应产品
  let product = await Product.findById(req.params.id)
    ;
  // 移除数据
  await product.remove();
  // 返回修改后产品
  res.send({success: true});
})

```


### 跨域
安装
`npm i cors`

使用跨域
`app.use(require('cors')());` 
*require('cors')返回函数*
*require('cors')()直接执行成为中间件，然后直接use*

## Mongodb 数据库
官方文档：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
### mongoose
连接数据库的工具

安装
`npm i mongoose`

引入
`const mongoose = require('mongoose');`

使用mongoose连接mongodb（先确保本地mongodb已经打开）
`mongoose.connect('mongodb://localhost:27017/practice-express', { useNewUrlParser: true });`
*mongodb://localhost:27017/ - 默认端口*
*practice-express - 自定义数据库名称*
*{ useNewUrlParser: true } - 一定要加，否则警告*

- 打开mongodb
`mongod --config /usr/local/etc/mongod.conf`

定义数据模型(集合)
`mongoose.model('集合名', 表结构)`
```
const Product = mongoose.model('Product', new mongoose.Schema({ //表结构
  // 属性字段 (属性 - 数据类型)
  title: String, 
}))
```

插入数据
`数据集合.insertMany([...])`
```
Product.insertMany([
  {title: 'fruit'},
  {title: 'water'},
  ...
])
```
*插入一次就可以了，之后就注释掉，否则每次都会插入新数据*

- .find()
找数据, 返回数据集合
`数据集合.find()`
  - 跳过某条数据
  `数据集合.find().skip()`
  - 限制返回多少数据
  `数据集合.find().limit()`
  - 数据分页
  `数据集合.find().skip(number).limit(number)`
  - 条件查询
  ```
  数据集合.find().where({
    title: 'fruit' //查询字段
  })
  ```
  - 排序
  `数据集合.find().sort({ 属性名: 1})`
  *属性名: 1 - 顺序*
  *属性名: -1 - 倒序*

- .findById()
根据ID来进行查询
`数据集合.findById(id)`

### mongodb 数据备份 导出 转移
打开mongodb的前提下

- 导出数据库
`mongodump -h 127.0.0.1:27017 -u $user -p $pw -d $数据库 -o 导出保存路径`

- 存入数据
`mongodump -h 127.0.0.1:27017 -d $数据库 新数据保存路径`

- 进入mongo界面
`mongo`

- 查看所有数据库
`> show dbs`

https://segmentfault.com/a/1190000006236494
https://www.jianshu.com/p/15182e696fb8
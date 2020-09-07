# linux 入门

## 更多
[Linux常用命令](https://segmentfault.com/a/1190000021950993)

## 目录结构

![](https://image-static.segmentfault.com/695/761/695761251-7b237dd69d96e376_articlex)
| 目录 | 英文 | 存放 |
| :-- | :-- | :-- |
| bin | (binaries) | 存放二进制可执行文件 |
| sbin | (super user binaries) | 存放二进制可执行文件，只有root才能访问 |
| etc | (etcetera) | 存放系统配置文件 |
| usr | (unix software resources) | 用于存放的系统应用程序 |
| home | home | 存放用户文件的根目录 |
| root | root | 超级用户目录 |
| dev | (devices) | 用于存放设备文件 |
| lib | (library) | 存放跟文件系统中的程序运行所需要的共享库及内核模块 |
| mnt | (mount) | 系统管理员安装临时文件系统的安装点 |
| boot | boot | 存放用于系统引导时使用的各种文件 |
| tmp | (temporary) | 用于存放各种临时文件 |
| var | (variable) | 用于存放运行时需要改变数据的文件，也是某些大文件的溢出区，比方说各种服务的日志文件（系统启动日志等。）等 |


更多参考：[Linux各目录及每个目录的详细介绍](https://www.cnblogs.com/duanji/p/yueding2.html)

## 常用命令

### .
当前目录

### ..
上级目录

### ~
切换到家目录

### /
根目录

### 命令格式
```shell
# 命令   选项      参数
[cmd] [-option] [param]
```

### pwd
print working directory  
显示当前目录

### ls
*list*  
罗列当前路径下所有文件

#### 参数

- `-l` 罗列详细列表
- `-a` 显示隐藏文件 *all*
- `-i` 显示文件id *id*
- `-h` 更改大小单位显示

- `-d` 显示目录信息，而不是目录下的文件
- `-i`: 显示文件的节点号
- `-l`: 长格式显示

#### -l
罗列详细列表

```shell
total 160 #总大小
# 权限        所有者    组     大小  最后修改时间 文件名
drwxr-xr-x   6 GULA  staff    192  8 18  2018 CSS
-rw-r--r--   1 GULA  staff   1955 11  4  2019 http.md
```

### cd
*change directory*  
更改目录

- `-` 返回上一次的目录，可以实现两个目录来回切换

### which
查看`[命令]`的位置  
`cmd`相当于一个可执行的二进制文件  
若没有返回值，则表示为`shell`内置命令

```shell
which [cmd]
```

### ln
*link*
创建软连接

```shell
ln -s [源文件路径] [软链接名]
```
不加`-s`则创建为硬连接，推荐软连接

- `-s` 建立软链接文件
不加`-s`则创建为硬连接，推荐软连接
- `-f` 强行删除已存在的重名链接文件并重新建立

## 符号

### .
`.`开头的文件名为隐藏文件

创建隐藏文件

```shell
touch .tst.md # .tst.md 为隐藏文件
```

### 通配符
- `*` >= 0个字符 可以不带后缀
- `?` =1个字符 必须带后缀
- `[]` =1个字符

```shell
ls a*.md  # 罗列所有以a开头，以.md结尾的文件
ls 'a'??????'d' # 罗列所有以a开头，以d结尾，名字为8哥字符的文件（字符包括后缀），# abcde.md
```

### > 输出
输出符
- `>` 覆盖所有内容
- `>>` 添加内容

```shell
ls . > ./tress.md # 罗列当前目录的所有文件覆盖到./tree.md中
ls . >> ./tress.md # 罗列当前目录的所有文件添加到./tree.md中
```

### | 管道
```shell
[cmd1] | [cmd2]
```

将`cmd1`的输出作为`cmd2`中输入

```shell
grep -v '#' /etc/services | more  # 分页查看services中非注释内容
```



## 文件增删改查
### touch 
创建文件  
*可多级目录*  

```shell
touch [文件名]
```

### mkdir
创建目录  
*无法创建多级目录*  

```shell
mkdir [目录名]
```

### rm
*remove*  
删除文件

```shell
rm [文件名]
```

- `-d` 删除整个目录
- `-r` 删除非空目录

### mv
*move*  
移动文件（目录）

```shell
mv [文件名] [路径/新文件名]
```

### cp
*copy*  
拷贝文件（目录）

```shell
cp [文件名] [路径/新文件名]
```

### find
全局遍历查找文件

```shell
find [路径] [选项] [条件]
```

- `name [文件名]` 按文件名搜索
- `iname [文件名]` 忽略大小写的文件名
- `size [=|+|-数字]` 按文件大小搜索 
  - `+1` >512b的文件
  - `-1` <512b的文件
  - `=1` =512b的文件
- `user [用户名]` 按文件所属人搜索
- `mmin [+|-|=分钟数]` 按上次文件内容被修改的时间搜索
- `amin [+|-|=分钟数]` 按上次文件被访问的时间搜索
- `cmin [+|-|=分钟数]` 按上次文件属性被修改的时间搜索
- `type [type]` 按文件类型搜索
  - `f` 文件
  - `d` 目录
  - `l` 软连接
- `-a` 同时满足 *and*
- `-o` 或者 *or*

```shell
find ../a -iname 'tst.md' # 查找../a中的TST.md
find ../a -size -10 # 查找../a中的小于5120b的文件
find ../a -mmin -5 -a -user user1 # 搜索../a中5min之内被修改过内容且所属人为user1的文件
```

### locate
搜索索引库来查找文件  
搜索速度大于`find`命令

```shell
locate [文件名]
```
#### 更新索引库
```shell
sudo updatedb
```

### cat
查看文件内容

```shell
cat [文件名]
```

- `-b` 显示行数（不包含空行）
- `-n` 显示行数（包含空行）

### more
分页查看文件内容（空格：下一页；b：上一页；回车：下一行）

```shell
more [文件名]
```

### grep
搜索文件内容

```shell
grep [关键词] [文件]
```

- `-n` 显示行数
- `-v` 反向搜索
- `-i` 忽略大小写

```shell
grep ^'#' /etc/services # 在services文件中搜索开头为‘#’的注释
```

### echo
打印
```shell
echo 'aaa' > ./tst.md # 打印‘aaa’覆盖到./tst.md
```

## 帮助手册

### --help
帮助手册

```shell
[cmd] --help  # 查看该命令手册
```

### man 
*manual*  
查看命令详细手册

```shell
man [cmd]
```

## 权限相关

### 用户添加

### useradd

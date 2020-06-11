# vps
### 常规
share提示符
`[用户@主机名 当前目录名称]提示符`
`#-root用户；$-普通用户`

bash shell 基本语法
`命令 [选项] ([参数]) [选项的值] ([参数的值])`

查看当前目录下文件
`ls`
参数： 
`-l #显示详细信息`
`-a #显示隐藏文件`
`-d #查看目录（不查看里面内容）`
`-h #增强可读性`

查看当前目录
`pwd`

删除文件
`rm 文件名`
`-r` #删除包含子目录中的所有内容

移动文件
`mv 原文件目录 新目录`

重命名文件
`mv 源文件名 新文件名`

打开文件/切换目录
`cd 文件/目录名`

文件基本权限
`类型 拥有者权限 所属组权限 其他人权限 拥有者 属组 对象`
`r - read; w - write; x - 执行`

修改权限
`chmod`

创建目录
`mkdir`

### vps
shadowsocksR
https://www.234du.com/1079.html
启动：`/etc/init.d/shadowsocks start`
停止：`/etc/init.d/shadowsocks stop`
重启：`/etc/init.d/shadowsocks restart`
状态：`/etc/init.d/shadowsocks status`

配置文件路径：`/etc/shadowsocks.json`
日志文件路径：`/var/log/shadowsocks.log`
代码安装目录：`/usr/local/shadowsocks`

v2ray
https://blog.sprov.xyz/2019/02/04/v2ray-simple-use/

bbr plus
https://zhuyangyang.xyz/2019/07/30/v2ray-bbr-%E5%AE%8C%E7%BE%8E%E9%85%8D%E7%BD%AE%E6%95%99%E7%A8%8B/

### 进程
进入图形界面，查看所有进程
`ps -aux`

强行结束进程
`kill -9 进程id`

### vi 修改文件
https://www.cnblogs.com/cbreeze/p/6080872.html
```
x        删除当前光标下的字符
dw       删除光标之后的单词剩余部分。
d$       删除光标之后的该行剩余部分。
dd       删除当前行。

c        功能和d相同，区别在于完成删除操作后进入INSERT MODE
cc       也是删除当前行，然后进入INSERT MODE
```
### 登入
远程登入vps
`ssh root@'ip' -p 'port'`

---
### Nginx
安装 Ngnix
`apt-get install nginx`

查看版本号（确认安装成功）
`nginx -v`

配置文件路径
`/etc/nginx/nginx.conf`

启动ngnix
`service nginx start`

浏览器打开服务器public IP，检查ngnix是否启动成功

停止ngnix
`nginx -s stop`

重新加载ngnix
`nginx -s reload`

#### 建立软连接 sites-available -> sites-enabled

ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

ln -s /etc/nginx/sites-available/terminal-b /etc/nginx/sites-enabled/terminal-b

---
### vim
vim 命令行
`apt-get install vim`

---
### Git
安装 Git
`apt-get install git`

查看版本号（确认安装成功）
`git -version`

创建git用户
`adduser git`
按照提示设置密码

赋予git用户sudo权限
`chmod 740 /etc/sudoers`
`vim /etc/sudoers`

此时我是出现没有 /etc/sudoers 的提示
`chmod: cannot access ‘/etc/sudoers’: No such file or directory`
因该是没有安装sudo模块

安装sudo
`apt-get install sudo`

再次执行上述操作
修改如下内容
```
# User privilege specification
root    ALL=(ALL:ALL) ALL
```
修改后
```
# User privilege specification
root    ALL=(ALL:ALL) ALL
git     ALL=(ALL:ALL) ALL
```

修改回文件的权限
`chmod 440 /etc/sudoers`

切换git用户，配置ssh
切换git用户
`su git`

创建.ssh文件夹
`mkdir ~/.ssh`

创建authorized_keys文件并编辑
`vim ~/.ssh/authorized_keys`
保存退出

- 本地
先在本地电脑中获取公钥，再将公钥复制粘贴到authorized_keys
（本地）查看公钥
`cat ~/.ssh/id_rsa.pub | pbcopy`

修改相应权限
`chmod 600 ~/.ssh/authorzied_keys` //只有拥有者有读写权限
`chmod 700 ~/.ssh` //只有拥有者有读、写、执行权限

返回本地客户端，测试是否可以连接上服务器(此时应该免密登陆成功)
`ssh -v git@$ip -p $port`

#### git-hooks

### Node.js

- #### 本地
查看node、npm版本
`node -v`
`npm -v`

清除node.js的cache
`sudo npm cache clean -f`

安装node版本管理模块n
`sudo npm install -g n`

安装最新版本node
`sudo n stable`

安装最新npm
`sudo npm install -g npm`

- #### vps
更新apt-get
`sudo apt-get update`

安装node
`sudo apt-get install nodejs`

安装npm
`sudo apt-get install npm`

全局安装n（npm版本管理器）
`sudo npm install n -g`

安装最新稳定版node
`n stable`

查看版本
`node -v`

### pm2
install
`npm i -g pm2`

check
`pm2`

### mongodb
[install](https://docs.mongodb.com/master/tutorial/install-mongodb-on-debian/)
``

### Python
查看python版本，v大写
`python -V`

下载python
`wget https://www.python.org/ftp/python/3.5.2/Python-3.5.2.tgz`

解压
`tar -zxvf Python-3.5.2.tgz`

进入python文件夹
`cd python ...`

配置
`./configure`

编译, 时间较长
`make`

安装
`make insatll`

查找文件目录
`whereis python` //所有python文件
`which python` //正在进行的python文件

备份原来Python 2.7
`mv /usr/bin/python /user/bin/python_old-2.7`
//转移 原文件目录 新目录

关联新python
`ln -s /usr/local/bin/python3.5 /usr/bin/python`
//关联 新文件目录 原目录


### 防火墙
https://www.cnblogs.com/banwagong/p/8034632.html
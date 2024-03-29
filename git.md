# git

### 常用
```shell
# 初始化项目仓库
git init

# 查看当前git仓库的情况
git status

# 添加[文件名]到git仓库
git add [文件名]

# 查看两次添加的不同
git diff

# 撤销添加
git reset

# 停止追踪[文件名]
# 当.gitignore添加某文件时，该文件已经被git开始追踪了
git rm --cached [文件名]

# 提交版本
git commit -m "[本次提交的描述]"

# 提交所有已追踪文件的所有修改
git commit -a
git commit -am '[提交描述]'

# 修补提交记录
# 如果commit后有文件忘记提交或需要修补，提交会最终合并成 
git commit -m 'initial commit'	# 第一次提交
git add [forgotten_file]
git commit --amend	# 修补提交记录（修改'initial commit'的记录）

# 添加git user 和 email
git config --global user.name "[username]"
git config --global user.email "[email]"

# 更改git关联的编辑器
git config --global  core.editor [vim/编辑器名字]
```

### 分支
```shell
# 查看所有分支
git branch

# 添加分支
git branch [分之名]

# 切换当前分支到[分之名]
git checkout [分之名]

# 将[分之名]合并到当前分支（合并后[分支名]分支还会保留）
git merge [分之名]

# 删除某分支[分之名]
git branch -d [分之名]
git branch -D [分之名]  # 强行删除该分支（可能该分支有东西未提交或者未合并）
```

### 比较

```bash
# 显示出branch1和branch2中差异的部分
git diff branch1 branch2 --stat

# 显示指定文件的详细差异
git diff branch1 branch2 具体文件路径

# 显示出所有有差异的文件的详细差异
git diff branch1 branch2

# 查看branch1分支有，而branch2中没有的log
git log branch1 ^branch2

# 查看branch2中比branch1中多提交了哪些内容
git log branch1..branch2
注意，列出来的是两个点后边（此处即dev）多提交的内容。

# 不知道谁提交的多谁提交的少，单纯想知道有是吗不一样
git log branch1...branch2

# 在上述情况下，在显示出没个提交是在哪个分支上
git log --lefg-right branch1...branch2
# 注意 commit 后面的箭头，根据我们在 –left-right branch1…branch2 的顺序，左箭头 < 表示是 branch1 的，右箭头 > 表示是branch2的。
```



### 远程仓库

```shell
# 添加远程仓库（github/...）
git remote add origin [url]

# 推送当前分支到远程分支，并将当前分支（origin）与远程上游分支[master]关联
git push --set-upstream origin [master]

# 记住远程仓库用户名和密码
git config credential.helper store
git push

# 复制一个git仓库
git clone [url]
```

### 问题
```shell
git stash
git pull
git stash pop
git stash list
git stash drop
```

```shell
# problem
Auto-merging package-lock.json
CONFLICT (content): Merge conflict in package-lock.json
Automatic merge failed; fix conflicts and then commit the result.

# solution
git fetch --all
git reset --hard origin/你需要下拉的分支(默认master)
git fetch
```



### 单独提交 dist => gh-pages
```shell
git add -f dist  # 因为dist文件被.gitignore忽略
git commit -m 'first pages'
git subtree push --prefix dist origin gh-pages
```
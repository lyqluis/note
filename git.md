# git



单独提交 dist -> gh-pages
```shell
git add -f dist  # 因为dist文件被.gitignore忽略
git commit -m 'first pages'
git subtree push --prefix dist origin gh-pages
```
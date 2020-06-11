#hexo

### 基本
创建新文章
`hexo new <article name>`

生成文件并推送
`hexo d -g`

### 推送
安装插件
`npm install hexo-deployer-git --save`

### 添加图片
https://www.cnblogs.com/codehome/p/8428738.html?utm_source=debugrun&utm_medium=referral

根据我的具体实践，在source中新增img文件夹，然后将图片放入
在文章中使用`![](img-name.png)`就可以了

### next主题
http://theme-next.iissnan.com/getting-started.html

#### 顶部加载条
/themes/next/source/lib/pace/pace-theme-minimal.min.css
```
.pace-inactive {
  /* display: none; */
  display: block
}

.pace .pace-progress {
  /* background: #29d; */
  background: #000;
```
/themes/next/source/css/_common/components/header/headerband.styl
```
.headband {
  height: $headband-height;
  // background: $headband-bg;
  background: transparent;
}
```
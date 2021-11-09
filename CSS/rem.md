# 基本概念

- 物理像素：设备上每一个物理显示单元（点）
- 设备逻辑像素（`css`中的`px`）：可以理解为一个虚拟的相对的显示块
- 设备像素比（`dpr`）= 物理像素 / 设备独立像素(`px`)

`1px`的大小通常来说是一致的，这也就意味着，随着`dpr`的增大，物理像素点会越来越小，从而容纳更多的物理像素，才能更高清

> 在js中可以通过`window.devicePixelRatio`获取当前设备的`dpr`

## 图片模糊

> **位图像素**：一个位图像素是图片的最小数据单元，每一个单元都包含具体的显示信息（色彩，透明度，位置等等）

- 对于普通屏幕（`1dpr`）来说，位图像素和物理像素一一对应，没有问题
- 对于高清屏幕（`dpr >= 2`），由于一个`px`由`4`个甚至更多的物理像素组成，那么采用原来的图片，就会造成单个位图像素不能进一步分割，从而出现就近取色的情况，如果取色不均，那么就会导致图片模糊

### 解决

采用**`@2x`、`@3x`的倍图**来适配高清屏幕

> 这就是`iphone6`做的`ui`稿不是`375`，而是`750`的原因

## 1px

- 对于`1dpr`屏幕，`1px`就会显示`1`个物理像素的高度（宽度）

- 对于高清屏幕（`dpr >= 2`），`1px`则会显示`2`或者更多的高度（宽度）

  > 设计稿往往实际是要显示`1`个物理像素高度（宽度）

### 解决

采用`scale`缩放或者设置`meta`

## viewport

- layout viewport
- visual viewport
- ideal viewport

### layout viewport

> 最开始，PC 上的页面是无法在移动端正常显示的，因为屏幕太小，会挤作一团，所以就有了`viewport`的概念，又称布局视口（虚拟视口），这个视口大小接近于`pc`，大部分都是`980px`

### visual viewport

> 有了布局视口，还缺一个承载它的真实视口，也就是移动设备的可视区域的视觉视口（物理视口），这个尺寸随着设备的不同也有不同。这样在视觉视口中创建了一个布局视口，类似`overscroll: scroll`这样，可以通过滚动拖拽、缩放扩大进行较好的访问体验

### ideal viewport

> 像上面的体验在早些年可能比较多，但是近几年几乎很少了，还是归咎于用户体验，所以，我们还需要一个视口-理想视口（同样是虚拟视口），不过这个理想视口的大小是等于布局视口的，这样用户就能得到更好的浏览体验。

### 属性

> `viewport`有六种可以设置的常用属性：

- `width`：定义`layout viewport`的宽度，如果不设置，大部分情况下默认是`980`
- `height`：非常用
- `initial-scale`：可以以某个比例将页面缩放 / 放大，你也可以用它来设置`ideal viewport`：

```
  <meta name='viewport' content='initial-scale=1' />
```

- `maximum-scale`：限制最大放大比例
- `minimum-scale`：限制最小缩小比例
- `user-scalable`：是否允许用户放大 / 缩小页面，默认为`yes`

## rem适配方案

>通过`meta`修正`1px`对应的物理像素数量，在根据统一的设计稿来生成`html`上的动态`font-size`，根据`dpr`构造字体等误差较大的样式的`mixin`

```js
function initRem() {
  const meta = document.querySelector('meta[name="viewport"]');;
  const html = document.documentElement;
  const cliW = html.clientWidth;
  const dpr = window.devicePixelRatio || 1;
  meta.setAttribute('name', 'viewport');
  meta.setAttribute(
      'content',
      `width=${cliW * dpr}, initial-scale=${1 /
          dpr} ,maximum-scale=${1 / dpr}, minimum-scale=${1 /
          dpr},user-scalable=no`
  );
  html.setAttribute('data-dpr', dpr);
  // 这样计算的好处是，你可以直接用ui的px/100得到的就是rem大小，方便快捷，无需mixin
  html.style.fontSize = 10 / 75 * cliW * dpr + 'px';
}

initRem();
window.onresize = window.onorientationchange = initRem();
```

> 对于引入的第三方ui组件，需要使用px2rem转换工具去做整体转换，比如`postcss-pxtorem`：https://github.com/cuth/postcss-pxtorem
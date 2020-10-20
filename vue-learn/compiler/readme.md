# 模版编译
模版编译的主要目标就是**将模版`template`转换成渲染函数`render`**

- `Vue 2.0`需要用到VNode描述视图以及各种交互，用户可以编写类似`template`的模版，通过编译器转化为可返回`vnode`的`render`函数

给一个模版
```html
<div id="demo"> 
  <h1>Vue.js测试</h1>
  <p>{{foo}}</p>
</div>

<script>
// 使⽤el⽅式 
  new Vue({
    data: { foo: 'foo' },
    el: "#demo",
  });
  const app = new Vue({})
  console.log(app.$options.render)
</script>
```
编译出来的`render`函数大致如下
```js
ƒunction anonymous() {
  with (this) {
    return _c('div', { attrs: { "id": "demo" } }, [ 
      _c('h1', [_v("Vue.js测试")]),
      _v(" "),
      _c('p', [_v(_s(foo))])
    ]) 
  }
}
```
>`_c`：`createELement`，创建元素虚拟节点
>`_v`：`createTextVnode`，创建文本节点
>`_s`：`toString`，格式化表达式

## 流程

### 入口
```shell
src/platforms/web/entry-runtime-with-compiler.js
```

在扩展的`$mount`方法中
```js
Vue.prototype.$mount = function () {
  // ...
  // 如果options中不存在render，则将template => render
  if(!options.render){
    // 获取模版template
    let template = // ...
    // ...
    if (template) {
      // * compileToFunctions 将模板字符串 => render函数
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)

      // * 将render函数挂载到当前选项
      options.render = render
      options.staticRenderFns = staticRenderFns

    }
  }
  // ...
}
```

### compileToFunctions
```shell
src/platforms/web/compiler/index.js
```

```js
export const { compile, compileToFunctions } = createCompiler(baseOptions)
```

### createCompiler
```shell
src/compiler/index.js
```

- `parse: template => ast {Object}`，解析：将模版转化为抽象语法树
- `optimize`，优化（添加**静态标记**）
- `generate: ast => code`，根据`ast`生成`code`对象，包含`render`函数的字符串
>字符串转化为函数只需要`new Function(str)`即可

### parse
```shell
src/compiler/parser/index.js
```
将`html`字符转化为`AST`
- HTML解析器
- 文本解析器
- 过滤器解析器

```js
export function parse () {
  // ...
  parseHTML(tempalte, {
    start(tag, attrs, unary){ /* ... */ }, // 遇到开始标签的处理
    end(){ /* ... */ },// 遇到结束标签的处理
    chars(text){ /* ... */ },// 遇到⽂文本标签的处理
    comment(text){ /* ... */ }// 遇到注释标签的处理
  })
  return root
}
```

### optimize
在`AST`上找出静态子树并打上静态标记
- 每次重新渲染不需要为静态节点创建新的节点
- `vnode`中`patch`时，可以跳过静态子树

```shell
src/compiler/optimizer.js
```

```js
export function optimize (root: ?ASTElement, options: CompilerOptions) { 
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '') isPlatformReservedTag = options.isReservedTag || no
  // 找出静态节点并标记 
  markStatic(root)
  // 找出静态根节点并标记 
  markStaticRoots(root, false)
}
```

### generate
```shell
src/compiler/codegen/index.js
```
根据`AST`生成代码字符串
```js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

// ⽣成的code：
`_c('div',{attrs:{"id":"demo"}},[
  _c('h1',[_v("Vue.js测试")]),
  _c('p',[_v(_s(foo))]) 
])`
```

### 指令解析v-if、v-for生成
```js
// src/compiler/parser/index.js
// 解析v-if
function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if') // 获取v-if=“exp"中exp并删除v-if属性 
  if (exp) {
    el.if = exp // 为ast添加if表示条件
    addIfCondition(el, { // 为ast添加ifConditions表示各种情况对应结果
      exp: exp,
      block: el 
    })
  } else { // 其他情况处理理
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true 
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if') 
    if (elseif) {
      el.elseif = elseif 
    }
  } 
}

// 生成代码
// src/compiler/codegen/index.js
function genIfConditions (
  conditions: ASTIfConditions,
  state: CodegenState,
  altGen?: Function,
  altEmpty?: string
): string {
  const condition = conditions.shift() // 每次处理理一个条件 
  if (condition.exp) { // 每种条件生成⼀个三元表达式
    return `(${condition.exp})?${ 
      genTernaryExp(condition.block)
    }:${
      genIfConditions(conditions, state, altGen, altEmpty) 
    }`
  } else {
    return `${genTernaryExp(condition.block)}`
}
// v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {}
}
```

### 插槽
**普通插槽**是在父组件编译和渲染阶段生成`vnode`，数据的作用域是父组件实例，子组件渲染的时候直接拿到这些渲染好的`vnodes` 

**作用域插槽**并不会在父组件编译和渲染的时候直接生成`vnode`，而是在父节点保留了一个`scopedSlots`对象，存储着不同名称的插槽和对应的渲染函数，在子组件编译和渲染阶段再执行这些渲染函数生成`vnode`，其对应的数据作用域为子组件实例

```shell
src/compiler/parser/index.js
```

```js
// 处理<template v-slot:xxx="yyy">
function processSlotContent (el) {
  let slotScope
  // ...
  if(el.tag === 'template'){
    const slotBinding = getAndRemoveAttrByRegex(el, slotRE) // 查找v-slot:xxx 
    if (slotBinding) {
      const { name, dynamic } = getSlotName(slotBinding) // name是xxx 
      el.slotTarget = name // xxx赋值到slotTarget
      el.slotTargetDynamic = dynamic
      el.slotScope = slotBinding.value || emptySlotScopeToken // yyy赋值到slotScope
    }
  }
}

// 处理 <slot> 
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name')
  }
}
```

生成代码
```js
// src/compiler/codegen/index.js
function genScopedSlots (el, slots, state) {
 // 这⾥把slotScope作为形参转换为⼯⼚函数返回内容
 const fn = `function(${slotScope}){` + 
  `return ${el.tag === 'template' 
    ? el.if && isLegacySyntax
      ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined` 
      : genChildren(el, state) || 'undefined'
    : genElement(el, state)
  }}`
  // reverse proxy v-slot without scope on this.$slots
  const reverseProxy = slotScope ? `` : `,proxy:true`
  return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
}
```
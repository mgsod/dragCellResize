## dragCellResize

拖拽表格列宽，支持Vue指令

## 安装

### npm & yarn

```
npm install drag-cell-resize

yarn add drag-cell-resize
```

### cdn

umd版本（包含指令和DragCellResize类）:

```
<script src="https://unpkg.com/drag-cell-resize/dist/index.min.js"></script>
```

var版本（仅包含DragCellResize类）：

```
<script src="https://unpkg.com/drag-cell-resize/dist/index.var.js"></script>
```



### 使用方式

* #### 在Vue中使用

[Vue Demo](https://mgsod.github.io/front-end/dragCellResize.html#demo "Vue Demo")

 1.作为指令使用
 ```js
 import Vue from 'vue'
 import directive from 'drag-cell-resize'
 Vue.use(directive)
 ```
```vue
<template>
    <table v-drag-cell-resize>...</table>
</template>
```
指令不仅仅可以绑定在table中,只要其包含`table`表格都可以绑定,例如:
```vue
<template>
    <div v-drag-cell-resize>
      <table>...</table>
    </div>
</template>
```

 2.直接调用DragCellResize类
 ```vue
 <template>
     <table refs="table">...</table>
 </template>
 <script >
     import {DragCellResize} from 'drag-cell-resize'
    export default {
        mounted(){
           new DragCellResize(this.$refs['table'])
        }
    }   
 </script>
 ```

* #### 不使用Vue的情况下
```html
<html>
<body>
    <table id="table">...</table>
</body>
</html>
<script src="https://unpkg.com/drag-cell-resize/dist/index.var.js"></script>
<script >
    // index.var.js中仅仅只有DragCellResize类
    new DragCellResize(document.getElementById('table'))
</script>
```

### DragCellResize类

指令本质上就是在bind时实例化了`DragCellResize`类.

> 注：在使用v-drag-cell-resize的时候,由于某些情况下thead或者整个table都还未被渲染(例如使用了v-if),指令无法在`bind`或`insert`钩子上获取到dom对象.所以如果在`bind`阶段未找到dom的话,指令会尝试在update钩子上获取表格的dom对象及绑定事件.
>尽管用到了update钩子，会多次触发指令绑定,但是外部用了`Map`来缓存`dom`和`DragCellResize`的关系,.所以`DragCellResize`一旦被实例化后不会便不会再重复实例化和绑定事件.

构造参数
new DragCellResize(el,callbakc,isCustom)

| 参数 | 释义 | 是否必填 |
| :-----| :----: | :----: |
| el | 欲绑定的Dom元素，不限于表格,只要包含表格即可 |  是  |
| callback |  完成拖拽后的回调函数/自定义处理拖拽。可在拖拽后执行某些操作  |  否（如果isCustom为true,callback必传）  |
| isCustom |  是否自定义处理拖拽操作，如果为true，拖拽的后不会设置列宽，交由callback处理  |   否 |

[Demo](https://mgsod.github.io/front-end/dragCellResize.html#demo "Vue Demo")


### 注意事项:

由于`td`会动态分配整个`table`的宽度,进而导致实际设置的`width`大小不是`td`的真实宽度.就会导致拖拽的宽度不是实际得到的大小.例如,明明拖拽后总宽度是100px,实际上表现的会超过100px.无法对齐到虚线处

所以需要对表格的`th`,`td`增加css样式.设置其`box-sizing`为`border-box`

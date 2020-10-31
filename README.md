## dragCellResize

拖拽表格列宽，支持Vue指令

## 安装

### npm & yarn

`npm install drag-cell-resize`

`yarn add drag-cell-resize`

### cdn

umd版本（包含指令和DragCellResize类）:`<script src="https://unpkg.com/drag-cell-resize/dist/index.min.js"></script>`

var版本（仅包含DragCellResize类）：`<script src="https://unpkg.com/drag-cell-resize/dist/index.var.js"></script>`



### 使用方式

* ####在Vue中使用

Vue Demo[Vue Demo](https://mgsod.github.io/front-end/dragCellResize.html#demo "Vue Demo")

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

> 注：在使用v-drag-cell-resize时，会在bind和update钩子上尝试获取表格的dom对象及绑定事件，
>虽然用到了update钩子，但是DragCellResize只会被实例化一次，不用担心事件重复绑定和重复实例化

构造参数
new DragCellResize(el,callbakc,isCustom)

| 参数 | 释义 | 是否必填 |
| :-----| :----: | :----: |
| el | 欲绑定的Dom元素，不限于表格,只要包含表格即可 |  是  |
| callback |  完成拖拽后的回调函数/自定义处理拖拽。可在拖拽后执行某些操作  |  否（如果isCustom为true,callback必传）  |
| isCustom |  是否自定义处理拖拽操作，如果为true，拖拽的后不会设置列宽，交由callback处理  |   否 |

Demo[Demo](https://mgsod.github.io/front-end/dragCellResize.html#demo "Vue Demo")
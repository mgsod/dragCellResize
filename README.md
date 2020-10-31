* Vue中以指令方式
```js
import Vue from 'vue'
import dragCellResize from 'drag-cell-resize'
Vue.use(dragCellResize);
```
* Vue中以 new DragCellResize()来调用
```js
import {DragCellResize} from 'drag-cell-resize'
export default {
    mounted(){
        new DragCellResize(this.$refs['table'],()=>{},false)
        // DragCellResize三个参数，第一个是要绑定的dom对象，
        // 第二个为回调函数，第三个为是否自定义拖拽行为
    }   
}
```
## Demo
### 1 默认拖拽行为

 仅仅只需要在table上绑定`v-drag-cell-resize`,指令会自动完成拖拽列宽操作

::: demo
```html
<template>
    <div>
         <table v-drag-cell-resize>
                <colgroup>
                   <col v-for="item in 5" width="120px">
                </colgroup>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Points</th>
                    <th>Age</th>
                    <th>Sec</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in 5">
                    <td>Jill</td>
                    <td>Smith</td>
                    <td>50</td>
                    <td>18</td>
                    <td>Man</td>
                </tr>
                </tbody>
            </table>
         <table v-drag-cell-resize>
                <colgroup>
                   <col v-for="item in 6" width="100px">
                </colgroup>
            <thead>
            <tr>
                <th colspan="2">A</th>
                <th colspan="3">B</th>
                <th>C</th>
           
            </tr>
            <tr>
                <th>A1</th>
                <th>A2</th>
                <th>B1</th>
                <th>B2</th>
                <th>B3</th>
                <th>C</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in 6">
                <td>Jill</td>
                <td>Smith</td>
                <td>50</td>
                <td>18</td>
                <td>Man</td>
                <td>Man</td>
            </tr>
            </tbody>
        </table>
    </div>
	
</template>
<style>
 th,td{
    box-sizing: border-box; 
}
</style>
```
:::

### 2 添加回调函数

`v-drag-cell-resizez`接受一个值（Function）作为拖拽结束后的回调，再拖拽完成后会自动执行该函数

回调参数

 * event:鼠标事件参数
 * dragResize:拖拽的实例对象，其中包含offsetX(此次拖拽的偏移量)，cell（当前拖拽的单元格）
 

::: demo
```html
<template>
	<table v-drag-cell-resize="dragEnd">
             <colgroup>
                 <col v-for="item in 5" width="120px">
              </colgroup>
            <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Points</th>
                <th>Age</th>
                <th>Sec</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in 5">
                <td>Jill</td>
                <td>Smith</td>
                <td>50</td>
                <td>18</td>
                <td>Man</td>
            </tr>
            </tbody>
        </table>
    <div>拖拽偏移量：{{offsetX}}</div>
    <div></div>
</template>
<script>
  export default {
    data: () => ({ message: "Hello World",offsetX:0}),
    methods: {
      dragEnd(e,dragCellResize) {
        let{offsetX,cell} = dragCellResize;
        this.offsetX = offsetX;
        console.log(e,offsetX,cell);
      },
    },
  };
</script>
<style>
 th,td{
    box-sizing: border-box; 
}
</style>
```
:::

### 3 自定义拖拽行为

`v-drag-cell-resize.custom="dragEnd"`

给指令传入`.custom`修饰符将会由`dragEnd`接管拖拽行为，这时候指令不会自动设置列宽，而是由传入的函数自行决定。
必要的拖拽参数在dragEnd的回调参数中可以取到.

`dragCellResize`对象中的`cell`为当前拖拽的单元格，通过修改该单元格属性来达到想要的结果

#### eg1：每次拖拽2倍宽度，设置单元格背景色
::: demo
```html
<template>
	<table v-drag-cell-resize.custom="dragEnd">
             <colgroup>
                 <col v-for="item in 6" width="100px">
              </colgroup>
            <thead>
            <tr>
                <th colspan="2">A</th>
                <th colspan="3">B</th>
                <th>C</th>
           
            </tr>
            <tr >
                <th>A1</th>
                <th>A2</th>
                <th>B1</th>
                <th>B2</th>
                <th>B3</th>
                <th>C</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in 6">
                <td>Jill</td>
                <td>Smith</td>
                <td>50</td>
                <td>18</td>
                <td>Man</td>
                <td>Man</td>
            </tr>
            </tbody>
        </table>
</template>
<script>
  export default {
    data: () => ({ message: "Hello World" }),
    methods: {
      dragEnd(e,dragCellResize) {
        console.log(dragCellResize)
        let{offsetX,cell} = dragCellResize
        cell.style.width = cell.offsetWidth + (offsetX*2)+'px';
        cell.style.backgroundColor = '#409eff'
       
      },
    },
  };
</script>
<style>
 th,td{
    box-sizing: border-box; 
}
</style>
```
:::

#### eg2：thead由另一个table组成。

在某些情况下，为了固定表头，我们会时使用另一个table来做表头。对于这种情况，使用`.custom`修饰符接管拖拽行为，然后自行设置列宽


::: demo
```html
<template>
    <div ref="table" class="table" v-drag-cell-resize.custom="dragEnd">
        <table class="thead"  style="margin-bottom: -17px">
            <colgroup>
                <col v-for="item in 5" :data-key="item" width="120px">
            </colgroup>
            <thead>
                <tr>
                   <th>First Name</th>
                   <th>Last Name</th>
                   <th>Points</th>
                   <th>Age</th>
                   <th>Sec</th>
                </tr>
            </thead>
        </table>
        <table ref="tbody">
                  <colgroup>
                    <col v-for="item in 5" :data-key="item" width="120px">
                  </colgroup>
                    <tbody>
                    <tr v-for="item in 5">
                        <td>Adam</td>
                        <td>Johnson</td>
                        <td>67</td>
                        <td>18</td>
                        <td>Man</td>
                    </tr>
                    </tbody>
         </table>
    </div>
	
</template>
<script>
  export default {
    data: () => ({ message: "Hello World" }),
    methods: {
      dragEnd(e,dragCellResize) {       
        let{offsetX,cell} = dragCellResize;
        // 获取当前单元格个拖拽的索引
        let cellIndex = [].indexOf.call(cell.parentElement.children,cell)+1;
        this.$refs['table'].querySelectorAll(`col[data-key='${cellIndex}']`).forEach(item =>{
            item.width = `${parseFloat(item.width) + offsetX}px`        
        })          
       
      },
    },
  };
</script>
<style>
 th,td{
    box-sizing: border-box; 
    font-size: 14px;
    padding: 8px 20px;
}
</style>
```
:::
此例中的表格由两个table组成，包裹在div中。这时，可以将`v-drag-cell-resize`指令绑定在div上面.
然后从`dragEnd`回调参数中拿到当前单元格和offsetX,随即可以通过单元格获取到索引。然后再统一设置`col`的`width`属性来更新两个表格中的列宽


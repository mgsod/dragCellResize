import {DirectiveBinding} from "vue/types/options";

let tableResizeMap: Map<HTMLElement, DragCellResize> = new Map();

class DragCellResize {
    allowResize = false
    table: HTMLElement
    thead: HTMLElement
    dragLeftLine: HTMLElement
    dragRightLine: HTMLElement
    callback: Function
    custom: boolean
    offsetX: number = 0
    resizedWidth: number = 0
    cell: HTMLElement
    cellIndex:number = -1

    constructor(table: HTMLElement, callback?: Function, custom?: boolean) {
        this.table = table;
        this.thead = (table.querySelector('thead') as HTMLElement);
        if (this.thead) {
            tableResizeMap.set(table, this)
            this.bindTheadEvent()
                .appendDragLine();
            if (callback) this.callback = callback;
            this.custom = !!custom
        }


    }

    // 绑定事件
    bindTheadEvent(): DragCellResize {
        this.thead.onmousemove = (e: MouseEvent) => {
            let cell: HTMLElement = (e.target as HTMLElement);
            // 如果当前鼠标位置大于单元格宽段-5 且当前鼠标放在表头
            if ((e.offsetX >= cell.offsetWidth - 5) && cell.tagName === 'TH') {
                // 设置鼠标样式
                cell.style.cursor = 'col-resize';
                this.allowResize = true
            } else {
                cell.style.cursor = 'default'
                this.allowResize = false
            }

        }
        this.thead.onmousedown = (e: MouseEvent) => {
            if (!this.allowResize) return
            let cell: HTMLElement = (e.target as HTMLElement);
            this.cell = cell
            let cellOffsetWidth = cell.offsetWidth;
            // 获取表格距离屏幕左侧的距离
            let containerBoundingLeft = this.table.getBoundingClientRect().left;
            // 单元格距离屏幕左侧的距离
            let cellLeft = cell.getBoundingClientRect().left;
            // 显示辅助线
            this.dragLeftLine.style.display = 'block'
            this.dragRightLine.style.display = 'block'
            // 左边的辅助线的位置等于 单元格距离左侧 - 容器距离左侧的位置 (辅助线是相对于表格定位,而非屏幕)
            this.dragLeftLine.style.left = `${cellLeft - containerBoundingLeft}px`;
            this.dragRightLine.style.left = `${e.clientX - containerBoundingLeft}px`;
            let start = e.clientX;
            this.table.onmousemove = (e: MouseEvent) => {
                // 拖拽期间表格的鼠标样式
                this.table.style.cursor = 'col-resize';
                this.dragRightLine.style.left = `${e.clientX - containerBoundingLeft}px`;
            }
            this.table.onmouseup = (e: MouseEvent) => {
                // 鼠标样式,线条样式,table事件注销
                this.table.onmousemove = this.table.onmouseup = null;
                this.dragLeftLine.style.display = 'none';
                this.dragRightLine.style.display = 'none';
                this.allowResize = false;
                this.table.style.cursor = 'default';

                // 偏移量
                let offsetX = e.clientX - start;
                this.offsetX = offsetX
                this.resizedWidth = cellOffsetWidth + offsetX;
                let list = this.cell.parentElement!.childNodes
                this.cellIndex = ([].slice.call(list) as HTMLElement[]).indexOf(this.cell)
                // 如果用custom为true,单元格宽度交由用户处理
                if (this.custom && this.callback) {
                    this.callback(e, this)
                } else {
                    // 设置宽度
                    cell.style.width = cellOffsetWidth + offsetX + 'px';
                    // 如果有回调则执行
                    this.callback && this.callback(e, this);
                }


            }
        }
        return this
    }

    // 添加辅助线
    appendDragLine(): void {
        let lineStyle = `  
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    height: 100%;
                    display:none;
                    width: 2px;
                    z-index:9999;
                    border-left: 1px dotted #000;`
        let dragLine = this.table.querySelectorAll('.dragLine');
        if (dragLine.length > 0) {
            this.dragLeftLine = <HTMLElement>dragLine[0]
            this.dragRightLine = <HTMLElement>dragLine[1]
        } else {
            let dragLine = document.createElement('div');
            dragLine.setAttribute('class', 'dragLine')
            dragLine.style.cssText = lineStyle;
            this.dragLeftLine = dragLine;
            this.dragRightLine = <HTMLElement>dragLine.cloneNode(true);
            this.table.appendChild(this.dragLeftLine)
            this.table.appendChild(this.dragRightLine);
        }
        this.table.style.position = 'relative';
    }

}

function init(el: HTMLElement, binding: DirectiveBinding) {
    let dcr = tableResizeMap.get(el)
    if (dcr) {
        tableResizeMap.delete(el);
        // @ts-ignore 释放对象
        dcr = null;
    }
    // 传入指令的值 该值为一个回调函数
    let {value: callback, modifiers} = binding;
    let custom = modifiers?.custom;
    if (custom && !callback) {
        throw new Error('当指令含有custom修饰符时,必须给指令传入一个函数.eg:v-drag-resize.custom="Function"')
    }
    if (callback && typeof callback !== 'function') {
        throw new Error('指令的值为一个函数')
    }
    new DragCellResize(el, callback, custom)
}

export default {
    install: function (Vue: { directive: any; }) {
        Vue.directive('drag-cell-resize', {
            bind: init,
            componentUpdated: init
        })
    }
}
export {
    DragCellResize
}
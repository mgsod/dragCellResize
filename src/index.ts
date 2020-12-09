import {DirectiveBinding} from "vue/types/options";
// 用来存储绑定容器和DragCellResize类的关系
// 由于在使用vue指令时候componentUpdated会频繁触发,导致DragCellResize重复实例化
// 这时候就可以通过这个Map来清除销毁之前的实例
const tableResizeMap: Map<HTMLElement, DragCellResize> = new Map();

class DragCellResize {
    private allowResize = false
    private dragLeftLine: HTMLElement
    private dragRightLine: HTMLElement
    private readonly callback: Function
    private readonly custom: boolean
    private readonly table: HTMLElement
    private readonly thead: HTMLElement
    // 事件句柄,为了能添加和移除对应的事件 需要保留事件句柄
    private tableOnmousemoveHandler: EventListener
    private tableOnmouseupHandler: EventListener
    private theadMousedownHandler: EventListener
    private theadMousemoveHandler: EventListener
    // 暴露属性
    // 此次拖拽偏移量
    offsetX: number = 0
    // 拖拽后的宽度
    resizedWidth: number = 0
    // 当前拖拽的单元格
    cell: HTMLElement
    // 当前拖拽单元格索引
    cellIndex: number = -1


    constructor(table: HTMLElement, callback?: Function, custom?: boolean) {
        this.table = table;
        this.thead = (table.querySelector('thead') as HTMLElement);
        if (this.thead) {
            tableResizeMap.set(table, this);
            this.bindTheadEvent()
                .appendDragLine();
            if (callback) this.callback = callback;
            this.custom = !!custom
        }


    }

    // 绑定事件
    private bindTheadEvent(): DragCellResize {
        // 绑定表头鼠标按下事件
        this.theadMousedownHandler = <EventListener>this.theadOnMousedown.bind(this);
        this.thead.addEventListener('mousedown', this.theadMousedownHandler);

        // 绑定表头鼠标移动事件
        this.theadMousemoveHandler = <EventListener>this.theadOnMousemove.bind(this);
        this.thead.addEventListener('mousemove', this.theadMousemoveHandler);
        return this
    }


    // 整个表格鼠标移动事件
    private tableOnmousemove(containerBoundingLeft: number) {
        // 将containerBoundingLeft参数柯里化 返回用于EventListener的回调函数
        return (e: MouseEvent) => {
            // 拖拽期间表格的鼠标样式
            this.table.style.cursor = 'col-resize';
            this.dragRightLine.style.left = `${e.clientX - containerBoundingLeft}px`;
        }

    }

    // 表格鼠标弹起事件
    private tableOnmouseup(cell: HTMLElement, start: number, cellOffsetWidth: number): Function {
        // 将cell start cellOffsetWidth参数柯里化 返回用于EventListener的回调函数
        return (e: MouseEvent) => {
            this.reset();
            // 偏移量
            let offsetX = e.clientX - start;
            this.offsetX = offsetX
            this.resizedWidth = cellOffsetWidth + offsetX;
            let list = this.cell.parentElement!.childNodes
            this.cellIndex = Array.from(list).indexOf(this.cell)
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

    // 表头鼠标按下事件
    private theadOnMousedown(e: MouseEvent) {
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


        this.tableOnmousemoveHandler = <EventListener>this.tableOnmousemove(containerBoundingLeft).bind(this);
        this.tableOnmouseupHandler = <EventListener>this.tableOnmouseup(cell, start, cellOffsetWidth).bind(this);
        this.table.addEventListener('mousemove', this.tableOnmousemoveHandler)
        this.table.addEventListener('mouseup', this.tableOnmouseupHandler)
    }

    // 表头鼠标移动事件
    private theadOnMousemove(e: MouseEvent) {
        const cell: HTMLElement = (e.target as HTMLElement);
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

    // 重置辅助线,鼠标,事件
    reset() {
        this.removeListener();
        this.dragLeftLine.style.display = 'none';
        this.dragRightLine.style.display = 'none';
        this.allowResize = false;
        this.table.style.cursor = 'default';
    }

    // 移除事件监听
    private removeListener() {
        this.table.removeEventListener('mousemove', this.tableOnmousemoveHandler);
        this.table.removeEventListener('mouseup', this.tableOnmouseupHandler);
    }

    // 添加辅助线
    private appendDragLine(): void {
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

    destroy() {
        this.reset()
        this.thead.removeEventListener('mousedown', this.theadMousedownHandler);
        this.thead.removeEventListener('mousemove', this.theadMousemoveHandler);

    }

}

function init(el: HTMLElement, binding: DirectiveBinding) {
    let dcr = tableResizeMap.get(el)
    if (dcr) {
        tableResizeMap.delete(el);
        dcr.destroy();
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

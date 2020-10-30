let tableResizeMap = new Map();
class DragCellResize {
    constructor(table, callback, custom) {
        this.allowResize = false;
        this.offsetX = 0;
        this.table = table;
        this.thead = table.querySelector('thead');
        if (this.thead) {
            tableResizeMap.set(table, this);
            this.bindTheadEvent().appendDragLine();
            this.callback = callback;
            this.custom = !!custom;
        }
    }
    // 绑定事件
    bindTheadEvent() {
        this.thead.onmousemove = (e) => {
            let cell = e.target;
            // 如果当前鼠标位置大于单元格宽段-5 且当前鼠标放在表头
            if ((e.offsetX >= cell.offsetWidth - 5) && cell.tagName === 'TH') {
                // 设置鼠标样式
                cell.style.cursor = 'col-resize';
                this.allowResize = true;
            }
            else {
                cell.style.cursor = 'default';
                this.allowResize = false;
            }
        };
        this.thead.onmousedown = (e) => {
            if (!this.allowResize)
                return;
            let cell = e.target;
            this.cell = cell;
            let cellOffsetWidth = cell.offsetWidth;
            // 获取表格距离屏幕左侧的距离
            let containerBoundingLeft = this.table.getBoundingClientRect().left;
            // 单元格距离屏幕左侧的距离
            let cellLeft = cell.getBoundingClientRect().left;
            // 显示辅助线
            this.dragLeftLine.style.display = 'block';
            this.dragRightLine.style.display = 'block';
            // 左边的辅助线的位置等于 单元格距离左侧 - 容器距离左侧的位置 (辅助线是相对于表格定位,而非屏幕)
            this.dragLeftLine.style.left = `${cellLeft - containerBoundingLeft}px`;
            this.dragRightLine.style.left = `${e.clientX - containerBoundingLeft}px`;
            let start = e.clientX;
            this.table.onmousemove = (e) => {
                // 拖拽期间表格的鼠标样式
                this.table.style.cursor = 'col-resize';
                this.dragRightLine.style.left = `${e.clientX - containerBoundingLeft}px`;
            };
            this.table.onmouseup = (e) => {
                // 鼠标样式,线条样式,table事件注销
                this.table.onmousemove = this.table.onmouseup = null;
                this.dragLeftLine.style.display = 'none';
                this.dragRightLine.style.display = 'none';
                this.allowResize = false;
                this.table.style.cursor = 'default';
                // 偏移量
                let offsetX = e.clientX - start;
                // 如果用custom为true,单元格宽度交由用户处理
                if (this.custom && this.callback) {
                    this.offsetX = offsetX;
                    this.callback(e, this);
                }
                else {
                    // 设置宽度
                    cell.style.width = cellOffsetWidth + offsetX + 'px';
                    // 如果有回调则执行
                    this.callback && this.callback();
                }
            };
        };
        return this;
    }
    // 添加辅助线
    appendDragLine() {
        let lineStyle = `  
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    height: 100%;
                    display:none;
                    width: 2px;
                    z-index:9999;
                    border-left: 1px dotted #000;`;
        this.dragLeftLine = document.createElement('div');
        this.dragRightLine = document.createElement('div');
        this.dragLeftLine.style.cssText = this.dragRightLine.style.cssText = lineStyle;
        this.table.style.position = 'relative';
        this.table.appendChild(this.dragLeftLine);
        this.table.appendChild(this.dragRightLine);
        return this;
    }
}
function init(el, binding) {
    if (tableResizeMap.get(el))
        return;
    // 传入指令的值 该值为一个回调函数
    let { value: callback, modifiers } = binding;
    let custom = modifiers === null || modifiers === void 0 ? void 0 : modifiers.custom;
    if (custom && !callback) {
        throw new Error('当指令含有custom修饰符时,必须给指令传入一个函数.eg:v-drag-resize.custom="Function"');
    }
    if (callback && typeof callback !== 'function') {
        throw new Error('指令的值为一个函数');
    }
    new DragCellResize(el, callback, custom);
}
export default {
    install: function (Vue) {
        Vue.directive('drag-cell-resize', {
            bind: init,
            componentUpdated: init
        });
    }
};
export { DragCellResize };

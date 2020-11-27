var tableResizeMap = new Map();
var DragCellResize = /** @class */ (function () {
    function DragCellResize(table, callback, custom) {
        this.allowResize = false;
        this.offsetX = 0;
        this.resizedWidth = 0;
        this.cellIndex = -1;
        this.table = table;
        this.thead = table.querySelector('thead');
        if (this.thead) {
            tableResizeMap.set(table, this);
            this.bindTheadEvent()
                .appendDragLine();
            if (callback)
                this.callback = callback;
            this.custom = !!custom;
        }
    }
    // 绑定事件
    DragCellResize.prototype.bindTheadEvent = function () {
        var _this = this;
        this.thead.onmousemove = function (e) {
            var cell = e.target;
            // 如果当前鼠标位置大于单元格宽段-5 且当前鼠标放在表头
            if ((e.offsetX >= cell.offsetWidth - 5) && cell.tagName === 'TH') {
                // 设置鼠标样式
                cell.style.cursor = 'col-resize';
                _this.allowResize = true;
            }
            else {
                cell.style.cursor = 'default';
                _this.allowResize = false;
            }
        };
        this.thead.onmousedown = function (e) {
            if (!_this.allowResize)
                return;
            var cell = e.target;
            _this.cell = cell;
            var cellOffsetWidth = cell.offsetWidth;
            // 获取表格距离屏幕左侧的距离
            var containerBoundingLeft = _this.table.getBoundingClientRect().left;
            // 单元格距离屏幕左侧的距离
            var cellLeft = cell.getBoundingClientRect().left;
            // 显示辅助线
            _this.dragLeftLine.style.display = 'block';
            _this.dragRightLine.style.display = 'block';
            // 左边的辅助线的位置等于 单元格距离左侧 - 容器距离左侧的位置 (辅助线是相对于表格定位,而非屏幕)
            _this.dragLeftLine.style.left = cellLeft - containerBoundingLeft + "px";
            _this.dragRightLine.style.left = e.clientX - containerBoundingLeft + "px";
            var start = e.clientX;
            _this.table.onmousemove = function (e) {
                // 拖拽期间表格的鼠标样式
                _this.table.style.cursor = 'col-resize';
                _this.dragRightLine.style.left = e.clientX - containerBoundingLeft + "px";
            };
            _this.table.onmouseup = function (e) {
                // 鼠标样式,线条样式,table事件注销
                _this.table.onmousemove = _this.table.onmouseup = null;
                _this.dragLeftLine.style.display = 'none';
                _this.dragRightLine.style.display = 'none';
                _this.allowResize = false;
                _this.table.style.cursor = 'default';
                // 偏移量
                var offsetX = e.clientX - start;
                _this.offsetX = offsetX;
                _this.resizedWidth = cellOffsetWidth + offsetX;
                var list = _this.cell.parentElement.childNodes;
                _this.cellIndex = [].slice.call(list).indexOf(_this.cell);
                // 如果用custom为true,单元格宽度交由用户处理
                if (_this.custom && _this.callback) {
                    _this.callback(e, _this);
                }
                else {
                    // 设置宽度
                    cell.style.width = cellOffsetWidth + offsetX + 'px';
                    // 如果有回调则执行
                    _this.callback && _this.callback(e, _this);
                }
            };
        };
        return this;
    };
    // 添加辅助线
    DragCellResize.prototype.appendDragLine = function () {
        var lineStyle = "  \n                    position: absolute;\n                    top: 0;\n                    bottom: 0;\n                    height: 100%;\n                    display:none;\n                    width: 2px;\n                    z-index:9999;\n                    border-left: 1px dotted #000;";
        var dragLine = this.table.querySelectorAll('.dragLine');
        if (dragLine.length > 0) {
            this.dragLeftLine = dragLine[0];
            this.dragRightLine = dragLine[1];
        }
        else {
            var dragLine_1 = document.createElement('div');
            dragLine_1.setAttribute('class', 'dragLine');
            dragLine_1.style.cssText = lineStyle;
            this.dragLeftLine = dragLine_1;
            this.dragRightLine = dragLine_1.cloneNode(true);
            this.table.appendChild(this.dragLeftLine);
            this.table.appendChild(this.dragRightLine);
        }
        this.table.style.position = 'relative';
    };
    return DragCellResize;
}());
function init(el, binding) {
    var dcr = tableResizeMap.get(el);
    if (dcr) {
        tableResizeMap.delete(el);
        // @ts-ignore 释放对象
        dcr = null;
    }
    // 传入指令的值 该值为一个回调函数
    var callback = binding.value, modifiers = binding.modifiers;
    var custom = modifiers === null || modifiers === void 0 ? void 0 : modifiers.custom;
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

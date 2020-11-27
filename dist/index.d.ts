declare class DragCellResize {
    allowResize: boolean;
    table: HTMLElement;
    thead: HTMLElement;
    dragLeftLine: HTMLElement;
    dragRightLine: HTMLElement;
    callback: Function;
    custom: boolean;
    offsetX: number;
    resizedWidth: number;
    cell: HTMLElement;
    cellIndex: number;
    constructor(table: HTMLElement, callback?: Function, custom?: boolean);
    bindTheadEvent(): DragCellResize;
    appendDragLine(): void;
}
declare const _default: {
    install: (Vue: {
        directive: any;
    }) => void;
};
export default _default;
export { DragCellResize };

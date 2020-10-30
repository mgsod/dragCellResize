declare class DragCellResize {
    allowResize: boolean;
    table: HTMLElement;
    thead: HTMLElement;
    dragLeftLine: HTMLElement;
    dragRightLine: HTMLElement;
    callback: Function | undefined;
    custom: boolean;
    offsetX: number;
    cell: HTMLElement;
    constructor(table: HTMLElement, callback?: Function | undefined, custom?: boolean);
    bindTheadEvent(): DragCellResize;
    appendDragLine(): DragCellResize;
}
declare const _default: {
    install: (Vue: {
        directive: any;
    }) => void;
};
export default _default;
export { DragCellResize };

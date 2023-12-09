declare class CanvasStyle {
    private target;
    constructor(cvs: HTMLCanvasElement);
    set touchAction(val: string);
    set cursor(val: string);
}
export declare class PaintCanvas {
    private classname;
    private render_cvs;
    constructor(classname: string);
    set width(val: number);
    set height(val: number);
    toDataURL: () => string;
    getContext: (ctx: string) => PaintContext;
    get element(): HTMLCanvasElement;
    style: CanvasStyle;
}
export declare class PaintContext {
    private render_ctx;
    constructor(ctx: CanvasRenderingContext2D);
    set strokeStyle(val: string);
    set lineWidth(val: number);
    set lineJoin(val: CanvasLineJoin);
    set lineCap(val: CanvasLineCap);
    set fillStyle(val: string);
    set globalCompositeOperation(val: GlobalCompositeOperation);
    clearRect: (x: number, y: number, w: number, h: number) => void;
    beginPath: () => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    closePath: () => void;
    arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean) => void;
    fill: () => void;
    stroke: () => void;
    drawImage(image: CanvasImageSource, x: number, y: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
}
export {};

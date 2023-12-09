import Konva from "konva";
export type PaintEvent = {
    X: number;
    Y: number;
    type: "touch" | "mouse" | "pen";
    pressure: number;
};
export interface CanvasInterface {
    Name: string;
    HistoryName?: string;
    Tip?: string;
    ImgName?: string;
    CursorName?: string;
    CanFinishDrawing: boolean;
    PointerDown?: (e: PaintEvent) => void;
    PointerMove?: (e: PaintEvent) => void;
    PointerUp?: (e: PaintEvent) => void;
    PointerOut?: (e: PaintEvent) => void;
    RightPointerDown?: (e: PaintEvent) => void;
    RightPointerUp?: (e: PaintEvent) => void;
    DrawFunction: (ctx: Konva.Group, width: number, height: number, rotate: number) => void;
    CompositeOperation: GlobalCompositeOperation;
    Settings?: CanvasInterfaceSettings;
}
export declare enum CanvasSettingType {
    Number = 0,
    Color = 1,
    Boolean = 2
}
export type CanvasSettingEntry<DATATYPE> = {
    type: CanvasSettingType;
    label: string;
    info?: any;
    value: DATATYPE;
};
export type CanvasInterfaceSettings = {
    Name?: string;
    ImgName?: string;
    Settings?: Map<string, CanvasSettingEntry<any>>;
};
export declare class DragAndDropDrawBase implements CanvasInterface {
    Name: string;
    private _canfinishDrawing;
    get CanFinishDrawing(): boolean;
    protected LastX: number;
    protected LastY: number;
    protected NextX: number;
    protected NextY: number;
    protected ifDrawing: boolean;
    protected ifMouseMove: boolean;
    protected shapeID: string;
    protected courtName: string;
    PointerDown(e: PaintEvent): void;
    PointerMove(e: PaintEvent): void;
    PointerUp(e: PaintEvent): void;
    PointerOut(e: PaintEvent): void;
    protected rotatedDelta(radian: number): [number, number];
    protected rotatedPoint(x: number, y: number, radian: number): [number, number];
    DrawFunction(ctx: Konva.Group, width: number, height: number, rotate: number): void;
    CompositeOperation: GlobalCompositeOperation;
    set Settings(setting: CanvasInterfaceSettings);
    get Settings(): CanvasInterfaceSettings;
}
export declare class ClickDrawBase implements CanvasInterface {
    Name: string;
    private _canfinishDrawing;
    get CanFinishDrawing(): boolean;
    protected LastX: number;
    protected LastY: number;
    protected NextX: number;
    protected NextY: number;
    protected ifDrawing: boolean;
    protected ifMouseMove: boolean;
    protected shapeID: string;
    protected points: [number, number][];
    protected courtName: string;
    PointerDown(e: PaintEvent): void;
    PointerMove(e: PaintEvent): void;
    PointerUp(e: PaintEvent): void;
    RightPointerUp(e: PaintEvent): void;
    PointerOut(e: PaintEvent): void;
    protected rotatedDelta(radian: number, offsetX?: number, offsetY?: number): [number, number];
    protected rotatedPoint(x: number, y: number, radian: number): [number, number];
    DrawFunction(ctx: Konva.Group, width: number, height: number, rotate: number): void;
    CompositeOperation: GlobalCompositeOperation;
    set Settings(setting: CanvasInterfaceSettings);
    get Settings(): CanvasInterfaceSettings;
}
export declare class NoOPCVSFunc extends DragAndDropDrawBase {
}
export interface CanvasBase {
    name: string;
    attachCanvas: (container: HTMLDivElement) => void;
    setFunction: (func: CanvasInterface) => void;
    resizeCanvas: (e?: UIEvent) => void;
    removeCanvas: () => void;
    render: () => void;
    update?: (time: DOMHighResTimeStamp) => void;
    settings?: CanvasInterfaceSettings;
    isUpdate: boolean;
}
export declare class NoOPCanvas implements CanvasBase {
    update?: ((time: number) => void) | undefined;
    name: string;
    attachCanvas(container: HTMLDivElement): void;
    setFunction(func: CanvasInterface): void;
    resizeCanvas(e?: UIEvent): void;
    removeCanvas(): void;
    render(): void;
    isUpdate: boolean;
}

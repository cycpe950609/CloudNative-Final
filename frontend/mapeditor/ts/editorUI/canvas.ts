import Konva from "konva";
// import { PaintCanvas, PaintContext } from "../editor/canvas";
import { v4 as uuidv4 } from "uuid";
import {getCourtName} from "../editor/courtMgr";

export type PaintEvent = {
    X: number;
    Y: number;
    type: "touch" | "mouse" | "pen";
    pressure: number;
}

export interface CanvasInterface {
    Name: string;
    HistoryName?: string;// undefined if dont want to push into history stack
    Tip?: string;
    ImgName?:string;
    CursorName?:string;
    CanFinishDrawing: boolean;
    PointerDown?:   (e: PaintEvent) => void;
    PointerMove?:   (e: PaintEvent) => void;
    PointerUp?:     (e: PaintEvent) => void;
    PointerOut?:    (e: PaintEvent) => void;
    
    RightPointerDown?:   (e: PaintEvent) => void;
    RightPointerUp?:     (e: PaintEvent) => void;

    DrawFunction: (
        ctx: Konva.Group,
        width: number, 
        height: number,
        rotate: number,
    ) => void;
    CompositeOperation: GlobalCompositeOperation;
    Settings?: CanvasInterfaceSettings; 
}

export enum CanvasSettingType {
    Number,
    Color,
    Boolean,
}
export type CanvasSettingEntry<DATATYPE> = {
    type: CanvasSettingType;
    label: string;
    info?: any; // Infomation of the setting, e.g. value range
    value: DATATYPE;
} 
export type CanvasInterfaceSettings = {
    Name?: string;
    ImgName?: string;
    Settings?: Map<string,CanvasSettingEntry<any>>;
};

export class DragAndDropDrawBase implements CanvasInterface {
    Name: string = "base";
    private _canfinishDrawing: boolean = true
    public get CanFinishDrawing(){ return this._canfinishDrawing; };

    protected LastX = 0;
    protected LastY = 0;
    protected NextX = 0;
    protected NextY = 0;
    protected ifDrawing = false;
    protected ifMouseMove = false;
    protected shapeID!: string;
    protected courtName!: string;

    public PointerDown(e: PaintEvent){
        [this.LastX, this.LastY] = [e.X, e.Y];
        [this.NextX, this.NextY] = [e.X, e.Y];
        this.ifDrawing = true;
        this.ifMouseMove = false;
        this._canfinishDrawing = false;
        this.shapeID = uuidv4();
        this.courtName = getCourtName();
    };
    public PointerMove(e: PaintEvent){
        if(!this.ifDrawing) return;
        this.ifMouseMove = true;
        [this.NextX, this.NextY] = [e.X, e.Y];
    };
    public PointerUp(e: PaintEvent){
        this._canfinishDrawing = true;
        this.ifMouseMove = false;
        this.ifDrawing = false;
    };
    public PointerOut(e: PaintEvent){
        this._canfinishDrawing = true;
        this.ifMouseMove = false;
        this.ifDrawing = false; 
    };
    protected rotatedDelta(radian: number): [number, number] {
        let OffsetX = this.NextX;
        let OffsetY = this.NextY;
        let dx = OffsetX - this.LastX;
        let dy = OffsetY - this.LastY;
        let new_dx = dx*Math.cos(radian) - dy*Math.sin(-radian);
        let new_dy = dx*Math.sin(-radian) + dy*Math.cos(radian);
        return [new_dx,new_dy];
    }
    protected rotatedPoint(x: number, y: number,radian: number):[number, number]{
        let originX = x;// - this.LastX;
        let originY = y;// - this.LastY;
        let newX = originX*Math.cos(radian) - originY*Math.sin(radian);
        let newY = originX*Math.sin(radian) + originY*Math.cos(radian);
        // return [newX + this.LastX, newY + this.LastY];
        return [newX, newY];
    }
    public DrawFunction(ctx: Konva.Group, width: number, height: number,rotate: number) {};
    public CompositeOperation: GlobalCompositeOperation = <GlobalCompositeOperation>"source-over";
    public set Settings(setting:CanvasInterfaceSettings) {}; 
    public get Settings() { return {} as CanvasInterfaceSettings; }; 
};

export class ClickDrawBase implements CanvasInterface {
    Name: string = "base";
    private _canfinishDrawing: boolean = true
    public get CanFinishDrawing(){ return this._canfinishDrawing; };

    protected LastX = 0;
    protected LastY = 0;
    protected NextX = 0;
    protected NextY = 0;
    protected ifDrawing = false;
    protected ifMouseMove = false;
    protected shapeID!: string;
    protected points: [number, number][] = [];
    protected courtName!: string;

    public PointerDown(e: PaintEvent){
        if(this._canfinishDrawing == true) { // First click
            [this.LastX, this.LastY] = [e.X, e.Y];
            [this.NextX, this.NextY] = [e.X, e.Y];
            this.ifDrawing = true;
            this.ifMouseMove = false;
            this._canfinishDrawing = false;
            this.shapeID = uuidv4();
            this.courtName = getCourtName();
            this.points = [[e.X, e.Y],];
        }
        
    };
    public PointerMove(e: PaintEvent){
        if(!this.ifDrawing) return;
        this.ifMouseMove = true;
        [this.NextX, this.NextY] = [e.X, e.Y];
    };
    public PointerUp(e: PaintEvent){
        this.points.push([e.X, e.Y]);
    };

    public RightPointerUp(e: PaintEvent) {
        this._canfinishDrawing = true;
        this.ifMouseMove = false;
        this.ifDrawing = false;
    }

    public PointerOut(e: PaintEvent){
        this._canfinishDrawing = true;
        this.ifMouseMove = false;
        this.ifDrawing = false; 
    };
    protected rotatedDelta(radian: number, offsetX?: number, offsetY?: number ): [number, number] {
        let OffsetX = offsetX !== undefined ? offsetX : this.NextX;
        let OffsetY = offsetY !== undefined ? offsetY : this.NextY;
        let dx = OffsetX - this.LastX;
        let dy = OffsetY - this.LastY;
        let new_dx = dx*Math.cos(radian) - dy*Math.sin(-radian);
        let new_dy = dx*Math.sin(-radian) + dy*Math.cos(radian);
        return [new_dx,new_dy];
    }
    protected rotatedPoint(x: number, y: number,radian: number):[number, number]{
        let originX = x;// - this.LastX;
        let originY = y;// - this.LastY;
        let newX = originX*Math.cos(radian) - originY*Math.sin(radian);
        let newY = originX*Math.sin(radian) + originY*Math.cos(radian);
        // return [newX + this.LastX, newY + this.LastY];
        return [newX, newY];
    }
    public DrawFunction(ctx: Konva.Group, width: number, height: number,rotate: number) {};
    public CompositeOperation: GlobalCompositeOperation = <GlobalCompositeOperation>"source-over";
    public set Settings(setting:CanvasInterfaceSettings) {}; 
    public get Settings() { return {} as CanvasInterfaceSettings; }; 
};

export class NoOPCVSFunc extends DragAndDropDrawBase{};
export interface CanvasBase {
    name: string;
    attachCanvas: (container: HTMLDivElement) => void;
    setFunction: (func: CanvasInterface) => void;
    resizeCanvas: (e?: UIEvent) => void;
    removeCanvas: () => void;
    render: () => void;
    update?: (time: DOMHighResTimeStamp) => void; //Use in animateion
    settings?: CanvasInterfaceSettings;
    isUpdate: boolean;
}

export class NoOPCanvas implements CanvasBase {
    update?: ((time: number) => void) | undefined;
    name = "NoOPCanvas";
    attachCanvas(container: HTMLDivElement) {
        // console.log("NoOPCanvas attachCanvas on ");
        // console.log(container);
    }
    setFunction(func: CanvasInterface){
        console.log("setFunction",func);
    }
    resizeCanvas(e?: UIEvent) {
        // console.log("Resize Canvas Event");
    }
    removeCanvas() {
        // console.log("NoOPCanvas removeCanvas");
    }
    render() {
        // console.log("NoOPCanvas render");
    }
    isUpdate: boolean = false;
}

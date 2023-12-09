import Konva from "konva";
import { CanvasInterfaceSettings, ClickDrawBase, DragAndDropDrawBase } from "../editorUI/canvas";
export declare class PolygonBase extends DragAndDropDrawBase {
    CursorName: string;
    BorderBrush: string;
    BorderWidth: number;
    ContentColor: string;
    CanFilled: boolean;
    get Settings(): CanvasInterfaceSettings;
    set Settings(setting: CanvasInterfaceSettings);
}
export declare class CircleCVSFunc extends PolygonBase {
    Name: string;
    HistoryName: string;
    ImgName: string;
    Tip: string;
    DrawFunction: (Ctx: Konva.Group, width: number, height: number) => void;
}
export declare class PathDraw extends PolygonBase {
    Path: string;
    private isVar;
    private validPath;
    DrawFunction: (Ctx: Konva.Group, width: number, height: number, angle: number) => void;
}
export declare class TriangleCVSFunc extends PathDraw {
    Name: string;
    HistoryName: string;
    ImgName: string;
    Tip: string;
    Path: string;
}
export declare class RectangleCVSFunc extends PathDraw {
    Name: string;
    HistoryName: string;
    ImgName: string;
    Tip: string;
    Path: string;
}
export declare class PolygonCVSFunc extends ClickDrawBase {
    CursorName: string;
    BorderBrush: string;
    BorderWidth: number;
    ContentColor: string;
    CanFilled: boolean;
    Name: string;
    HistoryName: string;
    ImgName: string;
    DrawFunction: (Ctx: Konva.Group, width: number, height: number, angle: number) => void;
    get Settings(): CanvasInterfaceSettings;
    set Settings(setting: CanvasInterfaceSettings);
}

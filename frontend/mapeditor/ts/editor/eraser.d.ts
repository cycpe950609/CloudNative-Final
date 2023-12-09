import Konva from "konva";
import { CanvasInterfaceSettings, DragAndDropDrawBase } from "../editorUI/canvas";
declare class EraserCVSFunc extends DragAndDropDrawBase {
    Name: string;
    HistoryName: string;
    Tip: string;
    ImgName: string;
    CursorName: string;
    BrushWidth: number;
    BrushColor: string;
    DrawFunction: (Ctx: Konva.Group, width: number, height: number) => void;
    CompositeOperation: GlobalCompositeOperation;
    get Settings(): CanvasInterfaceSettings;
    set Settings(setting: CanvasInterfaceSettings);
}
export default EraserCVSFunc;

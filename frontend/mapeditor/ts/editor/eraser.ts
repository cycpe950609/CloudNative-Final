import Konva from "konva";
import { Line, LineConfig } from "konva/lib/shapes/Line";
import { CanvasInterfaceSettings, CanvasSettingEntry, CanvasSettingType, DragAndDropDrawBase } from "../editorUI/canvas";
import { editorUIActions, editorUIData } from "../editorUI/data";
// import { PaintContext } from "./canvas";

class EraserCVSFunc extends DragAndDropDrawBase {
    Name = 'Eraser';
    HistoryName = 'eraser';
    Tip = 'Eraser';
    ImgName = 'eraser';
    CursorName = 'eraser';
    BrushWidth = 10;
    BrushColor = 'white';
    DrawFunction = (Ctx: Konva.Group,width: number, height: number) =>
    { 
        let brush = Ctx.find('.prev-brush')
        let polygon = undefined;
        if(brush.length > 0){
            polygon = brush[0]
        }
        else {
            polygon = new Konva.Line({
                name: "prev-brush",
                stroke: this.BrushColor,
                strokeWidth: this.BrushWidth,
                // round cap for smoother lines
                lineCap: 'round',
                lineJoin: 'round',
                globalCompositeOperation: this.CompositeOperation,
                points: [this.LastX, this.LastY,this.LastX, this.LastY]
            } as LineConfig);
            Ctx.add(polygon)
        }
        
        if(this.ifDrawing)
        {
            //console.log('Drawing...');
            let newPoints = (<Line>polygon).points().concat([this.NextX, this.NextY]);
            (<Line>polygon).points(newPoints);
            polygon.setAttr("courtName", this.courtName);
        }
        
        [this.LastX, this.LastY] = [this.NextX, this.NextY];
    };
    CompositeOperation = <GlobalCompositeOperation>"destination-out"
get Settings () {
        let rtv: CanvasInterfaceSettings = {
            Name : "Brush",
            Settings : new Map<string, CanvasSettingEntry<any>>([
                ["BrushWidth", {
                    type: CanvasSettingType.Number,
                    label: "Eraser Width",
                    info: [1,64], // min,max
                    value: this.BrushWidth
                }]
            ])
        };
        return rtv;
    }
    set Settings (setting: CanvasInterfaceSettings) {
        if(setting.Settings === undefined)
            throw new Error("INTENAL_ERROR: Settings are missing");
        let refreshWindow = false;
        if(setting.Settings.get("BrushWidth") !== undefined) {
            this.BrushWidth = setting.Settings.get("BrushWidth")?.value;
            refreshWindow = true;
        }
        if(refreshWindow)
            editorUIData.dispatch(editorUIActions.sidebar_window.update({id: "SettingsPage", new_func: null}));
    }
};

export default EraserCVSFunc;
import { CanvasBase } from "../editorUI/canvas";
import FunctionInterface from "../editorUI/interface/function";
import { EditorCanvas } from "./modeEditor";


export class btnUpload implements FunctionInterface {
    Name = "btn_upload";
    ImgName= "upload";
    Tip = "Upload a image to edit";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).open();
        return false;
    };
}

export class btnUndo implements FunctionInterface {
    Name = "btn_undp";
    ImgName= "undo";
    Tip = "Undo";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).undo();
        return false;
    };
}

export class btnRedo implements FunctionInterface {
    Name = "btn_redp";
    ImgName= "redo";
    Tip = "Redo";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).redo();
        return false;
    };
}

export class btnClear implements FunctionInterface {
    Name = "btn_clear";
    ImgName= "clear";
    Tip = "Clear the canvas";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).clear();
        return false;
    };
}
export class btnSave implements FunctionInterface {
    Name = "btn_save";
    ImgName= "save";
    Tip = "Download a image";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).save();
        return false;
    };
}

export class btnToggleTouch implements FunctionInterface {
    Name = "btn_touch";
    ImgName= "toggleTouch";
    Tip = "Toggle Touch / Pen";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).toggleTouch();
        return false;
    };
}

export class btnResetScale implements FunctionInterface {
    Name = "btn_reset_scale";
    ImgName= "resetScale";
    Tip = "Reset scale to 100%";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).scaleTo(1);
        return false;
    };
}

export class btnResetRotate implements FunctionInterface {
    Name = "btn_reset_rotate";
    ImgName= "resetRotate";
    Tip = "Reset rotate to 0°";

    constructor(){}

    StartFunction: (cvs: CanvasBase) => boolean = (cvs: CanvasBase) => {
        (cvs as EditorCanvas).rotateTo(0);
        return false;
    };
}
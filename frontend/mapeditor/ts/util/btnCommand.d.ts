import { CanvasBase } from "../editorUI/canvas";
import FunctionInterface from "../editorUI/interface/function";
declare class btnCommand implements FunctionInterface {
    Name: string;
    Tip: string;
    ImgName: string;
    constructor();
    StartFunction(cvs: CanvasBase): boolean;
}
export default btnCommand;

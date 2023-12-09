import { Shape } from "konva/lib/Shape";
import { h } from "snabbdom";
import { SidebarInterface } from "../editorUI";
import { editorUIActions, editorUIData } from "../editorUI/data";
import { HBUTTON, HTABLE, HTD, HTR } from "../editorUI/util/HHTMLElement";
import { EditorCanvas } from "./modeEditor";

let currentCourtIndex: number = 1;
export const clearCourtIndex: () => void = () => { currentCourtIndex = 1; };
export const getCourtName = () => {
    let newName = `Court ${currentCourtIndex}`;
    currentCourtIndex++;
    return newName;
}

class CourtMgrSidebar implements SidebarInterface {
    constructor(visible = false) {
        this.Visible = visible;
    }
    Name = "ShapeMgrSidebar";
    ImgName = "shapeMgr";
    Tip = "Courts Manager";
    Visible = false;
    Title = () => "Courts";
    Body = async () => {
        if (this.Visible) {
            let layer = (window.editorUI.CenterCanvas as EditorCanvas).LayerManager.Layer;
            let children = layer.content();
            const createList = async (classNames: string, idx: number, shape: Shape) => {
                let btnDel = HBUTTON("edit_btn px-0 ok_btn", "Del", (e: MouseEvent) => {
                    layer.delete(shape.name());
                    editorUIData.dispatch(editorUIActions.sidebar_window.update({id: "CourtMgrSidebar", new_func: null}));
                });
                return HTR(classNames, 
                    [
                        HTD(`${shape.getAttr("courtName")}`),
                        HTD(btnDel),
                    ]
                )
            }
            let newTableBody = await Promise.all(
                children.map((shape: Shape, idx: number) => {
                    return createList("normal-layer",idx,shape);
                })
            );
            return HTABLE("w-full b-none align-right", [
                HTR("courts-header", [
                    HTD('Name'),
                    HTD('Del'),
                ])
            ],newTableBody);
        }
        return h("div");
    };
}

export default CourtMgrSidebar;
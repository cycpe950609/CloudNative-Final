import { Shape } from "konva/lib/Shape";
import { h } from "snabbdom";
import { SidebarInterface } from "../editorUI";
import { editorUIActions, editorUIData } from "../editorUI/data";
import { HBUTTON, HTABLE, HTD, HTR } from "../editorUI/util/HHTMLElement";
import { EditorCanvas } from "./modeEditor";
import { LayerInfo } from "./layer";

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
    Name = "CourtMgrSidebar";
    ImgName = "courtMgr";
    Tip = "Courts Manager";
    Visible = false;
    Title = () => "Courts";
    // Body = async () => {
    //     if (this.Visible) {
    //         let layer = (window.editorUI.CenterCanvas as EditorCanvas).LayerManager.Layer;
    //         let children = layer.content();
    //         const createList = async (classNames: string, idx: number, shape: Shape) => {
    //             let btnDel = HBUTTON("edit_btn px-0 ok_btn", "Del", (e: MouseEvent) => {
    //                 layer.delete(shape.name());
    //                 editorUIData.dispatch(editorUIActions.sidebar_window.update({id: "CourtMgrSidebar", new_func: null}));
    //             });
    //             return HTR(classNames, 
    //                 [
    //                     HTD(`${shape.getAttr("courtName")}`),
    //                     HTD(btnDel),
    //                 ]
    //             )
    //         }
    //         let newTableBody = await Promise.all(
    //             children.map((shape: Shape, idx: number) => {
    //                 return createList("normal-layer",idx,shape);
    //             })
    //         );
    //         return HTABLE("w-full b-none align-right", [
    //             HTR("courts-header", [
    //                 HTD('Name'),
    //                 HTD('Del'),
    //             ])
    //         ],newTableBody);
    //     }
    //     return h("div");
    // };


    Body = async () => {
        if (this.Visible) {
            // let pointsList = (cvs as LabelCanvas).AllNodes;
            let layersList = (window.editorUI.CenterCanvas as EditorCanvas).LayerManager.LayerList;

            const createList = async (classNames: string, idx: number, layer: LayerInfo) => {
                // let btnEdit = HBUTTON("edit_btn mt-20px px-0", "..", (e: MouseEvent) => {
                //     (window.editorUI.CenterCanvas as EditorCanvas).LayerManager.changeTo(layer.ID);
                // });
                let toImage = (img: string) => {
                    return h('img', { style:{ maxWidth: `96px`, maxHeight: `54px`}, props: {src: img}})
                    // TODO: set width and height from canvas size programmatically
                }
                return HTR(classNames, 
                    [
                        HTD(`${idx}`.padStart(6)),
                        HTD(toImage(layer.Snapshot)),
                        HTD(layer.Name),
                    ],
                    (e: MouseEvent) => {
                        (window.editorUI.CenterCanvas as EditorCanvas).LayerManager.changeTo(layer.ID);
                    }
                )
            }
            let edittedLayer = (window.editorUI.CenterCanvas as EditorCanvas).LayerManager.Layer.ID;
            let newTableBody = await Promise.all(
                layersList.map((layer: LayerInfo, idx: number) => {
                    if(layer.ID === edittedLayer)
                    {
                        return createList("editted-layer",idx,layer);
                    }
                    else
                    {
                        return createList("normal-layer",idx,layer);
                    }
                })
            );
            return HTABLE("w-full b-none align-right", [
                HTR("layers-header", [
                    HTD('Index'),
                    HTD('Preview'),
                    HTD('Name'),
                    // HTD('..'),
                ])
            ],newTableBody);
        }
        return h("div");
    };
}

export default CourtMgrSidebar;
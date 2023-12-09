import Konva from "konva";
import { GroupConfig } from "konva/lib/Group";
import { Shape } from "konva/lib/Shape";
// import { KonvaEventListener } from "konva/lib/Node";
import { h } from "snabbdom";
import { v4 as uuidv4 } from "uuid";
import { editorUIActions, editorUIData } from "../editorUI/data";
import SidebarInterface from '../editorUI/interface/sidebar'
import { HTABLE, HTD, HTR } from "../editorUI/util/HHTMLElement";
import { HistoryLogEntry } from "./historyLogger";
import { EditorCanvas } from "./modeEditor";

class LayerInfo {
    public Snapshot : string = "";
    public Name : string = "";
    public ID : string = "";
}

export class LayerManager {
    private layerList = new Map<string, Layer>();
    private defaultLayer: string;

    private cvs !: Konva.Stage;
    private ctx : Konva.Layer;

    private id2zIndex : Map<string, number> = new Map<string, number>(); //

    constructor(containerr: HTMLDivElement,width: number,height: number) {
        this.cvs = new Konva.Stage({
            container: containerr,   // id of container <div>
            width:  width,
            height: height,
        } as Konva.StageConfig);
        this.ctx = new Konva.Layer(); 
        this.cvs.add(this.ctx);

        this.defaultLayer = this.addLayer();
        this.id2zIndex.set(this.defaultLayer, 0);
    }

    private addLayer() {
        const newID = uuidv4() as string;
        let newLayer = new Layer(newID, `Layer ${this.layerList.size + 1}`)
        this.layerList.set(newID, newLayer);
        this.ctx.add(newLayer.prev);
        this.ctx.add(newLayer.render);
        return newID;
    }

    public addLayerAfter() {
        const id = this.addLayer();
        const currentLayerZindex = this.id2zIndex.get(this.defaultLayer);
        if(currentLayerZindex === undefined) throw new Error("INTERNAL_ERROR: ZIndex of layer is missing.");
        // Update zIndex
        this.id2zIndex.forEach((zIndex:number, layer_id: string) => {
            if(zIndex >= currentLayerZindex)
                this.id2zIndex.set(layer_id, zIndex+1);
        });
        this.id2zIndex.set(id,currentLayerZindex);
        this.layerList.forEach((layer: Layer, layer_id: string) => {
            let newZindex = this.id2zIndex.get(layer_id);
            if(newZindex === undefined) throw new Error("INTERNAL_ERROR: ZIndex of layer is missing.");
            layer.zIndex = newZindex;
        })
        this.defaultLayer = id;
        return id;
    }

    public changeTo(id: string) {
        if(!this.layerList.has(id))
            throw new Error(`Layer ${id} not exist`);
        this.defaultLayer = id;
        editorUIData.dispatch(editorUIActions.sidebar_window.update({id: "LayerMgrSidebar", new_func: null}));
    }

    public get Canvas() : Konva.Stage {
        return this.cvs;
    }

    public get Layer() : Layer {
        let id = this.defaultLayer;
        if(!this.layerList.has(id))
            throw new Error(`Layer ${id} not exist`);
        return this.layerList.get(id) as Layer;
    }

    public get LayerList() : LayerInfo[] {
        let rtv : LayerInfo[] = [];
        this.layerList.forEach(layer => rtv.push({
            Snapshot : layer.Preview,
            Name: layer.Name,
            ID: layer.ID,
        }));
        return rtv;
    }

    public clear() : void {
        this.layerList.forEach(layer => layer.clear());
        editorUIData.dispatch(editorUIActions.sidebar_window.update({id: "LayerMgrSidebar", new_func: null}));
    };
};

export class Layer {
    private _render : Konva.Group;
    private _prev : Konva.Group;

    private _id: string;
    private _name: string;
    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this._render = new Konva.Group({
            name: `render_${id}`,
        } as GroupConfig);
        this._prev = new Konva.Group({
            name: `prev_${id}`,
        } as GroupConfig);

    }
    public get ID() {
        return this._id;
    }
    public get Name() {
        return this._name;
    }

    public get zIndex() {
        return (this._render.zIndex as unknown as number)/2;
    }
    public set zIndex(zIndex: number) {
        this._render.setZIndex(zIndex*2);
        this._prev.setZIndex(zIndex*2+1);
    };

    public content(){
        return this._render.children as Shape[];
    }
    public merge(layer: Layer) {
        this._isPreview = false;
        layer.content().forEach((item) => {
            this._render.add(item);
        })
    }
    private _previewImage: string = "";
    private _isPreview: boolean = false;
    public get Preview() {
        this._previewImage = this._render.toDataURL();
        // TODO : Add code to rerender the preview after redo/undo
        // if(!this._isPreview)
        // {
        //     this._previewImage = this._render.toDataURL();
        //     this._isPreview = true;
        // }
        return this._previewImage;
    }
    public diff() : HistoryLogEntry<any>[] {
        let rtv: HistoryLogEntry<any>[] = [];

        this._prev.children.forEach((item) => {
            const newLog : HistoryLogEntry<any> = {
                layerID: this._id,
                paintToolName: item.className,
                shapeName: item.name(),
                data: item.attrs
            }
            console.log("[DEB] Diff : ",newLog);
            rtv.push(newLog);
        })

        return rtv;
    }
    public flush() {
        this._isPreview = false;
        this._prev.children.forEach((item) => {
            this._render.add(item);
        })
        this._prev.destroyChildren();
        editorUIData.dispatch(editorUIActions.sidebar_window.update({id: "LayerMgrSidebar", new_func: null}));
    }
    public add(item: any) {
        this._isPreview = false;
        this._render.add(item);
    }
    public delete(id: string): void {
        let polygon = this._render.find(`.${id}`);
        if(polygon.length === 0) throw new Error("INTERNEL_ERROR: Shape not found");
        polygon.forEach((shape) => {
            shape.destroy();
        })
    }

    public clear() {
        this._prev.destroyChildren();
        this._render.destroyChildren();
        this._isPreview = false;
    }

    public get render() {
        return this._render;
    }
    public get prev() {
        return this._prev;
    }
};


class LayerMgrSidebar implements SidebarInterface {
    constructor(visible = false) {
        this.Visible = visible;
    }
    Name = "LayerMgrSidebar";
    ImgName = "layer";
    Tip = "Layer Manager";
    Visible = false;
    Title = () => "Layer";
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

export default LayerMgrSidebar;
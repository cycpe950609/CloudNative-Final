import { Unsubscribe } from "@reduxjs/toolkit";
import { StatusBarStateType as StatusbarStateType, editorUIData, editorUIActions } from "./data";
import { DIV, SPAN } from "./util/HTMLElement";

export class TipComponent {
    private idx: number;
    private side: string;
    constructor(defaultTip: string,side:string,idx: number){
        this.idx = idx;
        this.side = side;
        console.log(`[EUI] ${idx} tip component created`);
        editorUIData.dispatch(editorUIActions[`statusbar_${this.side}_`].update(
            {
                id:this.idx,
                new_func:{
                    tip: defaultTip,
                    showed: true,
                }
            }
        ));
    }
    public updateTip(tip: string) {
        editorUIData.dispatch(editorUIActions[`statusbar_${this.side}_`].update(
            {
                id:this.idx,
                new_func:{
                    tip: tip,
                    showed: true,
                }
            }
        ));
    }
    public hide() {
        editorUIData.dispatch(editorUIActions[`statusbar_${this.side}_`].update(
            {
                id:this.idx,
                new_func:{
                    tip: editorUIData.getState()[`statusbar_${this.side}_`][this.idx].tip,
                    showed: false,
                }
            }
        ));
        
    }
    public show() {
        editorUIData.dispatch(editorUIActions[`statusbar_${this.side}_`].update(
            {
                id:this.idx,
                new_func:{
                    tip: editorUIData.getState()[`statusbar_${this.side}_`][this.idx].tip,
                    showed: true,
                }
            }
        ));
        
    }
}

class StatusBar {
    constructor() {}

    private defaultTip!: TipComponent;
    private __createTipComponent__(defaultTip: string,right: boolean = false){
        if(right)
        {
            let count = Object.keys(editorUIData.getState()[`statusbar_right_`].data).length;
            return new TipComponent(defaultTip,"right",count+1);
        }
        else {
            let count = Object.keys(editorUIData.getState()[`statusbar_left_`].data).length;
            return new TipComponent(defaultTip,"left",count+1);
        }
    }
    public addTip(defaultTip: string,atRight: boolean = false): TipComponent {
        return this.__createTipComponent__(defaultTip,atRight);
    }

    public clear(): void {
        editorUIData.dispatch(editorUIActions[`statusbar_left_`].clear(undefined));
        editorUIData.dispatch(editorUIActions[`statusbar_right_`].clear(undefined));
    }
}

export default StatusBar;

export type StatusbarPropsType = {
    side: string,
}
let unsubscribe: {[key:string]:Unsubscribe} = {};
let rendered : {[key:string]:boolean} = {};

export const bootstrap = async (props: StatusbarPropsType) => {
    console.log("[EUI] modeSelector bootstrapping");
    rendered[`statusbar_${props.side}_`]    = false;
}
const renderTipComponent = (tip: string) => {
    return DIV("status-bar",
        SPAN("status_help_tip", tip)
    );
}
const renderStatusPart = (partListName: string,partList: StatusbarStateType) => {
    return Object.keys(partList).map((key:string)=>{
        rendered[partListName] = true;
        return partList[key].showed ? renderTipComponent(partList[key].tip) : document.createElement("span");
    })
}
const render = (side: string) => {
    let name = `editorui-statusbar-${side}`
    let statusbarCNT = document.getElementById(name);
    if(statusbarCNT === null) throw new Error("INTERNAL_ERROR: Cannot find container of editorui-menubar-middle");
    statusbarCNT.innerHTML = '';
    // console.log("[DEB] Statusbar data : ",data.getState()[`statusbar_${side}_`]);
    let sidebar = DIV(name,renderStatusPart(`statusbar_${side}_`,editorUIData.getState()[`statusbar_${side}_`].data));
    sidebar.id = name;
    statusbarCNT.parentNode?.replaceChild(sidebar,statusbarCNT);
}
export const mount = async (props: StatusbarPropsType) => {
    unsubscribe[props.side] = editorUIData.subscribe(() =>
    {
        if(
            (
                rendered[`statusbar_${props.side}_`]    === false && editorUIData.getState()[`statusbar_${props.side}_`].action !== ""
            )
        )
        {
            // console.log(`[DEB] Statusbar ${props.side} rerendered`);
            
            render(props.side);
        }
        
        [
            `statusbar_${props.side}_`,
        ].forEach((name) => {
            // console.log(`[DEB] ${data.getState()[name].action}, ${rendered[name]}`)
            if(editorUIData.getState()[name].action !== "" && rendered[name] === true){
                rendered[name] = false;
                // console.log(`[DEB] Statusbar ${name} rendered`)
                editorUIData.dispatch(editorUIActions[name].rendered(null));
            }
        })
    });
    render(props.side);
    console.log(`[EUI] Statusbar ${props.side} mounted`);
}
export const unmount = async (props: StatusbarPropsType) => {
    unsubscribe[props.side]();
    delete unsubscribe[props.side];
};
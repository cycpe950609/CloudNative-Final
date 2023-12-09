import { h, VNode } from "snabbdom";
import { CanvasInterfaceSettings, CanvasSettingEntry, CanvasSettingType } from "../editorUI/canvas";
// import EditorUI from "../editorUI/EditorUI";
import SidebarInterface from "../editorUI/interface/sidebar";
import { HDIV, HLABEL, HSPAN, HTABLE, HTD, HTR } from "../editorUI/util/HHTMLElement";
import { EditorCanvas } from "./modeEditor";

const HHorizonRanger = (min: number, max: number, defValue: number, changeHandler: any) => {
    return HDIV("w-full flex flex-row",[
        h('input',{props: {
            type: "range",
            min: min,
            max: max,
            value: defValue,
            step: 1,
        }, on: {change: changeHandler}}),
        HSPAN("w-fit", defValue.toFixed(0).toString())
    ])
}

const HToggleSwitch = (value: boolean, changeHandler: any) => {
    // <label class="switch">
    //     <input type="checkbox">
    //     <span class="slider"></span>
    // </label>
    return HLABEL("switch",[
        h('input',{props: { type: "checkbox", checked: value}, on: {change: changeHandler}}),
        HSPAN("slider","")
    ])
};

class SettingPageSidebar implements SidebarInterface {
    Name: string = "SettingsPage"; // Tips of ToolButton
    ImgName?: string = "property";
    Tip?: string = "Settings"; // Tip showed on StatusBar
    HistoryName?: string; // Undefined if dont want to store in redo/undo hostory
    Visible: boolean = false;
    Title: () => string = () => {
        let name = (window.editorUI.CenterCanvas as EditorCanvas).settings.Name;
        if(name === undefined) return 'Settings';
        return `Settings of ${name}`;
    };
    Body: ()=> VNode = () => {
        return HDIV("w-full");
    }
}
export default SettingPageSidebar;
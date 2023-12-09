import { Unsubscribe } from "@reduxjs/toolkit";
import { editorUIData, editorUIActions } from "./data";
import { DIV, LABEL } from "./util/HTMLElement";

let unsubscribe: Unsubscribe;

export const bootstrap = async () => {
    console.log("[EUI] modeSelector bootstrapping");
}
const render = () => {
    let editMenuMiddle = document.getElementById("editorui-menubar-middle");
    if(editMenuMiddle === null) throw new Error("INTERNAL_ERROR: Cannot find container of editorui-menubar-middle");
    editMenuMiddle.innerHTML = '';
    let tmpMEM = DIV("buttongroup");
    editMenuMiddle.appendChild(tmpMEM)
    if (Object.keys(editorUIData.getState()["mode"].data).length > 0) {
        tmpMEM.innerHTML = "";
        Object.keys(editorUIData.getState()["mode"].data).forEach((key) => {
            //prettier-ignore
            let val = editorUIData.getState().mode.data[key]
            const btn = LABEL("buttongroup-item");
            const btnName = val.def.ModeSelectorText;
            if(btnName === undefined) return;
            btn.innerHTML =
                `
                <input type="radio" class="button_input" name="modeSelector"/>
                <div class="button">
                    <div>` +
                btnName +
                `</div>
                </div>
            `;
            const inp = btn.querySelector("input");
            if (inp === null) throw new Error("INTERNAL_ERROR");
            inp.defaultChecked = false;

            btn.addEventListener("click", () => window.editorUI.Mode.changeTo(val.modeName), false);

            // console.log(
            //     "Button Enable ? " + (mode.Enabled !== true ? "false" : "true")
            // );
            inp.disabled = val.enable !== true;
            // console.log(inp.disabled);

            tmpMEM!.appendChild(btn);
        })
        
    }
}
export const mount = async () => {
    unsubscribe = editorUIData.subscribe(() =>
    {
        if(editorUIData.getState()["mode"].action !== "")
        {
            // console.log("modeSelector rerendered");
            editorUIData.dispatch(editorUIActions.mode.rendered(null));
            render();
        }
    });
    render();
    console.log("[EUI] modeSelector mounted");
}
export const unmount = async () => {unsubscribe();};
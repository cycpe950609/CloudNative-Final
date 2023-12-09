import { SidebarInterface } from "../editorUI";
export declare const clearCourtIndex: () => void;
export declare const getCourtName: () => string;
declare class CourtMgrSidebar implements SidebarInterface {
    constructor(visible?: boolean);
    Name: string;
    ImgName: string;
    Tip: string;
    Visible: boolean;
    Title: () => string;
    Body: () => Promise<import("snabbdom").VNode>;
}
export default CourtMgrSidebar;

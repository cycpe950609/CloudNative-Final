import { VNode } from "snabbdom";
import SidebarInterface from "../editorUI/interface/sidebar";
declare class SettingPageSidebar implements SidebarInterface {
    Name: string;
    ImgName?: string;
    Tip?: string;
    HistoryName?: string;
    Visible: boolean;
    Title: () => string;
    Body: () => VNode;
}
export default SettingPageSidebar;

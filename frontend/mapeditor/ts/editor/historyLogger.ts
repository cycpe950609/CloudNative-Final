
export type HistoryLogEntry<DATATYPE> = {
    layerID: string;
    paintToolName: string;
    shapeName: string;
    data: DATATYPE;
}

class HistoryManager {
    private undo_stk_history = new Array();
    private redo_stk_history = new Array();
    public redo(): HistoryLogEntry<any>[] { // Ctrl + Y
        if(this.redo_stk_history.length === 0)
            return [{
                layerID: "",
                paintToolName: "noop",
                shapeName: "noop",
                data: null
            }];
        let redo_entry = this.redo_stk_history.pop();
        this.undo_stk_history.push(redo_entry);
        console.log("undo",this.undo_stk_history,"redo",this.redo_stk_history);
        return redo_entry;
    };
    public undo(): HistoryLogEntry<any>[] {// Ctrl + Z
        if(this.undo_stk_history.length === 0) 
            return [{
                layerID: "",
                paintToolName: "noop",
                shapeName: "noop",
                data: null
            }];
        let undo_entry = this.undo_stk_history.pop();
        this.redo_stk_history.push(undo_entry);
        console.log("undo",this.undo_stk_history,"redo",this.redo_stk_history);
        return undo_entry;
    };

    public get undoList(): HistoryLogEntry<any>[] {
        return this.undo_stk_history;
    }
    public get redoList(): HistoryLogEntry<any>[][] {
        return this.redo_stk_history;
    }

    public add(logs: HistoryLogEntry<any>[]) {
        this.undo_stk_history.push(logs);
        this.redo_stk_history = new Array();
        console.log("undo",this.undo_stk_history,"redo",this.redo_stk_history);
    }
}
export default HistoryManager
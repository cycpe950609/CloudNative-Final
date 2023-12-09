export type HistoryLogEntry<DATATYPE> = {
    layerID: string;
    paintToolName: string;
    shapeName: string;
    data: DATATYPE;
};
declare class HistoryManager {
    private undo_stk_history;
    private redo_stk_history;
    redo(): HistoryLogEntry<any>[];
    undo(): HistoryLogEntry<any>[];
    get undoList(): HistoryLogEntry<any>[];
    get redoList(): HistoryLogEntry<any>[][];
    add(logs: HistoryLogEntry<any>[]): void;
}
export default HistoryManager;

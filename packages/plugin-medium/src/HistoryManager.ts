export class HistoryManager {
  private history: any[];

  private historyIndex: number;

  public applied: boolean;

  public startState: any;

  constructor(start: any) {
    this.history = [];
    this.historyIndex = -1;
    this.applied = false;
    this.startState = start;
  }

  registerChange(content: any) {
    if (this.historyIndex >= 0 && this.history[this.historyIndex].html === content.html) {
      // console.log("Skipped pushing");
      return; // Don't register same text as current history position
    }

    if (this.historyIndex < this.history.length - 1) {
      // console.log("Deleting from ", this.historyIndex + 1);
      this.history.splice(this.historyIndex + 1);
    }

    this.history.push(content);
    this.historyIndex = this.history.length - 1;
    // console.log("Pushed ", this.history[this.historyIndex]);
  }

  undo() {
    this.applied = true;
    if (this.historyIndex > 0) {
      this.historyIndex -= 1;
      // console.log("Undo from history", this.historyIndex, this.history[this.historyIndex], this.history);
      return this.history[this.historyIndex];
    }
    this.historyIndex = -1;
    // console.log("Undo from initial state", this.historyIndex, this.startState);
    return this.startState;
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex += 1;
      this.applied = true;
      // console.log("Redo from history", this.historyIndex, this.history[this.historyIndex], this.history);
      return this.history[this.historyIndex];
    }
    return undefined;
  }
}

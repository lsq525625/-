"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CssRemProvider {
    constructor(process) {
        this.process = process;
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            const lineText = document.getText(new vscode.Range(position.with(undefined, 0), position));
            const res = this.process.convert(lineText);
            if (!res) {
                return resolve([]);
            }
            const item = new vscode.CompletionItem(`${res.pxValue}px -> ${res.rem}`, vscode.CompletionItemKind.Snippet);
            item.insertText = res.rem;
            return resolve([item]);
        });
    }
}
exports.CssRemProvider = CssRemProvider;
//# sourceMappingURL=provider.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const process_1 = require("./process");
const provider_1 = require("./provider");
let cog = null;
function activate(context) {
    cog = vscode.workspace.getConfiguration('cssrem');
    const process = new process_1.CssRemProcess(cog);
    let provider = new provider_1.CssRemProvider(process);
    const LANS = ['html', 'vue', 'css', 'less', 'scss', 'sass', 'stylus'];
    for (let lan of LANS) {
        let providerDisposable = vscode.languages.registerCompletionItemProvider(lan, provider);
        context.subscriptions.push(providerDisposable);
    }
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.cssrem', (textEditor, edit) => {
        const doc = textEditor.document;
        let selection = textEditor.selection;
        if (selection.isEmpty) {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
            selection = new vscode.Range(start, end);
        }
        let text = doc.getText(selection);
        textEditor.edit(builder => {
            builder.replace(selection, process.convertAll(text));
        });
    }));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
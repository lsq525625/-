'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const RequestController_1 = require("./controllers/RequestController");
const ConnectionController_1 = require("./controllers/ConnectionController");
const OutputChannelController_1 = require("./controllers/OutputChannelController");
const ResultCache_1 = require("./utils/ResultCache");
function activate(context) {
    let requestController = new RequestController_1.RequestController();
    let connectionController = new ConnectionController_1.ConnectionController();
    let outputChannelController = new OutputChannelController_1.OutputChannelController();
    context.subscriptions.push(requestController);
    context.subscriptions.push(connectionController);
    context.subscriptions.push(outputChannelController);
    context.subscriptions.push(vscode.commands.registerCommand('mysql-scratchpad.mysqlConnect', () => connectionController.inputConnectionAndConnect()));
    context.subscriptions.push(vscode.commands.registerCommand('mysql-scratchpad.mysqlDisconnect', () => connectionController.closeConnection()));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('mysql-scratchpad.executeCurrentStatement', editor => requestController.executeStatementUnderCursor(editor)));
    context.subscriptions.push(vscode.commands.registerCommand('mysql-scratchpad.openScratchpad', () => connectionController.openScratchpad()));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('mysql-scratchpad.executeEntireFile', editor => requestController.executeEntireFile(editor)));
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('mysql-scratchpad.executeSelectedText', editor => requestController.executeSelectedText(editor)));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    ResultCache_1.ResultCache.clear();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
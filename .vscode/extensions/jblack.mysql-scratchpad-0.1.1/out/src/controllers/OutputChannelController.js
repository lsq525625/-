"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class OutputChannelController {
    constructor() {
        OutputChannelController.outputChannel = vscode_1.window.createOutputChannel('MySQL');
    }
    static showOutputChannel() {
        OutputChannelController.outputChannel.show();
    }
    static timestamp() {
        let pad = (num) => {
            let out = num.toString();
            if (out.length < 2) {
                return '0' + out;
            }
            return out;
        };
        let now = new Date();
        return `[${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}] - `;
    }
    static outputConnection(connection) {
        let line = `${this.timestamp()}Connected as ${connection.config.user}@${connection.config.host}`;
        OutputChannelController.outputChannel.appendLine(line);
    }
    static outputDisconnect() {
        let line = `${this.timestamp()}Disconnected from MySQL server.`;
        OutputChannelController.outputChannel.appendLine(line);
    }
    static outputError(error) {
        let line = `${this.timestamp()}Statement: ${error.statement}   Error: ${error.message}`;
        OutputChannelController.outputChannel.appendLine(line);
    }
    static outputSuccesss(result) {
        let line = `${this.timestamp()}Statement: ${result.statement}`;
        if (result.message) {
            line += `     Message: ${result.message}`;
        }
        OutputChannelController.outputChannel.appendLine(line);
    }
    dispose() {
        OutputChannelController.outputChannel.hide();
        OutputChannelController.outputChannel.dispose();
    }
}
exports.OutputChannelController = OutputChannelController;
//# sourceMappingURL=OutputChannelController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const MySqlConnectionPrompt_1 = require("../utils/MySqlConnectionPrompt");
const OutputChannelController_1 = require("./OutputChannelController");
const mysql_1 = require("mysql");
const ResultCache_1 = require("../utils/ResultCache");
class ConnectionController {
    static getConnection() {
        return ConnectionController.mysqlConnection;
    }
    constructor() {
        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    }
    dispose() {
        this.disconnect()
            .then(() => OutputChannelController_1.OutputChannelController.outputDisconnect(), err => this.handleConnectionError(err));
    }
    inputConnectionAndConnect() {
        this._statusBarItem.text = 'Connecting to MySQL server...';
        this._statusBarItem.show();
        OutputChannelController_1.OutputChannelController.showOutputChannel();
        MySqlConnectionPrompt_1.MySqlConnectionPrompt.getMysqlConnectionOptions()
            .then(options => this.connect(options))
            .then((connection) => this.onConnectionSuccess(), (error) => this.onConnectionFailure(error));
    }
    connect(connectionOptions) {
        return new Promise((resolve, reject) => {
            this._connection = mysql_1.createConnection(connectionOptions);
            ConnectionController.mysqlConnection = this._connection;
            this._connection.connect(error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(this._connection);
                }
            });
        });
    }
    openScratchpad() {
        return vscode.workspace.openTextDocument({ language: 'sql' })
            .then(doc => vscode.window.showTextDocument(doc));
    }
    onConnectionSuccess() {
        this._statusBarItem.text = 'MySQL: ' + this._connection.config.user + '@' + this._connection.config.host;
        OutputChannelController_1.OutputChannelController.outputConnection(this._connection);
        return this.openScratchpad();
    }
    onConnectionFailure(error) {
        this._statusBarItem.text = 'Failed to connect to MySQL server';
        setTimeout(() => this._statusBarItem.hide(), 3000);
        return this.handleConnectionError(error);
    }
    closeConnection() {
        if (!this._connection) {
            return null;
        }
        return this.disconnect()
            .then(() => this.onDisconnect(), error => this.handleConnectionError(error));
    }
    disconnect() {
        return new Promise((resolve, reject) => {
            this._connection.end(err => {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve();
                }
            });
        });
    }
    onDisconnect() {
        ResultCache_1.ResultCache.clear();
        this._statusBarItem.hide();
        vscode.window.showInformationMessage('MySQL connection closed.', {});
    }
    handleConnectionError(error) {
        return vscode.window.showErrorMessage("MySQL " + error.message);
    }
}
exports.ConnectionController = ConnectionController;
//# sourceMappingURL=ConnectionController.js.map
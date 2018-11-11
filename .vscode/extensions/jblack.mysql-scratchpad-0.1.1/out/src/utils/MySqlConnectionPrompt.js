"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class MySqlConnectionPrompt {
    static getMysqlConnectionOptions() {
        let options = {};
        let extensionConfig = vscode.workspace.getConfiguration('mysql-scratchpad');
        return this.getHostName(options)
            .then(options => this.getPort(options, extensionConfig))
            .then(options => this.getUserName(options))
            .then(options => this.getUserPass(options))
            .then(options => this.getDatabase(options, extensionConfig))
            .then(options => this.addDefaults(options));
    }
    static getOptionField(promptOptions, addInputToOptions) {
        return new Promise(resolve => {
            vscode.window.showInputBox(promptOptions)
                .then(inputString => resolve(addInputToOptions(inputString)));
        });
    }
    static getHostName(options) {
        return this.getOptionField({
            prompt: "MySQL Host"
        }, hostName => {
            options.host = hostName;
            return options;
        });
    }
    static getUserName(options) {
        return this.getOptionField({
            prompt: 'Username for ' + options.host
        }, userName => {
            options.user = userName;
            return options;
        });
    }
    static getUserPass(options) {
        return this.getOptionField({
            prompt: 'Password for ' + options.user + '@' + options.host,
            password: true
        }, userPass => {
            options.password = userPass;
            return options;
        });
    }
    static getPort(options, extensionConfig) {
        if (extensionConfig.get("promptForPort")) {
            return this.getOptionField({
                prompt: 'MySQL Port'
            }, port => {
                options.port = Number(port);
                return options;
            });
        }
        else {
            let defaultPort = extensionConfig.get("defaultMysqlPort");
            options.port = defaultPort;
            return new Promise(resolve => resolve(options));
        }
    }
    static getDatabase(options, extensionConfig) {
        if (extensionConfig.get("promptForDatabase")) {
            return this.getOptionField({
                prompt: 'Database Name'
            }, dbName => {
                options.database = dbName;
                return options;
            });
        }
        else {
            return new Promise(resolve => resolve(options));
        }
    }
    static addDefaults(options) {
        return new Promise((resolve, reject) => {
            options.multipleStatements = true;
            resolve(options);
        });
    }
}
exports.MySqlConnectionPrompt = MySqlConnectionPrompt;
//# sourceMappingURL=MySqlConnectionPrompt.js.map
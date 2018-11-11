"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const ConnectionController_1 = require("./ConnectionController");
const MySqlResultDocumentContentProvider_1 = require("../views/MySqlResultDocumentContentProvider");
const MySqlStatementParser_1 = require("../utils/MySqlStatementParser");
const OutputChannelController_1 = require("./OutputChannelController");
const ResultCache_1 = require("../utils/ResultCache");
class RequestController {
    constructor() {
        this._resultDocumentProvider = new MySqlResultDocumentContentProvider_1.MySqlResultDocumentContentProvider();
        this._resultDocumentRegistration = vscode_1.workspace.registerTextDocumentContentProvider('mysql-scratchpad', this._resultDocumentProvider);
    }
    dispose() {
        this._resultDocumentRegistration.dispose();
    }
    executeStatementUnderCursor(editor) {
        if (!editor || !editor.document) {
            return;
        }
        let parsed = new MySqlStatementParser_1.MySqlStatementParser(editor).parseStatementAndRangeUnderCursor();
        if (!parsed || !parsed.statement) {
            return;
        }
        this.updateDecorations(editor, parsed.range);
        this.execute(parsed.statement)
            .then(result => this.onSingleStatementExecutionSuccess(result, parsed.statement, editor), (error) => this.onExecutionError(error, parsed.statement, editor));
    }
    executeEntireFile(editor) {
        if (!editor || !editor.document) {
            return;
        }
        if (editor.document.languageId !== 'sql') {
            vscode_1.window.showWarningMessage('Cannot execute a non-sql file.');
        }
        let statements = editor.document.getText();
        this.execute(statements)
            .then(result => this.onMultipleStatementExecutionSuccess(result, statements, editor), error => this.onExecutionError(error, statements, editor));
    }
    executeSelectedText(editor) {
        if (!editor || !editor.document) {
            return;
        }
        if (editor.selection.isEmpty) {
            return;
        }
        let statement = editor.document.getText(editor.selection);
        this.execute(statement)
            .then(result => {
            if (this.isSingleStatement(statement)) {
                this.onSingleStatementExecutionSuccess(result, statement, editor);
            }
            else {
                this.onMultipleStatementExecutionSuccess(result, statement, editor);
            }
        }, error => this.onExecutionError(error, statement, editor));
    }
    execute(sql, args) {
        return new Promise((resolve, reject) => {
            let connection = ConnectionController_1.ConnectionController.getConnection();
            if (connection) {
                this._timer = new Date().getTime();
                connection.query(sql, args, (err, result, fields) => {
                    this._timer = (new Date().getTime()) - this._timer;
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            }
            else {
                reject({ message: 'No Connection' });
            }
        });
    }
    onSingleStatementExecutionSuccess(result, statement, editor) {
        OutputChannelController_1.OutputChannelController.outputSuccesss({
            statement: statement,
            message: result.message
        });
        this.cacheAndOpenResult(result, statement, editor, false);
    }
    onMultipleStatementExecutionSuccess(result, combinedStatements, editor) {
        let statements = combinedStatements.split(';');
        for (let i = 0; i < statements.length; i++) {
            let statement = statements[i];
            if (statement && statement.length > 0) {
                statement = statement.trim();
                let currentResult = result[i];
                OutputChannelController_1.OutputChannelController.outputSuccesss({
                    statement: statement,
                    message: currentResult.message
                });
                if (this.isOpenResultsInNewTab()) {
                    this.cacheAndOpenResult(currentResult, statement, editor, false);
                }
            }
        }
        if (!this.isOpenResultsInNewTab()) {
            this.cacheAndOpenResult(result, combinedStatements, editor, true);
        }
    }
    cacheAndOpenResult(result, statement, editor, isMultiStatement) {
        let uri = this.getResultUri();
        ResultCache_1.ResultCache.add(uri.toString(), {
            statement: statement,
            result: result,
            uri: uri.toString(),
            timeTaken: this._timer,
            error: null,
            multiStatement: isMultiStatement
        });
        this.openResult(uri, editor);
    }
    openResult(uri, editor) {
        this._resultDocumentProvider.refresh(uri);
        vscode_1.commands.executeCommand('vscode.previewHtml', uri, vscode_1.ViewColumn.Two, this.getResultTabTitle());
        vscode_1.window.showTextDocument(editor.document, 1, false);
    }
    onExecutionError(error, statement, editor) {
        let uri = this.getResultUri();
        ResultCache_1.ResultCache.add(uri.toString(), {
            statement: statement,
            result: null,
            uri: uri.toString(),
            timeTaken: this._timer,
            error: error
        });
        this.openResult(uri, editor);
        OutputChannelController_1.OutputChannelController.outputError({
            message: error.message,
            statement: statement
        });
    }
    isSingleStatement(text) {
        let count = 0;
        for (let statement of text.split(';')) {
            if (statement && statement.trim().length > 0) {
                count++;
                if (count >= 2) {
                    break;
                }
            }
        }
        return count === 1;
    }
    isOpenResultsInNewTab() {
        return vscode_1.workspace.getConfiguration('mysql-scratchpad').get('openResultsInNewTab');
    }
    getResultUri() {
        let uriPrefix = 'mysql-scratchpad://authority/result';
        let uriString;
        if (this.isOpenResultsInNewTab()) {
            let now = new Date().getTime();
            uriString = uriPrefix + now;
            while (ResultCache_1.ResultCache.has(uriString)) {
                now++;
                uriString = uriPrefix + now;
            }
        }
        else {
            uriString = uriPrefix;
        }
        return vscode_1.Uri.parse(uriString);
    }
    getResultTabTitle() {
        let tabTitle = "MySQL Result";
        if (this.isOpenResultsInNewTab()) {
            tabTitle += ` ${ResultCache_1.ResultCache.count() + 1}`;
        }
        return tabTitle;
    }
    updateDecorations(editor, range) {
        let options = {
            light: {
                backgroundColor: `rgba(0,255,0,0.4)`
            },
            dark: {
                backgroundColor: `rgba(255,255,255,0.4)`
            }
        };
        let decoType = vscode_1.window.createTextEditorDecorationType(options);
        editor.setDecorations(decoType, [range]);
        setTimeout(() => editor.setDecorations(decoType, []), 1000);
    }
}
exports.RequestController = RequestController;
//# sourceMappingURL=RequestController.js.map
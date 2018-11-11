"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
const ResultCache_1 = require("../utils/ResultCache");
class MySqlResultDocumentContentProvider {
    constructor() {
        this._onDidChange = new vscode_1.EventEmitter();
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    refresh(uri) {
        this._onDidChange.fire(uri);
    }
    provideTextDocumentContent(uri) {
        let storedResult = ResultCache_1.ResultCache.get(uri.toString());
        let output = this.head();
        if (storedResult) {
            if (!storedResult.multiStatement) {
                output = this.buildResultHtml(output, storedResult);
            }
            else {
                let statements = storedResult.statement.split(';');
                let results = storedResult.result;
                output += this.multiResultHeader(results.length);
                let resultObj = {
                    statement: null,
                    result: null,
                    uri: storedResult.uri,
                    timeTaken: storedResult.timeTaken,
                    error: storedResult.error,
                    multiStatement: true
                };
                for (let i = 0; i < statements.length; i++) {
                    let statement = statements[i].trim();
                    if (statement && statement.length > 0) {
                        if (i !== 0) {
                            output += this.resultDivider();
                        }
                        resultObj.statement = statements[i];
                        resultObj.result = results[i];
                        output = this.buildResultHtml(output, resultObj);
                    }
                }
            }
        }
        else {
            output += "<p class='cache-expired-message'>Result is no longer cached.</p><p>Change the 'resultCacheSize' setting to change the size of the result cache.</p>";
        }
        return output;
    }
    multiResultHeader(resultCount) {
        return `<h1 class="mulit-result-header">${resultCount} Results</h1>`;
    }
    buildResultHtml(html, storedResult) {
        html += this.header(storedResult);
        if (storedResult.error) {
            html += this.error(storedResult);
        }
        else if (storedResult.result instanceof Array) {
            html += this.table(storedResult);
        }
        else {
            html += this.databaseUpdate(storedResult);
        }
        return html;
    }
    head() {
        let head = `<head>
                        <link rel="stylesheet" href="${MySqlResultDocumentContentProvider.resultCssPath}">
                    </head>`;
        return head;
    }
    header(storedResult) {
        let header = `<h2>${storedResult.statement}</h2>
                        <p>Time taken: ${storedResult.timeTaken / 1000} seconds</p>`;
        if (storedResult.result && storedResult.result.message) {
            header += `<p>${storedResult.result.message}`;
        }
        return header;
    }
    table(storedResult) {
        if (storedResult.result.length < 1) {
            return "<p>Empty Result</p>";
        }
        let out = "<table><thead><tr>";
        let columns = [];
        for (let col in storedResult.result[0]) {
            columns.push(col);
            out += `<th>${col}</th>`;
        }
        out += "</tr></thead><tbody>";
        out += this.tableRows(columns, storedResult);
        out += "</tbody></table>";
        return out;
    }
    tableRows(columns, storedResult) {
        let out = "";
        for (let row of storedResult.result) {
            out += "<tr>";
            for (let col of columns) {
                out += `<td>${row[col]}</td>`;
            }
            out += "</tr>";
        }
        return out;
    }
    resultDivider() {
        return `<div class="result-divider"></div>`;
    }
    databaseUpdate(storedResult) {
        return `<p>Affected Rows: ${storedResult.result.affectedRows}</p>
                    <p>Warnings: ${storedResult.result.warningCount}</p>
                    <p>${storedResult.result.message}</p>`;
    }
    error(result) {
        return `<h4>Error</h4>
        <p>Code: ${result.error.code}</p>
        <p>Message: ${result.error.message.replace(result.error.code + ":", "")}</p>
        `;
    }
}
MySqlResultDocumentContentProvider.resultCssPath = path.join(vscode_1.extensions.getExtension('jblack.mysql-scratchpad').extensionPath, 'styles', 'result.css');
exports.MySqlResultDocumentContentProvider = MySqlResultDocumentContentProvider;
//# sourceMappingURL=MySqlResultDocumentContentProvider.js.map
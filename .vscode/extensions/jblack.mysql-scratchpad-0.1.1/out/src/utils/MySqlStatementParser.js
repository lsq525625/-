"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class MySqlStatementParser {
    constructor(editor) {
        this.editor = editor;
    }
    parseStatementAndRangeUnderCursor() {
        let cursorPosition = this.editor.selection.anchor;
        if (this.cursorIsInEmptyLine(cursorPosition)) {
            return null;
        }
        if (this.cursorIsInComment(cursorPosition)) {
            return null;
        }
        let startPos = this.getStartOfStatement(cursorPosition.line, cursorPosition.character);
        let endPos;
        if (this.cursorAndStatementStartAtEndOfLine(startPos.character, this.editor.document.lineAt(cursorPosition.line))) {
            startPos = this.getStartOfStatement(cursorPosition.line, startPos.character - 1);
            if (startPos.line !== cursorPosition.line) {
                endPos = this.getEndOfStatement(cursorPosition.line, cursorPosition.character - 1);
            }
            else {
                endPos = this.getEndOfStatement(cursorPosition.line, startPos.character - 1);
            }
        }
        else {
            endPos = this.getEndOfStatement(cursorPosition.line, cursorPosition.character);
        }
        startPos = this.removeWhitespaceFromStartPos(startPos, endPos);
        let statement = this.stripComments(startPos, endPos);
        if (statement.length < 1) {
            statement = null;
        }
        return {
            statement: statement,
            range: new vscode_1.Range(startPos, endPos)
        };
    }
    cursorIsInEmptyLine(cursorPosition) {
        let line = this.editor.document.lineAt(cursorPosition.line);
        return line.isEmptyOrWhitespace;
    }
    cursorIsInComment(cursorPosition) {
        let line = this.editor.document.lineAt(cursorPosition.line);
        return line.text.lastIndexOf("--", cursorPosition.character) > -1;
    }
    cursorAndStatementStartAtEndOfLine(startPos, line) {
        let text = this.stripCommentFromLine(line.text).trim();
        if (startPos === text.length && this.editor.selection.anchor.line === line.lineNumber) {
            return true;
        }
        return false;
    }
    getStartOfStatement(lineNum, startPos) {
        let line = this.editor.document.lineAt(lineNum);
        if (startPos === null || startPos === undefined) {
            startPos = line.range.end.character;
        }
        else if (startPos > 0) {
            startPos--;
        }
        let startOfStatement = line.text.lastIndexOf(';', startPos);
        if (startOfStatement > -1) {
            return new vscode_1.Position(lineNum, ++startOfStatement);
        }
        else if (lineNum > 0) {
            return this.getStartOfStatement(--lineNum);
        }
        else {
            return line.range.start;
        }
    }
    getEndOfStatement(lineNum, startPos) {
        let line = this.editor.document.lineAt(lineNum);
        if (!startPos) {
            startPos = 0;
        }
        let endOfStatement = line.text.indexOf(';', startPos);
        if (endOfStatement > -1) {
            return new vscode_1.Position(lineNum, endOfStatement + 1);
        }
        else if (lineNum < this.editor.document.lineCount - 1) {
            return this.getEndOfStatement(++lineNum);
        }
        else {
            return line.range.end;
        }
    }
    stripComments(startPos, endPos, stripNewline) {
        let statement = "";
        let currentLine = startPos.line;
        while (currentLine <= endPos.line) {
            let lineText = this.editor.document.lineAt(currentLine).text;
            if (startPos.line === endPos.line) {
                lineText = lineText.substr(startPos.character, endPos.character - startPos.character);
            }
            else if (currentLine === startPos.line) {
                lineText = lineText.substr(startPos.character);
            }
            else if (currentLine === endPos.line) {
                lineText = lineText.substring(0, endPos.character);
            }
            lineText = this.stripCommentFromLine(lineText);
            statement += lineText;
            if (!stripNewline) {
                statement += "\n";
            }
            currentLine++;
        }
        return statement.trim();
    }
    stripCommentFromLine(line) {
        let commentIdx = line.indexOf("--");
        if (commentIdx > -1) {
            line = line.substring(0, commentIdx);
        }
        return line;
    }
    removeWhitespaceFromStartPos(startPos, endPos) {
        let statement = this.editor.document.getText(new vscode_1.Range(startPos, endPos));
        let preLength = statement.length;
        statement = this.trimLeft(statement);
        let difference = preLength - statement.length;
        if (difference > 0) {
            let offset = this.editor.document.offsetAt(startPos);
            startPos = this.editor.document.positionAt(offset + difference);
        }
        return startPos;
    }
    trimLeft(input) {
        return input.replace(/^[\s\uFEFF\xA0]+/g, '');
    }
}
exports.MySqlStatementParser = MySqlStatementParser;
//# sourceMappingURL=MySqlStatementParser.js.map
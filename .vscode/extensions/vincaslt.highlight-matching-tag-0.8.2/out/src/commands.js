"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const tagMatcher_1 = require("./tagMatcher");
const tagParser_1 = require("./tagParser");
function jumpToMatchingTag() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const tagsList = tagParser_1.parseTags(editor.document.getText());
        const position = editor.selection.active;
        const positionOffset = editor.document.offsetAt(position);
        const match = tagMatcher_1.findMatchingTag(tagsList, positionOffset);
        if (match) {
            const openingTagStartPos = editor.document.positionAt(match.opening.start);
            const openingTagRange = new vscode.Range(openingTagStartPos, editor.document.positionAt(match.opening.end));
            const newPosition = openingTagRange.contains(position)
                ? editor.document.positionAt(match.closing.start).translate(0, 1)
                : openingTagStartPos.translate(0, 1);
            editor.selection = new vscode.Selection(newPosition, newPosition);
            editor.revealRange(editor.selection);
        }
        else {
            vscode.window.showInformationMessage('No matching tag was found');
        }
    });
}
exports.jumpToMatchingTag = jumpToMatchingTag;
//# sourceMappingURL=commands.js.map
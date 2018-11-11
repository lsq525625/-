'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands_1 = require("./commands");
const configuration_1 = require("./configuration");
const tagMatcher_1 = require("./tagMatcher");
const tagParser_1 = require("./tagParser");
const tagStyler_1 = require("./tagStyler");
// TODO: default style is underline with tag's color from theme
// TODO: disable default tag highlighting (active selections)
/*
TODO: Shortcuts
  - Highlight path (all tags in path)

TODO: Floating opening tag
*/
function updateTagStatusBarItem(status, tagsList, position) {
    const tagsForPosition = tagMatcher_1.getTagsForPosition(tagsList, position);
    status.text = tagsForPosition.reduce((str, pair, i, pairs) => {
        const name = pair.opening.name;
        if (i === 0) {
            return `${name}`;
        }
        const separator = pairs[i - 1].attributeNestingLevel < pair.attributeNestingLevel ? ` ~ ` : ' › ';
        return str + separator + name;
    }, '');
    status.text = status.text.trim().replace('›  ›', '»');
    if (tagsForPosition.length > 1) {
        status.show();
    }
    else {
        status.hide();
    }
}
function activate(context) {
    configuration_1.default.configure(context);
    // Updates version for future migrations
    const extension = vscode.extensions.getExtension('vincaslt.highlight-matching-tag');
    const currentVersion = extension && extension.packageJSON.version;
    if (configuration_1.default.hasOldSettings) {
        vscode.window
            .showInformationMessage('Highlight Matching Tag has new default styles. Would you like to keep your existing styles or discard them and use new ones?', 'Keep', 'Discard')
            .then((value) => {
            configuration_1.default.migrate(value === 'Keep');
        });
    }
    context.globalState.update('hmtVersion', currentVersion);
    const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 120);
    const tagStyler = new tagStyler_1.default();
    status.tooltip = 'Path to tag';
    let editor;
    let tagsList;
    let editorText;
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => {
        editor = vscode.window.activeTextEditor;
        if (!configuration_1.default.isEnabled || !editor) {
            return;
        }
        if (!tagsList || editorText !== editor.document.getText()) {
            editorText = editor.document.getText();
            tagsList = tagParser_1.parseTags(editorText);
        }
        const position = editor.document.offsetAt(editor.selection.active);
        // Highlight matching tag
        const match = tagMatcher_1.findMatchingTag(tagsList, position);
        // Tag breadcrumbs
        if (configuration_1.default.showPath) {
            updateTagStatusBarItem(status, tagsList, position);
        }
        if (match && (match.opening !== match.closing || configuration_1.default.highlightSelfClosing)) {
            tagStyler.decoratePair(match, editor);
        }
        else {
            tagStyler.clearDecorations();
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('highlight-matching-tag.jumpToMatchingTag', commands_1.jumpToMatchingTag));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
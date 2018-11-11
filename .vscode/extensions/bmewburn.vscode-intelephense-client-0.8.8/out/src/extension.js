/* Copyright (c) Ben Robert Mewburn
 * Licensed under the ISC Licence.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const semver = require("semver");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const workspaceDiscovery_1 = require("./workspaceDiscovery");
const embeddedContentDocuments_1 = require("./embeddedContentDocuments");
const phpLanguageId = 'php';
const version = '0.8.6';
let maxFileSizeBytes = 10000000;
let languageClient;
let extensionContext;
let cancelWorkspaceDiscoveryController;
function activate(context) {
    extensionContext = context;
    let versionMemento = context.workspaceState.get('version');
    let clearCache = context.workspaceState.get('clearCache');
    context.workspaceState.update('clearCache', undefined);
    context.workspaceState.update('version', version);
    if (!versionMemento || (semver.lt(versionMemento, '0.8.6'))) {
        clearCache = true;
    }
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('node_modules', 'intelephense-server', 'lib', 'server.js'));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--debug=6039"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    let middleware = embeddedContentDocuments_1.initializeEmbeddedContentDocuments(() => {
        return languageClient;
    });
    // Options to control the language client
    let clientOptions = {
        documentSelector: [
            { language: phpLanguageId, scheme: 'file' },
        ],
        synchronize: {
            // Synchronize the setting section 'intelephense' to the server
            configurationSection: 'intelephense',
        },
        initializationOptions: {
            storagePath: context.storagePath,
            clearCache: clearCache
        },
        middleware: middleware.middleware
    };
    let fsWatcher = vscode_1.workspace.createFileSystemWatcher(workspaceFilesIncludeGlob());
    fsWatcher.onDidDelete(onDidDelete);
    fsWatcher.onDidCreate(onDidCreate);
    fsWatcher.onDidChange(onDidChange);
    // Create the language client and start the client.
    languageClient = new vscode_languageclient_1.LanguageClient('intelephense', 'intelephense', serverOptions, clientOptions);
    let langClientDisposable = languageClient.start();
    let ready = languageClient.onReady();
    ready.then(() => {
        languageClient.info('Intelephense ' + version);
    });
    workspaceDiscovery_1.WorkspaceDiscovery.client = languageClient;
    workspaceDiscovery_1.WorkspaceDiscovery.maxFileSizeBytes = vscode_1.workspace.getConfiguration("intelephense.file").get('maxSize');
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        let token;
        ready.then(() => {
            if (cancelWorkspaceDiscoveryController) {
                cancelWorkspaceDiscoveryController.dispose();
            }
            cancelWorkspaceDiscoveryController = new vscode_1.CancellationTokenSource();
            token = cancelWorkspaceDiscoveryController.token;
            return vscode_1.workspace.findFiles(workspaceFilesIncludeGlob(), undefined, undefined, token);
        }).then((uriArray) => {
            indexWorkspace(uriArray, true, token);
        });
    }
    let onDidChangeWorkspaceFoldersDisposable = vscode_1.workspace.onDidChangeWorkspaceFolders((e) => {
        //handle folder add/remove
        if (cancelWorkspaceDiscoveryController) {
            cancelWorkspaceDiscoveryController.dispose();
        }
        cancelWorkspaceDiscoveryController = new vscode_1.CancellationTokenSource();
        let token = cancelWorkspaceDiscoveryController.token;
        return vscode_1.workspace.findFiles(workspaceFilesIncludeGlob()).then((uriArray) => {
            indexWorkspace(uriArray, false, token);
        });
    });
    let importCommandDisposable = vscode_1.commands.registerTextEditorCommand('intelephense.import', importCommandHandler);
    let clearCacheDisposable = vscode_1.commands.registerCommand('intelephense.clear.cache', clearCacheCommandHandler);
    let cancelIndexingDisposable = vscode_1.commands.registerCommand('intelephense.cancel.indexing', cancelWorkspaceDiscoveryHandler);
    //push disposables
    context.subscriptions.push(langClientDisposable, fsWatcher, importCommandDisposable, clearCacheDisposable, onDidChangeWorkspaceFoldersDisposable, cancelIndexingDisposable, middleware);
}
exports.activate = activate;
function importCommandHandler(textEditor, edit) {
    let inputPromise = vscode_1.window.showInputBox({ placeHolder: 'Enter an alias (optional)' });
    inputPromise.then((text) => {
        return languageClient.sendRequest('importSymbol', { uri: textEditor.document.uri.toString(), position: textEditor.selection.active, alias: text });
    }).then((edits) => {
        textEditor.edit((eb) => {
            edits.forEach((e) => {
                eb.replace(new vscode_1.Range(new vscode_1.Position(e.range.start.line, e.range.start.character), new vscode_1.Position(e.range.end.line, e.range.end.character)), e.newText);
            });
        });
    });
}
function clearCacheCommandHandler() {
    return extensionContext.workspaceState.update('clearCache', true).then(() => {
        vscode_1.commands.executeCommand('workbench.action.reloadWindow');
    });
}
function cancelWorkspaceDiscoveryHandler() {
    if (cancelWorkspaceDiscoveryController) {
        cancelWorkspaceDiscoveryController.dispose();
        cancelWorkspaceDiscoveryController = undefined;
    }
}
function workspaceFilesIncludeGlob() {
    let settings = vscode_1.workspace.getConfiguration('files').get('associations');
    let associations = Object.keys(settings).filter((x) => {
        return settings[x] === phpLanguageId;
    });
    associations.push('*.php');
    associations = associations.map((v, i, a) => {
        if (v.indexOf('/') < 0 && v.indexOf('\\') < 0) {
            return '**/' + v;
        }
        else {
            return v;
        }
    });
    return '{' + Array.from(new Set(associations)).join(',') + '}';
}
function onDidDelete(uri) {
    workspaceDiscovery_1.WorkspaceDiscovery.forget(uri);
}
function onDidChange(uri) {
    workspaceDiscovery_1.WorkspaceDiscovery.delayedDiscover(uri);
}
function onDidCreate(uri) {
    onDidChange(uri);
}
function indexWorkspace(uriArray, checkModTime, token) {
    if (token.isCancellationRequested) {
        return;
    }
    let indexingStartHrtime = process.hrtime();
    languageClient.info('Indexing started.');
    let completedPromise = workspaceDiscovery_1.WorkspaceDiscovery.checkCacheThenDiscover(uriArray, checkModTime, token).then((count) => {
        indexingCompleteFeedback(indexingStartHrtime, count, token);
    });
    vscode_1.window.setStatusBarMessage('$(search) intelephense indexing ...', completedPromise);
}
function indexingCompleteFeedback(startHrtime, fileCount, token) {
    let elapsed = process.hrtime(startHrtime);
    let info = [
        `${fileCount} files`,
        `${elapsed[0]}.${Math.round(elapsed[1] / 1000000)} s`
    ];
    languageClient.info([token.isCancellationRequested ? 'Indexing cancelled' : 'Indexing ended', ...info].join(' | '));
    vscode_1.window.setStatusBarMessage([
        '$(search) intelephense indexing ' + (token.isCancellationRequested ? 'cancelled' : 'complete'),
        `$(file-code) ${fileCount}`,
        `$(clock) ${elapsed[0]}.${Math.round(elapsed[1] / 100000000)}`
    ].join('   '), 30000);
}
//# sourceMappingURL=extension.js.map
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* Copyright (c) Ben Robert Mewburn
 * Licensed under the ISC Licence.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const embeddedContentUri_1 = require("./embeddedContentUri");
const documentLanguageRangesRequestName = 'documentLanguageRanges';
const phpLanguageId = 'php';
const htmlLanguageId = 'html';
function initializeEmbeddedContentDocuments(getClient) {
    let toDispose = [];
    let embeddedContentChanged = new vscode_1.EventEmitter();
    // remember all open virtual documents with the version of the content
    let openVirtualDocuments = {};
    //doc lang ranges
    let documentLanguageRanges = {};
    // documents are closed after a time out or when collected.
    toDispose.push(vscode_1.workspace.onDidCloseTextDocument(d => {
        if (embeddedContentUri_1.isEmbeddedContentUri(d.uri)) {
            delete openVirtualDocuments[d.uri.toString()];
            delete documentLanguageRanges[d.uri.toString()];
        }
    }));
    let languageRange2Code = (v) => {
        return {
            range: getClient().protocol2CodeConverter.asRange(v.range),
            languageId: v.languageId
        };
    };
    let fetchRanges = (virtualUri) => {
        let hostUri = embeddedContentUri_1.getHostDocumentUri(virtualUri);
        return documentLanguageRangesRequest(hostUri, getClient()).then((list) => {
            let virtualURIString = virtualUri.toString();
            if (!list || !list.version || !list.ranges) {
                delete documentLanguageRanges[virtualURIString];
                delete openVirtualDocuments[virtualURIString];
                return undefined;
            }
            openVirtualDocuments[virtualURIString] = list.version;
            documentLanguageRanges[virtualURIString] = list.ranges.map(languageRange2Code);
            return documentLanguageRanges[virtualURIString];
        });
    };
    const replacePattern = /\S/g;
    function phpEscapedContent(ranges, uri) {
        let finderFn = (x) => {
            return x.uri.toString() === uri;
        };
        let doc = vscode_1.workspace.textDocuments.find(finderFn);
        if (!doc || !ranges || ranges.length < 1) {
            return '';
        }
        let r;
        let text = '';
        let part;
        for (let n = 0, l = ranges.length; n < l; ++n) {
            r = ranges[n];
            part = doc.getText(r.range);
            if (part && r.languageId === phpLanguageId) {
                part = part.replace(replacePattern, ' ');
            }
            text += part;
        }
        return text;
    }
    // virtual document provider
    toDispose.push(vscode_1.workspace.registerTextDocumentContentProvider(embeddedContentUri_1.EMBEDDED_CONTENT_SCHEME, {
        provideTextDocumentContent: uri => {
            if (embeddedContentUri_1.isEmbeddedContentUri(uri)) {
                let docRanges = documentLanguageRanges[uri.toString()];
                if (!docRanges) {
                    return fetchRanges(uri).then((ranges) => {
                        return phpEscapedContent(ranges, embeddedContentUri_1.getHostDocumentUri(uri));
                    });
                }
                else {
                    return phpEscapedContent(docRanges, embeddedContentUri_1.getHostDocumentUri(uri));
                }
            }
            return '';
        },
        onDidChange: embeddedContentChanged.event
    }));
    /*
    // diagnostics for embedded contents
    client.onNotification(EmbeddedContentChangedNotification.type, p => {
        for (let languageId in embeddedLanguages) {
            if (p.embeddedLanguageIds.indexOf(languageId) !== -1) {
                // open the document so that validation is triggered in the embedded mode
                let virtualUri = getEmbeddedContentUri(p.uri, languageId);
                openEmbeddedContentDocument(virtualUri, p.version);
            }
        }
    });
    */
    function shouldForwardRequest(virtualURI, expectedVersion, place) {
        let virtualURIString = virtualURI.toString();
        let virtualDocVersion = openVirtualDocuments[virtualURIString];
        let waitForDocChange;
        if (isDefined(virtualDocVersion) && virtualDocVersion !== expectedVersion) {
            waitForDocChange = new Promise((resolve, reject) => {
                let subscription = vscode_1.workspace.onDidChangeTextDocument(d => {
                    if (d.document.uri.toString() === virtualURIString) {
                        subscription.dispose();
                        resolve();
                    }
                });
                delete documentLanguageRanges[virtualURIString];
                delete openVirtualDocuments[virtualURIString];
                embeddedContentChanged.fire(virtualURI);
            });
        }
        if (!waitForDocChange) {
            waitForDocChange = Promise.resolve();
        }
        return waitForDocChange.then(() => {
            return fetchRanges(virtualURI);
        }).then((ranges) => {
            if (!ranges || ranges.length < 1) {
                return false;
            }
            else if (!place) {
                return ranges.length > 1;
            }
            else if (place.line) {
                return !isPositionPhp(ranges, place);
            }
            else {
                return !isRangePhpOnly(ranges, place);
            }
        });
    }
    /*
    function ensureContentUpdated(virtualURI: Uri, expectedVersion: number) {

        let virtualURIString = virtualURI.toString();
        let virtualDocVersion = openVirtualDocuments[virtualURIString];
        if (isDefined(virtualDocVersion) && virtualDocVersion !== expectedVersion) {
            return new Promise<void>((resolve, reject) => {
                let subscription = workspace.onDidChangeTextDocument(d => {
                    if (d.document.uri.toString() === virtualURIString) {
                        subscription.dispose();
                        resolve();
                    }
                });
                delete documentLanguageRanges[virtualURIString];
                delete openVirtualDocuments[virtualURIString];
                embeddedContentChanged.fire(virtualURI);
            });
        }
        return Promise.resolve();
    };
    */
    function openEmbeddedContentDocument(virtualURI, expectedVersion) {
        return vscode_1.workspace.openTextDocument(virtualURI).then(document => {
            if (expectedVersion === openVirtualDocuments[virtualURI.toString()]) {
                return document;
            }
            return void 0;
        });
    }
    ;
    function isPositionPhp(ranges, position) {
        if (!ranges || ranges.length < 1) {
            return true;
        }
        let r;
        for (let n = 0, l = ranges.length; n < l; ++n) {
            r = ranges[n].range;
            if (r.contains(position)) {
                return ranges[n].languageId === phpLanguageId;
            }
        }
        return true;
    }
    function isRangePhpOnly(ranges, range) {
        if (!ranges || ranges.length < 1) {
            return false;
        }
        let r;
        let started = false;
        for (let n = 0, l = ranges.length; n < l; ++n) {
            r = ranges[n].range;
            if (!started && r.contains(range.start)) {
                if (ranges[n].languageId !== phpLanguageId) {
                    return false;
                }
                else {
                    started = true;
                }
            }
            else if (started) {
                if (ranges[n].languageId !== phpLanguageId) {
                    return false;
                }
                if (r.contains(range.end)) {
                    return ranges[n].languageId !== phpLanguageId;
                }
            }
        }
        return false;
    }
    function middleWarePositionalRequest(doc, position, first, isFalseyResult, next, defaultResult, token) {
        let result = first();
        if (!isThenable(result)) {
            result = Promise.resolve(result);
        }
        return result.then((value) => {
            if (!isFalseyResult(value) || token.isCancellationRequested) {
                return value;
            }
            let embeddedContentUri = embeddedContentUri_1.getEmbeddedContentUri(doc.uri.toString(), htmlLanguageId);
            return shouldForwardRequest(embeddedContentUri, doc.version, position).then(shouldForward => {
                if (!shouldForward || token.isCancellationRequested) {
                    return defaultResult;
                }
                else {
                    return openEmbeddedContentDocument(embeddedContentUri, doc.version).then(vdoc => {
                        return vdoc ? next(vdoc) : defaultResult;
                    });
                }
            });
        });
    }
    let middleware = {
        provideCompletionItem: (document, position, context, token, next) => {
            return middleWarePositionalRequest(document, position, () => {
                if (context.triggerCharacter === '<' || context.triggerCharacter === '/' || context.triggerCharacter === '.') {
                    //not php trigger chars -- dont send request to php server
                    return undefined;
                }
                return next(document, position, context, token);
            }, isFalseyCompletionResult, (vdoc) => {
                if (context.triggerCharacter === '$' || context.triggerCharacter === '>' || context.triggerCharacter === '\\') {
                    //these are php trigger chars -- dont forward to html
                    return new vscode_1.CompletionList([], false);
                }
                return vscode_1.commands.executeCommand('vscode.executeCompletionItemProvider', vdoc.uri, position, context.triggerCharacter);
            }, new vscode_1.CompletionList([], false), token);
        },
        provideSignatureHelp: (document, position, token, next) => {
            return middleWarePositionalRequest(document, position, () => {
                return next(document, position, token);
            }, (r) => { return !r; }, (vdoc) => {
                return vscode_1.commands.executeCommand('vscode.executeSignatureHelpProvider', vdoc.uri, position);
            }, undefined, token);
        },
        provideDefinition: (document, position, token, next) => {
            return middleWarePositionalRequest(document, position, () => {
                return next(document, position, token);
            }, (r) => { return !r || (Array.isArray(r) && r.length < 1); }, (vdoc) => {
                return vscode_1.commands.executeCommand('vscode.executeDefinitionProvider', vdoc.uri, position).then((def) => {
                    if (!def) {
                        return def;
                    }
                    else if (Array.isArray(def)) {
                        def.forEach((v) => {
                            if (embeddedContentUri_1.isEmbeddedContentUri(v.uri)) {
                                v.uri = getClient().protocol2CodeConverter.asUri(embeddedContentUri_1.getHostDocumentUri(v.uri));
                            }
                        });
                        return def;
                    }
                    else {
                        if (embeddedContentUri_1.isEmbeddedContentUri(def.uri)) {
                            def.uri = getClient().protocol2CodeConverter.asUri(embeddedContentUri_1.getHostDocumentUri(def.uri));
                        }
                        return def;
                    }
                });
            }, [], token);
        },
        provideReferences: (document, position, options, token, next) => {
            return middleWarePositionalRequest(document, position, () => {
                return next(document, position, options, token);
            }, (r) => { return !r || (Array.isArray(r) && r.length < 1); }, (vdoc) => {
                return vscode_1.commands.executeCommand('vscode.executeReferenceProvider', vdoc.uri, position).then(locs => {
                    locs.forEach((v) => {
                        if (embeddedContentUri_1.isEmbeddedContentUri(v.uri)) {
                            v.uri = getClient().protocol2CodeConverter.asUri(embeddedContentUri_1.getHostDocumentUri(v.uri));
                        }
                    });
                    return locs;
                });
            }, [], token);
        },
        /*
                provideDocumentSymbols: (document: TextDocument, token: CancellationToken, next: ProvideDocumentSymbolsSignature) => {
        
                    return new Promise((resolve, reject) => {
        
                        let vdocUri = getEmbeddedContentUri(document.uri.toString(), htmlLanguageId);
                        let symbolInformationArray = [];
                        let responseCounter = 2;
        
        
                        let onResolved = (value: SymbolInformation[]) => {
                            if (value) {
                                Array.prototype.push.apply(symbolInformationArray, value);
                            }
                            if (--responseCounter < 1) {
                                resolve(symbolInformationArray);
                            }
                        }
        
                        let htmlResult = openEmbeddedContentDocument(vdocUri, document.version).then((vdoc) => {
                            return commands.executeCommand<SymbolInformation[]>('vscode.executeDocumentSymbolProvider', vdoc.uri);
                        });
                        if (!isThenable(htmlResult)) {
                            htmlResult = Promise.resolve(htmlResult);
                        }
                        htmlResult.then(onResolved);
        
                        let phpResult = next(document, token);
                        if (!isThenable(phpResult)) {
                            phpResult = Promise.resolve(phpResult);
                        }
                        (<Thenable<SymbolInformation[]>>phpResult).then(onResolved);
        
                    });
        
                },
        */
        provideDocumentLinks: (document, token, next) => {
            let vdocUri = embeddedContentUri_1.getEmbeddedContentUri(document.uri.toString(), htmlLanguageId);
            return shouldForwardRequest(vdocUri, document.version).then(result => {
                if (!result || token.isCancellationRequested) {
                    return [];
                }
                return openEmbeddedContentDocument(vdocUri, document.version).then((vdoc) => {
                    return vdoc ? vscode_1.commands.executeCommand('vscode.executeLinkProvider', vdoc.uri) : [];
                });
            });
        },
        provideDocumentHighlights: (document, position, token, next) => {
            return middleWarePositionalRequest(document, position, () => {
                return next(document, position, token);
            }, (r) => { return !r || (Array.isArray(r) && r.length < 1); }, (vdoc) => {
                return vscode_1.commands.executeCommand('vscode.executeDocumentHighlights', vdoc.uri, position);
            }, [], token);
        },
        provideHover: (document, position, token, next) => {
            return middleWarePositionalRequest(document, position, () => {
                return next(document, position, token);
            }, (r) => { return !r || !r.contents || (Array.isArray(r.contents) && r.contents.length < 1); }, (vdoc) => {
                return vscode_1.commands.executeCommand('vscode.executeHoverProvider', vdoc.uri, position).then((h) => {
                    return h.shift();
                });
            }, undefined, token);
        }
    };
    return {
        middleware: middleware,
        dispose: vscode_1.Disposable.from(...toDispose).dispose
    };
}
exports.initializeEmbeddedContentDocuments = initializeEmbeddedContentDocuments;
function isDefined(o) {
    return typeof o !== 'undefined';
}
function documentLanguageRangesRequest(uri, client) {
    return client.sendRequest(documentLanguageRangesRequestName, { textDocument: { uri: uri } });
}
function isThenable(obj) {
    return obj && obj.then !== undefined;
}
function isFalseyCompletionResult(result) {
    return !result || (Array.isArray(result) && result.length < 1) || !result.items || result.items.length < 1;
}
//# sourceMappingURL=embeddedContentDocuments.js.map
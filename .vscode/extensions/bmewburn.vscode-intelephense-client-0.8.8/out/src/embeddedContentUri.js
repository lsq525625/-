/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
exports.EMBEDDED_CONTENT_SCHEME = 'embedded-content';
function isEmbeddedContentUri(virtualDocumentUri) {
    return virtualDocumentUri.scheme === exports.EMBEDDED_CONTENT_SCHEME;
}
exports.isEmbeddedContentUri = isEmbeddedContentUri;
function getEmbeddedContentUri(parentDocumentUri, embeddedLanguageId) {
    let uriString = exports.EMBEDDED_CONTENT_SCHEME + '://' + embeddedLanguageId + '/' + encodeURIComponent(parentDocumentUri) + '.' + embeddedLanguageId;
    return vscode_1.Uri.parse(uriString);
}
exports.getEmbeddedContentUri = getEmbeddedContentUri;
;
function getHostDocumentUri(virtualDocumentUri) {
    let languageId = virtualDocumentUri.authority;
    let path = virtualDocumentUri.path.substring(1, virtualDocumentUri.path.length - languageId.length - 1); // remove leading '/' and new file extension
    return decodeURIComponent(path);
}
exports.getHostDocumentUri = getHostDocumentUri;
;
function getEmbeddedLanguageId(virtualDocumentUri) {
    return virtualDocumentUri.authority;
}
exports.getEmbeddedLanguageId = getEmbeddedLanguageId;
//# sourceMappingURL=embeddedContentUri.js.map
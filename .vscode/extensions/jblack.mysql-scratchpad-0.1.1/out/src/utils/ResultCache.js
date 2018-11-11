"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class ResultCache {
    static add(uri, result) {
        this.store.set(uri, result);
        this.nth++;
        let toRemove = null;
        if (vscode_1.workspace.getConfiguration('mysql-scratchpad').get('openResultsInNewTab')) {
            this.cacheWindow.push(uri);
            toRemove = this.shiftCacheWindow();
        }
        return toRemove;
    }
    static count() {
        return this.nth;
    }
    static get(uri) {
        return this.store.get(uri);
    }
    static has(uri) {
        return this.store.has(uri);
    }
    static clear() {
        this.store.clear();
        this.nth = 0;
    }
    static shiftCacheWindow() {
        let toRemove = null;
        if (this.CACHE_SIZE > 0 && this.cacheWindow.length > this.CACHE_SIZE) {
            toRemove = this.cacheWindow.shift();
            this.remove(toRemove);
        }
        return toRemove;
    }
    static remove(uri) {
        if (this.store.has(uri)) {
            this.store.delete(uri);
        }
    }
}
ResultCache.CACHE_SIZE = vscode_1.workspace.getConfiguration('mysql-scratchpad').get('resultCacheSize') | 10;
ResultCache.store = new Map();
ResultCache.cacheWindow = new Array();
ResultCache.nth = 0;
exports.ResultCache = ResultCache;
//# sourceMappingURL=ResultCache.js.map
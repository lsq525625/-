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
const extensionId = 'highlight-matching-tag';
class Configuration {
    constructor() {
        this.config = vscode.workspace.getConfiguration(extensionId);
    }
    get isEnabled() {
        return !!this.config.get('enabled');
    }
    get highlightSelfClosing() {
        return !!this.config.get('highlightSelfClosing');
    }
    get showPath() {
        return !!this.config.get('showPath');
    }
    get showRuler() {
        return !!this.config.get('showRuler');
    }
    get styles() {
        return this.config.get('styles');
    }
    configure(context) {
        context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this));
    }
    get hasOldSettings() {
        return !!(this.config.get('style') ||
            this.config.get('leftStyle') ||
            this.config.get('rightStyle') ||
            this.config.get('beginningStyle') ||
            this.config.get('endingStyle'));
    }
    /**
     * Migrates styling settings from version 0.7.1 -> 0.8.0
     */
    migrate(keepSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldStyle = this.config.get('style');
            const oldLeftStyle = this.config.get('leftStyle');
            const oldRightStyle = this.config.get('rightStyle');
            const oldBeginningStyle = this.config.get('beginningStyle');
            const oldEndingStyle = this.config.get('endingStyle');
            const newStyles = this.styles || { opening: {} };
            if (keepSettings) {
                if (oldStyle) {
                    newStyles.opening.full = { custom: oldStyle };
                    this.update('styles', newStyles);
                }
                if (oldLeftStyle) {
                    newStyles.opening.left = { custom: oldLeftStyle };
                    this.update('styles', newStyles);
                }
                if (oldRightStyle) {
                    newStyles.opening.right = { custom: oldRightStyle };
                    this.update('styles', newStyles);
                }
                if (oldBeginningStyle) {
                    newStyles.opening.full = { custom: oldBeginningStyle };
                    this.update('styles', newStyles);
                }
                if (oldEndingStyle) {
                    newStyles.opening.full = { custom: oldEndingStyle };
                    this.update('styles', newStyles);
                }
            }
            this.update('style', undefined);
            this.update('leftStyle', undefined);
            this.update('rightStyle', undefined);
            this.update('beginningStyle', undefined);
            this.update('endingStyle', undefined);
        });
    }
    update(section, value) {
        return vscode.workspace
            .getConfiguration(extensionId)
            .update(section, value, vscode.ConfigurationTarget.Global);
    }
    onConfigurationChanged() {
        this.config = vscode.workspace.getConfiguration(extensionId);
    }
}
const configuration = new Configuration();
exports.default = configuration;
//# sourceMappingURL=configuration.js.map
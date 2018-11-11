/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/
import * as vscode from 'vscode';
import { Snippets } from '../res/snippets';
export interface Config {
    getResolveRoots: (doc: vscode.TextDocument) => string[];
    /** wxml 格式化时一行中允许的最长的字符串长度 */
    formatMaxLineCharacters: number;
    /** 是否禁用自定义的组件补全 */
    disableCustomComponentAutocomponent: boolean;
    /** 解析自定义组件的根目录 */
    resolveRoots: string[];
    /** 使用 LinkProvider 处理的标签属性 */
    linkAttributeNames: string[];
    /** 是否禁用颜色高亮 */
    disableDecorate: boolean;
    /** 是否高亮复杂的语句 */
    decorateComplexInterpolation: boolean;
    /** 自定义高亮样式 */
    decorateType: any;
    /** 用户自定义的 snippets */
    snippets: {
        wxml?: Snippets;
        pug?: Snippets;
    };
    /** 自我闭合的标签 */
    selfCloseTags: string[];
    /** 默认在启动时会自动相关文件关联的配置项，配置成功后会将此配置自动设置成 true，避免下次启动再重新配置 */
    disableAutoConfig: boolean;
    wxmlQuoteStyle: string;
    pugQuoteStyle: string;
    reserveTags: string[];
}
export declare const config: Config;
export declare function configActivate(): void;
export declare function configDeactivate(): void;

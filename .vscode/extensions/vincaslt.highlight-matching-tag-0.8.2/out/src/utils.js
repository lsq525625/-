"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debounce(fn, delay) {
    let timeoutID;
    return function (...args) {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => fn.apply(this, args), delay);
    };
}
exports.debounce = debounce;
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Checks if tag is is comparable with hmt.Match type (has opening and matching tags)
function isTagPairValid(pair) {
    return (!!pair.closing &&
        !!pair.opening &&
        pair.opening.end !== undefined &&
        pair.opening.start !== undefined);
}
function findMatchingTag(tagsList, position) {
    for (let i = tagsList.length - 1; i >= 0; i--) {
        if (isTagPairValid(tagsList[i]) &&
            ((position > tagsList[i].opening.start && position < tagsList[i].opening.end) ||
                (position > tagsList[i].closing.start && position < tagsList[i].closing.end))) {
            return {
                opening: tagsList[i].opening,
                closing: tagsList[i].closing
            };
        }
    }
    return undefined;
}
exports.findMatchingTag = findMatchingTag;
function getTagsForPosition(tagsList, position) {
    return tagsList.filter(pair => isTagPairValid(pair) && position > pair.opening.start && position < pair.closing.end);
}
exports.getTagsForPosition = getTagsForPosition;
//# sourceMappingURL=tagMatcher.js.map
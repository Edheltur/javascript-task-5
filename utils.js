'use strict';


module.exports.getSubEvents = function* (event) {
    const subTags = event.split('.');
    while (subTags.length > 0) {
        yield subTags.join('.');
        subTags.pop();
    }
};

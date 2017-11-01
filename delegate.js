'use strict';

class Delegate {

    /**
     * Подписаться на событие
     * @param {Object} context
     * @param {Function} handler
     * @param {Function?} shouldInvoke
     */
    constructor(context, handler, shouldInvoke) {
        this.context = context;
        this.handler = handler;
        this.shouldInvoke = typeof shouldInvoke === 'function'
            ? shouldInvoke
            : () => true;
    }

    tryInvoke() {
        if (this.shouldInvoke()) {
            this.handler.call(this.context);
        }
    }
}

module.exports = Delegate;

'use strict';

const Delegate = require('./delegate');
const { getSubEvents } = require('./utils');

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

class Emitter {

    constructor() {
        this.delegatesByEvent = new Map();
    }

    /**
     * Подписаться на событие
     * @param {String} event
     * @param {Object} context
     * @param {Function} handler
     * @param {Function?} shouldInvoke
     * @returns {Emitter}
     */
    on(event, context, handler, shouldInvoke) {
        this.delegatesByEvent[event] = this.delegatesByEvent[event] || [];
        this.delegatesByEvent[event].push(new Delegate(context, handler, shouldInvoke));

        return this;
    }

    /**
     * Отписаться от события
     * @param {String} event
     * @param {Object} context
     * @returns {Emitter}
     */
    off(event, context) {
        const updated = Object.keys(this.delegatesByEvent)
            .filter(key => key === event || key.startsWith(event + '.'))
            .map(key => ({ [key]: this.delegatesByEvent[key].filter(x => x.context !== context) }));


        Object.assign(this.delegatesByEvent, ...updated);

        return this;
    }

    /**
     * Уведомить о событии
     * @param {String} event
     * @returns {Emitter}
     */
    emit(event) {
        Array.from(getSubEvents(event))
            .filter(key => this.delegatesByEvent.hasOwnProperty(key))
            .map(key => this.delegatesByEvent[key])
            .reduce((x, y) => x.concat(y), [])
            .forEach(delegate => delegate.tryInvoke());


        return this;
    }

    /**
     * Подписаться на событие с ограничением по количеству полученных уведомлений
     * @star
     * @param {String} event
     * @param {Object} context
     * @param {Function} handler
     * @param {Number} times – сколько раз получить уведомление
     * @returns {Emitter}
     */
    several(event, context, handler, times) {
        this.on(event, context, handler, () => times-- > 0);

        return this;
    }

    /**
     * Подписаться на событие с ограничением по частоте получения уведомлений
     * @star
     * @param {String} event
     * @param {Object} context
     * @param {Function} handler
     * @param {Number} frequency – как часто уведомлять
     * @returns {Emitter}
     */
    through(event, context, handler, frequency) {
        let times = 0;
        this.on(event, context, handler, () => (times++ % frequency) === 0);

        return this;
    }
}

/**
 * Возвращает новый emitter
 * @returns {Emitter}
 */
function getEmitter() {
    return new Emitter();
}

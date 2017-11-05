'use strict';

const Delegate = require('./delegate');

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

class Emitter {

    constructor() {
        this.delegatesByEvent = {};
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
        const subTags = event.split('.');
        const subEvents = [];
        while (subTags.length > 0) {
            subEvents.push(subTags.join('.'));
            subTags.pop();
        }

        subEvents
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
        if (times <= 0) {
            return this.on(event, context, handler);
        }
        let remainingInvocations = times;

        return this.on(event, context, handler, () => {
            remainingInvocations -= 1;

            return remainingInvocations >= 0;
        });
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
        if (frequency <= 0) {
            return this.on(event, context, handler);
        }
        let invocationsCount = -1;

        return this.on(event, context, handler, () => {
            invocationsCount = (invocationsCount + 1) % frequency;

            return invocationsCount % frequency === 0;
        });
    }
}

/**
 * Возвращает новый emitter
 * @returns {Emitter}
 */
function getEmitter() {
    return new Emitter();
}

// Adapted from https://github.com/rauschma/enumify/blob/master/ts/src/index.ts

// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
export class Enum {
    static closeEnum() {
        const enumKeys = [];
        const enumValues = [];
        // Traverse the enum entries
        for (const [key, value] of Object.entries(this)) {
            enumKeys.push(key);
            value.enumKey = key;
            value.enumOrdinal = enumValues.length;
            enumValues.push(value);
        }
        // Important: only add more static properties *after* processing the enum entries
        this.enumKeys = enumKeys;
        this.enumValues = enumValues;
        // TODO: prevent instantiation now. Freeze `this`?
    }
    /** Use case: parsing enum values */
    static enumValueOf(str) {
        const index = this.enumKeys.indexOf(str);
        if (index >= 0) {
            return this.enumValues[index];
        }
        return undefined;
    }
    static [Symbol.iterator]() {
        return this.enumValues[Symbol.iterator]();
    }
    toString() {
        return this.constructor.name + '.' + this.enumKey;
    }
}
// exports.Enumify = Enumify;

// //
// Stringifys an Immutable or an Object
// //
export function stringify(thing) {
    if (typeof thing === 'string') {
        return thing;
    }

    if (thing.toJS) {
        thing = thing.toJS();
    }

    if (typeof thing === 'object' && thing !== null) {
        try {
            return JSON.stringify(thing, null, 2);
        }
        catch (e) {
            return String(thing);
        }
    }
    return thing.toString();
}

import Im from 'immutable';
import win from './window';
export const isImmutable = (maybe) => Im.Iterable.isIterable(maybe);

export function getSampleSchema (fn, schema, contentType="", config={}) {
  if (/xml/.test(contentType)) {
    if (!schema.xml || !schema.xml.name) {
      schema.xml = schema.xml || {}

      if (schema.$$ref) {
        let match = schema.$$ref.match(/\S*\/(\S+)$/)
        schema.xml.name = match[1]
      } else if (schema.type || schema.items || schema.properties || schema.additionalProperties) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!-- XML example cannot be generated; root element name is undefined -->"
      } else {
        return null
      }
    }
    return fn.memoizedCreateXMLExample(schema, config)
  }

  const res = fn.memoizedSampleFromSchema(schema, config)

  return typeof res === "object" ? JSON.stringify(res, null, 2) : res
}

export function isObject(obj) {
  return !!obj && typeof obj === 'object';
}

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
export function fromJSOrdered(js) {
  if (isImmutable(js)){
    return js; // Can't do much here
  }

  if (js instanceof win.File){
    return js;
  }

  return !isObject(js) ? js :
    Array.isArray(js) ?
      Im.Seq(js).map(fromJSOrdered).toList() :
      Im.OrderedMap(js).map(fromJSOrdered);
}


export const getCommonExtensions = (defObj) => defObj.filter((v, k) => /^pattern|maxLength|minLength|maximum|minimum/.test(k));

import React from 'react';

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

export function getExampleComponent ( sampleResponse, examples, HighlightCode ) {
    if ( examples && examples.size ) {
        return examples.entrySeq().map( ([ key, example ]) => {
        let exampleValue = stringify(example);

        return (<div key={ key }>
            <h5>{ key }</h5>
            <HighlightCode className="example" value={ exampleValue } />
        </div>)
        }).toArray()
    }

    if ( sampleResponse ) { 
        let sampleResponse2 = stringify(sampleResponse);
        return <div>
        <HighlightCode className="example" value={ sampleResponse2 } />
        </div>
    }
    return null;
}



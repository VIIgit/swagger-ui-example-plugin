const React = require('react');
const filterModules = require('./objectModifier');
const plugins = require('./plugins');
const fromJS = require( 'immutable');

window.swaggerUI = {
    filter: filterModules.filter, 
    plugins: {
        OneOfExamplePlugin: plugins.OneOfExampleComponentPlugin
    },
    fromJS: fromJS,
    renderOriginal: function(Original, props, title){
        if(title){
            return <div>
                <h4>{title}</h4>
                <Original {...props} />
            </div>
        }
        return <Original {...props} />
    }
};
"use strict";

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const filterModules = require('./recursive-filter');
const customControlsModules = require('./react-custom-component');
const immutable = require( 'immutable');

window.swaggerPluginUtils = {
    filter: filterModules.filter, 
    customComponent: {
        getExampleComponent: customControlsModules.getExampleComponent,
        renderOriginal: function (Original, props, title) {
            if(title){
                return <div>
                    <h4>{title}</h4>
                    <Original {...props} />
                </div>
            }
            return <Original {...props} />
        }
    },
    immutable: immutable,
    log: function(name){
        console.log(name);
    }
};

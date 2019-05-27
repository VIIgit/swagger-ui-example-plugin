"use strict";

import React, { Component } from 'react';

const filterModules = require('./recursive-filter');
const customControlsModules = require('./react-custom-component');
const fromJS = require( 'immutable');

window.utils = {
    filter: filterModules.filter, 
    customComponent: {
        getExampleComponent: customControlsModules.getExampleComponent
    },
    fromJS: customControlsModules.fromJS,
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
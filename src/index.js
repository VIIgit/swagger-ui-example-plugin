"use strict";

const modules = require('./recursive-filter');
const YAML = require( 'yaml');
const jsonPointer = require( 'json-pointer');


window.bundle = {filter: modules.filter, YAML, jsonPointer};


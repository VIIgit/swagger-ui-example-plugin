"use strict";

const modules = require('./recursive-filter');


window.bundle = {filter: modules.filter};


console.log(window.bundle);
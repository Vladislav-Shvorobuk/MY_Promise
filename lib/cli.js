#!/usr/bin/env node

"use strict";

var adapter = require('./adapter');
var programmaticRunner = require("./programmaticRunner");

programmaticRunner(adapter, {}, function (err) {
    if (err) {
        process.exit(err.failures || -1);
    }
});


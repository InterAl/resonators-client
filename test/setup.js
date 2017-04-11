require("babel-register")({});

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var _ = require('lodash');

_.mixin({
    omitDeep: require('omit-deep-lodash')
});

var createServer = require('./createServer');
var initNightmare = require('./nightmare').initNightmare;

var endpoint = 'localhost:45033';
initNightmare(endpoint);

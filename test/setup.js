require("babel-register")({});

var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var _ = require('lodash');

_.mixin({
    omitDeep: require('omit-deep-lodash')
});

'use strict';

var utils = require('../lib/utils');
var should = require('should');


describe('Tests merge helper', function () {
  it('object should have all properties', function () {
    var objA = {'a': 'A', 'b': 'B'},
        objB = {'c': 'C', 'd': 'D'},
        objC = utils.merge(objA, objB);
    objC.should.have.property('a', 'A');
    objC.should.have.property('b', 'B');
    objC.should.have.property('c', 'C');
    objC.should.have.property('d', 'D');
  });
});

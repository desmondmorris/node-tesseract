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

describe('Tests trim helper', function () {
  it('string should have no leading or trailing whitespace', function () {
    var str = '  test string  ';
    utils.trim(str).should.equal('test string');
  });
});


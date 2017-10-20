let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

const functionsProperties = require('../shared/functionsProperties');


describe('Functions', () => {

  describe('checkAccountNumber True', () => {
      it('Expect to be true', (done) => {
        expect(functionsProperties.checkAccountNumber('2754413-4')).to.be.true;
        done();
      });
  });
  describe('checkAccountNumber False', () => {
      it('Expect to be true', (done) => {
        expect(functionsProperties.checkAccountNumber('275441-4')).to.be.false;
        done();
      });
  });
  describe('GetOnlyNumbers', () => {
      it('Expect only numbers', (done) => {
        expect(functionsProperties.getOnlyNumbers('27544sdfs1-4')).to.equal('2754414');
        done();
      });
  });

});


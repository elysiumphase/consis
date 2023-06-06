const { expect } = require('./Common');
const { Enum } = require('../src');

describe('#Enum', function() {
  it('should return an empty object if nothing is passed as arguments', function() {
    expect(Enum()).to.be.an('object').and.to.eql({});
  });

  it('should not return an empty object for any passed as arguments', function() {
    expect(Enum(NaN)).to.be.an('object').and.to.eql({ NaN: NaN });
    expect(Enum(undefined)).to.be.an('object').and.to.eql({ undefined: undefined });
    expect(Enum(null)).to.be.an('object').and.to.eql({ null: null });
    expect(Enum(true, false)).to.be.an('object').and.to.eql({ true: true, false: false });
    expect(Enum({ a: 5 })).to.be.an('object').and.to.not.eql({});
    expect(Enum([1, 2, 3])).to.be.an('object').and.to.not.eql({});
    expect(Enum(new Error('error'))).to.be.an('object').and.to.not.eql({});
  });

  it('should return an enumeration of values passed as arguments', function() {
    expect(Enum('up', 'side', 'down')).to.be.an('object').and.to.eql({ up: 'up', side: 'side', down: 'down' });
    expect(Enum(1, 2, 3)).to.be.an('object').and.to.eql({ '1': 1, '2': 2, '3': 3 });
  });
});

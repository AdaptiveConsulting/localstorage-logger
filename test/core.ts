/// <reference path="../lib//all.d.ts" />

let expect = chai.expect;

describe('Local storage queue', function() {
  let lib, config;
  
  beforeEach (() => {
    config = {
      name: 'Thomas'
    };
    //lib = new MyLibrary(config);
  });
  
  afterEach(() => {
    lib = null;
  });
  
  it ('should be defined', () => {
    expect(true).to.eq(true);
  });
});

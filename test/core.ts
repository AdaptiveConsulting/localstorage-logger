/// <reference path="../lib//all.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';

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
  
  //it ('should be defined', () => {
  //  expect(lib).to.be.ok;
  //});
});

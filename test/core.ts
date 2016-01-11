/// <reference path="../lib//all.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';

import {LimitedSizeQueue} from '../lib/queue/LimitedSizeQueue';

let expect = chai.expect;

describe('My Library', function() {
  let lib,
      config;
  
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
    expect(lib).to.be.ok;
  });
});

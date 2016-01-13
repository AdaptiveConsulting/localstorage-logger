/// <reference path="../lib//all.d.ts" />

import {LimitedSizeQueue} from '../lib/queue/LimitedSizeQueue';

let expect = chai.expect;

describe('Local storage queue', function() {
  const MAX_SIZE_IN_BYTES = 100;
  const KEY_PREFIX = 'test-q';

  let sut : LimitedSizeQueue<string>;
  
  beforeEach(() => {
    localStorage.clear();
    sut = new LimitedSizeQueue<string>({
      keyPrefix: KEY_PREFIX,
      maxSizeInBytes: MAX_SIZE_IN_BYTES
    });
  });
  
  function getItemsAsArray() {
    const enqueued = [];
    sut.iterate(item => enqueued.push(item));
    return enqueued;
  }
  
  it('should be FIFO', () => {
    // Arrange
    sut.enqueue('foo');
    sut.enqueue('bar');
    // Act
    const out = sut.dequeue();
    // Assert
    expect(out).to.equal('foo');
  });

  it('should be possible to enumerate enqueued items without consuming them', () => {
    // Arrange
    sut.enqueue('foo');
    sut.enqueue('bar');
    // Act
    const firstAccess = getItemsAsArray();
    const secondAccess = getItemsAsArray();
    // Assert
    expect(firstAccess).to.deep.equal([
      'foo', 'bar'
    ]);
    expect(secondAccess).to.deep.equal([
      'foo', 'bar'
    ]);
  });

  it('should remove items on dequeue', () => {
    // Arrange
    sut.enqueue('foo');
    sut.enqueue('bar');
    // Act
    sut.dequeue();
    const enqueued = getItemsAsArray();
    // Assert
    expect(enqueued).to.deep.equal([
      'bar'
    ]);
  });

  it('should auto-dequeue items when there is not enough space to enqueue a new item that will fit', () => {
    // Arrange
    const sizeOfChar = 4;
    // This is an over estmate of the minimum number of items to cause an overwrite.
    const numberOfItemsToEnqueue = 1 + MAX_SIZE_IN_BYTES / sizeOfChar; 
    const itemsToEnqueue = new Array(numberOfItemsToEnqueue).map((_, i) => i.toString());
    // Act
    itemsToEnqueue.forEach(item => sut.enqueue(item));
    const enqueued = getItemsAsArray();
    // Assert
    expect(enqueued.length).to.be.lessThan(numberOfItemsToEnqueue);
    expect(enqueued).to.deep.equal(itemsToEnqueue.slice(itemsToEnqueue.length - enqueued.length));
  });

  it('should return false from isEmpty when an item is added to the queue', () => {
    // Act
    sut.enqueue('foo');
    // Assert
    expect(sut.isEmpty()).to.be.false;
  });

  it('should return true from isEmpty when all items are removed from the queue', () => {
    // Arrange
    const items = ['1', '2', '3', '4'];
    items.forEach(item => sut.enqueue(item));
    // Act
    items.forEach(() => sut.dequeue());
    // Assert
    expect(sut.isEmpty()).to.be.true;
  });
});

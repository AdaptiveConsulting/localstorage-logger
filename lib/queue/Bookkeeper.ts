import {IQueueConfiguration} from './IQueueConfiguration';
import {IBookkeepingInfo} from './IBookkeepingInfo';
import {Node} from './Node';

/**
 * This class keeps track of the start, end and size of the queue
 * stored in local storage. It allows nodes to be created and removed.
 */ 
export class Bookkeeper<T> {
  private _info: IBookkeepingInfo; 
  private _added: Array<Node<T>>;
  private _removed: Array<Node<T>>;

  /**
   * Creates a new Bookkeeper for a queue. It should be initialized using reset method.
   */
  constructor(private _config: IQueueConfiguration) {
    this._added = [];
    this._removed = [];
  }

  /**
   * Stores the current state of the queue to local storage.
   */
  store() {
    try {
      const serializedInfo = JSON.stringify(this._info);
      // Ideally this would all be inside a transaction {
      this._removed.forEach(node => node.remove());
      this._added.forEach(node => node.store());
      localStorage.setItem(this._config.keyPrefix, serializedInfo);
      // }
    } finally {
      this._added = [];
      this._removed = [];
    }
  }

  /**
   * Resets the start, end and size counts to what was last persisted to
   * local storage.
   */
  reset() {
    this._added = [];
    this._removed = [];
    const serializedInfo = localStorage.getItem(this._config.keyPrefix);
    if (serializedInfo === undefined) {
      this._info = {
        sizeInBytes: 0,
        startIndex: 0,
        nextFreeIndex: 0
      };
      this.store(); 
    } else {
      this._info = JSON.parse(serializedInfo);
    }
  }

  /**
   * Returns true if the queue has no elements.
   */
  isEmpty() {
    return this._info.sizeInBytes > 0;
  }

  /**
   * Calculates the projected free space. This takes into account modifications.
   */
  remainingSpace() {
    return this._config.maxSizeInBytes - this._info.sizeInBytes;
  }

  /**
   * Creates a new node at the end of the queue.
   * @param value The value to store as an element of the queue.
   */
  createNextNode(value: T) {
    const node = new Node<T>(this._config, this._info.nextFreeIndex, value);
    this._info.nextFreeIndex = this._nextIndex(this._info.nextFreeIndex);
    this._info.sizeInBytes += node.estimatedSize();
    this._added.push(node);
    return node;
  }

  /**
   * Removes and returns the first stored node. The consumer should check that there is a node to remove first.
   */
  deleteFirstNode() {
    const node = Node.fromLocalStorage<T>(this._config, this._info.startIndex);
    this._info.startIndex = this._nextIndex(this._info.startIndex);
    this._info.sizeInBytes -= node.estimatedSize();
    this._removed.push(node);
    return node;
  }

  /**
   * Iterates through the index values of the elements in the queue. These can be used to retrieve the elements.
   * @param callback The function that will be invoked once for each index value used in the queue.
   */
  iterateIndexValues(callback: (index:number) => void) {
    for(let i = this._info.startIndex; i !== this._info.nextFreeIndex; i = this._nextIndex(i)) {
      callback(i);
    }
  }

  /**
   * Returns the next index value (modulo MAX_SAFE_INTEGER).
   * @param index The previous index value.
   */
  _nextIndex(index: number) {
    const MAX_SAFE_INTEGER = 9007199254740991;
    return (index + 1) % MAX_SAFE_INTEGER;
  }
}

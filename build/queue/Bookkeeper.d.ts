import { IQueueConfiguration } from './IQueueConfiguration';
import { Node } from './Node';
/**
 * This class keeps track of the start, end and size of the queue
 * stored in local storage. It allows nodes to be created and removed.
 */
export declare class Bookkeeper<T> {
    private _config;
    private _info;
    private _added;
    private _removed;
    /**
     * Creates a new Bookkeeper for a queue. It should be initialized using reset method.
     */
    constructor(_config: IQueueConfiguration);
    /**
     * Stores the current state of the queue to local storage.
     */
    store(): void;
    /**
     * Resets the start, end and size counts to what was last persisted to
     * local storage.
     */
    reset(): void;
    /**
     * Returns true if the queue has no elements.
     */
    isEmpty(): boolean;
    /**
     * Calculates the projected free space. This takes into account modifications.
     */
    remainingSpace(): number;
    /**
     * Creates a new node at the end of the queue.
     * @param value The value to store as an element of the queue.
     */
    createNextNode(value: T): Node<T>;
    /**
     * Removes and returns the first stored node. The consumer should check that there is a node to remove first.
     */
    deleteFirstNode(): Node<T>;
    /**
     * Iterates through the index values of the elements in the queue. These can be used to retrieve the elements.
     * @param callback The function that will be invoked once for each index value used in the queue.
     */
    iterateIndexValues(callback: (index: number) => void): void;
    /**
     * Returns the next index value (modulo MAX_SAFE_INTEGER).
     * @param index The previous index value.
     */
    _nextIndex(index: number): number;
}

import { IQueueConfiguration } from './IQueueConfiguration';
/**
 * A limited-size queue that is persisted to local storage. Enqueuing
 * elements can remove the oldest elements in order to free up space.
 */
export declare class LimitedSizeQueue<T> {
    private _config;
    private _bookkeeper;
    /**
     * Creates/restores a queue based on the configuration provided.
     * @param _config The settings for the queue
     */
    constructor(_config: IQueueConfiguration);
    /**
     * Enqueues an item in the queue. Throws if the value is too big to fit in local storage
     * based on the maximum sized defined in the queue configuration. May also throw
     * if local storage is out of space or corrupted.
     */
    enqueue(value: T): void;
    /**
     * If the queue has at least 1 item, it removes and returns the oldest item from the queue.
     * Otherwise, it will return nothing.
     */
    dequeue(): T | void;
    /**
     * Returns true if the queue is empty.
     */
    isEmpty(): boolean;
    /**
     * Iterates (without removal) through all items stored in the queue.
     */
    iterate(callback: (item: T) => void): void;
}

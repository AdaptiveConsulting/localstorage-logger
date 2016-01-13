import { IQueueConfiguration } from './IQueueConfiguration';
/**
 * Each node corresponds to an entry within the queue. This helps with
 * storage and removal from local storage.
 */
export declare class Node<T> {
    value: T;
    private _key;
    private _serializedNode;
    /**
     * Constructs a node representing an entry in the queue.
     * @param config The queue configuration. This is used to provide the prefix for the key.
     * @param index The index within the queue
     * @param value The value of the entry
     */
    constructor(config: IQueueConfiguration, index: number, value: T);
    /**
     * Returns an estimate of the size this will take up in local storage.
     */
    estimatedSize(): number;
    /**
     * Stores the serialized entry in local storage.
     */
    store(): void;
    /**
     * Removes the entry from local storage if it exists.
     */
    remove(): void;
    /**
     * Creates a key for an entry.
     * @param config The configuration containing the key prefix
     * @param index The index of the entry in the queue
     */
    static createKey(config: IQueueConfiguration, index: number): string;
    /**
     * Loads an entry from local storage and deserializes it. Returns the associated node.
     * @param config The configuration containing the key prefix
     * @param index The index of the entry in the queue
     */
    static fromLocalStorage<T>(config: IQueueConfiguration, index: number): Node<T>;
}

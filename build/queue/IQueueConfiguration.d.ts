/**
 * This describes the settings for the limited size queue.
 */
export interface IQueueConfiguration {
    /**
     * This defines the prefix the queue should use for all local storage entries.
     * There should be a unique prefix for each queue.
     */
    keyPrefix: string;
    /**
     * This defines a (rough) limit for the size of the queue in local storage.
     * Once this size is met, the oldest elements in the queue will be removed
     * to make space for newer elements.
     */
    maxSizeInBytes: number;
}

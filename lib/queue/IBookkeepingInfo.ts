module LSL.LSQ {
  /** 
   * This interfaces is serialized and stored in local storage. 
   * It provides the high-level information needed to access
   * the first and last elements in the queue. It also keeps
   * track of the current size of all the elements stored in
   * local storage.
   */
  export interface IBookkeepingInfo {
    sizeInBytes: number;
    startIndex: number;
    nextFreeIndex: number;
  }
}

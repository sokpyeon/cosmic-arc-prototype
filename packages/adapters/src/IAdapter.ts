export interface IAdapter {
  /** Unique identifier for the adapter (e.g., 'runtime-nvidia') */
  readonly id: string;
  /** Human readable description */
  readonly description: string;
  /** Initialize the adapter – may open handles, configure hooks, etc. */
  init(): Promise<void>;
  /** Shut down and clean up resources */
  shutdown(): Promise<void>;
  /** Stream raw events from the underlying source */
  getEventStream(): AsyncIterable<any>;
}

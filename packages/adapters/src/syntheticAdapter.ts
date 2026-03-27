import { IAdapter } from './IAdapter';

/** SyntheticAdapter generates artificial events for testing */
export interface ISyntheticAdapter extends IAdapter {
  /** Emit a stream of synthetic events */
  generate(): AsyncIterable<any>;
}

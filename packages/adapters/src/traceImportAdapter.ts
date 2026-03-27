import { IAdapter } from './IAdapter';

/** TraceAdapter imports pre‑recorded trace files */
export interface ITraceImportAdapter extends IAdapter {
  /** Path to the trace file */
  readonly tracePath: string;
  /** Load and emit events from the file */
  load(): Promise<void>;
}

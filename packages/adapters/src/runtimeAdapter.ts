import { IAdapter } from './IAdapter';

/** RuntimeAdapter captures host‑runtime API calls (e.g., CUDA driver API) */
export interface IRuntimeAdapter extends IAdapter {
  /** Map raw runtime call to a typed EventEnvelope */
  translate(raw: any): Promise<any>;
}

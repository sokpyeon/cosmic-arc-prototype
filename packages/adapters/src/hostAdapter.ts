import { IAdapter } from './IAdapter';

/** HostAdapter intercepts OS‑level API calls (e.g., mmap, ioctl) */
export interface IHostAdapter extends IAdapter {
  /** Translate intercepted system call to EventEnvelope */
  translate(syscall: any): Promise<any>;
}

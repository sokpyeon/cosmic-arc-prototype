import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';
import { IAdapter } from '@cosmic-arc/adapters/src/IAdapter';
import { Transform, Writable } from 'stream';

/** IngestionPipeline normalizes raw adapter output into EventEnvelope */
export class IngestionPipeline {
  private adapters: IAdapter[];
  private transform: Transform;
  private sink: Writable;

  constructor(adapters: IAdapter[]) {
    this.adapters = adapters;
    this.transform = new Transform({
      objectMode: true,
      transform: (chunk, _enc, cb) => {
        // Assume each chunk is already an EventEnvelope or can be wrapped
        const envelope: EventEnvelope = typeof chunk === 'object' && 'eventId' in chunk ? chunk : {
          eventId: crypto.randomUUID(),
          eventType: 'unknown',
          sourceType: 'unknown',
          sourceAdapter: 'unknown',
          vendor: undefined,
          platform: undefined,
          sessionId: crypto.randomUUID(),
          traceId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          logicalClock: 0,
          payload: chunk,
          confidence: undefined,
          integrity: undefined
        };
        cb(null, envelope);
      }
    });
    // Simple sink that could push to a message bus or DB – placeholder here
    this.sink = new Writable({
      objectMode: true,
      write: (chunk, _enc, cb) => {
        // TODO: forward to downstream services (timeline, graph, etc.)
        cb();
      }
    });
  }

  async start(): Promise<void> {
    for (const adapter of this.adapters) {
      await adapter.init();
      (async () => {
        for await (const raw of adapter.getEventStream()) {
          this.transform.write(raw);
        }
      })();
    }
    this.transform.pipe(this.sink);
  }

  async stop(): Promise<void> {
    this.transform.end();
    this.sink.end();
    for (const adapter of this.adapters) {
      await adapter.shutdown();
    }
  }
}

import { IngestionPipeline } from '@cosmic-arc/ingestion/src/ingestionPipeline';
import { IRuntimeAdapter } from '@cosmic-arc/adapters/src/runtimeAdapter';
import { TimelineEngine } from '@cosmic-arc/timeline/src/timelineEngine';
import { processAnomaly } from '@cosmic-arc/anomaly/src/scoring';
import { createEvidencePack } from '@cosmic-arc/evidence/src/evidencePack';
import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';

/** Minimal mock runtime adapter for demo purposes */
class MockRuntimeAdapter implements IRuntimeAdapter {
  id = 'mock-runtime';
  description = 'Synthetic runtime events for demo';
  async init() { /* no‑op */ }
  async shutdown() { /* no‑op */ }
  async *getEventStream() {
    // Emit a few synthetic events
    for (let i = 0; i < 3; i++) {
      yield {
        eventId: crypto.randomUUID(),
        eventType: 'kernelLaunch',
        sourceType: 'runtime',
        sourceAdapter: this.id,
        vendor: 'nvidia',
        platform: 'gpu',
        sessionId: crypto.randomUUID(),
        traceId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        logicalClock: i,
        payload: { kernel: `kernel${i}`, durationNs: 500_000 * (i + 1) },
        confidence: undefined,
        integrity: undefined
      } as EventEnvelope;
    }
  }
  async translate(_raw: any) { return; }
}

async function main() {
  const adapter = new MockRuntimeAdapter();
  const pipeline = new IngestionPipeline([adapter]);
  const timeline = new TimelineEngine();

  // Hook into the ingestion pipeline sink to feed the timeline
  // For simplicity we monkey‑patch the sink write method here
  // (real code would use an event bus)
  (pipeline as any).sink = new (require('stream').Writable)({
    objectMode: true,
    write: (chunk: EventEnvelope, _enc: any, cb: any) => {
      timeline.add(chunk);
      cb();
    }
  });

  await pipeline.start();
  // All events are now in the timeline
  const ordered = [...timeline.getTimeline()];
  // Run anomaly processing on each event
  const findings = ordered.map(evt => {
    const result = processAnomaly(evt);
    return { eventId: result.eventId, score: result.score, confidence: result.confidence };
  });

  // Build a minimal evidence pack
  const pack = createEvidencePack({
    title: 'Demo Evidence Pack',
    sessionId: ordered[0]?.sessionId ?? 'unknown',
    traceId: ordered[0]?.traceId ?? 'unknown',
    findings,
    artifacts: [],
    timeline: ordered
  });

  console.log('=== Evidence Pack ===');
  console.dir(pack, { depth: null });
}

main().catch(console.error);

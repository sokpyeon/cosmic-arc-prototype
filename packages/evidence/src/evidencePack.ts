import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';

/** Minimal evidence pack for the MVP golden path */
export interface EvidencePack {
  /** Human‑readable manifest */
  manifest: {
    title: string;
    generatedAt: string; // ISO‑8601
    sessionId: string;
    traceId: string;
  };
  /** Findings – e.g., ranked anomalies */
  findings: Array<{
    eventId: string;
    score: number;
    confidence: number;
    description?: string;
  }>;
  /** References to raw artifacts (paths or URLs) */
  artifacts: string[];
  /** Cryptographic hashes for integrity verification */
  integrity: { [artifact: string]: string };
  /** Replay metadata – how to rehydrate the session */
  replay: {
    timelineSnapshot: EventEnvelope[];
    graphSnapshot?: any; // optional, could be exported from CorrelationGraphService
  };
}

/** Helper to create a bare‑bones pack from a session */
export function createEvidencePack(params: {
  title: string;
  sessionId: string;
  traceId: string;
  findings: EvidencePack['findings'];
  artifacts: string[];
  timeline: EventEnvelope[];
}): EvidencePack {
  const generatedAt = new Date().toISOString();
  return {
    manifest: { title: params.title, generatedAt, sessionId: params.sessionId, traceId: params.traceId },
    findings: params.findings,
    artifacts: params.artifacts,
    integrity: {}, // fill in after artifacts are written
    replay: { timelineSnapshot: params.timeline }
  };
}

import { extractFeatures } from './featureExtraction';
import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';

/** Simple probabilistic scoring – placeholder for a ML model */
export function scoreAnomaly(features: Record<string, any>): {score: number; confidence: number} {
  // Very naive: high duration or unknown vendor gets higher score
  let base = 0;
  if (features.durationNs > 1_000_000) base += 0.4;
  if (features.vendor === 'unknown') base += 0.2;
  if (features.recentEventCount > 10) base += 0.1;
  const score = Math.min(base, 1);
  const confidence = 0.7; // static for now
  return {score, confidence};
}

/** Full pipeline: extract → enrich → score */
export function processAnomaly(event: EventEnvelope) {
  const features = extractFeatures(event);
  const {score, confidence} = scoreAnomaly(features);
  return {eventId: event.eventId, score, confidence, features};
}

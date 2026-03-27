import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';

/** Feature extraction from a raw EventEnvelope */
export function extractFeatures(event: EventEnvelope): Record<string, any> {
  // Example: flatten payload keys, add timing deltas, simple heuristics
  const features: Record<string, any> = {
    eventType: event.eventType,
    sourceAdapter: event.sourceAdapter,
    vendor: event.vendor ?? 'unknown',
    platform: event.platform ?? 'unknown',
    // Simple duration metric if present
    durationNs: (event.payload && event.payload.durationNs) || 0,
    // Add a placeholder for vectorized data – real implementation would
    // compute statistical descriptors over recent windows
    recentEventCount: 1 // stub
  };
  return features;
}

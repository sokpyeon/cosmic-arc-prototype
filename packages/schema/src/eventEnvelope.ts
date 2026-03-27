import { z } from 'zod';

// Base event envelope that all services will understand
export const EventEnvelope = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  sourceType: z.string(), // e.g., 'runtime', 'host', 'trace', 'synthetic'
  sourceAdapter: z.string(), // adapter identifier
  vendor: z.string().optional(), // e.g., 'nvidia', 'amd', 'intel'
  platform: z.string().optional(), // e.g., 'gpu', 'tpu', 'npu'
  sessionId: z.string().uuid(),
  traceId: z.string().uuid(),
  timestamp: z.string().datetime(), // ISO‑8601
  logicalClock: z.number().int(), // monotonically increasing per session
  payload: z.any(), // concrete typed event payload (see schema package)
  confidence: z.number().min(0).max(1).optional(),
  integrity: z.string().optional() // hash or signature of payload
});

export type EventEnvelope = z.infer<typeof EventEnvelope>;

import { z } from 'zod';
import { EventEnvelope } from './eventEnvelope';

export const TelemetryEvent = z.object({
  // Inherit envelope fields via intersection
  ...EventEnvelope.shape,
  // Payload specific to telemetry
  payload: z.object({
    eventName: z.string(),
    data: z.record(z.any()),
    durationNs: z.number().optional()
  })
});

export type TelemetryEvent = z.infer<typeof TelemetryEvent>;

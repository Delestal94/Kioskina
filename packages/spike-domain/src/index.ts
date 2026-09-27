import { assertSupportedEvent, type EventEnvelope } from "@kioskina/event-contracts";

export interface SpikeObservationInput {
  eventId: string;
  tenantId: string;
  branchId: string;
  deviceId: string;
  actorId: string;
  deviceSequence: number;
  observation: string;
  occurredAt?: string;
}

export function createSpikeObservation(input: SpikeObservationInput): EventEnvelope {
  const recordedAt = input.occurredAt ?? new Date().toISOString();
  const aggregateId = input.eventId;

  const event: EventEnvelope = {
    eventId: input.eventId,
    schemaVersion: 1,
    tenantId: input.tenantId,
    branchId: input.branchId,
    deviceId: input.deviceId,
    actorId: input.actorId,
    aggregateType: "spike-observation",
    aggregateId,
    eventType: "spike.observation-recorded.v1",
    occurredAtDevice: recordedAt,
    recordedAtLocal: recordedAt,
    deviceSequence: input.deviceSequence,
    causationId: input.eventId,
    correlationId: input.eventId,
    idempotencyKey: input.eventId,
    payload: { observation: input.observation },
  };
  assertSupportedEvent(event);
  return event;
}

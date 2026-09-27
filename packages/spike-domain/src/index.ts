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

export interface SpikeCashSaleInput {
  eventId: string;
  tenantId: string;
  branchId: string;
  deviceId: string;
  actorId: string;
  deviceSequence: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceMinor: number;
  currency: string;
  cashReceivedMinor: number;
  occurredAt?: string;
}

export function parseAmountMinor(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? "").padEnd(2, "0"));
  const amount = whole * 100 + fraction;
  return Number.isSafeInteger(amount) ? amount : null;
}

export function createSpikeCashSale(input: SpikeCashSaleInput): EventEnvelope {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const totalMinor = input.quantity * input.unitPriceMinor;
  if (!Number.isSafeInteger(totalMinor) || input.cashReceivedMinor < totalMinor) {
    throw new Error("Los importes de la venta de prueba no son consistentes.");
  }
  const event: EventEnvelope = {
    eventId: input.eventId,
    schemaVersion: 1,
    tenantId: input.tenantId,
    branchId: input.branchId,
    deviceId: input.deviceId,
    actorId: input.actorId,
    aggregateType: "sale",
    aggregateId: input.eventId,
    eventType: "spike.cash-sale-recorded.v1",
    occurredAtDevice: occurredAt,
    recordedAtLocal: occurredAt,
    deviceSequence: input.deviceSequence,
    causationId: input.eventId,
    correlationId: input.eventId,
    idempotencyKey: input.eventId,
    payload: {
      currency: input.currency,
      product: {
        productId: input.productId,
        name: input.productName.trim(),
        quantity: input.quantity,
        unitPriceMinor: input.unitPriceMinor,
        lineTotalMinor: totalMinor,
      },
      totalMinor,
      cashReceivedMinor: input.cashReceivedMinor,
      changeMinor: input.cashReceivedMinor - totalMinor,
    },
  };
  assertSupportedEvent(event);
  return event;
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

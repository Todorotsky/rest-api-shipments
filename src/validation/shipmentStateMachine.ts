import { ShipmentStatus } from "../types/shipments";

const VALID_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  [ShipmentStatus.PENDING]: [
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.IN_TRANSIT]: [
    ShipmentStatus.DELIVERED,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.DELIVERED]: [], // Terminal state
  [ShipmentStatus.CANCELLED]: [], // Terminal state
};

// Checks if the status transition is valid e.g. cannot go from PENDING to DELIVERED
function isValidStatusTransition(
  currentStatus: ShipmentStatus,
  newStatus: ShipmentStatus
): boolean {
  // Checks if the new status is in the VALID_TRANSITIONS for the current status
  return VALID_TRANSITIONS[currentStatus].includes(newStatus);
}

function isValidStatus(status: ShipmentStatus): boolean {
  return Object.values(ShipmentStatus).includes(status);
}

export function validateStatusTransition(
  currentStatus: ShipmentStatus,
  newStatus: ShipmentStatus
): void {
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }
  if (!isValidStatus(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
}

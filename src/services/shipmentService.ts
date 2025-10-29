import {
  CreateShipmentRequest,
  Shipment,
  ShipmentStatus,
} from "../types/shipments";
import { calculateEstimatedDeliveryTime } from "../utils/deliveryCalculator";
import { validateStatusTransition } from "../validation/shipmentStateMachine";
import { randomUUID } from "crypto";

// in-memory storage of the shipments
const shipments: Shipment[] = [];

export function clearShipments(): void {
  shipments.length = 0;
}

function generateId(): string {
  return randomUUID();
}

export function createShipment(request: CreateShipmentRequest): Shipment {
  try {
    const estimatedDelivery = calculateEstimatedDeliveryTime(
      request.origin,
      request.destination
    );

    const newShipment: Shipment = {
      id: generateId(),
      status: ShipmentStatus.PENDING,
      origin: request.origin,
      destination: request.destination,
      estimatedDelivery,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Adds the new shipment to the shipments array
    shipments.push(newShipment);

    // Returns the new shipment
    return newShipment;
  } catch (error) {
    throw new Error(
      `Cannot create shipment from ${request.origin} to ${request.destination}`
    );
  }
}

// GET /shipments/:id - Gets a shipment by id
export function getShipmentById(id: string): Shipment | undefined {
  return shipments.find((shipment) => shipment.id === id);
}

// PATCH /shipments/:id/status - Updates the status of a shipment
export function updateShipmentStatus(
  id: string,
  status: ShipmentStatus
): Shipment | undefined {
  const shipment = getShipmentById(id);

  if (!shipment) {
    return undefined;
  }

  // Validates the status transition (e.g. cannot go from PENDING to DELIVERED)
  validateStatusTransition(shipment.status, status);

  shipment.status = status;
  shipment.updatedAt = new Date();

  return shipment;
}

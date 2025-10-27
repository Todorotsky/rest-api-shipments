import {
  CreateShipmentRequest,
  Shipment,
  ShipmentStatus,
} from "../types/shipments";
import { calculateEstimatedDeliveryTime } from "../utils/deliveryCalculator";
import { validateStatusTransition } from "../validation/shipmentStateMachine";
import { randomUUID } from "crypto";

// in-memory storage of the shipments
export const shipments: Shipment[] = [];

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
    shipments.push(newShipment);
    return newShipment;
  } catch (error) {
    throw new Error(
      `Cannot create shipment from ${request.origin} to ${request.destination}`
    );
  }
}

export function getShipmentById(id: string): Shipment | undefined {
  return shipments.find((shipment) => shipment.id === id);
}

export function updateShipmentStatus(
  id: string,
  status: ShipmentStatus
): Shipment | undefined {
  const shipment = getShipmentById(id);

  if (!shipment) {
    return undefined;
  }

  validateStatusTransition(shipment.status, status);

  shipment.status = status;
  shipment.updatedAt = new Date();

  return shipment;
}

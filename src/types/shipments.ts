// PATCH /shipments/:id/status
export enum ShipmentStatus {
  PENDING = "Pending",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

// POST /shipments
export interface Shipment {
  id: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

// POST /shipments
export interface CreateShipmentRequest {
  origin: string;
  destination: string;
}

// PATCH /shipments/:id/status
export interface UpdateStatusRequest {
  status: ShipmentStatus;
}

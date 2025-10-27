export enum ShipmentStatus {
  PENDING = "Pending",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export interface Shipment {
  id: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  estimatedDelivery: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipmentRequest {
  origin: string;
  destination: string;
}

export interface UpdateStatusRequest {
  status: ShipmentStatus;
}

export interface Shipment {
  id: string;
  status: string;
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
  status: string;
}

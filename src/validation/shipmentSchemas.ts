import { z } from "zod";
import { ShipmentStatus } from "../types/shipments";

// POST /shipments
export const createShipmentSchema = z.object({
  origin: z.string().min(1), // Required minimum 1 character
  destination: z.string().min(1), // Required minimum 1 character
});

// PATCH /shipments/:id/status
export const updateStatusSchema = z.object({
  status: z.enum([
    ShipmentStatus.PENDING,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.DELIVERED,
    ShipmentStatus.CANCELLED,
  ]),
});

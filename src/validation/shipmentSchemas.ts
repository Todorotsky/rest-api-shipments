import { z } from "zod";
import { ShipmentStatus } from "../types/shipments";

export const createShipmentSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    ShipmentStatus.PENDING,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.DELIVERED,
    ShipmentStatus.CANCELLED,
  ]),
});

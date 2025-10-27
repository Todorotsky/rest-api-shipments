import { Router } from "express";
import {
  createShipment,
  getShipmentById,
  updateShipmentStatus,
} from "../services/shipmentService";
import { CreateShipmentRequest } from "../types/shipments";

const router = Router();

// POST /shipments - Create new shipment
router.post("/", (req, res) => {
  try {
    const request: CreateShipmentRequest = req.body;
    const shipment = createShipment(request);
    res.status(201).json(shipment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /shipments/:id - Get shipment by ID
router.get("/:id", (req, res) => {
  const shipment = getShipmentById(req.params.id);

  if (!shipment) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  res.status(200).json(shipment);
});

// PATCH /shipments/:id/status - Update shipment status
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const shipment = updateShipmentStatus(req.params.id, status);

  if (!shipment) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  res.status(200).json(shipment);
});

export default router;

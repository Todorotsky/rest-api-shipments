import { Router } from "express";
import {
  createShipment,
  getShipmentById,
  updateShipmentStatus,
} from "../services/shipmentService";
import {
  createShipmentSchema,
  updateStatusSchema,
} from "../validation/shipmentSchemas";

const router = Router();

// POST /shipments - Create new shipment
router.post("/", (req, res) => {
  // Try to validate
  const validation = createShipmentSchema.safeParse(req.body);

  // Check if it worked
  if (!validation.success) {
    // Validation failed, reject it
    return res.status(400).json({
      error: "Invalid request body",
      details: validation.error.issues,
    });
  }

  try {
    const shipment = createShipment(validation.data);
    res.status(201).json(shipment);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
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
  // Validate with Zod
  const validation = updateStatusSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: validation.error.issues,
    });
  }

  try {
    const shipment = updateShipmentStatus(
      req.params.id,
      validation.data.status
    );

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.status(200).json(shipment);
  } catch (error: any) {
    if (error.message.includes("Invalid status transition")) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

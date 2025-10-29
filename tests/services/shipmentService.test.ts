import {
  createShipment,
  updateShipmentStatus,
  getShipmentById,
  clearShipments,
} from "../../src/services/shipmentService";
import { ShipmentStatus } from "../../src/types/shipments";

describe("updateShipmentStatus", () => {
  beforeEach(() => {
    clearShipments();
  });

  test("should update shipment status when valid id provided", () => {
    // Arrange: Create a shipment
    const request = {
      origin: "New York City, NY",
      destination: "Los Angeles, CA",
    };
    const shipment = createShipment(request);
    const shipmentId = shipment.id;

    // Act: Update the status
    const result = updateShipmentStatus(shipmentId, ShipmentStatus.IN_TRANSIT);

    // Assert: Verify status was updated
    expect(result).not.toBeNull();
    expect(result?.status).toBe(ShipmentStatus.IN_TRANSIT);
    expect(result?.id).toBe(shipmentId);

    // Verify it's stored correctly
    const stored = getShipmentById(shipmentId);
    expect(stored?.status).toBe(ShipmentStatus.IN_TRANSIT);
  });

  test("should return undefined when shipment not found", () => {
    // Arrange: No shipments exist (clearShipments runs in beforeEach)

    // Act: Try to update a non-existent shipment
    const result = updateShipmentStatus(
      "fake-id-12345",
      ShipmentStatus.DELIVERED
    );

    // Assert: Should return undefined
    expect(result).toBeUndefined();
  });

  test("should update the updatedAt timestamp", async () => {
    // Arrange: Create a shipment
    const request = {
      origin: "Reno, NV",
      destination: "Las Vegas, NV",
    };
    const shipment = createShipment(request);

    // Save the original timestamp
    const originalTimestamp = shipment.updatedAt.getTime();

    // Wait 1 millisecond to ensure timestamp will be different
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Act: Update the status
    const result = updateShipmentStatus(shipment.id, ShipmentStatus.IN_TRANSIT);

    // Assert: Verify the timestamp has changed
    expect(result).not.toBeNull();
    expect(result?.updatedAt.getTime()).toBeGreaterThan(originalTimestamp);
    expect(result?.status).toBe(ShipmentStatus.IN_TRANSIT);
  });

  // pending -> in transit -> delivered
  test("should handle multiple status updates", () => {
    // Arrange: Create a shipment
    const request = {
      origin: "Troy, MI",
      destination: "Las Vegas, NV",
    };
    const shipment = createShipment(request);

    // Verify initial status
    expect(shipment.status).toBe(ShipmentStatus.PENDING);

    // Act: Update status multiple times
    const result1 = updateShipmentStatus(
      shipment.id,
      ShipmentStatus.IN_TRANSIT
    );

    // Verify first update
    expect(result1?.status).toBe(ShipmentStatus.IN_TRANSIT);
    expect(result1?.id).toBe(shipment.id);

    const result2 = updateShipmentStatus(shipment.id, ShipmentStatus.DELIVERED);

    // Assert: Verify the final update
    expect(result2?.status).toBe(ShipmentStatus.DELIVERED);
    expect(result2?.id).toBe(shipment.id);

    // Verify it's actually stored in memory
    const stored = getShipmentById(shipment.id);
    expect(stored?.status).toBe(ShipmentStatus.DELIVERED);
  });

  test("should throw error for invalid status transition", () => {
    // Arrange: Create a shipment
    const request = {
      origin: "New York City, NY",
      destination: "Los Angeles, CA",
    };
    const shipment = createShipment(request);

    // Act & Assert: Try to skip states: Pending → Delivered (should fail)
    expect(() => {
      updateShipmentStatus(shipment.id, ShipmentStatus.DELIVERED);
    }).toThrow("Invalid status transition");
  });

  // in transit -> delivered -> pending (should fail)
  test("should throw error when transitioning from terminal state", () => {
    // Arrange: Create a shipment
    const request = {
      origin: "New York City, NY",
      destination: "Los Angeles, CA",
    };
    const shipment = createShipment(request);

    // Go through valid transitions
    updateShipmentStatus(shipment.id, ShipmentStatus.IN_TRANSIT);
    updateShipmentStatus(shipment.id, ShipmentStatus.DELIVERED);

    // Act & Assert: Try to change from Delivered (should fail - terminal state)
    expect(() => {
      updateShipmentStatus(shipment.id, ShipmentStatus.PENDING);
    }).toThrow("Invalid status transition");
  });
});

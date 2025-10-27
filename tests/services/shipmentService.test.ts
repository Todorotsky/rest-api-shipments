import {
  createShipment,
  updateShipmentStatus,
  getShipmentById,
  clearShipments,
} from "../../src/services/shipmentService";
import { CreateShipmentRequest } from "../../src/types/shipments";

describe("updateShipmentStatus", () => {
  beforeEach(() => {
    clearShipments();
  });

  test("should update shipment status when valid id provided", () => {
    // Arrange: Create a shipment
    const request = {
      origin: "New York, NY",
      destination: "Los Angeles, CA",
    };
    const shipment = createShipment(request);
    const shipmentId = shipment.id;

    // Act: Update the status
    const result = updateShipmentStatus(shipmentId, "In Transit");

    // Assert: Verify status was updated
    expect(result).not.toBeNull();
    expect(result?.status).toBe("In Transit");
    expect(result?.id).toBe(shipmentId);

    // Verify it's stored correctly
    const stored = getShipmentById(shipmentId);
    expect(stored?.status).toBe("In Transit");
  });

  test("should return undefined when shipment not found", () => {
    // Arrange: No shipments exist (clearShipments runs in beforeEach)

    // Act: Try to update a non-existent shipment
    const result = updateShipmentStatus("fake-id-12345", "Delivered");

    // Assert: Should return undefined
    expect(result).toBeUndefined();
  });

  test("should update the updatedAt timestamp", async () => {
    // Arrange: Create a shipment
    const request = {
      origin: "New York, NY",
      destination: "Los Angeles, CA",
    };
    const shipment = createShipment(request);

    // Save the original timestamp
    const originalTimestamp = shipment.updatedAt.getTime();

    // Wait 1 millisecond to ensure timestamp will be different
    await new Promise((resolve) => setTimeout(resolve, 1));

    // Act: Update the status
    const result = updateShipmentStatus(shipment.id, "In Transit");

    // Assert: Verify the timestamp has changed
    expect(result).not.toBeNull();
    expect(result?.updatedAt.getTime()).toBeGreaterThan(originalTimestamp);
    expect(result?.status).toBe("In Transit");
  });

  test("should handle multiple status updates", () => {
    // Arrange: Create a shipment
    const request = {
      origin: "New York, NY",
      destination: "Los Angeles, CA",
    };
    const shipment = createShipment(request);

    const initialStatus = shipment.status; // "Pending"

    // Act: Update status multiple times
    const result1 = updateShipmentStatus(shipment.id, "In Transit");
    const result2 = updateShipmentStatus(shipment.id, "Delivered");

    // Assert: Verify the final update
    expect(result2?.status).toBe("Delivered");
    expect(result2?.id).toBe(shipment.id); // Same shipment

    // Also verify it's actually stored in memory
    const stored = getShipmentById(shipment.id);
    expect(stored?.status).toBe("Delivered");
  });
});

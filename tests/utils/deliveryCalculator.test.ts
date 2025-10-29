import { calculateEstimatedDeliveryTime } from "../../src/utils/deliveryCalculator";

describe("calculateEstimatedDeliveryTime", () => {
  let mockDate: Date;

  beforeEach(() => {
    // Set a fixed date for consistent testing
    mockDate = new Date("2024-01-01T00:00:00.000Z");
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should calculate delivery time for NY -> LA", () => {
    const result = calculateEstimatedDeliveryTime(
      "New York City, NY",
      "Los Angeles, CA"
    );

    // NY -> LA: ~2789.4 miles / 50 mph = 55.788 hours
    const expectedTime = new Date(mockDate);
    expectedTime.setTime(expectedTime.getTime() + 55.788 * 60 * 60 * 1000);

    expect(result.getTime()).toBe(expectedTime.getTime());
  });

  test("should work in reverse direction", () => {
    const result1 = calculateEstimatedDeliveryTime(
      "New York City, NY",
      "Los Angeles, CA"
    );
    const result2 = calculateEstimatedDeliveryTime(
      "Los Angeles, CA",
      "New York City, NY"
    );

    // Reverse direction should give same result
    expect(result1.getTime()).toBe(result2.getTime());
  });

  test("should throw error for unknown city pair", () => {
    expect(() => {
      calculateEstimatedDeliveryTime("New York City, NY", "Tokyo, Japan");
    }).toThrow("No cities found for state code: Japan");
  });

  test("should throw error for empty strings", () => {
    expect(() => {
      calculateEstimatedDeliveryTime("", "Los Angeles, CA");
    }).toThrow("Invalid state code: undefined");

    expect(() => {
      calculateEstimatedDeliveryTime("New York City, NY", "");
    }).toThrow("Invalid state code: undefined");
  });

  test("should handle same origin and destination (0 distance)", () => {
    const result = calculateEstimatedDeliveryTime(
      "New York City, NY",
      "New York City, NY"
    );

    // Same city = 0 miles = 0 hours
    expect(result.getTime()).toBe(mockDate.getTime());
  });
});

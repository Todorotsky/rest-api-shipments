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

    // NY -> LA: ~2789.4 miles / 50 mph = 55.788 hours, ceil = 56 hours
    const expectedTime = new Date(mockDate);
    expectedTime.setHours(expectedTime.getHours() + 56);

    expect(result.getTime()).toBe(expectedTime.getTime());
  });

  test("should calculate delivery time for LA -> SF", () => {
    const result = calculateEstimatedDeliveryTime(
      "Los Angeles, CA",
      "San Francisco, CA"
    );

    // LA -> SF: ~381.4 miles / 50 mph = 7.628 hours, ceil = 8 hours
    const expectedTime = new Date(mockDate);
    expectedTime.setHours(expectedTime.getHours() + 8);

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

  test("should calculate Miami -> San Francisco correctly", () => {
    const result = calculateEstimatedDeliveryTime(
      "Miami, FL",
      "San Francisco, CA"
    );

    // Miami -> SF: ~3107.3 miles / 50 mph = 62.146 hours, ceil = 63 hours
    const expectedTime = new Date(mockDate);
    expectedTime.setHours(expectedTime.getHours() + 63);

    expect(result.getTime()).toBe(expectedTime.getTime());
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

  test("should calculate Chicago -> Houston correctly", () => {
    const result = calculateEstimatedDeliveryTime("Chicago, IL", "Houston, TX");

    // Chicago -> Houston: ~1081.2 miles / 50 mph = 21.624 hours, ceil = 22 hours
    const expectedTime = new Date(mockDate);
    expectedTime.setHours(expectedTime.getHours() + 22);

    expect(result.getTime()).toBe(expectedTime.getTime());
  });

  test("should calculate Miami -> Houston correctly", () => {
    const result = calculateEstimatedDeliveryTime("Miami, FL", "Houston, TX");

    // Miami -> Houston: ~1187.1 miles / 50 mph = 23.742 hours, ceil = 24 hours
    const expectedTime = new Date(mockDate);
    expectedTime.setHours(expectedTime.getHours() + 24);

    expect(result.getTime()).toBe(expectedTime.getTime());
  });
});

# Shipment Tracking REST API

A REST API built with TypeScript, Node.js, and Express for tracking shipments. Features in-memory storage, automatic delivery time calculation, and comprehensive type safety.

## Features

- ✅ Three REST endpoints for shipment management
- ✅ TypeScript interfaces for request validation
- ✅ State machine validation for status transitions
- ✅ Automatic delivery time calculation based on city pairs
- ✅ In-memory storage (no database required)
- ✅ Comprehensive unit tests
- ✅ Clean, modular architecture

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Todorotsky/pallet_coding_task.git
cd pallet_coding_task
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Start the server:

```bash
npm start
```

The server will start on `http://localhost:8080`

### Development mode (with auto-reload):

```bash
npm run dev
```

## Running Tests

```bash
npm test
```

The project includes unit tests for the shipment status update logic using Jest.

## API Endpoints

### 1. Create Shipment

**POST** `/shipments`

Creates a new shipment and calculates estimated delivery time.

**Request Body:**

```json
{
  "origin": "New York, NY",
  "destination": "Los Angeles, CA"
}
```

**Response (201 Created):**

```json
{
  "id": "lf5x8j3k1m",
  "status": "Pending",
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "estimatedDelivery": "2024-07-20T15:30:00.000Z",
  "createdAt": "2024-07-18T10:00:00.000Z",
  "updatedAt": "2024-07-18T10:00:00.000Z"
}
```

**Valid City Pairs:**

- New York, NY ↔ Los Angeles, CA (2800 miles)
- New York, NY ↔ Chicago, IL (800 miles)
- Chicago, IL ↔ Houston, TX (1000 miles)
- Los Angeles, CA ↔ San Francisco, CA (400 miles)
- Miami, FL ↔ Houston, TX (1200 miles)

### 2. Get Shipment by ID

**GET** `/shipments/:id`

Retrieves a shipment by its unique ID.

**Response (200 OK):**

```json
{
  "id": "lf5x8j3k1m",
  "status": "Pending",
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "estimatedDelivery": "2024-07-20T15:30:00.000Z",
  "createdAt": "2024-07-18T10:00:00.000Z",
  "updatedAt": "2024-07-18T10:00:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Shipment not found"
}
```

### 3. Update Shipment Status

**PATCH** `/shipments/:id/status`

Updates the status of an existing shipment.

**Request Body:**

```json
{
  "status": "In Transit"
}
```

**Valid Status Values:** `"Pending"`, `"In Transit"`, `"Delivered"`, `"Cancelled"`

**State Transitions:**

- `Pending` → `In Transit` or `Cancelled` ✅
- `In Transit` → `Delivered` or `Cancelled` ✅
- Terminal states (`Delivered`, `Cancelled`) cannot be changed ❌

**Error (400 Bad Request):**

```json
{
  "error": "Invalid status transition from Pending to Delivered"
}
```

**Response (200 OK):**

```json
{
  "id": "lf5x8j3k1m",
  "status": "In Transit",
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "estimatedDelivery": "2024-07-20T15:30:00.000Z",
  "createdAt": "2024-07-18T10:00:00.000Z",
  "updatedAt": "2024-07-18T15:45:00.000Z"  ← Updated!
}
```

## Using Postman

1. Start the server: `npm start`
2. Import the following requests into Postman:

**Create Shipment:**

- Method: `POST`
- URL: `http://localhost:8080/shipments`
- Body: `{"origin": "New York, NY", "destination": "Los Angeles, CA"}`

**Get Shipment:**

- Method: `GET`
- URL: `http://localhost:8080/shipments/{id}`

**Update Status:**

- Method: `PATCH`
- URL: `http://localhost:8080/shipments/{id}/status`
- Body: `{"status": "In Transit"}`

## Project Structure

```
src/
├── types/
│   └── shipments.ts          # TypeScript interfaces & enums
├── validation/
│   └── shipmentStateMachine.ts  # State transition validation
├── services/
│   └── shipmentService.ts    # Business logic & in-memory storage
├── routes/
│   └── shipments.ts          # API route handlers
└── utils/
    └── deliveryCalculator.ts # Delivery time calculation

tests/
└── services/
    └── shipmentService.test.ts  # Unit tests

index.ts                      # Main server file
```

## Architecture

The project follows a clean, modular architecture:

- **Types**: Define data structures and enums (Shipment, ShipmentStatus)
- **Validation**: State machine enforces valid status transitions
- **Services**: Handle business logic and data management
- **Routes**: Handle HTTP requests and responses
- **Utils**: Provide helper functions (delivery calculator)

## How It Works

1. **Creating a Shipment**: User provides origin and destination cities
2. **Delivery Calculation**: Helper function calculates estimated delivery time based on distance and average speed (50 mph)
3. **Status Updates**: Shipment status can be updated via PATCH endpoint with state machine validation
4. **Storage**: All data is stored in memory (no database)

## License

ISC

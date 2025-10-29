# Shipment Tracking REST API

A REST API built with TypeScript, Node.js, and Express for tracking shipments. Features in-memory storage, automatic delivery time calculation, and comprehensive type safety.

## Features

- ✅ Three REST endpoints for shipment management
- ✅ Zod runtime validation for request bodies
- ✅ TypeScript interfaces for type safety
- ✅ State machine validation for status transitions
- ✅ Automatic delivery time calculation using Haversine formula
- ✅ Supports most US cities via `country-state-city` package
- ✅ In-memory storage (no database required)
- ✅ Comprehensive unit tests
- ✅ Clean, modular architecture

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Todorotsky/rest-api-shipments.git
cd rest-api-shipments
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
  "origin": "New York City, NY",
  "destination": "Los Angeles, CA"
}
```

**Response (201 Created):**

```json
{
  "id": "lf5x8j3k1m",
  "status": "Pending",
  "origin": "New York City, NY",
  "destination": "Los Angeles, CA",
  "estimatedDelivery": "2024-07-20T15:30:00.000Z",
  "createdAt": "2024-07-18T10:00:00.000Z",
  "updatedAt": "2024-07-18T10:00:00.000Z"
}
```

**Supported Cities:**

The API supports most US cities in the format "City Name, State Code" (e.g., "New York City, NY", "Los Angeles, CA").

City coordinates are automatically looked up from the `country-state-city` package, and delivery times are calculated using the Haversine formula.

**Example Valid Cities:**

- New York City, NY
- Los Angeles, CA
- Chicago, IL
- Houston, TX
- Miami, FL
- San Francisco, CA
- Boston, MA
- Phoenix, AZ
- Seattle, WA
- And thousands more...

### 2. Get Shipment by ID

**GET** `/shipments/:id`

Retrieves a shipment by its unique ID.

**Response (200 OK):**

```json
{
  "id": "lf5x8j3k1m",
  "status": "Pending",
  "origin": "New York City, NY",
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
  "origin": "New York City, NY",
  "destination": "Los Angeles, CA",
  "estimatedDelivery": "2024-07-20T15:30:00.000Z",
  "createdAt": "2024-07-18T10:00:00.000Z",
  "updatedAt": "2024-07-18T15:45:00.000Z"
}
```

## Using Postman

1. Start the server: `npm start`
2. Import the following requests into Postman:

**Create Shipment:**

- Method: `POST`
- URL: `http://localhost:8080/shipments`
- Body: `{"origin": "New York City, NY", "destination": "Los Angeles, CA"}`

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
│   ├── shipmentStateMachine.ts  # State transition validation
│   └── shipmentSchemas.ts    # Zod validation schemas
├── services/
│   └── shipmentService.ts    # Business logic & in-memory storage
├── routes/
│   └── shipments.ts          # API route handlers
└── utils/
    └── deliveryCalculator.ts # Delivery time calculation

tests/
├── services/
│   └── shipmentService.test.ts  # Unit tests for services
└── utils/
    └── deliveryCalculator.test.ts  # Unit tests for calculator

index.ts                      # Main server file
```

## Architecture

The project follows a clean, modular architecture:

- **Types**: Define data structures and enums (Shipment, ShipmentStatus)
- **Validation**:
  - `shipmentStateMachine.ts` - State transition validation
  - `shipmentSchemas.ts` - Zod runtime validation for request bodies
- **Services**: Handle business logic and data management
- **Routes**: Handle HTTP requests and responses with proper error handling
- **Utils**: Provide helper functions (delivery calculator using Haversine formula)

## How It Works

1. **Creating a Shipment**: User provides origin and destination cities in the format "City, State Code" (e.g., "New York City, NY")
2. **City Lookup**: System looks up city coordinates from the `country-state-city` package
3. **Delivery Calculation**: Haversine formula calculates actual distance between coordinates, then estimates delivery time based on average speed (50 mph)
4. **Validation**: All requests are validated with Zod schemas before processing
5. **Status Updates**: Shipment status can be updated via PATCH endpoint with state machine validation
6. **Storage**: All data is stored in memory (no database)

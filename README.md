# Cavea Backend API

A REST API for managing inventories and locations, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 📦 Inventory management (CRUD operations)
- 📍 Location management (CRUD operations)
- 🔍 Filtering, sorting, and pagination
- 📊 Inventory statistics by location
- 📝 API documentation with Swagger
- ✅ Input validation with Zod
- 🗄️ PostgreSQL database with Sequelize ORM

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cavea-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_USER=your_username
DB_PASS=your_password
DB_NAME=cavea_db
DB_HOST=localhost
```

4. Create the PostgreSQL database:

```sql
CREATE DATABASE cavea_db;
```

## Running the Application

### Development mode (with auto-reload):

```bash
npm run dev
```

### Production mode:

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL

```
http://localhost:5000
```

### Health Check

- `GET /health` - Check if the server is running

### API Documentation

- `GET /api-docs` - Interactive Swagger documentation

### Inventories

- `GET /inventories` - Get all inventories (supports pagination, sorting, filtering)
  - Query params: `page`, `locationId`, `sortBy`, `order`
- `POST /inventories` - Create a new inventory
- `GET /inventories/:id` - Get inventory by ID
- `PATCH /inventories/:id` - Update inventory
- `DELETE /inventories/:id` - Delete inventory
- `GET /inventories/by-location` - Get inventory count and total price by location

### Locations

- `GET /locations` - Get all locations
- `POST /locations` - Create a new location
- `GET /locations/:id` - Get location by ID
- `PATCH /locations/:id` - Update location
- `DELETE /locations/:id` - Delete location

## Example Requests

### Create an inventory item:

```bash
curl -X POST http://localhost:5000/inventories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product 1",
    "description": "Product description",
    "price": 49.99,
    "locationId": 1
  }'
```

### Get inventories with pagination:

```bash
curl http://localhost:5000/inventories?page=1&sortBy=name&order=ASC
```

### Get inventory statistics by location:

```bash
curl http://localhost:5000/inventories/by-location
```

## Bulk Data Generation

To generate 50,000 sample inventory items, set this environment variable:

```env
BULK_CREATE_INVENTORIES=true
```

Then start the application. Sample locations will be created automatically.

## Project Structure

```
src/
├── config/          # Database and logger configuration
├── controllers/     # Request handlers
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── validations/     # Zod schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Technologies

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Zod** - Validation
- **Swagger** - API documentation
- **Winston** - Logging

## License

ISC

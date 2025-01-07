# Book Store API

An Express application built with TypeScript, integrating MongoDB via Mongoose to manage a Bike Store. The API enables CRUD operations for products (bikes) and orders, while ensuring data integrity through Mongoose schema validation.

## Deployed live link

You can access the live version of the Bike Store API at:  
[https://your-deployed-link.com](https://your-deployed-link.com)

## Features

### Products

1. Creating a product (Bike)
   - Endpoint: `POST` `/api/products`
   - Adds a new bike to the store.
2. Getting all products (Bikes)
   - Endpoint: `GET` `/api/products`
   - Retrieves all bikes or filters by name, brand, or category using searchTerm query.
3. Getting a specific product (Bike)
   - Endpoint: `GET` `/api/products/:productId`
   - Retrieves bike details by its ID.
4. Update a product (Bike)
   - Endpoint: `PUT` `/api/products/:productId`
   - Updates details of a bike by its ID.
5. Delete a product (Bike)
   - Endpoint: `DELETE` `/api/products/:productId`
   - Deletes a bike by its ID.

### Orders

1. Create an order
   - Endpoint: `POST` `/api/orders`
   - Places an order for a bike, reduces stock, and handles insufficient stock cases.
2. Calculate Revenue
   - Endpoint: `GET` `/api/orders/revenue`
   - Aggregates total revenue from all orders.

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **ORM**: Mongoose
- **Language**: TypeScript
- **Data Validation**: Zod

## Setup Instructions (For running the project locally)

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or cloud instance)

### Steps

1. Clone the repository

```bash
git clone <repository-link>
cd bike-store-api
```

2. Install Dependencies

```bash
yarn install
```

3. Environment Variables

   Create an `.env` file and then add the environment variables.

```env
PORT = 3500
DATABASE_URL = "<your_database_url>"
```

4. Start the server

```bash
yarn dev
```

5. Access API

   API will be running at http://localhost:3500.

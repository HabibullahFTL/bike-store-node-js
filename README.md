# Book Store API

An Express application built with TypeScript, integrating MongoDB via Mongoose to manage a Bike Store. The API enables CRUD operations for products (bikes) and orders, while ensuring data integrity through Mongoose schema validation.

## Deployed live link

You can access the live version of the Bike Store API at:  
https://bike-store-be.vercel.app/

## Features

### Users

1. Get all users
   - Endpoint: `GET` `/api/user`
   - Description: Retrieves a list of all registered users.
2. Create a new admin
   - Endpoint: `POST` `/api/user/create-admin`
   - Description: Creates a new admin user.
3. Register a customer
   - Endpoint: `POST` `/api/user/customer-registration`
   - Description: Registers a new customer account.
4. Block a user
   - Endpoint: `PATCH` `/api/user/block-user/:userId`
   - Description: Blocks a user by their ID, preventing access to protected routes.
5. Unblock a user
   - Endpoint: `PATCH` `/api/user/unblock-user/:userId`
   - Description: Unblocks a previously blocked user by their ID.
6. Change user role
   - Endpoint: `PATCH` `/api/user/change-role/:userId`
   - Description: Changes the role of a user (e.g., from customer to admin).

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
2. Verify payment
   - Endpoint: `GET` `/api/orders/verify-payment`
   - Verifies payment with payment gateway and update transaction information in order data
3. Update order status
   - Endpoint: `PATCH` `/api/orders/update-status/:orderId`
   - Updates next status based on current status of a order
4. Get all orders
   - Endpoint: `GET` `/api/orders`
   - Gets products with pagination and filtering functionalities
5. Get single order
   - Endpoint: `GET` `/api/orders/:orderId`
   - Gets a single order by order id
6. Calculate Revenue
   - Endpoint: `GET` `/api/orders/revenue`
   - Aggregates total revenue from all orders.

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **ORM**: Mongoose
- **Language**: TypeScript
- **Data Validation**: Zod
- **Payment Gateway**: Surjo Pay

## Setup Instructions (For running the project locally)

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or cloud instance)

### Steps

1. Clone the repository

```bash
git clone <repository-link>
cd bike-store-node-js
```

2. Install Dependencies

```bash
yarn install
```

3. Environment Variables

   Create an `.env` file and then add the environment variables with proper values.

```env
PORT =
DATABASE_URL =

PASSWORD_HASH_SALT=

JWT_ACCESS_TOKEN_SECRET=
JWT_ACCESS_TOKEN_EXPIRES_IN=

JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRES_IN=


SP_ENDPOINT=
SP_USERNAME=
SP_PASSWORD=
SP_PREFIX=
SP_RETURN_URL=
```

4. Start the server

```bash
yarn dev
```

5. Access API

   API will be running at http://localhost:3500

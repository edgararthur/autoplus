# Order Service Setup

This document provides instructions for setting up the Order Service functionality in the AutoPlus application.

## Overview

The Order Service enables the following features:
- Creating orders from cart items
- Retrieving order details by ID
- Getting all orders for a user
- Cancelling orders
- Getting orders for a dealer
- Updating shipping status for orders

## Prerequisites

Before proceeding, ensure you have:
1. A running Supabase instance with the initial schema applied
2. Environment variables set up in `.env` file:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

## Implementation Steps

### 1. Database Functions

The Order Service relies on two key SQL functions:
- `create_order_from_cart`: Creates an order from items in a user's cart
- `get_order_details`: Retrieves detailed information about an order with its items

These functions are defined in: `/supabase/migrations/20240622_add_order_functions.sql`

### 2. Apply SQL Migration

Run the following command to apply the SQL functions to your Supabase database:

```bash
npm run db:migrate:order-functions
```

This command executes the SQL migration using the Supabase service key.

### 3. Using the Order Service

The Order Service is available in the shared services and can be imported into buyer, dealer, or admin applications:

```javascript
import OrderService from 'shared/services/orderService';

// Creating an order
const { success, order } = await OrderService.createOrder(userId, {
  shipping_address: { ... },
  payment_method_id: 'payment_method_id',
  shipping_method: 'STANDARD',
  order_notes: { ... },
  process_payment: true
});

// Getting order details
const { success, order } = await OrderService.getOrderById(orderId, userId);

// Getting user orders
const { success, orders } = await OrderService.getUserOrders(userId);

// Cancelling an order
const { success } = await OrderService.cancelOrder(orderId, userId, 'Reason for cancellation');

// Getting dealer orders
const { success, orders } = await OrderService.getDealerOrders(dealerId);

// Updating shipping status
const { success } = await OrderService.updateShippingStatus(
  orderId, 
  dealerId, 
  'SHIPPED', 
  'tracking_number_123'
);
```

## Troubleshooting

If you encounter issues:

1. Check that the SQL migration was applied successfully
2. Verify that you have the correct Supabase credentials in your `.env` file
3. Look for errors in the browser console or server logs
4. Ensure the cart service is properly implemented as it's a dependency for order creation

## Database Schema

The Order Service interacts with the following tables:
- `orders`: Stores order header information
- `order_items`: Stores individual items in an order
- `cart_items`: Used to retrieve items to include in the order
- `products`: Used to get product details and update stock levels
- `profiles`: Used to link users to orders

See `/supabase/schema.sql` for detailed schema information. 
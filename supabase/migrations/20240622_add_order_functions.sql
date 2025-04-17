-- Add order-related functions to the database
-- Will be used by the OrderService in the application

-- Function to create an order from a user's cart
CREATE OR REPLACE FUNCTION create_order_from_cart(
  p_user_id UUID,
  p_shipping_address JSONB,
  p_payment_method_id TEXT,
  p_shipping_method TEXT,
  p_order_notes JSONB DEFAULT '{}'::JSONB
)
RETURNS JSON AS $$
DECLARE
  v_order_id UUID;
  v_subtotal DECIMAL(10, 2) := 0;
  v_shipping_cost DECIMAL(10, 2) := 0;
  v_total DECIMAL(10, 2) := 0;
  v_cart_items RECORD;
  v_order_items_json JSONB := '[]'::JSONB;
  v_order_json JSON;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Check if cart has items
  IF NOT EXISTS (SELECT 1 FROM cart_items WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  -- Calculate order totals
  SELECT SUM(ci.quantity * COALESCE(p.sale_price, p.price))
  INTO v_subtotal
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  WHERE ci.user_id = p_user_id;

  -- Calculate shipping cost based on the shipping method
  -- This is a simplified version - a real implementation would have more complex logic
  CASE p_shipping_method
    WHEN 'STANDARD' THEN v_shipping_cost := 10.00;
    WHEN 'EXPRESS' THEN v_shipping_cost := 20.00;
    WHEN 'NEXT_DAY' THEN v_shipping_cost := 30.00;
    ELSE v_shipping_cost := 10.00; -- Default to standard
  END CASE;

  -- Calculate total
  v_total := v_subtotal + v_shipping_cost;

  -- Create the order
  INSERT INTO orders (
    buyer_id,
    shipping_address,
    shipping_method,
    shipping_cost,
    subtotal,
    total,
    payment_method,
    payment_status,
    order_status,
    notes
  ) VALUES (
    p_user_id,
    p_shipping_address,
    p_shipping_method,
    v_shipping_cost,
    v_subtotal,
    v_total,
    p_payment_method_id,
    'PENDING', -- Initial payment status
    'PENDING', -- Initial order status
    p_order_notes
  )
  RETURNING id INTO v_order_id;

  -- Create order items from cart items
  FOR v_cart_items IN (
    SELECT 
      ci.product_id,
      ci.dealer_id,
      ci.quantity,
      ci.selected_options,
      p.name AS product_name,
      COALESCE(p.sale_price, p.price) AS unit_price,
      (ci.quantity * COALESCE(p.sale_price, p.price)) AS total_price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = p_user_id
  ) LOOP
    -- Insert each order item
    INSERT INTO order_items (
      order_id,
      product_id,
      dealer_id,
      quantity,
      unit_price,
      total_price
    ) VALUES (
      v_order_id,
      v_cart_items.product_id,
      v_cart_items.dealer_id,
      v_cart_items.quantity,
      v_cart_items.unit_price,
      v_cart_items.total_price
    );

    -- Add to the order items JSON for the response
    v_order_items_json := v_order_items_json || jsonb_build_object(
      'product_id', v_cart_items.product_id,
      'product_name', v_cart_items.product_name,
      'dealer_id', v_cart_items.dealer_id,
      'quantity', v_cart_items.quantity,
      'unit_price', v_cart_items.unit_price,
      'total_price', v_cart_items.total_price,
      'selected_options', v_cart_items.selected_options
    );
  END LOOP;

  -- Update product stock quantities
  UPDATE products p
  SET stock_level = p.stock_level - ci.quantity
  FROM cart_items ci
  WHERE ci.product_id = p.id AND ci.user_id = p_user_id;

  -- Build the order JSON to return
  SELECT json_build_object(
    'id', v_order_id,
    'buyer_id', p_user_id,
    'shipping_address', p_shipping_address,
    'shipping_method', p_shipping_method,
    'shipping_cost', v_shipping_cost,
    'subtotal', v_subtotal,
    'total_amount', v_total,
    'payment_method', p_payment_method_id,
    'payment_status', 'PENDING',
    'order_status', 'PENDING',
    'notes', p_order_notes,
    'created_at', NOW(),
    'items', v_order_items_json
  ) INTO v_order_json;

  -- Clear cart (this should be done by the application after verifying the order was created)
  -- DELETE FROM cart_items WHERE user_id = p_user_id;

  RETURN v_order_json;
END;
$$ LANGUAGE plpgsql;

-- Function to get order details by ID
CREATE OR REPLACE FUNCTION get_order_details(
  p_order_id UUID,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_order_json JSON;
  v_is_authorized BOOLEAN := FALSE;
BEGIN
  -- Check if the order exists
  IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order_id) THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  -- Check if the user is authorized to view this order
  -- User is authorized if they are the buyer or a dealer with items in the order
  IF p_user_id IS NOT NULL THEN
    SELECT 
      (buyer_id = p_user_id) OR 
      EXISTS (
        SELECT 1 FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = p_order_id AND p.dealer_id = p_user_id
      )
    INTO v_is_authorized
    FROM orders
    WHERE id = p_order_id;

    IF NOT v_is_authorized THEN
      RAISE EXCEPTION 'Unauthorized access to order';
    END IF;
  END IF;

  -- Build the full order JSON with items
  SELECT json_build_object(
    'id', o.id,
    'buyer_id', o.buyer_id,
    'buyer', json_build_object(
      'id', p.id,
      'name', p.name,
      'email', p.email
    ),
    'shipping_address', o.shipping_address,
    'shipping_method', o.shipping_method,
    'shipping_cost', o.shipping_cost,
    'subtotal', o.subtotal,
    'total', o.total,
    'payment_method', o.payment_method,
    'payment_status', o.payment_status,
    'order_status', o.order_status,
    'tracking_number', o.tracking_number,
    'shipping_carrier', o.shipping_carrier,
    'notes', o.notes,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'items', (
      SELECT json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'dealer_id', oi.dealer_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'total_price', oi.total_price,
          'product', (
            SELECT json_build_object(
              'id', p.id,
              'name', p.name,
              'description', p.description,
              'images', (
                SELECT json_agg(pi.url)
                FROM product_images pi
                WHERE pi.product_id = p.id
              ),
              'dealer', (
                SELECT json_build_object(
                  'id', d.id,
                  'name', d.name,
                  'company_name', d.company_name
                )
                FROM profiles d
                WHERE d.id = p.dealer_id
              )
            )
            FROM products p
            WHERE p.id = oi.product_id
          )
        )
      )
      FROM order_items oi
      WHERE oi.order_id = o.id
    )
  )
  INTO v_order_json
  FROM orders o
  JOIN profiles p ON o.buyer_id = p.id
  WHERE o.id = p_order_id;

  RETURN v_order_json;
END;
$$ LANGUAGE plpgsql; 
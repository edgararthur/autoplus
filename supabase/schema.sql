-- Create database schema for AutoPlus marketplace

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-jwt-secret';

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'dealer', 'buyer')),
  company_name TEXT, -- For dealers
  location TEXT, -- For dealers
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on subcategories
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Policies for subcategories
CREATE POLICY "Subcategories are viewable by everyone"
  ON subcategories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert subcategories"
  ON subcategories FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Only admins can update subcategories"
  ON subcategories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Only admins can delete subcategories"
  ON subcategories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  );

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  part_number TEXT,
  brand TEXT,
  description TEXT,
  features TEXT[],
  specifications JSONB,
  compatibility JSONB, -- For make, model, year compatibility
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),
  condition TEXT CHECK (condition IN ('NEW', 'USED', 'REFURBISHED')),
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  sale_start_date TIMESTAMP WITH TIME ZONE,
  sale_end_date TIMESTAMP WITH TIME ZONE,
  stock_level INTEGER DEFAULT 0,
  weight DECIMAL(10, 2), -- In kg
  dimensions JSONB, -- Length, width, height
  warranty_info TEXT,
  country_of_origin TEXT,
  tags TEXT[],
  moderation_status TEXT DEFAULT 'PENDING' CHECK (moderation_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Products are viewable by everyone if approved"
  ON products FOR SELECT
  USING (moderation_status = 'APPROVED' OR (auth.uid() = dealer_id) OR (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
    )
  ));

CREATE POLICY "Dealers can insert their own products"
  ON products FOR INSERT
  USING (
    auth.uid() = dealer_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'dealer'
    )
  );

CREATE POLICY "Dealers can update their own products"
  ON products FOR UPDATE
  USING (
    auth.uid() = dealer_id OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "Dealers can delete their own products"
  ON products FOR DELETE
  USING (
    auth.uid() = dealer_id OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

-- PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on product_images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Policies for product_images
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Dealers can insert images for their own products"
  ON product_images FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_id AND products.dealer_id = auth.uid()
    )
  );

CREATE POLICY "Dealers can update images for their own products"
  ON product_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_id AND products.dealer_id = auth.uid()
    )
  );

CREATE POLICY "Dealers can delete images for their own products"
  ON product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_id AND products.dealer_id = auth.uid()
    )
  );

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_method TEXT,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  order_status TEXT NOT NULL CHECK (order_status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'COMPLETED')),
  tracking_number TEXT,
  shipping_carrier TEXT,
  notes TEXT,
  cancel_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Buyers can view their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = buyer_id OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "Buyers can insert their own orders"
  ON orders FOR INSERT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own orders"
  ON orders FOR UPDATE
  USING (
    auth.uid() = buyer_id OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  dealer_id UUID REFERENCES profiles(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for order_items
CREATE POLICY "Buyers can view their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id AND orders.buyer_id = auth.uid()
    ) OR (
      dealer_id = auth.uid()
    ) OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "Buyers can insert their own order items"
  ON order_items FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id AND orders.buyer_id = auth.uid()
    )
  );

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  payment_method TEXT NOT NULL,
  phone_number TEXT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Buyers can view their own transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id AND orders.buyer_id = auth.uid()
    ) OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT
  USING (true);

CREATE POLICY "System can update transactions"
  ON transactions FOR UPDATE
  USING (true);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- RETURNS TABLE
CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  return_reason TEXT NOT NULL,
  additional_info TEXT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on returns
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;

-- Policies for returns
CREATE POLICY "Buyers can view their own returns"
  ON returns FOR SELECT
  USING (
    buyer_id = auth.uid() OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "Buyers can insert their own returns"
  ON returns FOR INSERT
  USING (buyer_id = auth.uid());

-- RETURN ITEMS TABLE
CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id UUID REFERENCES returns(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  return_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on return_items
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;

-- Policies for return_items
CREATE POLICY "Buyers can view their own return items"
  ON return_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM returns
      WHERE returns.id = return_id AND returns.buyer_id = auth.uid()
    ) OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "Buyers can insert their own return items"
  ON return_items FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM returns
      WHERE returns.id = return_id AND returns.buyer_id = auth.uid()
    )
  );

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_order_id UUID REFERENCES orders(id),
  related_product_id UUID REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() OR receiver_id = auth.uid() OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  USING (sender_id = auth.uid());

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (
    receiver_id = auth.uid() OR (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin'
      )
    )
  );

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID, -- Could be order_id, product_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  USING (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policies for wishlists
CREATE POLICY "Users can view their own wishlists"
  ON wishlists FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert into their own wishlists"
  ON wishlists FOR INSERT
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete from their own wishlists"
  ON wishlists FOR DELETE
  USING (user_id = auth.uid());

-- SHIPPING PROFILES TABLE
CREATE TABLE IF NOT EXISTS shipping_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_rate DECIMAL(10, 2) NOT NULL,
  region_rates JSONB, -- Specific rates for different regions
  method TEXT NOT NULL,
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on shipping_profiles
ALTER TABLE shipping_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for shipping_profiles
CREATE POLICY "Shipping profiles are viewable by everyone"
  ON shipping_profiles FOR SELECT
  USING (true);

CREATE POLICY "Dealers can insert their own shipping profiles"
  ON shipping_profiles FOR INSERT
  USING (
    dealer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.user_type = 'dealer'
    )
  );

CREATE POLICY "Dealers can update their own shipping profiles"
  ON shipping_profiles FOR UPDATE
  USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can delete their own shipping profiles"
  ON shipping_profiles FOR DELETE
  USING (dealer_id = auth.uid());

-- STAFF TABLE
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES profiles(id) NOT NULL,
  staff_id UUID REFERENCES profiles(id) NOT NULL,
  role TEXT NOT NULL,
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on staff
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Policies for staff
CREATE POLICY "Dealers can view their own staff"
  ON staff FOR SELECT
  USING (
    dealer_id = auth.uid() OR (
      EXISTS (
        SELECT 1 FROM staff
        WHERE staff.dealer_id = dealer_id AND staff.staff_id = auth.uid()
      )
    )
  );

CREATE POLICY "Dealers can insert their own staff"
  ON staff FOR INSERT
  USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can update their own staff"
  ON staff FOR UPDATE
  USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can delete their own staff"
  ON staff FOR DELETE
  USING (dealer_id = auth.uid());

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_categories
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subcategories
BEFORE UPDATE ON subcategories
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_orders
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_transactions
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reviews
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_returns
BEFORE UPDATE ON returns
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_shipping_profiles
BEFORE UPDATE ON shipping_profiles
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_staff
BEFORE UPDATE ON staff
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp(); 
-- Add dealer reviews table
CREATE TABLE IF NOT EXISTS dealer_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (dealer_id, user_id)
);

-- Add indexes for faster lookups
CREATE INDEX idx_dealer_reviews_dealer_id ON dealer_reviews(dealer_id);
CREATE INDEX idx_dealer_reviews_user_id ON dealer_reviews(user_id);
CREATE INDEX idx_dealer_reviews_rating ON dealer_reviews(rating);
CREATE INDEX idx_dealer_reviews_created_at ON dealer_reviews(created_at);

-- Add reputation fields to dealers table
ALTER TABLE dealers
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reputation_tier VARCHAR(20) DEFAULT 'bronze';

-- Create trigger function to update dealer ratings on review changes
CREATE OR REPLACE FUNCTION update_dealer_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC(3,1);
  count_reviews INTEGER;
  new_tier VARCHAR(20);
BEGIN
  -- Calculate new average rating and count
  SELECT 
    COALESCE(AVG(rating), 0)::NUMERIC(3,1),
    COUNT(*)
  INTO 
    avg_rating,
    count_reviews
  FROM dealer_reviews
  WHERE dealer_id = COALESCE(NEW.dealer_id, OLD.dealer_id);
  
  -- Determine reputation tier based on average rating and number of reviews
  IF count_reviews < 5 OR avg_rating < 3 THEN
    new_tier := 'bronze';
  ELSIF (count_reviews >= 5 AND avg_rating >= 3 AND avg_rating < 4) OR 
        (count_reviews < 15 AND avg_rating >= 4) THEN
    new_tier := 'silver';
  ELSIF (count_reviews >= 15 AND avg_rating >= 4 AND avg_rating < 4.5) OR 
        (count_reviews >= 30 AND avg_rating >= 3.5 AND avg_rating < 4.5) OR 
        (count_reviews < 30 AND avg_rating >= 4.5) THEN
    new_tier := 'gold';
  ELSIF count_reviews >= 30 AND avg_rating >= 4.5 THEN
    new_tier := 'diamond';
  ELSE
    new_tier := 'bronze';
  END IF;
  
  -- Update the dealer record
  UPDATE dealers
  SET 
    average_rating = avg_rating,
    review_count = count_reviews,
    reputation_tier = new_tier,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.dealer_id, OLD.dealer_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic dealer rating updates
CREATE TRIGGER dealer_review_inserted
AFTER INSERT ON dealer_reviews
FOR EACH ROW
EXECUTE FUNCTION update_dealer_rating();

CREATE TRIGGER dealer_review_updated
AFTER UPDATE ON dealer_reviews
FOR EACH ROW
EXECUTE FUNCTION update_dealer_rating();

CREATE TRIGGER dealer_review_deleted
AFTER DELETE ON dealer_reviews
FOR EACH ROW
EXECUTE FUNCTION update_dealer_rating();

-- Add RLS (Row Level Security) policies
ALTER TABLE dealer_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY dealer_reviews_select ON dealer_reviews
FOR SELECT USING (true);

-- Only the reviewer can insert their own review
CREATE POLICY dealer_reviews_insert ON dealer_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the reviewer can update their own review
CREATE POLICY dealer_reviews_update ON dealer_reviews
FOR UPDATE USING (auth.uid() = user_id);

-- Only the reviewer or an admin can delete a review
CREATE POLICY dealer_reviews_delete ON dealer_reviews
FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Create a function to get dealer reputation metrics
CREATE OR REPLACE FUNCTION get_dealer_reputation(p_dealer_id UUID)
RETURNS TABLE (
  dealer_id UUID,
  average_rating NUMERIC(3,1),
  review_count INTEGER,
  reputation_tier VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.average_rating,
    d.review_count,
    d.reputation_tier
  FROM dealers d
  WHERE d.id = p_dealer_id;
END;
$$ LANGUAGE plpgsql; 
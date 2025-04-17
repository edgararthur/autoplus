-- Migration to add INSERT policy for profiles table
-- This allows new users to create their own profiles during registration

-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  USING (auth.uid() = id);

-- Alternative approach using a stored procedure if the policy above doesn't work
-- This can be uncommented if needed
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, user_type, is_active, created_at)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'name', 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'BUYER'), 
    true, 
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/ 
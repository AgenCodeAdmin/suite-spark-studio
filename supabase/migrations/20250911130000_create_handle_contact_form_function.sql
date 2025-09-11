DROP FUNCTION IF EXISTS handle_contact_form(text,text,text,text,text);

CREATE OR REPLACE FUNCTION handle_contact_form(
  p_full_name TEXT,
  p_email TEXT,
  p_phone_number TEXT,
  p_business_name TEXT,
  p_message TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.contact_submissions (full_name, email, phone_number, business_name, message)
  VALUES (p_full_name, p_email, p_phone_number, p_business_name, p_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set the search_path for the function to address the warning
ALTER FUNCTION public.handle_contact_form(TEXT, TEXT, TEXT, TEXT, TEXT) SET search_path = public;
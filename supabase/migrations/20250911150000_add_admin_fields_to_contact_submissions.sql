
ALTER TABLE public.contact_submissions
ADD COLUMN checked BOOLEAN DEFAULT false,
ADD COLUMN status TEXT,
ADD COLUMN services_of_interest TEXT[],
ADD COLUMN follow_up_date TIMESTAMPTZ,
ADD COLUMN assigned_to_emails TEXT[];

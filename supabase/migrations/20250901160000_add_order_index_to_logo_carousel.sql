ALTER TABLE public.logo_carousel ADD COLUMN order_index INTEGER;

-- Optional: Populate existing rows with an initial order_index based on their current ID or creation order
-- This assumes you want existing items to have a default order. Adjust as needed.
UPDATE public.logo_carousel
SET order_index = id
WHERE order_index IS NULL;

-- If you want to ensure unique order_index values and handle potential conflicts,
-- you might need more complex logic or a separate script to re-index after this migration.
-- For simplicity, we're setting it to ID for now, assuming IDs are somewhat sequential.
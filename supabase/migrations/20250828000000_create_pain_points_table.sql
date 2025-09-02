CREATE TABLE pain_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT,
  pre_formatted_paragraph TEXT,
  paragraph TEXT,
  order_index INTEGER
);
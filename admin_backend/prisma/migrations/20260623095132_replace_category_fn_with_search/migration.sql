-- This is an empty migration.
-- 1. Drop the old integer-based function safely
DROP FUNCTION IF EXISTS get_category_details(INT);

-- 2. Create your new text-search function
CREATE OR REPLACE FUNCTION get_category_details(p_search_name VARCHAR DEFAULT NULL)
RETURNS TABLE (
    id INT,
    category_name VARCHAR,
    image_id INT,
    image_path VARCHAR,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.category_name,
        c.image_id,
        m.path AS image_path,
        c.created_at
    FROM category c
    LEFT JOIN media m ON c.image_id = m.id
    WHERE (
        p_search_name IS NULL 
        OR TRIM(p_search_name) = '' 
        OR c.category_name ILIKE '%' || p_search_name || '%'
    )
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;
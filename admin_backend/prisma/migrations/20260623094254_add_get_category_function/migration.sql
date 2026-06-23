-- This is an empty migration.
CREATE OR REPLACE FUNCTION get_category_details(p_category_id INT DEFAULT NULL)
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
    WHERE (p_category_id IS NULL OR c.id = p_category_id)
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;
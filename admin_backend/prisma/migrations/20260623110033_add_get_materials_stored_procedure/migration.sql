-- This is an empty migration.
CREATE OR REPLACE FUNCTION get_all_materials()
RETURNS TABLE (
    id INT,
    material_name VARCHAR,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.material_name,
        m.created_at
    FROM material m
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql;
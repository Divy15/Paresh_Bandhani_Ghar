-- This is an empty migration.
-- 1. Store Product Structure Function
CREATE OR REPLACE FUNCTION store_product_structure(
    p_main_name VARCHAR,
    p_includes JSONB
)
RETURNS INT AS $$
DECLARE
    v_new_id INT;
BEGIN
    INSERT INTO product_structure (main_name, includes, created_at)
    VALUES (TRIM(p_main_name), p_includes, NOW())
    RETURNING id INTO v_new_id;
    
    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;


-- 2. Update Product Structure Function
CREATE OR REPLACE FUNCTION update_product_structure(
    p_structure_id INT,
    p_main_name VARCHAR,
    p_includes JSONB
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE product_structure
    SET main_name = TRIM(p_main_name),
        includes = p_includes
    WHERE id = p_structure_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


-- 3. Delete Product Structure Function
CREATE OR REPLACE FUNCTION delete_product_structure(p_structure_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM product_structure
    WHERE id = p_structure_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


-- 4. Get and Filter Product Structures Function
CREATE OR REPLACE FUNCTION get_product_structures(p_search_name VARCHAR DEFAULT NULL)
RETURNS TABLE (
    id INT,
    main_name VARCHAR,
    includes JSONB,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.id,
        ps.main_name,
        ps.includes,
        ps.created_at
    FROM product_structure ps
    WHERE (
        p_search_name IS NULL 
        OR TRIM(p_search_name) = '' 
        OR ps.main_name ILIKE '%' || p_search_name || '%'
    )
    ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql;
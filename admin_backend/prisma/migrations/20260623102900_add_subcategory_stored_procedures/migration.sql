-- This is an empty migration.

-- 1. Store Subcategory Function
CREATE OR REPLACE FUNCTION store_subcategory(
    p_category_id INT,
    p_subcategory_name VARCHAR,
    p_image_id INT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    v_new_id INT;
BEGIN
    INSERT INTO subcategory (category_id, subcategory_name, image_id, created_at)
    VALUES (p_category_id, p_subcategory_name, p_image_id, NOW())
    RETURNING id INTO v_new_id;
    
    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;


-- 2. Update Subcategory Function
CREATE OR REPLACE FUNCTION update_subcategory(
    p_subcategory_id INT,
    p_category_id INT,
    p_subcategory_name VARCHAR,
    p_image_id INT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE subcategory
    SET category_id = p_category_id,
        subcategory_name = p_subcategory_name,
        image_id = p_image_id
    WHERE id = p_subcategory_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


-- 3. Delete Subcategory Function
CREATE OR REPLACE FUNCTION delete_subcategory(p_subcategory_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM subcategory
    WHERE id = p_subcategory_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;


-- 4. Get/Filter Subcategories By Category ID Function
CREATE OR REPLACE FUNCTION get_subcategories_by_category(p_category_id INT DEFAULT NULL)
RETURNS TABLE (
    id INT,
    category_id INT,
    category_name VARCHAR,
    subcategory_name VARCHAR,
    image_id INT,
    media_path VARCHAR,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.category_id,
        c.category_name,
        s.subcategory_name,
        s.image_id,
        m.path AS media_path,
        s.created_at
    FROM subcategory s
    INNER JOIN category c ON s.category_id = c.id
    LEFT JOIN media m ON s.image_id = m.id
    WHERE (p_category_id IS NULL OR s.category_id = p_category_id)
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql;
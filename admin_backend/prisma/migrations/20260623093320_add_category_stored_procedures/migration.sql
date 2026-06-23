-- This is an empty migration.
-- 1. Function to Store a Category
CREATE OR REPLACE FUNCTION store_category(
    p_category_name VARCHAR,
    p_image_id INT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    v_new_id INT;
BEGIN
    INSERT INTO category (category_name, image_id, created_at)
    VALUES (p_category_name, p_image_id, NOW())
    RETURNING id INTO v_new_id;
    
    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;


-- 2. Function to Update a Category
CREATE OR REPLACE FUNCTION update_category(
    p_category_id INT,
    p_category_name VARCHAR,
    p_image_id INT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE category
    SET category_name = p_category_name,
        image_id = p_image_id
    WHERE id = p_category_id;
    
    -- Returns true if a row was actually updated, false otherwise
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
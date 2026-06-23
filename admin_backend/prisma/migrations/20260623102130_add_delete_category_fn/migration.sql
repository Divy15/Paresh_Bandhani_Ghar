-- This is an empty migration.
CREATE OR REPLACE FUNCTION delete_category(p_category_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM category
    WHERE id = p_category_id;
    
    -- Returns true if a row was found and deleted, false otherwise
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
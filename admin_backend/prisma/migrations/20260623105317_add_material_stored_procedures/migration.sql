-- This is an empty migration.
-- 1. Store New Material Function
CREATE OR REPLACE FUNCTION store_material(
    p_material_name VARCHAR
)
RETURNS INT AS $$
DECLARE
    v_new_id INT;
BEGIN
    INSERT INTO material (material_name, created_at)
    VALUES (TRIM(p_material_name), NOW())
    RETURNING id INTO v_new_id;
    
    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;


-- 2. Delete Material Function
CREATE OR REPLACE FUNCTION delete_material(p_material_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM material
    WHERE id = p_material_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
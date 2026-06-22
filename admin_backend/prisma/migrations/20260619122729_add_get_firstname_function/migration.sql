-- This is an empty migration.
-- migration.sql
CREATE OR REPLACE FUNCTION get_firstname_by_mobile(p_mobileno TEXT)
RETURNS TEXT AS $$
DECLARE
    v_firstname TEXT;
BEGIN
    SELECT "firstname" INTO v_firstname 
    FROM "user" 
    WHERE "mobileno" = p_mobileno;
    
    RETURN v_firstname;
END;
$$ LANGUAGE plpgsql;
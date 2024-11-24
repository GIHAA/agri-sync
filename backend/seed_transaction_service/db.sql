CREATE TABLE IF NOT EXISTS seed_transactions (
    id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL,
    seed_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
    location VARCHAR(255) NOT NULL,
    blockchain_tx_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION create_and_update_seed_transaction(
    _farmer_id INT,
    _seed_type VARCHAR(100),
    _quantity DECIMAL(10, 2),
    _price_per_unit DECIMAL(10, 2),
    _location VARCHAR(255),
    _blockchain_tx_id VARCHAR(255)
) RETURNS TABLE (
    transaction_id INT,
    farmer_id INT,
    status VARCHAR(50),
    blockchain_tx_id VARCHAR(255),
    created_at TIMESTAMP
) AS $$
DECLARE
    inserted_transaction_id INT;
BEGIN
    BEGIN TRANSACTION;
    INSERT INTO seed_transactions (farmer_id, seed_type, quantity, price_per_unit, location)
    VALUES (_farmer_id, _seed_type, _quantity, _price_per_unit, _location)
    RETURNING id INTO inserted_transaction_id;



    UPDATE seed_transactions
    SET blockchain_tx_id = _blockchain_tx_id, status = 'Completed', updated_at = NOW()
    WHERE id = inserted_transaction_id;

    COMMIT;

    RETURN QUERY SELECT
        inserted_transaction_id,
        _farmer_id,
        'Completed' AS status,
        _blockchain_tx_id,
        NOW() AS created_at;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE EXCEPTION 'Error in transaction: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
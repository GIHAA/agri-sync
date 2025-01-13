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
) 
RETURNS TABLE (
  inserted_transaction_id INT,
  farmer_id INT,  -- Rename this column to avoid conflict
  status VARCHAR(50),
  blockchain_tx_id VARCHAR(255),
  created_at TIMESTAMP
) AS $$
BEGIN
  -- Insert data into the seed_transactions table
  INSERT INTO seed_transactions (
    farmer_id, 
    seed_type, 
    quantity, 
    price_per_unit, 
    location, 
    blockchain_tx_id, 
    status, 
    created_at, 
    updated_at
  )
  VALUES (
    _farmer_id, 
    _seed_type, 
    _quantity, 
    _price_per_unit, 
    _location, 
    _blockchain_tx_id, 
    'Pending', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
  )
  RETURNING id, _farmer_id, 'Pending'::VARCHAR, _blockchain_tx_id, CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
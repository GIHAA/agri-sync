-- Create Users table for basic user information
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            qr_code_hash VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Create Farmer Details table for farmer-specific data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'farmer_details') THEN
        CREATE TABLE farmer_details (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            age INT NOT NULL,
            vision_problems BOOLEAN DEFAULT FALSE,
            color_blindness BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    END IF;
END $$;

-- Create Accessibility Settings table for user preferences
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accessibility_settings') THEN
        CREATE TABLE accessibility_settings (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            text_size TEXT CHECK (text_size IN ('Small', 'Medium', 'Large')) DEFAULT 'Medium',
            layout TEXT CHECK (layout IN ('Simple', 'Standard')) DEFAULT 'Standard',
            color_friendly_scheme TEXT CHECK (color_friendly_scheme IN ('Red-Green Safe', 'Blue-Yellow Safe', 'Standard')) DEFAULT 'Standard',
            use_symbols_with_colors BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    END IF;
END $$;
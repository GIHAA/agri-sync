-- Create Roles table for defining user roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename = 'roles') THEN
        CREATE TABLE roles (
            id SERIAL PRIMARY KEY,
            role_name VARCHAR(50) NOT NULL UNIQUE
        );
        INSERT INTO roles (role_name) VALUES ('SUPER_ADMIN'), ('SEED_PROVIDER'), ('FARMER');
    END IF;
END $$;

-- Create Users table for basic user information
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role_id INT NOT NULL DEFAULT 1, -- Default to 'superadmin' for the first user
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
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

-- Assign the first user as 'superadmin' role (role_id = 1)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users) THEN
        INSERT INTO users (username, email, password_hash, role_id)
        VALUES ('Default Superadmin', 'admin@example.com', 'hashed_password', 1);
    END IF;
END $$;
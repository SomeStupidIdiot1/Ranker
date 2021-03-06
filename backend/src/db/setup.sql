CREATE TABLE IF NOT EXISTS accounts (
	id SERIAL PRIMARY KEY,
	display_name VARCHAR ( 30 ) NOT NULL,
	display_number SMALLINT CHECK (display_number >= 0),
	UNIQUE (display_name, display_number),
	password_hash VARCHAR ( 100 ) NOT NULL,
	salt_round INTEGER NOT NULL,
	email VARCHAR ( 100 ) UNIQUE NOT NULL,
	created_on TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW(),
	verified BOOLEAN DEFAULT FALSE NOT NULL,
	pinned_lists INTEGER ARRAY -- List of ids referring to list_of_items
);
CREATE TABLE IF NOT EXISTS list_of_items (
	id SERIAL PRIMARY KEY,
	title VARCHAR(50) NOT NULL,
	info VARCHAR(300) DEFAULT '' NOT NULL,
	image_url TEXT,
	image_public_id TEXT,
	UNIQUE (title, owner_id),
	created_on TIMESTAMP DEFAULT NOW() NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW() NOT NULL,
	owner_id SERIAL REFERENCES accounts NOT NULL
);
CREATE TABLE IF NOT EXISTS item (
	id SERIAL PRIMARY KEY,
	image_name VARCHAR(40) DEFAULT '' NOT NULL,  
	owner_id SERIAL REFERENCES list_of_items NOT NULL,
	image_url TEXT,
	image_public_id TEXT,
	elo INTEGER DEFAULT 1000 NOT NULL
);
CREATE TABLE IF NOT EXISTS accounts (
	id serial PRIMARY KEY,
	display_name VARCHAR ( 30 ) NOT NULL,
	display_number SERIAL,
	password_hash VARCHAR ( 100 ) NOT NULL,
	email VARCHAR ( 100 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP,
	owner_of,
	saved_as,
);
CREATE TABLE IF NOT EXISTS lists_of_items (
	id serial PRIMARY KEY,
	items text,
	title VARCHAR(100) NOT NULL,
	info VARCHAR(300),
	creator NOT NULL,
	created_on TIMESTAMP NOT NULL,
  last_updated TIMESTAMP 
);

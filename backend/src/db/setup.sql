CREATE TABLE IF NOT EXISTS accounts (
	user_id serial PRIMARY KEY,
	display_name VARCHAR ( 30 ) NOT NULL,
	password_hash VARCHAR ( 100 ) NOT NULL,
	email VARCHAR ( 100 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP 
);
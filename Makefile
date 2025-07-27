start:
	node src/server.js

migrate-up:
	node-pg-migrate up

migrate-down:
	node-pg-migrate down


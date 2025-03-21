import app from '.';
import { pool } from './config/db.config';

const PORT = process.env.PORT || 3000;

const initializeDatabase = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);

    await pool.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    `);

    await pool.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'user';
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars(
        id SERIAL PRIMARY KEY,
        model VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs(
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(25) NOT NULL,
        old_data JSONB,
        new_data JSONB,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().then(r => console.log("Server started"));
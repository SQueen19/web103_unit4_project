import { pool } from './database.js'

async function reset() {
  const client = await pool.connect()
  try {
    console.log('resetting database...')

    await client.query('BEGIN')

    // drop tables in order of dependencies
    await client.query(`
      DROP TABLE IF EXISTS favorites;
      DROP TABLE IF EXISTS car_features;
      DROP TABLE IF EXISTS car_images;
      DROP TABLE IF EXISTS cars;
      DROP TABLE IF EXISTS users;
    `)

    // users table - simple auth-ready schema
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // cars table - main resource for the app (color instead of description)
    await client.query(`
      CREATE TABLE cars (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER,
        price NUMERIC(12,2),
        color VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // car_images table - multiple images per car
    await client.query(`
      CREATE TABLE car_images (
        id SERIAL PRIMARY KEY,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt TEXT,
        sort_order INTEGER DEFAULT 0
      );
    `)

    // car_features table - simple key/value or tag list per car
    await client.query(`
      CREATE TABLE car_features (
        id SERIAL PRIMARY KEY,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        feature VARCHAR(255) NOT NULL
      );
    `)

    // favorites table - users can favorite cars
    await client.query(`
      CREATE TABLE favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, car_id)
      );
    `)

    // seed a demo user and car so the app has something to show
    const { rows: userRows } = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Demo User', 'demo@example.com', 'demo-hash']
    )

    const demoUserId = userRows[0].id

    const { rows: carRows } = await client.query(
      `INSERT INTO cars (user_id, make, model, year, price, color)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [demoUserId, 'Toyota', 'Corolla', 2015, 9500.00, 'Silver']
    )

    const demoCarId = carRows[0].id

    await client.query(
      `INSERT INTO car_images (car_id, url, alt, sort_order) VALUES
       ($1, $2, $3, $4),
       ($1, $5, $6, $7)`,
      [demoCarId, '/assets/background.jpg', 'demo car 1', 0, '/public/lightning.png', 'demo car 2', 1]
    )

    await client.query(
      `INSERT INTO car_features (car_id, feature) VALUES
       ($1, $2), ($1, $3), ($1, $4)`,
      [demoCarId, 'air conditioning', 'automatic', 'bluetooth']
    )

    await client.query(
      `INSERT INTO favorites (user_id, car_id) VALUES ($1, $2)`,
      [demoUserId, demoCarId]
    )

    await client.query('COMMIT')
    console.log('database reset complete')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('error resetting db', err)
    throw err
  } finally {
    client.release()
  }
}

// allow running directly: node reset.js
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('reset.js')) {
  reset()
    .then(() => {
      console.log('done')
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

export default reset

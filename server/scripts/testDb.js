import { pool } from '../config/database.js'

async function test() {
  const client = await pool.connect()
  try {
    console.log('connected to db, running simple test...')
    const { rows } = await client.query(`SELECT NOW() as now`)
    console.log('db now:', rows[0].now)
    // quick insert test (will not persist if table doesn't exist)
    try {
      const res = await client.query(`INSERT INTO cars (make, model) VALUES ($1, $2) RETURNING id`, ['TestDB', 'X'])
      console.log('insert ok, id=', res.rows[0].id)
    } catch (err) {
      console.error('insert failed (table may not exist):', err.message)
    }
  } finally {
    client.release()
  }
}

test().catch((e) => {
  console.error('db test failed', e)
  process.exit(1)
})

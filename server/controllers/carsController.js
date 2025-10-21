import { pool } from '../config/database.js'

/**
 * Data access functions for the `cars` table.
 * Each function returns the result rows or the affected row where appropriate.
 */

export async function getAllCars() {
  const { rows } = await pool.query(
    `SELECT c.*, u.name AS owner_name, u.email AS owner_email
     FROM cars c
     LEFT JOIN users u ON c.user_id = u.id
     ORDER BY c.created_at DESC`
  )
  return rows
}

export async function getCarById(id) {
  const { rows } = await pool.query(
    `SELECT c.*, u.name AS owner_name, u.email AS owner_email
     FROM cars c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [id]
  )
  return rows[0] || null
}

export async function createCar({ user_id = null, make, model, year = null, price = null, color = null }) {
  const { rows } = await pool.query(
    `INSERT INTO cars (user_id, make, model, year, price, color)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, make, model, year, price, color]
  )
  return rows[0]
}

export async function updateCar(id, { make, model, year, price, color }) {
  // build a dynamic update so partial updates are possible
  const set = []
  const values = []
  let idx = 1

  if (make !== undefined) { set.push(`make = $${idx++}`); values.push(make) }
  if (model !== undefined) { set.push(`model = $${idx++}`); values.push(model) }
  if (year !== undefined) { set.push(`year = $${idx++}`); values.push(year) }
  if (price !== undefined) { set.push(`price = $${idx++}`); values.push(price) }
  if (color !== undefined) { set.push(`color = $${idx++}`); values.push(color) }

  if (set.length === 0) {
    // nothing to update
    return getCarById(id)
  }

  values.push(id)
  const query = `UPDATE cars SET ${set.join(', ')} WHERE id = $${idx} RETURNING *`
  const { rows } = await pool.query(query, values)
  return rows[0] || null
}

export async function deleteCar(id) {
  const { rows } = await pool.query(`DELETE FROM cars WHERE id = $1 RETURNING *`, [id])
  return rows[0] || null
}

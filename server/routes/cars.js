import express from 'express'
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} from '../controllers/carsController.js'

const router = express.Router()

// GET /api/cars - list all cars
router.get('/', async (req, res) => {
  try {
    const rows = await getAllCars()
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list cars' })
  }
})

// GET /api/cars/:id - get one car
router.get('/:id', async (req, res) => {
  try {
    const car = await getCarById(req.params.id)
    if (!car) return res.status(404).json({ error: 'Car not found' })
    res.json(car)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get car' })
  }
})

// POST /api/cars - create a car
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/cars body=', req.body)
    const created = await createCar(req.body)
    res.status(201).json(created)
  } catch (err) {
    console.error('POST /api/cars error:', err)
    // surface the DB error message to help debugging in dev
    res.status(500).json({ error: 'Failed to create car', detail: err.message })
  }
})

// PUT /api/cars/:id - update a car
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateCar(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Car not found' })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update car' })
  }
})

// DELETE /api/cars/:id - delete a car
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteCar(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Car not found' })
    res.json({ success: true, deleted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete car' })
  }
})

export default router

const API_URL = '/api/cars'

export async function fetchAllCars() {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Failed to fetch cars')
  return response.json()
}
export async function fetchCarById(id) {
  const response = await fetch(`${API_URL}/${id}`)
  if (!response.ok) throw new Error('Failed to fetch car')
  return response.json()
}
export async function createNewCar(carData) {
  const response = await fetch(API_URL, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  })
  if (!response.ok) throw new Error('Failed to create car')
  return response.json()
}
export async function updateCarById(id, carData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
  })
  if (!response.ok) throw new Error('Failed to update car')
  return response.json()
}
export async function deleteCarById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete car')
  return response.json()
}

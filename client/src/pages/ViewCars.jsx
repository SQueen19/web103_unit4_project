import React, { useEffect, useState } from 'react'
import '../App.css'
import { fetchAllCars, deleteCarById } from '../services/CarsAPI'
import { Link, useNavigate } from 'react-router-dom'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        let mounted = true
        setLoading(true)
        fetchAllCars()
            .then((rows) => mounted && setCars(rows))
            .catch((err) => mounted && setError(err.message))
            .finally(() => mounted && setLoading(false))
        return () => { mounted = false }
    }, [])

    async function onDelete(id) {
        if (!confirm('Delete this car?')) return
        try {
            await deleteCarById(id)
            setCars((c) => c.filter((x) => x.id !== id))
        } catch (err) {
            alert('Failed to delete')
        }
    }

    return (
        <div className='page view-cars'>
            <h1>{title || 'Custom Cars'}</h1>

            {loading && <p>Loading...</p>}
            {error && <p className='error'>{error}</p>}

            {!loading && !error && (
                <ul className='car-list'>
                    {cars.map((car) => (
                        <li key={car.id} className='car-item'>
                            <div className='car-main'>
                                <strong>{car.make} {car.model}</strong>
                                <div className='car-actions'>
                                    <button onClick={() => navigate(`/customcars/${car.id}`)}>View</button>
                                    <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
                                    <button onClick={() => onDelete(car.id)}>Delete</button>
                                </div>
                            </div>
                            <div className='car-meta'>
                                <span>{car.year}</span>
                                <span> - {car.price ? `$${car.price}` : ''}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}

export default ViewCars
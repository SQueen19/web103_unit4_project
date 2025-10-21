import React, { useEffect, useState } from 'react'
import '../App.css'
import { fetchCarById } from '../services/CarsAPI'
import { useParams, Link, useNavigate } from 'react-router-dom'

const CarDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetchCarById(id)
            .then((c) => setCar(c))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p>Loading...</p>
    if (error) return <p className='error'>{error}</p>
    if (!car) return <p>Not found</p>

    return (
        <div className='page car-details'>
            <h1>{title || `${car.make} ${car.model}`}</h1>
            <div className='details'>
                <p><strong>Make:</strong> {car.make}</p>
                <p><strong>Model:</strong> {car.model}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Price:</strong> {car.price ? `$${car.price}` : 'N/A'}</p>
            <p><strong>Color:</strong> {car.color}</p>
                <p><strong>Owner:</strong> {car.owner_name || 'Unknown'}</p>
            </div>
            <div className='detail-actions'>
                <button onClick={() => navigate(`/edit/${car.id}`)}>Edit</button>
                <button onClick={() => navigate('/customcars')}>Back to list</button>
            </div>
        </div>
    )
}

export default CarDetails
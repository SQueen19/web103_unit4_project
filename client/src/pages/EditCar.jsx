import React, { useEffect, useState } from 'react'
import '../App.css'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCarById, updateCarById } from '../services/CarsAPI'
import { getColorValue, isOtherColor, isHexColor } from '../utils/colorHelpers'

const EditCar = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
        const [form, setForm] = useState({ make: '', model: '', year: '', price: '', color: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCarById(id)
            .then((c) => {
                setForm({
                    make: c.make || '',
                    model: c.model || '',
                    year: c.year || '',
                    price: c.price || '',
                color: c.color || ''
                })
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    function onChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function setColorValue(val) {
        setForm({ ...form, color: val })
    }

    async function onSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            const payload = {
                make: form.make,
                model: form.model,
                year: form.year ? Number(form.year) : null,
                price: form.price ? Number(form.price) : null,
            color: form.color
            }
            await updateCarById(id, payload)
            navigate(`/customcars/${id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className='page edit-car'>
            <h1>{title || 'Edit Car'}</h1>
            <form onSubmit={onSubmit} className='car-form'>
                <label>
                    Make
                    <input name='make' value={form.make} onChange={onChange} required />
                </label>

                <label>
                    Model
                    <input name='model' value={form.model} onChange={onChange} required />
                </label>

                <label>
                    Year
                    <input name='year' value={form.year} onChange={onChange} type='number' />
                </label>

                <label>
                    Price
                    <input name='price' value={form.price} onChange={onChange} type='number' step='0.01' />
                </label>

                                <label>
                                    Color
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                                        <select
                                            name='color'
                                            value={isHexColor(form.color) ? 'Other' : form.color}
                                            onChange={onChange}
                                            style={form.color ? { flex: 1, width: '100%', backgroundImage: `linear-gradient(to right, ${getColorValue(form.color)} 0 24px, rgba(0,0,0,0) 24px)`, backgroundRepeat: 'no-repeat', paddingLeft: 36 } : { flex: 1, width: '100%', paddingLeft: 8 }}
                                        >
                                            <option value=''>Select color</option>
                                            <option value='Red'>Red</option>
                                            <option value='Blue'>Blue</option>
                                            <option value='Green'>Green</option>
                                            <option value='Yellow'>Yellow</option>
                                            <option value='Purple'>Purple</option>
                                            <option value='Orange'>Orange</option>
                                            <option value='Black'>Black</option>
                                            <option value='White'>White</option>
                                            <option value='Silver'>Silver</option>
                                            <option value='Other'>Other</option>
                                        </select>

                                        {/* swatch is shown inside the select via backgroundImage */}
                                    </div>

                                    {isOtherColor(form.color) && (
                                        <input
                                            type='color'
                                            value={isHexColor(form.color) ? form.color : '#000000'}
                                            onChange={(e) => setColorValue(e.target.value)}
                                            style={{ marginTop: 8 }}
                                        />
                                    )}
                                </label>

                <button type='submit' disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    )
}

export default EditCar
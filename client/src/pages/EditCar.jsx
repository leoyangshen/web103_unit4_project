import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// Corrected imports with explicit file extensions
import { getCar, updateCar } from '../services/CarsAPI.js' 
import { calculateTotalPrice } from '../utilities/priceCalculator.js'
import { checkImpossibleCombo } from '../utilities/validation.js'
import '../App.css' // Corrected path to App.css (two levels up)

const EditCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [totalPrice, setTotalPrice] = useState(0)
    const [validationError, setValidationError] = useState('')
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // 1. Fetch existing car data on component load
    useEffect(() => {
        const fetchCar = async () => {
            try {
                const data = await getCar(id)
                setCar(data)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch car for editing:', error)
                navigate('/customcars') // Redirect if car not found
            }
        }
        fetchCar()
    }, [id, navigate])

    // 2. Recalculate price and re-validate whenever car state changes
    useEffect(() => {
        if (car) {
            const price = calculateTotalPrice(car)
            setTotalPrice(price)

            const error = checkImpossibleCombo(car)
            setValidationError(error)
        }
    }, [car])

    const handleChange = (e) => {
        const { name, value } = e.target
        setCar(prevCar => ({
            ...prevCar,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormSubmitted(true)

        if (validationError || car.name.trim() === '') {
            console.error('Validation failed. Cannot save.')
            return
        }
        
        try {
            setIsSaving(true)
            const carData = {
                ...car,
                final_price: totalPrice,
            }
            
            await updateCar(id, carData)
            // Navigate back to the details page after update
            navigate(`/car/${id}`)
        } catch (error) {
            console.error('Failed to update car:', error)
            // Replaced alert() with console.error() as alert() is forbidden
            console.error('Failed to update car configuration. Please check the server status.')
        } finally {
            setIsSaving(false)
        }
    }

    if (loading || !car) {
        return <div className="container loading">Loading car configuration for editing...</div>
    }

    const isSubmitDisabled = validationError || car.name.trim() === '' || isSaving

    return (
        <div className="container">
            <h1 className="title">Edit Configuration: {car.name}</h1>
            <h2 className="subtitle">Current Price: ${totalPrice.toLocaleString()}</h2>
            
            <form onSubmit={handleSubmit} className="custom-form">
                
                <label htmlFor="name">Car Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={car.name}
                    onChange={handleChange}
                    placeholder="e.g., Lightning Bolt"
                    required
                />
                
                {/* Exterior Color */}
                <label htmlFor="exterior_color">Exterior Color</label>
                <select
                    id="exterior_color"
                    name="exterior_color"
                    value={car.exterior_color}
                    onChange={handleChange}
                >
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Matte Black">Matte Black (+$3,000)</option>
                </select>

                {/* Rim Style */}
                <label htmlFor="rim_style">Rim Style</label>
                <select
                    id="rim_style"
                    name="rim_style"
                    value={car.rim_style}
                    onChange={handleChange}
                >
                    <option value="Standard Alloy">Standard Alloy</option>
                    <option value="Sport">Sport (+$1,500)</option>
                    <option value="Aero Carbon">Aero Carbon (+$5,000)</option>
                </select>

                {/* Interior Package */}
                <label htmlFor="interior_package">Interior Package</label>
                <select
                    id="interior_package"
                    name="interior_package"
                    value={car.interior_package}
                    onChange={handleChange}
                >
                    <option value="Standard Cloth">Standard Cloth</option>
                    <option value="Premium Leather">Premium Leather (+$2,000)</option>
                </select>

                {/* Validation Error Message */}
                {(formSubmitted || validationError) && validationError && (
                    <p className="error-message">
                        🚨 {validationError}
                    </p>
                )}

                <button type="submit" disabled={isSubmitDisabled}>
                    {isSaving ? 'Saving...' : `Update Configuration for $${totalPrice.toLocaleString()}`}
                </button>
                <button type="button" onClick={() => navigate(`/car/${id}`)} className="cancel-button">
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default EditCar


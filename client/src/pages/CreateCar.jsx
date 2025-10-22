import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/CarsAPI.js'
// NOTE: Make sure these utility imports are correct for your setup
import { calculateTotalPrice } from '../utilities/priceCalculator.js' 
import { checkImpossibleCombo } from '../utilities/validation.js'
import '../App.css'

const CreateCar = () => {
    const navigate = useNavigate()

    // State to track if the user has started configuration
    const [isConfiguring, setIsConfiguring] = useState(false)
    
    // State for the car's customizable features
    const [car, setCar] = useState({
        name: '',
        exterior_color: 'Red',
        rim_style: 'Standard Alloy',
        interior_package: 'Standard Cloth',
    })
    
    const [totalPrice, setTotalPrice] = useState(0) 
    const [validationError, setValidationError] = useState('')
    const [formSubmitted, setFormSubmitted] = useState(false)

    // --- Core Logic: Price Calculation and Validation ---
    // Runs whenever the 'car' object changes
    useEffect(() => {
        // Calculate Price
        const price = calculateTotalPrice(car)
        setTotalPrice(price)

        // Run Validation Check
        const error = checkImpossibleCombo(car)
        setValidationError(error)
    }, [car])

    // --- Handle Input Changes ---
    const handleChange = (e) => {
        const { name, value } = e.target
        setCar(prevCar => ({
            ...prevCar,
            [name]: value,
        }))
    }

    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormSubmitted(true)

        // 1. Pre-submission Checks
        if (validationError) {
            console.error('Validation failed:', validationError)
            return
        }
        
        // 2. CRITICAL FIX: Re-calculate price on submit and ensure it's a number
        let priceOnSubmit = calculateTotalPrice(car) 
        
        // Defensive check: Ensure price is a number and not zero
        priceOnSubmit = Number(priceOnSubmit)

        // Ensure name is not empty (required by DB)
        if (car.name.trim() === '') {
            setValidationError('Car name cannot be empty.')
            return
        }

        // NEW CHECK: Prevent submission if price is zero or invalid
        if (isNaN(priceOnSubmit) || priceOnSubmit <= 0) {
            setValidationError('Price must be greater than zero. Check configurations.')
            return
        }

        try {
            // 3. Construct Payload
            const carData = {
                ...car,
                final_price: priceOnSubmit, // Use the fresh calculated price (now guaranteed number)
            }
            
            // 4. API Call
            const newCar = await createCar(carData)
            
            // 5. Success & Navigation
            // This will only run if the POST returns the new car object with an ID
            navigate(`/customcars/${newCar.id}`) 
        } catch (error) {
            console.error('Failed to create car:', error)
            // Show a user-friendly error message
            alert('Failed to save car configuration. Please ensure the server is running and try again.') 
        }
    }

    // Determine if the submit button should be disabled
    const isSubmitDisabled = validationError || car.name.trim() === '' || totalPrice <= 0

    // --- Conditional Rendering ---
    if (!isConfiguring) {
        // ... (Landing Page JSX remains the same)
        return (
            <div className="landing-view">
                <div className="landing-content">
                    {/* Placeholder SVG Car Image or high-impact text */}
                    <h1>The Bolt Bucket</h1>
                    <p className="subtitle">Design your dream electric car now. Total freedom. Zero emissions.</p>

                    {/* Placeholder image representation */}
                    <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="car-svg">
                        <rect x="50" y="100" width="300" height="50" rx="10" fill="#333" />
                        <rect x="100" y="80" width="200" height="30" rx="5" fill="#4A4A4A" />
                        <circle cx="100" cy="150" r="15" fill="#111" stroke="#FFD700" strokeWidth="3"/>
                        <circle cx="300" cy="150" r="15" fill="#111" stroke="#FFD700" strokeWidth="3"/>
                        <path d="M110 100 L130 80 L270 80 L290 100 Z" fill="#666" />
                        <text x="200" y="130" fontSize="24" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">BOLT</text>
                    </svg>

                    <button className="primary" onClick={() => setIsConfiguring(true)}>
                        Start Customization
                    </button>
                    <a href="/customcars" role="button" className="secondary">View Existing Cars</a>
                </div>
            </div>
        )
    }

    // Configuration form view
    return (
        <div className="container configuration-view">
            <h1 className="title">Configure Your Custom Car</h1>
            <h2 className="subtitle">Total Price: ${totalPrice.toLocaleString()}</h2>
            
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

                {/* Rim Style (Implies Drive Type) */}
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
                    {isSubmitDisabled ? 'Fix Configuration to Save' : `Save Configuration for $${totalPrice.toLocaleString()}`}
                </button>
            </form>
        </div>
    )
}

export default CreateCar


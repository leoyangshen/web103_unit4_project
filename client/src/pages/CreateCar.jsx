import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateTotalPrice } from '../utilities/priceCalculator';
import { checkImpossibleCombo } from '../utilities/validation';
import { createCar } from '../services/CarsAPI';
import '../App.css';

const CreateCar = () => {
    const navigate = useNavigate();

    // CRITICAL FIX: Include required DB fields in the state
    const [car, setCar] = useState({
        name: 'My Custom Car',
        exteriorColor: 'Midnight Silver',
        rimStyle: 'Standard Alloy',
        interiorPackage: 'Standard Cloth',
        // Database required fields (not from user input)
        baseType: 'Bolt Bucket',
        submittedBy: 'Guest Designer', 
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [validationError, setValidationError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    // --- EFFECT 1: Calculate Price and Check Impossible Combo ---
    useEffect(() => {
        // Map current state to the format the utilities expect
        const calculatorOptions = {
            exteriorColor: car.exteriorColor,
            rimStyle: car.rimStyle,
            interiorPackage: car.interiorPackage,
        };

        const price = calculateTotalPrice(calculatorOptions);
        setTotalPrice(price);
        
        // Check for impossible combo
        const isImpossible = checkImpossibleCombo(calculatorOptions);
        
        if (isImpossible) {
            setValidationError('Impossible combination: Premium features require Premium or Aero Carbon Rims.');
        } else {
            setValidationError('');
        }
    }, [car]); // Recalculate whenever 'car' state changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCar(prevCar => ({
            ...prevCar,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        // Client-side validation check
        if (!car.name || validationError) {
            return;
        }

        // CRITICAL FIX: Map client-side camelCase state to server-side snake_case DB columns
        const newCarData = {
            item_name: car.name,
            exterior_color: car.exteriorColor,
            rim_style: car.rimStyle,
            interior_package: car.interiorPackage,
            
            // Required DB fields
            base_type: car.baseType,
            submitted_by: car.submittedBy,
            
            // Final calculated price
            total_price: totalPrice,
        };

        try {
            const result = await createCar(newCarData);
            
            if (result && !result.error) {
                // Navigate to the newly created car's detail page
                navigate(`/customcars/${result.id}`);
            } else {
                console.error("Creation failed with server error:", result.error);
                setValidationError(`Failed to create car: ${result.error || 'Check server logs.'}`);
            }
        } catch (error) {
            console.error('Network or unknown creation error:', error);
            setValidationError('A network error occurred. Could not create car.');
        }
    };
    
    // Disable submit button if name is empty or validation error exists
    const isSubmitDisabled = !car.name || !!validationError;

    return (
        <div className="create-car-page">
            <hgroup>
                <h2>Configure Your Bolt Bucket</h2>
                <p>Build your dream car, one component at a time.</p>
            </hgroup>
            
            <form onSubmit={handleSubmit}>
                {/* Configuration Name - REQUIRED */ }
                <label htmlFor="name">Configuration Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Fancy Smancy"
                    value={car.name}
                    onChange={handleChange}
                    required
                />

                {/* Exterior Color */}
                <label htmlFor="exteriorColor">Exterior Color</label>
                <select
                    id="exteriorColor"
                    name="exteriorColor"
                    value={car.exteriorColor}
                    onChange={handleChange}
                >
                    <option value="Midnight Silver">Midnight Silver (Base)</option>
                    <option value="Obsidian Black">Obsidian Black (+$1,000)</option>
                    <option value="Solar Red">Solar Red (+$2,500)</option>
                </select>

                {/* Rim Style */}
                <label htmlFor="rimStyle">Rim Style</label>
                <select
                    id="rimStyle"
                    name="rimStyle"
                    value={car.rimStyle}
                    onChange={handleChange}
                >
                    <option value="Standard Alloy">Standard Alloy (Base)</option>
                    <option value="Sport">Sport (+$1,500)</option>
                    <option value="Aero Carbon">Aero Carbon (+$5,000)</option>
                </select>

                {/* Interior Package */}
                <label htmlFor="interiorPackage">Interior Package</label>
                <select
                    id="interiorPackage"
                    name="interiorPackage"
                    value={car.interiorPackage}
                    onChange={handleChange}
                >
                    <option value="Standard Cloth">Standard Cloth (Base)</option>
                    <option value="Premium Leather">Premium Leather (+$2,000)</option>
                </select>
                
                <hr/>
                
                {/* Total Price Display */}
                <div className="total-price-display">
                    <strong>Total Price:</strong> 
                    <span className="price-tag">${totalPrice.toLocaleString()}</span>
                </div>

                {/* Validation Error Message */}
                {(formSubmitted || validationError) && validationError && (
                    <p className="error-message">
                        🚨 {validationError}
                    </p>
                )}

                <button type="submit" disabled={isSubmitDisabled}>
                    {isSubmitDisabled ? 'Fix Configuration to Create' : 'Create New Car'}
                </button>
            </form>
        </div>
    );
};

export default CreateCar;


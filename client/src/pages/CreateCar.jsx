import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCar } from '../services/CarsAPI.js';
import { calculateTotalPrice } from '../utilities/priceCalculator.js';
import { checkImpossibleCombo } from '../utilities/validation.js'; 
import '../App.css';

// Define the robust initial state with default selection values
const INITIAL_CAR_STATE = {
    // Car Name is intentionally empty, as it's the only truly required field on submit
    item_name: '', 
    // Set all selection fields to their base option to prevent 'undefined' errors
    exterior_color: 'Midnight Silver',
    rim_style: 'Standard Alloy',
    interior_package: 'Standard Cloth',
    base_type: 'Bolt Bucket', 
    submitted_by: 'Guest Designer', 
};


const CreateCar = () => {
    const navigate = useNavigate();

    // Initialize state with the robust defaults
    const [car, setCar] = useState(INITIAL_CAR_STATE);
    
    const [totalPrice, setTotalPrice] = useState(0);
    const [validationError, setValidationError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    // --- EFFECT: Recalculate Price, Validate, and Check Submit State ---
    useEffect(() => {
        console.log("DEBUG: EFFECT (Price/Validation) is running...");
        
        const calculatorOptions = {
            item_name: car.item_name,
            exterior_color: car.exterior_color,
            rim_style: car.rim_style,
            interior_package: car.interior_package,
        };

        // 1. Calculate new price
        const newPrice = calculateTotalPrice(calculatorOptions);
        setTotalPrice(newPrice);
        console.log("DEBUG: New calculated price:", newPrice);

        // 2. Run validation
        const comboError = checkImpossibleCombo(calculatorOptions);
        setValidationError(comboError);
        console.log("DEBUG: Validation result received by component:", comboError);

        // 3. Update submit button state
        // Disabled if there is a combo error OR if the item_name is empty/whitespace
        const isDisabled = !!comboError || !car.item_name.trim();
        setIsSubmitDisabled(isDisabled);
        console.log("DEBUG: Submit button disabled state:", isDisabled);

    // Runs every time the 'car' state (inputs) changes
    }, [car]); 


    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`DEBUG: Input changed - Name: ${name}, Value: ${value}`);
        // This setCar update triggers the EFFECT above
        setCar(prevCar => ({
            ...prevCar,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        console.log("DEBUG: handleSubmit initiated.");

        if (isSubmitDisabled) {
            console.log("DEBUG: Submission blocked by isSubmitDisabled state.");
            return;
        }

        try {
            const newCarData = {
                item_name: car.item_name.trim(),
                exterior_color: car.exterior_color,
                rim_style: car.rim_style,
                interior_package: car.interior_package,
                base_type: car.base_type, 
                submitted_by: car.submitted_by, 
                total_price: totalPrice.toFixed(2), // Send the final calculated price
            };
            
            console.log("DEBUG: Sending POST Payload:", newCarData);
            const result = await createCar(newCarData);

            if (result && result.error) {
                console.error("DEBUG: API returned error on POST:", result.error);
                setValidationError(result.error);
                return;
            }

            console.log("DEBUG: Creation successful. Navigating to list page.");
            navigate('/customcars');

        } catch (error) {
            console.error("Failed to create car:", error);
            setValidationError('An unexpected error occurred during creation.');
        }
    };

    // --- Render ---
    const carNameError = formSubmitted && !car.item_name.trim() ? 'Car Name is required.' : '';


    return (
        <div className="create-car-container">
            <hgroup>
                <h2>Configure Your Bolt Bucket</h2>
                <p>Build your dream car, one component at a time.</p>
            </hgroup>
            
            <form onSubmit={handleSubmit} className="custom-form">
                 {/* Car Name */}
                <label htmlFor="item_name">Configuration Name</label>
                <input
                    type="text"
                    id="item_name"
                    name="item_name"
                    placeholder="e.g., Top of the Line"
                    value={car.item_name}
                    onChange={handleChange}
                    required
                    aria-invalid={!!carNameError}
                />
                {carNameError && <p className="error-message">{carNameError}</p>}


                {/* Exterior Color */}
                <label htmlFor="exterior_color">Exterior Color</label>
                <select
                    id="exterior_color"
                    name="exterior_color"
                    value={car.exterior_color}
                    onChange={handleChange}
                >
                    <option value="Midnight Silver">Midnight Silver (Base)</option>
                    <option value="Deep Blue">Deep Blue (+$1,000)</option>
                    <option value="Cherry Red">Cherry Red (+$2,500)</option>
                    <option value="Solar Red">Solar Red (+$2,500)</option>
                </select>

                {/* Rim Style */}
                <label htmlFor="rim_style">Rim Style</label>
                <select
                    id="rim_style"
                    name="rim_style"
                    value={car.rim_style}
                    onChange={handleChange}
                >
                    <option value="Standard Alloy">Standard Alloy (Base)</option>
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
                    <option value="Standard Cloth">Standard Cloth (Base)</option>
                    <option value="Premium Leather">Premium Leather (+$2,000)</option>
                </select>
                
                {/* --- RUNNING TALLY DISPLAY --- */}
                <div className="final-price-tally">
                    <strong>Total Price:</strong> 
                    <span className="price-tag">${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {/* -------------------------------------------------- */}


                {/* Validation Error Message */}
                {/* Show validation error if submission was attempted OR if there is an active combo error */}
                {validationError && (
                    <p className="error-message">
                        🚨 {validationError}
                    </p>
                )}

                <button type="submit" disabled={isSubmitDisabled}>
                    {isSubmitDisabled ? 'Fix Configuration to Create' : 'Create Car'}
                </button>
            </form>

            <button 
                onClick={() => navigate('/customcars')} 
                className="outline back-to-details-button"
            >
                Back to All Cars
            </button>
        </div>
    );
};

export default CreateCar;


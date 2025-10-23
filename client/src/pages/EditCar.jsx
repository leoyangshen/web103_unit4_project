import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCar, updateCar } from '../services/CarsAPI';
import { calculateTotalPrice } from '../utilities/priceCalculator';
import { checkImpossibleCombo } from '../utilities/validation'; 
import '../App.css';

// Default configuration to prevent validation errors on initial render
const INITIAL_CAR_STATE = {
    item_name: 'econo box', // Must have a name to pass validation
    exterior_color: 'Midnight Silver',
    rim_style: 'Standard Alloy',
    interior_package: 'Standard Cloth',
    base_type: 'Bolt Bucket', 
    submitted_by: 'Guest Designer', 
};


const EditCar = () => {
    const { customItemId } = useParams(); 
    const navigate = useNavigate();

    // Initialize state with non-empty defaults to pass validation before fetch
    const [car, setCar] = useState(INITIAL_CAR_STATE);
    
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [validationError, setValidationError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);


    // --- EFFECT 1: Fetch Existing Data on Load (Reads from DB) ---
    useEffect(() => {
        const fetchExistingCar = async () => {
            console.log("DEBUG: EFFECT 1 (Fetch) is running...");

            if (!customItemId) return;
            try {
                setLoading(true);
                const data = await getCar(customItemId);
                
                if (data) {
                    // Overwrite the INITIAL_CAR_STATE with the fetched data
                    setCar({
                        item_name: data.item_name,
                        exterior_color: data.exterior_color,
                        rim_style: data.rim_style,
                        interior_package: data.interior_package,
                        base_type: data.base_type || INITIAL_CAR_STATE.base_type, 
                        submitted_by: data.submitted_by || INITIAL_CAR_STATE.submitted_by, 
                    });
                    console.log("DEBUG: Initial car data fetched and set:", data.item_name);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching car for edit:", err);
                setLoading(false);
            }
        };
        fetchExistingCar();
    }, [customItemId]);


    // --- EFFECT 2: Recalculate Price, Validate, and Check Submit State (Runs on *every* state change) ---
    useEffect(() => {
        console.log("DEBUG: EFFECT 2 (Price/Validation) is running...");
        
        if (loading) {
            console.log("DEBUG: ...Skipped price/validation because loading is true.");
            // If still loading, we use the default state for now, but prevent submission
            return;
        }

        const calculatorOptions = {
            item_name: car.item_name,
            exterior_color: car.exterior_color,
            rim_style: car.rim_style,
            interior_package: car.interior_package,
        };

        console.log("DEBUG: Config sent to utilities:", calculatorOptions);

        // 1. Calculate new price
        const newPrice = calculateTotalPrice(calculatorOptions);
        setTotalPrice(newPrice);
        console.log("DEBUG: New calculated price:", newPrice);

        // 2. Run validation (Calls validation.js)
        const comboError = checkImpossibleCombo(calculatorOptions);
        setValidationError(comboError);
        console.log("DEBUG: Validation result received by component:", comboError);

        // 3. Update submit button state
        const isDisabled = !!comboError || newPrice === 0 || !car.item_name.trim();
        setIsSubmitDisabled(isDisabled);
        console.log("DEBUG: Submit button disabled state:", isDisabled);

    // CRITICAL DEPENDENCY: Runs every time the 'car' state (inputs) or 'loading' state changes
    }, [car, loading]); 


    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`DEBUG: Input changed - Name: ${name}, Value: ${value}`);
        // This setCar update triggers EFFECT 2 above
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
            const updatedCarData = {
                item_name: car.item_name.trim(),
                exterior_color: car.exterior_color,
                rim_style: car.rim_style,
                interior_package: car.interior_package,
                base_type: car.base_type, 
                submitted_by: car.submitted_by, 
                total_price: totalPrice.toFixed(2), 
            };
            
            console.log("DEBUG: Sending PUT Payload:", updatedCarData);
            const result = await updateCar(customItemId, updatedCarData);

            if (result && result.error) {
                console.error("DEBUG: API returned error on PUT:", result.error);
                setValidationError(result.error);
                return;
            }

            console.log("DEBUG: Update successful. Navigating to details page.");
            navigate(`/customcars/${customItemId}`);

        } catch (error) {
            console.error("Failed to update car:", error);
            setValidationError('An unexpected error occurred during update.');
        }
    };

    if (loading) {
        return <p aria-busy="true">Loading car details for editing...</p>;
    }
    
    const carNameError = formSubmitted && !car.item_name.trim() ? 'Car Name is required.' : '';


    return (
        <div className="edit-car-container">
            <hgroup>
                <h2>Edit Configuration: {car.item_name}</h2>
            </hgroup>
            
            <form onSubmit={handleSubmit} className="custom-form">
                 {/* Car Name */}
                <label htmlFor="item_name">Car Name</label>
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


                {/* Exterior Color - CLEANED UP VALUES */}
                <label htmlFor="exterior_color">Exterior Color</label>
                <select
                    id="exterior_color"
                    name="exterior_color"
                    value={car.exterior_color}
                    onChange={handleChange}
                >
                    <option value="Midnight Silver">Midnight Silver</option>
                    <option value="Deep Blue">Deep Blue (+$1,000)</option>
                    <option value="Cherry Red">Cherry Red (+$2,500)</option>
                    <option value="Solar Red">Solar Red (+$2,500)</option>
                </select>

                {/* Rim Style - CLEANED UP VALUES */}
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

                {/* Interior Package - CLEANED UP VALUES */}
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
                
                {/* --- RUNNING TALLY DISPLAY --- */}
                <div className="final-price-tally">
                    <strong>Current Total Price:</strong> 
                    <span className="price-tag"> ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {/* -------------------------------------------------- */}


                {/* Validation Error Message */}
                {(formSubmitted || validationError) && validationError && (
                    <p className="error-message">
                        🚨 {validationError}
                    </p>
                )}

                <button type="submit" disabled={isSubmitDisabled}>
                    {isSubmitDisabled ? 'Fix Configuration to Update' : 'Save Changes'}
                </button>
            </form>

            <button 
                onClick={() => navigate('/customcars')} 
                className="outline back-to-details-button"
            >
                Cancel and Back to List
            </button>
        </div>
    );
};

export default EditCar;


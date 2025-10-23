import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// NOTE: Assuming window.confirm is still allowed for a quick prototype, 
// though a custom modal is better practice in React.
import { getCar, deleteCar } from '../services/CarsAPI'; 
import '../App.css';

const CarDetails = () => {
    // CRITICAL FIX: Use the parameter name defined in App.jsx
    const { customItemId } = useParams(); 
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- CRITICAL FIX: Add check for customItemId ---
    useEffect(() => {
        // Only attempt to fetch if the ID is actually present in the URL params
        if (customItemId) {
            fetchCarDetails(customItemId);
        } else {
            setError('No car ID provided.');
            setLoading(false);
        }
    }, [customItemId]); // Dependency on the ID from the URL

    const fetchCarDetails = async (id) => {
        try {
            setLoading(true);
            // This is the call that was failing because 'id' was undefined
            const data = await getCar(id); 
            
            if (data && !data.error) {
                setCar(data);
                setError(null);
            } else {
                setError('Car not found or server error during fetch.');
                setCar(null);
            }
        } catch (err) {
            console.error(`Error fetching car with ID ${id}:`, err);
            setError('Failed to load car details. Check server connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        // Use a custom modal or simple confirmation (since alerts are disallowed)
        if (window.confirm(`Are you sure you want to delete the car: ${car.item_name}?`)) {
            try {
                // Call the API function to DELETE the car
                const result = await deleteCar(id);
                
                if (result.success) {
                    // Navigate back to the list of cars after successful deletion
                    navigate('/customcars');
                } else {
                    setError('Failed to delete car. Check server logs.');
                }
            } catch (err) {
                console.error(`Error deleting car with ID ${id}:`, err);
                setError('A network error occurred. Could not delete car.');
            }
        }
    };

    // --- Loading, Error, and Not Found States ---
    if (loading) {
        return <p aria-busy="true">Loading car details...</p>;
    }

    if (error) {
        return <p className="error-message">Error: {error}</p>;
    }

    if (!car) {
        return <p className="error-message">Car configuration not found.</p>;
    }

    // --- Main Display ---
    return (
        <div className="car-details-page">
            <hgroup>
                <h1>{car.item_name}</h1>
                <p>Configured by {car.submitted_by} ({car.base_type})</p>
            </hgroup>

            <article className="details-summary">
                <div className="detail-row">
                    <strong>Exterior Color:</strong> <span>{car.exterior_color}</span>
                </div>
                <div className="detail-row">
                    <strong>Rim Style:</strong> <span>{car.rim_style}</span>
                </div>
                <div className="detail-row">
                    <strong>Interior Package:</strong> <span>{car.interior_package}</span>
                </div>
                <hr />
                <div className="detail-row final-price">
                    <strong>Total Price:</strong> 
                    {/* CRITICAL: Use toLocaleString for currency formatting */ }
                    <span className="price-tag">${parseFloat(car.total_price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </article>

            <footer className="action-buttons">
                <button 
                    onClick={() => navigate(`/customcars/${car.id}/edit`)} 
                    className="secondary"
                >
                    Edit Configuration
                </button>
                <button 
                    onClick={() => handleDelete(car.id)} 
                    className="delete-button"
                >
                    Delete Car
                </button>
                <button 
                    onClick={() => navigate('/customcars')} 
                    className="outline"
                >
                    Back to All Cars
                </button>
            </footer>
        </div>
    );
};

export default CarDetails;


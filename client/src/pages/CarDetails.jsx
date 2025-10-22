import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCar, deleteCar } from '../services/CarsAPI';
import '../App.css';

const CarDetails = () => {
    // CRITICAL FIX: Use the parameter name defined in App.jsx
    const { customItemId } = useParams(); 
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
            setCar(data);
            setError(null);
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
                await deleteCar(id);
                // Redirect back to the view all cars page after successful deletion
                navigate('/customcars'); 
            } catch (error) {
                console.error('Error deleting car:', error);
                // Use a visible message instead of an alert
                setError('Failed to delete car. Check server console.');
            }
        }
    };

    if (loading) {
        return <div className="container loading">Loading car details...</div>;
    }

    if (error) {
        return <div className="container error-state">Error: {error}</div>;
    }

    if (!car) {
        return <div className="container error-state">Car not found.</div>;
    }

    return (
        <div className="container car-details-container">
            <hgroup>
                <h1>{car.item_name}</h1>
                <p>Configured on: {new Date(car.created_at).toLocaleDateString()}</p>
            </hgroup>

            <article className="car-summary">
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
                    <span className="price-tag">${car.total_price.toLocaleString()}</span>
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


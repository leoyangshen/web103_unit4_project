import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCars, deleteCar } from '../services/CarsAPI';
import '../App.css';

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCars()
    }, [])

    const fetchCars = async () => {
        try {
            setLoading(true)
            const data = await getAllCars()
            setCars(data)
            setError(null)
        } catch (err) {
            console.error('Error fetching cars:', err)
            setError('Failed to load cars. Please ensure the server is running.')
        } finally {
            setLoading(false)
        }
    }

    // Handles navigation to the details page, which now includes the Edit and Delete options
    const handleViewCar = (id) => {
        navigate(`/customcars/${id}`)
    }

    const handleDelete = async (id, name) => {
        // Use a simple confirmation since window.confirm() is typically discouraged
        if (window.confirm(`Are you sure you want to delete the car: ${name}?`)) {
            try {
                await deleteCar(id);
                // After successful deletion, refresh the list
                fetchCars(); 
            } catch (err) {
                console.error('Error deleting car:', err);
                setError(`Failed to delete car ID ${id}.`);
            }
        }
    };
    
    // --- Empty State View ---
    if (!loading && cars && cars.length === 0)
    {
	return (
	    <div className="container empty-state">
		<hgroup>
                    <h2>No custom cars found. Start creating one!</h2>
                </hgroup>
            
                <button
                    className="primary"
                    onClick={() => navigate('/')} 
                >
                    {/* CRITICAL FIX 1: Rename the button for the empty state */}
                    Go to Home (Create Car)
                </button>
            </div>
        )
    }

    if (loading) {
        return <div className="container"><h2>Loading Configurations...</h2></div>
    }

    if (error) {
        return <div className="container error-message"><h2>Error!</h2><p>{error}</p></div>
    }
    
    // --- Main List View ---
    return (
        <div className="container view-cars-page">
            <header className="page-header">
                <hgroup>
                    <h2>All Custom Configurations</h2>
                </hgroup>
                
                {/* CRITICAL FIX 2: Rename the button in the main view */}
                <button
                    className="primary"
                    onClick={() => navigate('/')} 
                >
                    Home (Create Car)
                </button>
            </header>

            <div className="car-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Color</th>
                            <th>Rims</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(car => (
                            <tr key={car.id}>
                                <td>{car.id}</td>
                                <td>{car.item_name}</td>
                                <td>{car.exterior_color}</td>
                                <td>{car.rim_style}</td>
                                <td className="price-col">${car.total_price.toLocaleString()}</td>
                                <td className="actions-col">
                                    <button 
                                        onClick={() => navigate(`/customcars/${car.id}/edit`)} 
                                        className="edit-button small-button"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleViewCar(car.id)} 
                                        className="view-button small-button"
                                    >
                                        View
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(car.id, car.item_name)} 
                                        className="delete-button small-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViewCars


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Link is removed from import
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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await deleteCar(id);
                fetchCars(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Failed to delete car. Check server console.');
            }
        }
    };
    
    // CRITICAL: This path must match your App.jsx route definition: /customcars/:id
    const handleCarClick = (id) => {
        // We confirmed this needs to be /customcars/${id} to match your router setup
        navigate(`/customcars/${id}`)
    }

    if (!loading && cars && cars.length ===0 )
    {
	return (
	    <div className="container empty-state">
		<hgroup>
                    <h2>No custom cars found. Start creating one!</h2>
                </hgroup>
            
            {/* ATTACH THE ONCLICK HANDLER HERE */}
                <button
                    className="primary"
                    onClick={() => navigate('/')} 
                >
                    Configure Your First Car
                </button>
            </div>
        )
    }

    if (loading) {
        return <div className="container loading">Loading custom configurations...</div>
    }

    if (error) {
        return <div className="container error-state">{error}</div>
    }

    return (
        <div className="container">
            <h1 className="title">All Custom Configurations</h1>

            <button onClick={() => navigate('/')} className="create-button">
        	Home        
            </button>

            {cars.length === 0 ? (
                <div className="empty-state">
                    <p>No custom cars found. Start creating one!</p>
                    <button onClick={() => navigate('/')} className="button">
                        Configure Your First Car
                    </button>
                </div>
            ) : (
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
                                    <td>
                                        {/* Use button for details */}
                                        <button 
                                            onClick={() => handleCarClick(car.id)} 
                                            className="link-style-button"
                                            style={{ textDecoration: 'underline' }}
                                        >
                                            {car.item_name}
                                        </button>
                                    </td>
                                    <td>{car.exterior_color}</td>
                                    <td>{car.rim_style}</td>
                                    <td className="price-col">${car.total_price.toLocaleString()}</td>
                                    <td>
                                        {/* Delete Button */}
                                        <button 
                                            onClick={() => handleDelete(car.id)} 
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                        {/* You'll add the Edit link here later */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ViewCars


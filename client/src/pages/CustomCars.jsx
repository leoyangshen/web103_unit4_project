import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCars, deleteCar } from '../services/CarsAPI.js'; // FIX: Added explicit .js extension
import '../App.css'; // For general styling

// Functional component for displaying and managing custom car configurations
const CustomCars = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'item_name', direction: 'ascending' });
    const [error, setError] = useState(null);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                // Note: getAllCars and deleteCar assume to return/accept JSON data that matches the PostgreSQL schema
                const data = await getAllCars();
                if (data) {
                    setCars(data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching custom cars:", err);
                setError("Failed to load car list. Please check the API service.");
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    // --- Sorting Logic ---
    const sortedCars = React.useMemo(() => {
        if (!cars || cars.length === 0) return [];
        
        let sortableItems = [...cars];
        sortableItems.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Convert total_price to number for correct numerical sorting
            if (sortConfig.key === 'total_price') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else {
                // Ensure strings are compared case-insensitively
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [cars, sortConfig]);

    // Handles the request to change the sort column or direction
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Helper to render the sort icon (Up/Down arrow)
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return ' '; // Empty space if not currently sorted by this key
        }
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };

    // --- Action Handlers ---
    const handleViewDetails = (id) => {
        // Navigate to the details page, assuming the route uses the car's primary key (id)
        navigate(`/customcars/${id}`); 
    };

    const handleDelete = async (id, name) => {
        // IMPORTANT: Use a custom modal or confirmation UI instead of window.confirm
        const isConfirmed = window.confirm(`Are you sure you want to delete the configuration: ${name}? This cannot be undone.`);

        if (isConfirmed) {
            try {
                await deleteCar(id);
                // Refresh the list by filtering out the deleted car
                setCars(cars.filter(car => car.id !== id));
            } catch (err) {
                console.error("Error deleting car:", err);
                setError(`Failed to delete configuration: ${name}.`);
            }
        }
    };


    if (loading) {
        return (
            <div aria-busy="true" className="p-4 text-center">
                Loading Custom Configurations...
            </div>
        );
    }

    if (error) {
        // Added some basic Picocss/generic classes for error display
        return (
            <div className="error-container">
                <p role="alert">🚨 Error: {error}</p>
            </div>
        );
    }
    
    if (sortedCars.length === 0) {
         return (
            <div className="empty-state-container">
                <h2>No Custom Configurations Found</h2>
                <p>Start designing your Bolt Bucket on the home page to save your first configuration!</p>
                <button onClick={() => navigate('/')}>Go to Designer</button>
            </div>
        );
    }


    return (
        <article>
            <hgroup>
                <h2>My Saved Bolt Bucket Configurations</h2>
                <p>Click on the headers to sort the list by Name or Price.</p>
            </hgroup>
            
            <div className="table-wrapper">
                <table role="grid">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('item_name')} scope="col" className="sortable-header">
                                Configuration Name {getSortIcon('item_name')}
                            </th>
                            <th scope="col">Color</th>
                            <th scope="col">Rims</th>
                            <th scope="col">Interior</th>
                            <th onClick={() => requestSort('total_price')} scope="col" className="sortable-header" style={{ textAlign: 'right' }}>
                                Price {getSortIcon('total_price')}
                            </th>
                            <th scope="col" style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCars.map((car) => (
                            <tr key={car.id}>
                                <td>{car.item_name}</td>
                                <td>{car.exterior_color}</td>
                                <td>{car.rim_style}</td>
                                <td>{car.interior_package}</td>
                                <td style={{ textAlign: 'right' }}>
                                    ${parseFloat(car.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td>
                                    <button onClick={() => handleViewDetails(car.id)} className="contrast button-sm">View</button>
                                    <button onClick={() => handleDelete(car.id, car.item_name)} className="outline button-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </article>
    );
};

export default CustomCars;


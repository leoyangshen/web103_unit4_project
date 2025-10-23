const API_URL = '/api/custom_items';

// CREATE (POST)
export const createCar = async (newCarData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCarData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating car:', error);
        return { error: 'Failed to create car.' };
    }
};

// READ ALL (GET)
export const getAllCars = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all cars:', error);
        return [];
    }
};

// READ SINGLE (GET)
export const getCar = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching car with ID ${id}:`, error);
        return null;
    }
};

// UPDATE (PUT)
export const updateCar = async (id, updatedCarData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCarData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error updating car with ID ${id}:`, error);
        return { error: 'Failed to update car.' };
    }
};

// DELETE (DELETE)
export const deleteCar = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Note: Delete usually returns 204 No Content, so we don't await response.json()
        return { success: true }; 
    } catch (error) {
        console.error(`Error deleting car with ID ${id}:`, error);
        return { error: 'Failed to delete car.' };
    }
};


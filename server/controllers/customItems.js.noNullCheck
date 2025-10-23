import { pool } from '../config/db.js';

// --- Helper function for robust error responses ---
const sendError = (res, message, status = 500) => {
    // Log the detailed error on the server side
    console.error(`[DB Error] Status ${status}: ${message}`); 
    // Send a generic error response to the client
    res.status(status).json({ error: 'Server Error. Check server logs for details.' });
};

// --- READ: Get All Custom Items ---
export const getCustomItems = async (req, res) => {
    try {
        const query = 'SELECT * FROM custom_items ORDER BY created_at DESC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        sendError(res, `Failed to retrieve custom items. Details: ${error.message}`, 500);
    }
};

// --- READ: Get Single Custom Item by ID ---
export const getCustomItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM custom_items WHERE id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return sendError(res, `Custom item with ID ${id} not found.`, 404);
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        sendError(res, `Failed to retrieve custom item ID ${id}. Details: ${error.message}`, 500);
    }
};

// --- CREATE: Create New Custom Item ---
export const createCustomItem = async (req, res) => {
    // The client sends 'name' but the DB expects 'item_name'
    const { 
        name, exterior_color, rim_style, interior_package, final_price 
    } = req.body;

    // Based on the DB schema, we need hardcoded defaults for NOT NULL fields
    // that the client doesn't provide: base_type and submitted_by.
    const item_name = name; // Map client's 'name' to DB's 'item_name'
    const base_type = 'Bolt Bucket'; // Default car model
    const submitted_by = 'Anonymous User'; // Default user ID/name

    // Check for required fields explicitly from the client payload
    if (!item_name || !exterior_color || !rim_style || !interior_package || !final_price) {
        return sendError(res, 'Missing required fields in request body.', 400);
    }

    try {
        const query = `
            INSERT INTO custom_items 
                (item_name, base_type, submitted_by, exterior_color, rim_style, interior_package, total_price, created_at)
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *; 
        `;
        const values = [
            item_name, 
            base_type, 
            submitted_by, 
            exterior_color, 
            rim_style, 
            interior_package, 
            final_price
        ];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]); // Return the newly created item
    } catch (error) {
        sendError(res, `Failed to create new custom item. Details: ${error.message}`, 500);
    }
};

// --- UPDATE: Edit Existing Custom Item ---
export const updateCustomItem = async (req, res) => {
    const { id } = req.params;
    const { 
        name, exterior_color, rim_style, interior_package, final_price 
    } = req.body;
    
    // Map client's 'name' to DB's 'item_name'
    const item_name = name; 
    const total_price = final_price;

    try {
        const query = `
            UPDATE custom_items
            SET 
                item_name = $1, 
                exterior_color = $2, 
                rim_style = $3, 
                interior_package = $4, 
                total_price = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [item_name, exterior_color, rim_style, interior_package, total_price, id];
        
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return sendError(res, `Custom item with ID ${id} not found for update.`, 404);
        }
        res.status(200).json(result.rows[0]); // Return the updated item
    } catch (error) {
        sendError(res, `Failed to update custom item ID ${id}. Details: ${error.message}`, 500);
    }
};

// --- DELETE: Delete Custom Item by ID ---
export const deleteCustomItem = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM custom_items WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return sendError(res, `Custom item with ID ${id} not found for deletion.`, 404);
        }
        // Return a confirmation message or the deleted item
        res.status(200).json({ message: `Custom item ID ${id} deleted successfully.` });
    } catch (error) {
        sendError(res, `Failed to delete custom item ID ${id}. Details: ${error.message}`, 500);
    }
};


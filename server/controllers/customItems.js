import { pool } from '../config/db.js';

// --- Helper function for robust error responses ---
/**
 * Logs the error detail to the server console and sends a clean response to the client.
 * @param {object} res - Express response object.
 * @param {string} message - A clean, human-readable error message.
 * @param {number} status - The HTTP status code (default 500).
 * @param {object|string} errorDetail - The raw technical error object (e.g., from the database).
 */
const sendError = (res, message, status = 500, errorDetail = null) => {
    // CRITICAL FIX: Include the technical error detail in the server log
    const detailLog = errorDetail ? ` Details: ${errorDetail.message || String(errorDetail)}` : '';
    console.error(`[DB Error] Status ${status}: ${message}${detailLog}`);
    
    // Send only the clean message to the client
    res.status(status).json({ error: message });
};


// --- READ: Get All Custom Items ---
export const getCustomItems = async (req, res) => {
    try {
        const query = 'SELECT * FROM custom_items ORDER BY created_at DESC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        sendError(res, 'Failed to retrieve custom items.', 500, error);
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
        sendError(res, `Failed to retrieve custom item ID ${id}.`, 500, error);
    }
};

// --- CREATE: Create New Custom Item ---
export const createCustomItem = async (req, res) => {
    // Destructure required fields from the request body
    const { item_name, base_type, submitted_by, exterior_color, rim_style, interior_package, total_price } = req.body;
    
    // Server-side validation for creation
    if (!item_name || !base_type || !submitted_by || !exterior_color || !rim_style || !interior_package || total_price === undefined) {
        return sendError(res, 'Missing required fields for new custom item.', 400);
    }

    try {
        const query = `
            INSERT INTO custom_items (item_name, base_type, submitted_by, exterior_color, rim_style, interior_package, total_price)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [item_name, base_type, submitted_by, exterior_color, rim_style, interior_package, total_price];
        
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]); // Return the created item
    } catch (error) {
        sendError(res, 'Failed to create a new custom item.', 500, error);
    }
};

// --- UPDATE: Update Custom Item by ID (PUT) ---
export const updateCustomItem = async (req, res) => {
    const { id } = req.params;
    const { 
        item_name, 
        exterior_color, 
        rim_style, 
        interior_package, 
        total_price 
    } = req.body;

    // 💡 CRITICAL FIX: Server-side validation prevents 500 crash on missing data
    if (!item_name || !exterior_color || !rim_style || !interior_package || total_price === undefined) {
        return sendError(res, 'Missing required configuration fields for update.', 400);
    }

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
        // Log the specific database error for debugging (e.g., the NOT NULL violation)
        sendError(res, `Failed to update custom item ID ${id}.`, 500, error);
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
        // Return a clean success status
        res.status(204).send(); 
    } catch (error) {
        sendError(res, `Failed to delete custom item ID ${id}.`, 500, error);
    }
};


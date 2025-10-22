// Import the pool from the central configuration file (which was formerly database.js)
import { pool } from './db.js'; 

// SQL command to drop and recreate the table
const createTableQuery = `
    DROP TABLE IF EXISTS custom_items;

    CREATE TABLE custom_items (
        id SERIAL PRIMARY KEY,
        
        -- Basic identification fields
        item_name VARCHAR(255) NOT NULL,
        base_type VARCHAR(50) NOT NULL,
        submitted_by VARCHAR(255) NOT NULL,
        
        -- Customization features (as defined in our plan)
        exterior_color VARCHAR(50) NOT NULL,
        rim_style VARCHAR(50) NOT NULL,
        interior_package VARCHAR(50) NOT NULL,

        -- Dynamic price and date tracking
        total_price NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

/**
 * Executes the database reset script: drops the table and recreates it.
 */
async function resetDatabase() {
    const dbName = process.env.PGDATABASE || 'undefined';
    console.log(`\nAttempting to reset database '${dbName}'...`);
    let client;
    try {
        // Connect to the database using the shared pool
        client = await pool.connect();
        
        // Execute the SQL commands
        await client.query(createTableQuery);

        console.log("✅ Database reset successful! 'custom_items' table created.");

    } catch (error) {
        if (error.code === '3D000') {
            console.error(`\n🚨 ERROR: Database '${dbName}' does not exist.`);
            console.error(`Please create the database first using 'createdb ${dbName}' in your terminal.`);
        } else {
            // Log the error message if something else went wrong (e.g., authentication)
            console.error(`\n❌ An error occurred during database reset:`, error.message);
        }
        process.exit(1); 
    } finally {
        if (client) {
            client.release();
        }
        // End the pool after the operation is complete
        pool.end(); 
    }
}

// Execute the function
resetDatabase();


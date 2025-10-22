import pg from 'pg';

// import * as dotenv from 'dotenv';
import dotenv from 'dotenv';
// Using relative path to the root .env file, verified to work with the reset script.
dotenv.config({ path: './.env' }); 

console.log(`[DB Config] NODE_ENV loaded: ${process.env.NODE_ENV}`);
console.log(`[DB Config] PGDATABASE loaded: ${process.env.PGDATABASE}`);

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

export const pool = new pg.Pool(config);

// 💡 ADDED: Critical error handling for the connection pool
pool.on('error', (err) => {
    console.error('🚨 Unexpected error on idle client', err);
    // Exit the process immediately to signal a fatal error and allow an external process manager to restart it.
    process.exit(-1); 
});

console.log(`Database connection pool created for: ${process.env.PGDATABASE}`);


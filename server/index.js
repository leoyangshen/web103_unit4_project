import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import cors from 'cors'; // 💡 NEW: Required middleware for frontend-backend communication
import customItemsRouter from './routes/customItems.js'; // 💡 NEW: Import the router

// Note: dotenv is now handled primarily inside db.js for robust loading.

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(cors()); // 💡 NEW: Use cors
app.use(express.json()); // Body parser for application/json payloads

// Favicon and Static Asset Configuration
if (process.env.NODE_ENV === 'development') {
    // Development setup: Assume client is in '../client/public'
    app.use(favicon(path.resolve('../', 'client', 'public', 'lightning.png')));
}
else if (process.env.NODE_ENV === 'production') {
    // Production setup: Serve static assets from 'public' directory
    app.use(favicon(path.resolve('public', 'lightning.png')));
    app.use(express.static('public'));
}

// Specify the API path for the server to use (Step 5)
// All custom item routes will be prefixed with /api/custom_items
app.use('/api/custom_items', customItemsRouter); 


// Production fallback: Serve index.html for all client-side routes
if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    );
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});


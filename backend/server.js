import express from 'express';
import cors from 'cors';
// Firebase config is now loaded in config/firebase.js but not explicitly needed here unless we use 'admin' directly.
// The routes use the middleware which uses the config.

import authRoutes from './routes/authRoutes.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import connectDB from './config/db.js';

const app = express();
const port = 5000;

connectDB();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/analyze', analyzeRoutes);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Backend is running!');
    });
}

app.listen(port, () => {
    console.log(`server live`);
});

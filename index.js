import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import vendorRoutes from './src/Routes/vendor_route.js'; // Ensure path is correct
// import {DB_URI} from './constants.js'; 
import dotenv from 'dotenv';
dotenv.config();







const URI= process.env.DB_URI
const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


app.use(bodyParser.json()); 

// Define routes
app.use('/api', vendorRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running!');
});

// Start server
app.listen(PORT, () =>
    console.log(`Server is running at port: http://localhost:${PORT}`)
);

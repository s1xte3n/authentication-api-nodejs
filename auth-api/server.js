// #1 Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import the authenticaion middleware 
const authMiddleware = require('./middleware/auth');

// #2 Load environment variables 
dotenv.config();

// #3 Initialise express app

const app = express();

// #4 Middleware to parse JSON requests
app.use(express.json);

// #5 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err = console.log(err));

// #6 Define routes
// Unprotected route
/* app.use('/api/auth', require('./routes/auth')); */

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a procted route. You can only see this if you have a valid JWT.');
});

// #7 Start server
const PORT = process.env.PORT|| 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
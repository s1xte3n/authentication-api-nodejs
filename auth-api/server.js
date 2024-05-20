// #1 Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

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
/* app.get('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a procted route. You can only see this if you have a valid JWT.');
}); */

// Route for user registration
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Route for user login 
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 3600
        }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// #7 Start server
const PORT = process.env.PORT|| 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
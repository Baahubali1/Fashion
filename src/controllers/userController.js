import bcrypt from 'bcryptjs';
import { Users } from '../models/users.js';
import { generateToken } from '../auth/jwt.js';

// Register User
export async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required.'
            });
        }

        // Validate password
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long.'
            });
        }

        // Check whether user already exists
        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: 'User is already registered.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await Users.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        // Generate JWT
        const token = generateToken(user.id);

        return res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('createUser error:', err);

        return res.status(500).json({
            message: 'Internal server error during registration.'
        });
    }
}

// Login User
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required.'
            });
        }

        const existingUser = await Users.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        if (!existingUser) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const isCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(existingUser.id);

        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            }
        });
    } catch (err) {
        console.error('login error:', err);

        return res.status(500).json({
            message: 'Internal server error during login.'
        });
    }
}

// Get Current User
export async function getCurrentUser(req, res) {
    try {
        const user = await Users.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('getCurrentUser error:', err);

        return res.status(500).json({
            message: 'Internal server error.'
        });
    }
}

// Logout User
export async function logout(req, res) {
    return res.status(200).json({
        message: 'Logged out successfully. Please discard your authentication token.'
    });
}
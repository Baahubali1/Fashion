import bcrypt from 'bcryptjs';
import { Users } from '../models/users.js';
import { generateToken } from '../auth/jwt.js';

//User Creation
export async function createUser(userData) {
    const existingUser = await Users.findOne({
        email: userData.email
    });

    if(existingUser){
        throw new Error("User is already registered")
    }

    const hashedPassword = await bcrypt.hash(userData.password,12)

    const user = await Users.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
    });

    const token = generateToken(user.id);

    return {
        message: 'Account created successfully!',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
}

//User Login
export async function login(userData) {
    const existingUser = await Users.findOne({
        email: userData.email
    }).select("+password");

    if(!existingUser){
        throw new Error("Invalid Credentials Entered.")
    }

    const isCorrect = await bcrypt.compare(
        userData.password,
        existingUser.password
    )

    if (!isCorrect) {
        throw new Error("Invalid Credentials. Please recheck and enter details.")
    } 

    const token = generateToken(existingUser.id)

    return {
        message: 'Login Sucessful!',
        token,
        user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email
        }
    };
}

//Getting Credentials of Current User to maintain logged in state in case of site refresh  
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

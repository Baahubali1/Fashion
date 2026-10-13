import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function generateToken(userId) {
    return jwt.sign(
        {id : userId},
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
    );
}

export function verifyToken(token) {
    return jwt.verify(
        token, process.env.JWT_SECRET
    );
}
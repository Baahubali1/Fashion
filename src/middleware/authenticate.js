import { verifyToken } from '../auth/jwt.js';

export function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication required.'
            });
        }

        const token = authHeader.split(' ')[1];

        const payload = verifyToken(token);

        req.user = { id: payload.id };

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token.'
        });
    }
}

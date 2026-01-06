import jwt from 'jsonwebtoken';
import config from '../../config.js';

export default (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        if (!token) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        const decoded = jwt.verify(token, config.secred_key);

        if (decoded.login !== config.root) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        next();

    } catch (err) {
        return res.status(403).json({
            message: 'Forbidden'
        });
    }
};

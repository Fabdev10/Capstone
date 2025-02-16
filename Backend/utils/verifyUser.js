import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  
  const token = req.headers['authorization']?.split(' ')[1];  

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));  
  }

 
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Token expired'));
      }
      return next(errorHandler(403, 'Forbidden'));
    }
    req.user = user;
    next();
  });
};

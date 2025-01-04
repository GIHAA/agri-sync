import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: { id: string };
}

const protect = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    // Remove 'Bearer ' prefix from the token if present
    const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify the JWT token
    jwt.verify(jwtToken, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }

      // Set the user ID in the request object
      const decodedPayload = decoded as JwtPayload;
      req.user = { id: decodedPayload.id };
      console.log('User ID:', req.user.id);
      next();
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default protect;

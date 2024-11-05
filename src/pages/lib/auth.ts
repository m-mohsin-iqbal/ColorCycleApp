import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export function verifyToken(req: NextApiRequest): Promise<string | null> {
  return new Promise((resolve) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      resolve(null);
      return;
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        resolve(null);
      } else {
        resolve((decoded as any).userId);
      }
    });
  });
}
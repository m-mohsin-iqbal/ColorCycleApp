import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../lib/db';
import { verifyToken } from '../lib/auth';
import { ColorState } from '../models/ColorState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await verifyToken(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectToDatabase();

  if (req.method === 'POST') {
    const { colors, highlightIndex } = req.body;
    const colorState = new ColorState({ userId, colors, highlightIndex, timestamp: new Date() });
    await colorState.save();
    return res.status(201).json({ message: 'Color state logged successfully' });
  } else if (req.method === 'GET') {
    const page = parseInt(req.query.page as string) || 1; 
    const pageSize = parseInt(req.query.pageSize as string) || 10; 
    const skip = (page - 1) * pageSize; 

    const colorStates = await ColorState.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await ColorState.countDocuments({ userId }); 

    return res.status(200).json({
      colorStates,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize), 
      currentPage: page,
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

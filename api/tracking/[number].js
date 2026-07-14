import { getPrisma } from '../_lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { number } = req.query;

  try {
    const prisma = getPrisma();
    const record = await prisma.trackingRecord.findUnique({
      where: { trackingNumber: number }
    });
    if (!record) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }
    return res.json(record);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

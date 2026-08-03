import { getPrisma } from '../_lib/prisma.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

function verifyToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  return jwt.verify(token, JWT_SECRET);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyToken(req);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const prisma = getPrisma();

  try {
    const statuses = ['In Transit', 'Pending', 'Out for Delivery', 'Customs Clearance', 'On Hold', 'Processing'];
    const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Miami, FL', 'Seattle, WA', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Toronto, CA'];
    
    const randomCity = () => cities[Math.floor(Math.random() * cities.length)];
    let origin = randomCity();
    let destination = randomCity();
    while (origin === destination) destination = randomCity();
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const progress = Math.floor(Math.random() * 80) + 10;
    
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + Math.floor(Math.random() * 10) + 1);
    const eta = etaDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const trackingNumber = `SLD-US-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const record = await prisma.trackingRecord.create({
      data: {
        trackingNumber,
        status,
        origin,
        destination,
        eta,
        progress
      }
    });

    // Also generate a few random events for realism
    const eventStatuses = ['Package received at facility', 'Customs documentation processed', 'Departed origin facility', 'In transit to destination'];
    const eventCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < eventCount; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - (i + 1));
      await prisma.trackingEvent.create({
        data: {
          trackingRecordId: record.id,
          status: eventStatuses[Math.floor(Math.random() * eventStatuses.length)],
          location: Math.random() > 0.5 ? origin : destination,
          timestamp: pastDate
        }
      });
    }

    return res.status(201).json(record);
  } catch (error) {
    console.error('Auto-generate error:', error);
    return res.status(500).json({ error: 'Server error during generation' });
  }
}

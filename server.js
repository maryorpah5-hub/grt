import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

app.use(cors());
app.use(express.json());

// ========================
// API ROUTES
// ========================

// Public: Track Shipment
app.get('/api/tracking/:number', async (req, res) => {
  try {
    const record = await prisma.trackingRecord.findUnique({
      where: { trackingNumber: req.params.number }
    });
    if (!record) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: Submit Contact Form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    const newContact = await prisma.contactMessage.create({
      data: { name, phone, email, service, message }
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Auth: Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware: Authenticate Admin
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin: Get Contacts
app.get('/api/admin/contacts', authMiddleware, async (req, res) => {
  try {
    const contacts = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get All Tracking Records
app.get('/api/admin/tracking', authMiddleware, async (req, res) => {
  try {
    const records = await prisma.trackingRecord.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create Tracking Record
app.post('/api/admin/tracking', authMiddleware, async (req, res) => {
  try {
    const record = await prisma.trackingRecord.create({ data: req.body });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update Tracking Record
app.put('/api/admin/tracking/:id', authMiddleware, async (req, res) => {
  try {
    const record = await prisma.trackingRecord.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Delete Tracking Record
app.delete('/api/admin/tracking/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.trackingRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================
// SERVE FRONTEND IN PROD
// ========================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is running in dev mode. Run Vite separately on port 5173.');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

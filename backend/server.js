import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import compression from 'compression';

dotenv.config();

// Resolve DNS resolution issues for MongoDB SRV records on some local networks
if (process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb+srv')) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('Failed to set custom DNS servers, using system defaults:', err.message);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bandamart';

// Enable compression and CORS for frontend local development
app.use(compression());
app.use(cors());
app.use(express.json());

// --- MongoDB / Mongoose Connection ---
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 50
})
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// --- Schemas & Models ---
const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  bgColor: { type: String, required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // references category.id
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

// Database seeding removed for clean store admin setup

// Multer in-memory storage configuration
const upload = multer({ storage: multer.memoryStorage() });

// --- API Endpoints ---

// Keep track of failed login attempts
const loginAttempts = new Map();

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const configuredUser = process.env.ADMIN_USERNAME || 'banda_admin';
  const configuredPass = process.env.ADMIN_PASSWORD || 'BandaMart@Launch2026!';

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  // Check if this IP is currently locked out
  if (loginAttempts.has(clientIp)) {
    const record = loginAttempts.get(clientIp);
    if (record.lockUntil && record.lockUntil > Date.now()) {
      const remainingTimeMs = record.lockUntil - Date.now();
      const remainingMin = Math.ceil(remainingTimeMs / 60000);
      return res.status(429).json({
        error: `Too many failed attempts. You are locked out for 1 hour. Please try again in ${remainingMin} minutes.`,
        lockUntil: record.lockUntil
      });
    }
  }

  if (username === configuredUser && password === configuredPass) {
    // Clear attempts on successful login
    loginAttempts.delete(clientIp);
    res.json({ success: true });
  } else {
    // Increment attempts on failure
    let record = loginAttempts.get(clientIp) || { count: 0, lockUntil: 0 };
    
    // If previous lock expired, reset count
    if (record.lockUntil && record.lockUntil <= Date.now()) {
      record.count = 0;
      record.lockUntil = 0;
    }

    record.count += 1;

    if (record.count >= 5) {
      record.lockUntil = Date.now() + 60 * 60 * 1000; // 1 hour lockout
      loginAttempts.set(clientIp, record);
      
      return res.status(429).json({
        error: 'Too many failed attempts. You are locked out for 1 hour.',
        lockUntil: record.lockUntil
      });
    } else {
      loginAttempts.set(clientIp, record);
      const remainingAttempts = 5 - record.count;
      res.status(401).json({
        error: `Invalid credentials. Remaining attempts before 1-hour lockout: ${remainingAttempts}`
      });
    }
  }
});

// Cloudinary Image Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error: 'Cloudinary is not configured on the backend server. Please verify .env settings.'
    });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'bandamart' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Cloudinary upload failed: ' + error.message });
      }
      res.json({ secure_url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

// Categories Endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().select('-__v -_id');
    res.set('Cache-Control', 'public, max-age=60');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories: ' + err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
      id: 'cat_' + Date.now()
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category: ' + err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Category.findOneAndUpdate({ id }, req.body, { new: true });
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category: ' + err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Category.findOneAndDelete({ id });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category: ' + err.message });
  }
});

// Products Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().select('-__v -_id').sort({ createdAt: -1 });
    res.set('Cache-Control', 'public, max-age=60');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product({
      ...req.body,
      id: 'p_' + Date.now()
    });
    await newProduct.save();
    res.status(211).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product: ' + err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Product.findOneAndUpdate({ id }, req.body, { new: true });
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findOneAndDelete({ id });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product: ' + err.message });
  }
});

// Health check endpoint for Render keep-alive
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Start Server
app.listen(PORT, () => {
  console.log(`BandaMart backend server running on http://localhost:${PORT}`);

  // Keep-alive self-ping for Render free tier (every 14 minutes)
  const selfUrl = process.env.RENDER_EXTERNAL_URL || process.env.SELF_URL;
  if (selfUrl) {
    console.log(`Render keep-alive self-ping initialized for: ${selfUrl}`);
    setInterval(async () => {
      try {
        const res = await fetch(`${selfUrl}/api/health`);
        console.log(`Self-ping health check status: ${res.status} at ${new Date().toISOString()}`);
      } catch (err) {
        console.error('Self-ping failed:', err.message);
      }
    }, 14 * 60 * 1000); // 14 minutes
  }
});

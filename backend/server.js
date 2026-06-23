import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import compression from 'compression';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

dotenv.config();

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Configure Nodemailer Transporter (Backup)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
  },
  connectionTimeout: 8000, // 8 seconds
  greetingTimeout: 8000,   // 8 seconds
  socketTimeout: 8000      // 8 seconds
});


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
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    await seedDefaultAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// --- Schemas & Models ---
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

async function seedDefaultAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: 'AdminBmji' });
    if (!adminExists) {
      await Admin.create({
        username: 'AdminBmji',
        email: 'aman1833777@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'fy7de1Jq0PnvIwoB8CTI85GA',
      });
      console.log('Default Admin seeded successfully: username=AdminBmji, email=aman1833777@gmail.com');
    }
  } catch (err) {
    console.error('Error seeding default admin:', err);
  }
}

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

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true }
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);

// Database seeding removed for clean store admin setup

// Multer in-memory storage configuration
const upload = multer({ storage: multer.memoryStorage() });

// --- API Endpoints ---

// Keep track of failed login attempts
const loginAttempts = new Map();

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

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

  try {
    const admin = await Admin.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });

    if (admin && admin.password === password) {
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
  } catch (err) {
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// Admin Forgot Password Endpoint
app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ error: 'No admin account found with that email' });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = {
      code: otpCode,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
    };
    await admin.save();

    // Log the OTP to the console for development/fallback testing
    console.log('\n==========================================');
    console.log(`[OTP Verification] Reset code for admin: ${otpCode}`);
    console.log(`Email recipient: ${email}`);
    console.log('==========================================\n');

    // Check if Resend or SMTP is configured
    const isResendConfigured = !!resend && process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key';
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const isSmtpConfigured = smtpUser && smtpUser !== 'your_email@gmail.com' && smtpPass && smtpPass !== 'your_gmail_app_password';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #10b981; text-align: center;">BandaMart Admin</h2>
        <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
        <p>Hello Admin,</p>
        <p>You requested to reset your password. Please use the following 6-digit verification code (OTP) to complete the process:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background-color: #f1f5f9; padding: 10px 20px; border-radius: 6px; border: 1px solid #cbd5e1;">${otpCode}</span>
        </div>
        <p>This verification code is valid for <strong>15 minutes</strong>. If you did not initiate this request, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">This is an automated email from BandaMart. Please do not reply.</p>
      </div>
    `;

    const emailText = `Hello,\n\nYou requested to reset your BandaMart Admin password. Your 6-digit OTP verification code is: ${otpCode}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`;

    if (isResendConfigured) {
      try {
        await resend.emails.send({
          from: 'BandaMart Admin <onboarding@resend.dev>',
          to: email.trim().toLowerCase(),
          subject: 'BandaMart Admin Password Reset OTP',
          text: emailText,
          html: emailHtml
        });
        console.log(`[Resend Email Sent] Reset code sent to ${email}`);
        return res.json({ success: true, message: 'Reset code sent to your email.' });
      } catch (resendErr) {
        console.error('[Resend Error] Failed to send email via Resend:', resendErr.message);
        if (!isSmtpConfigured) {
          return res.json({
            success: true,
            message: 'Reset code generated. (Resend failed, please view your backend console logs to retrieve the OTP).'
          });
        }
      }
    }

    if (isSmtpConfigured) {
      try {
        const mailOptions = {
          from: `"BandaMart Admin" <${smtpUser}>`,
          to: email.trim().toLowerCase(),
          subject: 'BandaMart Admin Password Reset OTP',
          text: emailText,
          html: emailHtml
        };

        await transporter.sendMail(mailOptions);
        console.log(`[SMTP Email Sent] Reset code sent to ${email}`);
        return res.json({ success: true, message: 'Reset code sent to your email.' });
      } catch (mailErr) {
        console.error('[SMTP Error] Failed to send email via SMTP:', mailErr.message);
        return res.json({
          success: true,
          message: 'Reset code generated. (SMTP connection timed out/failed. If hosted on Render Free Tier, outbound SMTP is blocked; please view your Render Dashboard logs to retrieve the OTP code).'
        });
      }
    } else if (!isResendConfigured) {
      console.log('[Email Warning] Neither Resend nor SMTP is configured. Using console log fallback.');
      return res.json({
        success: true,
        message: 'Reset code generated. (Email service is not configured on the server, please view the terminal console to get the code).'
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process forgot password: ' + err.message });
  }
});

// Admin Verify OTP Endpoint
app.post('/api/admin/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code (OTP) are required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ error: 'No admin account found with that email' });
    }

    if (!admin.otp || !admin.otp.code || admin.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (admin.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'Verification code verified successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify code: ' + err.message });
  }
});

// Admin Reset Password Endpoint
app.post('/api/admin/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'All fields (email, otp, newPassword) are required' });
  }

  try {
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ error: 'No admin account found with that email' });
    }

    if (!admin.otp || !admin.otp.code || admin.otp.code !== otp) {
      return res.status(400).json({ error: 'Invalid or missing verification code' });
    }

    if (admin.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Reset password
    admin.password = newPassword;
    admin.otp = undefined; // clear OTP
    await admin.save();

    res.json({ success: true, message: 'Password reset successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password: ' + err.message });
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

// Settings Endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    // Fallback/default if not set in MongoDB
    if (!settingsMap.whatsapp_number) {
      settingsMap.whatsapp_number = '918957471581';
    }
    res.json(settingsMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings: ' + err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value are required' });
  }
  try {
    let sanitizedValue = value;
    if (key === 'whatsapp_number') {
      sanitizedValue = value.replace(/\D/g, ''); // strip out non-digits
      if (!sanitizedValue) {
        return res.status(400).json({ error: 'Invalid WhatsApp number. It must contain digits.' });
      }
    }
    const updated = await Setting.findOneAndUpdate(
      { key },
      { value: sanitizedValue },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update setting: ' + err.message });
  }
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

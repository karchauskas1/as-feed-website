/**
 * АС-ФИД Backend Server
 * Обработка форм заявок и хранение данных
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================================================
// Middleware
// ==========================================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================================================
// Data Storage
// ==========================================================================

const IS_VERCEL = process.env.VERCEL === '1';
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// In-memory storage for Vercel (serverless has no persistent filesystem)
let memoryLeads = [];

// For local development: use file storage
if (!IS_VERCEL) {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Initialize leads file if not exists
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Read leads from storage
 * @returns {Array} - Array of leads
 */
function readLeads() {
  if (IS_VERCEL) {
    return memoryLeads;
  }
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads:', error);
    return [];
  }
}

/**
 * Write leads to storage
 * @param {Array} leads - Array of leads
 */
function writeLeads(leads) {
  if (IS_VERCEL) {
    memoryLeads = leads;
    return;
  }
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error('Error writing leads:', error);
  }
}

/**
 * Add new lead
 * @param {Object} leadData - Lead data
 * @returns {Object} - Created lead
 */
function addLead(leadData) {
  const leads = readLeads();
  const newLead = {
    id: Date.now().toString(),
    ...leadData,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  leads.push(newLead);
  writeLeads(leads);
  return newLead;
}

// ==========================================================================
// Email Configuration
// ==========================================================================

/**
 * Create email transporter
 * Configure with your SMTP settings in .env file
 */
let transporter = null;

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Send notification email
 * @param {Object} leadData - Lead data
 */
async function sendNotificationEmail(leadData) {
  if (!transporter) {
    console.log('Email not configured, skipping notification');
    return;
  }

  const { name, phone, email, message, product, volume, formType } = leadData;

  const subject = formType === 'product'
    ? `Новая заявка на корм: ${product}`
    : 'Новая заявка с сайта АС-ФИД';

  const htmlContent = `
    <h2>Новая заявка с сайта АС-ФИД</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Имя:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Телефон:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
      </tr>
      ${email ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
      </tr>
      ` : ''}
      ${product ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Продукт:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product}</td>
      </tr>
      ` : ''}
      ${volume ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Объём:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${volume}</td>
      </tr>
      ` : ''}
      ${message ? `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Сообщение:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Дата:</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString('ru-RU')}</td>
      </tr>
    </table>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"АС-ФИД Сайт" <noreply@as-feed.ru>',
      to: process.env.NOTIFICATION_EMAIL || 'info@as-feed.ru',
      subject: subject,
      html: htmlContent
    });
    console.log('Notification email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// ==========================================================================
// API Routes
// ==========================================================================

/**
 * Submit form endpoint
 */
app.post('/api/submit-form', async (req, res) => {
  try {
    const { name, phone, email, message, product, volume, formType } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Имя и телефон обязательны'
      });
    }

    // Save lead
    const lead = addLead({
      name,
      phone,
      email: email || null,
      message: message || null,
      product: product || null,
      volume: volume || null,
      formType: formType || 'contact',
      source: req.body.page || 'unknown'
    });

    // Send notification email
    await sendNotificationEmail(lead);

    console.log('New lead saved:', lead.id);

    res.json({
      success: true,
      message: 'Заявка успешно отправлена',
      leadId: lead.id
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка сервера'
    });
  }
});

/**
 * Get all leads (protected - for admin panel)
 */
app.get('/api/leads', (req, res) => {
  // Basic auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const leads = readLeads();
  res.json({
    success: true,
    leads: leads.reverse(), // Newest first
    total: leads.length
  });
});

/**
 * Update lead status (protected)
 */
app.patch('/api/leads/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  const { status, notes } = req.body;

  const leads = readLeads();
  const leadIndex = leads.findIndex(l => l.id === id);

  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  if (status) leads[leadIndex].status = status;
  if (notes) leads[leadIndex].notes = notes;
  leads[leadIndex].updatedAt = new Date().toISOString();

  writeLeads(leads);

  res.json({
    success: true,
    lead: leads[leadIndex]
  });
});

/**
 * Get statistics (protected)
 */
app.get('/api/stats', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const leads = readLeads();

  // Calculate statistics
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    total: leads.length,
    today: leads.filter(l => new Date(l.createdAt) >= today).length,
    thisWeek: leads.filter(l => new Date(l.createdAt) >= thisWeek).length,
    thisMonth: leads.filter(l => new Date(l.createdAt) >= thisMonth).length,
    byStatus: {
      new: leads.filter(l => l.status === 'new').length,
      processing: leads.filter(l => l.status === 'processing').length,
      completed: leads.filter(l => l.status === 'completed').length,
      rejected: leads.filter(l => l.status === 'rejected').length
    },
    byType: {
      contact: leads.filter(l => l.formType === 'contact').length,
      product: leads.filter(l => l.formType === 'product').length
    },
    byProduct: {}
  };

  // Count by product
  leads.filter(l => l.product).forEach(l => {
    stats.byProduct[l.product] = (stats.byProduct[l.product] || 0) + 1;
  });

  res.json({
    success: true,
    stats
  });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/index.html'));
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ==========================================================================
// Start Server
// ==========================================================================

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Local development
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║       АС-ФИД Backend Server                       ║
║       Running on port ${PORT}                          ║
║       http://localhost:${PORT}                         ║
╚═══════════════════════════════════════════════════╝
    `);
  });
}

// Export for Vercel
module.exports = app;

// routes/advisories.js
import express from 'express';
import Advisory from '../models/Advisory.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Initialize router first
const router = express.Router();

// Setup uploads directory
const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage });

// ======= Attachment Routes =======

// Upload multiple attachments for an advisory
router.post('/:id/attachments', upload.array('attachments'), async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);
    if (!advisory) return res.status(404).json({ error: 'Advisory not found' });

    const filesMeta = req.files.map(file => ({
      name: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
    }));

    advisory.attachments.push(...filesMeta);
    await advisory.save();

    res.json({ message: 'Files uploaded', attachments: advisory.attachments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload attachments', detail: error.message });
  }
});

// List attachments metadata for an advisory
router.get('/:id/attachments', async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);
    if (!advisory) return res.status(404).json({ error: 'Advisory not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}/api/advisories/${advisory._id}/attachments`;
    const files = advisory.attachments.map(file => ({
      _id: file._id,
      name: file.originalName,
      downloadUrl: `${baseUrl}/${file._id}`
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// routes/advisories.js
router.get('/:advisoryId/attachments/:fileId', async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.advisoryId);
    if (!advisory) return res.status(404).json({ error: 'Advisory not found' });

    const file = advisory.attachments.id(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'Attachment not found' });

    const filePath = path.resolve(file.path);
    const mime = file.mimeType || 'application/octet-stream';

    // Only display inline for browser-viewable types (PDF, images)
    if (mime === 'application/pdf' || mime.startsWith('image/')) {
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
      res.sendFile(filePath);
    } else {
      // For all other types, force download
      res.download(filePath, file.originalName);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// ======= Advisory CRUD Routes =======

// Get all advisories
router.get('/', async (req, res) => {
  try {
    const advisories = await Advisory.find();
    res.json(advisories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advisories' });
  }
});

// Get advisory by ID
router.get('/:id', async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);
    if (!advisory) return res.status(404).json({ error: 'Advisory not found' });
    res.json(advisory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advisory' });
  }
});

// Create a new advisory
router.post('/', async (req, res) => {
  try {
    const advisory = new Advisory(req.body);
    const savedAdvisory = await advisory.save();
    res.status(201).json(savedAdvisory);
  } catch (err) {
  console.error('Advisory creation error:', err);
  res.status(400).json({ error: err.message });
}
});

// Update advisory by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedAdvisory = await Advisory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAdvisory) return res.status(404).json({ error: 'Advisory not found' });
    res.json(updatedAdvisory);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update advisory' });
  }
});

// Delete multiple advisories by IDs
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No advisory IDs provided' });
    }
    await Advisory.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Advisories deleted successfully',
      deletedIds: ids
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete advisories' });
  }
});

export default router;

// routes/guideline.js
import express from 'express';
import Guideline from '../models/Guideline.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({ storage });

// Upload attachments
router.post('/:id/attachments', upload.array('attachments'), async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.id);
    if (!guideline) return res.status(404).json({ error: 'Guideline not found' });

    const filesMeta = req.files.map(file => ({
      name: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
    }));

    guideline.attachments.push(...filesMeta);
    await guideline.save();

    res.json({ message: 'Files uploaded', attachments: guideline.attachments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload attachments', detail: error.message });
  }
});

// List all attachments metadata for a guideline
router.get('/:id/attachments', async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.id);
    if (!guideline) return res.status(404).json({ error: 'Guideline not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}/api/guidelines/${guideline._id}/attachments`;
    const files = guideline.attachments.map(file => ({
      _id: file._id,
      name: file.originalName,
      downloadUrl: `${baseUrl}/${file._id}`,
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve attachment inline or download
router.get('/:guidelineId/attachments/:fileId', async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.guidelineId);
    if (!guideline) return res.status(404).json({ error: 'Guideline not found' });

    const file = guideline.attachments.id(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'Attachment not found' });

    const filePath = path.resolve(file.path);
    const mime = file.mimeType || 'application/octet-stream';

    if (mime === 'application/pdf' || mime.startsWith('image/')) {
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
      res.sendFile(filePath);
    } else {
      res.download(filePath, file.originalName);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all guidelines
router.get('/', async (req, res) => {
  try {
    const guidelines = await Guideline.find();
    res.json(guidelines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guidelines' });
  }
});

// GET a single guideline by ID
router.get('/:id', async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.id);
    if (!guideline) return res.status(404).json({ error: 'Guideline not found' });
    res.json(guideline);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch guideline' });
  }
});

// POST create new guideline
router.post('/', async (req, res) => {
  try {
    const guideline = new Guideline(req.body);
    const savedGuideline = await guideline.save();
    res.status(201).json(savedGuideline);
  } catch (err) {
  console.error('Guideline validation error:', err);
  res.status(400).json({ error: err.message }); // pass through real error for debugging
}
});

// PUT update a guideline by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedGuideline = await Guideline.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedGuideline) return res.status(404).json({ error: 'Guideline not found' });
    res.json(updatedGuideline);
  } catch (err) {
  console.error('Guideline validation error:', err);
  res.status(400).json({ error: err.message }); // pass through real error for debugging
}
});

// DELETE multiple guidelines (by ids array in req.body.ids)
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No guideline IDs provided' });
    }
    await Guideline.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Guidelines deleted successfully',
      deletedIds: ids
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete guidelines' });
  }
});

export default router;

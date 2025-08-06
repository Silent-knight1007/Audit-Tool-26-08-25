import express from 'express';
import Certificate from '../models/Certificate.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Setup uploads folder
const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config to store files
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

// Upload attachments for certificate
router.post('/:id/attachments', upload.array('attachments'), async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    const filesMeta = req.files.map(file => ({
      name: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
    }));

    certificate.attachments.push(...filesMeta);
    await certificate.save();

    res.json({ message: 'Files uploaded', attachments: certificate.attachments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload attachments', detail: error.message });
  }
});

// List attachments metadata
router.get('/:id/attachments', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}/api/certificates/${certificate._id}/attachments`;
    const files = certificate.attachments.map(file => ({
      _id: file._id,
      name: file.originalName,
      downloadUrl: `${baseUrl}/${file._id}`
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve attachment (open inline or download)
router.get('/:certificateId/attachments/:fileId', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.certificateId);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    const file = certificate.attachments.id(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'Attachment not found' });

    const filePath = path.resolve(file.path);
    const mime = file.mimeType || 'application/octet-stream';

    // Serve inline for PDF/image
    if (mime === 'application/pdf' || mime.startsWith('image/')) {
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
      res.sendFile(filePath);
    } else {
      // Force download for other files
      res.download(filePath, file.originalName);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET single certificate by ID
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// POST create certificate
router.post('/', async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    const savedCertificate = await certificate.save();
    res.status(201).json(savedCertificate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create certificate' });
  }
});

// PUT update certificate by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCertificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCertificate) return res.status(404).json({ error: 'Certificate not found' });
    res.json(updatedCertificate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update certificate' });
  }
});

// DELETE multiple certificates
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No certificate IDs provided' });
    }
    await Certificate.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Certificates deleted successfully',
      deletedIds: ids
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete certificates' });
  }
});

export default router;

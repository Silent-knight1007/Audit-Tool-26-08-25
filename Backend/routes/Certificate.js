import express from 'express';
import Certificate from '../models/Certificate.js';

const router = express.Router();

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

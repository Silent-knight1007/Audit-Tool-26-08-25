import express from 'express';
import Advisory from '../models/Advisory.js';

const router = express.Router();

// GET all advisories
router.get('/', async (req, res) => {
  try {
    const advisories = await Advisory.find();
    res.json(advisories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advisories' });
  }
});

// GET single advisory by ID
router.get('/:id', async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);
    if (!advisory) return res.status(404).json({ error: 'Advisory not found' });
    res.json(advisory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advisory' });
  }
});

// POST create advisory
router.post('/', async (req, res) => {
  try {
    const advisory = new Advisory(req.body);
    const savedAdvisory = await advisory.save();
    res.status(201).json(savedAdvisory);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create advisory' });
  }
});

// PUT update advisory by ID
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

// DELETE multiple advisories
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

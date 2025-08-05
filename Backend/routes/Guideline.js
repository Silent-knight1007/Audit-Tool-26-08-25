// routes/guideline.js
import express from 'express';
import Guideline from '../models/Guideline.js';

const router = express.Router();

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

import express from 'express';
import Policy from '../models/Policy.js';

const router = express.Router();

// GET all policies
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
});

// GET a single policy by ID
router.get('/:id', async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policy' });
  }
});

// POST create new policy
router.post('/', async (req, res) => {
  try {
    const policy = new Policy(req.body);
    const savedPolicy = await policy.save();
    res.status(201).json(savedPolicy);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create policy' });
  }
});

// PUT update a policy by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedPolicy = await Policy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPolicy) return res.status(404).json({ error: 'Policy not found' });
    res.json(updatedPolicy);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update policy' });
  }
});

// DELETE multiple policies (by ids array in req.body.ids)
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No policy IDs provided' });
    }
    await Policy.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Policies deleted successfully',
      deletedIds: ids
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete policies' });
  }
});

export default router;

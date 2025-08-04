import express from 'express';
import Template from '../models/Template.js';

const router = express.Router();

// GET all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET a single template by ID
router.get('/:id', async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// POST create new template
router.post('/', async (req, res) => {
  try {
    const template = new Template(req.body);
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create template' });
  }
});

// PUT update a template by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTemplate) return res.status(404).json({ error: 'Template not found' });
    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update template' });
  }
});

// DELETE multiple templates (by ids array in req.body.ids)
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No template IDs provided' });
    }
    await Template.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Templates deleted successfully',
      deletedIds: ids
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete templates' });
  }
});

export default router;

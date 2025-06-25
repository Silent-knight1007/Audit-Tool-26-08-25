const express = require('express')
const router = express.Router()
const NonConformity = require('../models/NonConformity')

router.post('/', async (req, res) => {
  try {
    const nonConformity = new NonConformity(req.body);
    await nonConformity.save();
    res.status(200).json({ message: 'NonConformity saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all non-conformities
router.get('/', async (req, res) => {
  try {
    const nonConformity = await NonConformity.find();
    res.json(nonConformity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE multiple non-conformities
router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    await NonConformity.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Error deleting nonconformities', error: err });
  }
});


module.exports = router;

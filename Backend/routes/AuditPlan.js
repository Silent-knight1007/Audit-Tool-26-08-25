// const express = require('express');
// const router = express.Router();
// const AuditPlan = require('../models/AuditPlan');

// router.post('/', async (req, res) => {
//   try {
//     const auditPlan = new AuditPlan(req.body);
//     await auditPlan.save();
//     res.status(200).json({ message: 'AuditPlan saved' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const AuditPlan = require('../models/AuditPlan'); // Adjust path if needed

// 🔸 POST: Save new AuditPlan
router.post('/', async (req, res) => {
  try {
    const audit = new AuditPlan(req.body);
    await audit.save();
    res.status(200).json({ message: 'Audit Plan saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔸 GET: Fetch all Audit Plans
router.get('/', async (req, res) => {
  try {
    const audits = await AuditPlan.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // 🔸 GET: Fetch a single Audit Plan by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const audit = await AuditPlan.findById(req.params.id);
//     if (!audit) {
//       return res.status(404).json({ message: 'Audit Plan not found' });
//     }
//     res.json(audit);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // 🔸 PUT: Update an Audit Plan by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const audit = await AuditPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!audit) {
//       return res.status(404).json({ message: 'Audit Plan not found' });
//     }
//     res.json({ message: 'Audit Plan updated', audit });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// 🔸 DELETE: Delete multiple Audit Plans
router.delete('/', async (req, res) => {
  const { ids } = req.body;
  try {
    await AuditPlan.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Audit Plans deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Audit Plans', error: err });
  }
});

module.exports = router;

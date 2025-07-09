const express = require('express');
const router = express.Router();
const AuditPlan = require('../models/AuditPlan'); // Adjust path if needed

router.post('/', async (req, res) => {
  try {
    const newAudit = new AuditPlan(req.body);
    await newAudit.save();
    res.status(201).json({ id: newAudit.auditId });
  } catch (err) {
    console.error('AuditPlan POST error:', err);
     res.status(500).json({ error: err.message, details: err.errors });
  }
});

// router.post('/', async (req, res) => {
//   try {
//     // Generate next auditId
//     const lastAudit = await AuditPlan.findOne().sort({ auditId: -1 });
//     let newId = 'AUD001';
//     if (lastAudit && lastAudit.auditId) {
//       const lastIdNum = parseInt(lastAudit.auditId.replace('AUD', ''));
//       newId = `AUD${(lastIdNum + 1).toString().padStart(3, '0')}`;
//     }
//     // Save new audit
//     const newAudit = new AuditPlan({
//       ...req.body,
//       auditId: newId,
//       status: req.body.status || 'Planned'
//     });
//     await newAudit.save();
//     res.status(201).json({ id: newId });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create audit' });
//   }
// });


// // 🔸 POST: Save new AuditPlan
// router.post('/', async (req, res) => {
//   try {
//     const audit = new AuditPlan(req.body);
//     await audit.save();
//     res.status(200).json({ message: 'Audit Plan saved' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create a new audit with auto-generated ID
// router.post('/api/audits', async (req, res) => {

//   try {
//     // Get the last audit to determine next ID
//     const lastAudit = await AuditPlan.findOne().sort({ auditId: -1 });
    
//     let newId = 'AUD001'; // Default first ID
    
//     if (lastAudit && lastAudit.auditId) {
//       // Extract the number part and increment
//       const lastIdNum = parseInt(lastAudit.auditId.replace('AUD', ''));
//       newId = `AUD${(lastIdNum + 1).toString().padStart(3, '0')}`;
//     }
    
//     // Create a new audit with the generated ID
//     const newAudit = new AuditPlan({
//       auditId: newId,
//       // Other default fields can be set here
//       status: 'Planned'
//     });
    
//     await newAudit.save();
//     res.status(201).json({ id: newId });
//   } catch (err) {
//     console.error('Error creating audit:', err);
//     res.status(500).json({ error: 'Failed to create audit' });
//   }
// });


// 🔸 GET: Fetch all Audit Plans


router.get('/', async (req, res) => {
  try {
    const audits = await AuditPlan.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

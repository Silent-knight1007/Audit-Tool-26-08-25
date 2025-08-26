import express from 'express';
import NonConformity from '../models/NonConformity.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|doc|docx|pdf|xls|xlsx|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('File type not allowed'));
  }
});

// UPDATE a NonConformity by ID
router.put('/:id', upload.array('attachments'), async (req, res) => {
  try {
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }));
    }

    const updateData = {
      ...req.body,
    };
    if (attachments.length > 0) {
      updateData.attachments = attachments;
    }

    const updatedNC = await NonConformity.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedNC) {
      return res.status(404).json({ message: 'NonConformity not found' });
    }
    res.json(updatedNC);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to handle NonConformity form with attachments and validation
router.post('/', upload.array('attachments'), async (req, res) => {
  const requiredFields = [
    'auditId', 'ncDescription', 'ncClauseNo', 'ncType', 'dueDate', 'department',
    'responsibleperson', 'responsiblepersonmail', 'nclocation',
    'ncRootCause', 'ncstatus'
  ];

  // Check for missing fields
  const missing = requiredFields.filter(field => !req.body[field]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  try {
    // Prepare attachments array if files were uploaded
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path // or `uploads/${file.filename}`
      }));
    }

    // Create new NonConformity document
    const nc = new NonConformity({
      ...req.body,
      attachments
    });
    await nc.save();
    res.status(201).json({ message: 'NonConformity saved', ncId: nc.ncId });
  } catch (err) {
    console.error('NonConformity save error:', err);
    res.status(500).json({ error: 'Error saving NonConformity', details: err.message });
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

// GET a single NonConformity by ID
router.get('/:id', async (req, res) => {
  try {
    const nc = await NonConformity.findById(req.params.id);
    if (!nc) {
      return res.status(404).json({ message: 'NonConformity not found' });
    }
    res.json(nc);
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

export default router;

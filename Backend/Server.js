const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Audit = require('./models/AuditPlan'); // ✅ adjust path if needed
const auditPlanRoutes = require('./routes/AuditPlan');
const NonConformity = require('./models/NonConformity');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  // GET route to fetch audits
app.get('/audits', async (req, res) => {
  try {
    const audits = await Audit.find(); // Your Mongoose model
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // Express.js example
app.delete('/audits', async (req, res) => {
  const { ids } = req.body;
  try {
    await Audit.deleteMany({ _id: { $in: ids } }); // For MongoDB/Mongoose
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting audits', error: err });
  }
});

// // GET route to fetch audits
// app.get('/audits', async (req, res) => {
//   try {
//     const audits = await Audit.find(); // Your Mongoose model
//     res.json(audits);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get the last Audit entry (to generate next ID)
// app.get('/audits/last', async (req, res) => {
//   try {
//     const lastAudit = await Audit.findOne().sort({ auditId: -1 }).exec();
//     res.json(lastAudit || {});
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.use('/api/AuditPlan', require('./routes/AuditPlan'));
app.use('/api/NonConformity', require('./routes/NonConformity'));
app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

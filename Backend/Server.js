import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nonConformityRoutes from './routes/NonConformity.js';
import auditPlanRouter from './routes/AuditPlan.js';
import responsiblePersonRoutes from './routes/responsiblePerson.js';
import authRoutes from './routes/auth.js';
import Audit from './models/AuditPlan.js';
import NonConformity from './models/NonConformity.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/AuditPlan', auditPlanRouter);
app.use('/api/NonConformity', nonConformityRoutes);
app.use('/api/responsiblePerson', responsiblePersonRoutes);
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // If you want to keep this route

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// GET route to fetch audits
app.get('/audits', async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE route to delete multiple audits
app.delete('/audits', async (req, res) => {
  const { ids } = req.body;
  try {
    await Audit.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting audits', error: err });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

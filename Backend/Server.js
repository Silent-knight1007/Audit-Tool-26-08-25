import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nonConformityRoutes from './routes/NonConformity.js';
import auditPlanRouter from './routes/AuditPlan.js';
import responsiblePersonRoutes from './routes/responsiblePerson.js';
import authRoutes from './routes/auth.js';
import policyRoutes from './routes/Policy.js';
import guidelineRoutes from './routes/Guideline.js';
import templateRoutes from './routes/Template.js';
import certificateRoutes from './routes/Certificate.js';
import advisoryRoutes from './routes/Advisory.js';
import userRoutes from './routes/User.js';  // Check filename casing
import Audit from './models/AuditPlan.js';
import NonConformity from './models/NonConformity.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Static uploads folder served once
app.use('/uploads', express.static('uploads'));

// Optional root route
app.get('/', (req, res) => res.send('API is running'));

// API route registrations
app.use('/api/policies', policyRoutes);
app.use('/api/guidelines', guidelineRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/AuditPlan', auditPlanRouter);
app.use('/api/NonConformity', nonConformityRoutes);
app.use('/api/responsiblePerson', responsiblePersonRoutes);
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Optional

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get('/audits', async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/audits', async (req, res) => {
  const { ids } = req.body;
  try {
    await Audit.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting audits', error: err });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import nonConformityRoutes from './routes/NonConformity.js';
// import auditPlanRouter from './routes/AuditPlan.js';
// import responsiblePersonRoutes from './routes/responsiblePerson.js';
// import authRoutes from './routes/auth.js';
// import Audit from './models/AuditPlan.js';
// import policyRoutes from './routes/Policy.js';  // Adjust path if needed
// import guidelineRoutes from './routes/Guideline.js';
// import templateRoutes from './routes/Template.js';
// import certificateRoutes from './routes/Certificate.js';
// import advisoryRoutes from './routes/Advisory.js';
// import NonConformity from './models/NonConformity.js';
// import userRoutes from './routes/User.js';  // Adjust path if necessary


// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/api/policies', policyRoutes);
// app.use('/api/guidelines', guidelineRoutes);
// app.use('/api/templates', templateRoutes);
// app.use('/api/certificates', certificateRoutes);
// app.use('/api/advisories', advisoryRoutes);
// app.use('/api/user', userRoutes);

// app.use('/uploads', express.static('uploads'));

// // Serve uploaded files statically
// app.use('/uploads', express.static('uploads'));

// // API routes
// app.use('/api/AuditPlan', auditPlanRouter);
// app.use('/api/NonConformity', nonConformityRoutes);
// app.use('/api/responsiblePerson', responsiblePersonRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/auth', authRoutes); // If you want to keep this route


// const PORT = process.env.PORT || 5000;

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // GET route to fetch audits
// app.get('/audits', async (req, res) => {
//   try {
//     const audits = await Audit.find();
//     res.json(audits);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE route to delete multiple audits
// app.delete('/audits', async (req, res) => {
//   const { ids } = req.body;
//   try {
//     await Audit.deleteMany({ _id: { $in: ids } });
//     res.status(200).json({ message: 'Deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting audits', error: err });
//   }
// });

// // Error handler middleware
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err.stack);
//   res.status(500).json({ message: "Something went wrong!", error: err.message });
// });


// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require('mongoose');

// // Counter schema/model
// const counterSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   seq: { type: Number, default: 0 }
// });
// const Counter = mongoose.model('Counter', counterSchema);

// Audit Plan schema/model
const auditplanSchema = new mongoose.Schema({
  auditId: { type: String, unique: true }, // Ensure uniqueness
  auditType: String,
  standards: {
  type: [String],
  required: true, // if you want at least one standard selected
  validate: [arr => arr.length > 0, 'At least one standard must be selected.']
  },
  location: String,
  leadAuditor: String,
  auditTeam: [{ type: String }],
  plannedDate: Date,
  status: String,
  actualDate: Date,
  criteria: String,
  scope: String
});

// Auto-generate AUDxxx ID before saving
auditplanSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    // Get all existing auditIds from the Audit collection
    const audits = await mongoose.model('Audit').find({}, 'auditId').lean();

    // Extract numeric parts of auditIds and sort them
    const usedNumbers = audits
      .map(a => parseInt(a.auditId.replace('AUD', ''), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    // Find the smallest unused number starting from 1
    let newNumber = 1;
    for (const num of usedNumbers) {
      if (num === newNumber) {
        newNumber++;
      } else if (num > newNumber) {
        break;
      }
    }

    // Assign the new auditId
    this.auditId = `AUD${newNumber.toString().padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.Audit || mongoose.model('Audit', auditplanSchema);

// auditplanSchema.pre('save', async function (next) {
//   if (!this.isNew) return next();

//   try {
//     const counter = await Counter.findByIdAndUpdate(
//       { _id: 'auditId' },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     this.auditId = `AUD${counter.seq.toString().padStart(3, '0')}`;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });



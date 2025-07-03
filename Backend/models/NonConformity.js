const mongoose = require('mongoose');

const nonConformitySchema = new mongoose.Schema({
  ncId: { type: String, unique: true }, // Auto-generated, unique, e.g. NC001
  ncDescription: String,
  ncClauseNo: String,
  ncType: String,
  dueDate: Date,
  department: String,
  responsibleperson: String,
  responsiblepersonmail: String,
  nclocation: String,
  ncCorrectiveAction: String,
  ncPreventiveAction: String,
  ncRootCause: String,
  ncstatus: String,
  // ...add other fields as needed
});

// Pre-save hook to auto-generate the lowest available ncId
nonConformitySchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    // Find all existing ncIds in the collection
    const ncs = await mongoose.model('NonConformity').find({}, 'ncId').lean();

    // Extract numeric part and sort
    const usedNumbers = ncs
      .map(nc => parseInt((nc.ncId || '').replace('NC', ''), 10))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    // Find the smallest unused number starting from 1
    let newNumber = 1;
    for (const num of usedNumbers) {
      if (num === newNumber) newNumber++;
      else if (num > newNumber) break;
    }

    // Assign the auto-generated ncId
    this.ncId = `NC${newNumber.toString().padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.NonConformity || mongoose.model('NonConformity', nonConformitySchema);

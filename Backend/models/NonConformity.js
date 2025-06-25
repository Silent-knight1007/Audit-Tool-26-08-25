const mongoose = require('mongoose');

const nonConformitySchema = new mongoose.Schema({
  ncId: String, 
  ncDescription: String,
  ncClauseNo: String,
  ncType: String,
  dueDate: Date,
  department:String,
  responsibleperson: String,
  responsiblepersonmail: String,
  nclocation: String,
  ncCorrectiveAction: String,
  ncPreventiveAction: String,
  ncRootCause:String,
  ncstatus: String
  });

module.exports = mongoose.model('NonConformity', nonConformitySchema);


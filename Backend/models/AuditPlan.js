// const mongoose = require('mongoose');

// const auditplanSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   message: String,
  
// });

// module.exports = mongoose.model('Audit', auditplanSchema);

const mongoose = require('mongoose');

const auditplanSchema = new mongoose.Schema({
  auditId: String, 
  auditType: String,
  standards: String,
  location: String,
  leadAuditor: String,
  auditTeam: [{type:String}],
  plannedDate: Date,
  status: String,
  actualDate: Date,
  criteria:String,
  scope:String
  });

module.exports = mongoose.models.Audit || mongoose.model('Audit', auditplanSchema);



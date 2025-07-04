const mongoose = require('mongoose');

const ResponsiblePersonSchema = new mongoose.Schema({
  name: String,
  email: String,
});



module.exports = mongoose.models.ResponsiblePerson || mongoose.model('ResponsiblePerson', ResponsiblePersonSchema);
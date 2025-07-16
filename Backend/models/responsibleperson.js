import mongoose from 'mongoose';

const ResponsiblePersonSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const ResponsiblePerson = mongoose.model('ResponsiblePerson', ResponsiblePersonSchema);

export default ResponsiblePerson;

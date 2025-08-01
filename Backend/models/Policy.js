import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  serialNumber: { type: String, required: true },
  documentId: { type: String, required: true },
  documentName: { type: String, required: true },
  description: { type: String, required: true },
  versionNumber: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  applicableStandard: { type: String, required: true }
}, { timestamps: true });

const Policy = mongoose.model('Policy', policySchema);

export default Policy;

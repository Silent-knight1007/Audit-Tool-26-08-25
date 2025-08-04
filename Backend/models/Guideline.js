import mongoose from 'mongoose';

const guidelineSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true },
  documentId: { type: String, required: true, unique: true },
  documentName: { type: String, required: true },
  description: { type: String },
  versionNumber: { type: String },
  releaseDate: { type: Date },
  applicableStandard: { type: String },
}, { timestamps: true });

const Guideline = mongoose.model('Guideline', guidelineSchema);

export default Guideline;



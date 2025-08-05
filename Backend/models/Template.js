import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  documentName: { type: String, required: true },
  description: { type: String },
  versionNumber: { type: String },
  releaseDate: { type: Date },
  applicableStandard: { type: String },
}, { timestamps: true });

const Template = mongoose.model('Template', templateSchema);

export default Template;

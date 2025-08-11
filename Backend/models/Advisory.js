import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  name: String,
  originalName: String,
  path: String,
  mimeType: String,
  size: Number,
});

const advisorySchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  documentName: { type: String, required: true },
  description: { type: String },
  versionNumber: { type: String },
  releaseDate: { type: Date },
  applicableStandard: [{ type: String }],
  attachments: [attachmentSchema],
}, { timestamps: true });

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;

import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  name: String,          // stored filename on disk/server
  originalName: String,  // original filename uploaded by user
  path: String,          // full file path
  mimeType: String,      // file MIME type
  size: Number,          // file size in bytes
});

const certificateSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  documentName: { type: String, required: true },
  description: { type: String },
  versionNumber: { type: String },
  releaseDate: { type: Date },
  applicableStandard: { type: String },
  attachments: [attachmentSchema],
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;


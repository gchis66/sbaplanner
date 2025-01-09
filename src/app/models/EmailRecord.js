import mongoose from "mongoose";

const emailRecordSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  businessStatus: {
    type: String,
    required: true,
    enum: ["new", "established"],
  },
  planContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sentSuccessfully: {
    type: Boolean,
    default: false,
  },
});

// Prevent duplicate model initialization
const EmailRecord =
  mongoose.models.EmailRecord ||
  mongoose.model("EmailRecord", emailRecordSchema);

export default EmailRecord;

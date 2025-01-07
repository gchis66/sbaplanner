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
    enum: ["new", "established"],
    required: true,
  },
  sentDate: {
    type: Date,
    default: Date.now,
  },
  planContent: {
    type: String,
    required: true,
  },
});

// Prevent duplicate model initialization
const EmailRecord =
  mongoose.models.EmailRecord ||
  mongoose.model("EmailRecord", emailRecordSchema);

export default EmailRecord;

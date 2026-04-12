import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    source: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    language: {
      type: String,
      required: true,
      trim: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Ongoing', 'Closed', 'Scheduled'],
      default: 'Ongoing'
    },
    type: {
      type: String,
      enum: ['Hot', 'Warm', 'Cold', 'Scheduled'],
      default: 'Warm'
    },
    scheduledDate: {
      type: Date,
      default: null
    },
    notes: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Indexes for performance
LeadSchema.index({ language: 1 });
LeadSchema.index({ assignedTo: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ language: 1, assignedTo: 1 });

export default mongoose.model('Lead', LeadSchema);

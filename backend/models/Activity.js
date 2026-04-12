import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['LeadAssigned', 'LeadStatusUpdated', 'EmployeeCreated', 'EmployeeDeleted', 'EmployeeUpdated'],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null
    },
    description: {
      type: String,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

// Index for faster queries
ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ userId: 1 });

export default mongoose.model('Activity', ActivitySchema);

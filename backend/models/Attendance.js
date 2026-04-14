import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    checkInTime: {
      type: Date,
      default: null
    },
    checkOutTime: {
      type: Date,
      default: null
    },
    breaks: [
      {
        startTime: Date,
        endTime: Date
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false }
);

// Index for faster queries
AttendanceSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Attendance', AttendanceSchema);

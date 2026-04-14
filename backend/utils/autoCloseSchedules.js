import Lead from '../models/Lead.js';

/**
 * Auto-close leads that have passed their scheduled date
 * Runs periodically to check for expired scheduled leads
 */
export const autoCloseExpiredSchedules = async () => {
  try {
    const now = new Date();

    // Find all leads with Scheduled type and scheduledDate < now
    const expiredLeads = await Lead.find({
      type: 'Scheduled',
      scheduledDate: { $lt: now },
      status: { $ne: 'Closed' } // Don't close already closed leads
    });

    if (expiredLeads.length === 0) {
      console.log('✓ No expired scheduled leads to close');
      return;
    }

    console.log(`🔄 Found ${expiredLeads.length} expired scheduled leads. Closing...`);

    // Update all expired leads to Closed status
    const result = await Lead.updateMany(
      {
        type: 'Scheduled',
        scheduledDate: { $lt: now },
        status: { $ne: 'Closed' }
      },
      {
        status: 'Closed',
        updatedAt: new Date()
      }
    );

    console.log(`✅ Successfully closed ${result.modifiedCount} expired scheduled leads`);

    // Log for debugging
    expiredLeads.forEach(lead => {
      console.log(`   - Lead: ${lead.name} (Scheduled: ${lead.scheduledDate})`);
    });

  } catch (error) {
    console.error('❌ Error in auto-close scheduled leads job:', error.message);
  }
};

/**
 * Start the auto-close job to run every 5 minutes
 */
export const startAutoCloseJob = () => {
  console.log('🚀 Starting auto-close scheduled leads job (runs every 5 minutes)...');
  
  // Run immediately on startup
  autoCloseExpiredSchedules();

  // Run every 5 minutes (300000 ms)
  setInterval(() => {
    autoCloseExpiredSchedules();
  }, 5 * 60 * 1000);
};

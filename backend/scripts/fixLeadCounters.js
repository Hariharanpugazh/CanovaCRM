import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cuvutee';
console.log(`🔗 Connecting to: ${mongoUri}\n`);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function fixLeadCounters() {
  try {
    console.log('🔧 Starting lead counter fix...\n');

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users\n`);

    for (const user of users) {
      // Count actual assigned leads
      const assignedCount = await Lead.countDocuments({ assignedTo: user._id, status: { $ne: 'Closed' } });
      
      // Count closed leads
      const closedCount = await Lead.countDocuments({ assignedTo: user._id, status: 'Closed' });

      console.log(`👤 ${user.name} (${user.employeeId})`);
      console.log(`   Current: assignedLeads=${user.assignedLeads}, closedLeads=${user.closedLeads}`);
      console.log(`   Should be: assignedLeads=${assignedCount}, closedLeads=${closedCount}`);

      // Update if numbers don't match
      if (user.assignedLeads !== assignedCount || user.closedLeads !== closedCount) {
        await User.findByIdAndUpdate(user._id, {
          assignedLeads: assignedCount,
          closedLeads: closedCount
        });
        console.log(`   ✅ Updated!\n`);
      } else {
        console.log(`   ✓ Already correct\n`);
      }
    }

    console.log('✨ Lead counter fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing counters:', error.message);
    process.exit(1);
  }
}

fixLeadCounters();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cuvutee');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cuvutee.com',
      password: 'admin123',
      role: 'Admin',
      status: 'Active',
      languages: ['Marathi', 'Kannada', 'Hindi', 'English', 'Bengali'],
      employeeId: 'ADMIN001'
    });
    console.log('\n✅ Admin User Created:');
    console.log('   Email: admin@cuvutee.com');
    console.log('   Password: admin123');
    console.log('   Employee ID: ADMIN001\n');

    // Create Sales User 1 (Marathi)
    const marathiUser = await User.create({
      name: 'Raj Marathi',
      email: 'raj.marathi@cuvutee.com',
      password: 'marathi123',
      role: 'SalesUser',
      status: 'Active',
      languages: ['Marathi'],
      employeeId: 'EMP00001'
    });
    console.log('✅ Sales User 1 Created (Marathi):');
    console.log('   Email: raj.marathi@cuvutee.com');
    console.log('   Password: marathi123');
    console.log('   Employee ID: EMP00001');
    console.log('   Language: Marathi\n');

    // Create Sales User 2 (Kannada)
    const kannadaUser = await User.create({
      name: 'Aruna Kannada',
      email: 'aruna.kannada@cuvutee.com',
      password: 'kannada123',
      role: 'SalesUser',
      status: 'Active',
      languages: ['Kannada'],
      employeeId: 'EMP00002'
    });
    console.log('✅ Sales User 2 Created (Kannada):');
    console.log('   Email: aruna.kannada@cuvutee.com');
    console.log('   Password: kannada123');
    console.log('   Employee ID: EMP00002');
    console.log('   Language: Kannada\n');

    // Create Sales User 3 (Hindi)
    const hindiUser = await User.create({
      name: 'Priya Hindi',
      email: 'priya.hindi@cuvutee.com',
      password: 'hindi123',
      role: 'SalesUser',
      status: 'Active',
      languages: ['Hindi'],
      employeeId: 'EMP00003'
    });
    console.log('✅ Sales User 3 Created (Hindi):');
    console.log('   Email: priya.hindi@cuvutee.com');
    console.log('   Password: hindi123');
    console.log('   Employee ID: EMP00003');
    console.log('   Language: Hindi\n');

    // Create Sales User 4 (English)
    const englishUser = await User.create({
      name: 'Michael English',
      email: 'michael.english@cuvutee.com',
      password: 'english123',
      role: 'SalesUser',
      status: 'Active',
      languages: ['English'],
      employeeId: 'EMP00004'
    });
    console.log('✅ Sales User 4 Created (English):');
    console.log('   Email: michael.english@cuvutee.com');
    console.log('   Password: english123');
    console.log('   Employee ID: EMP00004');
    console.log('   Language: English\n');

    // Create Additional Sample Employees
    console.log('👥 Creating additional employees...\n');
    const additionalEmployees = [
      {
        name: 'Tanner Finsha',
        email: 'tanner.finsha@gmail.com',
        password: 'tanner.finsha@gmail.com',
        role: 'SalesUser',
        status: 'Active',
        languages: ['English', 'Kannada'],
        employeeId: 'EMP00005',
        assignedLeads: 5,
        closedLeads: 2,
        location: 'Bangalore'
      },
      {
        name: 'Emeto Winner',
        email: 'emetowinner@gmail.com',
        password: 'emetowinner@gmail.com',
        role: 'SalesUser',
        status: 'Active',
        languages: ['English'],
        employeeId: 'EMP00006',
        assignedLeads: 3,
        closedLeads: 1,
        location: 'Mumbai'
      },
      {
        name: 'Tasty Omah',
        email: 'tastyomah@gmail.com',
        password: 'tastyomah@gmail.com',
        role: 'SalesUser',
        status: 'Inactive',
        languages: ['Hindi', 'English'],
        employeeId: 'EMP00007',
        assignedLeads: 5,
        closedLeads: 0,
        location: 'Delhi'
      },
      {
        name: 'James Muriel',
        email: 'james.muriel@gmail.com',
        password: 'james.muriel@gmail.com',
        role: 'SalesUser',
        status: 'Inactive',
        languages: ['English'],
        employeeId: 'EMP00008',
        assignedLeads: 2,
        closedLeads: 0,
        location: 'Pune'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        password: 'sarah.johnson@gmail.com',
        role: 'SalesUser',
        status: 'Active',
        languages: ['English', 'Hindi'],
        employeeId: 'EMP00009',
        assignedLeads: 8,
        closedLeads: 3,
        location: 'Bangalore'
      },
      {
        name: 'Rohan Desai',
        email: 'rohan.desai@gmail.com',
        password: 'rohan.desai@gmail.com',
        role: 'SalesUser',
        status: 'Active',
        languages: ['Marathi', 'Hindi'],
        employeeId: 'EMP00010',
        assignedLeads: 6,
        closedLeads: 4,
        location: 'Mumbai'
      }
    ];

    const createdAdditionalEmployees = await User.insertMany(additionalEmployees);
    console.log(`✅ ${createdAdditionalEmployees.length} additional employees created\n`);

    // Create Sample Leads
    console.log('📝 Creating sample leads...\n');
    const currentDate = new Date();
    
    const leads = [
      {
        name: 'John Smith',
        email: 'john.smith@gmail.com',
        source: 'Referral',
        date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        location: 'Mumbai',
        language: 'English',
        assignedTo: englishUser._id,
        status: 'Ongoing',
        type: 'Warm'
      },
      {
        name: 'Sanjay Patel',
        email: 'sanjay.patel@gmail.com',
        source: 'Inbound',
        date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000),
        location: 'Mumbai',
        language: 'Marathi',
        assignedTo: marathiUser._id,
        status: 'Ongoing',
        type: 'Warm'
      },
      {
        name: 'Ramesh Rao',
        email: 'ramesh.rao@gmail.com',
        source: 'Referral',
        date: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000),
        location: 'Bangalore',
        language: 'Kannada',
        assignedTo: kannadaUser._id,
        status: 'Ongoing',
        type: 'Warm'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        source: 'Inbound',
        date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        location: 'Delhi',
        language: 'Hindi',
        assignedTo: hindiUser._id,
        status: 'Closed',
        type: 'Warm'
      },
      {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@gmail.com',
        source: 'Referral',
        date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        location: 'Pune',
        language: 'English',
        assignedTo: englishUser._id,
        status: 'Ongoing',
        type: 'Warm'
      },
      {
        name: 'Arjun Singh',
        email: 'arjun.singh@gmail.com',
        source: 'Inbound',
        date: new Date(),
        location: 'Mumbai',
        language: 'Marathi',
        assignedTo: marathiUser._id,
        status: 'Ongoing',
        type: 'Warm'
      },
      {
        name: 'Suresh Kumar',
        email: 'suresh.kumar@gmail.com',
        source: 'Referral',
        date: new Date(),
        location: 'Bangalore',
        language: 'Kannada',
        assignedTo: kannadaUser._id,
        status: 'Scheduled',
        type: 'Scheduled',
        scheduledDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        name: 'Deepak Verma',
        email: 'deepak.verma@gmail.com',
        source: 'Inbound',
        date: new Date(),
        location: 'Delhi',
        language: 'Hindi',
        assignedTo: hindiUser._id,
        status: 'Ongoing',
        type: 'Warm'
      }
    ];

    const createdLeads = await Lead.insertMany(leads);
    console.log(`✅ ${createdLeads.length} sample leads created\n`);

    // Update user stats
    await User.updateMany(
      { $or: [{ _id: marathiUser._id }, { _id: kannadaUser._id }, { _id: hindiUser._id }, { _id: englishUser._id }] },
      { $set: { assignedLeads: 2, closedLeads: 1 } }
    );
    console.log('✅ User statistics updated\n');

    console.log('═══════════════════════════════════════════════════');
    console.log('✨ DATABASE SEEDING COMPLETED!');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('� Summary:');
    console.log('  ✅ 1 Admin User created');
    console.log('  ✅ 10 Sales Users created');
    console.log('  ✅ 8 Sample Leads created\n');

    console.log('�🔐 Test Credentials:');
    console.log('\nAdmin Account:');
    console.log('  Email: admin@cuvutee.com');
    console.log('  Password: admin123\n');

    console.log('Sales Team:');
    console.log('  Email: raj.marathi@cuvutee.com | Password: marathi123');
    console.log('  Email: aruna.kannada@cuvutee.com | Password: kannada123');
    console.log('  Email: priya.hindi@cuvutee.com | Password: hindi123');
    console.log('  Email: michael.english@cuvutee.com | Password: english123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

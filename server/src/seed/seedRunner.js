const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { users, events } = require('./seedData');

const runSeed = async () => {
  console.log('\n======================================================');
  console.log('🌱 SAHRDAYA CAMPUS EVENTHUB - SEED DATA RUNNER');
  console.log('Student: Alen (alen225001@sahrdaya.ac.in)');
  console.log('Institution: Sahrdaya College of Engineering & Technology');
  console.log('======================================================\n');

  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('✅ Collections cleared.');

    console.log('[Seed] Seeding college users...');
    const createdUsers = [];
    for (const u of users) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    console.log(`✅ ${createdUsers.length} users created.`);

    // Find organizers
    const alenUser = createdUsers.find((u) => u.email === 'alen225001@sahrdaya.ac.in');
    const iedcUser = createdUsers.find((u) => u.email === 'iedc@sahrdaya.ac.in');
    const anjaliUser = createdUsers.find((u) => u.email === 'anjali@sahrdaya.ac.in');
    const rahulUser = createdUsers.find((u) => u.email === 'rahul@sahrdaya.ac.in');

    console.log('[Seed] Seeding campus events (Mix of Free & Paid)...');
    const createdEvents = [];
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      // Alternate organizers
      const organizer = i % 2 === 0 ? alenUser : iedcUser;
      const created = await Event.create({
        ...e,
        organizer: organizer._id,
      });
      createdEvents.push(created);
    }
    console.log(`✅ ${createdEvents.length} campus events created.`);

    console.log('[Seed] Creating sample digital entry passes with payment records...');
    // Anjali registers for TechNovus Hackathon (Free) & PyTorch Workshop (Paid ₹199)
    const pass1 = await Registration.create({
      event: createdEvents[0]._id,
      user: anjaliUser._id,
      ticketCode: 'SHR-EVT-749201',
      studentName: anjaliUser.name,
      studentEmail: anjaliUser.email,
      studentDepartment: anjaliUser.department,
      studentId: anjaliUser.studentId,
      phone: anjaliUser.phone,
      status: 'confirmed',
      isPaid: false,
      paymentAmount: 0,
      paymentStatus: 'not_applicable',
      paymentMethod: 'Free',
    });

    const pass2 = await Registration.create({
      event: createdEvents[1]._id,
      user: anjaliUser._id,
      ticketCode: 'SHR-EVT-839210',
      studentName: anjaliUser.name,
      studentEmail: anjaliUser.email,
      studentDepartment: anjaliUser.department,
      studentId: anjaliUser.studentId,
      phone: anjaliUser.phone,
      status: 'attended',
      attendedAt: new Date(),
      isPaid: true,
      paymentAmount: 199,
      paymentId: 'SHR-PAY-492019',
      paymentMethod: 'UPI / QR',
      paymentStatus: 'completed',
      paymentDate: new Date(),
    });

    // Rahul registers for BME Seminar (Free) & Sargam Cultural Fest (Paid ₹250)
    const pass3 = await Registration.create({
      event: createdEvents[3]._id,
      user: rahulUser._id,
      ticketCode: 'SHR-EVT-992014',
      studentName: rahulUser.name,
      studentEmail: rahulUser.email,
      studentDepartment: rahulUser.department,
      studentId: rahulUser.studentId,
      phone: rahulUser.phone,
      status: 'confirmed',
      isPaid: false,
      paymentAmount: 0,
      paymentStatus: 'not_applicable',
      paymentMethod: 'Free',
    });

    const pass4 = await Registration.create({
      event: createdEvents[2]._id,
      user: rahulUser._id,
      ticketCode: 'SHR-EVT-102938',
      studentName: rahulUser.name,
      studentEmail: rahulUser.email,
      studentDepartment: rahulUser.department,
      studentId: rahulUser.studentId,
      phone: rahulUser.phone,
      status: 'confirmed',
      isPaid: true,
      paymentAmount: 250,
      paymentId: 'SHR-PAY-882104',
      paymentMethod: 'Debit/Credit Card',
      paymentStatus: 'completed',
      paymentDate: new Date(),
    });

    console.log('✅ Sample passes seeded successfully.\n');
    console.log('======================================================');
    console.log('🚀 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Demo Accounts:');
    console.log('1. Student Lead (Organizer): alen225001@sahrdaya.ac.in / password123');
    console.log('2. College Admin:           admin@sahrdaya.ac.in / password123');
    console.log('3. Student (Anjali):        anjali@sahrdaya.ac.in / password123');
    console.log('4. Student (Rahul):         rahul@sahrdaya.ac.in / password123');
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

runSeed();

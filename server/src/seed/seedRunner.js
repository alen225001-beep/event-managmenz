const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const { seedUsers, getSeedItems } = require('./seedData');

dotenv.config();

const runSeed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Claim.deleteMany({}),
    ]);

    console.log('[Seed] Inserting users...');
    const createdUsers = [];
    for (const u of seedUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const usersMap = {};
    createdUsers.forEach((u) => {
      usersMap[u.email] = u._id;
    });

    console.log(`[Seed] Seeded ${createdUsers.length} users successfully.`);

    console.log('[Seed] Inserting campus items...');
    const seedItems = getSeedItems(usersMap);
    const createdItems = await Item.insertMany(seedItems);
    console.log(`[Seed] Seeded ${createdItems.length} campus items.`);

    // Create a sample claim on the Casio calculator from student Alen
    const calcItem = createdItems.find((i) => i.title.includes('Casio'));
    const claimantUser = createdUsers.find(
      (u) => u.email === 'alen225001@sahrdaya.ac.in'
    );

    if (calcItem && claimantUser) {
      await Claim.create({
        item: calcItem._id,
        claimant: claimantUser._id,
        proofDescription:
          'This is my calculator from Sahrdaya CS semester 4. On the back cover under the battery lid, there is a small blue star sticker with my initials "AM". Also, the cover has a small scratch next to the shift button.',
        contactPhone: '+91 98470 12345',
        status: 'PENDING',
      });
      console.log('[Seed] Seeded sample ownership claim on Casio Calculator.');
    }

    console.log('\n=========================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('Demo Credentials for Sahrdaya Campus Portal:');
    console.log('1. Student (Alen):');
    console.log('   Email:    alen225001@sahrdaya.ac.in');
    console.log('   Password: password123');
    console.log('2. Campus Security Desk:');
    console.log('   Email:    security@sahrdaya.ac.in');
    console.log('   Password: password123');
    console.log('3. College Admin:');
    console.log('   Email:    admin@sahrdaya.ac.in');
    console.log('   Password: password123');
    console.log('=========================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;

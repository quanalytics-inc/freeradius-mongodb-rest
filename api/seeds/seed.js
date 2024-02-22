'use strict';
var mongoose = require('mongoose');
var Profiles = mongoose.model('Profiles');

// Sample data
const sampleProfiles = [
  {
    'profile-name': 'Basic',
    MaxDownload: 100,
    MaxUpload: 50,
    AccessPeriod: 30,
  },
  {
    'profile-name': 'Premium',
    MaxDownload: 500,
    MaxUpload: 200,
    AccessPeriod: 90,
  },
  // Add more sample profiles as needed
];

exports.seedDatabase = async function () {
  try {
    for (const profileData of sampleProfiles) {
      // Use upsert operation to insert or update based on profile-name uniqueness
      await Profiles.updateOne(
        { 'profile-name': profileData['profile-name'] },
        profileData,
        { upsert: true }
      );
    }
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection after seeding
    mongoose.disconnect();
  }
};

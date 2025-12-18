// This file can be used to seed initial data into the database
// Run with: node scripts/seed.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { connectDatabase } = require('../src/config/database');
const ServiceCategory = require('../src/models/ServiceCategory');
const User = require('../src/models/User');
const WorkerProfile = require('../src/models/WorkerProfile');

const categories = [
  {
    name: 'Plumbing',
    description: 'All plumbing services and repairs',
    icon: 'plumbing-icon',
  },
  {
    name: 'Electrical',
    description: 'Electrical installation and repair services',
    icon: 'electrical-icon',
  },
  {
    name: 'Cleaning',
    description: 'Home and office cleaning services',
    icon: 'cleaning-icon',
  },
  {
    name: 'Carpentry',
    description: 'Woodworking and carpentry services',
    icon: 'carpentry-icon',
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting services',
    icon: 'painting-icon',
  },
  {
    name: 'Gardening',
    description: 'Landscaping and gardening services',
    icon: 'gardening-icon',
  },
];

const workerData = [
  {
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+919876543210',
    category: 'Plumbing',
    skills: ['Pipe Installation', 'Leak Repair', 'Drain Cleaning', 'Water Heater'],
    experience: 5,
    hourlyRate: 300,
    location: 'Mumbai, Maharashtra',
    bio: 'Expert plumber with 5 years of experience in residential and commercial plumbing. Specialized in pipe installation and leak repairs.',
  },
  {
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    phone: '+919876543211',
    category: 'Cleaning',
    skills: ['Home Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Sanitization'],
    experience: 3,
    hourlyRate: 200,
    location: 'Delhi, Delhi',
    bio: 'Professional cleaning service provider specializing in home and office deep cleaning with eco-friendly products.',
  },
  {
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@example.com',
    phone: '+919876543212',
    category: 'Electrical',
    skills: ['Wiring', 'Circuit Repair', 'Appliance Installation', 'Safety Inspection'],
    experience: 7,
    hourlyRate: 400,
    location: 'Bangalore, Karnataka',
    bio: 'Licensed electrician with 7 years of experience. Expert in home wiring, circuit repairs, and electrical safety.',
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+919876543213',
    category: 'Painting',
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Texture', 'Color Consultation'],
    experience: 4,
    hourlyRate: 250,
    location: 'Hyderabad, Telangana',
    bio: 'Creative painter with 4 years of experience in residential and commercial painting projects.',
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@example.com',
    phone: '+919876543214',
    category: 'Carpentry',
    skills: ['Furniture Making', 'Cabinet Installation', 'Wood Repair', 'Custom Woodwork'],
    experience: 8,
    hourlyRate: 350,
    location: 'Pune, Maharashtra',
    bio: 'Master carpenter with 8 years of experience creating custom furniture and woodwork solutions.',
  },
  {
    firstName: 'Anjali',
    lastName: 'Gupta',
    email: 'anjali.gupta@example.com',
    phone: '+919876543215',
    category: 'Gardening',
    skills: ['Lawn Care', 'Plant Maintenance', 'Landscaping', 'Garden Design'],
    experience: 6,
    hourlyRate: 280,
    location: 'Jaipur, Rajasthan',
    bio: 'Experienced gardener specializing in lawn care, landscaping, and creating beautiful outdoor spaces.',
  },
  {
    firstName: 'Rajesh',
    lastName: 'Verma',
    email: 'rajesh.verma@example.com',
    phone: '+919876543216',
    category: 'Plumbing',
    skills: ['Bathroom Fitting', 'Kitchen Plumbing', 'Water Tank Installation', 'Pipe Welding'],
    experience: 10,
    hourlyRate: 450,
    location: 'Chennai, Tamil Nadu',
    bio: '10+ years of plumbing experience. Specialized in bathroom and kitchen installations.',
  },
  {
    firstName: 'Neha',
    lastName: 'Kapoor',
    email: 'neha.kapoor@example.com',
    phone: '+919876543217',
    category: 'Cleaning',
    skills: ['Carpet Cleaning', 'Window Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning'],
    experience: 2,
    hourlyRate: 180,
    location: 'Kolkata, West Bengal',
    bio: 'Detail-oriented cleaner with 2 years of experience providing top-quality cleaning services.',
  },
];

const seedDatabase = async () => {
  try {
    await connectDatabase();
    console.log('Connected to database, starting seed...');

    // Clear existing data
    await ServiceCategory.deleteMany({});
    await WorkerProfile.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert service categories
    const insertedCategories = await ServiceCategory.insertMany(categories);
    console.log(`${insertedCategories.length} service categories seeded successfully`);

    // Create worker users and profiles
    let workersCreated = 0;

    for (const worker of workerData) {
      // Create user account (password will be hashed by pre-save hook)
      const user = await User.create({
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        password: 'Worker@123',
        phone: worker.phone,
        role: 'WORKER',
        isActive: true,
      });

      // Find category ID
      const category = insertedCategories.find(cat => cat.name === worker.category);

      // Create worker profile
      await WorkerProfile.create({
        userId: user._id,
        category: category._id,
        skills: worker.skills,
        experience: worker.experience,
        hourlyRate: worker.hourlyRate,
        location: worker.location,
        bio: worker.bio,
        availability: {
          monday: { available: true, slots: ['09:00-17:00'] },
          tuesday: { available: true, slots: ['09:00-17:00'] },
          wednesday: { available: true, slots: ['09:00-17:00'] },
          thursday: { available: true, slots: ['09:00-17:00'] },
          friday: { available: true, slots: ['09:00-17:00'] },
          saturday: { available: true, slots: ['10:00-14:00'] },
          sunday: { available: false, slots: [] },
        },
        rating: {
          average: 4 + Math.random(),
          count: Math.floor(Math.random() * 50) + 10,
        },
        isVerified: Math.random() > 0.3, // 70% verified
        totalCompletedJobs: Math.floor(Math.random() * 100) + 20,
      });

      workersCreated++;
      console.log(`Created worker: ${worker.firstName} ${worker.lastName}`);
    }

    // Create admin user (password will be hashed by pre-save hook)
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@urbanskill.com',
      password: 'Admin@123',
      phone: '+919999999999',
      role: 'ADMIN',
      isActive: true,
    });
    console.log(`Created admin user`);

    console.log(`\n✅ Database seeded successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${insertedCategories.length}`);
    console.log(`   - Workers: ${workersCreated}`);
    console.log(`   - Admin: 1`);
    console.log(`\n🔐 Login credentials:`);
    console.log(`   📧 Admin Email: admin@urbanskill.com`);
    console.log(`   🔑 Admin Password: Admin@123`);
    console.log(`\n   📧 Worker Email: Any worker email from seed data`);
    console.log(`   🔑 Worker Password: Worker@123`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();

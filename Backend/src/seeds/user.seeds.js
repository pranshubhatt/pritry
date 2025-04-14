import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";

config();

const seedUsers = [
  // Female Users
  {
    email: "ananya.pachhola@example.com",
    fullName: "Ananya Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "isha.pachhola@example.com",
    fullName: "Isha Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "kiara.pachhola@example.com",
    fullName: "Kiara Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "saanvi.pachhola@example.com",
    fullName: "Saanvi Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "priya.pachhola@example.com",
    fullName: "Priya Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "aanya.pachhola@example.com",
    fullName: "Aanya Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "meera.pachhola@example.com",
    fullName: "Meera Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "radhika.pachhola@example.com",
    fullName: "Radhika Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "arjun.pachhola@example.com",
    fullName: "Arjun Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "vihaan.pachhola@example.com",
    fullName: "Vihaan Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "advait.pachhola@example.com",
    fullName: "Advait Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "krish.pachhola@example.com",
    fullName: "Krish Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "aaditya.pachhola@example.com",
    fullName: "Aaditya Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "siddharth.pachhola@example.com",
    fullName: "Siddharth Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "yuvraj.pachhola@example.com",
    fullName: "Yuvraj Pachhola",
    password: await bcrypt.hash("123456", 10),
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();

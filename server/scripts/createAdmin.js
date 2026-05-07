import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

if (!process.env.MONGODB_URI) {
  const rootEnv = path.resolve(process.cwd(), '.env');
  dotenv.config({ path: rootEnv });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\x1b[31m❌ MONGODB_URI not found.\x1b[0m');
  process.exit(1);
}

const dbName = MONGODB_URI.split('/').pop().split('?')[0] || 'unknown';
const isAtlas = MONGODB_URI.includes('mongodb+srv') || MONGODB_URI.includes('atlas');

const adminSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: { type: String, enum: ['superadmin', 'moderator'], default: 'moderator' },
  phone: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null }
}, { timestamps: true, collection: 'adminusers' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\x1b[36m🔌 Connecting...\x1b[0m');
  const conn = await mongoose.connect(MONGODB_URI);
  console.log(`\x1b[32m✅ Connected — ${isAtlas ? 'MongoDB Atlas' : 'MongoDB Local'}\x1b[0m`);
  console.log(`\x1b[36m   Database: ${dbName}\x1b[0m`);
  console.log(`\x1b[36m   Host: ${conn.connection.host}\x1b[0m\n`);

  const Admin = mongoose.model('AdminUser', adminSchema);

  console.log('\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log('\x1b[33m  Create New Admin User\x1b[0m');
  console.log('\x1b[36m═══════════════════════════════════════\x1b[0m\n');

  const fullName = await question('\x1b[37mFull Name: \x1b[0m');
  if (!fullName) {
    console.log('\x1b[31m❌ Full name is required.\x1b[0m');
    process.exit(1);
  }

  const email = await question('\x1b[37mEmail: \x1b[0m');
  if (!email || !email.includes('@')) {
    console.log('\x1b[31m❌ Valid email is required.\x1b[0m');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`\x1b[31m❌ Admin with email ${email} already exists.\x1b[0m`);
    console.log(`\x1b[33m   Use checkAdmin.js to manage existing admins.\x1b[0m`);
    process.exit(1);
  }

  const password = await question('\x1b[37mPassword (min 8 chars): \x1b[0m');
  if (!password || password.length < 8) {
    console.log('\x1b[31m❌ Password must be at least 8 characters.\x1b[0m');
    process.exit(1);
  }

  const phone = await question('\x1b[37mPhone (optional): \x1b[0m');

  console.log('\n\x1b[37mRole:\x1b[0m');
  console.log('1. Super Admin (full access)');
  console.log('2. Moderator (limited access)');
  const roleChoice = await question('\x1b[37mChoose (1/2): \x1b[0m');
  const role = roleChoice === '1' ? 'superadmin' : 'moderator';

  console.log('\n\x1b[36m🔐 Hashing Password:\x1b[0m');
  console.log(`\x1b[33m   Input: ${'*'.repeat(password.length)}\x1b[0m`);
  console.log('\x1b[33m   Generating salt (12 rounds)...\x1b[0m');

  const startTime = Date.now();
  const salt = await bcrypt.genSalt(12);
  console.log(`\x1b[33m   Salt: ${salt.substring(0, 29)}...\x1b[0m`);

  const hashedPassword = await bcrypt.hash(password, salt);
  const endTime = Date.now();

  console.log(`\x1b[33m   Hash: ${hashedPassword}\x1b[0m`);
  console.log(`\x1b[32m   ✅ Done in ${endTime - startTime}ms\x1b[0m`);

  const admin = await Admin.create({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    phone: phone || ''
  });

  console.log('\n\x1b[32m═══════════════════════════════════════\x1b[0m');
  console.log('\x1b[32m  ✅ Admin Created\x1b[0m');
  console.log('\x1b[32m═══════════════════════════════════════\x1b[0m');
  console.log(`\x1b[37m   Name:  ${admin.fullName}\x1b[0m`);
  console.log(`\x1b[37m   Email: ${admin.email}\x1b[0m`);
  console.log(`\x1b[37m   Role:  ${admin.role}\x1b[0m`);
  console.log(`\x1b[37m   ID:    ${admin._id}\x1b[0m`);
  console.log('\x1b[33m   ⚠️  Save the password. It cannot be recovered.\x1b[0m\n');

  await mongoose.disconnect();
  rl.close();
}

main().catch(err => {
  console.error('\x1b[31m❌ Error:\x1b[0m', err.message);
  process.exit(1);
});
import mongoose from 'mongoose';
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
  role: { type: String, enum: ['superadmin', 'moderator'] },
  phone: String,
  isActive: Boolean,
  loginAttempts: Number,
  lockUntil: Date
}, { timestamps: true, collection: 'adminusers' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function listAdmins(Admin) {
  const admins = await Admin.find({}).select('-__v').lean();

  if (admins.length === 0) {
    console.log('\n\x1b[33m⚠️  No admin users found.\x1b[0m');
    return [];
  }

  console.log('\n\x1b[36m══════════════════════════════════════════════════\x1b[0m');
  console.log(`\x1b[33m  Admin Users (${admins.length})\x1b[0m`);
  console.log('\x1b[36m══════════════════════════════════════════════════\x1b[0m');

  admins.forEach((admin, index) => {
    const roleColor = admin.role === 'superadmin' ? '\x1b[35m' : '\x1b[36m';
    const statusColor = admin.isActive ? '\x1b[32m' : '\x1b[31m';
    const status = admin.isActive ? 'ACTIVE' : 'INACTIVE';
    const locked = admin.lockUntil && new Date(admin.lockUntil) > new Date() ? ' \x1b[31m[LOCKED]\x1b[0m' : '';

    console.log(`\x1b[37m${index + 1}.\x1b[0m ${roleColor}${admin.fullName}\x1b[0m`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Status:   ${statusColor}${status}\x1b[0m${locked}`);
    console.log(`   ID:       ${admin._id}`);
    console.log(`   Created:  ${new Date(admin.createdAt).toLocaleString()}`);
    console.log('');
  });

  return admins;
}

async function manageAdmin(Admin) {
  const admins = await Admin.find({}).select('fullName email role isActive').lean();

  if (admins.length === 0) {
    console.log('\n\x1b[33m⚠️  No admin users to manage.\x1b[0m');
    return;
  }

  console.log('\n\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log('\x1b[33m  Manage Admin\x1b[0m');
  console.log('\x1b[36m═══════════════════════════════════════\x1b[0m\n');

  admins.forEach((admin, i) => {
    const status = admin.isActive ? '\x1b[32mACTIVE\x1b[0m' : '\x1b[31mINACTIVE\x1b[0m';
    console.log(`${i + 1}. ${admin.fullName} (${admin.email}) — ${admin.role} — ${status}`);
  });
  console.log(`${admins.length + 1}. Back`);

  const choice = await question('\n\x1b[37mSelect admin: \x1b[0m');
  const index = parseInt(choice) - 1;

  if (isNaN(index) || index < 0 || index >= admins.length) return;

  const selected = admins[index];
  const admin = await Admin.findById(selected._id);

  console.log(`\n\x1b[36mManaging: ${admin.fullName}\x1b[0m`);
  console.log('1. Change Role');
  console.log('2. Toggle Active/Inactive');
  console.log('3. Delete Admin');
  console.log('4. Back');

  const action = await question('\n\x1b[37mChoose action: \x1b[0m');

  if (action === '1') {
    const oldRole = admin.role;
    admin.role = oldRole === 'superadmin' ? 'moderator' : 'superadmin';
    await admin.save();
    console.log(`\n\x1b[32m✅ Role changed: ${oldRole} → ${admin.role}\x1b[0m`);
  } else if (action === '2') {
    admin.isActive = !admin.isActive;
    await admin.save();
    const status = admin.isActive ? '\x1b[32mACTIVE\x1b[0m' : '\x1b[31mINACTIVE\x1b[0m';
    console.log(`\n\x1b[32m✅ Status: ${status}\x1b[0m`);
  } else if (action === '3') {
    const confirm = await question(`\x1b[31mType "DELETE ${admin.fullName}" to confirm: \x1b[0m`);
    if (confirm === `DELETE ${admin.fullName}`) {
      await Admin.findByIdAndDelete(admin._id);
      console.log(`\n\x1b[32m✅ "${admin.fullName}" deleted.\x1b[0m`);
    } else {
      console.log('\n\x1b[33mCancelled.\x1b[0m');
    }
  }
}

async function showMenu(Admin) {
  while (true) {
    console.log('\n\x1b[36m═══════════════════════════════════════\x1b[0m');
    console.log('\x1b[33m  SupplySense Admin Manager\x1b[0m');
    console.log('\x1b[36m═══════════════════════════════════════\x1b[0m');
    console.log(`\x1b[37m  Database: ${dbName} (${isAtlas ? 'Atlas' : 'Local'})\x1b[0m\n`);
    console.log('1. List Admins');
    console.log('2. Manage Admin');
    console.log('3. Exit');

    const choice = await question('\n\x1b[37mChoose: \x1b[0m');

    if (choice === '1') {
      await listAdmins(Admin);
    } else if (choice === '2') {
      await manageAdmin(Admin);
    } else if (choice === '3') {
      break;
    }
  }
}

async function main() {
  console.log('\x1b[36m🔌 Connecting...\x1b[0m');
  const conn = await mongoose.connect(MONGODB_URI);
  console.log(`\x1b[32m✅ Connected — ${isAtlas ? 'MongoDB Atlas' : 'MongoDB Local'}\x1b[0m`);
  console.log(`\x1b[36m   Database: ${dbName}\x1b[0m`);
  console.log(`\x1b[36m   Host: ${conn.connection.host}\x1b[0m`);

  const Admin = mongoose.model('AdminUser', adminSchema);
  await showMenu(Admin);

  await mongoose.disconnect();
  console.log('\x1b[36m👋 Disconnected.\x1b[0m\n');
  rl.close();
}

main().catch(err => {
  console.error('\x1b[31m❌ Error:\x1b[0m', err.message);
  process.exit(1);
});
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
  console.log(`\x1b[36m   Host: ${conn.connection.host}\x1b[0m`);

  const collections = await conn.connection.db.listCollections().toArray();
  console.log(`\x1b[36m   Collections: ${collections.length}\x1b[0m\n`);

  console.log('\x1b[31m══════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[31m  🚨 DANGER: DROP ENTIRE DATABASE\x1b[0m');
  console.log('\x1b[31m══════════════════════════════════════════════════\x1b[0m');
  console.log(`\x1b[33m  This will permanently delete ALL ${collections.length} collection(s).\x1b[0m\n`);

  if (collections.length > 0) {
    collections.forEach(c => console.log(`\x1b[31m   - ${c.name}\x1b[0m`));
    console.log('');
  }

  const confirm = await question(`\x1b[31mType "DROP ${dbName}" to confirm: \x1b[0m`);

  if (confirm !== `DROP ${dbName}`) {
    console.log('\x1b[33mCancelled.\x1b[0m\n');
    await mongoose.disconnect();
    rl.close();
    return;
  }

  console.log('\x1b[33m🗑️  Dropping database...\x1b[0m');
  await conn.connection.db.dropDatabase();
  console.log(`\x1b[32m✅ Database "${dbName}" dropped.\x1b[0m\n`);

  await mongoose.disconnect();
  rl.close();
}

main().catch(err => {
  console.error('\x1b[31m❌ Error:\x1b[0m', err.message);
  process.exit(1);
});
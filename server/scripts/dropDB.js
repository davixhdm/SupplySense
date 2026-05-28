import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);

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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function dropEntireDB(conn) {
  console.log('\n\x1b[31m══════════════════════════════════════════════════\x1b[0m');
  console.log('\x1b[31m  🚨 DROP ENTIRE DATABASE\x1b[0m');
  console.log('\x1b[31m══════════════════════════════════════════════════\x1b[0m');
  console.log(`\x1b[33m  Database: ${dbName}\x1b[0m`);
  console.log(`\x1b[33m  Host:     ${isAtlas ? 'MongoDB Atlas' : 'MongoDB Local'}\x1b[0m`);
  console.log('\x1b[31m  This permanently deletes ALL data!\x1b[0m\n`);

  const confirm = await question(`\x1b[31mType "DROP ${dbName}" to confirm: \x1b[0m`);
  if (confirm !== `DROP ${dbName}`) { console.log('\x1b[33mCancelled.\x1b[0m\n'); return; }

  console.log('\x1b[33m🗑️  Dropping...\x1b[0m');
  await conn.connection.db.dropDatabase();
  console.log(`\x1b[32m✅ Database "${dbName}" dropped.\x1b[0m\n`);
}

async function dropCollection(conn) {
  const collections = await conn.connection.db.listCollections().toArray();
  const names = collections.map(c => c.name);

  if (names.length === 0) { console.log('\n\x1b[33m⚠️  No collections.\x1b[0m\n'); return; }

  console.log('\n\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log(`\x1b[33m  Collections (${names.length})\x1b[0m`);
  console.log('\x1b[36m═══════════════════════════════════════\x1b[0m\n');

  names.forEach((name, i) => console.log(`${i + 1}. ${name}`));
  console.log(`${names.length + 1}. Cancel`);

  const choice = await question('\n\x1b[37mSelect: \x1b[0m');
  const index = parseInt(choice) - 1;
  if (isNaN(index) || index < 0 || index >= names.length) { console.log('\x1b[33mCancelled.\x1b[0m\n'); return; }

  const selected = names[index];
  const confirm = await question(`\x1b[31mType "DROP ${selected}" to confirm: \x1b[0m`);
  if (confirm !== `DROP ${selected}`) { console.log('\x1b[33mCancelled.\x1b[0m\n'); return; }

  await conn.connection.db.dropCollection(selected);
  console.log(`\x1b[32m✅ "${selected}" dropped.\x1b[0m\n`);
}

async function showMenu(conn) {
  console.log('\n\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log('\x1b[31m  Drop Database Tool\x1b[0m');
  console.log('\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log(`\x1b[37m  DB: ${dbName} (${isAtlas ? 'Atlas' : 'Local'})\x1b[0m\n`);
  console.log('1. Drop Entire Database');
  console.log('2. Drop Single Collection');
  console.log('3. Exit');

  const choice = await question('\n\x1b[37mChoose: \x1b[0m');
  if (choice === '1') await dropEntireDB(conn);
  else if (choice === '2') await dropCollection(conn);
  else console.log('\x1b[33mExiting.\x1b[0m\n');
}

async function main() {
  console.log('\x1b[36m🔌 Connecting...\x1b[0m');
  const conn = await mongoose.connect(MONGODB_URI);
  console.log(`\x1b[32m✅ Connected — ${isAtlas ? 'Atlas' : 'Local'} | ${dbName}\x1b[0m`);
  await showMenu(conn);
  await mongoose.disconnect();
  rl.close();
  console.log('\x1b[36m👋 Done.\x1b[0m\n');
}

main().catch(err => { console.error('\x1b[31m❌ Error:\x1b[0m', err.message); process.exit(1); });
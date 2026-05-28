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

const FAQS = [
  { question: 'What is SupplySense?', answer: 'SupplySense is an AI-powered supply chain management platform that integrates with your existing ERP systems to provide predictive insights, real-time tracking, and smart recommendations for inventory, orders, suppliers, and customers.' },
  { question: 'How does the free trial work?', answer: 'You get 14 days of full access to the platform with no credit card required. After the trial, you can upgrade to a Standard or Pro+ plan to continue using the service.' },
  { question: 'Can I connect my existing ERP?', answer: 'Yes. SupplySense integrates with popular ERPs like Odoo, Zoho, SAP Business One, and Microsoft Dynamics. You can also import data via CSV.' },
  { question: 'What payment methods do you accept?', answer: 'We accept Stripe (credit/debit cards), M-Pesa (STK Push, Send Money, Paybill, and Till), and PayPal.' },
  { question: 'Is my data secure?', answer: 'Absolutely. Each organization\'s data is fully isolated. We use encryption, JWT authentication, and role-based access control.' },
  { question: 'How does the AI work?', answer: 'Our AI engine analyzes your historical data to predict stockouts, detect anomalies, score suppliers, predict churn, and recommend actions.' },
  { question: 'What currencies do you support?', answer: 'We support Kenyan Shilling (KSh), US Dollar (USD), Euro (EUR), and British Pound (GBP).' },
  { question: 'Can I add multiple users?', answer: 'Yes. Depending on your plan, you can add users with roles: Admin, Manager, and Department Users.' },
  { question: 'How do alerts work?', answer: 'Alerts trigger automatically for low stock, delayed orders, supplier drops, or unusual transactions via dashboard, email, SMS, or WhatsApp.' },
  { question: 'What happens when my trial expires?', answer: 'You lose dashboard access until you upgrade. All your data is preserved.' }
];

const TERMS = [
  { number: 1, title: 'Acceptance of Terms', content: 'By accessing or using SupplySense, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Service.' },
  { number: 2, title: 'Description of Service', content: 'SupplySense is an AI-powered supply chain management platform providing inventory tracking, supplier management, order tracking, customer management, employee management, and predictive analytics.' },
  { number: 3, title: 'User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and license key. Notify us immediately of unauthorized use.' },
  { number: 4, title: 'License Keys', content: 'Each organization receives a unique license key for device activation. Keys are non-transferable. Lost keys may not be recoverable.' },
  { number: 5, title: 'Subscription and Payments', content: 'Free trials are available for a limited duration. Paid plans are billed monthly, yearly, or as a one-time permanent payment.' },
  { number: 6, title: 'Refund Policy', content: 'Monthly subscriptions: no refunds for current period. Yearly: prorated refund within 30 days. Permanent: non-refundable after 14 days.' },
  { number: 7, title: 'Data Privacy', content: 'Each organization\'s data is isolated. We do not share, sell, or rent your data. You retain full ownership of your data.' },
  { number: 8, title: 'Service Availability', content: 'We strive for 99.9% uptime. Scheduled maintenance is announced in advance. We reserve the right to suspend violating accounts.' },
  { number: 9, title: 'Limitation of Liability', content: 'SupplySense Systems is not liable for indirect, incidental, or consequential damages. Liability is limited to amounts paid in the preceding 12 months.' },
  { number: 10, title: 'Termination', content: 'Either party may terminate at any time. Data retained for 30 days for export, then permanently deleted.' }
];

const PRIVACY = [
  { number: 1, title: 'Information We Collect', content: 'We collect registration information (name, email, phone), payment details, and usage data including login timestamps and IP addresses.' },
  { number: 2, title: 'How We Use Information', content: 'We use your information to provide the Service, process payments, communicate about your account, send alerts, and comply with legal obligations.' },
  { number: 3, title: 'Data Storage and Security', content: 'Data is stored on secure servers with encryption at rest and in transit. We use firewalls, intrusion detection, and regular security audits.' },
  { number: 4, title: 'Data Sharing', content: 'We do not sell, trade, or rent your data. We may share data with service providers (payment processors, email services) only as necessary.' },
  { number: 5, title: 'Cookies and Tracking', content: 'We use essential cookies for authentication. Analytics cookies help us improve the Service. You can control cookies through browser settings.' },
  { number: 6, title: 'Third-Party Services', content: 'The Service integrates with Stripe, M-Pesa, PayPal, and Brevo. Each has its own privacy policy. Review their policies.' },
  { number: 7, title: 'Data Retention', content: 'Data retained while account is active. After termination, data kept 30 days for export, then deleted. Backups retained up to 90 days.' },
  { number: 8, title: 'Your Rights', content: 'You can access, correct, export, or delete your data through the dashboard. Contact support for complete data export or deletion.' },
  { number: 9, title: 'Children\'s Privacy', content: 'The Service is not for individuals under 16. We do not knowingly collect data from children.' },
  { number: 10, title: 'Changes to This Policy', content: 'We will notify you of significant changes via email or dashboard. Continued use after changes means acceptance.' }
];

const COOKIES = [
  { number: 1, title: 'What Are Cookies', content: 'Cookies are small text files stored on your device that help websites remember preferences and login status.' },
  { number: 2, title: 'Essential Cookies', content: 'Required for authentication, security, and session management. The Service cannot function without these cookies.' },
  { number: 3, title: 'Preference Cookies', content: 'Remember settings like language, theme (dark/light mode), sidebar state, and dashboard layout preferences.' },
  { number: 4, title: 'Analytics Cookies', content: 'Help us understand how the Service is used. Data is aggregated and anonymized to improve the platform.' },
  { number: 5, title: 'Third-Party Cookies', content: 'Payment processors may set their own cookies during checkout. Review their cookie policies for details.' },
  { number: 6, title: 'Cookie Duration', content: 'Session cookies expire when you close the browser. Persistent cookies last 7-30 days depending on type.' },
  { number: 7, title: 'Managing Cookies', content: 'Control cookies through browser settings. Blocking essential cookies prevents use of the Service.' },
  { number: 8, title: 'Cookie Consent', content: 'A consent banner appears on first visit. Click "Accept" to agree to cookie use. Change preferences in browser settings.' },
  { number: 9, title: 'Do Not Track', content: 'We do not currently respond to Do Not Track signals as there is no industry standard.' },
  { number: 10, title: 'Updates to Cookie Policy', content: 'Changes will be communicated through the Service. Last update date displayed at top of policy.' }
];

const formatLegal = (items, title) => {
  let html = `<h1>${title}</h1>`;
  for (const item of items) html += `<h2>${item.number}. ${item.title}</h2><p>${item.content}</p>`;
  return html;
};

async function seedSettings() {
  console.log('\x1b[33m⏳ Seeding settings...\x1b[0m');
  const db = mongoose.connection.db;
  const collection = db.collection('systemsettings');
  
  let settings = await collection.findOne({});
  if (!settings) {
    await collection.insertOne({});
    settings = await collection.findOne({});
    console.log('  Created new settings document');
  } else {
    console.log('  Found existing settings');
  }

  await collection.updateOne({ _id: settings._id }, {
    $set: {
      systemName: 'SupplySense',
      licenseKeyPrefix: 'SSS',
      trialDuration: 14,
      brevoSender: 'noreply@supplysense.com',
      general: {
        email: 'support@supplysense.com',
        phone: '+254 700 000 000',
        address: 'Nairobi, Kenya',
        aboutContent: 'SupplySense is an AI-powered supply chain intelligence platform built for businesses that want to stop guessing and start knowing. We integrate with your existing ERP systems, pull in your operational data, and overlay predictive intelligence to help you make smarter decisions.',
        heroTitle: 'Intelligent Supply Chain Management',
        heroSubtitle: 'Predict, monitor, and optimize your supply chain with AI-powered insights. Connect your ERP and start making smarter decisions today.'
      }
    }
  });

  const updated = await collection.findOne({ _id: settings._id });
  console.log('  systemName:', updated.systemName);
  console.log('  general.email:', updated.general?.email);
  console.log('\x1b[32m✅ Settings seeded.\x1b[0m');
}

async function seedPlansAndCurrency() {
  console.log('\x1b[33m⏳ Seeding plans & currency...\x1b[0m');
  const db = mongoose.connection.db;
  const collection = db.collection('systemsettings');
  
  let settings = await collection.findOne({});
  if (!settings) {
    await collection.insertOne({});
    settings = await collection.findOne({});
    console.log('  Created new settings document');
  }

  await collection.updateOne({ _id: settings._id }, {
    $set: {
      paymentConfig: {
        stripeEnabled: true,
        mpesaEnabled: true,
        paypalEnabled: true,
        mpesaSubMethods: { stkPush: true, sendMoney: true, paybill: true, till: true },
        mpesaNumbers: { sendMoneyPhone: '0712345678', paybillBusinessNumber: '247247', paybillAccountName: 'SupplySense', tillNumber: '543210', tillBusinessName: 'SupplySense' },
        currency: 'KSh'
      },
      pricing: {
        trial: { duration: 14 },
        standard: { monthly: 750, yearly: 7500, permanent: 15000 },
        proplus: { monthly: 1050, yearly: 11000, permanent: 23000 }
      }
    }
  });

  const updated = await collection.findOne({ _id: settings._id });
  console.log('  currency:', updated.paymentConfig?.currency);
  console.log('  standard.monthly:', updated.pricing?.standard?.monthly);
  console.log('\x1b[32m✅ Plans & Currency seeded.\x1b[0m');
}

async function seedLegals() {
  console.log('\x1b[33m⏳ Seeding legal documents...\x1b[0m');
  const db = mongoose.connection.db;
  const collection = db.collection('systemsettings');
  
  let settings = await collection.findOne({});
  if (!settings) {
    await collection.insertOne({});
    settings = await collection.findOne({});
  }

  await collection.updateOne({ _id: settings._id }, {
    $set: {
      legal: {
        terms: formatLegal(TERMS, 'Terms and Conditions'),
        privacy: formatLegal(PRIVACY, 'Privacy Policy'),
        cookies: formatLegal(COOKIES, 'Cookies Policy')
      }
    }
  });

  const updated = await collection.findOne({ _id: settings._id });
  console.log('  terms length:', updated.legal?.terms?.length, 'chars');
  console.log('  privacy length:', updated.legal?.privacy?.length, 'chars');
  console.log('  cookies length:', updated.legal?.cookies?.length, 'chars');
  console.log('\x1b[32m✅ Legal documents seeded.\x1b[0m');
}

async function seedFAQs() {
  console.log('\x1b[33m⏳ Seeding FAQs...\x1b[0m');
  const db = mongoose.connection.db;
  const collection = db.collection('faqs');
  
  await collection.deleteMany({});
  const faqs = FAQS.map((faq, i) => ({ ...faq, order: i + 1, isActive: true, createdAt: new Date(), updatedAt: new Date() }));
  const result = await collection.insertMany(faqs);
  console.log(`  Inserted ${result.insertedCount} FAQs`);
  console.log('\x1b[32m✅ FAQs seeded.\x1b[0m');
}

async function seedAll() {
  await seedSettings();
  await seedPlansAndCurrency();
  await seedLegals();
  await seedFAQs();
  console.log('\n\x1b[32m✅ All data seeded successfully.\x1b[0m');
}

async function showMenu() {
  console.log('\n\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log('\x1b[33m  SupplySense — Database Seeder\x1b[0m');
  console.log('\x1b[36m═══════════════════════════════════════\x1b[0m');
  console.log(`\x1b[37m  Database: ${dbName} (${isAtlas ? 'Atlas' : 'Local'})\x1b[0m\n`);
  console.log('1. Seed All');
  console.log('2. Seed Settings');
  console.log('3. Seed Plans & Currency');
  console.log('4. Seed Legal Documents');
  console.log('5. Seed FAQs');
  console.log('6. Exit');

  const choice = await question('\n\x1b[37mChoose option: \x1b[0m');

  if (choice === '1') await seedAll();
  else if (choice === '2') await seedSettings();
  else if (choice === '3') await seedPlansAndCurrency();
  else if (choice === '4') await seedLegals();
  else if (choice === '5') await seedFAQs();
  else if (choice === '6') console.log('\x1b[33mExiting.\x1b[0m');
  else console.log('\x1b[31mInvalid option.\x1b[0m');
}

async function main() {
  console.log('\x1b[36m🔌 Connecting...\x1b[0m');
  const conn = await mongoose.connect(MONGODB_URI);
  console.log(`\x1b[32m✅ Connected — ${isAtlas ? 'Atlas' : 'Local'} | ${dbName}\x1b[0m`);
  await showMenu();
  await mongoose.disconnect();
  console.log('\x1b[36m👋 Done.\x1b[0m\n');
  rl.close();
}

main().catch(err => { console.error('\x1b[31m❌ Error:\x1b[0m', err.message); process.exit(1); });
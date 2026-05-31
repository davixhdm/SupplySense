import './dnsSet.js';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import env from './config/env.js';
import loggerMiddleware from './middleware/loggerMiddleware.js';

import adminAuthRoutes from './routes/admin/adminAuthRoutes.js';
import adminDashboardRoutes from './routes/admin/adminDashboardRoutes.js';
import applicationsRoutes from './routes/admin/applicationsRoutes.js';
import licenseRoutes from './routes/admin/licenseRoutes.js';
import pendingActivationRoutes from './routes/admin/pendingActivationRoutes.js';
import paymentRoutes from './routes/admin/paymentRoutes.js';
import paymentConfigRoutes from './routes/admin/paymentConfigRoutes.js';
import plansPricingRoutes from './routes/admin/plansPricingRoutes.js';
import systemLogsRoutes from './routes/admin/systemLogsRoutes.js';
import adminAnalyticsRoutes from './routes/admin/adminAnalyticsRoutes.js';
import systemSettingsRoutes from './routes/admin/systemSettingsRoutes.js';
import adminUserRoutes from './routes/admin/adminUserRoutes.js';
import legalRoutes from './routes/admin/legalRoutes.js';
import backupRoutes from './routes/admin/backupRoutes.js';

import clientAuthRoutes from './routes/client/clientAuthRoutes.js';
import dashboardRoutes from './routes/client/dashboardRoutes.js';
import transactionRoutes from './routes/client/transactionRoutes.js';
import orderRoutes from './routes/client/orderRoutes.js';
import inventoryRoutes from './routes/client/inventoryRoutes.js';
import supplierRoutes from './routes/client/supplierRoutes.js';
import customerRoutes from './routes/client/customerRoutes.js';
import employeeRoutes from './routes/client/employeeRoutes.js';
import aiInsightsRoutes from './routes/client/aiInsightsRoutes.js';
import alertRoutes from './routes/client/alertRoutes.js';
import companySettingsRoutes from './routes/client/companySettingsRoutes.js';
import preferencesRoutes from './routes/client/preferencesRoutes.js';
import clientUserRoutes from './routes/client/clientUserRoutes.js';
import deviceRoutes from './routes/client/deviceRoutes.js';
import clientBackupRoutes from './routes/client/clientBackupRoutes.js';
import erpRoutes from './routes/client/erpRoutes.js';
import landingRoutes from './routes/client/landingRoutes.js';


import { startScheduler } from './services/syncScheduler.js';

const app = express();

connectDB();

const allowedOrigins = [env.CLIENT_APP_URL, env.ADMIN_APP_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use('/api/payment/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.json({
    name: 'SupplySense Systems API',
    version: '1.0.0',
    description: 'AI-powered supply chain management platform',
    baseUrl: env.BASE_URL,
    clientUrl: env.CLIENT_APP_URL,
    adminUrl: env.ADMIN_APP_URL,
    endpoints: { api: '/api', health: '/health', admin: '/api/admin', client: '/api/client' }
  });
});

app.get('/api', (req, res) => {
  res.json({ message: 'SupplySense API', version: '1.0.0', admin: '/api/admin', client: '/api/client', health: '/health' });
});

app.get('/health', async (req, res) => {
  const mongooseState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime(), database: states[mongooseState] || 'unknown', environment: env.NODE_ENV, version: '1.0.0' });
});

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/applications', applicationsRoutes);
app.use('/api/admin/licenses', licenseRoutes);
app.use('/api/admin/pending-activations', pendingActivationRoutes);
app.use('/api/admin/payments', paymentRoutes);
app.use('/api/admin/payment-config', paymentConfigRoutes);
app.use('/api/admin/plans-pricing', plansPricingRoutes);
app.use('/api/admin/logs', systemLogsRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/settings', systemSettingsRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/legal', legalRoutes);
app.use('/api/admin/backups', backupRoutes);

app.use('/api/client/auth', clientAuthRoutes);
app.use('/api/client/dashboard', dashboardRoutes);
app.use('/api/client/transactions', transactionRoutes);
app.use('/api/client/orders', orderRoutes);
app.use('/api/client/inventory', inventoryRoutes);
app.use('/api/client/suppliers', supplierRoutes);
app.use('/api/client/customers', customerRoutes);
app.use('/api/client/employees', employeeRoutes);
app.use('/api/client/ai-insights', aiInsightsRoutes);
app.use('/api/client/alerts', alertRoutes);
app.use('/api/client/company-settings', companySettingsRoutes);
app.use('/api/client/preferences', preferencesRoutes);
app.use('/api/client/users', clientUserRoutes);
app.use('/api/client/devices', deviceRoutes);
app.use('/api/client/backups', clientBackupRoutes);
app.use('/api/client/erp', erpRoutes);
app.use('/api/landing', landingRoutes);

app.use((req, res) => { res.status(404).json({ message: 'Route not found.' }); });
app.use((err, req, res, next) => { console.error('\x1b[31mUnhandled error:\x1b[0m', err); res.status(500).json({ message: 'Internal server error.' }); });

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log('\n\x1b[35m╔══════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[35m║\x1b[0m      \x1b[33mSupplySense Systems API\x1b[0m          \x1b[35m║\x1b[0m');
  console.log('\x1b[35m╚══════════════════════════════════════╝\x1b[0m\n');
  console.log(`\x1b[32m🚀 Server running in ${env.NODE_ENV} mode\x1b[0m`);
  console.log(`\x1b[36m   Base URL:    ${env.BASE_URL}\x1b[0m`);
  console.log(`\x1b[36m   Client URL:  ${env.CLIENT_APP_URL}\x1b[0m`);
  console.log(`\x1b[36m   Admin URL:   ${env.ADMIN_APP_URL}\x1b[0m`);
  console.log(`\x1b[36m   AI Engine:   ${env.AI_ENGINE_URL}\x1b[0m`);
  console.log(`\x1b[32m   CORS allowed origins:\x1b[0m ${allowedOrigins.join(', ')}\n`);
  startScheduler();
});

export default app;
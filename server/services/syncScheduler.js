import ClientOrg from '../models/admin/ClientOrgModel.js';
import OdooConnector from './connectors/odooConnector.js';
import ZohoConnector from './connectors/zohoConnector.js';
import SAPConnector from './connectors/sapConnector.js';
import DynamicsConnector from './connectors/dynamicsConnector.js';
import ShopifyConnector from './connectors/shopifyConnector.js';
import WooCommerceConnector from './connectors/wooCommerceConnector.js';
import HDMConnector from './connectors/hdmConnector.js';
import SmartPOSConnector from './connectors/smartposConnector.js';
import Product from '../models/client/ProductModel.js';
import Supplier from '../models/client/SupplierModel.js';
import Customer from '../models/client/CustomerModel.js';
import Transaction from '../models/client/TransactionModel.js';
import Employee from '../models/client/EmployeeModel.js';
import AuditLog from '../models/admin/AuditLogModel.js';

const getConnector = (config) => {
  switch (config.type) {
    case 'odoo': return new OdooConnector({ url: config.url, apiKey: config.apiKey, database: config.database });
    case 'zoho': return new ZohoConnector({ url: config.url, apiKey: config.apiKey, organizationId: config.database });
    case 'sap': return new SAPConnector({ url: config.url, username: config.username, password: config.password, companyDB: config.database });
    case 'dynamics': return new DynamicsConnector({ url: config.url, accessToken: config.apiKey });
    case 'shopify': return new ShopifyConnector({ url: config.url, apiKey: config.apiKey });
    case 'woocommerce': return new WooCommerceConnector({ url: config.url, consumerKey: config.consumerKey, consumerSecret: config.consumerSecret });
    case 'hdm': return new HDMConnector({ url: config.url, apiKey: config.apiKey });
    case 'smartpos': return new SmartPOSConnector({ url: config.url, apiKey: config.apiKey });
    default: return null;
  }
};

const syncConnection = async (org, conn) => {
  const connector = getConnector(conn);
  if (!connector) return;

  const tenantId = org._id;
  const source = `erp-${conn._id}`;
  let count = 0;

  try {
    const products = await connector.pullProducts();
    if (products?.length) {
      for (const p of products) {
        await Product.findOneAndUpdate({ organizationId: tenantId, sku: p.sku }, { ...p, organizationId: tenantId, source }, { upsert: true, new: true });
      }
      count += products.length;
    }
  } catch (e) { console.warn(`[Sync] Products: ${e.message}`); }

  if (conn.type !== 'smartpos') {
    try {
      const suppliers = await connector.pullSuppliers?.();
      if (suppliers?.length) {
        for (const s of suppliers) {
          await Supplier.findOneAndUpdate({ organizationId: tenantId, email: s.email }, { ...s, organizationId: tenantId, source }, { upsert: true, new: true });
        }
        count += suppliers.length;
      }
    } catch (e) { console.warn(`[Sync] Suppliers: ${e.message}`); }
  }

  try {
    const customers = await connector.pullCustomers();
    if (customers?.length) {
      for (const c of customers) {
        await Customer.findOneAndUpdate({ organizationId: tenantId, email: c.email, fullName: c.fullName }, { ...c, organizationId: tenantId, source }, { upsert: true, new: true });
      }
      count += customers.length;
    }
  } catch (e) { console.warn(`[Sync] Customers: ${e.message}`); }

  if (conn.type === 'smartpos') {
    try {
      const sales = await connector.pullSales();
      if (sales?.length) {
        for (const sale of sales) {
          await Transaction.findOneAndUpdate({ organizationId: tenantId, transactionNumber: sale.transactionNumber }, { ...sale, organizationId: tenantId, source }, { upsert: true, new: true });
        }
        count += sales.length;
      }
    } catch (e) { console.warn(`[Sync] Sales: ${e.message}`); }
  } else {
    try {
      const invoices = await connector.pullInvoices?.();
      if (invoices?.length) {
        for (const inv of invoices) {
          await Transaction.findOneAndUpdate({ organizationId: tenantId, transactionNumber: inv.transactionNumber }, { ...inv, organizationId: tenantId, source }, { upsert: true, new: true });
        }
        count += invoices.length;
      }
    } catch (e) { console.warn(`[Sync] Invoices: ${e.message}`); }

    try {
      const employees = await connector.pullEmployees?.();
      if (employees?.length) {
        for (const emp of employees) {
          await Employee.findOneAndUpdate({ organizationId: tenantId, email: emp.email }, { ...emp, organizationId: tenantId, source }, { upsert: true, new: true });
        }
        count += employees.length;
      }
    } catch (e) { console.warn(`[Sync] Employees: ${e.message}`); }
  }

  conn.lastSync = new Date();
  await org.save();

  if (count > 0) {
    await AuditLog.create({
      organizationId: tenantId, action: 'Auto-synced', actionType: 'system_event',
      description: `Scheduler synced ${count} records from ${conn.name}`, severity: 'info'
    });
  }
};

const runScheduler = async () => {
  console.log('\x1b[36m[SyncScheduler] Checking connections...\x1b[0m');
  try {
    const orgs = await ClientOrg.find({ 'erpConnections.isActive': true });
    let synced = 0;
    for (const org of orgs) {
      for (const conn of org.erpConnections) {
        if (!conn.isActive) continue;
        const now = new Date();
        const lastSync = conn.lastSync || new Date(0);
        let shouldSync = false;

        switch (conn.syncInterval) {
          case 'realtime': shouldSync = (now - lastSync) > 5 * 60 * 1000; break;
          case 'hourly': shouldSync = (now - lastSync) > 60 * 60 * 1000; break;
          case 'daily': shouldSync = (now - lastSync) > 24 * 60 * 60 * 1000; break;
          case 'weekly': shouldSync = (now - lastSync) > 7 * 24 * 60 * 60 * 1000; break;
          case 'monthly': shouldSync = (now - lastSync) > 30 * 24 * 60 * 60 * 1000; break;
        }

        if (shouldSync) {
          console.log(`\x1b[33m[SyncScheduler] Syncing ${org.organizationName} → ${conn.name}\x1b[0m`);
          await syncConnection(org, conn);
          synced++;
        }
      }
    }
    if (synced > 0) console.log(`\x1b[32m[SyncScheduler] Synced ${synced} connection(s)\x1b[0m`);
  } catch (error) {
    console.error('\x1b[31m[SyncScheduler] Error:\x1b[0m', error.message);
  }
};

const startScheduler = (intervalMs = 60000) => {
  console.log(`\x1b[36m[SyncScheduler] Started — running every ${intervalMs / 1000}s\x1b[0m`);
  runScheduler();
  return setInterval(runScheduler, intervalMs);
};

export { startScheduler, syncConnection };
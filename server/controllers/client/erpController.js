import ClientOrg from '../../models/admin/ClientOrgModel.js';
import AuditLog from '../../models/admin/AuditLogModel.js';
import OdooConnector from '../../services/connectors/odooConnector.js';
import ZohoConnector from '../../services/connectors/zohoConnector.js';
import SAPConnector from '../../services/connectors/sapConnector.js';
import DynamicsConnector from '../../services/connectors/dynamicsConnector.js';
import ShopifyConnector from '../../services/connectors/shopifyConnector.js';
import WooCommerceConnector from '../../services/connectors/wooCommerceConnector.js';
import HDMConnector from '../../services/connectors/hdmConnector.js';
import SmartPOSConnector from '../../services/connectors/smartposConnector.js';
import Product from '../../models/client/ProductModel.js';
import Supplier from '../../models/client/SupplierModel.js';
import Customer from '../../models/client/CustomerModel.js';
import Order from '../../models/client/OrderModel.js';
import Transaction from '../../models/client/TransactionModel.js';
import Employee from '../../models/client/EmployeeModel.js';

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

const getConnections = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId).select('erpConnections');
    res.json(org?.erpConnections || []);
  } catch (error) { res.status(500).json({ message: 'Internal server error.' }); }
};

const addConnection = async (req, res) => {
  try {
    const { type, name, url, apiKey, username, password, database, consumerKey, consumerSecret, syncInterval } = req.body;
    const org = await ClientOrg.findById(req.user.organizationId);
    if (!org) return res.status(404).json({ message: 'Organization not found.' });

    org.erpConnections.push({ type, name, url, apiKey, username, password, database, consumerKey, consumerSecret, syncInterval: syncInterval || 'daily', isActive: true, lastSync: null });
    await org.save();

    await AuditLog.create({
      organizationId: req.user.organizationId, action: 'ERP connection added', actionType: 'settings_updated',
      performedBy: req.user._id, performedByModel: 'ClientUser', description: `Added ${type} ERP: ${name}`, severity: 'info'
    });
    res.status(201).json(org.erpConnections[org.erpConnections.length - 1]);
  } catch (error) { res.status(500).json({ message: 'Internal server error.' }); }
};

const testConnection = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId);
    const conn = org?.erpConnections.id(req.params.id);
    if (!conn) return res.status(404).json({ message: 'Connection not found.' });
    const connector = getConnector(conn);
    if (!connector) return res.status(400).json({ message: 'Unsupported ERP type.' });
    const result = await connector.testConnection();
    result ? res.json({ message: 'Connection successful' }) : res.status(400).json({ message: 'Connection failed' });
  } catch (error) { res.status(500).json({ message: error.message || 'Test failed.' }); }
};

const syncConnection = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId);
    const conn = org?.erpConnections.id(req.params.id);
    if (!conn) return res.status(404).json({ message: 'Connection not found.' });
    const connector = getConnector(conn);
    if (!connector) return res.status(400).json({ message: 'Unsupported ERP type.' });

    const tenantId = req.user.organizationId;
    const source = `erp-${conn._id}`;
    let productsImported = 0, suppliersImported = 0, customersImported = 0, transactionsImported = 0, employeesImported = 0;

    try {
      const products = await connector.pullProducts();
      if (products?.length) {
        for (const p of products) {
          await Product.findOneAndUpdate(
            { organizationId: tenantId, sku: p.sku },
            { $set: { sku: p.sku, name: p.name, description: p.description || '', category: p.category || '', stockLevel: p.stockLevel || 0, reorderThreshold: p.reorderThreshold || 0, unitCost: p.unitCost || 0, sellingPrice: p.sellingPrice || 0, barcode: p.barcode || '', organizationId: tenantId, source } },
            { upsert: true, new: true }
          );
        }
        productsImported = products.length;
      }
    } catch (e) { console.warn('Products sync failed:', e.message); }

    if (conn.type !== 'smartpos') {
      try {
        const suppliers = await connector.pullSuppliers?.();
        if (suppliers?.length) {
          for (const s of suppliers) {
            await Supplier.findOneAndUpdate(
              { organizationId: tenantId, email: s.email },
              { $set: { name: s.name, email: s.email, phone: s.phone || '', contactPerson: s.contactPerson || '', organizationId: tenantId, source } },
              { upsert: true, new: true }
            );
          }
          suppliersImported = suppliers.length;
        }
      } catch (e) { console.warn('Suppliers sync failed:', e.message); }
    }

    try {
      const customers = await connector.pullCustomers();
      if (customers?.length) {
        for (const c of customers) {
          await Customer.findOneAndUpdate(
            { organizationId: tenantId, email: c.email },
            { $set: { fullName: c.fullName, email: c.email, phone: c.phone || '', totalSpent: c.totalSpent || 0, purchaseCount: c.purchaseCount || 0, loyaltyCardNumber: c.loyaltyCardNumber || '', loyaltyPoints: c.loyaltyPoints || 0, visitCount: c.visitCount || 0, organizationId: tenantId, source } },
            { upsert: true, new: true }
          );
        }
        customersImported = customers.length;
      }
    } catch (e) { console.warn('Customers sync failed:', e.message); }

    if (conn.type === 'smartpos') {
      try {
        const sales = await connector.pullSales();
        if (sales?.length) {
          for (const sale of sales) {
            await Transaction.findOneAndUpdate(
              { organizationId: tenantId, transactionNumber: sale.transactionNumber },
              { $set: { transactionNumber: sale.transactionNumber, type: sale.type, amount: sale.amount, paymentMethod: sale.paymentMethod, description: sale.description || '', transactionDate: sale.transactionDate, organizationId: tenantId, source } },
              { upsert: true, new: true }
            );
          }
          transactionsImported = sales.length;
        }
      } catch (e) { console.warn('Sales sync failed:', e.message); }
    } else {
      try {
        const invoices = await connector.pullInvoices?.();
        if (invoices?.length) {
          for (const inv of invoices) {
            await Transaction.findOneAndUpdate(
              { organizationId: tenantId, transactionNumber: inv.transactionNumber },
              { $set: { transactionNumber: inv.transactionNumber, type: inv.type || 'sale', amount: inv.amount || 0, paymentMethod: inv.paymentMethod || 'other', description: inv.description || '', transactionDate: inv.transactionDate, organizationId: tenantId, source } },
              { upsert: true, new: true }
            );
          }
          transactionsImported = invoices.length;
        }
      } catch (e) { console.warn('Invoices sync failed:', e.message); }

      try {
        const employees = await connector.pullEmployees?.();
        if (employees?.length) {
          for (const emp of employees) {
            await Employee.findOneAndUpdate(
              { organizationId: tenantId, email: emp.email },
              { $set: { fullName: emp.fullName, email: emp.email, phone: emp.phone || '', department: emp.department || 'other', position: emp.position || '', organizationId: tenantId, source } },
              { upsert: true, new: true }
            );
          }
          employeesImported = employees.length;
        }
      } catch (e) { console.warn('Employees sync failed:', e.message); }
    }

    conn.lastSync = new Date();
    await org.save();

    await AuditLog.create({
      organizationId: tenantId, action: 'ERP synced', actionType: 'system_event',
      performedBy: req.user._id, performedByModel: 'ClientUser',
      description: `Synced: ${productsImported} products, ${suppliersImported} suppliers, ${customersImported} customers, ${transactionsImported} transactions, ${employeesImported} employees`,
      severity: 'info'
    });

    res.json({ message: 'Sync completed', productsImported, suppliersImported, customersImported, transactionsImported, employeesImported, lastSync: conn.lastSync });
  } catch (error) { res.status(500).json({ message: 'Internal server error.' }); }
};

const unsyncConnection = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId);
    const conn = org?.erpConnections.id(req.params.id);
    if (!conn) return res.status(404).json({ message: 'Connection not found.' });

    const tenantId = req.user.organizationId;
    const source = `erp-${conn._id}`;

    const [p, s, c, t, e] = await Promise.all([
      Product.deleteMany({ organizationId: tenantId, source }),
      Supplier.deleteMany({ organizationId: tenantId, source }),
      Customer.deleteMany({ organizationId: tenantId, source }),
      Transaction.deleteMany({ organizationId: tenantId, source }),
      Employee.deleteMany({ organizationId: tenantId, source })
    ]);

    conn.lastSync = null;
    await org.save();

    await AuditLog.create({
      organizationId: tenantId, action: 'ERP data unsynced', actionType: 'system_event',
      performedBy: req.user._id, performedByModel: 'ClientUser',
      description: `Removed ${p.deletedCount} products, ${s.deletedCount} suppliers, ${c.deletedCount} customers, ${t.deletedCount} transactions, ${e.deletedCount} employees from ${conn.name}`,
      severity: 'warning'
    });

    res.json({ message: 'Data unsynced', removed: { products: p.deletedCount, suppliers: s.deletedCount, customers: c.deletedCount, transactions: t.deletedCount, employees: e.deletedCount } });
  } catch (error) { res.status(500).json({ message: 'Internal server error.' }); }
};

const deleteConnection = async (req, res) => {
  try {
    const org = await ClientOrg.findById(req.user.organizationId);
    const conn = org?.erpConnections.id(req.params.id);
    if (!conn) return res.status(404).json({ message: 'Connection not found.' });
    conn.deleteOne();
    await org.save();
    res.json({ message: 'Connection removed.' });
  } catch (error) { res.status(500).json({ message: 'Internal server error.' }); }
};

export { getConnections, addConnection, testConnection, syncConnection, unsyncConnection, deleteConnection };
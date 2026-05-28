import axios from 'axios';

class HDMConnector {
  constructor(config) {
    this.baseUrl = config.url;
    this.apiKey = config.apiKey;
  }

  async request(method = 'POST', endpoint = 'query', body = null) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}/api/tenant/ai/outward/${endpoint}`,
        headers: { 'x-api-key': this.apiKey, 'Content-Type': 'application/json' },
        data: body || { question: 'sync all data' }
      });
      return response.data;
    } catch (error) {
      console.error('HDM request failed:', error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      const result = await this.request('POST', 'query', { question: 'test connection' });
      return result && result.success === true;
    } catch (error) {
      return false;
    }
  }

  async pullAllData() {
    const result = await this.request('POST', 'query', { question: 'sync all data' });
    if (!result.success || !result.data) return { products: [], customers: [], invoices: [], employees: [], suppliers: [] };
    return {
      products: result.data.products || [],
      customers: result.data.customers || [],
      invoices: result.data.invoices || [],
      employees: result.data.employees || [],
      suppliers: result.data.suppliers || []
    };
  }

  async pullProducts() {
    const data = await this.pullAllData();
    return (data.products || []).map(p => ({
      sku: p.sku || p.barcode || p.id?.toString() || '',
      name: p.name || p.product_name || '',
      description: p.description || '',
      category: p.category || '',
      stockLevel: p.stock_level || p.quantity || p.stock || 0,
      reorderThreshold: p.reorder_threshold || p.lowStockThreshold || 0,
      unitCost: p.cost_price || p.unit_cost || p.cost || 0,
      sellingPrice: p.selling_price || p.price || 0,
      barcode: p.barcode || ''
    }));
  }

  async pullCustomers() {
    const data = await this.pullAllData();
    return (data.customers || []).map(c => ({
      fullName: c.name || c.fullName || c.customer_name || '',
      email: c.email || '',
      phone: c.phone || '',
      totalSpent: c.totalSpent || c.total_spent || 0,
      purchaseCount: c.visitCount || c.purchase_count || 0
    }));
  }

  async pullInvoices() {
    const data = await this.pullAllData();
    return (data.invoices || []).map(inv => ({
      transactionNumber: inv.invoice_number || inv.receiptNumber || inv.id?.toString() || '',
      type: inv.type || 'sale',
      amount: inv.total || inv.amount || 0,
      paymentMethod: inv.paymentMethod || inv.payment_method || 'other',
      description: inv.description || '',
      transactionDate: inv.date || inv.createdAt || new Date()
    }));
  }

  async pullEmployees() {
    const data = await this.pullAllData();
    return (data.employees || []).map(e => ({
      fullName: e.name || e.fullName || '',
      email: e.email || '',
      phone: e.phone || '',
      department: e.department || 'other',
      position: e.position || ''
    }));
  }

  async pullSuppliers() {
    const data = await this.pullAllData();
    return (data.suppliers || []).map(s => ({
      name: s.name || s.supplier_name || '',
      email: s.email || '',
      phone: s.phone || ''
    }));
  }
}

export default HDMConnector;
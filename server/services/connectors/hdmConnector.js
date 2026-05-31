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
    
    const raw = result.data.raw_data || result.data;
    return {
      products: raw.products || [],
      customers: raw.customers || [],
      invoices: raw.invoices || [],
      employees: raw.employees || [],
      suppliers: raw.suppliers || [],
      accounts: raw.accounts || [],
      summary: raw.summary || {}
    };
  }

  async pullProducts() {
    const data = await this.pullAllData();
    return (data.products || []).map(p => ({
      sku: p.sku || p.name?.replace(/\s+/g, '-').toUpperCase() || '',
      name: p.name || '',
      description: p.description || '',
      category: p.category || '',
      stockLevel: p.stock || p.stockLevel || 0,
      reorderThreshold: p.reorderLevel || p.reorderThreshold || 10,
      unitCost: p.costPrice || p.cost || 0,
      sellingPrice: p.sellingPrice || p.price || 0,
      barcode: p.barcode || ''
    }));
  }

  async pullCustomers() {
    const data = await this.pullAllData();
    return (data.customers || []).map(c => ({
      fullName: c.name || c.fullName || '',
      email: c.email || '',
      phone: c.phone || ''
    }));
  }

  async pullInvoices() {
    const data = await this.pullAllData();
    return (data.invoices || []).map(inv => ({
      transactionNumber: inv.number || inv.invoiceNumber || '',
      type: 'sale',
      amount: inv.amount || 0,
      status: inv.status === 'paid' ? 'completed' : 'pending',
      description: `Invoice ${inv.number || ''} - ${inv.customer || 'N/A'}`,
      transactionDate: inv.date || new Date(),
      invoiceNumber: inv.number || '',
      invoiceStatus: inv.status || 'draft',
      customerName: inv.customer || ''
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
      name: s.name || '',
      email: s.email || '',
      phone: s.phone || ''
    }));
  }
}

export default HDMConnector;
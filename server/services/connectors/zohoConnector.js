import axios from 'axios';

class ZohoConnector {
  constructor(config) {
    this.baseUrl = 'https://www.zohoapis.com';
    this.apiKey = config.apiKey;
    this.organizationId = config.organizationId;
  }

  async request(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: { ...params, organization_id: this.organizationId }
      });
      return response.data;
    } catch (error) {
      console.error(`Zoho request failed: ${endpoint}`, error.message);
      throw error;
    }
  }

  async testConnection() {
    const result = await this.request('crm/v2/org');
    return result && result.organizations;
  }

  async pullProducts() {
    const data = await this.request('inventory/v1/items');
    return (data.items || []).map(item => ({
      sku: item.sku || item.item_id.toString(),
      name: item.name,
      description: item.description || '',
      stockLevel: item.stock_on_hand || 0,
      reorderThreshold: item.reorder_level || 0,
      unitCost: item.rate || 0,
      sellingPrice: item.selling_price || 0
    }));
  }

  async pullSuppliers() {
    const data = await this.request('inventory/v1/vendors');
    return (data.vendors || []).map(v => ({
      name: v.vendor_name,
      email: v.email || '',
      phone: v.phone || '',
      contactPerson: v.contact_persons?.[0]?.name || ''
    }));
  }

  async pullOrders() {
    const data = await this.request('inventory/v1/purchaseorders');
    return (data.purchaseorders || []).map(order => ({
      orderNumber: order.purchaseorder_number,
      supplierRef: order.vendor_id,
      status: this.mapStatus(order.status),
      totalAmount: order.total || 0
    }));
  }

  async pullCustomers() {
    const data = await this.request('crm/v2/contacts');
    return (data.data || []).map(c => ({
      fullName: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      email: c.email || '',
      phone: c.phone || ''
    }));
  }

  async pullTransactions() {
    const data = await this.request('books/v3/transactions');
    return (data.transactions || []).map(t => ({
      transactionNumber: t.transaction_id,
      type: t.transaction_type || 'sale',
      amount: t.total || 0,
      date: t.date
    }));
  }

  mapStatus(status) {
    const map = {
      'draft': 'placed',
      'confirmed': 'confirmed',
      'received': 'delivered',
      'cancelled': 'cancelled'
    };
    return map[status] || 'placed';
  }
}

export default ZohoConnector;
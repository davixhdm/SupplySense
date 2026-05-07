import axios from 'axios';

class OdooConnector {
  constructor(config) {
    this.baseUrl = config.url;
    this.apiKey = config.apiKey;
    this.database = config.database || 'odoo';
  }

  async request(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Odoo request failed: ${endpoint}`, error.message);
      throw error;
    }
  }

  async testConnection() {
    const result = await this.request('test');
    return result && result.success === true;
  }

  async pullProducts() {
    const data = await this.request('product.template/list');
    return data.map(item => ({
      sku: item.default_code || item.id.toString(),
      name: item.name,
      description: item.description || '',
      category: item.categ_id?.[1] || '',
      unit: item.uom_id?.[1] || 'piece',
      stockLevel: item.qty_available || 0,
      reorderThreshold: item.reorder_min_qty || 0,
      unitCost: item.standard_price || 0,
      sellingPrice: item.list_price || 0
    }));
  }

  async pullSuppliers() {
    const data = await this.request('res.partner/list', { supplier: true });
    return data.map(item => ({
      name: item.name,
      email: item.email || '',
      phone: item.phone || '',
      contactPerson: item.contact_name || '',
      address: {
        street: item.street || '',
        city: item.city || '',
        country: item.country_id?.[1] || ''
      },
      deliveryTimeline: item.delivery_days || 0,
      paymentTerms: item.property_payment_term_id?.[1] || ''
    }));
  }

  async pullOrders() {
    const data = await this.request('purchase.order/list');
    return data.map(item => ({
      orderNumber: item.name,
      supplierRef: item.partner_id?.[0],
      status: this.mapOrderStatus(item.state),
      totalAmount: item.amount_total || 0,
      orderDate: item.date_order,
      expectedDelivery: item.date_planned
    }));
  }

  async pullCustomers() {
    const data = await this.request('res.partner/list', { customer: true });
    return data.map(item => ({
      fullName: item.name,
      email: item.email || '',
      phone: item.phone || '',
      address: {
        street: item.street || '',
        city: item.city || '',
        country: item.country_id?.[1] || ''
      }
    }));
  }

  async pullTransactions() {
    const data = await this.request('account.move/list', { state: 'posted' });
    return data.map(item => ({
      transactionNumber: item.name,
      type: item.move_type || 'sale',
      amount: item.amount_total || 0,
      date: item.date,
      description: item.ref || ''
    }));
  }

  mapOrderStatus(status) {
    const statusMap = {
      'draft': 'placed',
      'sent': 'confirmed',
      'purchase': 'confirmed',
      'done': 'delivered',
      'cancel': 'cancelled'
    };
    return statusMap[status] || 'placed';
  }
}

export default OdooConnector;
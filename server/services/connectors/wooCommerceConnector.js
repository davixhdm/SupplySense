import axios from 'axios';

class WooCommerceConnector {
  constructor(config) {
    this.baseUrl = config.url;
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
  }

  async request(endpoint) {
    const response = await axios.get(`${this.baseUrl}/wp-json/wc/v3/${endpoint}`, {
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret
      }
    });
    return response.data;
  }

  async testConnection() {
    await this.request('system_status');
    return true;
  }

  async pullProducts() {
    const data = await this.request('products?per_page=100');
    return data.map(p => ({
      sku: p.sku || p.id.toString(),
      name: p.name,
      description: p.description || '',
      stockLevel: p.stock_quantity || 0,
      reorderThreshold: p.low_stock_amount || 0,
      sellingPrice: p.price || 0,
      barcode: p.barcode || ''
    }));
  }

  async pullOrders() {
    const data = await this.request('orders?per_page=100');
    return data.map(order => ({
      orderNumber: order.number,
      status: this.mapStatus(order.status),
      totalAmount: order.total || 0,
      orderDate: order.date_created
    }));
  }

  async pullCustomers() {
    const data = await this.request('customers?per_page=100');
    return data.map(c => ({
      fullName: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      email: c.email || '',
      phone: c.billing?.phone || '',
      totalSpent: c.total_spent || 0,
      orderCount: c.order_count || 0
    }));
  }

  async pullTransactions() {
    const orders = await this.request('orders?per_page=100');
    return orders.map(order => ({
      transactionNumber: order.transaction_id || order.id.toString(),
      type: order.status === 'refunded' ? 'refund' : 'sale',
      amount: order.total || 0,
      date: order.date_paid || order.date_created
    }));
  }

  mapStatus(status) {
    const map = {
      'pending': 'placed',
      'processing': 'confirmed',
      'on-hold': 'placed',
      'completed': 'delivered',
      'cancelled': 'cancelled',
      'refunded': 'returned',
      'failed': 'cancelled'
    };
    return map[status] || 'placed';
  }
}

export default WooCommerceConnector;
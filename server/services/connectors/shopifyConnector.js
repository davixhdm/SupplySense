import axios from 'axios';

class ShopifyConnector {
  constructor(config) {
    this.shopDomain = config.url;
    this.accessToken = config.apiKey;
  }

  async request(endpoint) {
    const response = await axios.get(`https://${this.shopDomain}/admin/api/2024-01/${endpoint}`, {
      headers: {
        'X-Shopify-Access-Token': this.accessToken,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }

  async testConnection() {
    const data = await this.request('shop.json');
    return !!data.shop;
  }

  async pullProducts() {
    const data = await this.request('products.json?limit=250');
    return (data.products || []).map(p => ({
      sku: p.variants[0]?.sku || p.id.toString(),
      name: p.title,
      description: p.body_html || '',
      stockLevel: p.variants[0]?.inventory_quantity || 0,
      unitCost: p.variants[0]?.cost || 0,
      sellingPrice: p.variants[0]?.price || 0,
      barcode: p.variants[0]?.barcode || ''
    }));
  }

  async pullOrders() {
    const data = await this.request('orders.json?status=any');
    return (data.orders || []).map(order => ({
      orderNumber: order.name,
      status: this.mapStatus(order.financial_status),
      totalAmount: order.total_price || 0,
      orderDate: order.created_at
    }));
  }

  async pullCustomers() {
    const data = await this.request('customers.json?limit=250');
    return (data.customers || []).map(c => ({
      fullName: `${c.first_name || ''} ${c.last_name || ''}`.trim(),
      email: c.email || '',
      phone: c.phone || '',
      totalSpent: c.total_spent || 0,
      ordersCount: c.orders_count || 0,
      lastOrderDate: c.last_order_date
    }));
  }

  async pullTransactions() {
    const data = await this.request('transactions.json?limit=250');
    return (data.transactions || []).map(t => ({
      transactionNumber: t.id.toString(),
      type: t.kind === 'sale' ? 'sale' : 'refund',
      amount: t.amount || 0,
      date: t.created_at
    }));
  }

  mapStatus(financialStatus) {
    const map = {
      'pending': 'placed',
      'paid': 'confirmed',
      'fulfilled': 'delivered',
      'cancelled': 'cancelled',
      'refunded': 'returned'
    };
    return map[financialStatus] || 'placed';
  }
}

export default ShopifyConnector;
import axios from 'axios';

class SmartPOSConnector {
  constructor(config) {
    this.baseUrl = config.url;
    this.apiKey = config.apiKey;
  }

  async request(endpoint) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/client/${endpoint}`, {
        headers: { 'x-api-key': this.apiKey, 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('SmartPOS request failed:', error.message);
      throw error;
    }
  }

  async testConnection() {
    try {
      const result = await this.request('dashboard');
      return result && result.success === true;
    } catch (error) {
      return false;
    }
  }

  async pullProducts() {
    const result = await this.request('products');
    if (!result.success) return [];
    return (result.data?.products || []).map(p => ({
      sku: p.barcode || p._id,
      name: p.name,
      category: p.category || '',
      stockLevel: p.stock || 0,
      reorderThreshold: p.lowStockThreshold || 10,
      unitCost: p.cost || 0,
      sellingPrice: p.price || 0,
      barcode: p.barcode || ''
    }));
  }

  async pullCustomers() {
    const result = await this.request('customers');
    if (!result.success) return [];
    return (result.data?.customers || []).map(c => ({
      fullName: c.name,
      email: c.email || '',
      phone: c.phone || '',
      totalSpent: c.totalSpent || 0,
      purchaseCount: c.visitCount || 0,
      loyaltyCardNumber: c.loyaltyCardNumber || '',
      loyaltyPoints: c.loyaltyPoints || 0,
      visitCount: c.visitCount || 0
    }));
  }

  async pullSales() {
    const result = await this.request('sales');
    if (!result.success) return [];
    return (result.data?.sales || []).map(sale => ({
      transactionNumber: sale.receiptNumber,
      type: 'sale',
      amount: sale.total,
      paymentMethod: sale.paymentMethod === 'mpesa' ? 'mobile_money' : sale.paymentMethod === 'card' ? 'card' : 'cash',
      description: `Sale to ${sale.customerName}`,
      transactionDate: sale.createdAt,
      items: sale.items || []
    }));
  }

  async pullDashboard() {
    const result = await this.request('dashboard');
    if (!result.success) return {};
    return result.data || {};
  }
}

export default SmartPOSConnector;
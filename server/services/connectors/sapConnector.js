import axios from 'axios';

class SAPConnector {
  constructor(config) {
    this.baseUrl = config.url;
    this.username = config.username;
    this.password = config.password;
    this.companyDB = config.companyDB;
  }

  async login() {
    const response = await axios.post(`${this.baseUrl}/Login`, {
      CompanyDB: this.companyDB,
      UserName: this.username,
      Password: this.password
    });
    return response.data.SessionId;
  }

  async request(endpoint, params = {}) {
    const sessionId = await this.login();
    const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
      headers: {
        'Cookie': `B1SESSION=${sessionId}`,
        'Content-Type': 'application/json'
      },
      params
    });
    return response.data;
  }

  async testConnection() {
    const sessionId = await this.login();
    return !!sessionId;
  }

  async pullProducts() {
    const data = await this.request('Items');
    return (data.value || []).map(item => ({
      sku: item.ItemCode,
      name: item.ItemName,
      description: item.ItemDescription || '',
      stockLevel: item.QuantityOnStock || 0,
      reorderThreshold: item.MinimumInventory || 0,
      unitCost: item.ItemCost || 0,
      sellingPrice: item.UnitPrice || 0
    }));
  }

  async pullSuppliers() {
    const data = await this.request('BusinessPartners', { cardType: 'S' });
    return (data.value || []).map(bp => ({
      name: bp.CardName,
      email: bp.EmailAddress || '',
      phone: bp.Phone1 || '',
      contactPerson: bp.ContactPerson || ''
    }));
  }

  async pullOrders() {
    const data = await this.request('PurchaseOrders');
    return (data.value || []).map(order => ({
      orderNumber: order.DocNum.toString(),
      supplierRef: order.CardCode,
      status: this.mapStatus(order.DocumentStatus),
      totalAmount: order.DocTotal || 0,
      orderDate: order.DocDate,
      expectedDelivery: order.DocDueDate
    }));
  }

  async pullCustomers() {
    const data = await this.request('BusinessPartners', { cardType: 'C' });
    return (data.value || []).map(bp => ({
      fullName: bp.CardName,
      email: bp.EmailAddress || '',
      phone: bp.Phone1 || ''
    }));
  }

  async pullTransactions() {
    const invoices = await this.request('Invoices');
    return (invoices.value || []).map(inv => ({
      transactionNumber: inv.DocNum.toString(),
      type: 'sale',
      amount: inv.DocTotal || 0,
      date: inv.DocDate,
      description: inv.Comments || ''
    }));
  }

  mapStatus(status) {
    const map = {
      'bost_Open': 'placed',
      'bost_Close': 'confirmed',
      'bost_Paid': 'delivered',
      'bost_Cancel': 'cancelled'
    };
    return map[status] || 'placed';
  }
}

export default SAPConnector;
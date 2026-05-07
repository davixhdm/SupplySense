import axios from 'axios';

class DynamicsConnector {
  constructor(config) {
    this.baseUrl = config.url;
    this.accessToken = config.accessToken;
  }

  async request(endpoint) {
    const response = await axios.get(`${this.baseUrl}/api/data/v9.2/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json'
      }
    });
    return response.data;
  }

  async testConnection() {
    await this.request('WhoAmI');
    return true;
  }

  async pullProducts() {
    const data = await this.request('products');
    return (data.value || []).map(p => ({
      sku: p.productnumber || p.productid,
      name: p.name,
      description: p.description || '',
      stockLevel: p.quantityonhand || 0,
      unitCost: p.currentcost || 0,
      sellingPrice: p.price || 0
    }));
  }

  async pullSuppliers() {
    const data = await this.request('accounts?$filter=accountcategorycode eq 2');
    return (data.value || []).map(a => ({
      name: a.name,
      email: a.emailaddress1 || '',
      phone: a.telephone1 || ''
    }));
  }

  async pullOrders() {
    const data = await this.request('purchaseorders');
    return (data.value || []).map(po => ({
      orderNumber: po.name,
      supplierRef: po._vendorid_value,
      status: this.mapStatus(po.statecode),
      totalAmount: po.totalamount || 0
    }));
  }

  async pullCustomers() {
    const data = await this.request('contacts?$filter=statecode eq 0');
    return (data.value || []).map(c => ({
      fullName: c.fullname,
      email: c.emailaddress1 || '',
      phone: c.telephone1 || ''
    }));
  }

  async pullTransactions() {
    const data = await this.request('invoices');
    return (data.value || []).map(inv => ({
      transactionNumber: inv.invoicenumber,
      type: 'sale',
      amount: inv.totalamount || 0,
      date: inv.invoicedate
    }));
  }

  mapStatus(status) {
    const map = { 0: 'placed', 1: 'confirmed', 2: 'delivered', 3: 'cancelled' };
    return map[status] || 'placed';
  }
}

export default DynamicsConnector;
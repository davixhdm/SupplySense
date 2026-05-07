import fs from 'fs';
import csv from 'csv-parser';

class CSVImportService {
  async parseFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  validateHeaders(headers, requiredFields) {
    return requiredFields.every(field => headers.includes(field));
  }

  async importProducts(filePath) {
    const data = await this.parseFile(filePath);
    if (data.length === 0) throw new Error('CSV file is empty');
    
    const required = ['name', 'sku', 'stockLevel'];
    const headers = Object.keys(data[0]);
    if (!this.validateHeaders(headers, required)) {
      throw new Error(`CSV must contain: ${required.join(', ')}`);
    }

    return data.map(row => ({
      sku: row.sku?.trim(),
      name: row.name?.trim(),
      description: row.description?.trim() || '',
      category: row.category?.trim() || '',
      stockLevel: parseInt(row.stockLevel) || 0,
      reorderThreshold: parseInt(row.reorderThreshold) || 0,
      unitCost: parseFloat(row.unitCost) || 0,
      sellingPrice: parseFloat(row.sellingPrice) || 0,
      barcode: row.barcode?.trim() || ''
    }));
  }

  async importSuppliers(filePath) {
    const data = await this.parseFile(filePath);
    const required = ['name', 'email'];
    const headers = Object.keys(data[0]);
    if (!this.validateHeaders(headers, required)) {
      throw new Error(`CSV must contain: ${required.join(', ')}`);
    }

    return data.map(row => ({
      name: row.name?.trim(),
      email: row.email?.trim().toLowerCase(),
      phone: row.phone?.trim() || '',
      contactPerson: row.contactPerson?.trim() || '',
      deliveryTimeline: parseInt(row.deliveryTimeline) || 0
    }));
  }

  async importCustomers(filePath) {
    const data = await this.parseFile(filePath);
    const required = ['fullName'];
    const headers = Object.keys(data[0]);
    if (!this.validateHeaders(headers, required)) {
      throw new Error(`CSV must contain: ${required.join(', ')}`);
    }

    return data.map(row => ({
      fullName: row.fullName?.trim(),
      email: row.email?.trim().toLowerCase() || '',
      phone: row.phone?.trim() || '',
      address: {
        street: row.street?.trim() || '',
        city: row.city?.trim() || '',
        country: row.country?.trim() || ''
      }
    }));
  }

  async importTransactions(filePath) {
    const data = await this.parseFile(filePath);
    const required = ['amount', 'type', 'date'];
    const headers = Object.keys(data[0]);
    if (!this.validateHeaders(headers, required)) {
      throw new Error(`CSV must contain: ${required.join(', ')}`);
    }

    return data.map(row => ({
      type: row.type?.trim() || 'sale',
      amount: parseFloat(row.amount) || 0,
      description: row.description?.trim() || '',
      transactionDate: row.date ? new Date(row.date) : new Date()
    }));
  }
}

export default CSVImportService;
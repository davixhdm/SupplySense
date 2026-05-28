from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import statistics

router = APIRouter()

@router.post("")
async def generate_insights(request: Dict[str, Any]) -> Dict[str, Any]:
    try:
        query = request.get("query", "").lower()
        category = request.get("category", "")
        data = request.get("data", {})
        result = {"query": query or category, "category": category or "general", "insights": "", "charts": {}, "recommendations": [], "status": "success"}

        if "inventory" in query or category == "inventory": result.update(analyze_inventory(data))
        elif "supplier" in query or category == "suppliers": result.update(analyze_suppliers(data))
        elif "customer" in query or category == "customers": result.update(analyze_customers(data))
        elif "order" in query or category == "orders": result.update(analyze_orders(data))
        elif "transaction" in query or category == "transactions": result.update(analyze_transactions(data))
        elif "employee" in query or category == "employees": result.update(analyze_employees(data))
        elif "revenue" in query or "sales" in query: result.update(analyze_revenue(data))
        elif "stock" in query or "low" in query: result.update(analyze_inventory(data))
        elif "churn" in query or "risk" in query: result.update(analyze_customers(data))
        else: result.update(general_analysis(data))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_inventory(data): 
    products = data.get("products", [])
    if not products: return {"insights": "No inventory data.", "charts": {}, "recommendations": []}
    total = len(products)
    low = [p for p in products if p.get("stockLevel", 0) <= p.get("reorderThreshold", 0)]
    return {"insights": f"{total} products. {len(low)} below threshold.", "charts": {"totalProducts": total, "lowStock": len(low)}, "recommendations": []}

def analyze_suppliers(data):
    suppliers = data.get("suppliers", [])
    if not suppliers: return {"insights": "No supplier data.", "charts": {}, "recommendations": []}
    return {"insights": f"{len(suppliers)} suppliers.", "charts": {"totalSuppliers": len(suppliers)}, "recommendations": []}

def analyze_customers(data):
    customers = data.get("customers", [])
    if not customers: return {"insights": "No customer data.", "charts": {}, "recommendations": []}
    at_risk = [c for c in customers if c.get("churnRisk", 0) >= 60]
    return {"insights": f"{len(customers)} customers. {len(at_risk)} at risk.", "charts": {"totalCustomers": len(customers), "atRisk": len(at_risk)}, "recommendations": []}

def analyze_orders(data):
    orders = data.get("orders", [])
    return {"insights": f"{len(orders)} orders." if orders else "No order data.", "charts": {"totalOrders": len(orders)}, "recommendations": []}

def analyze_transactions(data):
    transactions = data.get("transactions", [])
    if not transactions: return {"insights": "No transaction data.", "charts": {}, "recommendations": []}
    total = sum(t.get("amount", 0) for t in transactions)
    return {"insights": f"{len(transactions)} transactions totaling {total:,.2f}.", "charts": {"totalTransactions": len(transactions), "totalAmount": total}, "recommendations": []}

def analyze_employees(data):
    employees = data.get("employees", [])
    return {"insights": f"{len(employees)} employees." if employees else "No employee data.", "charts": {"totalEmployees": len(employees)}, "recommendations": []}

def analyze_revenue(data):
    transactions = data.get("transactions", [])
    if not transactions: return {"insights": "No revenue data.", "charts": {}, "recommendations": []}
    sales = [t for t in transactions if t.get("type") == "sale"]
    total = sum(t.get("amount", 0) for t in sales)
    return {"insights": f"Revenue: {total:,.2f} from {len(sales)} sales.", "charts": {"totalRevenue": total, "salesCount": len(sales)}, "recommendations": []}

def general_analysis(data):
    parts = []
    if data.get("products"): parts.append(analyze_inventory(data)["insights"])
    if data.get("suppliers"): parts.append(analyze_suppliers(data)["insights"])
    if data.get("customers"): parts.append(analyze_customers(data)["insights"])
    return {"insights": " ".join(parts) if parts else "Add data for AI insights.", "charts": {}, "recommendations": []}
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.services.detailedResponseGenerator import DetailedResponseGenerator
import statistics

router = APIRouter()
response_generator = DetailedResponseGenerator()

@router.post("")
async def generate_insights(request: Dict[str, Any]) -> Dict[str, Any]:
    try:
        query = request.get("query", "").lower()
        category = request.get("category", "")
        data = request.get("data", {})
        
        data_context = {
            "inventory": data.get("products", []),
            "suppliers": data.get("suppliers", []),
            "customers": data.get("customers", []),
            "orders": data.get("orders", []),
            "transactions": data.get("transactions", []),
            "employees": data.get("employees", [])
        }
        
        detailed_insights = response_generator.generate_detailed_insights_response(
            query=query or category or "General Supply Chain Analysis",
            data_context=data_context
        )
        
        if "inventory" in query or category == "inventory":
            specific_analysis = analyze_inventory(data)
        elif "supplier" in query or category == "suppliers":
            specific_analysis = analyze_suppliers(data)
        elif "customer" in query or category == "customers":
            specific_analysis = analyze_customers(data)
        elif "order" in query or category == "orders":
            specific_analysis = analyze_orders(data)
        elif "transaction" in query or category == "transactions":
            specific_analysis = analyze_transactions(data)
        elif "employee" in query or category == "employees":
            specific_analysis = analyze_employees(data)
        elif "revenue" in query or "sales" in query or "predict" in query:
            specific_analysis = analyze_revenue(data)
        elif "stock" in query or "low" in query:
            specific_analysis = analyze_inventory(data)
        elif "churn" in query or "risk" in query:
            specific_analysis = analyze_customers(data)
        else:
            specific_analysis = general_analysis(data)
        
        local_insight = specific_analysis.get("insights", "")
        groq_insight = detailed_insights.get("key_findings", "")
        
        if isinstance(groq_insight, list):
            groq_text = " ".join(groq_insight) if groq_insight else ""
        elif isinstance(groq_insight, str):
            groq_text = groq_insight
        else:
            groq_text = ""
        
        generic_patterns = ["Data pattern identified", "Trend detected", "Correlation found", "Unable to generate"]
        is_generic = any(groq_text.startswith(p) for p in generic_patterns) or len(groq_text) < 50
        
        if not is_generic and len(groq_text) > 50:
            final_insight = groq_insight
            final_recs = detailed_insights.get("actionable_recommendations", specific_analysis.get("recommendations", []))
        else:
            final_insight = local_insight
            final_recs = specific_analysis.get("recommendations", [])
        
        return {
            "query": query or category or "General",
            "category": category or "general",
            "detailed_analysis": detailed_insights.get("detailed_insights", {}),
            "key_findings": final_insight,
            "supporting_metrics": specific_analysis.get("charts", {}),
            "recommendations": final_recs,
            "analysis_depth": detailed_insights.get("analysis_depth", "Detailed"),
            "confidence_score": detailed_insights.get("confidence_score", 0.85),
            "ai_priority": "Groq" if not is_generic else "Local ML",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_inventory(data): 
    products = data.get("products", [])
    if not products: return {"insights": "No inventory data available.", "charts": {}, "recommendations": []}
    total = len(products)
    low = [p for p in products if p.get("stockLevel", 0) <= p.get("reorderThreshold", 0)]
    critical = [p for p in products if p.get("stockLevel", 0) == 0]
    return {"insights": f"Analyzed {total} products. {len(low)} below reorder threshold. {len(critical)} critically low.", "charts": {"totalProducts": total, "lowStock": len(low), "criticalStock": len(critical), "healthyStock": total - len(low)}, "recommendations": [f"Reorder {len(low)} products below threshold", f"Urgent action for {len(critical)} critical items"]}

def analyze_suppliers(data):
    suppliers = data.get("suppliers", [])
    if not suppliers: return {"insights": "No supplier data.", "charts": {}, "recommendations": []}
    performance = [s.get("performanceScore", 0) for s in suppliers if s.get("performanceScore")]
    avg = sum(performance) / len(performance) if performance else 0
    return {"insights": f"{len(suppliers)} suppliers. Avg performance: {avg:.1f}/100.", "charts": {"totalSuppliers": len(suppliers), "avgPerformance": round(avg, 1)}, "recommendations": []}

def analyze_customers(data):
    customers = data.get("customers", [])
    if not customers: return {"insights": "No customer data.", "charts": {}, "recommendations": []}
    at_risk = [c for c in customers if c.get("churnRisk", 0) >= 60]
    return {"insights": f"{len(customers)} customers. {len(at_risk)} at risk.", "charts": {"totalCustomers": len(customers), "atRisk": len(at_risk)}, "recommendations": []}

def analyze_orders(data):
    orders = data.get("orders", [])
    if not orders: return {"insights": "No order data.", "charts": {}, "recommendations": []}
    pending = [o for o in orders if o.get("status") == "pending"]
    return {"insights": f"{len(orders)} orders. {len(pending)} pending.", "charts": {"totalOrders": len(orders), "pending": len(pending)}, "recommendations": []}

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
    if not transactions: return {"insights": "No revenue data. Add sales transactions for revenue analysis.", "charts": {}, "recommendations": []}
    sales = [t for t in transactions if t.get("type") == "sale"]
    total = sum(t.get("amount", 0) for t in sales)
    avg = total / len(sales) if sales else 0
    return {"insights": f"Revenue: {total:,.2f} from {len(sales)} sales. Average sale: {avg:,.2f}.", "charts": {"totalRevenue": total, "salesCount": len(sales), "avgSale": round(avg, 2)}, "recommendations": ["Track daily sales trends", "Identify top-selling products", "Monitor revenue growth"]}

def general_analysis(data):
    parts = []
    if data.get("products"): parts.append(analyze_inventory(data)["insights"])
    if data.get("suppliers"): parts.append(analyze_suppliers(data)["insights"])
    if data.get("customers"): parts.append(analyze_customers(data)["insights"])
    return {"insights": " ".join(parts) if parts else "Add data for AI insights.", "charts": {}, "recommendations": []}
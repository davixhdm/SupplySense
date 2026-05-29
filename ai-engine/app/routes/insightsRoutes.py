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
        
        # Prepare context for detailed analysis
        data_context = {
            "inventory": data.get("products", []),
            "suppliers": data.get("suppliers", []),
            "customers": data.get("customers", []),
            "orders": data.get("orders", []),
            "transactions": data.get("transactions", []),
            "employees": data.get("employees", [])
        }
        
        # Get detailed insights using Groq or local ML
        detailed_insights = response_generator.generate_detailed_insights_response(
            query=query or category or "General Supply Chain Analysis",
            data_context=data_context
        )
        
        # Combine with category-specific analysis
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
        elif "revenue" in query or "sales" in query:
            specific_analysis = analyze_revenue(data)
        elif "stock" in query or "low" in query:
            specific_analysis = analyze_inventory(data)
        elif "churn" in query or "risk" in query:
            specific_analysis = analyze_customers(data)
        else:
            specific_analysis = general_analysis(data)
        
        return {
            "query": query or category or "General",
            "category": category or "general",
            "detailed_analysis": detailed_insights.get("detailed_insights", {}),
            "key_findings": detailed_insights.get("key_findings", specific_analysis.get("insights", "")),
            "supporting_metrics": specific_analysis.get("charts", {}),
            "recommendations": detailed_insights.get("actionable_recommendations", specific_analysis.get("recommendations", [])),
            "analysis_depth": detailed_insights.get("analysis_depth", "Detailed"),
            "confidence_score": detailed_insights.get("confidence_score", 0.85),
            "ai_priority": detailed_insights.get("ai_priority", "Groq"),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_inventory(data): 
    products = data.get("products", [])
    if not products: return {"insights": "No inventory data available for analysis.", "charts": {}, "recommendations": []}
    total = len(products)
    low = [p for p in products if p.get("stockLevel", 0) <= p.get("reorderThreshold", 0)]
    critical = [p for p in products if p.get("stockLevel", 0) == 0]
    return {
        "insights": f"Analyzed {total} products. {len(low)} below reorder threshold. {len(critical)} critically low.",
        "charts": {
            "totalProducts": total,
            "lowStock": len(low),
            "criticalStock": len(critical),
            "healthyStock": total - len(low)
        },
        "recommendations": [
            f"Reorder {len(low)} products below threshold",
            f"Urgent action needed for {len(critical)} critical items",
            "Implement automated reorder system"
        ]
    }

def analyze_suppliers(data):
    suppliers = data.get("suppliers", [])
    if not suppliers: return {"insights": "No supplier data available.", "charts": {}, "recommendations": []}
    performance = [s.get("performanceScore", 0) for s in suppliers if s.get("performanceScore")]
    avg_performance = sum(performance) / len(performance) if performance else 0
    return {
        "insights": f"Monitoring {len(suppliers)} suppliers. Average performance: {avg_performance:.1f}/100.",
        "charts": {
            "totalSuppliers": len(suppliers),
            "avgPerformance": round(avg_performance, 1)
        },
        "recommendations": [
            "Focus on supplier relationships",
            "Monitor delivery times",
            "Diversify supplier base"
        ]
    }

def analyze_customers(data):
    customers = data.get("customers", [])
    if not customers: return {"insights": "No customer data available.", "charts": {}, "recommendations": []}
    at_risk = [c for c in customers if c.get("churnRisk", 0) >= 60]
    high_value = [c for c in customers if c.get("ltv", 0) > statistics.mean([c.get("ltv", 0) for c in customers]) if customers]
    return {
        "insights": f"Managing {len(customers)} customers. {len(at_risk)} at churn risk. {len(high_value)} high-value customers identified.",
        "charts": {
            "totalCustomers": len(customers),
            "atRisk": len(at_risk),
            "highValue": len(high_value)
        },
        "recommendations": [
            f"Retention strategy for {len(at_risk)} at-risk customers",
            f"Premium support for {len(high_value)} high-value customers",
            "Implement customer success program"
        ]
    }

def analyze_orders(data):
    orders = data.get("orders", [])
    if not orders: return {"insights": "No order data.", "charts": {}, "recommendations": []}
    pending = [o for o in orders if o.get("status") == "pending"]
    completed = [o for o in orders if o.get("status") == "completed"]
    return {
        "insights": f"Processing {len(orders)} orders. {len(pending)} pending. {len(completed)} completed.",
        "charts": {"totalOrders": len(orders), "pending": len(pending), "completed": len(completed)},
        "recommendations": ["Process pending orders", "Optimize order fulfillment"]
    }

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
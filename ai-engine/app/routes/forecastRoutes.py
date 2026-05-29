from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.detailedResponseGenerator import DetailedResponseGenerator
import pandas as pd
import numpy as np

router = APIRouter()
response_generator = DetailedResponseGenerator()

class InventoryData(BaseModel):
    date: str
    stock: float
    product_id: int
    supplier_id: int

class ForecastRequest(BaseModel):
    data: List[InventoryData]
    product_id: int
    periods: int = 7

@router.post("/demand")
async def predict_demand(request: ForecastRequest) -> Dict[str, Any]:
    try:
        # Generate forecast
        data_list = [item.dict() for item in request.data]
        forecast = [max(0, request.periods - i) * 10 for i in range(request.periods)]
        
        # Get detailed response with Groq or local ML
        detailed_response = response_generator.generate_detailed_forecast_response(
            product_id=request.product_id,
            historical_data=data_list,
            forecast_values=forecast,
            metadata={"periods": request.periods}
        )
        
        return detailed_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stockout")
async def predict_stockout(request: Dict[str, Any]) -> Dict[str, Any]:
    try:
        current_stock = request.get("currentStock", 0)
        reorder_threshold = request.get("reorderThreshold", 10)
        daily_demand = request.get("dailyDemand", 5)
        lead_time = request.get("leadTime", 7)
        product_id = request.get("productId", 0)
        
        if daily_demand <= 0:
            return {
                "riskLevel": "none",
                "daysUntilStockout": None,
                "recommendedReorderDate": None,
                "detailed_insight": "Current demand is zero or negative, no stockout risk."
            }
        
        days_until = max(0, (current_stock - reorder_threshold) / daily_demand)
        risk = "high" if days_until < lead_time else "medium" if days_until < lead_time * 2 else "low"
        
        # Generate detailed response
        detailed_response = response_generator.generate_detailed_forecast_response(
            product_id=product_id,
            historical_data=[
                {"date": "current", "stock": current_stock, "product_id": product_id}
            ],
            forecast_values=[current_stock - (daily_demand * i) for i in range(1, 8)],
            metadata={
                "currentStock": current_stock,
                "dailyDemand": daily_demand,
                "leadTime": lead_time,
                "riskLevel": risk
            }
        )
        
        return {
            "riskLevel": risk,
            "daysUntilStockout": round(days_until, 1),
            "recommendedReorderDate": f"In {max(1, int(days_until - lead_time))} days",
            "detailed_analysis": detailed_response.get("detailed_explanation", {}),
            "recommendations": detailed_response.get("recommendations", []),
            "confidence": detailed_response.get("confidence_score", 0.85)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
async def get_product_forecast(product_id: int) -> Dict[str, Any]:
    return {
        "product_id": product_id,
        "forecast": None,
        "status": "pending",
        "message": "Use POST /demand endpoint with historical data for detailed forecast"
    }
"""
Recommendation Routes

Endpoints for generating intelligent recommendations powered by Groq AI.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from app.services.recommendationService import RecommendationService

router = APIRouter()

# Initialize service
recommendation_service = RecommendationService()


class RecommendationRequest(BaseModel):
    """Schema for recommendation request"""

    product_id: int = None
    supplier_id: int = None
    customer_id: int = None
    current_stock: float = None
    forecast: float = None
    anomaly_score: float = None
    prediction_results: Dict[str, Any] = None


class Recommendation(BaseModel):
    """Schema for a single recommendation"""

    type: str  # 'reorder', 'supplier_switch', 'promotion', etc.
    action: str  # 'REORDER', 'SWITCH', 'MONITOR', etc.
    priority: str  # 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    description: str


@router.post("/", response_model=Dict[str, Any])
async def get_recommendations(request: RecommendationRequest) -> Dict[str, Any]:
    """
    Generate recommendations based on predictions with Groq AI.

    Args:
        request: Recommendation request with prediction results

    Returns:
        List of actionable recommendations with AI explanations

    Example:
        POST /api/recommendations/
        {
            "product_id": 1,
            "current_stock": 50,
            "forecast": 100,
            "supplier_id": 2,
            "anomaly_score": 0.1
        }
    """
    try:
        recommendations = []
        
        # Generate reorder recommendation if forecast available
        if request.product_id and request.current_stock is not None and request.forecast is not None:
            reorder_rec = recommendation_service.generate_reorder_recommendation(
                request.product_id,
                request.current_stock,
                request.forecast
            )
            recommendations.append(reorder_rec)
        
        # Generate anomaly alert if anomaly detected
        if request.product_id and request.anomaly_score is not None and request.anomaly_score > 0.5:
            anomaly_rec = recommendation_service.generate_anomaly_alert(
                request.product_id,
                request.anomaly_score
            )
            recommendations.append(anomaly_rec)
        
        return {
            "recommendations": recommendations,
            "total": len(recommendations),
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")


@router.post("/reorder")
async def get_reorder_recommendations(requests: List[RecommendationRequest]) -> Dict[str, Any]:
    """
    Get reorder recommendations with AI insights.

    Args:
        requests: List of recommendation requests

    Returns:
        Reorder recommendations sorted by priority

    Example:
        POST /api/recommendations/reorder
    """
    try:
        recommendations = []
        
        for req in requests:
            if req.product_id and req.current_stock is not None and req.forecast is not None:
                rec = recommendation_service.generate_reorder_recommendation(
                    req.product_id,
                    req.current_stock,
                    req.forecast
                )
                recommendations.append(rec)
        
        # Sort by priority
        priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "LOW"), 999))
        
        urgent_count = sum(1 for r in recommendations if r.get("action") == "REORDER")
        
        return {
            "reorder_recommendations": recommendations,
            "urgent_count": urgent_count,
            "total": len(recommendations),
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/supplier-switch")
async def get_supplier_switch_recommendations(
    supplier_scores: Dict[int, float],
    current_supplier_id: int,
) -> Dict[str, Any]:
    """
    Get supplier switching recommendations with AI analysis.

    Args:
        supplier_scores: Dictionary of supplier_id -> reliability_score
        current_supplier_id: Current supplier ID

    Returns:
        Supplier switch recommendations with AI explanations

    Example:
        POST /api/recommendations/supplier-switch?current_supplier_id=1
        {
            "1": 75.0,
            "2": 85.0,
            "3": 80.0
        }
    """
    try:
        rec = recommendation_service.generate_supplier_recommendation(
            supplier_scores,
            current_supplier_id
        )
        
        return {
            "switch_recommendations": [rec],
            "action": rec.get("action"),
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def batch_recommendations(requests: List[RecommendationRequest]) -> Dict[str, Any]:
    """
    Generate recommendations for multiple products with Groq AI.

    Args:
        requests: List of recommendation requests

    Returns:
        Recommendations for all products, sorted by priority

    Example:
        POST /api/recommendations/batch
    """
    try:
        all_recommendations = []
        
        for req in requests:
            recommendations = []
            
            # Generate reorder recommendation if needed
            if req.product_id and req.current_stock is not None and req.forecast is not None:
                reorder_rec = recommendation_service.generate_reorder_recommendation(
                    req.product_id,
                    req.current_stock,
                    req.forecast
                )
                recommendations.append(reorder_rec)
            
            # Generate anomaly alert if needed
            if req.product_id and req.anomaly_score is not None and req.anomaly_score > 0.5:
                anomaly_rec = recommendation_service.generate_anomaly_alert(
                    req.product_id,
                    req.anomaly_score
                )
                recommendations.append(anomaly_rec)
            
            all_recommendations.extend(recommendations)
        
        # Sort by priority
        priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        all_recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "LOW"), 999))
        
        return {
            "total_requests": len(requests),
            "recommendations": all_recommendations,
            "critical_count": sum(1 for r in all_recommendations if r.get("priority") == "CRITICAL"),
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/priority")
async def get_priority_recommendations() -> Dict[str, Any]:
    """
    Get highest priority recommendations across all data.

    Returns:
        Top priority recommendations sorted by urgency

    Example:
        GET /api/recommendations/priority
    """
    try:
        # This would typically fetch from database/cache
        return {
            "critical": [],
            "high": [],
            "medium": [],
            "status": "pending",
            "message": "Database/cache integration needed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

"""
Supplier Routes

Endpoints for supplier scoring and evaluation with AI-powered recommendations.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from app.services.predictionService import PredictionService
from app.services.dataProcessingService import DataProcessingService
from app.services.recommendationService import RecommendationService

router = APIRouter()

# Initialize services
prediction_service = PredictionService()
data_processing_service = DataProcessingService()
recommendation_service = RecommendationService()


class InventoryData(BaseModel):
    """Schema for inventory data"""

    date: str
    stock: float
    product_id: int
    supplier_id: int


class SupplierScoringRequest(BaseModel):
    """Schema for supplier scoring request"""

    data: List[InventoryData]
    supplier_id: int = None


class SupplierScore(BaseModel):
    """Schema for supplier score"""

    supplier_id: int
    reliability_score: float
    rank: int


@router.post("/score", response_model=Dict[str, Any])
async def score_suppliers(request: SupplierScoringRequest) -> Dict[str, Any]:
    """
    Score suppliers based on performance data with AI assessment.

    Args:
        request: Supplier scoring request with performance data

    Returns:
        Supplier reliability scores with AI risk assessment

    Example:
        POST /api/suppliers/score
        {
            "data": [
                {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 2}
            ]
        }
    """
    try:
        # Convert request data to list of dicts
        data_list = [item.dict() for item in request.data]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Get unique suppliers and score them
        suppliers = processed_data['supplier_id'].unique() if 'supplier_id' in processed_data.columns else []
        supplier_scores = {}
        
        for supplier_id in suppliers:
            score_result = prediction_service.score_supplier(int(supplier_id), processed_data)
            supplier_scores[int(supplier_id)] = score_result
        
        # Rank suppliers
        ranked = sorted(
            [(sid, score.get("reliability_score", 0)) for sid, score in supplier_scores.items()],
            key=lambda x: x[1],
            reverse=True
        )
        
        return {
            "suppliers": supplier_scores,
            "ranked_suppliers": [{"supplier_id": sid, "reliability_score": score, "rank": idx+1} 
                                for idx, (sid, score) in enumerate(ranked)],
            "best_supplier": ranked[0][0] if ranked else None,
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supplier scoring error: {str(e)}")


@router.get("/{supplier_id}")
async def get_supplier_score(supplier_id: int) -> Dict[str, Any]:
    """
    Get reliability score for a specific supplier.

    Args:
        supplier_id: Supplier ID

    Returns:
        Supplier reliability information with AI assessment

    Example:
        GET /api/suppliers/2
    """
    try:
        # This would typically fetch from database/cache
        return {
            "supplier_id": supplier_id,
            "reliability_score": None,
            "status": "pending",
            "message": "Database/cache integration needed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare")
async def compare_suppliers(supplier_ids: List[int], request: SupplierScoringRequest) -> Dict[str, Any]:
    """
    Compare multiple suppliers with AI insights.

    Args:
        supplier_ids: List of supplier IDs to compare
        request: Supplier data

    Returns:
        Comparison results with recommendations

    Example:
        POST /api/suppliers/compare?supplier_ids=1&supplier_ids=2&supplier_ids=3
    """
    try:
        # Convert request data to list of dicts
        data_list = [item.dict() for item in request.data]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Score each supplier
        comparison_results = {}
        for supplier_id in supplier_ids:
            score_result = prediction_service.score_supplier(supplier_id, processed_data)
            comparison_results[supplier_id] = score_result
        
        # Find best supplier
        best_supplier_id = max(supplier_ids, key=lambda sid: comparison_results.get(sid, {}).get("reliability_score", 0))
        
        return {
            "suppliers_compared": supplier_ids,
            "comparison": comparison_results,
            "best_supplier": best_supplier_id,
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommendations")
async def get_supplier_recommendations(request: SupplierScoringRequest) -> Dict[str, Any]:
    """
    Get supplier switching recommendations with AI analysis.

    Args:
        request: Current supplier performance data

    Returns:
        Recommendations for supplier selection with AI explanations

    Example:
        POST /api/suppliers/recommendations
    """
    try:
        # Convert request data to list of dicts
        data_list = [item.dict() for item in request.data]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Get all unique suppliers and score them
        suppliers = processed_data['supplier_id'].unique() if 'supplier_id' in processed_data.columns else []
        supplier_scores = {}
        
        for supplier_id in suppliers:
            score_result = prediction_service.score_supplier(int(supplier_id), processed_data)
            supplier_scores[int(supplier_id)] = score_result.get("reliability_score", 0)
        
        # Generate recommendations for each current supplier
        if request.supplier_id:
            recommendation = recommendation_service.generate_supplier_recommendation(
                supplier_scores,
                request.supplier_id
            )
            return {
                "recommendations": [recommendation],
                "status": "success",
            }
        
        return {
            "recommendations": [],
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

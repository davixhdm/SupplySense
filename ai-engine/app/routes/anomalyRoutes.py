"""
Anomaly Detection Routes

Endpoints for detecting anomalies in inventory data.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

from app.services.predictionService import PredictionService
from app.services.dataProcessingService import DataProcessingService

router = APIRouter()

# Initialize services
prediction_service = PredictionService()
data_processing_service = DataProcessingService()


class InventoryData(BaseModel):
    """Schema for inventory data"""

    date: str
    stock: float
    product_id: int
    supplier_id: int


class AnomalyRequest(BaseModel):
    """Schema for anomaly detection request"""

    data: List[InventoryData]
    product_id: int = None
    supplier_id: int = None


class AnomalyResponse(BaseModel):
    """Schema for anomaly detection response"""

    anomalies_detected: bool
    anomaly_count: int
    anomaly_score: float


@router.post("/", response_model=Dict[str, Any])
async def detect_anomalies(request: AnomalyRequest) -> Dict[str, Any]:
    """
    Detect anomalies in inventory data with AI analysis.

    Args:
        request: Anomaly detection request with inventory data

    Returns:
        Anomalies detected with scores and AI analysis

    Example:
        POST /api/anomaly/
        {
            "data": [
                {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 2},
                {"date": "2024-01-02", "stock": 5, "product_id": 1, "supplier_id": 2}
            ],
            "product_id": 1
        }
    """
    try:
        if not request.product_id:
            raise HTTPException(status_code=400, detail="product_id is required")
        
        # Convert request data to list of dicts
        data_list = [item.dict() for item in request.data]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Detect anomalies with AI insights
        anomaly_result = prediction_service.detect_anomalies(request.product_id, processed_data)
        
        return {
            **anomaly_result,
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection error: {str(e)}")


@router.get("/{product_id}")
async def get_product_anomalies(product_id: int) -> Dict[str, Any]:
    """
    Get recent anomalies for a product.

    Args:
        product_id: Product ID

    Returns:
        List of detected anomalies

    Example:
        GET /api/anomaly/1
    """
    try:
        # This would typically fetch from a database/cache
        return {
            "product_id": product_id,
            "anomalies": [],
            "status": "pending",
            "message": "Database/cache integration needed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def batch_anomaly_detection(requests: List[AnomalyRequest]) -> Dict[str, Any]:
    """
    Detect anomalies for multiple products.

    Args:
        requests: List of anomaly detection requests

    Returns:
        Dictionary with anomaly results

    Example:
        POST /api/anomaly/batch
        [
            {
                "data": [...],
                "product_id": 1
            }
        ]
    """
    try:
        results = []
        for req in requests:
            # Convert request data to list of dicts
            data_list = [item.dict() for item in req.data]
            
            # Process data through core pipeline
            processed_data = data_processing_service.process_inventory_data(data_list)
            
            # Detect anomalies
            if req.product_id:
                result = prediction_service.detect_anomalies(req.product_id, processed_data)
                results.append(result)
        
        return {
            "total_products": len(requests),
            "anomalies_found": sum(1 for r in results if r.get("anomalies_detected")),
            "results": results,
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

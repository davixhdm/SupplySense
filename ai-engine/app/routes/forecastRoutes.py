"""
Forecasting Routes

Endpoints for demand and supply forecasting.
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


class ForecastRequest(BaseModel):
    """Schema for forecast request"""

    data: List[InventoryData]
    product_id: int
    periods: int = 7


class ForecastResponse(BaseModel):
    """Schema for forecast response"""

    product_id: int
    forecast: List[float]
    confidence_interval: float
    mean_forecast: float


@router.post("/", response_model=Dict[str, Any])
async def get_forecast(request: ForecastRequest) -> Dict[str, Any]:
    """
    Get demand forecast for a product.

    Args:
        request: Forecast request with inventory data

    Returns:
        Forecast predictions with confidence intervals and AI insights

    Example:
        POST /api/forecast/
        {
            "data": [
                {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 2}
            ],
            "product_id": 1,
            "periods": 7
        }
    """
    try:
        # Convert request data to list of dicts
        data_list = [item.dict() for item in request.data]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Get forecast with AI insights
        forecast_result = prediction_service.get_forecast(request.product_id, processed_data)
        
        return {
            **forecast_result,
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast error: {str(e)}")


@router.get("/{product_id}")
async def get_product_forecast(product_id: int) -> Dict[str, Any]:
    """
    Get latest forecast for a product.

    Args:
        product_id: Product ID

    Returns:
        Latest forecast data

    Example:
        GET /api/forecast/1
    """
    try:
        # This would typically fetch from a database/cache
        return {
            "product_id": product_id,
            "forecast": None,
            "status": "pending",
            "message": "Database/cache integration needed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch")
async def batch_forecast(requests: List[ForecastRequest]) -> Dict[str, Any]:
    """
    Get forecasts for multiple products.

    Args:
        requests: List of forecast requests

    Returns:
        Dictionary with forecasts for all products

    Example:
        POST /api/forecast/batch
        [
            {
                "data": [...],
                "product_id": 1,
                "periods": 7
            }
        ]
    """
    try:
        # TODO: Implement batch processing
        return {
            "total_products": len(requests),
            "forecasts": [],
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

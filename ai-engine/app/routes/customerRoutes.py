"""
Customer Routes

Endpoints for customer behavior prediction and analysis with AI insights.
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


class CustomerData(BaseModel):
    """Schema for customer transaction data"""

    date: str
    quantity: float
    customer_id: int
    product_id: int


class CustomerPredictionRequest(BaseModel):
    """Schema for customer prediction request"""

    data: List[CustomerData]
    customer_id: int


class CustomerSegment(BaseModel):
    """Schema for customer segment"""

    segment_name: str
    customer_count: int
    avg_spend: float


@router.post("/predict", response_model=Dict[str, Any])
async def predict_customer_behavior(request: CustomerPredictionRequest) -> Dict[str, Any]:
    """
    Predict customer purchase behavior with AI insights.

    Args:
        request: Customer prediction request with historical data

    Returns:
        Customer behavior prediction with AI analysis

    Example:
        POST /api/customers/predict
        {
            "data": [
                {"date": "2024-01-01", "quantity": 100, "customer_id": 1, "product_id": 1}
            ],
            "customer_id": 1
        }
    """
    try:
        # Convert customer data to standard format for processing
        data_list = [
            {
                "date": item.date,
                "stock": item.quantity,
                "product_id": item.product_id,
                "supplier_id": 0,  # Not applicable for customer data
                "customer_id": item.customer_id
            }
            for item in request.data
        ]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Predict customer behavior with AI insights
        prediction_result = prediction_service.predict_customer_behavior(request.customer_id, processed_data)
        
        return {
            **prediction_result,
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Customer prediction error: {str(e)}")


@router.get("/{customer_id}")
async def get_customer_profile(customer_id: int) -> Dict[str, Any]:
    """
    Get customer behavior profile.

    Args:
        customer_id: Customer ID

    Returns:
        Customer profile and behavior patterns

    Example:
        GET /api/customers/1
    """
    try:
        # This would typically fetch from database
        return {
            "customer_id": customer_id,
            "segment": None,
            "churn_risk": None,
            "status": "pending",
            "message": "Database integration needed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/segments")
async def get_customer_segments(requests: List[CustomerPredictionRequest]) -> Dict[str, Any]:
    """
    Identify customer segments with AI analysis.

    Args:
        requests: List of customer data

    Returns:
        Customer segmentation results

    Example:
        POST /api/customers/segments
    """
    try:
        segments = {}
        total_customers = len(requests)
        
        for req in requests:
            # Convert customer data to standard format
            data_list = [
                {
                    "date": item.date,
                    "stock": item.quantity,
                    "product_id": item.product_id,
                    "supplier_id": 0,
                    "customer_id": item.customer_id
                }
                for item in req.data
            ]
            
            # Process data through core pipeline
            processed_data = data_processing_service.process_inventory_data(data_list)
            
            # Predict for customer
            prediction = prediction_service.predict_customer_behavior(req.customer_id, processed_data)
            behavior = prediction.get("behavior_pattern", "moderate")
            
            if behavior not in segments:
                segments[behavior] = []
            segments[behavior].append(req.customer_id)
        
        return {
            "total_customers": total_customers,
            "segments": segments,
            "segment_count": len(segments),
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/churn-risk")
async def assess_churn_risk(request: CustomerPredictionRequest) -> Dict[str, Any]:
    """
    Assess customer churn risk with AI insights.

    Args:
        request: Customer data

    Returns:
        Churn risk assessment with recommendations

    Example:
        POST /api/customers/churn-risk
    """
    try:
        # Convert customer data to standard format
        data_list = [
            {
                "date": item.date,
                "stock": item.quantity,
                "product_id": item.product_id,
                "supplier_id": 0,
                "customer_id": item.customer_id
            }
            for item in request.data
        ]
        
        # Process data through core pipeline
        processed_data = data_processing_service.process_inventory_data(data_list)
        
        # Predict and assess churn
        prediction = prediction_service.predict_customer_behavior(request.customer_id, processed_data)
        
        # Simple churn risk calculation based on prediction confidence
        confidence = prediction.get("confidence", 0)
        churn_risk_score = 1 - confidence if confidence else 0.5
        
        risk_level = "LOW" if churn_risk_score < 0.3 else "MEDIUM" if churn_risk_score < 0.6 else "HIGH"
        
        return {
            "customer_id": request.customer_id,
            "churn_risk_score": churn_risk_score,
            "risk_level": risk_level,
            "recommendation": prediction.get("ai_insights", "Monitor customer behavior"),
            "status": "success",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

"""
Insights Routes

Endpoints for accessing AI-generated insights across different prediction domains.
Aggregates and surfaces insights from forecasting, anomaly detection, supplier scoring,
and customer behavior analysis.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.services.predictionService import PredictionService
from app.services.dataProcessingService import DataProcessingService

router = APIRouter()

# Initialize services
prediction_service = PredictionService()
data_processing_service = DataProcessingService()


class ForecastInsightRequest(BaseModel):
    """Schema for forecast insight request"""
    product_id: int
    current_stock: float
    forecast_values: List[float]
    trend: Optional[str] = "increasing"  # 'increasing' or 'decreasing'
    confidence: Optional[float] = 0.8


class AnomalyInsightRequest(BaseModel):
    """Schema for anomaly insight request"""
    product_id: int
    anomaly_score: float
    pattern: Optional[str] = "spike"  # 'spike' or 'drop'


class SupplierInsightRequest(BaseModel):
    """Schema for supplier insight request"""
    supplier_id: int
    reliability_score: float
    metrics: Dict[str, float]
    trend: Optional[str] = "stable"  # 'improving', 'stable', 'declining'


class CustomerInsightRequest(BaseModel):
    """Schema for customer insight request"""
    customer_id: int
    purchase_history: Dict[str, Any]
    behavior_pattern: Optional[str] = "moderate"  # 'high_volume', 'moderate', 'low_volume'


class AggregatedInsightRequest(BaseModel):
    """Schema for aggregated insights request"""
    product_id: Optional[int] = None
    customer_id: Optional[int] = None
    supplier_id: Optional[int] = None
    forecast_data: Optional[Dict[str, Any]] = None
    anomaly_data: Optional[Dict[str, Any]] = None
    supplier_data: Optional[Dict[str, Any]] = None
    customer_data: Optional[Dict[str, Any]] = None


class InsightResponse(BaseModel):
    """Schema for insight response"""
    insight_type: str
    subject_id: int
    insight_content: str
    severity_level: Optional[str] = None
    confidence_score: Optional[float] = None
    recommendations: Optional[List[str]] = None


@router.post("/forecast/{product_id}", response_model=Dict[str, Any])
async def get_forecast_insight(product_id: int, request: ForecastInsightRequest) -> Dict[str, Any]:
    """
    Get AI-generated forecast insight for a product.

    Args:
        product_id: Product ID
        request: Forecast insight request with prediction data

    Returns:
        Detailed forecast insight with analysis and recommendations

    Example:
        POST /api/insights/forecast/1
        {
            "product_id": 1,
            "current_stock": 50,
            "forecast_values": [45, 48, 52, 55, 58, 60, 62],
            "trend": "increasing",
            "confidence": 0.85
        }
    """
    try:
        insight = prediction_service._generate_local_forecast_insight(
            product_id=product_id,
            forecast=request.forecast_values,
            current_stock=request.current_stock,
            trend=request.trend,
            confidence=request.confidence
        )
        
        # Parse insight to extract recommendations
        recommendations = []
        if "increasing" in request.trend:
            recommendations.append("Prioritize reordering due to increasing demand trend")
        if request.confidence > 0.8:
            recommendations.append("High model confidence - use prediction for planning")
        else:
            recommendations.append("Verify with recent trends due to lower model confidence")
        
        return {
            "insight_type": "forecast",
            "product_id": product_id,
            "insight_content": insight,
            "confidence_score": request.confidence,
            "recommendations": recommendations,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast insight error: {str(e)}")


@router.post("/anomaly/{product_id}", response_model=Dict[str, Any])
async def get_anomaly_insight(product_id: int, request: AnomalyInsightRequest) -> Dict[str, Any]:
    """
    Get AI-generated anomaly insight for a product.

    Args:
        product_id: Product ID
        request: Anomaly insight request with detection data

    Returns:
        Detailed anomaly analysis with severity and recommendations

    Example:
        POST /api/insights/anomaly/1
        {
            "product_id": 1,
            "anomaly_score": 0.85,
            "pattern": "spike"
        }
    """
    try:
        analysis = prediction_service._generate_local_anomaly_analysis(
            product_id=product_id,
            anomaly_score=request.anomaly_score,
            pattern=request.pattern
        )
        
        # Determine severity level
        if request.anomaly_score > 0.8:
            severity = "CRITICAL"
        elif request.anomaly_score > 0.6:
            severity = "HIGH"
        else:
            severity = "MEDIUM"
        
        # Generate recommendations based on pattern
        recommendations = []
        if request.pattern == "spike":
            recommendations.extend([
                "Verify inventory records immediately",
                "Check supplier status and communications",
                "Investigate recent demand patterns"
            ])
        else:  # drop
            recommendations.extend([
                "Perform physical inventory count",
                "Audit recent sales records",
                "Verify system data integrity"
            ])
        
        return {
            "insight_type": "anomaly",
            "product_id": product_id,
            "insight_content": analysis,
            "severity_level": severity,
            "confidence_score": request.anomaly_score,
            "recommendations": recommendations,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly insight error: {str(e)}")


@router.post("/supplier/{supplier_id}", response_model=Dict[str, Any])
async def get_supplier_insight(supplier_id: int, request: SupplierInsightRequest) -> Dict[str, Any]:
    """
    Get AI-generated supplier assessment insight.

    Args:
        supplier_id: Supplier ID
        request: Supplier insight request with performance data

    Returns:
        Detailed supplier assessment with risk level and recommendations

    Example:
        POST /api/insights/supplier/1
        {
            "supplier_id": 1,
            "reliability_score": 85.5,
            "metrics": {
                "on_time_delivery": 0.95,
                "quality_score": 0.92
            },
            "trend": "improving"
        }
    """
    try:
        assessment = prediction_service._generate_local_supplier_assessment(
            supplier_id=supplier_id,
            reliability_score=request.reliability_score,
            metrics=request.metrics,
            trend=request.trend
        )
        
        # Determine risk level
        if request.reliability_score < 40:
            risk_level = "HIGH"
        elif request.reliability_score < 70:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Generate recommendations
        recommendations = []
        if risk_level == "HIGH":
            recommendations.append("Consider escalation or alternative suppliers")
        if request.trend == "declining":
            recommendations.append("Monitor performance closely and prepare contingency plans")
        if request.trend == "improving":
            recommendations.append("Maintain current partnership with positive reinforcement")
        
        return {
            "insight_type": "supplier",
            "supplier_id": supplier_id,
            "insight_content": assessment,
            "severity_level": risk_level,
            "confidence_score": request.reliability_score / 100,
            "recommendations": recommendations,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supplier insight error: {str(e)}")


@router.post("/customer/{customer_id}", response_model=Dict[str, Any])
async def get_customer_insight(customer_id: int, request: CustomerInsightRequest) -> Dict[str, Any]:
    """
    Get AI-generated customer behavior insight.

    Args:
        customer_id: Customer ID
        request: Customer insight request with behavior data

    Returns:
        Detailed customer analysis with segment and recommendations

    Example:
        POST /api/insights/customer/1
        {
            "customer_id": 1,
            "purchase_history": {
                "total_purchases": 15,
                "avg_order_size": 500.0
            },
            "behavior_pattern": "high_volume"
        }
    """
    try:
        insights = prediction_service._generate_local_customer_insights(
            customer_id=customer_id,
            purchase_history=request.purchase_history,
            behavior_pattern=request.behavior_pattern
        )
        
        # Generate value-based recommendations
        recommendations = []
        total_purchases = request.purchase_history.get("total_purchases", 0)
        
        if request.behavior_pattern == "high_volume":
            recommendations.extend([
                "Implement loyalty program or volume discounts",
                "Assign dedicated account manager",
                "Prioritize service quality and responsiveness"
            ])
        elif request.behavior_pattern == "moderate":
            recommendations.extend([
                "Maintain consistent service quality",
                "Engage with targeted growth initiatives",
                "Monitor for upsell opportunities"
            ])
        else:  # low_volume
            recommendations.extend([
                "Design re-engagement campaigns",
                "Offer introductory incentives",
                "Track conversion and retention metrics"
            ])
        
        # Determine segment confidence based on purchase history
        confidence = min(total_purchases / 20, 1.0)
        
        return {
            "insight_type": "customer",
            "customer_id": customer_id,
            "insight_content": insights,
            "severity_level": request.behavior_pattern.upper(),
            "confidence_score": confidence,
            "recommendations": recommendations,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Customer insight error: {str(e)}")


@router.post("/aggregated", response_model=Dict[str, Any])
async def get_aggregated_insights(request: AggregatedInsightRequest) -> Dict[str, Any]:
    """
    Get comprehensive aggregated insights across multiple prediction domains.

    Args:
        request: Aggregated insight request with data from multiple sources

    Returns:
        Consolidated insights with cross-domain recommendations

    Example:
        POST /api/insights/aggregated
        {
            "product_id": 1,
            "customer_id": 5,
            "forecast_data": {
                "current_stock": 50,
                "forecast_values": [45, 48, 52],
                "confidence": 0.85
            },
            "anomaly_data": {
                "anomaly_score": 0.3,
                "pattern": "spike"
            }
        }
    """
    try:
        aggregated_insights = []
        recommendations_set = set()
        
        # Process forecast insight if available
        if request.forecast_data and request.product_id:
            forecast_insight = prediction_service._generate_local_forecast_insight(
                product_id=request.product_id,
                forecast=request.forecast_data.get("forecast_values", []),
                current_stock=request.forecast_data.get("current_stock", 0),
                trend=request.forecast_data.get("trend", "increasing"),
                confidence=request.forecast_data.get("confidence", 0.8)
            )
            aggregated_insights.append({
                "type": "forecast",
                "insight": forecast_insight
            })
        
        # Process anomaly insight if available
        if request.anomaly_data and request.product_id:
            anomaly_insight = prediction_service._generate_local_anomaly_analysis(
                product_id=request.product_id,
                anomaly_score=request.anomaly_data.get("anomaly_score", 0),
                pattern=request.anomaly_data.get("pattern", "spike")
            )
            aggregated_insights.append({
                "type": "anomaly",
                "insight": anomaly_insight
            })
        
        # Process supplier insight if available
        if request.supplier_data and request.supplier_id:
            supplier_insight = prediction_service._generate_local_supplier_assessment(
                supplier_id=request.supplier_id,
                reliability_score=request.supplier_data.get("reliability_score", 0),
                metrics=request.supplier_data.get("metrics", {}),
                trend=request.supplier_data.get("trend", "stable")
            )
            aggregated_insights.append({
                "type": "supplier",
                "insight": supplier_insight
            })
        
        # Process customer insight if available
        if request.customer_data and request.customer_id:
            customer_insight = prediction_service._generate_local_customer_insights(
                customer_id=request.customer_id,
                purchase_history=request.customer_data.get("purchase_history", {}),
                behavior_pattern=request.customer_data.get("behavior_pattern", "moderate")
            )
            aggregated_insights.append({
                "type": "customer",
                "insight": customer_insight
            })
        
        return {
            "aggregated_insights": aggregated_insights,
            "total_insights": len(aggregated_insights),
            "product_id": request.product_id,
            "customer_id": request.customer_id,
            "supplier_id": request.supplier_id,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aggregated insights error: {str(e)}")


@router.get("/health")
async def insights_health() -> Dict[str, str]:
    """
    Health check for insights service.

    Returns:
        Service status
    """
    return {
        "status": "healthy",
        "service": "Insights Engine",
        "timestamp": ""
    }

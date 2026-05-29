from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.detailedResponseGenerator import DetailedResponseGenerator
import numpy as np

router = APIRouter()
response_generator = DetailedResponseGenerator()

class InventoryData(BaseModel):
    date: str
    stock: float
    product_id: int
    supplier_id: int

class AnomalyRequest(BaseModel):
    data: List[InventoryData]
    product_id: int = None
    supplier_id: int = None

@router.post("/detect")
async def detect_anomalies(request: AnomalyRequest) -> Dict[str, Any]:
    try:
        data_list = [item.dict() for item in request.data]
        
        # Simple anomaly detection
        if data_list:
            values = [d.get('stock', 0) for d in data_list]
            mean = np.mean(values)
            std = np.std(values)
            anomalies = [
                {"date": d.get('date'), "value": d.get('stock'), "score": 
                 abs((d.get('stock', 0) - mean) / std) if std > 0 else 0}
                for d in data_list
            ]
            detected = [a for a in anomalies if a['score'] > 2]
        else:
            anomalies = []
            detected = []
        
        # Get detailed response for detected anomalies
        if detected:
            detailed_response = response_generator.generate_detailed_anomaly_response(
                product_id=request.product_id or 0,
                anomaly_data={
                    "score": max([a['score'] for a in detected]) if detected else 0,
                    "pattern": "Significant deviation from expected values",
                    "count": len(detected)
                },
                raw_data=data_list
            )
            
            return {
                "anomalies_detected": True,
                "anomaly_count": len(detected),
                "anomalies": detected,
                "mean_anomaly_score": np.mean([a['score'] for a in detected]) if detected else 0,
                "detailed_analysis": detailed_response.get("detailed_analysis", {}),
                "investigation_steps": detailed_response.get("investigation_steps", []),
                "recommendations": detailed_response.get("recommendations", []),
                "severity": detailed_response.get("severity_level", "MEDIUM"),
                "confidence": detailed_response.get("confidence_score", 0.85)
            }
        else:
            return {
                "anomalies_detected": False,
                "anomaly_count": 0,
                "anomalies": [],
                "mean_anomaly_score": 0.1,
                "message": "No significant anomalies detected",
                "confidence": 0.9
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
async def get_product_anomalies(product_id: int) -> Dict[str, Any]:
    return {
        "product_id": product_id,
        "anomalies": [],
        "message": "Use POST /detect endpoint with historical data to detect anomalies",
        "status": "pending"
    }
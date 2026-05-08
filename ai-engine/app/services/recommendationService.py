"""
Recommendation Service

Generates intelligent recommendations based on predictions and business logic.

Responsibilities:
- Analyze predictions
- Generate recommendations (reorder, switch suppliers, etc.)
- Rank recommendations by priority
- Format recommendations for frontend
"""

from typing import Dict, List, Any
from datetime import datetime
import pandas as pd


class RecommendationService:
    """
    Service for generating intelligent recommendations based on predictions.
    """

    def __init__(self):
        """Initialize recommendation service"""
        pass

    def generate_reorder_recommendation(
        self, product_id: int, current_stock: float, forecast: float, lead_time: int = 7
    ) -> Dict[str, Any]:
        """
        Generate reorder recommendation based on forecast and current stock.

        Args:
            product_id: Product ID
            current_stock: Current stock level
            forecast: Forecasted demand
            lead_time: Supplier lead time in days

        Returns:
            Reorder recommendation
        """
        reorder_point = forecast * lead_time

        return {
            "type": "reorder",
            "product_id": product_id,
            "current_stock": current_stock,
            "reorder_point": reorder_point,
            "recommended_quantity": max(0, reorder_point - current_stock),
            "priority": self._calculate_priority(current_stock, reorder_point),
            "action": "REORDER" if current_stock < reorder_point else "MONITOR",
            "timestamp": datetime.now().isoformat(),
        }

    def generate_supplier_recommendation(
        self, supplier_scores: Dict[int, float], current_supplier_id: int
    ) -> Dict[str, Any]:
        """
        Generate supplier switch recommendation if a better supplier is available.

        Args:
            supplier_scores: Dictionary of supplier_id -> reliability_score
            current_supplier_id: Currently used supplier ID

        Returns:
            Supplier recommendation
        """
        if not supplier_scores:
            return {"type": "supplier_switch", "action": "MAINTAIN", "reason": "No alternatives available"}

        current_score = supplier_scores.get(current_supplier_id, 0)
        best_supplier_id = max(supplier_scores, key=supplier_scores.get)
        best_score = supplier_scores[best_supplier_id]

        # Recommend switch if better supplier is significantly better (>=10% improvement)
        should_switch = best_score >= current_score * 1.1

        return {
            "type": "supplier_switch",
            "current_supplier_id": current_supplier_id,
            "current_score": current_score,
            "recommended_supplier_id": best_supplier_id if should_switch else current_supplier_id,
            "recommended_score": best_score,
            "action": "SWITCH" if should_switch else "MAINTAIN",
            "reason": f"Better supplier available (score: {best_score:.2f})" if should_switch else "Current supplier performing well",
            "timestamp": datetime.now().isoformat(),
        }

    def generate_anomaly_alert(self, product_id: int, anomaly_score: float) -> Dict[str, Any]:
        """
        Generate alert for detected anomalies.

        Args:
            product_id: Product ID
            anomaly_score: Score indicating degree of anomaly

        Returns:
            Anomaly alert recommendation
        """
        severity = self._calculate_severity(anomaly_score)

        return {
            "type": "anomaly_alert",
            "product_id": product_id,
            "anomaly_score": anomaly_score,
            "severity": severity,
            "action": "INVESTIGATE",
            "message": f"Unusual inventory pattern detected (severity: {severity})",
            "timestamp": datetime.now().isoformat(),
        }

    def generate_bulk_recommendations(self, predictions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generate multiple recommendations from a set of predictions.

        Args:
            predictions: Dictionary containing various prediction results

        Returns:
            List of recommendations ranked by priority
        """
        recommendations = []

        # Generate reorder recommendations from forecasts
        if "forecasts" in predictions:
            for forecast in predictions["forecasts"]:
                rec = self.generate_reorder_recommendation(
                    forecast["product_id"],
                    forecast["current_stock"],
                    forecast["forecast"],
                )
                recommendations.append(rec)

        # Generate anomaly alerts
        if "anomalies" in predictions:
            for anomaly in predictions["anomalies"]:
                if anomaly["anomaly_detected"]:
                    rec = self.generate_anomaly_alert(anomaly["product_id"], anomaly["anomaly_score"])
                    recommendations.append(rec)

        # Sort by priority (CRITICAL > HIGH > MEDIUM > LOW)
        priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        recommendations.sort(key=lambda x: priority_order.get(x.get("priority", "LOW"), 999))

        return recommendations

    @staticmethod
    def _calculate_priority(current_stock: float, reorder_point: float) -> str:
        """
        Calculate priority level based on stock situation.

        Args:
            current_stock: Current stock level
            reorder_point: Reorder point threshold

        Returns:
            Priority level (CRITICAL, HIGH, MEDIUM, LOW)
        """
        if current_stock <= 0:
            return "CRITICAL"
        elif current_stock < reorder_point * 0.5:
            return "HIGH"
        elif current_stock < reorder_point:
            return "MEDIUM"
        else:
            return "LOW"

    @staticmethod
    def _calculate_severity(anomaly_score: float) -> str:
        """
        Calculate severity level for anomalies.

        Args:
            anomaly_score: Score from anomaly detection model

        Returns:
            Severity level (CRITICAL, HIGH, MEDIUM, LOW)
        """
        if anomaly_score > 0.8:
            return "CRITICAL"
        elif anomaly_score > 0.6:
            return "HIGH"
        elif anomaly_score > 0.4:
            return "MEDIUM"
        else:
            return "LOW"

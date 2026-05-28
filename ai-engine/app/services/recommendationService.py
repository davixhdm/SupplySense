"""
Recommendation Service

Generates intelligent recommendations based on predictions and business logic.

Responsibilities:
- Analyze predictions
- Generate recommendations (reorder, switch suppliers, etc.)
- Rank recommendations by priority
- Format recommendations for frontend
- Leverage Groq AI for enhanced explanations
"""

from typing import Dict, List, Any
from datetime import datetime
import pandas as pd
from app.services.groqAIService import GroqAIService


class RecommendationService:
    """
    Service for generating intelligent recommendations based on predictions.
    """

    def __init__(self):
        """Initialize recommendation service"""
        self.groq_service = GroqAIService()

    def generate_reorder_recommendation(
        self, product_id: int, current_stock: float, forecast: float, lead_time: int = 7
    ) -> Dict[str, Any]:
        """
        Generate reorder recommendation based on forecast and current stock.
        Uses local algorithm logic. Optional Groq AI enhancement if available.

        Args:
            product_id: Product ID
            current_stock: Current stock level
            forecast: Forecasted demand
            lead_time: Supplier lead time in days

        Returns:
            Reorder recommendation
        """
        reorder_point = forecast * lead_time
        recommended_qty = max(0, reorder_point - current_stock)
        
        # Generate local explanation using business logic
        local_explanation = self._generate_local_reorder_explanation(
            product_id, current_stock, forecast, reorder_point, recommended_qty, lead_time
        )

        base_rec = {
            "type": "reorder",
            "product_id": product_id,
            "current_stock": current_stock,
            "reorder_point": reorder_point,
            "recommended_quantity": recommended_qty,
            "priority": self._calculate_priority(current_stock, reorder_point),
            "action": "REORDER" if current_stock < reorder_point else "MONITOR",
            "ai_explanation": local_explanation,
            "confidence": 0.8,
            "timestamp": datetime.now().isoformat(),
            "source": "local_algorithm"
        }
        
        # Optionally enhance with Groq AI explanation if available (non-blocking)
        if self.groq_service.available:
            try:
                groq_rec = self.groq_service.generate_smart_recommendation(
                    "forecast",
                    {
                        "product_id": product_id,
                        "current_stock": current_stock,
                        "forecast": forecast,
                        "recommended_quantity": recommended_qty
                    }
                )
                base_rec["ai_explanation"] = groq_rec.get("ai_recommendation", local_explanation)
                base_rec["confidence"] = groq_rec.get("confidence_score", 0.82)
                base_rec["source"] = "local_algorithm_with_ai_enhancement"
            except:
                pass  # Use local explanation if Groq fails

        return base_rec

    def generate_supplier_recommendation(
        self, supplier_scores: Dict[int, float], current_supplier_id: int
    ) -> Dict[str, Any]:
        """
        Generate supplier switch recommendation if a better supplier is available.
        Uses local business logic. Optional Groq AI enhancement if available.

        Args:
            supplier_scores: Dictionary of supplier_id -> reliability_score
            current_supplier_id: Currently used supplier ID

        Returns:
            Supplier recommendation
        """
        if not supplier_scores:
            return {"type": "supplier_switch", "action": "MAINTAIN", "reason": "No alternatives available", "source": "local_algorithm"}

        current_score = supplier_scores.get(current_supplier_id, 0)
        best_supplier_id = max(supplier_scores, key=supplier_scores.get)
        best_score = supplier_scores[best_supplier_id]

        # Recommend switch if better supplier is significantly better (>=10% improvement)
        should_switch = best_score >= current_score * 1.1
        
        # Generate local explanation
        local_explanation = self._generate_local_supplier_explanation(
            current_supplier_id, current_score, best_supplier_id, best_score, should_switch
        )

        base_rec = {
            "type": "supplier_switch",
            "current_supplier_id": current_supplier_id,
            "current_score": current_score,
            "recommended_supplier_id": best_supplier_id if should_switch else current_supplier_id,
            "recommended_score": best_score,
            "action": "SWITCH" if should_switch else "MAINTAIN",
            "reason": f"Better supplier available (score: {best_score:.2f})" if should_switch else "Current supplier performing well",
            "ai_recommendation": local_explanation,
            "confidence": 0.8,
            "timestamp": datetime.now().isoformat(),
            "source": "local_algorithm"
        }
        
        # Optionally enhance with Groq AI recommendation if available (non-blocking)
        if self.groq_service.available:
            try:
                groq_rec = self.groq_service.generate_smart_recommendation(
                    "supplier",
                    {
                        "current_supplier_id": current_supplier_id,
                        "current_score": current_score,
                        "alternative_supplier_id": best_supplier_id,
                        "alternative_score": best_score
                    }
                )
                base_rec["ai_recommendation"] = groq_rec.get("ai_recommendation", local_explanation)
                base_rec["confidence"] = groq_rec.get("confidence_score", 0.82)
                base_rec["source"] = "local_algorithm_with_ai_enhancement"
            except:
                pass  # Use local explanation if Groq fails

        return base_rec

    def generate_anomaly_alert(self, product_id: int, anomaly_score: float) -> Dict[str, Any]:
        """
        Generate alert for detected anomalies.
        Uses local business logic. Optional Groq AI enhancement if available.

        Args:
            product_id: Product ID
            anomaly_score: Score indicating degree of anomaly

        Returns:
            Anomaly alert recommendation
        """
        severity = self._calculate_severity(anomaly_score)
        
        # Generate local explanation
        local_explanation = self._generate_local_anomaly_explanation(product_id, anomaly_score, severity)

        base_alert = {
            "type": "anomaly_alert",
            "product_id": product_id,
            "anomaly_score": anomaly_score,
            "severity": severity,
            "action": "INVESTIGATE",
            "message": f"Unusual inventory pattern detected (severity: {severity})",
            "ai_analysis": local_explanation,
            "confidence": 0.8,
            "timestamp": datetime.now().isoformat(),
            "source": "local_algorithm"
        }
        
        # Optionally enhance with Groq AI analysis if available (non-blocking)
        if self.groq_service.available:
            try:
                groq_analysis = self.groq_service.generate_smart_recommendation(
                    "anomaly",
                    {
                        "product_id": product_id,
                        "anomaly_score": anomaly_score,
                        "severity": severity
                    }
                )
                base_alert["ai_analysis"] = groq_analysis.get("ai_recommendation", local_explanation)
                base_alert["confidence"] = groq_analysis.get("confidence_score", 0.82)
                base_alert["source"] = "local_algorithm_with_ai_enhancement"
            except:
                pass  # Use local explanation if Groq fails

        return base_alert

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
    
    # ============ LOCAL EXPLANATION GENERATION HELPERS (OFFLINE CAPABLE) ============
    
    @staticmethod
    def _generate_local_reorder_explanation(product_id: int, current_stock: float, forecast: float,
                                           reorder_point: float, recommended_qty: float, 
                                           lead_time: int) -> str:
        """
        Generate reorder explanation using local business logic (no AI needed).
        
        Returns:
            Explanation string
        """
        try:
            if recommended_qty == 0:
                return f"Current stock ({current_stock:.1f}) is above reorder point ({reorder_point:.1f}). " \
                       f"Monitor consumption and reorder when stock approaches {reorder_point:.1f} units."
            
            urgency = "URGENT" if current_stock < reorder_point * 0.3 else "HIGH" if current_stock < reorder_point else "MEDIUM"
            
            explanation = f"Reorder {recommended_qty:.1f} units for product {product_id}. "
            explanation += f"Lead time: {lead_time} days. Forecasted demand: {forecast:.1f} units/day. "
            explanation += f"Current stock: {current_stock:.1f}. Reorder point: {reorder_point:.1f} ({urgency} priority). "
            explanation += "Recommend ordering promptly to avoid stockouts."
            
            return explanation
        except Exception as e:
            return f"Reorder {recommended_qty} units to maintain stock above {reorder_point}"
    
    @staticmethod
    def _generate_local_supplier_explanation(current_supplier_id: int, current_score: float,
                                            alternative_supplier_id: int, alternative_score: float,
                                            should_switch: bool) -> str:
        """
        Generate supplier recommendation explanation using local business logic (no AI needed).
        
        Returns:
            Explanation string
        """
        try:
            if not should_switch:
                return f"Current supplier {current_supplier_id} has score {current_score:.1f}/100. " \
                       f"No better alternatives available. Continue current partnership with performance monitoring."
            
            improvement = ((alternative_score - current_score) / current_score * 100) if current_score > 0 else 0
            
            explanation = f"Switch from supplier {current_supplier_id} (score: {current_score:.1f}) "
            explanation += f"to supplier {alternative_supplier_id} (score: {alternative_score:.1f}). "
            explanation += f"Expected improvement: {improvement:.1f}%. "
            explanation += "Recommend evaluating transition plan and terms with new supplier."
            
            return explanation
        except Exception as e:
            return "Review supplier alternatives for better reliability and performance."
    
    @staticmethod
    def _generate_local_anomaly_explanation(product_id: int, anomaly_score: float, severity: str) -> str:
        """
        Generate anomaly alert explanation using local business logic (no AI needed).
        
        Returns:
            Explanation string
        """
        try:
            explanation = f"Product {product_id} shows unusual inventory pattern ({severity} severity). "
            explanation += f"Anomaly score: {anomaly_score:.2f}/1.0. "
            explanation += "Recommend immediate investigation of inventory records, "
            explanation += "recent sales transactions, and system logs for anomalies."
            
            return explanation
        except Exception as e:
            return f"Unusual inventory pattern detected for product {product_id}. Investigate immediately."

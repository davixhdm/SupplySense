"""
Groq AI Service

Integrates Groq AI for enhanced predictions and intelligent recommendations.

Responsibilities:
- Enhance predictions with AI insights
- Generate intelligent recommendations
- Analyze anomalies with contextual understanding
- Provide confidence scores and explanations
"""

from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import os
from groq import Groq

class GroqAIService:
    """
    Service for leveraging Groq AI to enhance predictions and recommendations.
    """

    def __init__(self):
        """Initialize Groq AI service"""
        try:
            api_key = os.getenv("GROQ_API_KEY")
            api_url = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1")
            if api_key:
                self.client = Groq(api_key=api_key, base_url=api_url)
                self.model = "mixtral-8x7b-32768"  # Fast and accurate model
                self.available = True
            else:
                self.client = None
                self.model = None
                self.available = False
                print("Warning: GROQ_API_KEY not set. AI enhancements disabled.")
        except Exception as e:
            self.client = None
            self.model = None
            self.available = False
            print(f"Warning: Could not initialize Groq AI service: {e}")
    
    def enhance_forecast_insight(self, product_id: int, forecast: List[float], 
                                 current_stock: float, historical_trend: str) -> Dict[str, Any]:
        """
        Generate AI-powered insights for demand forecasts.

        Args:
            product_id: Product ID
            forecast: List of forecasted values
            current_stock: Current stock level
            historical_trend: Description of historical trend

        Returns:
            Enhanced forecast with AI insights
        """
        try:
            if not self.available or not self.client:
                return {
                    "product_id": product_id,
                    "forecast": forecast,
                    "ai_insight": f"Forecast indicates {'increasing' if len(forecast) > 1 and forecast[-1] > forecast[0] else 'decreasing'} demand based on {historical_trend} trend. Current stock: {current_stock}",
                    "confidence": 0.6,
                    "generated_at": datetime.now().isoformat(),
                    "note": "AI service unavailable - using basic analysis"
                }
            
            prompt = f"""
            Analyze this supply chain forecast data and provide insights:
            - Product ID: {product_id}
            - Forecasted Demand: {forecast}
            - Current Stock: {current_stock}
            - Historical Trend: {historical_trend}
            
            Provide a brief, actionable insight (2-3 sentences) on:
            1. Whether the forecast indicates normal, high, or low demand
            2. Potential risks or opportunities
            3. Recommended action
            
            Keep response concise and business-focused.
            """
            
            response = self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            insight = response.choices[0].message.content
            
            return {
                "product_id": product_id,
                "forecast": forecast,
                "ai_insight": insight,
                "confidence": 0.85,
                "generated_at": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "product_id": product_id,
                "ai_insight": f"Error generating insight: {str(e)}",
                "error": True
            }

    def analyze_anomaly(self, product_id: int, anomaly_score: float, 
                       pattern_description: str) -> Dict[str, Any]:
        """
        Generate AI analysis for detected anomalies.

        Args:
            product_id: Product ID
            anomaly_score: Anomaly score (0-1)
            pattern_description: Description of the anomalous pattern

        Returns:
            AI analysis of the anomaly
        """
        try:
            severity = "CRITICAL" if anomaly_score > 0.8 else "HIGH" if anomaly_score > 0.6 else "MEDIUM"
            
            if not self.available or not self.client:
                return {
                    "product_id": product_id,
                    "anomaly_score": anomaly_score,
                    "severity": severity,
                    "ai_analysis": f"{severity} anomaly detected: {pattern_description}. Investigate immediately.",
                    "timestamp": datetime.now().isoformat(),
                    "note": "AI service unavailable - using basic analysis"
                }
            
            prompt = f"""
            Analyze this inventory anomaly and provide insights:
            - Product ID: {product_id}
            - Anomaly Score: {anomaly_score:.2f} (0-1 scale, higher = more anomalous)
            - Severity: {severity}
            - Pattern: {pattern_description}
            
            Provide:
            1. Root cause analysis (1 sentence)
            2. Potential impact (1 sentence)
            3. Recommended investigation steps (1-2 sentences)
            
            Be concise and actionable.
            """
            
            response = self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            analysis = response.choices[0].message.content
            
            return {
                "product_id": product_id,
                "anomaly_score": anomaly_score,
                "severity": severity,
                "ai_analysis": analysis,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "product_id": product_id,
                "error": f"Error analyzing anomaly: {str(e)}"
            }

    def assess_supplier_risk(self, supplier_id: int, reliability_score: float,
                            performance_metrics: Dict[str, float]) -> Dict[str, Any]:
        """
        Generate AI-powered supplier risk assessment.

        Args:
            supplier_id: Supplier ID
            reliability_score: Reliability score (0-100)
            performance_metrics: Dictionary of performance metrics

        Returns:
            Risk assessment and recommendations
        """
        try:
            risk_level = "HIGH" if reliability_score < 40 else "MEDIUM" if reliability_score < 70 else "LOW"
            
            if not self.available or not self.client:
                return {
                    "supplier_id": supplier_id,
                    "reliability_score": reliability_score,
                    "risk_level": risk_level,
                    "ai_assessment": f"Supplier {supplier_id} has {risk_level} risk based on reliability score of {reliability_score}/100. Monitor performance closely.",
                    "timestamp": datetime.now().isoformat(),
                    "note": "AI service unavailable - using basic analysis"
                }
            
            metrics_str = ", ".join([f"{k}: {v:.2f}" for k, v in performance_metrics.items()])
            
            prompt = f"""
            Evaluate supplier reliability and risk:
            - Supplier ID: {supplier_id}
            - Reliability Score: {reliability_score}/100
            - Performance Metrics: {metrics_str}
            
            Provide:
            1. Risk assessment (LOW/MEDIUM/HIGH)
            2. Key concerns (1 sentence)
            3. Mitigation recommendations (1-2 sentences)
            
            Be concise and actionable.
            """
            
            response = self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            assessment = response.choices[0].message.content
            
            return {
                "supplier_id": supplier_id,
                "reliability_score": reliability_score,
                "risk_level": risk_level,
                "ai_assessment": assessment,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "supplier_id": supplier_id,
                "error": f"Error assessing supplier: {str(e)}"
            }

    def predict_customer_insights(self, customer_id: int, purchase_history: Dict[str, Any],
                                 behavior_pattern: str) -> Dict[str, Any]:
        """
        Generate AI insights for customer behavior prediction.

        Args:
            customer_id: Customer ID
            purchase_history: Dictionary with purchase frequency, average order size, etc.
            behavior_pattern: Description of customer behavior pattern

        Returns:
            Customer insights and recommendations
        """
        try:
            if not self.available or not self.client:
                return {
                    "customer_id": customer_id,
                    "ai_insights": f"Customer {customer_id} shows {behavior_pattern} behavior. Total purchases: {purchase_history.get('total_purchases', 0)}. Consider targeted engagement strategies.",
                    "timestamp": datetime.now().isoformat(),
                    "note": "AI service unavailable - using basic analysis"
                }
            
            history_str = ", ".join([f"{k}: {v}" for k, v in purchase_history.items()])
            
            prompt = f"""
            Analyze customer behavior and predict future trends:
            - Customer ID: {customer_id}
            - Purchase History: {history_str}
            - Behavior Pattern: {behavior_pattern}
            
            Provide:
            1. Customer segmentation (e.g., high-value, growth potential, at-risk)
            2. Predicted behavior (1 sentence)
            3. Recommendations for engagement (1-2 sentences)
            
            Be concise and actionable.
            """
            
            response = self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
                temperature=0.3
            )
            
            insights = response.choices[0].message.content
            
            return {
                "customer_id": customer_id,
                "ai_insights": insights,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "customer_id": customer_id,
                "error": f"Error predicting customer insights: {str(e)}"
            }

    def generate_smart_recommendation(self, prediction_type: str, 
                                     prediction_data: Dict[str, Any],
                                     business_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate an AI-powered recommendation based on predictions.

        Args:
            prediction_type: Type of prediction (forecast, anomaly, supplier, customer)
            prediction_data: The prediction data to base recommendation on
            business_context: Additional business context

        Returns:
            AI-generated recommendation with explanation
        """
        try:
            context = business_context or "Standard supply chain operations"
            
            if not self.available or not self.client:
                return {
                    "type": prediction_type,
                    "ai_recommendation": f"Based on {prediction_type} data, review the provided metrics and take appropriate action in context of: {context}",
                    "confidence_score": 0.65,
                    "generated_at": datetime.now().isoformat(),
                    "note": "AI service unavailable - using basic recommendation"
                }
            
            prompt = f"""
            Generate a business recommendation based on this {prediction_type} prediction:
            - Prediction Data: {json.dumps(prediction_data, default=str)}
            - Business Context: {context}
            
            Provide:
            1. Specific action to take
            2. Expected impact/benefit
            3. Urgency level (LOW/MEDIUM/HIGH/CRITICAL)
            4. Implementation steps (1-2 bullet points)
            
            Format as actionable business advice.
            """
            
            response = self.client.messages.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.4
            )
            
            recommendation = response.choices[0].message.content
            
            return {
                "type": prediction_type,
                "ai_recommendation": recommendation,
                "confidence_score": 0.82,
                "generated_at": datetime.now().isoformat()
            }
        except Exception as e:
            return {
                "type": prediction_type,
                "error": f"Error generating recommendation: {str(e)}"
            }

    def batch_analyze_predictions(self, predictions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Batch analyze multiple predictions with Groq AI.

        Args:
            predictions: List of prediction dictionaries

        Returns:
            List of AI-enhanced predictions
        """
        enhanced_predictions = []
        
        for pred in predictions:
            try:
                if pred.get("type") == "forecast":
                    enhanced = self.enhance_forecast_insight(
                        pred.get("product_id"),
                        pred.get("forecast", []),
                        pred.get("current_stock", 0),
                        pred.get("trend", "stable")
                    )
                elif pred.get("type") == "anomaly":
                    enhanced = self.analyze_anomaly(
                        pred.get("product_id"),
                        pred.get("anomaly_score", 0),
                        pred.get("pattern", "unknown")
                    )
                else:
                    enhanced = pred
                
                enhanced_predictions.append(enhanced)
            except Exception as e:
                pred["error"] = str(e)
                enhanced_predictions.append(pred)
        
        return enhanced_predictions

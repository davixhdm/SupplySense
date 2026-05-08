"""
Customer Prediction Model

Predicts customer purchasing behavior and patterns.

This model MUST receive data from DataProcessingService only.
"""

from typing import Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import warnings

warnings.filterwarnings("ignore")


class CustomerPredictionModel:
    """
    Machine learning model for predicting customer behavior and purchase patterns.
    """

    def __init__(self):
        """Initialize customer prediction model"""
        self.model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False

    def train(self, X_train: pd.DataFrame, y_train: pd.Series) -> Dict[str, Any]:
        """
        Train the customer prediction model.

        Args:
            X_train: Training features
            y_train: Training target (customer purchase amounts or frequencies)

        Returns:
            Training metrics
        """
        # Standardize features
        X_scaled = self.scaler.fit_transform(X_train)

        # Train model
        self.model.fit(X_scaled, y_train)
        self.is_trained = True

        # Calculate R-squared score
        train_score = self.model.score(X_scaled, y_train)

        return {
            "model_type": "GradientBoosting",
            "trained": True,
            "train_score": float(train_score),
            "samples": len(X_train),
        }

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict customer behavior.

        Args:
            X: Features

        Returns:
            Predictions
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")

        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)

    def predict_customer_demand(self, customer_id: int, historical_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Predict demand for a specific customer.

        Args:
            customer_id: Customer ID
            historical_data: Historical purchase data for customer

        Returns:
            Customer demand prediction
        """
        if len(historical_data) < 5:
            return {"error": "Insufficient historical data for prediction"}

        # Prepare features
        features = self._prepare_features(historical_data)

        if features is None or len(features) == 0:
            return {"error": "Could not prepare features"}

        # Get prediction
        prediction = self.predict(features)

        return {
            "customer_id": customer_id,
            "predicted_demand": float(prediction[-1]) if len(prediction) > 0 else None,
            "confidence": 0.85,  # Placeholder confidence
            "forecast_period": "7_days",
        }

    def identify_customer_segments(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Identify customer behavior segments.

        Args:
            data: Customer transaction data

        Returns:
            Customer segmentation results
        """
        if "product_id" not in data.columns or len(data) < 10:
            return {"error": "Insufficient data for segmentation"}

        # Calculate purchase patterns - use quantity if stock not available
        value_col = "stock" if "stock" in data.columns else "quantity"
        
        high_frequency_threshold = data["daily_change"].quantile(0.75)
        high_value_threshold = data[value_col].quantile(0.75)

        segments = {
            "high_frequency_high_value": 0,
            "high_frequency_low_value": 0,
            "low_frequency_high_value": 0,
            "low_frequency_low_value": 0,
        }

        for _, row in data.iterrows():
            freq = row.get("daily_change", 0) > high_frequency_threshold
            value = row.get(value_col, 0) > high_value_threshold

            if freq and value:
                segments["high_frequency_high_value"] += 1
            elif freq:
                segments["high_frequency_low_value"] += 1
            elif value:
                segments["low_frequency_high_value"] += 1
            else:
                segments["low_frequency_low_value"] += 1

        return {
            "total_records": len(data),
            "segments": segments,
            "dominant_segment": max(segments, key=segments.get),
        }

    @staticmethod
    def _prepare_features(data: pd.DataFrame) -> pd.DataFrame:
        """
        Prepare features from processed data.

        Args:
            data: Processed DataFrame

        Returns:
            Feature matrix
        """
        feature_cols = ["daily_change", "rolling_mean_7", "rolling_std_7"]

        available_cols = [col for col in feature_cols if col in data.columns]

        if not available_cols:
            return None

        return data[available_cols].fillna(0)

    def predict_churn_risk(self, customer_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Estimate risk of customer churn based on behavior patterns.

        Args:
            customer_data: Customer transaction data

        Returns:
            Churn risk assessment
        """
        if len(customer_data) < 5:
            return {"error": "Insufficient data for churn prediction"}

        # Evaluate trend using rolling mean if available, otherwise calculate from daily_change
        if "rolling_mean_7" in customer_data.columns:
            recent_mean = customer_data.iloc[-1]["rolling_mean_7"]
            early_mean = customer_data.iloc[0]["rolling_mean_7"]
            trend = early_mean - recent_mean  # Positive if declining
        else:
            # Calculate linear trend (slope) from daily_change
            recent_data = customer_data.tail(10)
            x = np.arange(len(recent_data))
            y = recent_data["daily_change"].values
            # Fit line: positive slope means values are increasing (improving)
            # Negative slope means values are decreasing (declining)
            coeffs = np.polyfit(x, y, 1)
            trend = -coeffs[0]  # Negate so positive = declining, negative = improving

        # Calculate churn risk based on trend
        if trend > 0:  # Declining trend
            churn_risk = min(0.9, trend / 3)  # Scale by 3 for meaningful risk
            risk_level = "HIGH"
            trend_label = "declining"
        elif trend < 0:  # Improving trend
            churn_risk = max(0.1, 1 - (abs(trend) / 3))
            risk_level = "LOW"
            trend_label = "improving"
        else:
            churn_risk = 0.5
            risk_level = "MEDIUM"
            trend_label = "stable"

        return {
            "churn_risk_score": float(churn_risk),
            "risk_level": risk_level,
            "trend": trend_label,
            "recommendation": "Increase engagement" if churn_risk > 0.6 else "Maintain current strategy",
        }

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Any]:
        """
        Evaluate model performance on test set.

        Args:
            X_test: Test features
            y_test: Test target

        Returns:
            Evaluation metrics
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")

        X_scaled = self.scaler.transform(X_test)
        predictions = self.model.predict(X_scaled)

        mse = np.mean((predictions - y_test) ** 2)
        rmse = np.sqrt(mse)
        r_squared = self.model.score(X_scaled, y_test)

        return {
            "mse": float(mse),
            "rmse": float(rmse),
            "r_squared": float(r_squared),
            "samples": len(X_test),
        }

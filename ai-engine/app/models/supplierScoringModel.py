"""
Supplier Scoring Model

Evaluates supplier reliability based on historical performance.

This model MUST receive data from DataProcessingService only.
"""

from typing import Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import warnings

warnings.filterwarnings("ignore")


class SupplierScoringModel:
    """
    Machine learning model for scoring supplier reliability.
    """

    def __init__(self):
        """Initialize supplier scoring model"""
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False

    def train(self, X_train: pd.DataFrame, y_train: pd.Series) -> Dict[str, Any]:
        """
        Train the supplier scoring model.

        Args:
            X_train: Training features
            y_train: Training labels (reliability scores or classifications)

        Returns:
            Training metrics
        """
        # Standardize features
        X_scaled = self.scaler.fit_transform(X_train)

        # Train model
        self.model.fit(X_scaled, y_train)
        self.is_trained = True

        # Calculate accuracy
        train_score = self.model.score(X_scaled, y_train)

        return {
            "model_type": "RandomForest",
            "trained": True,
            "train_score": float(train_score),
            "samples": len(X_train),
        }

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict supplier reliability.

        Args:
            X: Features

        Returns:
            Reliability predictions
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")

        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)

    def score_suppliers(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Score all suppliers in the data.

        Args:
            data: Processed supplier performance data

        Returns:
            Supplier scores
        """
        if "supplier_id" not in data.columns:
            return {"error": "supplier_id column required"}

        supplier_scores = {}

        for supplier_id in data["supplier_id"].unique():
            supplier_data = data[data["supplier_id"] == supplier_id]

            # Calculate supplier metrics
            score = self._calculate_supplier_score(supplier_data)
            supplier_scores[int(supplier_id)] = score

        # Normalize scores to 0-100 scale
        min_score = min(supplier_scores.values())
        max_score = max(supplier_scores.values())
        range_score = max_score - min_score if max_score > min_score else 1

        normalized_scores = {
            sid: ((score - min_score) / range_score * 100) for sid, score in supplier_scores.items()
        }

        return {
            "total_suppliers": len(normalized_scores),
            "supplier_scores": normalized_scores,
            "best_supplier": max(normalized_scores, key=normalized_scores.get),
            "best_score": max(normalized_scores.values()),
            "worst_supplier": min(normalized_scores, key=normalized_scores.get),
            "worst_score": min(normalized_scores.values()),
        }

    @staticmethod
    def _calculate_supplier_score(supplier_data: pd.DataFrame) -> float:
        """
        Calculate a reliability score for a supplier.

        Factors considered:
        - Stock consistency (lower variability = better)
        - Uptime (fewer anomalies = better)
        - Trend (improving stock levels = better)

        Args:
            supplier_data: Supplier's historical data

        Returns:
            Composite reliability score
        """
        if len(supplier_data) == 0:
            return 0.0

        score = 100.0

        # Factor 1: Stock variability (coefficient: 0.4)
        if "rolling_std_7" in supplier_data.columns:
            std_penalty = supplier_data["rolling_std_7"].mean() * 0.4
            score -= std_penalty

        # Factor 2: Trend analysis (coefficient: 0.3)
        if "daily_change" in supplier_data.columns and len(supplier_data) > 1:
            recent_changes = supplier_data["daily_change"].tail(5).mean()
            trend_penalty = -recent_changes * 0.3  # Negative changes penalize
            score += trend_penalty

        # Factor 3: Delivery consistency (coefficient: 0.3)
        if "stock" in supplier_data.columns:
            stockout_count = (supplier_data["stock"] == 0).sum()
            stockout_penalty = (stockout_count / len(supplier_data)) * 100 * 0.3
            score -= stockout_penalty

        return max(0.0, score)

    def get_feature_importance(self) -> Dict[str, float]:
        """
        Get feature importance from the model.

        Returns:
            Dictionary of feature names to importance scores
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before getting feature importance")

        importances = self.model.feature_importances_
        feature_names = [f"feature_{i}" for i in range(len(importances))]

        return {name: float(imp) for name, imp in zip(feature_names, importances)}

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> Dict[str, Any]:
        """
        Evaluate model performance on test set.

        Args:
            X_test: Test features
            y_test: Test labels

        Returns:
            Evaluation metrics
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")

        X_scaled = self.scaler.transform(X_test)
        accuracy = self.model.score(X_scaled, y_test)

        return {
            "accuracy": float(accuracy),
            "samples": len(X_test),
        }

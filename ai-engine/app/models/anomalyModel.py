"""
Anomaly Detection Model

Detects unusual patterns in inventory data (sudden drops/spikes).

This model MUST receive data from DataProcessingService only.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import warnings

warnings.filterwarnings("ignore")


class AnomalyModel:
    """
    Machine learning model for detecting anomalies in inventory data.
    """

    def __init__(self, contamination: float = 0.05):
        """
        Initialize anomaly detection model.

        Args:
            contamination: Expected proportion of anomalies in data (0.0 to 0.5)
        """
        self.contamination = contamination
        self.model = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100,
        )
        self.scaler = StandardScaler()
        self.is_trained = False

    def train(self, X_train: pd.DataFrame) -> Dict[str, Any]:
        """
        Train the anomaly detection model.

        Args:
            X_train: Training features (unlabeled)

        Returns:
            Training metrics
        """
        # Standardize features
        X_train_array = X_train.values if isinstance(X_train, pd.DataFrame) else X_train
        X_scaled = self.scaler.fit_transform(X_train_array)

        # Train isolation forest
        self.model.fit(X_scaled)
        self.is_trained = True

        # Get anomaly predictions on training data
        predictions = self.model.predict(X_scaled)
        n_anomalies = (predictions == -1).sum()

        return {
            "model_type": "IsolationForest",
            "trained": True,
            "contamination": self.contamination,
            "samples": len(X_train),
            "anomalies_detected": int(n_anomalies),
            "anomaly_percentage": float(n_anomalies / len(X_train) * 100),
        }

    def predict(self, X) -> np.ndarray:
        """
        Predict anomalies (-1 for anomaly, 1 for normal).

        Args:
            X: Features to check

        Returns:
            Predictions (-1 or 1)
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")

        X_array = X.values if isinstance(X, pd.DataFrame) else X
        X_scaled = self.scaler.transform(X_array)
        return self.model.predict(X_scaled)

    def detect_anomalies(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Detect anomalies in inventory data.

        Args:
            data: Processed inventory data

        Returns:
            Anomaly detection results
        """
        if len(data) < 5:
            return {"error": "Insufficient data for anomaly detection"}

        # Prepare features
        features = self._prepare_features(data)

        if features is None or len(features) == 0:
            return {"error": "Could not prepare features"}

        # Get predictions
        predictions = self.predict(features)
        anomaly_scores = self.model.score_samples(self.scaler.transform(features))

        # Convert to 0-1 scale (lower score = more anomalous)
        normalized_scores = (anomaly_scores - anomaly_scores.min()) / (
            anomaly_scores.max() - anomaly_scores.min() + 1e-10
        )

        # Identify anomalies
        anomaly_indices = np.where(predictions == -1)[0]
        anomalies = []

        for idx in anomaly_indices:
            anomalies.append({
                "index": int(idx),
                "date": str(data.iloc[idx]["date"]) if "date" in data.columns else None,
                "stock": float(data.iloc[idx]["stock"]) if "stock" in data.columns else None,
                "anomaly_score": float(normalized_scores[idx]),
            })

        return {
            "total_records": len(data),
            "anomalies_detected": len(anomalies),
            "anomaly_percentage": float(len(anomalies) / len(data) * 100),
            "anomalies": anomalies,
            "mean_anomaly_score": float(np.mean(normalized_scores)),
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

    def get_anomaly_score(self, X: pd.DataFrame) -> np.ndarray:
        """
        Get anomaly scores (not just binary classification).

        Lower scores indicate more anomalous instances.

        Args:
            X: Features

        Returns:
            Anomaly scores
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before getting scores")

        X_scaled = self.scaler.transform(X)
        return self.model.score_samples(X_scaled)

    def evaluate(self, X_test: pd.DataFrame, y_true: np.ndarray = None) -> Dict[str, Any]:
        """
        Evaluate model performance (for labeled test data).

        Args:
            X_test: Test features
            y_true: True labels (1 for normal, -1 for anomaly)

        Returns:
            Evaluation metrics
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")

        predictions = self.predict(X_test)

        result = {
            "total_predictions": len(predictions),
            "anomalies_found": (predictions == -1).sum(),
            "normal_found": (predictions == 1).sum(),
        }

        if y_true is not None:
            accuracy = np.mean(predictions == y_true)
            result["accuracy"] = float(accuracy)

        return result

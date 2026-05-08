"""
Forecasting Model

Predicts future demand/supply levels using time series analysis.

This model MUST receive data from DataProcessingService only.
"""

from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.seasonal import seasonal_decompose
import warnings

warnings.filterwarnings("ignore")


class ForecastingModel:
    """
    Machine learning model for demand and supply forecasting.
    """

    def __init__(self, model_type: str = "linear"):
        """
        Initialize forecasting model.

        Args:
            model_type: Type of model to use ('linear' or 'random_forest')
        """
        self.model_type = model_type

        if model_type == "linear":
            self.model = LinearRegression()
        elif model_type == "random_forest":
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        else:
            raise ValueError(f"Unknown model type: {model_type}")

        self.is_trained = False

    def train(self, X_train: pd.DataFrame, y_train: pd.Series) -> Dict[str, Any]:
        """
        Train the forecasting model.

        Args:
            X_train: Training features
            y_train: Training target (stock values)

        Returns:
            Training metrics
        """
        self.model.fit(X_train, y_train)
        self.is_trained = True

        # Calculate R-squared score
        train_score = self.model.score(X_train, y_train)

        return {
            "model_type": self.model_type,
            "trained": True,
            "train_score": train_score,
            "samples": len(X_train),
        }

    def predict(self, X_test: pd.DataFrame) -> np.ndarray:
        """
        Make predictions on test data.

        Args:
            X_test: Test features

        Returns:
            Predicted stock values
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")

        return self.model.predict(X_test)

    def forecast_next_periods(self, data: pd.DataFrame, periods: int = 7) -> Dict[str, Any]:
        """
        Forecast stock levels for next N periods.

        Args:
            data: Processed historical data
            periods: Number of periods to forecast (default: 7 days)

        Returns:
            Forecast with confidence intervals
        """
        if len(data) < 7:
            return {"error": "Insufficient data for forecasting"}

        # Prepare features from historical data
        features = self._prepare_features(data)

        if features is None or len(features) == 0:
            return {"error": "Could not prepare features"}

        predictions = self.predict(features)

        # If we need more periods than we have predictions, extrapolate
        if len(predictions) < periods:
            # Simple extrapolation: repeat the last value or use average trend
            last_value = predictions[-1]
            avg_trend = np.mean(np.diff(predictions[-3:]))  # Trend from last 3 points
            extended = predictions.tolist()
            for i in range(periods - len(predictions)):
                extended.append(last_value + avg_trend * (i + 1))
            forecast_data = extended[-periods:]
        else:
            forecast_data = predictions.tolist()[-periods:]

        # Calculate confidence interval (simplified)
        std_error = np.std(predictions)
        confidence_interval = 1.96 * std_error  # 95% confidence

        return {
            "forecast_periods": periods,
            "predictions": forecast_data,
            "mean_forecast": float(np.mean(forecast_data)),
            "confidence_interval": float(confidence_interval),
            "confidence_level": 0.95,
        }

    @staticmethod
    def _prepare_features(data: pd.DataFrame) -> pd.DataFrame:
        """
        Prepare features from processed data for modeling.

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

        predictions = self.predict(X_test)
        mse = np.mean((predictions - y_test) ** 2)
        rmse = np.sqrt(mse)
        mae = np.mean(np.abs(predictions - y_test))
        r_squared = self.model.score(X_test, y_test)

        return {
            "mse": float(mse),
            "rmse": float(rmse),
            "mae": float(mae),
            "r_squared": float(r_squared),
            "samples": len(X_test),
        }

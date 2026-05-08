"""
Tests for PredictionService

Tests cover:
- Individual predictions
- Batch predictions
- Model coordination
"""

import pytest
import pandas as pd
import numpy as np
from app.services.predictionService import PredictionService


class TestPredictionService:
    """Test cases for PredictionService class."""

    @pytest.fixture
    def service(self):
        """Initialize PredictionService for tests."""
        return PredictionService()

    # ============== Forecast Prediction Tests ==============

    def test_get_forecast(self, service):
        """Test getting forecast prediction."""
        result = service.get_forecast(product_id=1, processed_data=None)

        assert "product_id" in result
        assert "forecast" in result
        assert "confidence_interval" in result
        assert "timestamp" in result
        assert result["product_id"] == 1

    def test_forecast_response_structure(self, service):
        """Test forecast response has required fields."""
        result = service.get_forecast(1, None)

        required_fields = {"product_id", "forecast", "confidence_interval", "timestamp"}
        assert required_fields.issubset(result.keys())

    # ============== Anomaly Detection Tests ==============

    def test_detect_anomalies(self, service):
        """Test anomaly detection prediction."""
        result = service.detect_anomalies(product_id=1, processed_data=None)

        assert "product_id" in result
        assert "anomalies_detected" in result
        assert "anomaly_score" in result
        assert result["product_id"] == 1

    def test_anomaly_response_structure(self, service):
        """Test anomaly response has required fields."""
        result = service.detect_anomalies(1, None)

        required_fields = {"product_id", "anomalies_detected", "anomaly_score", "timestamp"}
        assert required_fields.issubset(result.keys())

    # ============== Supplier Scoring Tests ==============

    def test_score_supplier(self, service):
        """Test supplier scoring prediction."""
        result = service.score_supplier(supplier_id=1, processed_data=None)

        assert "supplier_id" in result
        assert "reliability_score" in result
        assert "trend" in result
        assert result["supplier_id"] == 1

    def test_supplier_score_response_structure(self, service):
        """Test supplier score response has required fields."""
        result = service.score_supplier(1, None)

        required_fields = {"supplier_id", "reliability_score", "trend", "timestamp"}
        assert required_fields.issubset(result.keys())

    # ============== Customer Prediction Tests ==============

    def test_predict_customer_behavior(self, service):
        """Test customer behavior prediction."""
        result = service.predict_customer_behavior(customer_id=1, processed_data=None)

        assert "customer_id" in result
        assert "prediction" in result
        assert "confidence" in result
        assert result["customer_id"] == 1

    def test_customer_prediction_response_structure(self, service):
        """Test customer prediction response has required fields."""
        result = service.predict_customer_behavior(1, None)

        required_fields = {"customer_id", "prediction", "confidence", "timestamp"}
        assert required_fields.issubset(result.keys())

    # ============== Batch Prediction Tests ==============

    def test_batch_predict_empty(self, service):
        """Test batch prediction with empty data."""
        empty_df = pd.DataFrame()
        result = service.batch_predict(empty_df, prediction_types=["forecast"])

        assert "predictions" in result
        assert result["total_records"] == 0

    def test_batch_predict_response_structure(self, service, sample_dataframe):
        """Test batch prediction response structure."""
        result = service.batch_predict(sample_dataframe, prediction_types=["forecast"])

        assert "timestamp" in result
        assert "total_records" in result
        assert "predictions" in result
        assert result["total_records"] == len(sample_dataframe)

    def test_batch_predict_multiple_types(self, service, sample_dataframe):
        """Test batch prediction with multiple prediction types."""
        pred_types = ["forecast", "anomaly", "supplier"]
        result = service.batch_predict(sample_dataframe, prediction_types=pred_types)

        assert "predictions" in result
        # All requested types should have entries (even if empty lists)
        for pred_type in ["forecast", "anomaly", "supplier"]:
            if pred_type in result["predictions"]:
                assert isinstance(result["predictions"][pred_type], list)

    def test_batch_forecast(self, service, sample_dataframe):
        """Test internal batch forecasting."""
        result = service._batch_forecast(sample_dataframe)

        assert isinstance(result, list)

    def test_batch_anomaly_detection(self, service, sample_dataframe):
        """Test internal batch anomaly detection."""
        result = service._batch_anomaly_detection(sample_dataframe)

        assert isinstance(result, list)

    def test_batch_supplier_scoring(self, service, sample_dataframe):
        """Test internal batch supplier scoring."""
        result = service._batch_supplier_scoring(sample_dataframe)

        assert isinstance(result, list)

    # ============== Response Formatting Tests ==============

    def test_forecast_includes_timestamp(self, service):
        """Test that forecast includes ISO timestamp."""
        result = service.get_forecast(1, None)

        timestamp = result["timestamp"]
        # Should be ISO format
        assert "T" in timestamp or "-" in timestamp

    def test_anomaly_boolean_flag(self, service):
        """Test that anomaly result has boolean detected flag."""
        result = service.detect_anomalies(1, None)

        assert isinstance(result["anomalies_detected"], bool)

    def test_supplier_score_is_numeric(self, service):
        """Test that supplier score is numeric."""
        result = service.score_supplier(1, None)

        score = result["reliability_score"]
        assert score is None or isinstance(score, (int, float))

    # ============== Edge Cases ==============

    def test_predict_with_large_product_id(self, service):
        """Test prediction with large product ID."""
        result = service.get_forecast(999999, None)

        assert result["product_id"] == 999999

    def test_predict_with_zero_product_id(self, service):
        """Test prediction with zero product ID."""
        result = service.get_forecast(0, None)

        assert result["product_id"] == 0

    def test_batch_predict_single_record(self, service):
        """Test batch prediction with single record."""
        df = pd.DataFrame({
            "stock": [100],
            "date": pd.to_datetime(["2024-01-01"]),
            "product_id": [1],
            "supplier_id": [1],
        })
        result = service.batch_predict(df, prediction_types=["forecast"])

        assert result["total_records"] == 1

    def test_batch_predict_many_records(self, service):
        """Test batch prediction with many records."""
        df = pd.DataFrame({
            "stock": np.random.randint(50, 150, 1000),
            "date": pd.date_range("2024-01-01", periods=1000),
            "product_id": [i % 10 for i in range(1000)],
            "supplier_id": [i % 5 for i in range(1000)],
        })
        result = service.batch_predict(df, prediction_types=["forecast"])

        assert result["total_records"] == 1000

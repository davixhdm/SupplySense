"""
Tests for CustomerPredictionModel

Tests cover:
- Model initialization
- Training
- Customer demand prediction
- Customer segmentation
- Churn risk assessment
"""

import pytest
import pandas as pd
import numpy as np
from app.models.customerPredictionModel import CustomerPredictionModel


class TestCustomerPredictionModel:
    """Test cases for CustomerPredictionModel class."""

    @pytest.fixture
    def model(self):
        """Initialize CustomerPredictionModel for tests."""
        return CustomerPredictionModel()

    # ============== Initialization Tests ==============

    def test_model_initialization(self):
        """Test model initialization."""
        model = CustomerPredictionModel()

        assert not model.is_trained
        assert model.model is not None

    # ============== Training Tests ==============

    def test_train_model(self, model, training_features, training_target):
        """Test model training."""
        result = model.train(training_features, training_target)

        assert model.is_trained
        assert result["trained"] is True
        assert "train_score" in result

    def test_train_model_metrics(self, model, training_features, training_target):
        """Test that training returns valid metrics."""
        result = model.train(training_features, training_target)

        assert result["model_type"] == "GradientBoosting"
        assert result["samples"] == len(training_features)
        assert -1 <= result["train_score"] <= 1

    # ============== Prediction Tests ==============

    def test_predict_before_training(self, model, training_features):
        """Test that prediction before training raises error."""
        with pytest.raises(ValueError):
            model.predict(training_features)

    def test_predict_after_training(self, model, training_features, training_target):
        """Test prediction after training."""
        model.train(training_features, training_target)
        predictions = model.predict(training_features)

        assert len(predictions) == len(training_features)
        assert isinstance(predictions, np.ndarray)

    def test_predict_shape(self, model, training_features, training_target):
        """Test prediction output shape."""
        model.train(training_features, training_target)
        predictions = model.predict(training_features)

        assert predictions.shape == (len(training_features),)

    # ============== Customer Demand Prediction Tests ==============

    def test_predict_customer_demand_basic(self, model, customer_transaction_data, training_features, training_target):
        """Test basic customer demand prediction."""
        model.train(training_features, training_target)
        result = model.predict_customer_demand(1, customer_transaction_data)

        assert "customer_id" in result
        assert "predicted_demand" in result
        assert "confidence" in result
        assert result["customer_id"] == 1

    def test_predict_customer_demand_valid_prediction(self, model, customer_transaction_data, training_features, training_target):
        """Test that customer demand prediction returns valid value."""
        model.train(training_features, training_target)
        result = model.predict_customer_demand(1, customer_transaction_data)

        prediction = result["predicted_demand"]
        assert prediction is not None
        assert isinstance(prediction, (int, float))

    def test_predict_customer_demand_confidence(self, model, customer_transaction_data, training_features, training_target):
        """Test that confidence is in valid range."""
        model.train(training_features, training_target)
        result = model.predict_customer_demand(1, customer_transaction_data)

        assert 0 <= result["confidence"] <= 1

    def test_predict_customer_demand_insufficient_data(self, model):
        """Test prediction with insufficient data."""
        small_df = pd.DataFrame({"quantity": [1, 2]})
        result = model.predict_customer_demand(1, small_df)

        assert "error" in result

    # ============== Customer Segmentation Tests ==============

    def test_identify_customer_segments(self, model, customer_transaction_data):
        """Test customer segmentation."""
        result = model.identify_customer_segments(customer_transaction_data)

        assert "total_records" in result
        assert "segments" in result
        assert "dominant_segment" in result

    def test_identify_customer_segments_count(self, model, customer_transaction_data):
        """Test that segmentation counts sum correctly."""
        result = model.identify_customer_segments(customer_transaction_data)

        segment_counts = result["segments"]
        total_count = sum(segment_counts.values())
        assert total_count == result["total_records"]

    def test_identify_customer_segments_valid_types(self, model, customer_transaction_data):
        """Test that all segment types are present."""
        result = model.identify_customer_segments(customer_transaction_data)

        expected_segments = {
            "high_frequency_high_value",
            "high_frequency_low_value",
            "low_frequency_high_value",
            "low_frequency_low_value",
        }
        assert set(result["segments"].keys()) == expected_segments

    def test_identify_customer_segments_insufficient_data(self, model):
        """Test segmentation with insufficient data."""
        small_df = pd.DataFrame({"product_id": [1]})
        result = model.identify_customer_segments(small_df)

        assert "error" in result

    # ============== Churn Risk Assessment Tests ==============

    def test_predict_churn_risk_basic(self, model, customer_transaction_data):
        """Test basic churn risk prediction."""
        result = model.predict_churn_risk(customer_transaction_data)

        assert "churn_risk_score" in result
        assert "risk_level" in result
        assert "trend" in result

    def test_predict_churn_risk_score_range(self, model, customer_transaction_data):
        """Test that churn risk score is in valid range."""
        result = model.predict_churn_risk(customer_transaction_data)

        assert 0 <= result["churn_risk_score"] <= 1

    def test_predict_churn_risk_levels(self, model):
        """Test churn risk levels for different trends."""
        # Declining trend (high churn risk)
        declining_data = pd.DataFrame({
            "daily_change": [10, 8, 6, 4, 2, 0, -2, -4, -6, -8],
            "date": pd.date_range("2024-01-01", periods=10),
        })
        result_decline = model.predict_churn_risk(declining_data)
        assert result_decline["risk_level"] == "HIGH"
        assert result_decline["churn_risk_score"] > 0.5

        # Improving trend (low churn risk)
        improving_data = pd.DataFrame({
            "daily_change": [-8, -6, -4, -2, 0, 2, 4, 6, 8, 10],
            "date": pd.date_range("2024-01-01", periods=10),
        })
        result_improve = model.predict_churn_risk(improving_data)
        assert result_improve["risk_level"] == "LOW"
        assert result_improve["churn_risk_score"] < 0.5

    def test_predict_churn_risk_recommendation(self, model, customer_transaction_data):
        """Test that recommendation is provided."""
        result = model.predict_churn_risk(customer_transaction_data)

        assert "recommendation" in result
        assert isinstance(result["recommendation"], str)

    def test_predict_churn_risk_insufficient_data(self, model):
        """Test churn prediction with insufficient data."""
        small_df = pd.DataFrame({"daily_change": [1, 2]})
        result = model.predict_churn_risk(small_df)

        assert "error" in result

    # ============== Evaluation Tests ==============

    def test_evaluate_before_training(self, model, training_features, training_target):
        """Test that evaluation before training raises error."""
        with pytest.raises(ValueError):
            model.evaluate(training_features, training_target)

    def test_evaluate_after_training(self, model, training_features, training_target):
        """Test evaluation after training."""
        model.train(training_features, training_target)
        eval_result = model.evaluate(training_features, training_target)

        assert "mse" in eval_result
        assert "rmse" in eval_result
        assert "r_squared" in eval_result
        assert "samples" in eval_result

    def test_evaluate_metrics_validity(self, model, training_features, training_target):
        """Test that evaluation metrics are valid."""
        model.train(training_features, training_target)
        eval_result = model.evaluate(training_features, training_target)

        assert eval_result["mse"] >= 0
        assert eval_result["rmse"] >= 0
        assert -1 <= eval_result["r_squared"] <= 1

    # ============== Edge Cases ==============

    def test_model_with_stable_customer(self):
        """Test with customer having stable purchases."""
        stable_data = pd.DataFrame({
            "daily_change": [0] * 10,
            "rolling_mean_7": [100] * 10,
            "rolling_std_7": [0] * 10,
            "date": pd.date_range("2024-01-01", periods=10),
        })

        model = CustomerPredictionModel()
        result = model.predict_churn_risk(stable_data)

        assert result["risk_level"] == "MEDIUM"

    def test_model_with_volatile_customer(self):
        """Test with customer having volatile purchases."""
        volatile_data = pd.DataFrame({
            "daily_change": [50, -50, 40, -40, 30, -30, 20, -20, 10, -10],
            "rolling_mean_7": np.linspace(100, 50, 10),
            "rolling_std_7": [50] * 10,
            "date": pd.date_range("2024-01-01", periods=10),
        })

        model = CustomerPredictionModel()
        result = model.predict_churn_risk(volatile_data)

        assert result["trend"] == "declining"

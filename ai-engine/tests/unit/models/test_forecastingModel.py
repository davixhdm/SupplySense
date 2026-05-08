"""
Tests for ForecastingModel

Tests cover:
- Model initialization
- Training
- Predictions
- Forecasting
- Evaluation
"""

import pytest
import pandas as pd
import numpy as np
from app.models.forecastingModel import ForecastingModel


class TestForecastingModel:
    """Test cases for ForecastingModel class."""

    @pytest.fixture
    def model(self):
        """Initialize ForecastingModel for tests."""
        return ForecastingModel(model_type="linear")

    @pytest.fixture
    def model_rf(self):
        """Initialize RandomForest ForecastingModel for tests."""
        return ForecastingModel(model_type="random_forest")

    # ============== Initialization Tests ==============

    def test_model_initialization_linear(self):
        """Test model initialization with linear regression."""
        model = ForecastingModel(model_type="linear")

        assert model.model_type == "linear"
        assert not model.is_trained

    def test_model_initialization_random_forest(self):
        """Test model initialization with random forest."""
        model = ForecastingModel(model_type="random_forest")

        assert model.model_type == "random_forest"
        assert not model.is_trained

    def test_model_initialization_invalid_type(self):
        """Test that invalid model type raises error."""
        with pytest.raises(ValueError):
            ForecastingModel(model_type="invalid")

    # ============== Training Tests ==============

    def test_train_model_linear(self, model, training_features, training_target):
        """Test training a linear model."""
        result = model.train(training_features, training_target)

        assert model.is_trained
        assert result["trained"] is True
        assert "train_score" in result
        assert 0 <= result["train_score"] <= 1

    def test_train_model_random_forest(self, model_rf, training_features, training_target):
        """Test training a random forest model."""
        result = model_rf.train(training_features, training_target)

        assert model_rf.is_trained
        assert result["trained"] is True
        assert result["model_type"] == "random_forest"

    def test_train_model_metrics(self, model, training_features, training_target):
        """Test that training returns correct metrics."""
        result = model.train(training_features, training_target)

        assert "samples" in result
        assert result["samples"] == len(training_features)
        assert result["model_type"] == "linear"

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

    # ============== Forecasting Tests ==============

    def test_forecast_next_periods(self, model, sample_dataframe, training_features, training_target):
        """Test forecasting for next periods."""
        model.train(training_features, training_target)
        result = model.forecast_next_periods(sample_dataframe, periods=7)

        assert "predictions" in result
        assert "mean_forecast" in result
        assert "confidence_interval" in result
        assert len(result["predictions"]) == 7

    def test_forecast_insufficient_data(self, model):
        """Test forecasting with insufficient data."""
        small_df = pd.DataFrame({"stock": [1, 2, 3]})
        result = model.forecast_next_periods(small_df, periods=7)

        assert "error" in result

    def test_forecast_default_periods(self, model, sample_dataframe, training_features, training_target):
        """Test forecasting with default periods."""
        model.train(training_features, training_target)
        result = model.forecast_next_periods(sample_dataframe)

        assert len(result["predictions"]) == 7  # Default is 7

    def test_forecast_custom_periods(self, model, sample_dataframe, training_features, training_target):
        """Test forecasting with custom periods."""
        model.train(training_features, training_target)
        result = model.forecast_next_periods(sample_dataframe, periods=14)

        assert result["forecast_periods"] == 14
        assert len(result["predictions"]) == 14

    def test_forecast_confidence_interval(self, model, sample_dataframe, training_features, training_target):
        """Test that confidence interval is calculated."""
        model.train(training_features, training_target)
        result = model.forecast_next_periods(sample_dataframe)

        assert result["confidence_interval"] > 0
        assert result["confidence_level"] == 0.95

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
        assert "mae" in eval_result
        assert "r_squared" in eval_result

    def test_evaluate_metrics_validity(self, model, training_features, training_target):
        """Test that evaluation metrics are valid."""
        model.train(training_features, training_target)
        eval_result = model.evaluate(training_features, training_target)

        assert eval_result["mse"] >= 0
        assert eval_result["rmse"] >= 0
        assert eval_result["mae"] >= 0
        assert -1 <= eval_result["r_squared"] <= 1

    def test_evaluate_sample_count(self, model, training_features, training_target):
        """Test that evaluation includes sample count."""
        model.train(training_features, training_target)
        eval_result = model.evaluate(training_features, training_target)

        assert eval_result["samples"] == len(training_features)

    # ============== Edge Cases ==============

    def test_model_with_single_feature(self):
        """Test model with single feature column."""
        X = pd.DataFrame({"feature": [1, 2, 3, 4, 5]})
        y = pd.Series([2, 4, 6, 8, 10])

        model = ForecastingModel()
        result = model.train(X, y)

        assert model.is_trained
        predictions = model.predict(X)
        assert len(predictions) == len(X)

    def test_model_with_many_features(self, training_features, training_target):
        """Test model with many features."""
        model = ForecastingModel()
        result = model.train(training_features, training_target)

        assert model.is_trained
        assert result["train_score"] is not None

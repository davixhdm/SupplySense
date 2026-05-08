"""
Tests for AnomalyModel

Tests cover:
- Model initialization
- Training
- Predictions
- Anomaly detection
- Anomaly scoring
"""

import pytest
import pandas as pd
import numpy as np
from app.models.anomalyModel import AnomalyModel


class TestAnomalyModel:
    """Test cases for AnomalyModel class."""

    @pytest.fixture
    def model(self):
        """Initialize AnomalyModel for tests."""
        return AnomalyModel(contamination=0.05)

    # ============== Initialization Tests ==============

    def test_model_initialization_default(self):
        """Test model initialization with default parameters."""
        model = AnomalyModel()

        assert model.contamination == 0.05
        assert not model.is_trained

    def test_model_initialization_custom_contamination(self):
        """Test model initialization with custom contamination."""
        model = AnomalyModel(contamination=0.1)

        assert model.contamination == 0.1
        assert not model.is_trained

    def test_model_initialization_contamination_bounds(self):
        """Test initialization with extreme contamination values."""
        model_low = AnomalyModel(contamination=0.01)
        model_high = AnomalyModel(contamination=0.5)

        assert model_low.contamination == 0.01
        assert model_high.contamination == 0.5

    # ============== Training Tests ==============

    def test_train_model(self, model, training_features):
        """Test model training."""
        result = model.train(training_features)

        assert model.is_trained
        assert result["trained"] is True
        assert "samples" in result

    def test_train_model_metrics(self, model, training_features):
        """Test that training returns valid metrics."""
        result = model.train(training_features)

        assert result["model_type"] == "IsolationForest"
        assert "contamination" in result
        assert "anomalies_detected" in result
        assert "anomaly_percentage" in result

    def test_train_model_sample_count(self, model, training_features):
        """Test that training reports correct sample count."""
        result = model.train(training_features)

        assert result["samples"] == len(training_features)

    def test_train_detects_anomalies(self, model, data_with_outliers):
        """Test that training detects anomalies."""
        result = model.train(data_with_outliers[["daily_change", "rolling_mean_7", "rolling_std_7"]])

        # Should detect at least some anomalies with outlier data
        assert result["anomalies_detected"] > 0

    # ============== Prediction Tests ==============

    def test_predict_before_training(self, model, training_features):
        """Test that prediction before training raises error."""
        with pytest.raises(ValueError):
            model.predict(training_features)

    def test_predict_after_training(self, model, training_features):
        """Test prediction after training."""
        model.train(training_features)
        predictions = model.predict(training_features)

        assert len(predictions) == len(training_features)
        assert np.all((predictions == 1) | (predictions == -1))  # Only 1 or -1

    def test_predict_shape(self, model, training_features):
        """Test prediction output shape."""
        model.train(training_features)
        predictions = model.predict(training_features)

        assert predictions.shape == (len(training_features),)

    def test_predict_values(self, model, training_features):
        """Test that predictions are valid anomaly labels."""
        model.train(training_features)
        predictions = model.predict(training_features)

        valid_values = {-1, 1}  # -1 for anomaly, 1 for normal
        assert set(predictions) <= valid_values

    # ============== Anomaly Detection Tests ==============

    def test_detect_anomalies_basic(self, model, sample_dataframe):
        """Test basic anomaly detection."""
        model.train(sample_dataframe[["daily_change", "rolling_mean_7", "rolling_std_7"]])
        result = model.detect_anomalies(sample_dataframe)

        assert "anomalies_detected" in result
        assert "total_records" in result
        assert "anomalies" in result

    def test_detect_anomalies_insufficient_data(self, model):
        """Test anomaly detection with insufficient data."""
        small_df = pd.DataFrame({"stock": [1, 2, 3]})
        result = model.detect_anomalies(small_df)

        assert "error" in result

    def test_detect_anomalies_with_outliers(self, model, data_with_outliers):
        """Test anomaly detection finds outliers."""
        model.train(data_with_outliers[["daily_change", "rolling_mean_7", "rolling_std_7"]])
        result = model.detect_anomalies(data_with_outliers)

        # Should detect the outlier value (1000)
        assert result["anomalies_detected"] > 0

    def test_detect_anomalies_returns_details(self, model, data_with_outliers):
        """Test that anomaly detection returns detailed info."""
        model.train(data_with_outliers[["daily_change", "rolling_mean_7", "rolling_std_7"]])
        result = model.detect_anomalies(data_with_outliers)

        if len(result.get("anomalies", [])) > 0:
            anomaly = result["anomalies"][0]
            assert "index" in anomaly
            assert "anomaly_score" in anomaly

    # ============== Anomaly Scoring Tests ==============

    def test_get_anomaly_score_before_training(self, model, training_features):
        """Test that scoring before training raises error."""
        with pytest.raises(ValueError):
            model.get_anomaly_score(training_features)

    def test_get_anomaly_score_after_training(self, model, training_features):
        """Test anomaly scoring after training."""
        model.train(training_features)
        scores = model.get_anomaly_score(training_features)

        assert len(scores) == len(training_features)
        assert isinstance(scores, np.ndarray)

    def test_anomaly_scores_range(self, model, training_features):
        """Test that anomaly scores are in expected range."""
        model.train(training_features)
        scores = model.get_anomaly_score(training_features)

        # Isolation Forest returns negative scores (more negative = more anomalous)
        assert np.all(scores <= 0)

    # ============== Evaluation Tests ==============

    def test_evaluate_without_labels(self, model, training_features):
        """Test evaluation without true labels."""
        model.train(training_features)
        result = model.evaluate(training_features)

        assert "total_predictions" in result
        assert "anomalies_found" in result
        assert "normal_found" in result

    def test_evaluate_with_labels(self, model, training_features):
        """Test evaluation with true labels."""
        model.train(training_features)
        y_true = np.ones(len(training_features))  # All normal
        result = model.evaluate(training_features, y_true)

        assert "accuracy" in result
        assert 0 <= result["accuracy"] <= 1

    def test_evaluate_metrics(self, model, training_features):
        """Test that evaluation returns valid metrics."""
        model.train(training_features)
        result = model.evaluate(training_features)

        total = result["anomalies_found"] + result["normal_found"]
        assert total == result["total_predictions"]

    # ============== Edge Cases ==============

    def test_model_with_clean_data(self, model, sample_dataframe):
        """Test model with clean data (no anomalies)."""
        features = sample_dataframe[["daily_change", "rolling_mean_7", "rolling_std_7"]]
        result = model.train(features)

        assert model.is_trained
        # May still find some anomalies due to contamination setting

    def test_model_with_anomalous_data(self, model, data_with_outliers):
        """Test model with anomalous data."""
        features = data_with_outliers[["daily_change", "rolling_mean_7", "rolling_std_7"]]
        result = model.train(features)

        assert model.is_trained
        assert result["anomalies_detected"] > 0

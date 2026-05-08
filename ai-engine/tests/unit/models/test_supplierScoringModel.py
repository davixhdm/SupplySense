"""
Tests for SupplierScoringModel

Tests cover:
- Model initialization
- Training
- Supplier scoring
- Feature importance
- Evaluation
"""

import pytest
import pandas as pd
import numpy as np
from app.models.supplierScoringModel import SupplierScoringModel


class TestSupplierScoringModel:
    """Test cases for SupplierScoringModel class."""

    @pytest.fixture
    def model(self):
        """Initialize SupplierScoringModel for tests."""
        return SupplierScoringModel()

    # ============== Initialization Tests ==============

    def test_model_initialization(self):
        """Test model initialization."""
        model = SupplierScoringModel()

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

        assert result["model_type"] == "RandomForest"
        assert result["samples"] == len(training_features)
        assert 0 <= result["train_score"] <= 1

    # ============== Supplier Scoring Tests ==============

    def test_score_suppliers_basic(self, model, supplier_performance_data):
        """Test basic supplier scoring."""
        result = model.score_suppliers(supplier_performance_data)

        assert "supplier_scores" in result
        assert "total_suppliers" in result
        assert "best_supplier" in result
        assert "worst_supplier" in result

    def test_score_suppliers_count(self, model, supplier_performance_data):
        """Test that all suppliers are scored."""
        result = model.score_suppliers(supplier_performance_data)

        unique_suppliers = supplier_performance_data["supplier_id"].nunique()
        assert len(result["supplier_scores"]) == unique_suppliers

    def test_score_suppliers_normalized_range(self, model, supplier_performance_data):
        """Test that supplier scores are normalized to 0-100."""
        result = model.score_suppliers(supplier_performance_data)

        for score in result["supplier_scores"].values():
            assert 0 <= score <= 100

    def test_score_suppliers_best_worst(self, model, supplier_performance_data):
        """Test that best and worst suppliers are identified."""
        result = model.score_suppliers(supplier_performance_data)

        best_score = result["supplier_scores"][result["best_supplier"]]
        worst_score = result["supplier_scores"][result["worst_supplier"]]

        assert best_score >= worst_score

    def test_score_suppliers_missing_column(self, model, sample_dataframe):
        """Test error handling for missing supplier_id column."""
        result = model.score_suppliers(sample_dataframe.drop("supplier_id", axis=1))

        assert "error" in result

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

    def test_predict_shape(self, model, training_features, training_target):
        """Test prediction output shape."""
        model.train(training_features, training_target)
        predictions = model.predict(training_features)

        assert predictions.shape == (len(training_features),)

    # ============== Feature Importance Tests ==============

    def test_get_feature_importance_before_training(self, model):
        """Test that feature importance before training raises error."""
        with pytest.raises(ValueError):
            model.get_feature_importance()

    def test_get_feature_importance_after_training(self, model, training_features, training_target):
        """Test feature importance after training."""
        model.train(training_features, training_target)
        importance = model.get_feature_importance()

        assert isinstance(importance, dict)
        assert len(importance) > 0

    def test_feature_importance_sum(self, model, training_features, training_target):
        """Test that feature importances sum correctly."""
        model.train(training_features, training_target)
        importance = model.get_feature_importance()

        total_importance = sum(importance.values())
        # Should sum close to 1.0 for tree-based models
        assert 0.9 <= total_importance <= 1.1

    # ============== Evaluation Tests ==============

    def test_evaluate_before_training(self, model, training_features, training_target):
        """Test that evaluation before training raises error."""
        with pytest.raises(ValueError):
            model.evaluate(training_features, training_target)

    def test_evaluate_after_training(self, model, training_features, training_target):
        """Test evaluation after training."""
        model.train(training_features, training_target)
        eval_result = model.evaluate(training_features, training_target)

        assert "accuracy" in eval_result
        assert "samples" in eval_result
        assert 0 <= eval_result["accuracy"] <= 1

    def test_evaluate_sample_count(self, model, training_features, training_target):
        """Test that evaluation includes correct sample count."""
        model.train(training_features, training_target)
        eval_result = model.evaluate(training_features, training_target)

        assert eval_result["samples"] == len(training_features)

    # ============== Supplier Scoring Calculation Tests ==============

    def test_calculate_supplier_score_empty(self, model):
        """Test supplier scoring with empty data."""
        empty_df = pd.DataFrame()
        score = model._calculate_supplier_score(empty_df)

        assert score == 0.0

    def test_calculate_supplier_score_valid(self, model, supplier_performance_data):
        """Test supplier scoring with valid data."""
        supplier_1_data = supplier_performance_data[supplier_performance_data["supplier_id"] == 1]
        score = model._calculate_supplier_score(supplier_1_data)

        assert 0 <= score <= 100

    def test_calculate_supplier_score_perfect(self, model):
        """Test supplier scoring with perfect data."""
        perfect_data = pd.DataFrame({
            "stock": [100] * 10,
            "daily_change": [0] * 10,
            "rolling_std_7": [0] * 10,
        })
        score = model._calculate_supplier_score(perfect_data)

        # Perfect consistency should give high score
        assert score > 90

    # ============== Edge Cases ==============

    def test_model_with_single_supplier(self, model):
        """Test scoring with single supplier."""
        df = pd.DataFrame({
            "supplier_id": [1] * 5,
            "stock": [100, 100, 100, 100, 100],
            "daily_change": [0, 0, 0, 0, 0],
            "rolling_std_7": [0, 0, 0, 0, 0],
        })
        result = model.score_suppliers(df)

        assert len(result["supplier_scores"]) == 1
        assert 1 in result["supplier_scores"]

    def test_model_with_many_suppliers(self, model):
        """Test scoring with many suppliers."""
        df = pd.DataFrame({
            "supplier_id": list(range(1, 51)) * 2,  # 50 suppliers
            "stock": np.random.randint(50, 150, 100),
            "daily_change": np.random.randn(100),
            "rolling_std_7": np.abs(np.random.randn(100)) * 5,
        })
        result = model.score_suppliers(df)

        assert len(result["supplier_scores"]) == 50

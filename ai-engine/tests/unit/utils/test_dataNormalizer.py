"""
Tests for DataNormalizer Utility

Tests cover:
- Standardization (z-score)
- Min-Max normalization
- Log normalization
- Type conversion
- Value clipping
"""

import pytest
import pandas as pd
import numpy as np
from app.utils.dataNormalizer import DataNormalizer


class TestDataNormalizer:
    """Test cases for DataNormalizer class."""

    @pytest.fixture
    def normalizer(self):
        """Initialize DataNormalizer for tests."""
        return DataNormalizer()

    # ============== Standardization Tests ==============

    def test_standardize_basic(self, normalizer, sample_dataframe):
        """Test basic standardization."""
        result = normalizer.standardize(sample_dataframe, columns=["stock"])

        # Standardized values should have mean ≈ 0 and std ≈ 1
        # Note: StandardScaler uses population std (N), but pandas.std() uses sample std (N-1)
        # so small deviation from 1.0 is expected (≈0.054 for N=10)
        assert abs(result["stock"].mean()) < 0.01
        assert abs(result["stock"].std() - 1.0) < 0.10

    def test_standardize_multiple_columns(self, normalizer, sample_dataframe):
        """Test standardization of multiple columns."""
        columns = ["stock", "daily_change"]
        result = normalizer.standardize(sample_dataframe, columns=columns)

        for col in columns:
            assert abs(result[col].mean()) < 0.01
            assert abs(result[col].std() - 1.0) < 0.10

    def test_standardize_all_numeric(self, normalizer, sample_dataframe):
        """Test standardization of all numeric columns."""
        result = normalizer.standardize(sample_dataframe)

        # Should standardize numeric columns
        assert "stock" in result.columns
        numeric_cols = result.select_dtypes(include=[np.number]).columns
        assert len(numeric_cols) > 0

    def test_standardize_preserves_non_numeric(self, normalizer, sample_dataframe):
        """Test that non-numeric columns are preserved."""
        result = normalizer.standardize(sample_dataframe, columns=["stock"])

        # Date column should be unchanged
        assert result["date"].equals(sample_dataframe["date"])

    # ============== Min-Max Normalization Tests ==============

    def test_min_max_normalize_basic(self, normalizer, sample_dataframe):
        """Test basic min-max normalization."""
        result = normalizer.min_max_normalize(sample_dataframe, columns=["stock"])

        # Values should be between 0 and 1
        assert result["stock"].min() >= 0.0
        assert result["stock"].max() <= 1.0

    def test_min_max_normalize_range(self, normalizer, sample_dataframe):
        """Test min-max normalization produces correct range."""
        result = normalizer.min_max_normalize(sample_dataframe, columns=["stock"])

        # Min should be close to 0, max close to 1
        assert abs(result["stock"].min()) < 0.01
        assert abs(result["stock"].max() - 1.0) < 0.01

    def test_min_max_normalize_multiple_columns(self, normalizer, sample_dataframe):
        """Test min-max normalization of multiple columns."""
        columns = ["stock", "rolling_mean_7"]
        result = normalizer.min_max_normalize(sample_dataframe, columns=columns)

        for col in columns:
            assert result[col].min() >= 0.0
            assert result[col].max() <= 1.0

    def test_min_max_normalize_constant_column(self, normalizer):
        """Test normalization of constant column."""
        df = pd.DataFrame({"constant": [5.0, 5.0, 5.0, 5.0]})
        result = normalizer.min_max_normalize(df, columns=["constant"])

        # Constant values should remain unchanged or become 0
        assert (result["constant"] == 0.0).all() or (result["constant"] == 5.0).all()

    # ============== Log Normalization Tests ==============

    def test_log_normalize_basic(self, normalizer):
        """Test basic log normalization."""
        df = pd.DataFrame({"values": [1, 10, 100, 1000]})
        result = normalizer.log_normalize(df, columns=["values"])

        # Log transform should reduce magnitude of values
        assert result["values"].max() < df["values"].max()
        assert not result.isnull().any().any()

    def test_log_normalize_positive_values(self, normalizer):
        """Test log normalization with positive values."""
        df = pd.DataFrame({"values": [1, 2, 3, 4, 5]})
        result = normalizer.log_normalize(df, columns=["values"])

        assert not result.isnull().any().any()
        assert all(result["values"] >= 0)

    def test_log_normalize_skips_negative(self, normalizer):
        """Test that log normalization skips negative values."""
        df = pd.DataFrame({"values": [-1, 0, 1, 2, 3]})
        original = df.copy()
        result = normalizer.log_normalize(df, columns=["values"])

        # Should not transform if any negative values
        assert result["values"].equals(original["values"])

    # ============== Type Conversion Tests ==============

    def test_convert_types_date(self, normalizer, sample_inventory_data):
        """Test conversion of date strings to datetime."""
        result = normalizer.convert_types(sample_inventory_data)

        assert pd.api.types.is_datetime64_any_dtype(result["date"])

    def test_convert_types_numeric(self, normalizer, sample_inventory_data):
        """Test conversion of numeric columns."""
        result = normalizer.convert_types(sample_inventory_data)

        assert pd.api.types.is_numeric_dtype(result["stock"])
        assert pd.api.types.is_numeric_dtype(result["product_id"])
        assert pd.api.types.is_numeric_dtype(result["supplier_id"])

    def test_convert_types_handles_coercion(self, normalizer):
        """Test that conversion handles type coercion errors gracefully."""
        data = [
            {"date": "2024-01-01", "stock": "100", "product_id": "1", "supplier_id": "1"},
            {"date": "2024-01-02", "stock": "invalid", "product_id": "1", "supplier_id": "1"},
        ]
        result = normalizer.convert_types(data)

        # Should coerce to NaN on invalid conversion
        assert pd.isna(result["stock"].iloc[1])

    def test_convert_types_preserves_structure(self, normalizer, sample_inventory_data):
        """Test that conversion preserves DataFrame structure."""
        result = normalizer.convert_types(sample_inventory_data)

        assert len(result) == len(sample_inventory_data)
        assert set(result.columns) == {"date", "stock", "product_id", "supplier_id"}

    # ============== Value Clipping Tests ==============

    def test_clip_values_basic(self, normalizer, sample_dataframe):
        """Test basic value clipping."""
        result = normalizer.clip_values(sample_dataframe, columns=["stock"], min_val=70, max_val=95)

        assert result["stock"].min() >= 70
        assert result["stock"].max() <= 95

    def test_clip_values_default_range(self, normalizer):
        """Test clipping to default [0, 1] range."""
        df = pd.DataFrame({"values": [-1, 0.5, 2, 3]})
        result = normalizer.clip_values(df, columns=["values"])

        assert result["values"].min() >= 0.0
        assert result["values"].max() <= 1.0

    def test_clip_values_multiple_columns(self, normalizer, sample_dataframe):
        """Test clipping multiple columns."""
        columns = ["stock", "rolling_mean_7"]
        result = normalizer.clip_values(sample_dataframe, columns=columns, min_val=50, max_val=150)

        for col in columns:
            assert result[col].min() >= 50
            assert result[col].max() <= 150

    def test_clip_values_preserves_other_columns(self, normalizer, sample_dataframe):
        """Test that clipping preserves non-clipped columns."""
        result = normalizer.clip_values(sample_dataframe, columns=["stock"])

        assert result["product_id"].equals(sample_dataframe["product_id"])
        assert result["supplier_id"].equals(sample_dataframe["supplier_id"])

    # ============== Integration Tests ==============

    def test_normalize_pipeline(self, normalizer, sample_dataframe):
        """Test complete normalization pipeline."""
        # First standardize
        result = normalizer.standardize(sample_dataframe, columns=["stock"])
        # Then clip
        result = normalizer.clip_values(result, columns=["stock"], min_val=-3, max_val=3)

        assert result["stock"].min() >= -3
        assert result["stock"].max() <= 3

"""
Tests for DataCleaner Utility

Tests cover:
- Duplicate removal
- Missing value handling
- Outlier removal
- Schema validation
- Text cleaning
"""

import pytest
import pandas as pd
import numpy as np
from app.utils.dataCleaner import DataCleaner


class TestDataCleaner:
    """Test cases for DataCleaner class."""

    @pytest.fixture
    def cleaner(self):
        """Initialize DataCleaner for tests."""
        return DataCleaner()

    # ============== Duplicate Removal Tests ==============

    def test_remove_duplicates_basic(self, cleaner, data_with_duplicates):
        """Test basic duplicate removal."""
        df = pd.DataFrame(data_with_duplicates)
        result = cleaner.remove_duplicates(df)

        assert len(result) == 2  # Should have 2 unique rows
        assert not result.duplicated().any()

    def test_remove_duplicates_no_duplicates(self, cleaner, sample_dataframe):
        """Test removal on data without duplicates."""
        result = cleaner.remove_duplicates(sample_dataframe)

        assert len(result) == len(sample_dataframe)
        assert list(result.columns) == list(sample_dataframe.columns)

    def test_remove_duplicates_all_same(self, cleaner):
        """Test removal when all rows are identical."""
        df = pd.DataFrame([
            {"a": 1, "b": 2},
            {"a": 1, "b": 2},
            {"a": 1, "b": 2},
        ])
        result = cleaner.remove_duplicates(df)

        assert len(result) == 1

    # ============== Missing Value Handling Tests ==============

    def test_handle_missing_values_mean_strategy(self, cleaner, data_with_missing_values):
        """Test missing value handling with mean strategy."""
        df = pd.DataFrame(data_with_missing_values)
        result = cleaner.handle_missing_values(df, strategy="mean")

        assert not result.isnull().any().any()  # No missing values
        # Mean should be ~92.5 ((100+90+80)/3)
        assert result["stock"].iloc[1] > 80
        assert result["stock"].iloc[1] < 100

    def test_handle_missing_values_median_strategy(self, cleaner, data_with_missing_values):
        """Test missing value handling with median strategy."""
        df = pd.DataFrame(data_with_missing_values)
        result = cleaner.handle_missing_values(df, strategy="median")

        assert not result.isnull().any().any()
        # Median should be 90
        assert result["stock"].iloc[1] == 90.0

    def test_handle_missing_values_drop_strategy(self, cleaner, data_with_missing_values):
        """Test missing value handling with drop strategy."""
        df = pd.DataFrame(data_with_missing_values)
        result = cleaner.handle_missing_values(df, strategy="drop")

        assert not result.isnull().any().any()
        assert len(result) == 3  # Dropped 2 rows with missing values

    def test_handle_missing_values_invalid_strategy(self, cleaner, sample_dataframe):
        """Test that invalid strategy raises error."""
        with pytest.raises(ValueError):
            cleaner.handle_missing_values(sample_dataframe, strategy="invalid")

    # ============== Outlier Removal Tests ==============

    def test_remove_outliers_basic(self, cleaner, data_with_outliers):
        """Test basic outlier removal."""
        result = cleaner.remove_outliers(data_with_outliers, column="stock")

        assert len(result) < len(data_with_outliers)  # Some rows removed
        assert result["stock"].max() < 1000  # Outlier removed
        assert not result.duplicated().any()

    def test_remove_outliers_high_threshold(self, cleaner, data_with_outliers):
        """Test outlier removal with high threshold (less strict)."""
        result = cleaner.remove_outliers(data_with_outliers, column="stock", threshold=5.0)

        assert len(result) == len(data_with_outliers)  # Nothing removed with high threshold

    def test_remove_outliers_low_threshold(self, cleaner, data_with_outliers):
        """Test outlier removal with low threshold (more strict)."""
        result = cleaner.remove_outliers(data_with_outliers, column="stock", threshold=1.0)

        assert len(result) < len(data_with_outliers)  # More rows removed

    def test_remove_outliers_resets_index(self, cleaner, data_with_outliers):
        """Test that outlier removal resets index."""
        result = cleaner.remove_outliers(data_with_outliers, column="stock")

        assert result.index.tolist() == list(range(len(result)))

    # ============== Schema Validation Tests ==============

    def test_validate_schema_valid(self, cleaner, sample_inventory_data):
        """Test schema validation with valid data."""
        assert cleaner.validate_schema(sample_inventory_data) is True

    def test_validate_schema_invalid_missing_fields(self, cleaner, invalid_data):
        """Test schema validation with missing required fields."""
        assert cleaner.validate_schema(invalid_data) is False

    def test_validate_schema_empty_list(self, cleaner):
        """Test schema validation with empty list."""
        assert cleaner.validate_schema([]) is False

    def test_validate_schema_extra_fields_ok(self, cleaner):
        """Test that extra fields don't invalidate schema."""
        data = [
            {
                "date": "2024-01-01",
                "stock": 100,
                "product_id": 1,
                "supplier_id": 1,
                "extra_field": "value",
            }
        ]
        assert cleaner.validate_schema(data) is True

    # ============== Text Cleaning Tests ==============

    def test_clean_text_whitespace(self, cleaner):
        """Test text cleaning removes extra whitespace."""
        result = cleaner.clean_text("  Hello World  ")

        assert result == "hello world"

    def test_clean_text_lowercase(self, cleaner):
        """Test text cleaning converts to lowercase."""
        result = cleaner.clean_text("HELLO")

        assert result == "hello"

    def test_clean_text_non_string(self, cleaner):
        """Test text cleaning handles non-string input."""
        result = cleaner.clean_text(123)

        assert result == 123

    def test_clean_text_none(self, cleaner):
        """Test text cleaning handles None input."""
        result = cleaner.clean_text(None)

        assert result is None

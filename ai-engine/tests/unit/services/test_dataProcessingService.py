"""
Tests for DataProcessingService

Tests cover:
- Data validation
- Data cleaning and processing
- Feature engineering
- Data quality metrics
- Train/test splitting
"""

import pytest
import pandas as pd
import numpy as np
from app.services.dataProcessingService import DataProcessingService


class TestDataProcessingService:
    """Test cases for DataProcessingService class."""

    @pytest.fixture
    def service(self):
        """Initialize DataProcessingService for tests."""
        return DataProcessingService()

    # ============== Schema Validation Tests ==============

    def test_process_inventory_data_valid(self, service, sample_inventory_data):
        """Test processing valid inventory data."""
        result = service.process_inventory_data(sample_inventory_data)

        assert isinstance(result, pd.DataFrame)
        assert len(result) == len(sample_inventory_data)
        assert "stock" in result.columns
        assert "product_id" in result.columns

    def test_process_inventory_data_invalid_schema(self, service, invalid_data):
        """Test processing data with invalid schema."""
        with pytest.raises(ValueError):
            service.process_inventory_data(invalid_data)

    def test_process_inventory_data_missing_values(self, service, data_with_missing_values):
        """Test that missing values are handled."""
        result = service.process_inventory_data(data_with_missing_values)

        assert not result.isnull().any().any()

    def test_process_inventory_data_duplicates(self, service, data_with_duplicates):
        """Test that duplicates are removed."""
        result = service.process_inventory_data(data_with_duplicates)

        assert len(result) < len(data_with_duplicates)

    # ============== Data Sorting Tests ==============

    def test_data_is_sorted_by_date(self, service, sample_inventory_data):
        """Test that data is sorted chronologically."""
        # Shuffle the data first
        shuffled = sample_inventory_data[5:] + sample_inventory_data[:5]
        result = service.process_inventory_data(shuffled)

        dates = pd.to_datetime(result["date"])
        assert (dates == dates.sort_values()).all()

    def test_data_is_sorted_by_product(self, service):
        """Test that data is sorted by product_id."""
        data = [
            {"date": "2024-01-01", "stock": 100, "product_id": 2, "supplier_id": 1},
            {"date": "2024-01-02", "stock": 95, "product_id": 1, "supplier_id": 1},
            {"date": "2024-01-03", "stock": 90, "product_id": 2, "supplier_id": 1},
        ]
        result = service.process_inventory_data(data)

        # Should have product 1 before product 2
        product_1_data = result[result["product_id"] == 1]
        product_2_data = result[result["product_id"] == 2]
        first_product_1_idx = product_1_data.index[0]
        first_product_2_idx = product_2_data.index[0]

        assert first_product_1_idx < first_product_2_idx

    # ============== Feature Engineering Tests ==============

    def test_feature_engineering_daily_change(self, service, sample_inventory_data):
        """Test that daily_change feature is created."""
        result = service.process_inventory_data(sample_inventory_data)

        assert "daily_change" in result.columns
        # First row should have 0 change
        assert result.iloc[0]["daily_change"] == 0

    def test_feature_engineering_rolling_mean(self, service, sample_inventory_data):
        """Test that rolling_mean_7 feature is created."""
        result = service.process_inventory_data(sample_inventory_data)

        assert "rolling_mean_7" in result.columns
        assert not result["rolling_mean_7"].isnull().any()

    def test_feature_engineering_rolling_std(self, service, sample_inventory_data):
        """Test that rolling_std_7 feature is created."""
        result = service.process_inventory_data(sample_inventory_data)

        assert "rolling_std_7" in result.columns
        assert not result["rolling_std_7"].isnull().any()

    def test_feature_values_reasonable(self, service, sample_inventory_data):
        """Test that engineered feature values are reasonable."""
        result = service.process_inventory_data(sample_inventory_data)

        # Rolling mean should be between min and max stock
        min_stock = result["stock"].min()
        max_stock = result["stock"].max()
        assert result["rolling_mean_7"].min() >= min_stock - 1
        assert result["rolling_mean_7"].max() <= max_stock + 1

    # ============== Normalization Tests ==============

    def test_normalized_values_in_range(self, service, sample_inventory_data):
        """Test that normalized values are in [0, 1] range."""
        result = service.process_inventory_data(sample_inventory_data)

        # Stock should be normalized to [0, 1]
        assert result["stock"].min() >= 0.0
        assert result["stock"].max() <= 1.0

    def test_normalization_preserves_relationships(self, service, sample_inventory_data):
        """Test that normalization preserves value relationships."""
        result = service.process_inventory_data(sample_inventory_data)

        # Stocks should still be in descending order
        assert (result["stock"].diff().fillna(0) <= 0).all()

    # ============== Data Quality Metrics Tests ==============

    def test_validate_data_quality(self, service, sample_inventory_data):
        """Test data quality validation."""
        processed = service.process_inventory_data(sample_inventory_data)
        quality = service.validate_data_quality(processed)

        assert "total_records" in quality
        assert "missing_values" in quality
        assert "duplicates" in quality
        assert "date_range" in quality

    def test_validate_data_quality_no_missing(self, service, sample_inventory_data):
        """Test that processed data has no missing values."""
        processed = service.process_inventory_data(sample_inventory_data)
        quality = service.validate_data_quality(processed)

        total_missing = sum(quality["missing_values"].values())
        assert total_missing == 0

    def test_validate_data_quality_product_count(self, service, sample_inventory_data):
        """Test that unique products are counted correctly."""
        processed = service.process_inventory_data(sample_inventory_data)
        quality = service.validate_data_quality(processed)

        assert quality["unique_products"] == 1  # One product in test data

    def test_validate_data_quality_supplier_count(self, service, sample_inventory_data):
        """Test that unique suppliers are counted correctly."""
        processed = service.process_inventory_data(sample_inventory_data)
        quality = service.validate_data_quality(processed)

        assert quality["unique_suppliers"] == 1  # One supplier in test data

    # ============== Filtering Tests ==============

    def test_get_product_data(self, service, multi_product_dataframe):
        """Test filtering data for specific product."""
        result = service.get_product_data(multi_product_dataframe, product_id=1)

        assert (result["product_id"] == 1).all()
        assert len(result) > 0

    def test_get_product_data_empty(self, service, sample_dataframe):
        """Test filtering for non-existent product."""
        result = service.get_product_data(sample_dataframe, product_id=999)

        assert len(result) == 0

    def test_get_supplier_data(self, service, multi_product_dataframe):
        """Test filtering data for specific supplier."""
        result = service.get_supplier_data(multi_product_dataframe, supplier_id=1)

        assert (result["supplier_id"] == 1).all()
        assert len(result) > 0

    def test_get_supplier_data_empty(self, service, sample_dataframe):
        """Test filtering for non-existent supplier."""
        result = service.get_supplier_data(sample_dataframe, supplier_id=999)

        assert len(result) == 0

    # ============== Train/Test Splitting Tests ==============

    def test_split_train_test_default(self, service, sample_dataframe):
        """Test train/test splitting with default ratio."""
        train, test = service.split_train_test(sample_dataframe)

        assert len(train) + len(test) == len(sample_dataframe)
        assert len(test) / len(sample_dataframe) == pytest.approx(0.2, abs=0.05)

    def test_split_train_test_custom_ratio(self, service, sample_dataframe):
        """Test train/test splitting with custom ratio."""
        train, test = service.split_train_test(sample_dataframe, test_size=0.3)

        assert len(test) / len(sample_dataframe) == pytest.approx(0.3, abs=0.05)

    def test_split_train_test_chronological(self, service, sample_dataframe):
        """Test that split maintains chronological order."""
        train, test = service.split_train_test(sample_dataframe)

        # Test set dates should be after training set dates
        if len(train) > 0 and len(test) > 0:
            assert train.iloc[-1]["date"] <= test.iloc[0]["date"]

    def test_split_train_test_no_overlap(self, service, sample_dataframe):
        """Test that train and test sets don't overlap."""
        train, test = service.split_train_test(sample_dataframe)

        train_indices = set(train.index)
        test_indices = set(test.index)

        assert len(train_indices & test_indices) == 0

    # ============== Edge Cases ==============

    def test_process_single_record(self, service):
        """Test processing single record."""
        data = [{"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 1}]
        result = service.process_inventory_data(data)

        assert len(result) == 1
        assert result.iloc[0]["product_id"] == 1

    def test_process_large_dataset(self, service):
        """Test processing large dataset."""
        data = [
            {
                "date": f"2024-01-{(i % 31) + 1:02d}",
                "stock": 100 - i % 50,
                "product_id": i % 10 + 1,
                "supplier_id": i % 5 + 1,
            }
            for i in range(1000)
        ]
        result = service.process_inventory_data(data)

        assert len(result) == 1000
        assert not result.isnull().any().any()

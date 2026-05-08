"""
Pytest Configuration and Shared Fixtures

This file contains shared fixtures and configuration for all tests.
"""

import pytest
import pandas as pd
import numpy as np
from typing import List, Dict, Any


@pytest.fixture
def sample_inventory_data() -> List[Dict[str, Any]]:
    """
    Create sample inventory data for testing.

    Returns:
        List of inventory records
    """
    return [
        {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-02", "stock": 95, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-03", "stock": 90, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-04", "stock": 85, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-05", "stock": 80, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-06", "stock": 75, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-07", "stock": 70, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-08", "stock": 65, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-09", "stock": 60, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-10", "stock": 55, "product_id": 1, "supplier_id": 1},
    ]


@pytest.fixture
def sample_dataframe() -> pd.DataFrame:
    """
    Create sample DataFrame for testing.

    Returns:
        Processed DataFrame with features
    """
    df = pd.DataFrame({
        "date": pd.date_range("2024-01-01", periods=10),
        "stock": [100, 95, 90, 85, 80, 75, 70, 65, 60, 55],
        "product_id": [1] * 10,
        "supplier_id": [1] * 10,
        "daily_change": [0, -5, -5, -5, -5, -5, -5, -5, -5, -5],
        "rolling_mean_7": [100, 97.5, 95, 92.5, 90, 87.5, 85, 82.5, 80, 77.5],
        "rolling_std_7": [0, 2.5, 5, 7.5, 5, 5, 5, 5, 5, 5],
    })
    return df


@pytest.fixture
def multi_product_dataframe() -> pd.DataFrame:
    """
    Create DataFrame with multiple products for testing.

    Returns:
        DataFrame with multiple product IDs
    """
    dates = pd.date_range("2024-01-01", periods=5)
    
    product_1_data = {
        "date": dates,
        "stock": [100, 95, 90, 85, 80],
        "product_id": [1] * 5,
        "supplier_id": [1] * 5,
        "daily_change": [0, -5, -5, -5, -5],
        "rolling_mean_7": [100, 97.5, 95, 92.5, 90],
        "rolling_std_7": [0, 2.5, 5, 7.5, 5],
    }
    
    product_2_data = {
        "date": dates,
        "stock": [200, 210, 220, 230, 240],
        "product_id": [2] * 5,
        "supplier_id": [2] * 5,
        "daily_change": [0, 10, 10, 10, 10],
        "rolling_mean_7": [200, 205, 210, 215, 220],
        "rolling_std_7": [0, 5, 5, 5, 5],
    }
    
    df1 = pd.DataFrame(product_1_data)
    df2 = pd.DataFrame(product_2_data)
    
    return pd.concat([df1, df2], ignore_index=True)


@pytest.fixture
def invalid_data() -> List[Dict[str, Any]]:
    """
    Create invalid data for schema validation tests.

    Returns:
        List with incomplete records
    """
    return [
        {"date": "2024-01-01", "stock": 100},  # Missing product_id and supplier_id
        {"date": "2024-01-02"},  # Missing all required fields
    ]


@pytest.fixture
def data_with_missing_values() -> List[Dict[str, Any]]:
    """
    Create data with missing values for cleaning tests.

    Returns:
        List with None values
    """
    return [
        {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-02", "stock": None, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-03", "stock": 90, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-04", "stock": None, "product_id": 1, "supplier_id": 1},
        {"date": "2024-01-05", "stock": 80, "product_id": 1, "supplier_id": 1},
    ]


@pytest.fixture
def data_with_duplicates() -> List[Dict[str, Any]]:
    """
    Create data with duplicate records for cleaning tests.

    Returns:
        List with duplicate records
    """
    base = {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 1}
    return [
        base,
        base,  # Duplicate
        {"date": "2024-01-02", "stock": 95, "product_id": 1, "supplier_id": 1},
        base,  # Another duplicate
    ]


@pytest.fixture
def data_with_outliers() -> pd.DataFrame:
    """
    Create data with outliers for anomaly detection tests.

    Returns:
        DataFrame with outlier values
    """
    df = pd.DataFrame({
        "date": pd.date_range("2024-01-01", periods=10),
        "stock": [100, 102, 101, 99, 1000, 98, 97, 95, 96, 94],  # 1000 is an outlier
        "product_id": [1] * 10,
        "supplier_id": [1] * 10,
        "daily_change": [0, 2, -1, -2, 901, -902, -1, -2, 1, -2],
        "rolling_mean_7": [100, 101, 101, 100, 200, 200, 100, 97, 96, 95],
        "rolling_std_7": [0, 1, 1, 1, 200, 200, 1, 1, 1, 1],
    })
    return df


@pytest.fixture
def training_features() -> pd.DataFrame:
    """
    Create sample training features for model tests.

    Returns:
        DataFrame with training features
    """
    return pd.DataFrame({
        "daily_change": np.random.randn(100),
        "rolling_mean_7": np.random.randn(100) * 10 + 100,
        "rolling_std_7": np.abs(np.random.randn(100) * 5),
    })


@pytest.fixture
def training_target() -> pd.Series:
    """
    Create sample training target for model tests.

    Returns:
        Series with target values
    """
    return pd.Series(np.random.randint(0, 200, 100))


@pytest.fixture
def supplier_performance_data() -> pd.DataFrame:
    """
    Create sample supplier performance data for tests.

    Returns:
        DataFrame with supplier performance metrics
    """
    return pd.DataFrame({
        "date": pd.date_range("2024-01-01", periods=20),
        "stock": [100, 98, 95, 92, 90, 88, 85, 82, 80, 78, 75, 72, 70, 68, 65, 62, 60, 58, 55, 52],
        "supplier_id": [1] * 10 + [2] * 10,
        "product_id": [1] * 20,
        "daily_change": [0, -2, -3, -3, -2, -2, -3, -3, -2, -2] * 2,
        "rolling_mean_7": np.linspace(100, 50, 20),
        "rolling_std_7": np.abs(np.sin(np.linspace(0, 4*np.pi, 20))) * 5,
    })


@pytest.fixture
def customer_transaction_data() -> pd.DataFrame:
    """
    Create sample customer transaction data for tests.

    Returns:
        DataFrame with customer transactions
    """
    return pd.DataFrame({
        "date": pd.date_range("2024-01-01", periods=15),
        "quantity": [100, 105, 103, 107, 110, 108, 112, 115, 113, 110, 108, 105, 102, 100, 98],
        "customer_id": [1] * 15,
        "product_id": [1] * 15,
        "daily_change": [0, 5, -2, 4, 3, -2, 4, 3, -2, -3, -2, -3, -3, -2, -2],
        "rolling_mean_7": np.linspace(100, 105, 15),
        "rolling_std_7": np.ones(15) * 4,
    })


# Pytest configuration
def pytest_configure(config):
    """Add custom markers for tests."""
    config.addinivalue_line("markers", "unit: mark test as a unit test")
    config.addinivalue_line("markers", "integration: mark test as an integration test")
    config.addinivalue_line("markers", "slow: mark test as slow running")

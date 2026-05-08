"""
Data Cleaner Utility

Handles data cleaning operations including:
- Removing duplicates
- Handling missing values
- Removing outliers
- Validating data types
"""

from typing import Any, Dict, List
import pandas as pd
import numpy as np


class DataCleaner:
    """
    Utility class for cleaning raw data before processing.
    """

    @staticmethod
    def remove_duplicates(data: pd.DataFrame) -> pd.DataFrame:
        """
        Remove duplicate rows from the DataFrame.

        Args:
            data: Input DataFrame

        Returns:
            DataFrame with duplicates removed
        """
        return data.drop_duplicates().reset_index(drop=True)

    @staticmethod
    def handle_missing_values(
        data: pd.DataFrame, strategy: str = "mean"
    ) -> pd.DataFrame:
        """
        Handle missing values using specified strategy.

        Args:
            data: Input DataFrame
            strategy: Strategy to use ('mean', 'median', 'forward_fill', 'drop')

        Returns:
            DataFrame with missing values handled
        """
        if strategy == "mean":
            return data.fillna(data.mean(numeric_only=True))
        elif strategy == "median":
            return data.fillna(data.median(numeric_only=True))
        elif strategy == "forward_fill":
            return data.ffill().bfill()
        elif strategy == "drop":
            return data.dropna()
        else:
            raise ValueError(f"Unknown strategy: {strategy}")

    @staticmethod
    def remove_outliers(data: pd.DataFrame, column: str, threshold: float = 2.5) -> pd.DataFrame:
        """
        Remove outliers from a specific column using z-score method.

        Args:
            data: Input DataFrame
            column: Column name to check for outliers
            threshold: Z-score threshold (default: 2.5 for more sensitive detection)

        Returns:
            DataFrame with outliers removed
        """
        z_scores = np.abs((data[column] - data[column].mean()) / data[column].std())
        return data[z_scores < threshold].reset_index(drop=True)

    @staticmethod
    def validate_schema(data: List[Dict[str, Any]]) -> bool:
        """
        Validate that all records have required fields.

        Args:
            data: List of data records

        Returns:
            True if schema is valid, False otherwise
        """
        required_fields = {"date", "stock", "product_id", "supplier_id"}

        if not data:
            return False

        for record in data:
            if not required_fields.issubset(set(record.keys())):
                return False

        return True

    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean text fields by removing extra whitespace.

        Args:
            text: Input text

        Returns:
            Cleaned text
        """
        return text.strip().lower() if isinstance(text, str) else text

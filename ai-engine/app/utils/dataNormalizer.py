"""
Data Normalizer Utility

Handles data normalization operations including:
- Standardization (z-score normalization)
- Min-Max normalization
- Log normalization
- Type conversion
"""

from typing import List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler


class DataNormalizer:
    """
    Utility class for normalizing data to consistent scales.
    """

    def __init__(self):
        """Initialize scalers"""
        self.min_max_scaler = MinMaxScaler()
        self.standard_scaler = StandardScaler()

    def standardize(self, data: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
        """
        Standardize numerical columns using z-score normalization.

        Args:
            data: Input DataFrame
            columns: Columns to standardize (default: all numerical columns)

        Returns:
            DataFrame with standardized columns
        """
        data_copy = data.copy()

        if columns is None:
            columns = data_copy.select_dtypes(include=[np.number]).columns.tolist()

        data_copy[columns] = self.standard_scaler.fit_transform(data_copy[columns])
        return data_copy

    def min_max_normalize(self, data: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
        """
        Normalize columns to [0, 1] range using Min-Max normalization.

        Args:
            data: Input DataFrame
            columns: Columns to normalize (default: all numerical columns)

        Returns:
            DataFrame with normalized columns
        """
        data_copy = data.copy()

        if columns is None:
            columns = data_copy.select_dtypes(include=[np.number]).columns.tolist()

        data_copy[columns] = self.min_max_scaler.fit_transform(data_copy[columns])
        return data_copy

    @staticmethod
    def log_normalize(data: pd.DataFrame, columns: List[str] = None) -> pd.DataFrame:
        """
        Apply log normalization to handle skewed distributions.

        Args:
            data: Input DataFrame
            columns: Columns to normalize

        Returns:
            DataFrame with log-normalized columns
        """
        data_copy = data.copy()

        if columns is None:
            columns = data_copy.select_dtypes(include=[np.number]).columns.tolist()

        for col in columns:
            if (data_copy[col] > 0).all():
                data_copy[col] = np.log1p(data_copy[col])

        return data_copy

    @staticmethod
    def convert_types(data: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Convert data types to appropriate formats.

        Args:
            data: List of data records

        Returns:
            DataFrame with converted types
        """
        df = pd.DataFrame(data)

        # Convert date strings to datetime
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"])

        # Ensure numeric columns are numeric
        numeric_columns = ["stock", "product_id", "supplier_id"]
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")

        return df

    @staticmethod
    def clip_values(
        data: pd.DataFrame, columns: List[str] = None, min_val: float = 0, max_val: float = 1
    ) -> pd.DataFrame:
        """
        Clip values to specified range.

        Args:
            data: Input DataFrame
            columns: Columns to clip
            min_val: Minimum value
            max_val: Maximum value

        Returns:
            DataFrame with clipped values
        """
        data_copy = data.copy()

        if columns is None:
            columns = data_copy.select_dtypes(include=[np.number]).columns.tolist()

        for col in columns:
            data_copy[col] = data_copy[col].clip(lower=min_val, upper=max_val)

        return data_copy

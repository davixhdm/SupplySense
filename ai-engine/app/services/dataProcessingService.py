"""
Core Data Processing Service

This is the CORE PIPELINE of the system.

All raw data MUST pass through this service before being sent to models.

Responsibilities:
- Validate schema
- Clean data
- Convert types
- Handle missing values
- Sort data chronologically
- Perform feature engineering (daily_change, rolling_mean, rolling_std)
- Normalize numerical fields

NO raw data should go directly into models.
"""

from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime

from app.utils.dataCleaner import DataCleaner
from app.utils.dataNormalizer import DataNormalizer


class DataProcessingService:
    """
    Core data processing pipeline for the supply chain analytics engine.

    This service orchestrates all data preparation steps and ensures
    data quality before it reaches the ML models.
    """

    def __init__(self):
        """Initialize the data processing service with utilities"""
        self.cleaner = DataCleaner()
        self.normalizer = DataNormalizer()

    def process_inventory_data(self, raw_data: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Complete pipeline to process raw inventory data.

        Args:
            raw_data: List of raw inventory records

        Returns:
            Processed and normalized DataFrame ready for models

        Raises:
            ValueError: If schema validation fails
        """
        # Step 1: Validate schema
        if not self.cleaner.validate_schema(raw_data):
            raise ValueError("Invalid data schema. Required fields: date, stock, product_id, supplier_id")

        # Step 2: Convert to DataFrame and fix types
        df = self.normalizer.convert_types(raw_data)

        # Step 3: Sort by date and product
        df = df.sort_values(by=["product_id", "date"]).reset_index(drop=True)

        # Step 4: Remove duplicates
        df = self.cleaner.remove_duplicates(df)

        # Step 5: Handle missing values
        df = self.cleaner.handle_missing_values(df, strategy="forward_fill")

        # Step 6: Feature engineering
        df = self._engineer_features(df)

        # Step 7: Normalize numerical fields (excluding daily_change which is a derived metric)
        numeric_cols = ["stock", "rolling_mean_7", "rolling_std_7"]
        df = self.normalizer.min_max_normalize(df, numeric_cols)

        return df

    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Perform feature engineering on the data.

        Creates new features:
        - daily_change: Change in stock from previous day
        - rolling_mean_7: 7-day rolling average
        - rolling_std_7: 7-day rolling standard deviation

        Args:
            df: Input DataFrame

        Returns:
            DataFrame with engineered features
        """
        df_copy = df.copy()

        # Calculate daily changes per product
        df_copy["daily_change"] = df_copy.groupby("product_id")["stock"].diff().fillna(0)

        # Calculate 7-day rolling mean
        df_copy["rolling_mean_7"] = (
            df_copy.groupby("product_id")["stock"].rolling(window=7, min_periods=1).mean().reset_index(0, drop=True)
        )

        # Calculate 7-day rolling standard deviation
        df_copy["rolling_std_7"] = (
            df_copy.groupby("product_id")["stock"].rolling(window=7, min_periods=1).std().reset_index(0, drop=True)
        )

        # Fill NaN values for rolling calculations
        df_copy["rolling_std_7"] = df_copy["rolling_std_7"].fillna(0)

        return df_copy

    def validate_data_quality(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Validate the quality of processed data.

        Args:
            df: Input DataFrame

        Returns:
            Dictionary with quality metrics
        """
        return {
            "total_records": len(df),
            "missing_values": df.isnull().sum().to_dict(),
            "duplicates": len(df[df.duplicated()]),
            "date_range": {
                "start": str(df["date"].min()) if "date" in df.columns else None,
                "end": str(df["date"].max()) if "date" in df.columns else None,
            },
            "unique_products": df["product_id"].nunique() if "product_id" in df.columns else 0,
            "unique_suppliers": df["supplier_id"].nunique() if "supplier_id" in df.columns else 0,
        }

    def get_product_data(self, df: pd.DataFrame, product_id: int) -> pd.DataFrame:
        """
        Extract data for a specific product.

        Args:
            df: Processed DataFrame
            product_id: Product ID to filter

        Returns:
            Filtered DataFrame for the product
        """
        return df[df["product_id"] == product_id].reset_index(drop=True)

    def get_supplier_data(self, df: pd.DataFrame, supplier_id: int) -> pd.DataFrame:
        """
        Extract data for a specific supplier.

        Args:
            df: Processed DataFrame
            supplier_id: Supplier ID to filter

        Returns:
            Filtered DataFrame for the supplier
        """
        return df[df["supplier_id"] == supplier_id].reset_index(drop=True)

    def split_train_test(self, df: pd.DataFrame, test_size: float = 0.2) -> tuple:
        """
        Split data into training and testing sets.

        Args:
            df: Input DataFrame
            test_size: Proportion of data for testing (default: 0.2)

        Returns:
            Tuple of (train_df, test_df)
        """
        split_point = int(len(df) * (1 - test_size))
        return df[:split_point], df[split_point:]

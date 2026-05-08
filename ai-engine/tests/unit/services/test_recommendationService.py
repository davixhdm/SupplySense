"""
Tests for RecommendationService

Tests cover:
- Reorder recommendations
- Supplier switching recommendations
- Anomaly alerts
- Bulk recommendations
"""

import pytest
import pandas as pd
from datetime import datetime
from app.services.recommendationService import RecommendationService


class TestRecommendationService:
    """Test cases for RecommendationService class."""

    @pytest.fixture
    def service(self):
        """Initialize RecommendationService for tests."""
        return RecommendationService()

    # ============== Reorder Recommendation Tests ==============

    def test_generate_reorder_recommendation(self, service):
        """Test basic reorder recommendation generation."""
        result = service.generate_reorder_recommendation(
            product_id=1,
            current_stock=50,
            forecast=100,
            lead_time=7,
        )

        assert result["type"] == "reorder"
        assert result["product_id"] == 1
        assert "action" in result
        assert "priority" in result

    def test_reorder_recommendation_structure(self, service):
        """Test reorder recommendation has required fields."""
        result = service.generate_reorder_recommendation(1, 50, 100, 7)

        required_fields = {
            "type",
            "product_id",
            "current_stock",
            "reorder_point",
            "recommended_quantity",
            "priority",
            "action",
            "timestamp",
        }
        assert required_fields.issubset(result.keys())

    def test_reorder_action_urgency(self, service):
        """Test reorder action based on stock levels."""
        # Low stock should trigger REORDER
        low_stock = service.generate_reorder_recommendation(1, 10, 100, 7)
        assert low_stock["action"] == "REORDER"

        # High stock should trigger MONITOR
        high_stock = service.generate_reorder_recommendation(1, 1000, 100, 7)
        assert high_stock["action"] == "MONITOR"

    def test_reorder_priority_levels(self, service):
        """Test that reorder priority is set correctly."""
        # Critical: stock = 0
        critical = service.generate_reorder_recommendation(1, 0, 100, 7)
        assert critical["priority"] == "CRITICAL"

        # High: stock < reorder_point * 0.5
        high = service.generate_reorder_recommendation(1, 30, 100, 7)
        assert high["priority"] == "HIGH"

        # Medium: stock < reorder_point
        medium = service.generate_reorder_recommendation(1, 650, 100, 7)
        assert medium["priority"] == "MEDIUM"

    def test_reorder_quantity_calculation(self, service):
        """Test that reorder quantity is calculated correctly."""
        result = service.generate_reorder_recommendation(1, 50, 100, 7)

        reorder_point = 100 * 7
        expected_quantity = max(0, reorder_point - 50)
        assert result["recommended_quantity"] == expected_quantity

    def test_reorder_quantity_never_negative(self, service):
        """Test that reorder quantity is never negative."""
        result = service.generate_reorder_recommendation(1, 1000, 100, 7)

        assert result["recommended_quantity"] >= 0

    # ============== Supplier Recommendation Tests ==============

    def test_generate_supplier_switch_recommendation(self, service):
        """Test basic supplier switch recommendation."""
        supplier_scores = {1: 70, 2: 85}
        result = service.generate_supplier_recommendation(supplier_scores, current_supplier_id=1)

        assert result["type"] == "supplier_switch"
        assert "action" in result
        assert "reason" in result

    def test_supplier_recommendation_structure(self, service):
        """Test supplier recommendation has required fields."""
        result = service.generate_supplier_recommendation({1: 70, 2: 85}, 1)

        required_fields = {
            "type",
            "current_supplier_id",
            "current_score",
            "recommended_supplier_id",
            "recommended_score",
            "action",
            "reason",
            "timestamp",
        }
        assert required_fields.issubset(result.keys())

    def test_supplier_switch_action(self, service):
        """Test supplier switch action based on scores."""
        # Better alternative available
        switch = service.generate_supplier_recommendation({1: 70, 2: 85}, 1)
        assert switch["action"] == "SWITCH"

        # Current supplier is best
        maintain = service.generate_supplier_recommendation({1: 85, 2: 70}, 1)
        assert maintain["action"] == "MAINTAIN"

    def test_supplier_no_alternatives(self, service):
        """Test supplier recommendation with no alternatives."""
        result = service.generate_supplier_recommendation({}, 1)

        assert result["action"] == "MAINTAIN"
        assert "No alternatives" in result["reason"]

    def test_supplier_recommendation_single_supplier(self, service):
        """Test recommendation with single supplier."""
        result = service.generate_supplier_recommendation({1: 80}, 1)

        assert result["action"] == "MAINTAIN"

    def test_supplier_switch_threshold(self, service):
        """Test that supplier switch has 10% improvement threshold."""
        # 10% better
        just_switch = service.generate_supplier_recommendation({1: 80, 2: 88}, 1)
        assert just_switch["action"] == "SWITCH"

        # Less than 10% better
        no_switch = service.generate_supplier_recommendation({1: 80, 2: 87}, 1)
        assert no_switch["action"] == "MAINTAIN"

    # ============== Anomaly Alert Tests ==============

    def test_generate_anomaly_alert(self, service):
        """Test basic anomaly alert generation."""
        result = service.generate_anomaly_alert(product_id=1, anomaly_score=0.8)

        assert result["type"] == "anomaly_alert"
        assert result["product_id"] == 1
        assert result["anomaly_score"] == 0.8

    def test_anomaly_alert_structure(self, service):
        """Test anomaly alert has required fields."""
        result = service.generate_anomaly_alert(1, 0.8)

        required_fields = {
            "type",
            "product_id",
            "anomaly_score",
            "severity",
            "action",
            "message",
            "timestamp",
        }
        assert required_fields.issubset(result.keys())

    def test_anomaly_alert_action(self, service):
        """Test that anomaly alert action is consistent."""
        result = service.generate_anomaly_alert(1, 0.8)

        assert result["action"] == "INVESTIGATE"

    def test_anomaly_severity_levels(self, service):
        """Test anomaly severity levels."""
        # Critical: score > 0.8
        critical = service.generate_anomaly_alert(1, 0.9)
        assert critical["severity"] == "CRITICAL"

        # High: score > 0.6
        high = service.generate_anomaly_alert(1, 0.7)
        assert high["severity"] == "HIGH"

        # Medium: score > 0.4
        medium = service.generate_anomaly_alert(1, 0.5)
        assert medium["severity"] == "MEDIUM"

        # Low: score <= 0.4
        low = service.generate_anomaly_alert(1, 0.2)
        assert low["severity"] == "LOW"

    # ============== Bulk Recommendations Tests ==============

    def test_generate_bulk_recommendations(self, service):
        """Test bulk recommendation generation."""
        predictions = {
            "forecasts": [
                {
                    "product_id": 1,
                    "current_stock": 50,
                    "forecast": 100,
                }
            ],
            "anomalies": [
                {
                    "product_id": 1,
                    "anomaly_detected": True,
                    "anomaly_score": 0.8,
                }
            ],
        }
        result = service.generate_bulk_recommendations(predictions)

        assert isinstance(result, list)
        assert len(result) > 0

    def test_bulk_recommendations_sorting(self, service):
        """Test that bulk recommendations are sorted by priority."""
        predictions = {
            "forecasts": [
                {"product_id": 1, "current_stock": 50, "forecast": 100},  # MEDIUM priority
                {"product_id": 2, "current_stock": 0, "forecast": 100},   # CRITICAL priority
                {"product_id": 3, "current_stock": 1000, "forecast": 100}, # LOW priority
            ]
        }
        result = service.generate_bulk_recommendations(predictions)

        if len(result) >= 2:
            # Critical should come before Medium
            critical_idx = next(
                (i for i, r in enumerate(result) if r.get("priority") == "CRITICAL"), None
            )
            medium_idx = next(
                (i for i, r in enumerate(result) if r.get("priority") == "MEDIUM"), None
            )
            if critical_idx is not None and medium_idx is not None:
                assert critical_idx < medium_idx

    def test_bulk_recommendations_empty(self, service):
        """Test bulk recommendations with no predictions."""
        result = service.generate_bulk_recommendations({})

        assert isinstance(result, list)

    def test_bulk_recommendations_only_forecasts(self, service):
        """Test bulk recommendations with only forecasts."""
        predictions = {
            "forecasts": [
                {"product_id": 1, "current_stock": 50, "forecast": 100},
            ]
        }
        result = service.generate_bulk_recommendations(predictions)

        assert len(result) > 0
        assert all(r["type"] == "reorder" for r in result)

    def test_bulk_recommendations_only_anomalies(self, service):
        """Test bulk recommendations with only anomalies."""
        predictions = {
            "anomalies": [
                {
                    "product_id": 1,
                    "anomaly_detected": True,
                    "anomaly_score": 0.8,
                }
            ]
        }
        result = service.generate_bulk_recommendations(predictions)

        assert len(result) > 0
        assert any(r["type"] == "anomaly_alert" for r in result)

    # ============== Helper Function Tests ==============

    def test_calculate_priority(self, service):
        """Test priority calculation helper."""
        # Critical
        assert service._calculate_priority(0, 100) == "CRITICAL"

        # High
        assert service._calculate_priority(30, 100) == "HIGH"

        # Medium
        assert service._calculate_priority(60, 100) == "MEDIUM"

        # Low
        assert service._calculate_priority(200, 100) == "LOW"

    def test_calculate_severity(self, service):
        """Test severity calculation helper."""
        # Critical
        assert service._calculate_severity(0.9) == "CRITICAL"

        # High
        assert service._calculate_severity(0.7) == "HIGH"

        # Medium
        assert service._calculate_severity(0.5) == "MEDIUM"

        # Low
        assert service._calculate_severity(0.2) == "LOW"

    # ============== Timestamp Tests ==============

    def test_recommendation_timestamp_format(self, service):
        """Test that recommendations include ISO timestamp."""
        result = service.generate_reorder_recommendation(1, 50, 100, 7)

        assert "timestamp" in result
        assert "T" in result["timestamp"] or "-" in result["timestamp"]

    def test_all_recommendations_have_timestamp(self, service):
        """Test that all recommendation types include timestamp."""
        reorder = service.generate_reorder_recommendation(1, 50, 100, 7)
        supplier = service.generate_supplier_recommendation({1: 70, 2: 85}, 1)
        anomaly = service.generate_anomaly_alert(1, 0.8)

        assert all(rec["timestamp"] for rec in [reorder, supplier, anomaly])

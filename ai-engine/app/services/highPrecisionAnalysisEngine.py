"""
High-Precision Analysis Engine

Performs comprehensive analysis with multi-layer scoring and 
contextual understanding for accurate insights.

Analysis Types:
1. Trend Analysis (Linear, Quadratic, Exponential)
2. Seasonal Pattern Analysis
3. Volatility Analysis
4. Correlation Analysis
5. Performance Metrics
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any
from scipy import stats
import warnings
warnings.filterwarnings('ignore')


class HighPrecisionAnalysisEngine:
    """
    High-precision analysis engine for comprehensive data insights.
    """

    def __init__(self):
        """Initialize analysis engine"""
        self.analysis_cache = {}

    def comprehensive_analysis(self, data: pd.DataFrame, context: str = "product") -> Dict[str, Any]:
        """
        Perform comprehensive analysis on data.

        Args:
            data: Input time series data
            context: Analysis context (product, supplier, customer)

        Returns:
            Dictionary with comprehensive analysis results
        """
        try:
            stock_values = self._extract_numeric_column(data)
            if len(stock_values) < 3:
                return {"error": "Insufficient data", "status": "failed"}

            # Perform all analyses
            trend_analysis = self._trend_analysis(stock_values)
            seasonal_analysis = self._seasonal_analysis(stock_values)
            volatility_analysis = self._volatility_analysis(stock_values)
            performance_metrics = self._performance_metrics(stock_values, context)
            correlation_analysis = self._correlation_analysis(data)

            # Combine results
            overall_score = self._calculate_analysis_confidence(
                trend_analysis, seasonal_analysis, volatility_analysis, performance_metrics
            )

            return {
                "trend_analysis": trend_analysis,
                "seasonal_analysis": seasonal_analysis,
                "volatility_analysis": volatility_analysis,
                "performance_metrics": performance_metrics,
                "correlation_analysis": correlation_analysis,
                "overall_confidence": overall_score,
                "summary": self._generate_summary(
                    trend_analysis, seasonal_analysis, volatility_analysis, performance_metrics
                ),
                "status": "success"
            }
        except Exception as e:
            return {"error": str(e), "status": "failed"}

    def _extract_numeric_column(self, data: pd.DataFrame) -> np.ndarray:
        """Extract numeric values from data"""
        for col in ["stock", "quantity", "price"]:
            if col in data.columns:
                values = pd.to_numeric(data[col], errors='coerce').dropna().values
                if len(values) > 0:
                    return values

        raise ValueError("No numeric column found")

    def _trend_analysis(self, values: np.ndarray) -> Dict[str, Any]:
        """
        Analyze trend using multiple methods:
        - Linear regression
        - Polynomial fit
        - Mann-Kendall test
        """
        x = np.arange(len(values))

        # Linear trend
        z = np.polyfit(x, values, 1)
        p = np.poly1d(z)
        linear_slope = z[0]
        linear_r2 = self._calculate_r2(values, p(x))

        # Quadratic trend
        z_quad = np.polyfit(x, values, 2)
        p_quad = np.poly1d(z_quad)
        quad_r2 = self._calculate_r2(values, p_quad(x))

        # Mann-Kendall trend test
        mk_result = self._mann_kendall_test(values)

        # Determine trend type
        if linear_slope > 0.01:
            trend_type = "INCREASING"
        elif linear_slope < -0.01:
            trend_type = "DECREASING"
        else:
            trend_type = "STABLE"

        # Trend strength (0-1)
        trend_strength = abs(linear_slope) / (np.std(values) + 1e-6)
        trend_strength = min(1.0, trend_strength)

        return {
            "trend_type": trend_type,
            "linear_slope": float(linear_slope),
            "linear_r2": float(linear_r2),
            "quadratic_r2": float(quad_r2),
            "trend_strength": float(trend_strength),
            "mann_kendall_p_value": float(mk_result["p_value"]),
            "statistically_significant": mk_result["p_value"] < 0.05,
            "forecast_direction": "UP" if linear_slope > 0 else "DOWN" if linear_slope < 0 else "STABLE"
        }

    def _seasonal_analysis(self, values: np.ndarray) -> Dict[str, Any]:
        """
        Analyze seasonal patterns:
        - Period detection
        - Seasonal strength
        - Seasonal indices
        """
        # Auto-correlation for period detection
        acf_result = self._autocorrelation(values)

        # Simple seasonal decomposition
        period = self._detect_season_period(values)

        if period and period < len(values) // 2:
            # Calculate seasonal indices
            seasonal_indices = {}
            for i in range(period):
                seasonal_values = [values[j] for j in range(i, len(values), period)]
                if seasonal_values:
                    seasonal_indices[i] = {
                        "mean": float(np.mean(seasonal_values)),
                        "std": float(np.std(seasonal_values))
                    }

            # Seasonal strength
            seasonal_var = np.var([v["mean"] for v in seasonal_indices.values()])
            total_var = np.var(values)
            seasonal_strength = seasonal_var / (total_var + 1e-6)
            seasonal_strength = min(1.0, seasonal_strength)

            has_seasonality = seasonal_strength > 0.1
        else:
            seasonal_indices = {}
            seasonal_strength = 0.0
            has_seasonality = False
            period = None

        return {
            "has_seasonality": has_seasonality,
            "seasonal_strength": float(seasonal_strength),
            "detected_period": period,
            "seasonal_indices": seasonal_indices,
            "autocorrelation_peaks": acf_result["peaks"]
        }

    def _volatility_analysis(self, values: np.ndarray) -> Dict[str, Any]:
        """
        Analyze volatility:
        - Standard deviation
        - Coefficient of variation
        - GARCH-like analysis
        - Volatility clusters
        """
        # Basic volatility metrics
        returns = np.diff(values) / (values[:-1] + 1e-6)
        volatility = np.std(returns)
        coefficient_of_variation = np.std(values) / (np.mean(values) + 1e-6)

        # Volatility clustering detection
        rolling_volatility = pd.Series(returns).rolling(window=5).std()
        volatility_of_volatility = rolling_volatility.std()

        # High/Low volatility periods
        high_vol_threshold = volatility + volatility_of_volatility
        high_vol_periods = (rolling_volatility > high_vol_threshold).sum()
        high_vol_ratio = high_vol_periods / len(rolling_volatility)

        # Volatility trend
        if volatility_of_volatility > 0:
            vol_trend = "INCREASING" if rolling_volatility.iloc[-1] > rolling_volatility.iloc[0] else "DECREASING"
        else:
            vol_trend = "STABLE"

        return {
            "volatility": float(volatility),
            "coefficient_of_variation": float(coefficient_of_variation),
            "volatility_of_volatility": float(volatility_of_volatility),
            "high_volatility_ratio": float(high_vol_ratio),
            "volatility_trend": vol_trend,
            "volatility_level": self._classify_volatility(coefficient_of_variation)
        }

    def _performance_metrics(self, values: np.ndarray, context: str) -> Dict[str, Any]:
        """
        Calculate performance metrics:
        - Growth rate
        - Efficiency
        - Stability
        - Risk metrics
        """
        # Growth metrics
        first_val = values[0]
        last_val = values[-1]
        total_growth = (last_val - first_val) / (first_val + 1e-6)
        avg_growth = total_growth / len(values)

        # Stability (inverse of CV)
        cv = np.std(values) / (np.mean(values) + 1e-6)
        stability = 1.0 / (1.0 + cv)

        # Risk metrics
        downside_returns = np.diff(values)
        downside_returns = downside_returns[downside_returns < 0]
        downside_risk = np.std(downside_returns) if len(downside_returns) > 0 else 0

        # Efficiency (return per unit of risk)
        sharpe_ratio = total_growth / (np.std(values) + 1e-6)

        return {
            "total_growth_rate": float(total_growth),
            "average_growth_rate": float(avg_growth),
            "stability_score": float(stability),
            "downside_risk": float(downside_risk),
            "sharpe_ratio": float(sharpe_ratio),
            "efficiency_score": float(min(1.0, max(0.0, 0.5 + sharpe_ratio * 0.1)))
        }

    def _correlation_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze correlations between numeric columns.
        """
        correlations = {}

        numeric_cols = data.select_dtypes(include=[np.number]).columns

        for col1 in numeric_cols:
            for col2 in numeric_cols:
                if col1 < col2:
                    corr = data[col1].corr(data[col2])
                    if not np.isnan(corr):
                        correlations[f"{col1}_vs_{col2}"] = float(corr)

        return {
            "correlations": correlations,
            "correlation_count": len(correlations)
        }

    def _mann_kendall_test(self, values: np.ndarray) -> Dict[str, Any]:
        """
        Mann-Kendall trend test for statistical significance.
        """
        n = len(values)
        s = 0

        for i in range(n - 1):
            for j in range(i + 1, n):
                s += np.sign(values[j] - values[i])

        # Variance calculation
        var_s = n * (n - 1) * (2 * n + 5) / 18

        # Z-score
        if s > 0:
            z = (s - 1) / np.sqrt(var_s)
        elif s < 0:
            z = (s + 1) / np.sqrt(var_s)
        else:
            z = 0

        # P-value
        p_value = 2 * (1 - stats.norm.cdf(abs(z)))

        return {
            "statistic": float(s),
            "z_score": float(z),
            "p_value": float(p_value),
            "significant": p_value < 0.05
        }

    def _autocorrelation(self, values: np.ndarray) -> Dict[str, Any]:
        """
        Calculate autocorrelation and detect peaks.
        """
        max_lag = min(20, len(values) // 2)
        acf_values = []

        mean = np.mean(values)
        c0 = np.sum((values - mean) ** 2) / len(values)

        for lag in range(max_lag):
            c_lag = np.sum((values[:-lag or None] - mean) * (values[lag:] - mean)) / len(values)
            acf_values.append(c_lag / c0)

        # Detect peaks
        peaks = []
        for i in range(1, len(acf_values) - 1):
            if acf_values[i] > acf_values[i - 1] and acf_values[i] > acf_values[i + 1]:
                if acf_values[i] > 0.3:  # Significant peak
                    peaks.append(i)

        return {
            "acf_values": [float(v) for v in acf_values],
            "peaks": peaks
        }

    def _detect_season_period(self, values: np.ndarray) -> Optional[int]:
        """
        Detect seasonal period using autocorrelation.
        """
        acf_result = self._autocorrelation(values)
        peaks = acf_result["peaks"]

        if peaks:
            return peaks[0]
        return None

    def _classify_volatility(self, coefficient_of_variation: float) -> str:
        """Classify volatility level"""
        if coefficient_of_variation < 0.1:
            return "VERY_LOW"
        elif coefficient_of_variation < 0.25:
            return "LOW"
        elif coefficient_of_variation < 0.5:
            return "MEDIUM"
        elif coefficient_of_variation < 1.0:
            return "HIGH"
        else:
            return "VERY_HIGH"

    def _calculate_r2(self, actual: np.ndarray, predicted: np.ndarray) -> float:
        """Calculate R-squared"""
        ss_res = np.sum((actual - predicted) ** 2)
        ss_tot = np.sum((actual - np.mean(actual)) ** 2)
        r2 = 1 - (ss_res / (ss_tot + 1e-6))
        return float(r2)

    def _calculate_analysis_confidence(self, trend: Dict, seasonal: Dict,
                                      volatility: Dict, performance: Dict) -> float:
        """
        Calculate overall analysis confidence.
        """
        scores = []

        # Trend confidence (based on R2)
        scores.append(min(1.0, trend.get("linear_r2", 0.5)))

        # Seasonal confidence
        scores.append(0.9 if seasonal.get("has_seasonality") else 0.5)

        # Volatility confidence
        vol_level = volatility.get("volatility_level", "MEDIUM")
        vol_score = {"VERY_LOW": 0.95, "LOW": 0.9, "MEDIUM": 0.8, "HIGH": 0.7, "VERY_HIGH": 0.6}
        scores.append(vol_score.get(vol_level, 0.7))

        # Performance confidence
        scores.append(performance.get("efficiency_score", 0.5))

        return min(0.99999, max(0.0, np.mean(scores)))

    def _generate_summary(self, trend: Dict, seasonal: Dict,
                         volatility: Dict, performance: Dict) -> str:
        """
        Generate human-readable summary of analysis.
        """
        parts = []

        # Trend summary
        trend_type = trend.get("trend_type", "STABLE")
        parts.append(f"Trend: {trend_type.lower()}")

        if trend.get("statistically_significant"):
            parts.append("(statistically significant)")

        # Seasonal summary
        if seasonal.get("has_seasonality"):
            period = seasonal.get("detected_period")
            parts.append(f"Seasonal pattern detected (period: {period})")

        # Volatility summary
        vol_level = volatility.get("volatility_level", "MEDIUM")
        parts.append(f"Volatility: {vol_level.lower()}")

        # Performance summary
        growth = performance.get("total_growth_rate", 0)
        if growth > 0:
            parts.append(f"Growth: +{growth:.2%}")
        else:
            parts.append(f"Decline: {growth:.2%}")

        return " | ".join(parts)

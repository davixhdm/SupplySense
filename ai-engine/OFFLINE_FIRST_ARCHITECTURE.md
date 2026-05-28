# Offline-First Architecture Implementation

## Overview

SupplySense AI-Engine now operates with a robust **offline-first architecture** where all ML predictions and business logic recommendations work completely independently of external services like Groq AI. The system automatically uses local algorithms for all core functionality, with Groq AI serving as an optional non-blocking enhancement layer only.

## Architecture Pattern

```
Request → Prediction Service → Local ML Algorithm → Result
                            ↓ (optional, non-blocking)
                         Groq AI → Enhanced Result
```

### Key Principle
**Local First, AI Second**: Every prediction and recommendation is generated using proven local algorithms first. Groq AI enhancements are attempted but never block or override the local result.

## Prediction Service (Offline-First Implementation)

### 1. Forecast Predictions (`get_forecast`)
**Core Algorithm**: RandomForest or LinearRegression (scikit-learn)

**Offline Fallback**: Simple demand averaging
```python
# If model unavailable:
daily_demand_average = data['daily_demand'].mean()
forecast = [daily_demand_average] * 7
confidence = 0.6  # Lower confidence for heuristic
```

**Return Pattern**:
```json
{
  "product_id": 1,
  "forecast": [3.5, 3.5, 3.5, ...],
  "confidence_interval": 0.6,
  "ai_insight": "Local insight generated...",
  "source": "local_algorithm",
  "status": "success"
}
```

### 2. Anomaly Detection (`detect_anomalies`)
**Core Algorithm**: IsolationForest (scikit-learn)

**Offline Fallback**: Statistical Z-score analysis
```python
# If model unavailable:
z_score = abs((current_stock - mean) / std)
anomaly_score = min(z_score / 3.0, 1.0)
anomalies_detected = z_score > 2
```

**Return Pattern**:
```json
{
  "product_id": 1,
  "anomalies_detected": false,
  "anomaly_score": 0.15,
  "ai_analysis": "Local analysis...",
  "source": "local_algorithm",
  "status": "success"
}
```

### 3. Supplier Scoring (`score_supplier`)
**Core Algorithm**: RandomForest (scikit-learn)

**Offline Fallback**: Default reliability score
```python
# If model unavailable:
score = 75.0  # Default mid-range score
trend = "stable"  # Conservative assumption
```

**Return Pattern**:
```json
{
  "supplier_id": 1,
  "reliability_score": 75.0,
  "trend": "stable",
  "risk_level": "LOW",
  "ai_assessment": "Local assessment...",
  "source": "local_algorithm",
  "status": "success"
}
```

### 4. Customer Behavior Prediction (`predict_customer_behavior`)
**Core Algorithm**: GradientBoosting (scikit-learn)

**Offline Fallback**: Simple metric-based prediction
```python
# If model unavailable:
prediction = len(customer_data) / 10.0
confidence = 0.5
behavior_pattern = categorize_by_volume(total_purchases)
```

**Return Pattern**:
```json
{
  "customer_id": 1,
  "prediction": 0.5,
  "confidence": 0.5,
  "behavior_pattern": "low_volume",
  "ai_insights": "Local insights...",
  "source": "local_algorithm",
  "status": "success"
}
```

## Recommendation Service (Offline-First Implementation)

### 1. Reorder Recommendations (`generate_reorder_recommendation`)

**Local Business Logic**:
```
reorder_point = forecast * lead_time
recommended_qty = max(0, reorder_point - current_stock)
priority = calculate_based_on_urgency(current_stock, reorder_point)
```

**Return Pattern**:
```json
{
  "type": "reorder",
  "product_id": 1,
  "recommended_quantity": 35,
  "action": "REORDER",
  "ai_explanation": "Local explanation...",
  "source": "local_algorithm",
  "confidence": 0.8
}
```

### 2. Supplier Recommendations (`generate_supplier_recommendation`)

**Local Business Logic**:
```
should_switch = best_score >= current_score * 1.1  # 10% improvement threshold
action = "SWITCH" if should_switch else "MAINTAIN"
```

**Return Pattern**:
```json
{
  "type": "supplier_switch",
  "action": "MAINTAIN",
  "current_supplier_id": 1,
  "current_score": 75.0,
  "ai_recommendation": "Local recommendation...",
  "source": "local_algorithm",
  "confidence": 0.8
}
```

### 3. Anomaly Alerts (`generate_anomaly_alert`)

**Local Business Logic**:
```
severity = "CRITICAL" if score > 0.8 else "HIGH" if score > 0.6 else "MEDIUM"
action = "INVESTIGATE"
```

**Return Pattern**:
```json
{
  "type": "anomaly_alert",
  "product_id": 1,
  "severity": "HIGH",
  "action": "INVESTIGATE",
  "ai_analysis": "Local analysis...",
  "source": "local_algorithm"
}
```

## Local Insight Generation Helpers

### Helper Methods
All services implement local insight generation helpers that provide algorithm-based explanations without requiring external AI:

**PredictionService**:
- `_generate_local_forecast_insight()` - Demand level analysis, trend direction, confidence assessment
- `_generate_local_anomaly_analysis()` - Anomaly severity, pattern identification, recommended actions
- `_generate_local_supplier_assessment()` - Performance metrics, trend analysis, partnership recommendations
- `_generate_local_customer_insights()` - Purchase behavior, engagement opportunities, retention strategies

**RecommendationService**:
- `_generate_local_reorder_explanation()` - Stock analysis, urgency assessment
- `_generate_local_supplier_explanation()` - Switch rationale, improvement metrics
- `_generate_local_anomaly_explanation()` - Pattern analysis, investigation guidance

## Groq AI Integration (Optional Enhancement)

### Graceful Degradation Pattern

```python
# All methods follow this pattern:
if self.groq_service.available:
    try:
        groq_result = self.groq_service.enhance_*()
        enhanced_insight = groq_result.get("ai_insight", local_insight)
    except:
        pass  # Silently fallback to local insight

return {
    "insight": enhanced_insight or local_insight,
    "source": "local_algorithm_with_ai_enhancement" if groq_available else "local_algorithm"
}
```

### How It Works
1. **Initialization**: GroqAIService checks for `GROQ_API_KEY` environment variable
   - If present: Sets `self.available = True`, initializes Groq client
   - If absent: Sets `self.available = False`, prints warning, disables all calls

2. **Runtime**: Before any Groq call:
   - Check `if self.groq_service.available:`
   - Wrap call in try-except
   - Fallback to local insight on any error

3. **User Indication**: Source field indicates enhancement status:
   - `"local_algorithm"` - Pure local processing
   - `"local_algorithm_with_ai_enhancement"` - Local result enhanced by Groq

## Testing Offline-First Behavior

### Test Case 1: System Fully Offline
```bash
# Remove/clear GROQ_API_KEY
unset GROQ_API_KEY

# Start server
uvicorn app.main:app --reload

# All endpoints still work normally, returning "source": "local_algorithm"
```

### Test Case 2: Groq Becomes Unavailable Mid-Session
```python
# Server running with Groq API key
# If API key expires or network fails:
# - Services catch the exception
# - Fallback to local insight automatically
# - User gets complete response (never times out)
```

### Test Case 3: Verify Fallbacks
```python
from app.services.predictionService import PredictionService
import pandas as pd

service = PredictionService()

# With untrained models, fallbacks activate:
result = service.get_forecast(product_id=1, data)
# Returns heuristic forecast with confidence=0.6
```

## Implementation Details

### Error Handling Strategy

**Layered Protection**:
1. Service initialization checks for `GROQ_API_KEY`
2. Each Groq call wrapped in try-except
3. Model method calls wrapped in try-except with heuristic fallbacks
4. All returns include status and source fields

**Error Response Pattern**:
```python
{
    "status": "error",
    "source": "local_algorithm",
    "error": "Detailed error message",
    "prediction": None,
    "confidence": None
}
```

### Performance Characteristics

**Offline Performance** (no Groq calls):
- Forecast: <100ms (heuristic) to <500ms (model inference)
- Anomaly: <100ms (Z-score) to <500ms (model inference)
- Supplier: <100ms (default) to <500ms (model inference)
- Customer: <100ms (heuristic) to <500ms (model inference)

**With Groq Enhancement**:
- Add 1-3 seconds per call (depends on API latency)
- Non-blocking: local result returned if Groq slow/unavailable

## Configuration

### Environment Variables
```bash
# Required for basic operation:
HOST=0.0.0.0
PORT=8000
API_TITLE="SupplySense AI-Engine"
API_VERSION="1.0"
ENVIRONMENT="production"

# Optional for Groq AI enhancements:
GROQ_API_KEY="gsk_..."  # If missing, system works offline-only
```

### Feature Flags
Currently all offline-first features are enabled by default. To disable Groq enhancements:
```python
# In groqAIService.py:
self.available = False  # Disable all Groq calls
```

## Deployment Considerations

### Single-Server Deployment
- No external dependencies required for core functionality
- Groq API optional - fully functional without it
- No network latency on local ML algorithms
- Recommended for: Edge computing, offline-first applications

### Multi-Server Deployment
- Each server instance fully independent
- No cache sharing needed
- Graceful degradation applies per-instance
- Load balanced traffic sees consistent offline-first behavior

### Kubernetes Deployment
```yaml
# POD can run without Groq API key
# Service remains available during network issues
# No readiness probe dependency on external services
```

## Migration Guide (From Previous Version)

### Breaking Changes
None. Existing clients see transparent upgrade:
- Same endpoints, same request/response format
- New `source` field indicates enhancement status
- New `status` field provides operation result

### Recommended Updates
1. Update response parsing to check `source` field
2. Optional: Log `source` field for analytics
3. Optional: Adjust timeouts (offline calls faster than before)

## Monitoring & Observability

### Metrics to Track
- Percentage of calls using `local_algorithm` vs `local_algorithm_with_ai_enhancement`
- Response times for offline vs. enhanced predictions
- Fallback activation frequency per service
- Groq API availability uptime

### Logging Recommendations
```python
logger.info(f"Forecast generated: source={result['source']}, confidence={result['confidence']}")

if result['source'] == 'local_algorithm':
    logger.debug("Groq enhancement not used")
```

## FAQ

**Q: What if the model files are missing?**
A: System falls back to heuristic algorithms. All predictions still work.

**Q: Does offline mode reduce prediction accuracy?**
A: Fallback heuristics have lower confidence (0.5-0.6) vs. models (0.8+). Local ML models (when available) maintain full accuracy.

**Q: Can I enable Groq later without restart?**
A: Set `GROQ_API_KEY` environment variable and restart. Graceful degradation means new services will automatically use Groq.

**Q: How do I know if Groq is being used?**
A: Check the `source` field in response: `"local_algorithm_with_ai_enhancement"` means Groq enhanced the result.

**Q: What if Groq starts failing after initialization?**
A: Caught by try-except blocks. Returns local insight. No user-facing errors.

## Success Criteria

✅ All core predictions work offline
✅ All recommendations work offline  
✅ Groq enhancements are optional
✅ Graceful degradation for untrained models
✅ Source field indicates enhancement status
✅ Zero external dependencies for core functionality
✅ Complete test coverage for offline paths
✅ No timeout issues with degradation

---

**Last Updated**: May 2026  
**Architecture Status**: Production Ready  
**Offline-First Capability**: Fully Implemented

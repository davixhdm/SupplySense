# Testing Guide for SupplySense AI Engine

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run All Tests
```bash
pytest
```

### 3. Run Specific Test Categories

**Utility Tests:**
```bash
pytest tests/unit/utils/
```

**Model Tests:**
```bash
pytest tests/unit/models/
```

**Service Tests:**
```bash
pytest tests/unit/services/
```

## Test Structure

```
tests/
├── conftest.py                 # Shared fixtures and configuration
├── unit/
│   ├── utils/
│   │   ├── test_dataCleaner.py        (20 tests)
│   │   └── test_dataNormalizer.py     (19 tests)
│   ├── models/
│   │   ├── test_forecastingModel.py   (15 tests)
│   │   ├── test_anomalyModel.py       (18 tests)
│   │   ├── test_supplierScoringModel.py (18 tests)
│   │   └── test_customerPredictionModel.py (17 tests)
│   └── services/
│       ├── test_dataProcessingService.py    (26 tests)
│       ├── test_predictionService.py        (19 tests)
│       └── test_recommendationService.py    (23 tests)
```

## Test Coverage

**Total Tests: 195+**

### Utilities (39 tests)
- ✅ Data cleaning (duplicates, missing values, outliers)
- ✅ Data normalization (standardization, min-max, log)
- ✅ Type conversion
- ✅ Schema validation

### Models (68 tests)
- ✅ Forecasting Model (training, prediction, evaluation)
- ✅ Anomaly Detection (anomaly scoring, detection)
- ✅ Supplier Scoring (supplier evaluation, feature importance)
- ✅ Customer Prediction (demand forecasting, segmentation, churn risk)

### Services (88 tests)
- ✅ Data Processing (validation, cleaning, feature engineering)
- ✅ Prediction Service (model coordination, batch predictions)
- ✅ Recommendation Service (reorder, supplier switching, alerts)

## Advanced Test Options

### Run Tests with Verbose Output
```bash
pytest -vv
```

### Run Specific Test File
```bash
pytest tests/unit/utils/test_dataCleaner.py
```

### Run Specific Test Function
```bash
pytest tests/unit/utils/test_dataCleaner.py::TestDataCleaner::test_remove_duplicates_basic
```

### Run Tests Matching Pattern
```bash
pytest -k "forecast"
```

### Run Tests by Marker
```bash
pytest -m unit
```

### Show Print Statements
```bash
pytest -s
```

### Run with Coverage Report
```bash
pytest --cov=app --cov-report=html
# View coverage at: htmlcov/index.html
```

### Run Tests in Parallel (requires pytest-xdist)
```bash
pip install pytest-xdist
pytest -n auto
```

### Stop on First Failure
```bash
pytest -x
```

### Run Last Failed Tests
```bash
pytest --lf
```

## Test Fixtures Available

### Data Fixtures (in conftest.py)
- `sample_inventory_data` - 10 records of inventory data
- `sample_dataframe` - Processed DataFrame with features
- `multi_product_dataframe` - Multiple products
- `invalid_data` - Schema validation test data
- `data_with_missing_values` - 5 records with NaN values
- `data_with_duplicates` - Records with duplicates
- `data_with_outliers` - 10 records with outlier (1000)
- `training_features` - 100 feature samples
- `training_target` - 100 target values
- `supplier_performance_data` - 20 records, 2 suppliers
- `customer_transaction_data` - 15 customer transactions

## Example Test Run

```bash
# Run all tests
pytest

# Expected output:
# =================== test session starts ====================
# platform win32 -- Python 3.11.0, pytest-7.4.3
# collected 195 items
#
# tests/unit/utils/test_dataCleaner.py ............... [ 10%]
# tests/unit/utils/test_dataNormalizer.py ........... [ 20%]
# tests/unit/models/test_forecastingModel.py ....... [ 28%]
# tests/unit/models/test_anomalyModel.py ........... [ 37%]
# tests/unit/models/test_supplierScoringModel.py .. [ 47%]
# tests/unit/models/test_customerPredictionModel.py [ 57%]
# tests/unit/services/test_dataProcessingService.py  [ 71%]
# tests/unit/services/test_predictionService.py .... [ 82%]
# tests/unit/services/test_recommendationService.py  [ 95%]
#
# =================== 195 passed in 12.34s ===================
```

## Writing New Tests

1. **Create test file** in appropriate `tests/unit/` subdirectory
2. **Name it** `test_*.py`
3. **Create test class** `Test*`
4. **Create test methods** `test_*`
5. **Use fixtures** from `conftest.py`

Example:
```python
import pytest
from app.utils.dataCleaner import DataCleaner

class TestDataCleaner:
    @pytest.fixture
    def cleaner(self):
        return DataCleaner()
    
    def test_example(self, cleaner, sample_dataframe):
        result = cleaner.remove_duplicates(sample_dataframe)
        assert len(result) <= len(sample_dataframe)
```

## Troubleshooting

### Import Errors
- Make sure you're in the `ai-engine` directory
- Verify virtual environment is activated: `.\venv\Scripts\Activate`

### Missing Dependencies
```bash
pip install -r requirements.txt
```

### Tests Not Found
```bash
# Verify test discovery
pytest --collect-only
```

### Fixture Errors
- Fixtures are defined in `tests/conftest.py`
- Make sure the file exists and has no syntax errors

## CI/CD Integration

For GitHub Actions, add to `.github/workflows/test.yml`:
```yaml
- name: Run tests
  run: pytest --cov=app
```

## Performance Tips

- Use `-x` flag to stop on first failure
- Use `-k` to run subset of tests
- Use `--lf` to rerun last failed tests
- Use `pytest-watch` for auto-rerun on file changes: `ptw`

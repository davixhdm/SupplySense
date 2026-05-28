# AI Engine Setup & Groq Integration Guide

## Overview

Your SupplySense AI Engine is now fully integrated with **Groq AI** for enhanced predictions, anomaly analysis, and intelligent recommendations. This document outlines all the improvements made and how to get started.

## ✨ What's New

### 1. **Groq AI Integration**
- Added `groqAIService.py` with methods for:
  - **Enhanced Forecasting Insights** - AI analysis of demand patterns
  - **Anomaly Analysis** - Contextual understanding of inventory anomalies
  - **Supplier Risk Assessment** - AI-powered supplier reliability evaluation
  - **Customer Behavior Insights** - Prediction of customer trends
  - **Smart Recommendations** - AI-generated business recommendations with explanations

### 2. **Updated Services**
- **PredictionService** now:
  - Loads and uses all 4 ML models (Forecasting, Anomaly, Supplier Scoring, Customer Prediction)
  - Integrates Groq AI for enhanced insights on each prediction
  - Provides confidence scores and AI explanations

- **RecommendationService** now:
  - Uses Groq AI to generate detailed, actionable recommendations
  - Provides AI explanations for all recommendations
  - Includes confidence scores

### 3. **Fully Integrated Routes**
All API routes now connect to services:
- **`/api/forecast`** - Demand predictions with AI insights
- **`/api/anomaly`** - Anomaly detection with AI analysis
- **`/api/suppliers`** - Supplier scoring with AI risk assessment
- **`/api/customers`** - Customer behavior prediction with AI insights
- **`/api/recommendations`** - Actionable recommendations with AI explanations

### 4. **Added Dependencies**
```
groq>=0.4.0
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
cd ai-engine
pip install -r requirements.txt
```

### Step 2: Set Up Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

### Step 3: Run the AI Engine

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at `http://localhost:8000`

### Step 4: Explore API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation with Swagger UI.

## 📚 API Endpoints Overview

### Forecasting
```
POST /api/forecast/
```
**Purpose**: Get demand forecasts with AI insights
**Request**:
```json
{
  "data": [
    {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 2}
  ],
  "product_id": 1,
  "periods": 7
}
```

### Anomaly Detection
```
POST /api/anomaly/
```
**Purpose**: Detect inventory anomalies with AI analysis

### Supplier Scoring
```
POST /api/suppliers/score
```
**Purpose**: Score suppliers with AI risk assessment

### Customer Prediction
```
POST /api/customers/predict
```
**Purpose**: Predict customer behavior with AI insights

### Recommendations
```
POST /api/recommendations/
```
**Purpose**: Generate actionable recommendations with AI explanations

## 🤖 How Groq AI Enhances Predictions

1. **Forecast Enhancement**: 
   - Analyzes demand patterns
   - Provides business context and risk assessment
   - Suggests action items

2. **Anomaly Analysis**:
   - Identifies potential root causes
   - Assesses impact
   - Recommends investigation steps

3. **Supplier Assessment**:
   - Evaluates performance metrics
   - Identifies risks
   - Suggests mitigation strategies

4. **Customer Insights**:
   - Predicts behavior trends
   - Segments customers intelligently
   - Recommends engagement strategies

5. **Smart Recommendations**:
   - Provides detailed action plans
   - Includes expected impact
   - Prioritizes urgency

## 📊 Data Processing Pipeline

All data flows through:
```
Raw Data → DataProcessingService → ML Models → Groq AI Enhancement → Recommendations
```

**DataProcessingService handles**:
- Schema validation (date, stock, product_id, supplier_id required)
- Type conversion & sorting
- Duplicate removal & missing value handling
- Feature engineering (rolling means, daily changes, etc.)
- Min-Max normalization

## 🔧 Project Structure

```
ai-engine/
├── app/
│   ├── main.py                 # FastAPI entry point (UPDATED)
│   ├── models/
│   │   ├── forecastingModel.py
│   │   ├── anomalyModel.py
│   │   ├── supplierScoringModel.py
│   │   └── customerPredictionModel.py
│   ├── services/
│   │   ├── dataProcessingService.py
│   │   ├── predictionService.py        # UPDATED with model integration
│   │   ├── recommendationService.py    # UPDATED with Groq integration
│   │   └── groqAIService.py           # NEW - Groq AI integration
│   └── routes/
│       ├── forecastRoutes.py           # UPDATED with service integration
│       ├── anomalyRoutes.py            # UPDATED with service integration
│       ├── supplierRoutes.py           # UPDATED with service integration
│       ├── customerRoutes.py           # UPDATED with service integration
│       └── recommendationRoutes.py     # UPDATED with Groq integration
├── requirements.txt    # UPDATED with Groq dependency
├── .env.example        # NEW - Environment template
└── tests/
```

## 🧪 Testing the AI Engine

### Test Forecast Endpoint
```bash
curl -X POST "http://localhost:8000/api/forecast/" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 2},
      {"date": "2024-01-02", "stock": 95, "product_id": 1, "supplier_id": 2},
      {"date": "2024-01-03", "stock": 90, "product_id": 1, "supplier_id": 2}
    ],
    "product_id": 1,
    "periods": 7
  }'
```

### Test Anomaly Detection
```bash
curl -X POST "http://localhost:8000/api/anomaly/" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"date": "2024-01-01", "stock": 100, "product_id": 1, "supplier_id": 2},
      {"date": "2024-01-02", "stock": 5, "product_id": 1, "supplier_id": 2}
    ],
    "product_id": 1
  }'
```

## 📈 Response Format

All responses include:
- **Prediction Data**: Raw ML model outputs
- **AI Insights**: Groq AI analysis and recommendations
- **Confidence Scores**: Reliability of predictions
- **Status**: Operation status (success/error)

Example:
```json
{
  "product_id": 1,
  "forecast": [90, 85, 80, 75, 70, 65, 60],
  "confidence_interval": 10.5,
  "ai_insight": "Demand shows a declining trend. Consider reducing orders or promoting the product.",
  "confidence": 0.85,
  "status": "success"
}
```

## 🔐 Security Considerations

1. **API Key**: Keep `GROQ_API_KEY` secure in environment variables
2. **CORS**: Update `allow_origins` in production (currently allows all: `["*"]`)
3. **Error Handling**: All endpoints include proper error handling
4. **Input Validation**: All inputs validated via Pydantic schemas

## 📝 Next Steps

1. **Database Integration**: Add persistence for predictions and recommendations
2. **Model Serialization**: Save/load trained models for production
3. **Caching**: Implement Redis caching for frequent queries
4. **Monitoring**: Add logging and monitoring for production deployment
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Authentication**: Add API key authentication for production

## 🚨 Troubleshooting

### Groq API Key Error
- Verify `GROQ_API_KEY` is set in `.env`
- Check API key validity on Groq dashboard

### Model Loading Error
- Ensure all ML model files exist in `app/models/`
- Check that model pickle files are in correct format

### Data Processing Error
- Verify input data has required columns: date, stock, product_id, supplier_id
- Check data types match expected schema

## 📞 Support

For issues:
1. Check `.env` configuration
2. Verify all dependencies are installed
3. Review error logs in terminal output
4. Check API documentation at `/docs` endpoint

## 🎯 Success Indicators

✅ All API endpoints responding with Groq AI insights
✅ Confidence scores included in predictions
✅ Recommendations ranked by priority
✅ Error handling working properly
✅ Database/cache integration ready for next phase

---

**Version**: 1.0.0 with Groq AI Integration
**Last Updated**: May 2026

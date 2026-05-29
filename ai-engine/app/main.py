from fastapi import FastAPI, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes import forecastRoutes, anomalyRoutes, supplierRoutes, customerRoutes, recommendationRoutes, insightsRoutes, debugRoutes

app = FastAPI(
    title=os.getenv("API_TITLE", "SupplySense AI Engine"),
    version=os.getenv("API_VERSION", "1.0.0"),
    description="AI-Powered Supply Chain Analytics Engine",
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

async def verify_api_key(x_api_key: str = Header(None)):
    expected_key = os.getenv("AI_ENGINE_API_KEY", "")
    if not expected_key: return True
    if x_api_key != expected_key: raise HTTPException(status_code=403, detail="Invalid API key")
    return True

@app.get("/api/health")
async def api_health(): return {"status": "healthy", "service": "SupplySense AI Engine", "version": "1.0.0"}

@app.get("/health")
async def health(): return {"status": "healthy", "service": "SupplySense AI Engine", "version": "1.0.0"}

@app.get("/")
async def root(): return {"message": "SupplySense AI Engine", "docs": "/docs"}

app.include_router(forecastRoutes.router, prefix="/api/forecast", tags=["Forecasting"], dependencies=[Depends(verify_api_key)])
app.include_router(anomalyRoutes.router, prefix="/api/anomaly", tags=["Anomaly Detection"], dependencies=[Depends(verify_api_key)])
app.include_router(supplierRoutes.router, prefix="/api/supplier", tags=["Supplier Scoring"], dependencies=[Depends(verify_api_key)])
app.include_router(customerRoutes.router, prefix="/api/customer", tags=["Customer Prediction"], dependencies=[Depends(verify_api_key)])
app.include_router(recommendationRoutes.router, prefix="/api/recommendations", tags=["Recommendations"], dependencies=[Depends(verify_api_key)])
app.include_router(insightsRoutes.router, prefix="/api/insights", tags=["Insights"], dependencies=[Depends(verify_api_key)])
app.include_router(debugRoutes.router, prefix="/debug", tags=["Debug"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", 8000)))
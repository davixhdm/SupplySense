"""
FastAPI Entry Point for SupplySense AI Engine

This is the main application file that sets up the FastAPI server
and registers all routes for the supply chain analytics system.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title=os.getenv("API_TITLE", "SupplySense AI Engine"),
    version=os.getenv("API_VERSION", "1.0.0"),
    description="AI-Powered Supply Chain Analytics Engine",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for the AI engine"""
    return {
        "status": "healthy",
        "service": "SupplySense AI Engine",
        "version": os.getenv("API_VERSION", "1.0.0"),
    }


# Import and include route modules
from app.routes import (
    forecastRoutes,
    anomalyRoutes,
    supplierRoutes,
    customerRoutes,
    recommendationRoutes,
    insightRoutes,
)

# Include routers
app.include_router(forecastRoutes.router, prefix="/api/forecast", tags=["Forecasting"])
app.include_router(anomalyRoutes.router, prefix="/api/anomaly", tags=["Anomaly Detection"])
app.include_router(supplierRoutes.router, prefix="/api/suppliers", tags=["Supplier Scoring"])
app.include_router(customerRoutes.router, prefix="/api/customers", tags=["Customer Prediction"])
app.include_router(recommendationRoutes.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(insightRoutes.router, prefix="/api/insights", tags=["Insights"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to SupplySense AI Engine",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
    )

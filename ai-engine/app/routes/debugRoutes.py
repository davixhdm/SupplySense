"""
Debug endpoints for troubleshooting Groq and AI Engine issues
"""

from fastapi import APIRouter
from typing import Dict, Any
from app.services.detailedResponseGenerator import DetailedResponseGenerator
from app.services.groqAIService import GroqAIService
import os

router = APIRouter()
response_generator = DetailedResponseGenerator()
groq_service = GroqAIService()

@router.get("/groq-status")
async def check_groq_status() -> Dict[str, Any]:
    """Check if Groq is properly initialized and working"""
    return {
        "groq_api_key_set": bool(os.getenv("GROQ_API_KEY")),
        "groq_available": response_generator.groq_available,
        "groq_client_initialized": response_generator.groq_client is not None,
        "groq_model": response_generator.model,
        "groq_service_available": groq_service.available,
        "groq_service_model": groq_service.model
    }

@router.post("/test-groq")
async def test_groq_connection(prompt: str = "What is supply chain management?") -> Dict[str, Any]:
    """Test Groq API connection with a simple prompt"""
    try:
        if not response_generator.groq_available or not response_generator.groq_client:
            return {
                "success": False,
                "error": "Groq client not initialized",
                "groq_available": response_generator.groq_available,
                "groq_client": response_generator.groq_client is not None
            }
        
        # Make a simple test call
        response = response_generator.groq_client.chat.completions.create(
            model=response_generator.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3
        )
        
        return {
            "success": True,
            "model": response_generator.model,
            "response": response.choices[0].message.content,
            "prompt": prompt
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__,
            "groq_available": response_generator.groq_available
        }

@router.post("/test-insights")
async def test_insights_generation(query: str = "What are our top inventory issues?") -> Dict[str, Any]:
    """Test insights generation with detailed logging"""
    try:
        data_context = {
            "inventory": [
                {"product": "Item A", "stock": 5, "threshold": 10},
                {"product": "Item B", "stock": 50, "threshold": 20}
            ],
            "orders": [{"status": "pending", "count": 3}]
        }
        
        print(f"\n=== Testing Insights Generation ===")
        print(f"Query: {query}")
        print(f"Groq Available: {response_generator.groq_available}")
        print(f"Groq Client: {response_generator.groq_client is not None}")
        
        # Generate insights
        result = response_generator.generate_detailed_insights_response(query, data_context)
        
        print(f"Result AI Priority: {result.get('ai_priority')}")
        print(f"Result Analysis Depth: {result.get('analysis_depth')}")
        print(f"Has Detailed Insights: {bool(result.get('detailed_insights'))}")
        
        return {
            "success": True,
            "query": query,
            "result": result,
            "debug": {
                "groq_available": response_generator.groq_available,
                "groq_client_exists": response_generator.groq_client is not None,
                "ai_priority": result.get("ai_priority")
            }
        }
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc()
        }

@router.get("/env-check")
async def check_environment() -> Dict[str, Any]:
    """Check environment variables"""
    groq_key = os.getenv("GROQ_API_KEY", "NOT SET")
    return {
        "groq_api_key_exists": groq_key != "NOT SET",
        "groq_api_key_length": len(groq_key) if groq_key != "NOT SET" else 0,
        "groq_api_key_prefix": (groq_key[:10] + "***") if groq_key != "NOT SET" else "NOT SET"
    }

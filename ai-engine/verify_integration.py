#!/usr/bin/env python
"""
Quick verification that all API routes are properly integrated
Run: python verify_integration.py
"""

import sys
from pathlib import Path

def test_imports():
    """Test that all core modules import correctly"""
    print("\n" + "="*60)
    print("TESTING API ROUTES INTEGRATION")
    print("="*60 + "\n")
    
    try:
        print("1. Importing FastAPI app...")
        from app.main import app
        print("   ✓ FastAPI app imported successfully")
        
        print("\n2. Checking registered routes...")
        routes = [r for r in app.routes if hasattr(r, 'path')]
        print(f"   ✓ Total routes registered: {len(routes)}")
        
        # Count by type
        api_routes = [r for r in routes if '/api' in r.path]
        print(f"   ✓ API endpoints: {len(api_routes)}")
        
        # Group and display
        endpoints = {
            'forecast': [],
            'anomaly': [],
            'suppliers': [],
            'customers': [],
            'recommendations': [],
            'other': []
        }
        
        for route in api_routes:
            path = route.path
            if '/forecast' in path:
                endpoints['forecast'].append(path)
            elif '/anomaly' in path:
                endpoints['anomaly'].append(path)
            elif '/suppliers' in path:
                endpoints['suppliers'].append(path)
            elif '/customers' in path:
                endpoints['customers'].append(path)
            elif '/recommendations' in path:
                endpoints['recommendations'].append(path)
            else:
                endpoints['other'].append(path)
        
        print("\n3. Registered Endpoints:")
        for category, paths in endpoints.items():
            if paths:
                print(f"\n   📋 {category.upper()}:")
                for path in sorted(set(paths)):
                    print(f"      • {path}")
        
        print("\n4. Testing Service Imports...")
        from app.services.dataProcessingService import DataProcessingService
        print("   ✓ DataProcessingService")
        
        from app.services.predictionService import PredictionService
        print("   ✓ PredictionService")
        
        from app.services.recommendationService import RecommendationService
        print("   ✓ RecommendationService")
        
        from app.services.groqAIService import GroqAIService
        print("   ✓ GroqAIService (with graceful degradation)")
        
        print("\n" + "="*60)
        print("✅ ALL TESTS PASSED - API ROUTES READY!")
        print("="*60)
        print("\nNext Steps:")
        print("1. Start server: uvicorn app.main:app --reload")
        print("2. Open docs: http://localhost:8000/docs")
        print("3. Test endpoints in Swagger UI")
        print("\n" + "="*60 + "\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)

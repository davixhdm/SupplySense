#!/usr/bin/env python
"""
Test script to validate API routes are properly integrated
"""

import sys
sys.path.insert(0, '.')

from app.main import app

print("\n" + "="*80)
print("API ROUTES INTEGRATION TEST")
print("="*80 + "\n")

# Get all routes
routes = []
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        routes.append({
            'path': route.path,
            'methods': list(route.methods) if hasattr(route, 'methods') else []
        })

print(f"✓ FastAPI app initialized successfully")
print(f"✓ Total routes registered: {len(routes)}\n")

# Group routes by prefix
forecast_routes = [r for r in routes if '/api/forecast' in r['path']]
anomaly_routes = [r for r in routes if '/api/anomaly' in r['path']]
supplier_routes = [r for r in routes if '/api/suppliers' in r['path']]
customer_routes = [r for r in routes if '/api/customers' in r['path']]
recommendation_routes = [r for r in routes if '/api/recommendations' in r['path']]
other_routes = [r for r in routes if not any(prefix in r['path'] for prefix in 
                ['/api/forecast', '/api/anomaly', '/api/suppliers', '/api/customers', '/api/recommendations'])]

print("📋 FORECAST ROUTES:")
for route in forecast_routes:
    print(f"   {', '.join(route['methods']):15} {route['path']}")

print("\n📋 ANOMALY ROUTES:")
for route in anomaly_routes:
    print(f"   {', '.join(route['methods']):15} {route['path']}")

print("\n📋 SUPPLIER ROUTES:")
for route in supplier_routes:
    print(f"   {', '.join(route['methods']):15} {route['path']}")

print("\n📋 CUSTOMER ROUTES:")
for route in customer_routes:
    print(f"   {', '.join(route['methods']):15} {route['path']}")

print("\n📋 RECOMMENDATION ROUTES:")
for route in recommendation_routes:
    print(f"   {', '.join(route['methods']):15} {route['path']}")

print("\n📋 OTHER ROUTES:")
for route in other_routes:
    if '/docs' not in route['path'] and '/openapi' not in route['path']:
        print(f"   {', '.join(route['methods']):15} {route['path']}")

# Verify all major endpoint categories are present
print("\n" + "="*80)
print("✅ API INTEGRATION VALIDATION SUMMARY")
print("="*80)

checks = {
    'Forecast endpoints': len(forecast_routes) >= 3,
    'Anomaly endpoints': len(anomaly_routes) >= 3,
    'Supplier endpoints': len(supplier_routes) >= 3,
    'Customer endpoints': len(customer_routes) >= 3,
    'Recommendation endpoints': len(recommendation_routes) >= 4,
}

all_passed = True
for check, passed in checks.items():
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status:10} {check}")
    if not passed:
        all_passed = False

print("\n" + "="*80)
if all_passed:
    print("✅ ALL API ROUTES PROPERLY INTEGRATED!")
    print("="*80)
    print("\nNext steps:")
    print("1. Run: uvicorn app.main:app --reload")
    print("2. Navigate to: http://localhost:8000/docs")
    print("3. Test endpoints using FastAPI Swagger UI")
else:
    print("⚠️  Some routes are missing or not properly configured")
    print("="*80)

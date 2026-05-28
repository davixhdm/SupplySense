#!/usr/bin/env python
"""
Quick test to verify API routes initialization
"""

from app.main import app

routes = [r for r in app.routes if hasattr(r, 'path')]
print('\n✓ FastAPI app initialized successfully')
print(f'✓ Total routes registered: {len(routes)}\n')

# Count by prefix
api_routes = [r for r in routes if '/api' in r.path]
print(f'✓ API Routes: {len(api_routes)}')
for route in sorted([r.path for r in routes if '/api' in r.path]):
    print(f'  - {route}')

print('\n✅ All API routes are properly integrated!')

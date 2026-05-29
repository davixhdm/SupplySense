#!/usr/bin/env python
"""
Test Groq API Connection
Run: python test_groq_connection.py
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_groq_connection():
    """Test connection to Groq API"""
    print("\n" + "="*60)
    print("TESTING GROQ API CONNECTION")
    print("="*60 + "\n")
    
    # Check environment variables
    print("1. Checking environment variables...")
    api_key = os.getenv("GROQ_API_KEY")
    api_url = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1")
    
    if not api_key:
        print("   ❌ GROQ_API_KEY not found in .env file")
        return False
    
    print(f"   ✓ GROQ_API_KEY found: {api_key[:20]}...***")
    print(f"   ✓ GROQ_API_URL: {api_url}")
    
    # Test import
    print("\n2. Importing Groq library...")
    try:
        from groq import Groq
        print("   ✓ Groq library imported successfully")
    except ImportError as e:
        print(f"   ❌ Failed to import Groq: {e}")
        return False
    
    # Initialize Groq client
    print("\n3. Initializing Groq client...")
    try:
        client = Groq(api_key=api_key)
        print("   ✓ Groq client initialized successfully")
    except Exception as e:
        print(f"   ❌ Failed to initialize Groq client: {e}")
        return False
    
    # Test API call
    print("\n4. Testing API call to Groq...")
    try:
        message = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": "Say 'Connection successful!' in one sentence."}
            ],
            max_tokens=50,
        )
        
        response_text = message.choices[0].message.content
        print(f"   ✓ API call successful!")
        print(f"   📝 Response: {response_text}")
        
    except Exception as e:
        print(f"   ❌ API call failed: {e}")
        return False
    
    print("\n" + "="*60)
    print("✅ GROQ CONNECTION VERIFIED SUCCESSFULLY!")
    print("="*60 + "\n")
    return True

def test_groq_ai_service():
    """Test GroqAIService initialization"""
    print("\n" + "="*60)
    print("TESTING GROQAISERVICE")
    print("="*60 + "\n")
    
    try:
        from app.services.groqAIService import GroqAIService
        print("1. Initializing GroqAIService...")
        service = GroqAIService()
        
        if service.available:
            print("   ✓ GroqAIService initialized successfully")
            print(f"   ✓ Service available: True")
            print(f"   ✓ Model: {service.model}")
            
            print("\n2. Testing enhance_forecast_insight...")
            result = service.enhance_forecast_insight(
                product_id=1,
                forecast=[100, 105, 110, 115],
                current_stock=50,
                historical_trend="increasing"
            )
            
            if result and result.get("success"):
                print("   ✓ enhance_forecast_insight successful")
                print(f"   📝 Insight: {result.get('insight', 'N/A')[:100]}...")
            else:
                print("   ⚠ enhance_forecast_insight returned empty or error")
            
            print("\n" + "="*60)
            print("✅ GROQAISERVICE WORKING!")
            print("="*60 + "\n")
            return True
        else:
            print("   ❌ GroqAIService not available")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing GroqAIService: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Test Groq connection
    groq_ok = test_groq_connection()
    
    # Test GroqAIService
    if groq_ok:
        service_ok = test_groq_ai_service()
    else:
        print("\n⚠️  Skipping GroqAIService test due to connection failure")
        service_ok = False
    
    import sys
    sys.exit(0 if (groq_ok and service_ok) else 1)

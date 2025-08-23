#!/bin/bash

echo "🧪 Testing Product Endpoints for Attributes"
echo "==========================================="

BASE_URL="http://localhost:4008/api/products"

# Test featured products
echo "1. Testing Featured Products:"
curl -sS "$BASE_URL/featured" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list) and len(data) > 0:
        first_product = data[0]
    elif data.get('data') and len(data['data']) > 0:
        first_product = data['data'][0]
    else:
        print('   ❌ No products found')
        exit()
    
    has_attributes = 'attributes' in first_product
    print(f'   ✅ Has attributes: {has_attributes}')
    if has_attributes:
        attrs = first_product['attributes']
        print(f'   📊 Attribute types: {list(attrs.keys()) if attrs else \"None\"}')
except Exception as e:
    print(f'   ❌ Error: {e}')
"

echo ""

# Test today's deals
echo "2. Testing Today's Deals:"
curl -sS "$BASE_URL/deals/today" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list) and len(data) > 0:
        first_product = data[0]
    elif data.get('data') and len(data['data']) > 0:
        first_product = data['data'][0]
    else:
        print('   ❌ No deals found')
        exit()
    
    has_attributes = 'attributes' in first_product
    print(f'   ✅ Has attributes: {has_attributes}')
    if has_attributes:
        attrs = first_product['attributes']
        print(f'   📊 Attribute types: {list(attrs.keys()) if attrs else \"None\"}')
except Exception as e:
    print(f'   ❌ Error: {e}')
"

echo ""

# Test all products
echo "3. Testing All Products:"
curl -sS "$BASE_URL" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list) and len(data) > 0:
        first_product = data[0]
    elif data.get('data') and len(data['data']) > 0:
        first_product = data['data'][0]
    else:
        print('   ❌ No products found')
        exit()
    
    has_attributes = 'attributes' in first_product
    print(f'   ✅ Has attributes: {has_attributes}')
    if has_attributes:
        attrs = first_product['attributes']
        print(f'   📊 Attribute types: {list(attrs.keys()) if attrs else \"None\"}')
except Exception as e:
    print(f'   ❌ Error: {e}')
"

echo ""

# Test specific product by ID (Toppik)
echo "4. Testing Specific Product (Toppik):"
curl -sS "$BASE_URL/3605467e-ea1c-406b-b33e-b90238c58134" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('data'):
        product = data['data']
    else:
        product = data
    
    has_attributes = 'attributes' in product
    print(f'   ✅ Has attributes: {has_attributes}')
    if has_attributes:
        attrs = product['attributes']
        print(f'   📊 Attribute types: {list(attrs.keys()) if attrs else \"None\"}')
        for attr_type, values in attrs.items():
            print(f'   🎨 {attr_type}: {[v[\"value\"] for v in values]}')
except Exception as e:
    print(f'   ❌ Error: {e}')
"

echo ""
echo "🎉 Testing complete!"

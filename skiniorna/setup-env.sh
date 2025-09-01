#!/bin/bash

# Skinior Mobile App Environment Setup Script

echo "🔧 Setting up Skinior Mobile App Environment"
echo "=============================================="

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy .env.example to .env
cp .env.example .env
echo "✅ Created .env file from template"

echo "📝 Next steps:"
echo "1. Download GoogleService-Info.plist from Google Cloud Console"
echo "2. Extract CLIENT_ID and REVERSED_CLIENT_ID from the plist file"
echo "3. Edit .env file with your actual credentials"
echo "4. For iOS: Update ios/skiniorna/Info.plist with the REVERSED_CLIENT_ID"
echo "5. Ensure your backend API supports mobile authentication"
echo ""
echo "🔗 Resources:"
echo "- Google Cloud Console: https://console.cloud.google.com/"
echo "- Apple Developer Console: https://developer.apple.com/"
echo ""
echo "🚀 Ready to run: npm start && npm run ios"

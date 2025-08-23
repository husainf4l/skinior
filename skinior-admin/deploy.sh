#!/bin/bash

# Skinior Admin Deploy Script
# This script builds the Angular app and updates the symbolic link

set -e  # Exit on any error

echo "🚀 Deploying Skinior Admin Panel..."

# Build the application
echo "📦 Building Angular application..."
npm run build -- --configuration production

# Update the symbolic link (this happens automatically since we're using a symlink)
echo "🔗 Symbolic link automatically updated!"

# Optional: Reload nginx (only if needed)
if [ "$1" = "--reload-nginx" ]; then
    echo "🔄 Reloading nginx..."
    sudo nginx -t && sudo systemctl reload nginx
fi

echo "✅ Deployment complete!"
echo "🌐 Admin panel is live at: https://admin.skinior.com"

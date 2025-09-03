#!/bin/bash

# Start Metro bundler in the background
echo "Starting Metro bundler..."
npm run start &

# Wait for Metro to initialize
sleep 5

# Build and run iOS app
echo "Building and running iOS app..."
npm run ios
npx react-native run-ios --device
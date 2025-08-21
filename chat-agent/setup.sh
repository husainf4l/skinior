#!/bin/bash
"""
Setup script for Balsan Financial AI Agent Service

This script creates a virtual environment and installs dependencies
for the standalone agent service.
"""

echo "🔧 Setting up Balsan Financial AI Agent Environment..."
echo "=" * 60

# Create virtual environment
python3 -m venv agent-venv
echo "✅ Virtual environment created"

# Activate virtual environment and install dependencies
source agent-venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Dependencies installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the agent service:"
echo "1. cd balsan-agent"
echo "2. source agent-venv/bin/activate"
echo "3. python start_agent.py"
echo ""
echo "Or simply run: ./start_agent.py"

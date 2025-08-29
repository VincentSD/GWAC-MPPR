#!/bin/bash

echo "🚀 Starting G-WAC File Management Server..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3 and try again"
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
    echo "❌ Error: pip is not installed"
    echo "Please install pip and try again"
    exit 1
fi

echo "📦 Installing Python dependencies..."
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements.txt
else
    pip install -r requirements.txt
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

echo "🌐 Starting server..."
echo "📁 Files will be saved to: $(pwd)/uploads/"
echo "🌍 Server will be available at: http://localhost:5000"
echo ""

# Start the server
$PYTHON_CMD server.py

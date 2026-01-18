"""
Hugging Face Spaces entry point for FastAPI backend.

This file is a wrapper that imports the main FastAPI app and ensures
it runs on port 7860 (required for Hugging Face Spaces).
"""

import os
import sys

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Import the FastAPI app from main.py
from src.main import app

# Export app for Hugging Face Spaces
# The Dockerfile will run: uvicorn app:app --host 0.0.0.0 --port 7860
__all__ = ['app']


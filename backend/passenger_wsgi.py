import sys, os

# Get the absolute path of the current directory
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, base_dir)

# Import your FastAPI application
from main import app as application

print("✅ FastAPI application loaded successfully!")
print(f"✅ Application loaded from: {base_dir}")
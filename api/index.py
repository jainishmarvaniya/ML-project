import sys
import os

# Ensure project root, backend, and app directories are in sys.path for Vercel
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")
app_dir = os.path.join(backend_dir, "app")

for path in [root_dir, backend_dir, app_dir]:
    if os.path.exists(path) and path not in sys.path:
        sys.path.insert(0, path)

try:
    from backend.app.main import app
except Exception as e1:
    try:
        from app.main import app
    except Exception as e2:
        from main import app

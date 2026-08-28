import sys
sys.path.insert(0, 'backend')
from app.services.model_service import model_service

res = model_service.compare_models()
for m in res:
    print(f"{m['Model_Name']}: R2={m['R2_Score']}")

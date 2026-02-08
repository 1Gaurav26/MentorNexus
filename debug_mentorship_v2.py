from backend.app.mentorship_service import get_requests_for_student, load_df
import pandas as pd
import numpy as np
import json
import math

def check_for_nans(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            check_for_nans(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check_for_nans(v, f"{path}[{i}]")
    elif isinstance(obj, float):
        if math.isnan(obj):
            print(f"FOUND NAN at {path}: {obj}")

print("Running deep NaN check...")
try:
    requests = get_requests_for_student('s-demo')
    check_for_nans(requests, "requests")
    print("Serialization check:")
    json.dumps(requests)
    print("Serialization successful.")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()

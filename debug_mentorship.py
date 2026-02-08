from backend.app.mentorship_service import get_requests_for_student
import pandas as pd
import json

try:
    print("Attempting to fetch requests for s-demo...")
    requests = get_requests_for_student('s-demo')
    print("Success!")
    print(json.dumps(requests, indent=2))
except Exception as e:
    print("Failed to fetch requests.")
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

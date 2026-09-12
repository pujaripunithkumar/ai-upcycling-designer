import sys
import os
import json
import base64
import io
from PIL import Image

backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(backend_path))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_successful_api_flow():
    print("--- Scenario 1: Successful API Analysis & Idea Selection Flow ---")
    img = Image.new("RGB", (120, 120), color=(30, 100, 200))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64_img = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

    payload = {
        "garmentType": "Winter Coat",
        "material": "Wool",
        "condition": "Excellent",
        "size": "Medium",
        "imageUrl": b64_img,
        "userPreference": "Bags & Accessories"
    }

    # Step 1: POST /api/analyze
    res_analyze = client.post("/api/analyze", json=payload)
    print("API Analyze Status:", res_analyze.status_code)
    assert res_analyze.status_code == 200
    data_analyze = res_analyze.json()

    print("Garment Type:", data_analyze["garment"]["garmentType"])
    print("Color Detected:", data_analyze["analysisData"]["color"])
    print("Usable Material:", data_analyze["analysisData"]["usableMaterial"], "%")
    print("Ideas Generated Count:", len(data_analyze["ideas"]))
    assert len(data_analyze["ideas"]) >= 3

    # Step 2: POST /api/select-idea
    selected_idea = data_analyze["ideas"][0]
    select_payload = {
        "garment": data_analyze["garment"],
        "analysisData": data_analyze["analysisData"],
        "selectedIdea": selected_idea
    }

    res_select = client.post("/api/select-idea", json=select_payload)
    print("API Select-Idea Status:", res_select.status_code)
    assert res_select.status_code == 200
    data_select = res_select.json()

    print("Target Selected Product:", data_select["transformationPlan"]["toProduct"])
    print("Feasibility Score:", data_select["feasibilityData"]["score"], "%")
    print("Guide Steps Count:", len(data_select["guideSteps"]))
    print("Waste Reduced:", data_select["finalResult"]["wasteReduced"])
    assert len(data_select["guideSteps"]) > 0
    print("[SUCCESS] Scenario 1 passed!\n")

def test_failure_handling():
    print("--- Scenario 2: Error & Empty State Handling ---")
    res = client.post("/api/nonexistent", json={})
    print("Invalid Endpoint Status:", res.status_code)
    assert res.status_code == 404
    print("[SUCCESS] Scenario 2 passed!\n")

if __name__ == "__main__":
    test_successful_api_flow()
    test_failure_handling()

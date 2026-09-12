import sys
import os
import json

# Add backend directory to sys.path
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(backend_path))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    print("GET /api/health status:", response.status_code)
    assert response.status_code == 200

def test_analyze_and_select_idea():
    payload = {
        "garmentType": "Denim Jeans",
        "material": "Denim",
        "condition": "Good",
        "size": "Large",
        "imageUrl": None,
        "userPreference": "Bags & Accessories"
    }
    # 1. Test POST /api/analyze
    res_analyze = client.post("/api/analyze", json=payload)
    print("POST /api/analyze status:", res_analyze.status_code)
    assert res_analyze.status_code == 200
    data_analyze = res_analyze.json()
    assert "garment" in data_analyze
    assert "analysisData" in data_analyze
    assert "ideas" in data_analyze
    ideas = data_analyze["ideas"]
    assert len(ideas) >= 3

    # 2. Test POST /api/select-idea
    selected_idea = ideas[0]
    select_payload = {
        "garment": data_analyze["garment"],
        "analysisData": data_analyze["analysisData"],
        "selectedIdea": selected_idea
    }

    res_select = client.post("/api/select-idea", json=select_payload)
    print("POST /api/select-idea status:", res_select.status_code)
    assert res_select.status_code == 200
    data_select = res_select.json()

    print("POST /api/select-idea JSON response keys:", list(data_select.keys()))
    assert "smartMaterialData" in data_select
    assert "environmentalImpactData" in data_select
    assert "transformationPlan" in data_select
    assert "feasibilityData" in data_select
    assert "guideSteps" in data_select
    assert "finalResult" in data_select

    smart_mat = data_select["smartMaterialData"]
    print("\n--- Smart Material Data ---")
    print("Status:", smart_mat["status"])
    print("Available vs Required:", f"{smart_mat['availableMaterial']}% vs {smart_mat['requiredMaterial']}%")
    print("Compatibility Score:", smart_mat["compatibilityScore"])
    print("Warnings:", smart_mat["warnings"])

    env_imp = data_select["environmentalImpactData"]
    print("\n--- Environmental Impact Data ---")
    print("Waste Diverted:", env_imp["wasteDiverted"])
    print("Material Utilization:", f"{env_imp['materialUtilizationPercent']}%")
    print("Circularity Score:", env_imp["circularityScore"])
    print("Life Extension:", env_imp["lifeExtensionYears"])

    print("\n[SUCCESS] Backend test with Smart Material & Environmental Impact passed!")

if __name__ == "__main__":
    test_health()
    test_analyze_and_select_idea()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

from schemas import (
    GarmentInput,
    AnalyzeGarmentResponse,
    AnalysisData,
    UpcyclingIdea,
    SelectIdeaInput,
    SelectIdeaResponse,
    TransformationPlanData,
    FeasibilityData,
    SmartMaterialData,
    EnvironmentalImpactData,
    FinalResultData
)
from services.image_analyzer import analyze_garment_image
from services.upcycling_engine import generate_upcycling_ideas, generate_selected_idea_details
from services.feasibility_calculator import (
    calculate_feasibility,
    calculate_smart_material,
    calculate_environmental_impact
)

app = FastAPI(
    title="RELOOP AI Upcycling API",
    description="Backend API for garment image analysis, 3-4 upcycling idea generation, idea selection, smart material checking, feasibility scoring, and environmental impact calculation.",
    version="2.1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local hackathon development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "RELOOP FastAPI Backend"}

@app.post("/api/analyze", response_model=AnalyzeGarmentResponse)
def analyze_garment(garment: GarmentInput):
    """
    Main endpoint for garment processing.
    Accepts garment type, material, condition, size, optional image (base64), and user preference.
    Analyzes garment attributes and returns garment analysis along with 3-4 personalized upcycling idea summaries.
    """
    try:
        # Step 1: Perform garment image & attribute analysis using Gemini AI Vision (with rule-based fallback)
        analysis_res = analyze_garment_image(
            garment_type=garment.garmentType,
            material=garment.material,
            condition=garment.condition,
            image_url=garment.imageUrl
        )

        effective_garment_type = analysis_res.get("garmentType") or garment.garmentType or "Garment"
        effective_material = analysis_res.get("material") or garment.material or "Fabric"
        effective_condition = analysis_res.get("conditionScore") or garment.condition or "Good"

        # Step 2: Generate 3-4 personalized upcycling idea summaries using Gemini AI (with rule-based fallback)
        raw_ideas = generate_upcycling_ideas(
            garment_type=effective_garment_type,
            material=effective_material,
            condition=effective_condition,
            size=garment.size or "Medium",
            usable_material=analysis_res["usableMaterial"],
            reusable_parts=analysis_res["reusableParts"],
            user_preference=garment.userPreference
        )

        ideas = [UpcyclingIdea(**idea) for idea in raw_ideas]

        # Step 3: Return analysis data and 3-4 idea summaries
        return AnalyzeGarmentResponse(
            garment=garment,
            analysisData=AnalysisData(
                color=analysis_res["color"],
                conditionScore=analysis_res["conditionScore"],
                usableMaterial=analysis_res["usableMaterial"],
                reusableParts=analysis_res["reusableParts"],
                visibleDamage=analysis_res["visibleDamage"]
            ),
            ideas=ideas
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Garment analysis error: {str(e)}")

@app.post("/api/select-idea", response_model=SelectIdeaResponse)
def select_idea(payload: SelectIdeaInput):
    """
    Endpoint for processing the user's selected upcycling idea.
    Generates detailed transformation plan, smart material calculations, environmental impact metrics, feasibility analysis, and step-by-step guide.
    """
    try:
        garment = payload.garment
        analysis_data = payload.analysisData
        selected_idea = payload.selectedIdea

        selected_dict = selected_idea.model_dump()

        # Step 1: Generate detailed transformation plan, guide steps, and final result estimates for selected idea
        details = generate_selected_idea_details(
            garment_type=garment.garmentType or "Garment",
            selected_idea=selected_dict
        )

        # Step 2: Calculate feasibility score & checklist tailored to selected idea
        feasibility_res = calculate_feasibility(
            condition=analysis_data.conditionScore or garment.condition or "Good",
            usable_material=analysis_data.usableMaterial,
            difficulty=selected_idea.difficulty,
            additional_materials=selected_idea.additionalMaterials,
            selected_idea=selected_dict
        )

        # Step 3: Calculate Smart Material Check metrics
        smart_mat_res = calculate_smart_material(
            usable_material=analysis_data.usableMaterial,
            reusable_parts=analysis_data.reusableParts,
            visible_damage=analysis_data.visibleDamage,
            selected_idea=selected_dict
        )

        # Step 4: Calculate Environmental Impact & Circularity metrics
        env_impact_res = calculate_environmental_impact(
            garment_type=garment.garmentType or "Garment",
            material=analysis_data.material if hasattr(analysis_data, "material") else (garment.material or "Fabric"),
            usable_material=analysis_data.usableMaterial,
            selected_idea=selected_dict
        )

        return SelectIdeaResponse(
            garment=garment,
            analysisData=analysis_data,
            selectedIdea=selected_idea,
            transformationPlan=TransformationPlanData(
                fromProduct=details["transformationPlan"]["fromProduct"],
                toProduct=details["transformationPlan"]["toProduct"],
                description=details["transformationPlan"]["description"],
                difficulty=details["transformationPlan"]["difficulty"],
                estimatedTime=details["transformationPlan"]["estimatedTime"],
                materialUtilization=details["transformationPlan"]["materialUtilization"],
                reusableParts=details["transformationPlan"]["reusableParts"]
            ),
            feasibilityData=FeasibilityData(
                score=feasibility_res["score"],
                checklist=feasibility_res["checklist"],
                additionalMaterials=feasibility_res["additionalMaterials"]
            ),
            smartMaterialData=SmartMaterialData(
                availableMaterial=smart_mat_res["availableMaterial"],
                requiredMaterial=smart_mat_res["requiredMaterial"],
                compatibilityScore=smart_mat_res["compatibilityScore"],
                status=smart_mat_res["status"],
                reusableParts=smart_mat_res["reusableParts"],
                additionalMaterials=smart_mat_res["additionalMaterials"],
                warnings=smart_mat_res["warnings"]
            ),
            environmentalImpactData=EnvironmentalImpactData(
                wasteDiverted=env_impact_res["wasteDiverted"],
                materialReusedPercent=env_impact_res["materialReusedPercent"],
                materialUtilizationPercent=env_impact_res["materialUtilizationPercent"],
                circularityScore=env_impact_res["circularityScore"],
                lifeExtensionYears=env_impact_res["lifeExtensionYears"],
                impactSummary=env_impact_res["impactSummary"]
            ),
            guideSteps=details["guideSteps"],
            finalResult=FinalResultData(
                originalGarment=details["finalResult"]["originalGarment"],
                newProduct=details["finalResult"]["newProduct"],
                materialReused=details["finalResult"]["materialReused"],
                wasteReduced=details["finalResult"]["wasteReduced"]
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Idea selection error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

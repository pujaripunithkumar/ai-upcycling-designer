from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
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
    FinalResultData,
)

from services.image_analyzer import analyze_garment_image
from services.upcycling_engine import (
    generate_upcycling_ideas,
    generate_selected_idea_details,
)
from services.feasibility_calculator import (
    calculate_feasibility,
    calculate_smart_material,
    calculate_environmental_impact,
)


# Create FastAPI app
app = FastAPI(
    title="RELOOP AI Upcycling API",
    description="Backend API for AI-powered garment analysis and upcycling.",
    version="2.1.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/")
def root():
    return {
        "message": "RELOOP AI Upcycling Backend is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "RELOOP FastAPI Backend"
    }


# Analyze garment
@app.post("/api/analyze", response_model=AnalyzeGarmentResponse)
def analyze_garment(garment: GarmentInput):

    try:
        # Step 1: Analyze garment
        analysis_res = analyze_garment_image(
            garment_type=garment.garmentType,
            material=garment.material,
            condition=garment.condition,
            image_url=garment.imageUrl,
        )

        # Use AI result or fallback to user input
        effective_garment_type = (
            analysis_res.get("garmentType")
            or garment.garmentType
            or "Garment"
        )

        effective_material = (
            analysis_res.get("material")
            or garment.material
            or "Fabric"
        )

        effective_condition = (
            analysis_res.get("conditionScore")
            or garment.condition
            or "Good"
        )

        # Step 2: Generate upcycling ideas
        raw_ideas = generate_upcycling_ideas(
            garment_type=effective_garment_type,
            material=effective_material,
            condition=effective_condition,
            size=garment.size or "Medium",
            usable_material=analysis_res.get("usableMaterial", "Unknown"),
            reusable_parts=analysis_res.get("reusableParts", []),
            user_preference=garment.userPreference,
        )

        # Convert ideas to schema objects
        ideas = [
            UpcyclingIdea(**idea)
            for idea in raw_ideas
        ]

        # Step 3: Return response
        return AnalyzeGarmentResponse(
            garment=garment,

            analysisData=AnalysisData(
                color=analysis_res.get("color", "Unknown"),
                conditionScore=analysis_res.get(
                    "conditionScore",
                    garment.condition or "Good"
                ),
                usableMaterial=analysis_res.get(
                    "usableMaterial",
                    "Unknown"
                ),
                reusableParts=analysis_res.get(
                    "reusableParts",
                    []
                ),
                visibleDamage=analysis_res.get(
                    "visibleDamage",
                    "No major damage detected"
                ),
            ),

            ideas=ideas,
        )

    except Exception as e:

        print("ANALYZE ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Garment analysis error: {str(e)}",
        )


# Select upcycling idea
@app.post("/api/select-idea", response_model=SelectIdeaResponse)
def select_idea(payload: SelectIdeaInput):

    try:

        garment = payload.garment
        analysis_data = payload.analysisData
        selected_idea = payload.selectedIdea

        selected_dict = selected_idea.model_dump()

        # Step 1: Generate transformation details
        details = generate_selected_idea_details(
            garment_type=garment.garmentType or "Garment",
            selected_idea=selected_dict,
        )

        # Step 2: Calculate feasibility
        feasibility_res = calculate_feasibility(
            condition=(
                analysis_data.conditionScore
                or garment.condition
                or "Good"
            ),
            usable_material=analysis_data.usableMaterial,
            difficulty=selected_idea.difficulty,
            additional_materials=selected_idea.additionalMaterials,
            selected_idea=selected_dict,
        )

        # Step 3: Smart material calculation
        smart_mat_res = calculate_smart_material(
            usable_material=analysis_data.usableMaterial,
            reusable_parts=analysis_data.reusableParts,
            visible_damage=analysis_data.visibleDamage,
            selected_idea=selected_dict,
        )

        # Step 4: Environmental impact
        env_impact_res = calculate_environmental_impact(
            garment_type=garment.garmentType or "Garment",
            material=(
                garment.material
                or "Fabric"
            ),
            usable_material=analysis_data.usableMaterial,
            selected_idea=selected_dict,
        )

        # Return complete result
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
                reusableParts=details["transformationPlan"]["reusableParts"],
            ),

            feasibilityData=FeasibilityData(
                score=feasibility_res["score"],
                checklist=feasibility_res["checklist"],
                additionalMaterials=feasibility_res["additionalMaterials"],
            ),

            smartMaterialData=SmartMaterialData(
                availableMaterial=smart_mat_res["availableMaterial"],
                requiredMaterial=smart_mat_res["requiredMaterial"],
                compatibilityScore=smart_mat_res["compatibilityScore"],
                status=smart_mat_res["status"],
                reusableParts=smart_mat_res["reusableParts"],
                additionalMaterials=smart_mat_res["additionalMaterials"],
                warnings=smart_mat_res["warnings"],
            ),

            environmentalImpactData=EnvironmentalImpactData(
                wasteDiverted=env_impact_res["wasteDiverted"],
                materialReusedPercent=env_impact_res["materialReusedPercent"],
                materialUtilizationPercent=env_impact_res[
                    "materialUtilizationPercent"
                ],
                circularityScore=env_impact_res["circularityScore"],
                lifeExtensionYears=env_impact_res["lifeExtensionYears"],
                impactSummary=env_impact_res["impactSummary"],
            ),

            guideSteps=details["guideSteps"],

            finalResult=FinalResultData(
                originalGarment=details["finalResult"]["originalGarment"],
                newProduct=details["finalResult"]["newProduct"],
                materialReused=details["finalResult"]["materialReused"],
                wasteReduced=details["finalResult"]["wasteReduced"],
            ),
        )

    except Exception as e:

        print("SELECT IDEA ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Idea selection error: {str(e)}",
        )


# Local development
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
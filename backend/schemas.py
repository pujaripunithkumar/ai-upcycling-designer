from pydantic import BaseModel
from typing import List, Optional

class GarmentInput(BaseModel):
    garmentType: Optional[str] = "Denim Jeans"
    material: Optional[str] = "Denim"
    condition: Optional[str] = "Good"
    size: Optional[str] = "Large"
    imageUrl: Optional[str] = None
    userPreference: Optional[str] = "Bags & Accessories"

class AnalysisData(BaseModel):
    color: str
    conditionScore: str
    usableMaterial: int
    reusableParts: List[str]
    visibleDamage: List[str]

class UpcyclingIdea(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    estimatedTime: str
    materialUtilization: int
    reusableParts: List[str]
    additionalMaterials: List[str]
    wasteReduced: str
    category: str

class AnalyzeGarmentResponse(BaseModel):
    garment: GarmentInput
    analysisData: AnalysisData
    ideas: List[UpcyclingIdea]

class SelectIdeaInput(BaseModel):
    garment: GarmentInput
    analysisData: AnalysisData
    selectedIdea: UpcyclingIdea

class TransformationPlanData(BaseModel):
    fromProduct: str
    toProduct: str
    description: str
    difficulty: str
    estimatedTime: str
    materialUtilization: int
    reusableParts: List[str]

class FeasibilityData(BaseModel):
    score: int
    checklist: List[str]
    additionalMaterials: List[str]

class SmartMaterialData(BaseModel):
    availableMaterial: int
    requiredMaterial: int
    compatibilityScore: int
    status: str
    reusableParts: List[str]
    additionalMaterials: List[str]
    warnings: List[str]

class EnvironmentalImpactData(BaseModel):
    wasteDiverted: str
    materialReusedPercent: int
    materialUtilizationPercent: int
    circularityScore: int
    lifeExtensionYears: str
    impactSummary: str

class FinalResultData(BaseModel):
    originalGarment: str
    newProduct: str
    materialReused: int
    wasteReduced: str

class SelectIdeaResponse(BaseModel):
    garment: GarmentInput
    analysisData: AnalysisData
    selectedIdea: UpcyclingIdea
    transformationPlan: TransformationPlanData
    feasibilityData: FeasibilityData
    smartMaterialData: SmartMaterialData
    environmentalImpactData: EnvironmentalImpactData
    guideSteps: List[str]
    finalResult: FinalResultData
